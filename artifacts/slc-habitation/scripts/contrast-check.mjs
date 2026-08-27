import { access, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
import { readParityRoutes } from './lib/parity-targets.mjs';
import { startStaticServer } from './lib/static-server.mjs';
import { blockedHostPatterns, chromiumLaunchArgs, resolveChromiumPath } from './lib/chromium.mjs';

/**
 * Refuse un texte illisible sur son fond.
 *
 * La conversion du site Webflow en React a remplacé des couleurs héritées par
 * des règles réécrites à la main : un titre pouvait se retrouver en presque
 * noir sur une photo sombre sans qu'aucune vérification ne s'en aperçoive, la
 * comparaison d'images se contentant de constater « l'écart est déjà accepté ».
 *
 * Le fond est mesuré, pas déduit : la page est photographiée une seconde fois
 * avec tous les textes rendus transparents, ce qui donne exactement les pixels
 * situés derrière chaque ligne de texte — photo, dégradé, voile semi-opaque
 * compris. Le contraste est calculé ligne par ligne (au sens typographique)
 * puis résumé par sa médiane, pour qu'un pixel clair isolé dans une photo
 * sombre ne masque pas le problème et n'en invente pas non plus.
 *
 * Options : `--dist=<dossier>`, `--routes=/a,/b`, `--report` (journal complet).
 */

const root = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const distOverride = args.find((arg) => arg.startsWith('--dist='))?.slice('--dist='.length);
const outputDir = distOverride ? path.resolve(distOverride) : path.join(root, 'dist', 'public');
const routeFilter = args.find((arg) => arg.startsWith('--routes='))?.slice('--routes='.length);
const wantsReport = args.includes('--report');
const reportPath = path.join(root, 'dist', 'contrast-report.json');

/** Largeurs vérifiées : téléphone et ordinateur suffisent à révéler les deux mises en page. */
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

/** Seuils d'accessibilité (WCAG AA) : plus indulgents pour les grands textes. */
const smallTextRatio = 4.5;
const largeTextRatio = 3;

function isLargeText(fontSize, fontWeight) {
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
}

function channelLuminance(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]) {
  return (
    0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
  );
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function composite(foreground, alpha, background) {
  return foreground.map((value, index) => Math.round(value * alpha + background[index] * (1 - alpha)));
}

function parseColor(value) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  const [r, g, b] = parts;
  const alpha = parts.length > 3 ? parts[3] : 1;
  return { rgb: [r, g, b], alpha };
}

/**
 * Écarts déjà examinés : choix de couleur du site d'origine que la conversion
 * n'a pas introduits. Chaque entrée porte sa raison ; toute nouvelle occurrence
 * fait échouer la vérification.
 */
async function readAccepted() {
  const accepted = await readFile(path.join(root, 'contrast-accepted.json'), 'utf8')
    .then(JSON.parse)
    .catch(() => null);
  if (!accepted) return new Map();
  return new Map(Object.entries(accepted.entries ?? {}));
}

/**
 * Clé d'exception : la paire de couleurs, pas l'élément.
 *
 * Les manquements déjà présents sur le site d'origine tiennent tous à un choix
 * de charte (l'orange de la marque sur blanc, le blanc sur l'orange, les
 * mentions grises du pied de page). Les nommer par leur paire de couleurs,
 * plutôt que par le texte ou la liste de classes, évite qu'une correction de
 * texte ou un ajustement de style ne fasse échouer la vérification pour rien,
 * tout en refusant toujours une paire nouvelle — un titre sombre sur une photo,
 * par exemple.
 */
function pairKeyOf(color, background) {
  const bucket = background.map((value) => Math.min(255, Math.round(value / 32) * 32));
  return `${color} sur rgb(${bucket.join(', ')})`;
}

/** Repère de lecture : élément et début du texte concerné. */
function describe(item) {
  const classes = item.classNames.split(/\s+/).filter(Boolean).sort().slice(0, 4).join('.');
  return `${item.tag}${classes ? `.${classes}` : ''} « ${item.text} »`;
}

async function settlePage(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let offset = 0; offset < document.body.scrollHeight; offset += step) {
      window.scrollTo(0, offset);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 3000);
            }),
        ),
    );

    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(400);
}

/** Relève chaque ligne de texte visible, sa couleur et sa position dans le document. */
function collectTextLines() {
  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue?.replace(/\s+/g, ' ').trim();
    if (!text) continue;

    const element = node.parentElement;
    if (!element) continue;
    if (element.closest('svg, script, style, noscript, [aria-hidden="true"]')) continue;

    const style = window.getComputedStyle(element);
    if (style.visibility === 'hidden' || style.display === 'none') continue;

    /* Un bloc peut être masqué par un parent (animation d'apparition, panneau
       replié) : sa couleur n'est alors visible par personne. */
    let opacity = 1;
    for (let node2 = element; node2 && node2 !== document.body; node2 = node2.parentElement) {
      const parentStyle = window.getComputedStyle(node2);
      opacity *= Number.parseFloat(parentStyle.opacity || '1');
      if (parentStyle.visibility === 'hidden' || parentStyle.display === 'none') {
        opacity = 0;
        break;
      }
    }
    if (opacity < 0.95) continue;

    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects()).filter(
      (rect) => rect.width > 3 && rect.height > 3,
    );
    if (rects.length === 0) continue;

    results.push({
      tag: element.tagName.toLowerCase(),
      classNames: typeof element.className === 'string' ? element.className : '',
      text: text.slice(0, 60),
      color: style.color,
      fontSize: Number.parseFloat(style.fontSize),
      fontWeight: Number(style.fontWeight) || 400,
      rects: rects.map((rect) => ({
        x: rect.x + scrollX,
        y: rect.y + scrollY,
        width: rect.width,
        height: rect.height,
      })),
    });
  }

  return results;
}

/**
 * Couleurs du fond réellement peintes derrière une ligne de texte.
 *
 * Les bords de la boîte contiennent l'anticrénelage des lettres voisines et le
 * dépassement des ascendantes : on rogne légèrement, et on échantillonne au
 * plus quelques centaines de points, suffisants pour une médiane stable.
 */
function samplesBehind(png, rect, scale) {
  const left = Math.max(0, Math.round((rect.x + 1) * scale));
  const top = Math.max(0, Math.round((rect.y + rect.height * 0.15) * scale));
  const right = Math.min(png.width - 1, Math.round((rect.x + rect.width - 1) * scale));
  const bottom = Math.min(png.height - 1, Math.round((rect.y + rect.height * 0.85) * scale));
  if (right <= left || bottom <= top) return [];

  const stepX = Math.max(1, Math.round((right - left) / 24));
  const stepY = Math.max(1, Math.round((bottom - top) / 6));
  const samples = [];

  for (let y = top; y <= bottom; y += stepY) {
    for (let x = left; x <= right; x += stepX) {
      const index = (png.width * y + x) << 2;
      samples.push([png.data[index], png.data[index + 1], png.data[index + 2]]);
    }
  }

  return samples;
}

/**
 * Contraste médian, et le fond qui lui correspond.
 *
 * Sur une photo, le contraste varie d'un pixel à l'autre : la médiane décrit ce
 * que le visiteur perçoit réellement, et le fond associé sert à nommer la paire
 * de couleurs dans le rapport comme dans la liste d'exceptions.
 */
function medianMeasure(measures) {
  if (measures.length === 0) return null;
  const sorted = [...measures].sort((a, b) => a.ratio - b.ratio);
  return sorted[Math.floor(sorted.length / 2)];
}

async function main() {
  const allRoutes = await readParityRoutes(root);
  const routes = routeFilter
    ? allRoutes.filter((route) => routeFilter.split(',').map((value) => value.trim()).includes(route))
    : allRoutes;
  if (routes.length === 0) throw new Error('Aucune route à vérifier.');

  /* Sans cette garde, un dossier vide ou une construction absente ferait
     mesurer la page « 404 » du serveur de fichiers — lisible, donc verte. */
  try {
    await access(path.join(outputDir, 'index.html'));
  } catch {
    const relatif = path.relative(root, outputDir);
    const affichage = relatif && !relatif.startsWith('..') ? relatif : outputDir;
    throw new Error(`Aucun site construit dans ${affichage} : lancez d'abord « pnpm run build ».`);
  }

  const accepted = await readAccepted();
  const acceptedSeen = new Set();
  const server = await startStaticServer(outputDir);
  const browser = await chromium.launch({
    executablePath: resolveChromiumPath(),
    args: chromiumLaunchArgs,
  });

  const scale = 0.5;
  const failures = [];
  const everything = [];
  let inspected = 0;

  try {
    for (const routePath of routes) {
      for (const viewport of viewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: scale,
          reducedMotion: 'reduce',
          locale: 'fr-CA',
          timezoneId: 'America/Toronto',
        });
        await context.route('**/*', (route) => {
          const url = route.request().url();
          if (blockedHostPatterns.some((pattern) => url.includes(pattern))) return route.abort();
          return route.continue();
        });

        const page = await context.newPage();
        try {
          const response = await page.goto(`${server.origin}${routePath}`, {
            waitUntil: 'load',
            timeout: 60_000,
          });
          if (!response || !response.ok()) {
            throw new Error(
              `${routePath} répond ${response ? response.status() : 'rien'} : la page n'a pas été construite, il n'y a rien à mesurer.`,
            );
          }
          await settlePage(page);

          const items = await page.evaluate(collectTextLines);
          if (items.length === 0) {
            throw new Error(`${routePath} (${viewport.name}) n'affiche aucun texte : page vide ou rendu cassé.`);
          }

          /* Seconde photo, textes rendus transparents : ce qui reste est
             exactement le fond peint sous chaque ligne. */
          await page.addStyleTag({
            content: `*, *::before, *::after {
              color: transparent !important;
              -webkit-text-fill-color: transparent !important;
              text-shadow: none !important;
              text-decoration-color: transparent !important;
            }`,
          });
          await page.waitForTimeout(250);
          const buffer = await page.screenshot({ fullPage: true, animations: 'disabled' });
          const png = PNG.sync.read(buffer);

          for (const item of items) {
            const parsed = parseColor(item.color);
            if (!parsed || parsed.alpha === 0) continue;

            const measures = [];
            for (const rect of item.rects) {
              for (const background of samplesBehind(png, rect, scale)) {
                const foreground = composite(parsed.rgb, parsed.alpha, background);
                measures.push({ ratio: contrastRatio(foreground, background), background });
              }
            }
            const measure = medianMeasure(measures);
            if (!measure) continue;

            inspected += 1;
            const required = isLargeText(item.fontSize, item.fontWeight)
              ? largeTextRatio
              : smallTextRatio;
            const pairKey = pairKeyOf(item.color, measure.background);
            const entry = {
              route: routePath,
              viewport: viewport.name,
              element: describe(item),
              pairKey,
              ratio: Number(measure.ratio.toFixed(2)),
              required,
              fontSize: item.fontSize,
            };
            everything.push(entry);

            if (measure.ratio >= required) continue;
            if (accepted.has(pairKey)) {
              acceptedSeen.add(pairKey);
              continue;
            }
            failures.push(entry);
          }
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }

  if (wantsReport) {
    await mkdir(path.dirname(reportPath), { recursive: true });
    everything.sort((a, b) => a.ratio - b.ratio);
    await writeFile(reportPath, JSON.stringify(everything, null, 2));
    console.log(`Relevé complet : ${path.relative(root, reportPath)} (${everything.length} lignes).`);
  }

  const obsolete = [...accepted.keys()].filter((signature) => !acceptedSeen.has(signature));
  if (obsolete.length > 0 && !routeFilter) {
    console.log(`\n${obsolete.length} exception(s) sans objet à retirer de contrast-accepted.json :`);
    for (const signature of obsolete) console.log(`  • ${signature}`);
  }

  if (failures.length > 0) {
    /* La même paire de couleurs revient sur plusieurs pages et plusieurs
       largeurs : l'affichage la regroupe pour rester lisible, en gardant
       quelques exemples de textes concernés. */
    const grouped = new Map();
    for (const failure of failures) {
      const existing = grouped.get(failure.pairKey) ?? {
        ...failure,
        places: new Set(),
        elements: new Set(),
      };
      existing.ratio = Math.min(existing.ratio, failure.ratio);
      existing.places.add(`${failure.route} (${failure.viewport})`);
      existing.elements.add(failure.element);
      grouped.set(failure.pairKey, existing);
    }

    console.error(`\n${grouped.size} paire(s) de couleurs illisible(s) sur ${inspected} mesures :`);
    for (const entry of grouped.values()) {
      const places = [...entry.places];
      const elements = [...entry.elements];
      console.error(
        `  ✗ ${entry.pairKey}\n` +
          `      contraste ${entry.ratio} pour ${entry.required} exigé\n` +
          `      ${elements.slice(0, 3).join(' / ')}${elements.length > 3 ? ` (+${elements.length - 3})` : ''}\n` +
          `      ${places.slice(0, 4).join(', ')}${places.length > 4 ? `, +${places.length - 4}` : ''}`,
      );
    }
    console.error(
      '\nUne paire volontaire, héritée de la charte du site, se déclare dans contrast-accepted.json avec sa raison.',
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Aucun texte illisible sur ${inspected} mesures (${routes.length} pages).`);
}

await main();
