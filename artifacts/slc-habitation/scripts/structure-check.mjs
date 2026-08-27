import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { prerenderedFileFor, readParityRoutes } from './lib/parity-targets.mjs';
import { isAutomaticImagePreload, nonLazyImageSources } from './lib/react-image-preloads.mjs';

/**
 * Empreinte structurelle des documents prérendus.
 *
 * Une page peut sembler identique à l'œil tout en ayant perdu une classe ou un
 * attribut dont dépend la feuille de style héritée de Webflow. Ce contrôle
 * enregistre l'arbre des éléments (balise, identifiant, classes, attributs
 * significatifs, empreinte du texte) sous forme de texte : la moindre dérive
 * apparaît alors comme une différence lisible, ligne par ligne.
 */

const root = path.resolve(import.meta.dirname, '..');
const baselineDir = path.join(root, 'structure-baseline');
const reportDir = path.join(root, 'dist', 'structure-report');

const args = process.argv.slice(2);
const isUpdate = args.includes('--update');
const distOverride = args.find((arg) => arg.startsWith('--dist='))?.slice('--dist='.length);
const outputDir = distOverride ? path.resolve(distOverride) : path.join(root, 'dist', 'public');

/* Attributs qui pilotent la mise en forme, le comportement ou l'accessibilité.
   Les autres (identifiants générés, jetons de cache) sont ignorés. */
const trackedAttributes = [
  'id',
  'href',
  'src',
  'srcset',
  'sizes',
  'alt',
  'type',
  'name',
  'value',
  'role',
  'style',
  'loading',
  'width',
  'height',
  'target',
  'rel',
  'colspan',
  'rowspan',
];

function shortHash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

/* React réécrit les styles en ligne sans espace après les deux-points ni
   point-virgule final. La déclaration reste la même : elle est ramenée à une
   écriture unique des deux côtés. */
function normalizeStyle(value) {
  return value
    .replace(/\s*([:;])\s*/g, '$1')
    .replace(/;$/, '');
}

/* Le nom des fichiers construits contient une empreinte qui change à chaque
   modification du code. Elle n'a rien de structurel : on la neutralise pour ne
   pas signaler dix-huit pages « modifiées » à chaque construction. */
function normalizeBuildHashes(value) {
  return value.replace(/\/assets\/([A-Za-z0-9_-]+?)-[A-Za-z0-9_-]{8,}\.(js|css)/g, '/assets/$1-*.$2');
}

function describeAttributes(node) {
  const parts = [];

  for (const attribute of trackedAttributes) {
    const value = node.getAttribute(attribute);
    if (value === undefined || value === null) continue;
    const cleaned = attribute === 'style' ? normalizeStyle(value) : value;
    const normalized = normalizeBuildHashes(normalizeWhitespace(cleaned));
    parts.push(`${attribute}=${normalized.length > 120 ? `#${shortHash(normalized)}` : normalized}`);
  }

  for (const [name, value] of Object.entries(node.attributes)) {
    if (!name.startsWith('data-') && !name.startsWith('aria-')) continue;
    const normalized = normalizeWhitespace(String(value ?? ''));
    parts.push(`${name}=${normalized.length > 120 ? `#${shortHash(normalized)}` : normalized}`);
  }

  return parts.sort();
}

/* Le texte est comparé tel qu'il s'affiche : React écrit « &#x27; » là où
   l'export Webflow écrivait l'apostrophe, ce qui donne le même caractère à
   l'écran. */
function directText(node) {
  const text = node.childNodes
    .filter((child) => child.nodeType === 3)
    .map((child) => child.text)
    .join(' ');
  return normalizeWhitespace(text);
}

function walk(node, depth, lines, automaticPreloads) {
  /* Les préchargements ajoutés par React n'existent pas dans l'export d'origine
     et n'affichent rien : ils fausseraient la comparaison. */
  if (automaticPreloads.has(node)) return;

  const classes = normalizeWhitespace(node.getAttribute('class') || '')
    .split(' ')
    .filter(Boolean)
    .sort();

  const descriptor = [
    `${'  '.repeat(depth)}${node.rawTagName}`,
    classes.length > 0 ? `.${classes.join('.')}` : '',
  ].join('');

  const attributes = describeAttributes(node);
  const text = directText(node);
  const suffix = [
    attributes.length > 0 ? ` [${attributes.join(' ')}]` : '',
    text ? ` « ${text.length > 90 ? `${text.slice(0, 90)}…${shortHash(text)}` : text} »` : '',
  ].join('');

  lines.push(`${descriptor}${suffix}`);

  for (const child of node.childNodes) {
    if (child.nodeType === 1) {
      walk(child, depth + 1, lines, automaticPreloads);
    }
  }
}

function signatureFor(html) {
  const document = parse(html, {
    lowerCaseTagName: false,
    comment: false,
    blockTextElements: { script: true, style: true },
  });

  const lines = [];
  const head = document.querySelector('head');
  const body = document.querySelector('body');

  const imageSources = nonLazyImageSources(document);
  const automaticPreloads = new Set(
    document
      .querySelectorAll('link')
      .filter((link) => isAutomaticImagePreload(link, imageSources)),
  );

  if (head) walk(head, 0, lines, automaticPreloads);
  if (body) walk(body, 0, lines, automaticPreloads);

  return `${lines.join('\n')}\n`;
}

function baselineName(routePath) {
  const slug = routePath === '/' ? 'accueil' : routePath.slice(1).replaceAll('/', '__');
  return `${slug}.txt`;
}

function firstDifference(expected, actual) {
  const expectedLines = expected.split('\n');
  const actualLines = actual.split('\n');
  const length = Math.max(expectedLines.length, actualLines.length);

  for (let index = 0; index < length; index += 1) {
    if (expectedLines[index] !== actualLines[index]) {
      return [
        `ligne ${index + 1}`,
        `  référence : ${expectedLines[index] ?? '(absente)'}`,
        `  actuelle  : ${actualLines[index] ?? '(absente)'}`,
      ].join('\n');
    }
  }

  return 'différence de fin de fichier';
}

async function main() {
  const routes = await readParityRoutes(root);

  await mkdir(isUpdate ? baselineDir : reportDir, { recursive: true });
  if (!isUpdate) {
    await rm(reportDir, { recursive: true, force: true });
    await mkdir(reportDir, { recursive: true });
  }

  const failures = [];
  let checked = 0;

  for (const routePath of routes) {
    const file = prerenderedFileFor(outputDir, routePath);
    const html = await readFile(file, 'utf8').catch(() => null);
    if (html === null) {
      failures.push({ route: routePath, detail: `document prérendu manquant : ${path.relative(root, file)}` });
      continue;
    }

    const signature = signatureFor(html);
    const name = baselineName(routePath);

    if (isUpdate) {
      await writeFile(path.join(baselineDir, name), signature);
      checked += 1;
      continue;
    }

    const expected = await readFile(path.join(baselineDir, name), 'utf8').catch(() => null);
    if (expected === null) {
      failures.push({ route: routePath, detail: 'aucune empreinte de référence enregistrée' });
      await writeFile(path.join(reportDir, name), signature);
      continue;
    }

    checked += 1;
    if (expected !== signature) {
      await writeFile(path.join(reportDir, name), signature);
      failures.push({ route: routePath, detail: firstDifference(expected, signature) });
    }
  }

  if (isUpdate) {
    console.log(`${checked} empreintes enregistrées dans ${path.relative(root, baselineDir)}.`);
    return;
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} page(s) dont la structure a changé :`);
    for (const failure of failures) {
      console.error(`  ✗ ${failure.route}\n${failure.detail}`);
    }
    console.error(`\nEmpreintes produites : ${path.relative(root, reportDir)}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Structure inchangée sur ${checked} pages prérendues.`);
}

await main();
