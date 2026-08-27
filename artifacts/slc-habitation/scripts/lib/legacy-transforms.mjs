import { parse } from 'node-html-parser';

import {
  applyPageSemantics,
  enhanceAccessibility,
  getPageSemantics,
} from '../../src/lib/publicPageSemantics.mjs';
import { normalizePublicLinks } from '../../src/lib/normalize-public-links.mjs';
import {
  prepareSoumissionMarkup,
  soumissionFormSlotMarkup,
} from '../../src/lib/soumission-form-slot.mjs';
import { readLegacyBody, parseOptions } from './legacy-source.mjs';

/**
 * Balisage de référence d'une page héritée.
 *
 * Jusqu'ici, chaque page appliquait ces corrections à l'exécution, sur une
 * copie du HTML exporté par Webflow : textes de remplacement des images,
 * images WebP, hiérarchie des titres, adresses sans extension, attributs
 * d'accessibilité. La conversion en React les applique une fois pour toutes,
 * au moment de produire le code.
 *
 * Le convertisseur et le contrôle de conformité partent tous les deux d'ici :
 * ce qui est comparé est donc bien la fidélité du composant React au balisage
 * de référence, la justesse des corrections elles-mêmes restant vérifiée par
 * le contrôle de parité avec le site en ligne.
 */

/* Scripts que la page React n'exécute plus depuis son balisage : le moteur
   Webflow est chargé par un hook, les comportements ont un équivalent React,
   et le reste n'a plus d'objet. Les données JSON de la visionneuse Webflow,
   elles, sont lues dans la page et doivent y rester. */
function pruneScripts(html) {
  const fragment = parse(html, parseOptions);
  const removed = [];

  for (const script of fragment.querySelectorAll('script')) {
    if (script.getAttribute('type') === 'application/json') continue;
    const source = script.getAttribute('src');
    removed.push(source ?? `code en ligne (${(script.rawText ?? '').trim().length} caractères)`);
    script.remove();
  }

  return { html: fragment.toString(), removed };
}

/* Contour de focus au clavier, ajouté à la page d'accueil lors d'une passe
   d'accessibilité précédente. Il ne figure pas dans l'export Webflow : la
   page le posait elle-même, en tête de son balisage. */
const keyboardFocusStyles = `
  a[href]:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  summary:focus-visible,
  [contenteditable="true"]:focus-visible,
  *[tabindex]:focus-visible,
  .w-tab-link:focus-visible,
  .w-nav-link:focus-visible,
  .w-nav-brand:focus-visible,
  .w-dropdown-btn:focus-visible,
  .w-dropdown-toggle:focus-visible,
  .w-slider-dot:focus-visible,
  .w-slider-arrow-left:focus-visible,
  .w-slider-arrow-right:focus-visible,
  .w-dropdown-link:focus-visible,
  .w-nav-button:focus-visible {
    outline: 0.125rem solid #4d65ff;
    outline-offset: 0.125rem;
  }
`;

const pagesWithKeyboardFocusStyles = new Set(['index.html']);

export async function legacyReferenceBody(root, page) {
  const raw = await readLegacyBody(root, page.file);
  const semantic = applyPageSemantics(raw, getPageSemantics(page.file));
  let markup = enhanceAccessibility(normalizePublicLinks(semantic));

  /* Le formulaire d'origine de /soumission a déjà été remplacé par un
     formulaire React : la page garde son emplacement vide, rempli au montage. */
  if (page.file === 'soumission.html') {
    markup = prepareSoumissionMarkup(markup, soumissionFormSlotMarkup);
  }

  if (pagesWithKeyboardFocusStyles.has(page.file)) {
    markup = `<style>${keyboardFocusStyles}</style>${markup}`;
  }

  const { html, removed } = pruneScripts(markup);
  return { html, removedScripts: removed };
}
