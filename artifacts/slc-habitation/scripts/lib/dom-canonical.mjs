import { parse } from 'node-html-parser';
import { parseOptions } from './legacy-source.mjs';

/**
 * Forme canonique d'un fragment HTML, pour comparer deux rendus.
 *
 * La conversion d'une page héritée en composants React doit produire
 * exactement le même document. Comparer les chaînes HTML brutes est inutile
 * (indentation, ordre des attributs, guillemets), alors que comparer les
 * arbres normalisés dit précisément ce qui a changé et à quel endroit.
 */

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

/* Attributs dont la valeur n'a pas de signification d'espacement. */
const WHITESPACE_INSENSITIVE = new Set(['class', 'srcset', 'sizes', 'style', 'd', 'viewbox']);

function normalizeAttributeValue(name, value) {
  if (value == null) return '';
  let normalized = value.replace(/\s+/g, ' ').trim();
  if (name === 'style') {
    normalized = normalized
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => declaration.replace(/\s*:\s*/, ':'))
      .join(';');
  }
  if (name === 'class') {
    normalized = normalized.split(' ').filter(Boolean).join(' ');
  }
  if (!WHITESPACE_INSENSITIVE.has(name)) {
    normalized = value.trim();
  }
  return normalized;
}

/**
 * Aplatit un fragment en une liste d'entrées comparables.
 * `ignoreAttributes` sert aux attributs que React ne peut pas reproduire à
 * l'identique et dont l'absence est sans effet (aucun aujourd'hui).
 */
export function canonicalEntries(html, { ignoreTags = ['script'], ignoreAttributes = [] } = {}) {
  const document = parse(html, parseOptions);
  const ignoredTags = new Set(ignoreTags);
  const ignoredAttributes = new Set(ignoreAttributes);
  const entries = [];

  const walk = (node, path) => {
    for (const child of node.childNodes) {
      // nodeType 1 = élément, 3 = texte, 8 = commentaire
      if (child.nodeType === 8) continue;
      if (child.nodeType === 3) {
        const raw = child.rawText ?? '';
        const text = decodeEntities(raw).replace(/\s+/g, ' ');
        if (!text.trim()) {
          if (text.length) entries.push({ path, kind: 'ws' });
          continue;
        }
        entries.push({ path, kind: 'text', value: text });
        continue;
      }
      const tag = (child.rawTagName || '').toLowerCase();
      if (ignoredTags.has(tag)) continue;
      const childPath = `${path}/${tag}`;
      const attributes = Object.entries(child.attributes ?? {})
        .filter(([name]) => !ignoredAttributes.has(name.toLowerCase()))
        .map(([name, value]) => [name.toLowerCase(), normalizeAttributeValue(name.toLowerCase(), value)])
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      entries.push({
        path: childPath,
        kind: 'element',
        tag,
        attributes: attributes.map(([name, value]) => `${name}=${value}`).join('|'),
      });
      if (tag === 'style' || tag === 'textarea') {
        const text = (child.rawText ?? '').replace(/\s+/g, ' ').trim();
        if (text) entries.push({ path: `${childPath}/#text`, kind: 'text', value: text });
        continue;
      }
      if (!VOID_TAGS.has(tag)) walk(child, childPath);
      entries.push({ path: childPath, kind: 'close', tag });
    }
  };

  walk(document, '');
  return entries;
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&#x27;/g, "'");
}

function describe(entry) {
  if (!entry) return '(rien)';
  if (entry.kind === 'text') return `texte « ${entry.value.slice(0, 120)} »`;
  if (entry.kind === 'ws') return 'espace';
  if (entry.kind === 'close') return `</${entry.tag}>`;
  return `<${entry.tag} ${entry.attributes}>`.slice(0, 400);
}

/**
 * Compare deux fragments et retourne les différences regroupées.
 *
 * Le rapprochement se fait par plus longue sous-séquence commune : une
 * insertion ou une suppression n'entraîne donc pas une cascade de fausses
 * différences sur tout le reste de la page.
 */
export function diffHtml(expected, actual, options = {}) {
  const left = canonicalEntries(expected, options);
  const right = canonicalEntries(actual, options);
  const script = diffSequences(left.map(serialize), right.map(serialize));
  const limit = options.limit ?? 12;
  const differences = [];

  for (const block of script) {
    if (differences.length >= limit) break;
    differences.push({
      index: block.leftStart,
      context: (left[block.leftStart] ?? right[block.rightStart] ?? left[block.leftStart - 1])?.path ?? '',
      expected: left.slice(block.leftStart, block.leftStart + block.leftCount).map(describe),
      actual: right.slice(block.rightStart, block.rightStart + block.rightCount).map(describe),
    });
  }

  return {
    differences,
    total: script.length,
    expectedLength: left.length,
    actualLength: right.length,
  };
}

/** Blocs (suppression, insertion) transformant `a` en `b`. */
function diffSequences(a, b) {
  const n = a.length;
  const m = b.length;
  // Préfixe et suffixe communs : la matrice ne porte que sur le milieu.
  let start = 0;
  while (start < n && start < m && a[start] === b[start]) start += 1;
  let endA = n;
  let endB = m;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }

  const rows = endA - start;
  const cols = endB - start;
  if (rows === 0 && cols === 0) return [];
  if (rows === 0 || cols === 0) {
    return [{ leftStart: start, leftCount: rows, rightStart: start, rightCount: cols }];
  }

  const lengths = new Int32Array((rows + 1) * (cols + 1));
  const at = (i, j) => i * (cols + 1) + j;
  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      lengths[at(i, j)] =
        a[start + i] === b[start + j]
          ? lengths[at(i + 1, j + 1)] + 1
          : Math.max(lengths[at(i + 1, j)], lengths[at(i, j + 1)]);
    }
  }

  const blocks = [];
  let i = 0;
  let j = 0;
  let pending = null;
  const flush = () => {
    if (pending) blocks.push(pending);
    pending = null;
  };
  while (i < rows && j < cols) {
    if (a[start + i] === b[start + j]) {
      flush();
      i += 1;
      j += 1;
      continue;
    }
    pending ??= { leftStart: start + i, leftCount: 0, rightStart: start + j, rightCount: 0 };
    if (lengths[at(i + 1, j)] >= lengths[at(i, j + 1)]) {
      pending.leftCount += 1;
      i += 1;
    } else {
      pending.rightCount += 1;
      j += 1;
    }
  }
  if (i < rows || j < cols) {
    pending ??= { leftStart: start + i, leftCount: 0, rightStart: start + j, rightCount: 0 };
    pending.leftCount += rows - i;
    pending.rightCount += cols - j;
  }
  flush();
  return blocks;
}

function serialize(entry) {
  if (!entry) return '∅';
  if (entry.kind === 'text') return `t:${entry.path}:${entry.value}`;
  if (entry.kind === 'ws') return `w:${entry.path}`;
  if (entry.kind === 'close') return `c:${entry.path}`;
  return `e:${entry.path}:${entry.attributes}`;
}

function resync(left, right, index, window = 40) {
  for (let count = 1; count <= window; count += 1) {
    if (serialize(left[index + count]) === serialize(right[index])) return { side: 'left', count };
    if (serialize(left[index]) === serialize(right[index + count])) return { side: 'right', count };
  }
  return null;
}
