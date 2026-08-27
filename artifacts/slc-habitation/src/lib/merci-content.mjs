/**
 * Contenu de la page de remerciement `/merci`.
 *
 * Deux rendus l'utilisent : la page React (`src/pages/Merci.tsx`) et la version
 * statique produite au build (`scripts/prerender.mjs`). Le texte vit ici pour
 * que la page servie avant l'hydratation dise exactement la même chose que la
 * page affichée ensuite.
 *
 * Aucune promesse nouvelle : réponse sous 48 heures, visite et estimation sans
 * frais, coordonnées — tout est déjà annoncé ailleurs sur le site.
 */

export const merciHero = {
  kicker: 'Demande reçue',
  title: 'Merci, nous avons bien reçu votre demande',
  intro:
    'Votre projet est entre nos mains. Nous vous répondons sous 48 heures pour convenir d’une visite d’évaluation sans frais.',
  image: {
    src: '/images/relume-657406-p-1600.jpeg',
    alt: 'Sous-sol rénové par SLC Habitation, boiseries claires et éclairage encastré',
    width: 1600,
    height: 1200,
  },
};

export const merciStepsTitle = 'Ce qui se passe maintenant';

export const merciSteps = [
  {
    title: 'Nous lisons votre demande',
    text: 'Votre message et vos photos, s’il y en a, sont transmis directement à l’équipe.',
  },
  {
    title: 'Nous vous contactons',
    text: 'Réponse sous 48 heures, du lundi au vendredi, par téléphone ou par courriel.',
  },
  {
    title: 'Nous planifions la visite',
    text: 'La visite sert à chiffrer votre projet correctement. Elle est sans frais, l’estimation aussi.',
  },
];

export const merciContactTitle = 'Besoin de nous joindre avant?';

export const merciContacts = [
  {
    label: '(514) 404-8494',
    href: 'tel:5144048494',
    testId: 'link-merci-phone',
    kind: 'phone',
  },
  {
    label: 'slchabitation@gmail.com',
    href: 'mailto:slchabitation@gmail.com',
    testId: 'link-merci-email',
    kind: 'email',
  },
];

export const merciLinks = [
  { label: 'Retour à l’accueil', href: '/', testId: 'link-merci-home' },
  { label: 'Voir nos réalisations', href: '/realisations', testId: 'link-merci-projects' },
];

/** Rappel du service demandé, affiché quand l'adresse le précise. */
export function merciServiceNote(serviceLabel) {
  return `Votre demande porte sur : ${serviceLabel}.`;
}
