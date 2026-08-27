import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'node-html-parser';
import { createServer } from 'vite';

import { diffHtml } from './lib/dom-canonical.mjs';
import { legacyPages, legacyPageFor } from './lib/legacy-pages.mjs';
import { parseOptions } from './lib/legacy-source.mjs';
import { isAutomaticImagePreload, nonLazyImageSources } from './lib/react-image-preloads.mjs';
import { legacyReferenceBody } from './lib/legacy-transforms.mjs';

/**
 * Contrôle de conformité d'une page convertie.
 *
 * Une page réécrite en React doit produire exactement le même document que le
 * balisage hérité dont elle provient. Ce script rend le composant de page avec
 * React, le compare au balisage de référence nœud par nœud, et refuse le
 * moindre écart : c'est le garde-fou qui autorise à réécrire des pages de
 * plusieurs milliers d'éléments sans déplacer quoi que ce soit à l'écran.
 *
 * Seul le composant de page est rendu, sans l'application autour : ce qui est
 * comparé est bien la page, pas les préchargements ni les fournisseurs de
 * contexte que l'application ajoute par ailleurs.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Les pages converties gardent l'enveloppe `<div>` qui portait le bloc de HTML
 * injecté : elle n'existe pas dans le balisage hérité, on la retire donc avant
 * de comparer.
 */
/**
 * React remonte les balises `<link>` en tête du rendu, puis dans l'entête du
 * document au moment de l'hydratation. Ces balises n'affichent rien : leur
 * position ne peut pas être comparée, mais leur liste doit rester identique.
 *
 * React ajoute par ailleurs, de lui-même, un préchargement pour chaque image
 * qui n'est pas différée (`loading="lazy"`) : ces balises-là n'ont pas
 * d'équivalent dans le balisage hérité et ne changent rien à l'affichage,
 * elles sont donc écartées tant qu'elles désignent bien une image de la page.
 */
function extractHoistedLinks(html) {
  const fragment = parse(html, parseOptions);
  const eagerImages = nonLazyImageSources(fragment);

  const links = [];
  for (const link of fragment.querySelectorAll('link')) {
    const automatic = isAutomaticImagePreload(link, eagerImages);
    const attributes = Object.fromEntries(
      Object.entries(link.attributes ?? {}).map(([name, value]) => [
        name.toLowerCase(),
        (value ?? '').replace(/\s+/g, ' ').trim(),
      ]),
    );
    link.remove();

    if (automatic) continue;

    links.push(
      Object.entries(attributes)
        .map(([name, value]) => `${name}=${value}`)
        .sort()
        .join('|'),
    );
  }

  return { html: fragment.toString(), links: links.sort() };
}

function unwrapContainer(html) {
  const fragment = parse(html, parseOptions);
  const elements = fragment.childNodes.filter((node) => node.nodeType === 1);
  if (elements.length === 1 && elements[0].rawTagName === 'div' && !elements[0].rawAttrs.trim()) {
    return elements[0].innerHTML;
  }
  return html;
}

async function main() {
  const requested = process.argv.slice(2).filter((argument) => !argument.startsWith('-'));
  const pages = requested.length
    ? requested.map((argument) => {
        const page = legacyPageFor(argument);
        if (!page) throw new Error(`Page héritée inconnue : ${argument}`);
        return page;
      })
    : legacyPages;

  const server = await createServer({
    configFile: path.join(root, 'vite.config.ssr.ts'),
    root,
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
    logLevel: 'warn',
  });

  let failures = 0;
  try {
    const { renderPage } = await server.ssrLoadModule('/scripts/lib/render-page.tsx');

    for (const page of pages) {
      const { html: referenceBody } = await legacyReferenceBody(root, page);
      const rendered = await renderPage(`/src/pages/${page.component}`, page.route);

      /* Les balises remontées par React précèdent l'enveloppe de la page :
         elles sont retirées avant de la dégager. */
      const expectedSide = extractHoistedLinks(referenceBody);
      const withoutLinks = extractHoistedLinks(rendered);
      const actualSide = { links: withoutLinks.links, html: unwrapContainer(withoutLinks.html) };

      if (expectedSide.links.join('\n') !== actualSide.links.join('\n')) {
        failures += 1;
        console.log(`✗ ${page.route} — les balises <link> diffèrent`);
        for (const link of expectedSide.links.filter((entry) => !actualSide.links.includes(entry))) {
          console.log(`    − ${link}`);
        }
        for (const link of actualSide.links.filter((entry) => !expectedSide.links.includes(entry))) {
          console.log(`    + ${link}`);
        }
        continue;
      }

      /* Les scripts de données de la visionneuse Webflow font partie du
         balisage : ils sont comparés comme le reste. */
      const diff = diffHtml(expectedSide.html, actualSide.html, { ignoreTags: [], limit: 15 });
      if (diff.total === 0) {
        console.log(`✓ ${page.route} — rendu identique au balisage hérité (${diff.expectedLength} nœuds)`);
        continue;
      }

      failures += 1;
      console.log(
        `✗ ${page.route} — ${diff.total} écart(s) ; ${diff.expectedLength} nœuds attendus, ${diff.actualLength} rendus`,
      );
      for (const difference of diff.differences) {
        console.log(`\n  · ${difference.context}`);
        for (const line of difference.expected) console.log(`    − ${line}`);
        for (const line of difference.actual) console.log(`    + ${line}`);
      }
    }
  } finally {
    await server.close();
  }

  if (failures > 0) {
    console.error(`\n${failures} page(s) ne correspondent pas encore au balisage hérité.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
