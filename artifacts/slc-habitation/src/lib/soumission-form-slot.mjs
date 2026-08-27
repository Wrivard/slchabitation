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

/* Grille Webflow à deux colonnes : le texte de contact à gauche, le formulaire
   d'origine à droite. La section React reprend les deux colonnes, donc c'est
   toute la grille qui est retirée. */
/* Grille héritée à remplacer. Le repérage tolère les deux formes de guillemets
   et compare la liste de classes pour ne pas confondre `contact6_content` avec
   ses variantes (`contact6_content-left`). */
const LEGACY_GRID_CLASS = 'contact6_content';
const DIV_WITH_CLASS = /<div\b[^>]*\bclass=(?:"([^"]*)"|'([^']*)')[^>]*>/gi;

function findLegacyGridAnchors(html) {
  return [...html.matchAll(DIV_WITH_CLASS)].filter((match) =>
    (match[1] ?? match[2] ?? '').split(/\s+/).includes(LEGACY_GRID_CLASS),
  );
}

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
  const anchors = findLegacyGridAnchors(html);
  if (anchors.length !== 1) {
    throw new Error(
      `La grille du formulaire de /soumission doit apparaître une seule fois (${anchors.length} trouvée(s)).`,
    );
  }

  const start = anchors[0].index;
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

const staticBudgets = [
  '25 000 $ et moins',
  '25 000 $ – 50 000 $',
  '50 000 $ – 100 000 $',
  '100 000 $ et plus',
];

const staticContactItems = [
  { label: '(514) 404-8494', href: 'tel:5144048494' },
  { label: 'slchabitation@gmail.com', href: 'mailto:slchabitation@gmail.com' },
  { label: 'Saint-Eustache, QC', href: null },
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
export const soumissionFormStaticMarkup = `<div class="soumission-quote-form" id="${SOUMISSION_FORM_SLOT_ID}">
  <div class="mb-10 max-w-3xl md:mb-12">
    <p class="text-sm font-semibold uppercase tracking-wider text-primary">Soumission en ligne</p>
    <h2 class="mt-3 font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">Parlons de votre projet</h2>
    <p class="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">Dites-nous ce que vous voulez rénover à Laval ou dans les Laurentides. Nous vous répondons sous 48 heures. La visite et l’estimation sont sans frais.</p>
  </div>

  <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
  <div class="order-1 lg:order-2 lg:col-span-6 xl:col-span-7">
  <div class="rounded-lg border border-border bg-white p-6 shadow-[0_24px_60px_-40px_rgb(0_0_0_/_0.45)] sm:p-8 md:p-10">
    <div class="mb-8">
      <div class="flex items-baseline justify-between gap-4">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-primary">Étape 1 sur ${staticSteps.length}</p>
        <p class="text-xs font-medium text-muted-foreground">Encore ${staticSteps.length - 1} étapes</p>
      </div>
      <div class="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div class="h-full w-full flex-1 bg-primary" style="transform:translateX(-66.6667%)"></div>
      </div>
      <ol class="mt-3 grid grid-cols-3 gap-2">
        ${staticSteps
          .map(
            ({ number, label }) =>
              `<li class="text-xs font-semibold ${
                number === 1 ? 'text-foreground' : 'text-muted-foreground'
              }${number === 2 ? ' text-center' : ''}${number === 3 ? ' text-right' : ''}">${label}</li>`,
          )
          .join('\n        ')}
      </ol>
    </div>

    <div>
      <div class="mb-8">
        <h3 class="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">Quel est votre projet ?</h3>
        <p class="text-muted-foreground">Aidez-nous à comprendre vos besoins initiaux.</p>
      </div>

      <div class="space-y-8">
        <div class="space-y-2">
          <span class="block text-xs font-bold uppercase leading-none tracking-[0.12em] text-foreground">Type de travaux <span class="text-destructive">*</span></span>
          <span class="flex h-12 w-full items-center justify-between rounded-md border border-input bg-white px-4 text-base text-muted-foreground">Sélectionnez un service<span class="block h-4 w-4 opacity-50" aria-hidden="true"></span></span>
        </div>

        <div class="space-y-2">
          <span class="block text-xs font-bold uppercase leading-none tracking-[0.12em] text-foreground">Budget approximatif <span class="text-destructive">*</span></span>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            ${staticBudgets
              .map(
                (budget) => `<span class="flex items-center gap-3 rounded-md border border-border bg-white p-4 text-base font-medium leading-none">
              <span class="h-5 w-5 shrink-0 rounded-full border border-muted-foreground/50"></span>
              <span class="text-foreground">${budget}</span>
            </span>`,
              )
              .join('\n            ')}
          </div>
        </div>

        <span class="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-md border border-primary-border bg-primary px-8 text-base font-bold text-primary-foreground">Continuer</span>
      </div>
    </div>
  </div>
  </div>

  <div class="order-2 space-y-6 lg:sticky lg:top-24 lg:order-1 lg:col-span-6 xl:col-span-5">
  <ul class="grid grid-cols-2 gap-3">
    ${staticTrustItems
      .map(
        ({ title, text }) => `<li class="flex flex-col gap-1 rounded-md border border-border/70 bg-white p-4">
      ${staticIconSlot}
      <p class="text-sm font-semibold leading-snug text-foreground">${title}</p>
      <p class="text-xs text-muted-foreground">${text}</p>
    </li>`,
      )
      .join('\n    ')}
  </ul>

  <figure class="border border-border bg-muted p-5">
    <div class="mb-2 flex gap-0.5 text-primary" aria-hidden="true">
      ${'<span class="block h-4 w-4"></span>'.repeat(5)}
    </div>
    <blockquote class="text-base leading-relaxed text-foreground">« Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement! »</blockquote>
    <figcaption class="mt-2 text-sm text-muted-foreground">Isabelle Baril — Avis Google</figcaption>
  </figure>

  <div class="border border-border bg-muted p-5">
    <p class="text-sm text-muted-foreground">Vous préférez en parler de vive voix?</p>
    <ul class="mt-3 space-y-2">
      ${staticContactItems
        .map(
          ({ label, href }) => `<li class="flex items-center gap-2 text-base font-semibold text-foreground">
        ${staticIconSlot}
        ${href ? `<a href="${href}" class="hover:text-primary">${label}</a>` : `<span>${label}</span>`}
      </li>`,
        )
        .join('\n      ')}
    </ul>
  </div>

  <p class="text-sm text-muted-foreground">Vos renseignements servent uniquement à préparer votre soumission. Ils ne sont ni vendus ni transmis à un tiers. <a href="/politique-de-confidentialite" class="underline hover:text-primary">Politique de confidentialité</a>.</p>
  </div>
  </div>
</div>`;
