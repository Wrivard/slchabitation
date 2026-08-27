/**
 * Découpe de la page /soumission héritée de Webflow.
 *
 * Le formulaire d'origine (une seule page, envoyé par un script inline) est
 * retiré du balisage, puis remplacé :
 *  - par un point de montage vide côté React, rempli par `SoumissionQuoteForm`;
 *  - par une copie statique de la première étape côté prérendu, pour que la
 *    page servie avant l'hydratation montre déjà le formulaire.
 *
 * Les deux consommateurs partagent ce module pour que la découpe ne puisse pas
 * diverger entre la page React et la page statique.
 */

export const SOUMISSION_FORM_SLOT_ID = 'soumission-form-slot';

/* Bloc Webflow qui contient le formulaire et ses messages de succès/erreur. */
const FORM_BLOCK_ANCHOR = '<div class="contact6_form-block w-form">';

/* Scripts inline de la page d'origine : la gestion des photos et l'envoi du
   formulaire. Ils n'ont plus de formulaire à piloter une fois le bloc retiré. */
const LEGACY_SCRIPT_MARKERS = ['window.selectedFiles', "getElementById('wf-form-Contact-6-Form')"];

/**
 * Renvoie l'index de fin (exclu) du `<div>` ouvert à `startIndex`.
 */
function findBlockEnd(html, startIndex) {
  const tagPattern = /<(\/?)div\b[^>]*>/gi;
  tagPattern.lastIndex = startIndex;

  let depth = 0;
  let match;
  while ((match = tagPattern.exec(html)) !== null) {
    depth += match[1] === '/' ? -1 : 1;
    if (depth === 0) {
      return match.index + match[0].length;
    }
  }

  throw new Error('Le bloc du formulaire de /soumission n’est jamais refermé.');
}

/**
 * Retire les scripts inline qui pilotaient l'ancien formulaire.
 */
export function removeLegacyFormScripts(html) {
  let removed = 0;
  const cleaned = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (script) => {
    if (LEGACY_SCRIPT_MARKERS.some((marker) => script.includes(marker))) {
      removed += 1;
      return '';
    }
    return script;
  });

  if (removed !== LEGACY_SCRIPT_MARKERS.length) {
    throw new Error(
      `Scripts hérités du formulaire de /soumission introuvables (${removed} retiré(s) sur ${LEGACY_SCRIPT_MARKERS.length}).`,
    );
  }

  return cleaned;
}

/**
 * Remplace le bloc du formulaire hérité par le balisage fourni.
 */
export function replaceLegacyFormBlock(html, replacementHtml) {
  const start = html.indexOf(FORM_BLOCK_ANCHOR);
  if (start === -1) {
    throw new Error('Le bloc du formulaire de /soumission est introuvable.');
  }

  const end = findBlockEnd(html, start);
  return `${html.slice(0, start)}${replacementHtml}${html.slice(end)}`;
}

/**
 * Applique les deux opérations d'un coup.
 */
export function prepareSoumissionMarkup(html, replacementHtml) {
  return replaceLegacyFormBlock(removeLegacyFormScripts(html), replacementHtml);
}

/** Point de montage utilisé par la page React. */
export const soumissionFormSlotMarkup = `<div id="${SOUMISSION_FORM_SLOT_ID}"></div>`;

/* Emplacement d'icône : la version statique garde la place occupée par les
   pictogrammes rendus par React, sans embarquer leur tracé. */
const staticIconSlot = '<span class="block h-5 w-5" aria-hidden="true"></span>';

const staticTrustItems = [
  { title: 'Réponse sous 48 h', text: 'Du lundi au vendredi' },
  { title: 'Estimation sans frais', text: 'Visite comprise' },
  { title: '19 avis Google', text: 'Tous 5 étoiles' },
  { title: 'Licence RBQ', text: '8351-9033-59' },
];

const staticServices = [
  'Rénovation de cuisine',
  'Rénovation de salle de bain',
  'Rénovation de sous-sol',
  'Travaux extérieurs',
  'Agrandissement',
  'Construction neuve',
  'Construction de garage',
  'Projet commercial',
  'Projet industriel',
];

const staticBudgets = [
  '25 000 $ et moins',
  '25 000 $ – 50 000 $',
  '50 000 $ – 100 000 $',
  '100 000 $ et plus',
];

const staticSteps = [
  { number: 1, label: 'Projet' },
  { number: 2, label: 'Détails' },
  { number: 3, label: 'Coordonnées' },
];

/**
 * Copie statique de la section formulaire : mêmes repères de confiance et même
 * première étape que `SoumissionQuoteForm`, pour que la page prérendue affiche
 * le formulaire avant que React ne prenne le relais.
 *
 * À garder aligné sur `src/components/site/SoumissionQuoteForm.tsx`.
 */
export const soumissionFormStaticMarkup = `<div class="soumission-quote-form space-y-6" id="${SOUMISSION_FORM_SLOT_ID}">
  <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4">
    ${staticTrustItems
      .map(
        ({ title, text }) => `<li class="flex flex-col gap-1 border border-border/60 bg-white p-4">
      ${staticIconSlot}
      <p class="text-sm font-semibold leading-snug text-foreground">${title}</p>
      <p class="text-xs text-muted-foreground">${text}</p>
    </li>`,
      )
      .join('\n    ')}
  </ul>

  <div class="border border-border bg-white p-6 sm:p-8">
    <div class="mb-10 relative">
      <div class="flex justify-between mb-2 relative z-10">
        ${staticSteps
          .map(
            ({ number, label }) => `<div class="flex flex-col items-center gap-2">
          <span class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            number === 1
              ? 'bg-primary border-primary text-primary-foreground'
              : 'bg-white border-border text-muted-foreground'
          }">${number}</span>
          <span class="text-xs font-semibold ${number === 1 ? 'text-foreground' : 'text-muted-foreground'}">${label}</span>
        </div>`,
          )
          .join('\n        ')}
      </div>
      <div class="absolute top-5 left-5 right-5 h-0.5 bg-border -z-0"></div>
    </div>

    <div class="space-y-6">
      <div class="mb-8">
        <h3 class="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">Quel est votre projet ?</h3>
        <p class="text-muted-foreground">Aidez-nous à comprendre vos besoins initiaux.</p>
      </div>

      <div class="space-y-8">
        <div class="space-y-3">
          <label for="service" class="block text-sm font-bold text-foreground uppercase tracking-wider">Type de travaux <span class="text-destructive">*</span></label>
          <select id="service" name="service" class="w-full p-4 rounded-none border border-input bg-accent/5 text-lg">
            <option value="">Sélectionnez un service</option>
            ${staticServices.map((service) => `<option value="">${service}</option>`).join('\n            ')}
          </select>
        </div>

        <div class="space-y-4">
          <label class="block text-sm font-bold text-foreground uppercase tracking-wider">Budget approximatif <span class="text-destructive">*</span></label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${staticBudgets
              .map(
                (budget) => `<span class="border border-border rounded-none p-4 flex items-center gap-3">
              <span class="w-4 h-4 rounded-full border border-muted-foreground/40 shrink-0"></span>
              <span class="font-medium text-foreground">${budget}</span>
            </span>`,
              )
              .join('\n            ')}
          </div>
        </div>

        <span class="w-full bg-primary text-primary-foreground font-bold py-4 rounded-none flex items-center justify-center gap-2 mt-8 text-lg">Continuer</span>
      </div>
    </div>
  </div>

  <figure class="border border-border bg-muted p-5">
    <blockquote class="text-base leading-relaxed text-foreground">« Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement! »</blockquote>
    <figcaption class="mt-2 text-sm text-muted-foreground">Isabelle Baril — Avis Google</figcaption>
  </figure>

  <div class="border border-border bg-muted p-5">
    <p class="text-sm text-muted-foreground">Vous préférez en parler de vive voix?</p>
    <a href="tel:5144048494" class="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary">(514) 404-8494</a>
  </div>

  <p class="text-sm text-muted-foreground">Vos renseignements servent uniquement à préparer votre soumission. Ils ne sont ni vendus ni transmis à un tiers. <a href="/politique-de-confidentialite" class="underline hover:text-primary">Politique de confidentialité</a>.</p>
</div>`;
