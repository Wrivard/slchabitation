/**
 * Suivi des appels Google Ads.
 *
 * Google remplace le numéro de téléphone affiché par un numéro de transfert,
 * ce qui lui permet de rattacher un appel téléphonique à une annonce. Ce
 * remplacement est demandé une première fois dans l'entête du document
 * (index.html) et s'applique au contenu présent au chargement.
 *
 * Deux choses le défont ensuite : React réécrit pendant l'hydratation le texte
 * que Google venait de remplacer, et une navigation interne affiche une
 * nouvelle page sans recharger le document. La commande est donc rejouée après
 * chaque changement de page, ce que Google prévoit explicitement pour les
 * applications d'une seule page.
 */

const CALL_CONVERSION_ID = 'AW-18365089753/yOTDCJnriYAdENmPlLVE';

/** Le numéro tel qu'il est écrit dans les pages ; Google le repère par cette forme. */
const DISPLAYED_PHONE_NUMBER = '(514) 404-8494';

type GtagFunction = (...args: unknown[]) => void;

export function refreshCallTracking() {
  if (typeof window === 'undefined') return;

  const { gtag } = window as unknown as { gtag?: GtagFunction };
  if (typeof gtag !== 'function') return;

  gtag('config', CALL_CONVERSION_ID, {
    phone_conversion_number: DISPLAYED_PHONE_NUMBER,
  });
}
