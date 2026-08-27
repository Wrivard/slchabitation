import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  applyPageSemantics,
  enhanceAccessibility,
  getPageSemantics,
} from '../src/lib/publicPageSemantics.mjs';
import {
  soumissionFormSlotMarkup,
  soumissionFormStaticMarkup,
} from '../src/lib/soumission-form-slot.mjs';

/**
 * Génère les pages statiques du site.
 *
 * Le contenu de chaque page vient d'un seul endroit : l'application React,
 * exécutée ici par `dist/server/entry-server.js`. Le visiteur qui arrive
 * directement sur une adresse, celui qui navigue dans le site et les robots
 * d'indexation voient donc rigoureusement la même page — il n'existe plus de
 * copie écrite à la main susceptible de s'écarter du vrai site.
 *
 * Les pages issues du gabarit Webflow conservent leur document d'origine
 * (entête, feuilles de style, scripts hérités) : seul le contenu placé dans
 * `#root` provient du rendu React.
 */

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'dist', 'public');
const sourceDir = path.join(root, 'site');
const serverBundle = path.join(root, 'dist', 'server', 'entry-server.js');
const seoMetadata = JSON.parse(
  await readFile(path.join(root, 'src/lib/seo-route-metadata.json'), 'utf8'),
);
const { siteOrigin, routes } = seoMetadata;
const fontStylesheet =
  'https://fonts.googleapis.com/css2?family=Alexandria:wght@400&family=Inter:wght@400;500;600;700&display=swap';

/* Pages issues d'un gabarit Webflow qui montent malgré tout un composant React
   stylé avec la feuille de l'application. Les pages sans gabarit hérité partent
   du shell Vite, qui la référence déjà. */
const routesNeedingAppStyles = new Set(['/soumission']);

/* Anciennes adresses Webflow qui, dans l'application, redirigent aussitôt vers
   une autre page. Leur document statique continue d'exposer le contenu hérité :
   ces adresses sont référencées par les moteurs de recherche, et les remplacer
   par un message de redirection ferait disparaître ce contenu de l'index. La
   redirection reste faite par React au chargement, comme aujourd'hui. Le jour
   où l'hébergement renverra une vraie redirection HTTP, cette liste disparaîtra
   avec les gabarits hérités. */
const routesKeepingLegacyBody = new Set([
  '/renovation-sous-sol',
  '/renovation-salle-de-bain',
  '/renovation-cuisine',
  '/formulaire',
]);

let renderRoute;
try {
  ({ renderRoute } = await import(pathToFileURL(serverBundle).href));
} catch (error) {
  throw new Error(
    `Le rendu serveur est introuvable (${path.relative(root, serverBundle)}). ` +
      'Lancez « vite build --config vite.config.ssr.ts » avant le prérendu.',
    { cause: error },
  );
}

/* Les blocs qui apparaissent en fondu sont rendus dans leur état masqué : seule
   l'animation les révèle. Sans JavaScript, ce contenu resterait invisible. Les
   éléments concernés sont donc marqués au moment du rendu — et eux seuls — puis
   rendus visibles par une règle réservée aux visiteurs sans JavaScript. Rien ne
   change pour les autres, ni pour un élément volontairement masqué par la
   feuille de style. */
const noScriptRevealAttribute = 'data-noscript-reveal';
const noScriptRevealStyle = `<noscript><style>[${noScriptRevealAttribute}]{opacity:1!important;transform:none!important}</style></noscript>`;

function markHiddenRevealElements(html) {
  return html.replace(/style="opacity:0([;"])/g, `${noScriptRevealAttribute} style="opacity:0$1`);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function normalizeAttributeUrls(html) {
  return html.replace(
    /(href|src|srcset)=("|')([^"']*)\2/gi,
    (_match, attribute, quote, value) => {
      let normalizedValue = value;

      if (attribute.toLowerCase() === 'href') {
        const routeMatch = normalizedValue.match(
          /^(?:\.\/)?(index|a-propos|renovation|agrandissement-construction-neuve|travaux-sur-mesure|realisations|soumission|politique-de-cookie)\.html(.*)$/i,
        );
        if (routeMatch) {
          const routeName = routeMatch[1].toLowerCase();
          const routePath =
            routeName === 'index'
              ? '/'
              : `/${routeName}`;
          normalizedValue = `${routePath}${routeMatch[2]}`;
        }
      }

      normalizedValue = normalizedValue.replace(
        /(^|[\s,])(?:\.\/)?(css|images|js)\//g,
        '$1/$2/',
      );

      if (
        !normalizedValue.startsWith('/') &&
        /^(?:\.\/)?(?:favicon\.|images\/|css\/|js\/)/i.test(normalizedValue)
      ) {
        normalizedValue = `/${normalizedValue.replace(/^\.\//, '')}`;
      }

      return `${attribute}=${quote}${normalizedValue}${quote}`;
    },
  );
}

function removeHeadTag(html, pattern) {
  return html.replace(pattern, '');
}

function createSchemaTag(schema) {
  if (!schema) {
    return '';
  }

  const serializedSchema = JSON.stringify(schema).replace(/</g, '\\u003c');
  return `<script id="page-schema" type="application/ld+json">${serializedSchema}</script>`;
}

/**
 * Contenu de la page, rendu par l'application React elle-même.
 *
 * Seule exception : le formulaire de soumission. Il n'est monté qu'une fois la
 * page vivante, dans un emplacement réservé au milieu du balisage hérité ; la
 * version statique y dépose donc un aperçu non interactif, remplacé par le vrai
 * formulaire dès que React démarre.
 */
function renderRouteBody(route, legacyBodyContent) {
  if (routesKeepingLegacyBody.has(route.path)) {
    return enhanceAccessibility(
      applyPageSemantics(legacyBodyContent, getPageSemantics(route.source)),
    );
  }

  const body = markHiddenRevealElements(renderRoute(route.path));

  if (route.path !== '/soumission') {
    return body;
  }

  if (!body.includes(soumissionFormSlotMarkup)) {
    throw new Error(
      "L'emplacement du formulaire de soumission est introuvable dans le rendu de /soumission.",
    );
  }

  return body.replace(soumissionFormSlotMarkup, soumissionFormStaticMarkup);
}

function createPrerenderedPage(sourceHtml, route, appScript) {
  let html = sourceHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = removeHeadTag(html, /<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']description["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']robots["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*property=["']og:url["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*property=["']og:title["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*property=["']og:description["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']twitter:url["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']twitter:title["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']twitter:description["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<script\b[^>]*id=["']page-schema["'][^>]*>[\s\S]*?<\/script>\s*/gi);
  html = removeHeadTag(
    html,
    /<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>\s*/gi,
  );

  const canonical = `${siteOrigin}${route.path === '/' ? '/' : route.path}`;
  const headTags = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontStylesheet}" rel="stylesheet">
  <title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}">
  <meta name="robots" content="${route.path.startsWith('/pub/') || route.noindex === true ? 'noindex, follow' : 'index, follow'}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(route.title)}">
  <meta property="og:description" content="${escapeHtml(route.description)}">
  <meta name="twitter:url" content="${canonical}">
  <meta name="twitter:title" content="${escapeHtml(route.title)}">
  <meta name="twitter:description" content="${escapeHtml(route.description)}">
  ${createSchemaTag(route.schema)}
  ${noScriptRevealStyle}
  ${routesNeedingAppStyles.has(route.path) ? appStylesheet : ''}
`;
  html = html.replace(/<head([^>]*)>/i, `<head$1>${headTags}`);

  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not find a body in ${route.source ?? route.path}`);
  }

  const bodyAttributes = bodyMatch[1] || '';
  const staticBody = `<body${bodyAttributes}><div id="root">${renderRouteBody(route, bodyMatch[2])}</div>${appScript}</body>`;
  return normalizeAttributeUrls(
    html.replace(/<body[^>]*>[\s\S]*?<\/body>/i, staticBody),
  );
}

const appShell = await readFile(path.join(outputDir, 'index.html'), 'utf8');
const appScriptMatch = appShell.match(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/i,
);
if (!appScriptMatch) {
  throw new Error('Could not find the Vite module script in the built index.html');
}

const appScript = `<script type="module" src="${appScriptMatch[1]}"></script>`;

// Les gabarits hérités de Webflow n'embarquent que le CSS du site d'origine.
// La page /soumission affiche désormais un composant React stylé avec la
// feuille de l'application : elle doit donc la charger elle aussi, sans quoi le
// formulaire arriverait sans mise en forme.
const appStylesheetMatch = appShell.match(
  /<link\b[^>]*href="[^"]*assets\/[^"]+\.css"[^>]*>/i,
);
if (!appStylesheetMatch) {
  throw new Error('Could not find the built application stylesheet in index.html');
}
const appStylesheet = appStylesheetMatch[0];

for (const route of routes) {
  const sourceHtml = route.source
    ? await readFile(path.join(sourceDir, route.source), 'utf8')
    : appShell;

  const renderedHtml = createPrerenderedPage(sourceHtml, route, appScript);
  const routeOutput =
    route.path === '/'
      ? path.join(outputDir, 'index.html')
      : path.join(outputDir, route.path.slice(1), 'index.html');
  await mkdir(path.dirname(routeOutput), { recursive: true });
  await writeFile(routeOutput, renderedHtml);

  // Vite's SEO entry points may emit the former .html path as a physical file.
  // Remove it so the alternate URL is handled by the clean-route redirect
  // instead of becoming a second indexable document.
  if (route.path !== '/' && route.source) {
    await rm(path.join(outputDir, route.source), { force: true });
  }
}

console.log(`Prerendered ${routes.length} public routes from the React application.`);
