/**
 * app/api/funnel/lead/route.ts
 *
 * Le point le plus important de tout le funnel.
 *
 * La conversion Google Ads part d'ICI, après validation — jamais du
 * `onSubmit` du client. Un bot qui passe l'interface déclenche autrement une
 * conversion, et le Smart Bidding se met alors à chercher d'autres bots.
 *
 * Ordre des vérifications : du moins cher au plus cher.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { mergeServerAttribution } from '@/lib/funnel/attribution'

const QC_AREA_CODES = ['418', '438', '450', '468', '514', '579', '581', '819', '873']
const DISPOSABLE_DOMAINS = ['mailinator.com', 'guerrillamail.com', 'yopmail.com', '10minutemail.com']
const MIN_FILL_MS = 3_000

const LeadSchema = z.object({
  funnelSlug: z.string().min(1).max(80),
  variant: z.string().max(80).optional(),
  projectType: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  firstName: z.string().min(1).max(80),
  phone: z.string().min(10).max(20),
  email: z.string().email().max(160),
  consentContact: z.literal(true),
  consentMarketing: z.boolean().default(false),
  consentText: z.string().max(2000),
  company_website: z.string().optional(),   // honeypot
  renderedAt: z.number(),
  turnstileToken: z.string().optional(),
  attribution: z.record(z.string()).default({}),
})

export async function POST(req: NextRequest) {
  // 1. Origine
  const origin = req.headers.get('origin')
  if (origin && !origin.startsWith(process.env.NEXT_PUBLIC_SITE_URL!)) {
    return silentOk()
  }

  const body = await req.json().catch(() => null)
  if (!body) return silentOk()

  // 2. Honeypot — rejet silencieux : on répond 200 pour ne rien apprendre au bot
  if (body.company_website) return silentOk({ reason: 'honeypot' })

  // 3. Piège temporel
  if (typeof body.renderedAt === 'number' && Date.now() - body.renderedAt < MIN_FILL_MS) {
    return silentOk({ reason: 'too_fast' })
  }

  // 4. Limitation de débit (Upstash, KV Vercel, ou table Supabase)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (await isRateLimited(ip)) return silentOk({ reason: 'rate_limited' })

  // 5. Schéma
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  const lead = parsed.data

  // 6. Turnstile
  if (process.env.TURNSTILE_SECRET_KEY) {
    const valid = await verifyTurnstile(lead.turnstileToken, ip)
    if (!valid) return silentOk({ reason: 'turnstile' })
  }

  // 7-9. Qualité des données
  const digits = lead.phone.replace(/\D/g, '')
  if (digits.length !== 10) return reject('bad_phone')
  const outsideQuebec = !QC_AREA_CODES.includes(digits.slice(0, 3)) // signalé, pas bloqué

  const emailDomain = lead.email.split('@')[1]?.toLowerCase() ?? ''
  if (DISPOSABLE_DOMAINS.includes(emailDomain)) return reject('disposable_email')

  if (/https?:\/\/|\[url=/i.test(lead.firstName)) return reject('url_in_text')

  // --- Tout est passé : on enregistre ---

  const attribution = mergeServerAttribution(
    lead.attribution,
    req.url,
    req.headers.get('referer'),
  )

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // serveur uniquement, jamais exposée
  )

  const { data: row, error } = await supabase
    .from('funnel_leads')
    .insert({
      funnel_slug: lead.funnelSlug,
      variant: lead.variant,
      project_type: lead.projectType,
      timeline: lead.timeline,
      first_name: lead.firstName,
      phone: digits,
      email: lead.email.trim().toLowerCase(),
      consent_contact: lead.consentContact,
      consent_marketing: lead.consentMarketing,
      consent_at: new Date().toISOString(),
      consent_text: lead.consentText,        // preuve horodatée du texte affiché
      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,
      gad_source: attribution.gad_source,
      gad_campaignid: attribution.gad_campaignid,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      landing_page: attribution.landing_page,
      referrer: attribution.referrer,
      status: outsideQuebec ? 'new' : 'new',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[funnel] insert failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  // Notifier le client en moins de 60 secondes — SMS ET courriel.
  // C'est ici que le funnel se gagne : environ 78 % des clients achètent de
  // la première entreprise qui répond.
  await Promise.allSettled([
    notifyBySms(lead, row.id),
    notifyByEmail(lead, row.id),
    sendConfirmationToProspect(lead),
  ])

  // Conversion — après validation, jamais avant.
  const sent = await sendGoogleAdsConversion({
    conversionAction: process.env.GADS_CONVERSION_LEAD_SUBMITTED!,
    gclid: attribution.gclid,
    gbraid: attribution.gbraid,
    wbraid: attribution.wbraid,
    // Enhanced conversions : normaliser AVANT de hacher, sinon aucun
    // appariement. Rappel : ECfL ne fonctionne pas avec gbraid/wbraid.
    hashedEmail: await sha256(lead.email.trim().toLowerCase()),
    hashedPhone: await sha256(toE164(digits)),
    orderId: row.id,               // idempotence côté Google
    conversionDateTime: new Date().toISOString(),
  })

  if (sent) {
    await supabase.from('funnel_leads').update({ conversion_sent: true }).eq('id', row.id)
  }

  return NextResponse.json({ ok: true })

  /* ---------- Aides locales ---------- */

  async function reject(reason: string) {
    // Un lead rejeté n'est pas jeté : on veut pouvoir vérifier qu'on ne
    // refuse pas de vrais clients.
    await quarantine(body, reason)
    return silentOk({ reason })
  }
}

function silentOk(_meta?: { reason: string }) {
  // Répondre 200 sans rien enregistrer : le bot croit avoir réussi et
  // n'ajuste pas sa stratégie.
  return NextResponse.json({ ok: true })
}

async function sha256(value: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function toE164(tenDigits: string) {
  return `+1${tenDigits}`
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  })
  const data = await res.json()
  return data.success === true
}

/**
 * À implémenter selon le compte :
 *  - Data Manager API pour les téléversements de conversions (depuis le
 *    15 juin 2026, les imports hors ligne et ECfL y sont migrés et bloqués
 *    dans l'API Google Ads)
 *  - ou Measurement Protocol / GTM server-side selon l'architecture
 *
 * Prérequis dans le compte Google Ads : balisage automatique activé et
 * conditions relatives aux données client acceptées.
 */
declare function sendGoogleAdsConversion(input: Record<string, unknown>): Promise<boolean>
declare function isRateLimited(ip: string): Promise<boolean>
declare function quarantine(payload: unknown, reason: string): Promise<void>
declare function notifyBySms(lead: unknown, id: string): Promise<void>
declare function notifyByEmail(lead: unknown, id: string): Promise<void>
declare function sendConfirmationToProspect(lead: unknown): Promise<void>
