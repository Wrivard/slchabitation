/**
 * lib/funnel/attribution.ts
 *
 * Captation des identifiants de clic et des UTM.
 *
 * Deux règles qui expliquent tout le fichier :
 *  1. Ne pas capter uniquement `gclid`. Les parcours iOS arrivent avec
 *     `gbraid` ou `wbraid` et l'attribution disparaît silencieusement si on
 *     ne les stocke pas.
 *  2. Stocker les valeurs telles quelles — pas de trim, pas de changement de
 *     casse, pas de décodage-réencodage.
 */

export const TRACKED_PARAMS = [
  'gclid',
  'gbraid',
  'wbraid',
  'gad_source',
  'gad_campaignid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

export type TrackedParam = (typeof TRACKED_PARAMS)[number]
export type Attribution = Partial<Record<TrackedParam, string>> & {
  landing_page?: string
  referrer?: string
  captured_at?: string
}

const STORAGE_KEY = 'kua_attr'

/**
 * À appeler au premier rendu de la page funnel.
 * Premier toucher gagnant : on n'écrase pas une valeur déjà en session,
 * sauf si un nouvel identifiant de clic arrive (nouvelle visite payante).
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {}

  const url = new URL(window.location.href)
  const incoming: Attribution = {}

  for (const key of TRACKED_PARAMS) {
    const value = url.searchParams.get(key)
    if (value) incoming[key] = value
  }

  const hasNewClickId = Boolean(incoming.gclid || incoming.gbraid || incoming.wbraid)
  const existing = readAttribution()

  if (!hasNewClickId && Object.keys(existing).length > 0) {
    return existing
  }

  const attribution: Attribution = {
    ...existing,
    ...incoming,
    landing_page: url.pathname + url.search,
    referrer: document.referrer || undefined,
    captured_at: new Date().toISOString(),
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Mode privé ou stockage plein : on continue, les champs cachés du
    // formulaire prennent le relais pour la soumission en cours.
  }

  return attribution
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

/**
 * Filet de sécurité côté serveur.
 *
 * Safari (Link Tracking Protection) peut retirer des paramètres avant que le
 * JavaScript ne s'exécute. On relit donc aussi l'URL vue par le serveur, et
 * on fusionne : la valeur du client gagne si elle existe, sinon celle du
 * serveur.
 */
export function mergeServerAttribution(
  clientAttribution: Attribution,
  requestUrl: string,
  referer: string | null,
): Attribution {
  const merged: Attribution = { ...clientAttribution }

  try {
    const sources = [new URL(requestUrl)]
    if (referer) sources.push(new URL(referer))

    for (const source of sources) {
      for (const key of TRACKED_PARAMS) {
        if (merged[key]) continue
        const value = source.searchParams.get(key)
        if (value) merged[key] = value
      }
    }
  } catch {
    // URL invalide : on garde ce qu'on a.
  }

  return merged
}
