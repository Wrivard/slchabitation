/**
 * Marqueur de session posé juste après l'envoi d'une demande de soumission.
 *
 * La page `/merci` est une adresse comme une autre : sans marqueur, une visite
 * directe ou un rechargement compterait comme une conversion. Le formulaire
 * pose donc le marqueur avant de rediriger, et `/merci` le consomme (lecture
 * puis retrait) pour n'émettre l'événement qu'une seule fois.
 */

const STORAGE_KEY = 'slc_quote_submission_v1';

/* Le temps d'aller du formulaire à `/merci`. Au-delà, le marqueur vient d'un
   autre parcours et ne doit plus déclencher de conversion. */
const MARKER_TTL_MS = 10 * 60 * 1000;

export type QuoteSubmissionMarker = {
  /** Horodatage de la réponse positive du serveur. */
  submittedAt: number;
  /** Identifiant unique de l'envoi, aussi utilisé comme clé d'idempotence. */
  submissionId: string;
  /** Libellé exact du service demandé. */
  service?: string;
  /** Page publicitaire d'origine, quand elle est connue. */
  paidPage?: string;
};

function isMarker(value: unknown): value is QuoteSubmissionMarker {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<QuoteSubmissionMarker>;
  return (
    typeof candidate.submittedAt === 'number' && typeof candidate.submissionId === 'string'
  );
}

export function rememberQuoteSubmission(marker: QuoteSubmissionMarker): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(marker));
  } catch {
    /* Stockage indisponible (navigation privée, cookies bloqués) : la demande
       est envoyée quand même, seule la mesure est perdue. */
  }
}

/** Lit le marqueur et le retire : un envoi ne peut être compté qu'une fois. */
export function consumeQuoteSubmission(): QuoteSubmissionMarker | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);

    const parsed: unknown = JSON.parse(raw);
    if (!isMarker(parsed)) return null;
    if (Date.now() - parsed.submittedAt > MARKER_TTL_MS) return null;
    return parsed;
  } catch {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Rien à faire de plus. */
    }
    return null;
  }
}
