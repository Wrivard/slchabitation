/**
 * Événements Google Analytics 4 du formulaire de soumission.
 *
 * Les commandes `gtag` sont émises depuis le formulaire lui-même, une fois la
 * validation réussie, et non depuis un déclencheur de clic : une étape refusée
 * par la validation ne doit produire aucun événement.
 *
 * `gtag` est défini dans l'entête du document (index.html) et alimente la même
 * file que le conteneur Google Tag Manager. Si la fonction n'existe pas encore
 * — rendu serveur, script bloqué par un bloqueur de publicités — l'appel est
 * simplement ignoré : la mesure est perdue, jamais l'envoi du formulaire.
 */

/** Propriété de mesure GA4 qui reçoit ces événements. */
const GA4_MEASUREMENT_ID = 'G-RHG3J4XSGQ';

/** Nom du formulaire, commun à tous ses événements. */
const FORM_NAME = 'soumission';

type GtagFunction = (...args: unknown[]) => void;

function sendEvent(name: string, params: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  const { gtag } = window as unknown as { gtag?: GtagFunction };
  if (typeof gtag !== 'function') return;

  gtag('event', name, { send_to: GA4_MEASUREMENT_ID, form_name: FORM_NAME, ...params });
}

/** Nom lisible de chaque étape franchie, tel qu'il apparaîtra dans GA4. */
const stepNames: Record<number, string> = {
  1: 'projet',
  2: 'details',
};

/**
 * Une étape vient d'être validée et le visiteur passe à la suivante.
 *
 * La dernière étape n'a pas d'événement de passage : son aboutissement est
 * l'envoi de la demande, mesuré par `trackLeadGenerated`.
 */
export function trackFormStepComplete(step: number): void {
  const stepName = stepNames[step];
  if (!stepName) return;

  sendEvent('form_step_complete', { form_step: String(step), step_name: stepName });
}

/** Le serveur a confirmé l'enregistrement de la demande. */
export function trackLeadGenerated(): void {
  sendEvent('generate_lead', {});
}
