import { parse } from 'node-html-parser';
import { parseOptions } from './legacy-source.mjs';

/**
 * Conversion d'un fragment HTML hérité en JSX.
 *
 * Les pages exportées par Webflow font entre 40 et 110 Ko de balisage : les
 * réécrire à la main serait long et surtout impossible à garantir sans écart.
 * Ce convertisseur produit le JSX correspondant au balisage d'origine, nœud
 * pour nœud et attribut pour attribut. Le résultat est du code source normal,
 * relu et modifiable ensuite ; la fidélité, elle, est vérifiée par comparaison
 * des arbres rendus (`scripts/legacy-conversion-check.mjs`).
 */

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

/* Attributs HTML dont React attend une autre orthographe. */
const HTML_ATTRIBUTES = new Map(Object.entries({
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  allowfullscreen: 'allowFullScreen',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  charset: 'charSet',
  class: 'className',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  enctype: 'encType',
  fetchpriority: 'fetchPriority',
  for: 'htmlFor',
  formaction: 'formAction',
  formnovalidate: 'formNoValidate',
  frameborder: 'frameBorder',
  hreflang: 'hrefLang',
  'http-equiv': 'httpEquiv',
  inputmode: 'inputMode',
  itemprop: 'itemProp',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  marginheight: 'marginHeight',
  marginwidth: 'marginWidth',
  maxlength: 'maxLength',
  minlength: 'minLength',
  nomodule: 'noModule',
  novalidate: 'noValidate',
  playsinline: 'playsInline',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rowspan: 'rowSpan',
  spellcheck: 'spellCheck',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  usemap: 'useMap',
}));

/* Attributs SVG que l'analyseur HTML rétablit en casse mixte. Les écrire en
   minuscules donnerait un autre attribut, sans effet sur le rendu. */
const SVG_ATTRIBUTES = new Map(Object.entries({
  attributename: 'attributeName',
  attributetype: 'attributeType',
  basefrequency: 'baseFrequency',
  baseprofile: 'baseProfile',
  calcmode: 'calcMode',
  clippathunits: 'clipPathUnits',
  diffuseconstant: 'diffuseConstant',
  edgemode: 'edgeMode',
  filterunits: 'filterUnits',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  limitingconeangle: 'limitingConeAngle',
  markerheight: 'markerHeight',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  numoctaves: 'numOctaves',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  refx: 'refX',
  refy: 'refY',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stitchtiles: 'stitchTiles',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textlength: 'textLength',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  xchannelselector: 'xChannelSelector',
  ychannelselector: 'yChannelSelector',
  zoomandpan: 'zoomAndPan',
  'xlink:href': 'xlinkHref',
  'xlink:title': 'xlinkTitle',
  'xlink:show': 'xlinkShow',
  'xml:space': 'xmlSpace',
  'xml:lang': 'xmlLang',
  'xmlns:xlink': 'xmlnsXlink',
}));

/* Attributs présents sans valeur dans le balisage hérité. */
const BOOLEAN_ATTRIBUTES = new Set([
  'allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls',
  'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'itemscope',
  'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline',
  'readonly', 'required', 'reversed', 'selected',
]);

const SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'ellipse', 'g', 'line', 'polygon', 'polyline', 'rect',
  'defs', 'clippath', 'mask', 'pattern', 'lineargradient', 'radialgradient', 'stop',
  'text', 'tspan', 'use', 'filter', 'fegaussianblur', 'feoffset', 'feblend',
  'fecolormatrix', 'fecomposite', 'feflood', 'femerge', 'femergenode', 'symbol',
  'marker', 'foreignobject', 'title', 'desc',
]);

/* Éléments SVG dont le nom comporte une majuscule en JSX. */
const SVG_TAG_NAMES = new Map(Object.entries({
  clippath: 'clipPath',
  lineargradient: 'linearGradient',
  radialgradient: 'radialGradient',
  foreignobject: 'foreignObject',
  fegaussianblur: 'feGaussianBlur',
  feoffset: 'feOffset',
  feblend: 'feBlend',
  fecolormatrix: 'feColorMatrix',
  fecomposite: 'feComposite',
  feflood: 'feFlood',
  femerge: 'feMerge',
  femergenode: 'feMergeNode',
  textpath: 'textPath',
}));

export function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+[0-9]*);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const codePoint = entity[1] === 'x' || entity[1] === 'X'
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    const named = {
      amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
      eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', acirc: 'â', ccedil: 'ç',
      ocirc: 'ô', ugrave: 'ù', ucirc: 'û', icirc: 'î', iuml: 'ï', euml: 'ë',
      laquo: '«', raquo: '»', hellip: '…', mdash: '—', ndash: '–', rsquo: '’',
      lsquo: '‘', ldquo: '“', rdquo: '”', deg: '°', copy: '©', reg: '®',
      times: '×', middot: '·', euro: '€', trade: '™',
    }[entity.toLowerCase()];
    return named ?? match;
  });
}

/** Découpe la chaîne brute des attributs en respectant les valeurs absentes. */
function parseRawAttributes(rawAttrs) {
  const attributes = [];
  const pattern = /([^\s"'=/>]+)(\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;
  let match;
  while ((match = pattern.exec(rawAttrs ?? '')) !== null) {
    const [, name, assignment, doubleQuoted, singleQuoted, unquoted] = match;
    const value = assignment === undefined ? null : (doubleQuoted ?? singleQuoted ?? unquoted ?? '');
    attributes.push({ name, value: value === null ? null : decodeEntities(value) });
  }
  return attributes;
}

function toCamelCase(name) {
  return name.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function quote(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
}

function styleObject(value) {
  const declarations = value
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(':');
      if (separator === -1) return null;
      const property = declaration.slice(0, separator).trim();
      const propertyValue = declaration.slice(separator + 1).trim();
      const key = property.startsWith('--') ? quote(property) : toCamelCase(property.toLowerCase());
      return `${key}: ${quote(propertyValue)}`;
    })
    .filter(Boolean);
  return `{{ ${declarations.join(', ')} }}`;
}

function jsxAttributeName(name, isSvg) {
  const lower = name.toLowerCase();
  if (lower.startsWith('data-') || lower.startsWith('aria-')) return name;
  if (isSvg) {
    const mapped = SVG_ATTRIBUTES.get(lower);
    if (mapped) return mapped;
    if (HTML_ATTRIBUTES.has(lower)) return HTML_ATTRIBUTES.get(lower);
    if (lower.includes('-')) return toCamelCase(lower);
    return lower;
  }
  return HTML_ATTRIBUTES.get(lower) ?? name;
}

/* Attributs que React attend sous forme de nombre. */
const NUMERIC_ATTRIBUTES = new Set([
  'tabIndex',
  'maxLength',
  'minLength',
  'rows',
  'cols',
  'size',
  'span',
  'start',
  'colSpan',
  'rowSpan',
]);

function renderAttributes(node, { isSvg, extra = [] }) {
  const parts = [];
  const raw = parseRawAttributes(node.rawAttrs);
  const tag = (node.rawTagName || '').toLowerCase();

  for (const { name, value } of raw) {
    const lower = name.toLowerCase();
    if (lower === 'style' && value) {
      parts.push(`style=${styleObject(value)}`);
      continue;
    }
    if (value === null || (BOOLEAN_ATTRIBUTES.has(lower) && value === '')) {
      if (BOOLEAN_ATTRIBUTES.has(lower)) {
        parts.push(`${jsxAttributeName(lower, isSvg)}`);
        continue;
      }
      parts.push(`${jsxAttributeName(name, isSvg)}=""`);
      continue;
    }
    /* Un champ dont la valeur initiale vient du balisage reste non contrôlé :
       React exige alors `defaultValue`/`defaultChecked`. */
    let attributeName = jsxAttributeName(name, isSvg);
    if (lower === 'value' && (tag === 'input' || tag === 'textarea')) attributeName = 'defaultValue';
    if (lower === 'checked' && tag === 'input') attributeName = 'defaultChecked';

    /* Quelques attributs sont des nombres pour React, même s'ils s'écrivent
       comme du texte en HTML. */
    if (NUMERIC_ATTRIBUTES.has(attributeName) && /^-?\d+$/.test(value.trim())) {
      parts.push(`${attributeName}={${Number(value.trim())}}`);
      continue;
    }

    parts.push(`${attributeName}=${JSON.stringify(value)}`);
  }

  parts.push(...extra);
  return parts;
}

function escapeTemplate(text) {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const SAFE_TEXT = /^[^<>{}`\\]*$/;

/**
 * Un nœud de texte reste un seul nœud de texte.
 *
 * JSX supprime les espaces en début et en fin de ligne : un texte qui commence
 * ou finit par une espace — après un mot en gras, par exemple — est donc écrit
 * comme une chaîne, sans quoi l'espace disparaîtrait à l'affichage. Le reste
 * est écrit tel quel, pour rester lisible.
 */
function renderText(raw, indent) {
  const text = decodeEntities(raw);
  if (!text.trim()) return text.length ? `${indent}{' '}` : '';

  const collapsed = text.replace(/\s+/g, ' ');
  const hasEdgeSpace = collapsed !== collapsed.trim();
  if (!hasEdgeSpace && SAFE_TEXT.test(collapsed)) return `${indent}${collapsed}`;
  return `${indent}{${quote(collapsed)}}`;
}

/**
 * @param {string} html fragment à convertir
 * @param {object} options
 * @param {number} options.depth niveau d'indentation initial
 * @param {(node: object) => string | null} [options.substitute] remplace un
 *   sous-arbre par une expression JSX (composant partagé, emplacement React…)
 * @param {(node: object) => boolean} [options.skip] retire un sous-arbre
 */
export function htmlToJsx(html, options = {}) {
  const { depth = 0, substitute, skip } = options;
  const document = parse(html, parseOptions);
  const warnings = [];

  const renderNode = (node, level, isSvgContext) => {
    const indent = '  '.repeat(level);
    if (node.nodeType === 8) return '';
    if (node.nodeType === 3) return renderText(node.rawText ?? '', indent);

    const tag = (node.rawTagName || '').toLowerCase();
    if (skip?.(node)) return '';
    const replacement = substitute?.(node);
    if (replacement) {
      return replacement
        .split('\n')
        .map((line) => (line ? `${indent}${line}` : line))
        .join('\n');
    }

    const isSvg = isSvgContext || tag === 'svg';
    const jsxTag = isSvg ? (SVG_TAG_NAMES.get(tag) ?? tag) : tag;

    if (tag === 'style' || tag === 'noscript' || (tag === 'script' && node.getAttribute('type') === 'application/json')) {
      /* Contenu inerte à reproduire tel quel : une feuille de style, un bloc
         réservé aux visiteurs sans JavaScript, ou les données JSON que la
         visionneuse Webflow lit dans la page. */
      const inner = tag === 'noscript' ? node.innerHTML : (node.rawText ?? '');
      const attributes = renderAttributes(node, { isSvg: false });
      const attributeText = attributes.length ? ` ${attributes.join(' ')}` : '';
      return `${indent}<${jsxTag}${attributeText} dangerouslySetInnerHTML={{ __html: \`${escapeTemplate(inner)}\` }} />`;
    }

    if (tag === 'script') {
      warnings.push(`script ignoré : ${node.getAttribute('src') ?? 'code en ligne'}`);
      return '';
    }

    const extra = [];
    if (tag === 'select') {
      const selected = node.querySelector('option[selected]');
      if (selected) extra.push(`defaultValue=${JSON.stringify(selected.getAttribute('value') ?? selected.text)}`);
    }
    const attributes = renderAttributes(node, { isSvg, extra }).filter(
      (attribute) => !(tag === 'option' && attribute === 'selected'),
    );

    const children = node.childNodes
      .map((child) => renderNode(child, level + 1, isSvg))
      .filter((part) => part !== '');

    const attributeText = attributes.length ? ` ${attributes.join(' ')}` : '';
    if (VOID_TAGS.has(tag) || (children.length === 0 && !VOID_TAGS.has(tag) && isSelfClosable(tag))) {
      return `${indent}<${jsxTag}${attributeText} />`;
    }
    if (children.length === 0) {
      return `${indent}<${jsxTag}${attributeText}></${jsxTag}>`;
    }
    return `${indent}<${jsxTag}${attributeText}>\n${children.join('\n')}\n${indent}</${jsxTag}>`;
  };

  const code = document.childNodes
    .map((child) => renderNode(child, depth, false))
    .filter((part) => part !== '')
    .join('\n');

  return { code, warnings };
}

/* Un élément vide peut s'écrire en balise auto-fermante sans changer le DOM. */
function isSelfClosable(tag) {
  return tag !== 'script' && tag !== 'iframe' && tag !== 'textarea' && tag !== 'a' && tag !== 'div';
}
