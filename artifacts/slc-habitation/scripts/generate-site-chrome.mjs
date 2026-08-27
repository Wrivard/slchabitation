import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readSiteChrome } from './lib/site-chrome.mjs';

/**
 * Recopie la navbar et le pied de page du gabarit legacy dans un module
 * TypeScript consommable par le bundle React. Lancé avant chaque build ; le
 * fichier produit est versionné pour que `pnpm dev` fonctionne sans étape
 * préalable.
 */

const root = path.resolve(import.meta.dirname, '..');
const outputPath = path.join(root, 'src', 'generated', 'site-chrome.ts');

const { headerHtml, footerHtml } = await readSiteChrome(root);

const contents = `// Fichier généré par scripts/generate-site-chrome.mjs — ne pas modifier à la main.
// Source : site/index.html (navbar et pied de page du site principal).

export const siteHeaderHtml = ${JSON.stringify(headerHtml)};

export const siteFooterHtml = ${JSON.stringify(footerHtml)};
`;

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, contents);

console.log(
  `Navbar et pied de page extraits de site/index.html (${headerHtml.length + footerHtml.length} caractères).`,
);
