import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { htmlToJsx } from './lib/html-to-jsx.mjs';
import { legacyPageFor } from './lib/legacy-pages.mjs';
import { legacyReferenceBody } from './lib/legacy-transforms.mjs';

/**
 * Réécriture d'une page héritée en composant React.
 *
 * Les pages exportées par Webflow comptent chacune plusieurs milliers
 * d'éléments : les retranscrire à la main prendrait des jours et laisserait
 * forcément passer des différences. Ce script produit le composant
 * correspondant au balisage de référence, élément par élément. Le résultat est
 * du code source normal, destiné à être relu puis réorganisé en sections ; sa
 * fidélité est vérifiée par `scripts/legacy-conversion-check.mjs`.
 *
 *   node scripts/convert-legacy-page.mjs /politique-de-cookie
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Comportements que chaque page reprenait de ses scripts inline. */
const pageBehaviors = {
  'index.html': { faq: true, hoverCards: true },
  'a-propos.html': { faq: true },
  'renovation.html': { faq: true },
  'agrandissement-construction-neuve.html': { faq: true },
  'travaux-sur-mesure.html': { faq: true },
  'realisations.html': { faq: true, categoryFilter: true, imageFit: true },
  'soumission.html': {},
  'politique-de-cookie.html': {},
  'formulaire.html': {},
  'renovation-cuisine.html': {},
  'renovation-salle-de-bain.html': {},
  'renovation-sous-sol.html': {},
};

const behaviorImports = {
  faq: { from: '@/lib/enhanceAccessibility', name: 'enableFaqAccessibility' },
  categoryFilter: { from: '@/lib/categoryFilter', name: 'setupCategoryFilter' },
  imageFit: { from: '@/lib/behaviors/gallery-image-fit', name: 'applyGalleryImageFit' },
  hoverCards: { from: '@/lib/behaviors/hover-cards', name: 'setupHoverCards' },
};

function componentName(file) {
  return path.basename(file, '.tsx');
}

/* La page /soumission garde son emplacement de formulaire : le balisage
   hérité laisse un bloc vide, que le formulaire React remplit une fois la page
   vivante. Le prérendu y dépose entre-temps un aperçu non interactif. */
function soumissionComponent(page, jsx) {
  return `import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';

import { useLegacyWebflowEngine } from '@/lib/legacy-webflow-engine';
import { enableFaqAccessibility } from '@/lib/enhanceAccessibility';
import { SoumissionQuoteForm, soumissionServices } from '@/components/site/SoumissionQuoteForm';

/* Les pages publicitaires nomment certains services autrement : l'adresse
   qu'elles construisent est traduite vers l'identifiant du formulaire. */
const paidServiceAliases: Record<string, string> = {
  'agrandissement-maison': 'agrandissement',
};

/**
 * Service présélectionné d'après \`?service=\` : le visiteur peut toujours en
 * choisir un autre, le paramètre ne fait que préremplir l'étape 1.
 */
function readServiceParam(): string {
  if (typeof window === 'undefined') return '';
  const requested = new URLSearchParams(window.location.search).get('service') ?? '';
  const serviceId = paidServiceAliases[requested] ?? requested;
  return soumissionServices.some((service) => service.id === serviceId) ? serviceId : '';
}

/**
 * Page « ${page.route} ».
 *
 * Convertie depuis l'export Webflow (\`site/${page.file}\`) : même balisage,
 * mêmes classes, mêmes textes, écrits en composants React plutôt qu'injectés
 * comme un bloc de HTML. Seul le formulaire diffère de l'original : il a été
 * remplacé par un formulaire React en plusieurs étapes.
 */
export default function ${componentName(page.component)}() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formSlotRef = useRef<HTMLDivElement>(null);
  const [formSlot, setFormSlot] = useState<HTMLElement | null>(null);
  const [location] = useLocation();
  const defaultService = useMemo(() => readServiceParam(), [location]);

  useLegacyWebflowEngine();

  useEffect(() => {
    setFormSlot(formSlotRef.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return enableFaqAccessibility(container);
  }, []);

  return (
    <div ref={containerRef}>
${jsx}
      {formSlot
        ? createPortal(<SoumissionQuoteForm defaultService={defaultService} />, formSlot)
        : null}
    </div>
  );
}
`;
}

/**
 * Les anciennes adresses redirigent dès que l'application démarre : leur page
 * n'est jamais montée dans le navigateur, elle ne sert qu'à produire le
 * document statique servi avant la redirection. Elle n'a donc aucun
 * comportement à installer.
 */
function redirectPageComponent(page, jsx) {
  return `/**
 * Ancienne adresse « ${page.route} ».
 *
 * L'application redirige cette adresse vers la page qui l'a remplacée ; ce
 * composant ne sert qu'au document statique, servi le temps que la
 * redirection s'applique. Il reprend le balisage de l'export Webflow
 * (\`site/${page.file}\`), à l'identique.
 */
export default function ${componentName(page.component)}() {
  return (
    <>
${jsx}
    </>
  );
}
`;
}

function buildComponent(page, jsx) {
  if (page.file === 'soumission.html') return soumissionComponent(page, jsx);
  if (page.redirects) return redirectPageComponent(page, jsx);

  const behaviors = pageBehaviors[page.file] ?? {};
  const active = Object.keys(behaviors).filter((key) => behaviors[key]);
  const imports = [
    active.length ? "import { useEffect, useRef } from 'react';" : "import { useRef } from 'react';",
    '',
    "import { useLegacyWebflowEngine } from '@/lib/legacy-webflow-engine';",
    ...active.map((key) => `import { ${behaviorImports[key].name} } from '${behaviorImports[key].from}';`),
  ];

  const effects = active.map((key) => {
    const { name } = behaviorImports[key];
    return `
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return ${name}(container);
  }, []);`;
  });

  return `${imports.join('\n')}

/**
 * Page « ${page.route} ».
 *
 * Convertie depuis l'export Webflow (\`site/${page.file}\`) : même balisage,
 * mêmes classes, mêmes textes, écrits en composants React plutôt qu'injectés
 * comme un bloc de HTML.
 */
export default function ${componentName(page.component)}() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLegacyWebflowEngine();
${effects.join('\n')}

  return (
    <div ref={containerRef}>
${jsx}
    </div>
  );
}
`;
}

async function main() {
  const [target] = process.argv.slice(2);
  const page = target && legacyPageFor(target);
  if (!page) {
    console.error('Usage : node scripts/convert-legacy-page.mjs <route|fichier|composant>');
    process.exitCode = 1;
    return;
  }

  const { html, removedScripts } = await legacyReferenceBody(root, page);
  const { code, warnings } = htmlToJsx(html, {
    depth: 3,
    /* L'emplacement du formulaire de /soumission est repéré par le composant :
       c'est là qu'il monte le formulaire React. */
    substitute: (node) =>
      node.getAttribute?.('id') === 'soumission-form-slot'
        ? '<div id="soumission-form-slot" ref={formSlotRef} />'
        : null,
  });
  const output = path.join(root, 'src/pages', page.component);
  await writeFile(output, buildComponent(page, code), 'utf8');

  console.log(`${page.route} → src/pages/${page.component} (${code.split('\n').length} lignes)`);
  if (removedScripts.length) {
    console.log('  scripts retirés du balisage :');
    for (const script of removedScripts) console.log(`   · ${script}`);
  }
  for (const warning of warnings) console.log(`  ⚠ ${warning}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
