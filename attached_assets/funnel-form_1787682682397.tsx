'use client'

/**
 * components/funnel/FunnelForm.tsx
 *
 * Formulaire de funnel — le SEUL composant client de la page.
 *
 * Choix structurants, à ne pas défaire sans raison :
 *  - 3 étapes, aucune coordonnée avant la dernière
 *  - Boutons de choix plutôt que menus déroulants (un tap au lieu de trois)
 *  - Hauteur de conteneur réservée : sinon chaque changement d'étape produit
 *    du CLS
 *  - Honeypot + horodatage de rendu : première ligne de défense anti-bot
 *  - AUCUNE conversion déclenchée ici. Elle part du serveur, après validation.
 */

import { useEffect, useRef, useState } from 'react'
import { captureAttribution, readAttribution } from '@/lib/funnel/attribution'

type Props = {
  funnelSlug: string
  variant?: string
  /** Texte exact du consentement — il est stocké avec le lead comme preuve. */
  consentText: string
  turnstileSiteKey?: string
}

type Step1 = { projectType: string }
type Step2 = { timeline: string }
type Step3 = { firstName: string; phone: string; email: string; consentContact: boolean; consentMarketing: boolean }

const PROJECT_TYPES = [
  { value: 'complete', label: 'Rénovation complète' },
  { value: 'partielle', label: 'Armoires et comptoir' },
  { value: 'rafraichissement', label: 'Rafraîchissement' },
]

const TIMELINES = [
  { value: 'urgent', label: "D'ici 3 mois" },
  { value: 'moyen', label: 'Dans 3 à 6 mois' },
  { value: 'explore', label: "J'explore mes options" },
]

export function FunnelForm({ funnelSlug, variant, consentText, turnstileSiteKey }: Props) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<Step1 & Step2 & Step3>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const renderedAt = useRef<number>(Date.now())

  useEffect(() => {
    captureAttribution()
    trackEvent('funnel_view', { funnel_slug: funnelSlug, variant })
  }, [funnelSlug, variant])

  function choose<K extends string>(field: K, value: string, nextStep: number) {
    if (step === 1) trackEvent('form_start', { funnel_slug: funnelSlug })
    setData((d) => ({ ...d, [field]: value }))
    trackEvent('form_step_complete', { funnel_slug: funnelSlug, step })
    setStep(nextStep)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return

    const form = e.currentTarget
    const fd = new FormData(form)

    const nextErrors: Record<string, string> = {}
    if (!String(fd.get('firstName') ?? '').trim()) nextErrors.firstName = 'Entrez votre prénom.'
    if (!isValidPhone(String(fd.get('phone') ?? ''))) nextErrors.phone = 'Entrez un numéro à 10 chiffres, ex. (514) 555-0123.'
    if (!isValidEmail(String(fd.get('email') ?? ''))) nextErrors.email = 'Entrez une adresse courriel valide.'
    if (fd.get('consentContact') !== 'on') nextErrors.consentContact = 'Ce consentement est requis pour vous répondre.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/funnel/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnelSlug,
          variant,
          projectType: data.projectType,
          timeline: data.timeline,
          firstName: fd.get('firstName'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          consentContact: fd.get('consentContact') === 'on',
          consentMarketing: fd.get('consentMarketing') === 'on',
          consentText,
          // Anti-bot
          company_website: fd.get('company_website'), // honeypot
          renderedAt: renderedAt.current,
          turnstileToken: fd.get('cf-turnstile-response'),
          // Attribution
          attribution: readAttribution(),
        }),
      })

      if (!res.ok) throw new Error('submit_failed')
      trackEvent('form_submit', { funnel_slug: funnelSlug })
      window.location.href = '/pub/merci'
    } catch {
      setSubmitting(false)
      setErrors({ form: "L'envoi a échoué. Réessayez ou appelez-nous directement." })
    }
  }

  return (
    // La hauteur minimale réserve la place et évite le CLS entre les étapes.
    <div className="min-h-[420px] rounded-xl border bg-white p-5 shadow-sm">
      <ProgressBar step={step} total={3} />

      {step === 1 && (
        <Fieldset legend="Quel type de projet avez-vous en tête ?">
          {PROJECT_TYPES.map((o) => (
            <ChoiceButton key={o.value} onClick={() => choose('projectType', o.value, 2)}>
              {o.label}
            </ChoiceButton>
          ))}
        </Fieldset>
      )}

      {step === 2 && (
        <Fieldset legend="Quand aimeriez-vous commencer ?" onBack={() => setStep(1)}>
          {TIMELINES.map((o) => (
            <ChoiceButton key={o.value} onClick={() => choose('timeline', o.value, 3)}>
              {o.label}
            </ChoiceButton>
          ))}
        </Fieldset>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate>
          <BackLink onClick={() => setStep(2)} />
          <h3 className="mb-1 text-lg font-semibold">Où peut-on vous joindre ?</h3>
          <p className="mb-4 text-sm text-neutral-600">On vous revient avec votre estimation.</p>

          <Field id="firstName" label="Prénom" autoComplete="given-name" error={errors.firstName} />
          <Field id="phone" label="Téléphone" type="tel" inputMode="tel" autoComplete="tel"
                 placeholder="(514) 555-0123" error={errors.phone} onInput={formatPhoneInput} />
          <Field id="email" label="Courriel" type="email" inputMode="email" autoComplete="email" error={errors.email} />

          {/* Honeypot — hors écran, jamais display:none, nom crédible */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <label htmlFor="company_website">Site web de l'entreprise</label>
            <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <label className="mt-4 flex gap-2 text-sm">
            <input type="checkbox" name="consentContact" className="mt-1" />
            <span>{consentText}</span>
          </label>
          {errors.consentContact && <p className="mt-1 text-sm text-red-600">{errors.consentContact}</p>}

          <label className="mt-3 flex gap-2 text-sm text-neutral-600">
            <input type="checkbox" name="consentMarketing" className="mt-1" />
            <span>Je souhaite recevoir les conseils et promotions. Facultatif, désabonnement en tout temps.</span>
          </label>

          {turnstileSiteKey && (
            <div className="cf-turnstile mt-4" data-sitekey={turnstileSiteKey} data-language="fr" data-size="flexible" />
          )}

          {errors.form && <p className="mt-3 text-sm text-red-600">{errors.form}</p>}

          <button type="submit" disabled={submitting}
                  className="mt-5 w-full rounded-lg px-4 py-4 text-base font-semibold disabled:opacity-60">
            {submitting ? 'Envoi en cours…' : 'Obtenir mon estimation'}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-500">
            Sans obligation. Vos renseignements ne sont jamais vendus.
          </p>
        </form>
      )}
    </div>
  )
}

/* ---------- Utilitaires ---------- */

function isValidPhone(value: string) {
  return /^\d{10}$/.test(value.replace(/\D/g, ''))
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** Formate pendant la saisie : réduit les numéros injoignables par faute de frappe. */
function formatPhoneInput(e: React.FormEvent<HTMLInputElement>) {
  const digits = e.currentTarget.value.replace(/\D/g, '').slice(0, 10)
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean)
  e.currentTarget.value =
    parts.length === 3 ? `(${parts[0]}) ${parts[1]}-${parts[2]}`
    : parts.length === 2 ? `(${parts[0]}) ${parts[1]}`
    : parts.length === 1 ? `(${parts[0]}` : ''
}

function trackEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  ;(window as any).dataLayer = (window as any).dataLayer || []
  ;(window as any).dataLayer.push({ event: name, ...params })
}

/* Field, Fieldset, ChoiceButton, ProgressBar, BackLink :
   composants de présentation à adapter au design system du client.
   Point non négociable : l'étiquette est visible AU-DESSUS du champ,
   jamais un placeholder utilisé comme seule étiquette. */
