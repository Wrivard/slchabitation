import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
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
 * Toutes les pages partent du même document, `index.html` : l'entête commune y
 * est écrite une seule fois, et seuls le titre, la description et les adresses
 * changent d'une page à l'autre, depuis `src/lib/seo-route-metadata.json`.
 */

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'dist', 'public');
const serverBundle = path.join(root, 'dist', 'server', 'entry-server.js');
const seoMetadata = JSON.parse(
  await readFile(path.join(root, 'src/lib/seo-route-metadata.json'), 'utf8'),
);
const { siteOrigin, routes, notFoundRoute } = seoMetadata;
const artifactToml = await readFile(
  path.join(root, '.replit-artifact', 'artifact.toml'),
  'utf8',
);
const fontStylesheet =
  'https://fonts.googleapis.com/css2?family=Alexandria:wght@400;700&family=Inter:wght@400;500;600;700&display=swap';
const fontLoadingMarkup = `
  <link rel="preload" href="${fontStylesheet}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="${fontStylesheet}" rel="stylesheet"></noscript>
`;

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

function createSitemap() {
  const indexableRoutes = routes.filter(
    (route) => route.noindex !== true && !route.path.startsWith('/pub/'),
  );
  const entries = indexableRoutes
    .map((route) => {
      const canonical = `${siteOrigin}${route.path === '/' ? '/' : route.path}`;
      return `  <url>\n    <loc>${escapeHtml(canonical)}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function assertProductionRewrites() {
  const rewriteEntries = [
    ...artifactToml.matchAll(
      /\[\[services\.production\.rewrites\]\]\s+from\s*=\s*"([^"]+)"\s+to\s*=\s*"([^"]+)"/g,
    ),
  ];
  const rewriteTargets = new Map(
    rewriteEntries.map(([, from, to]) => [from, to]),
  );
  const expectedRewrites = new Map(
    routes
      .filter((route) => route.path !== '/')
      .map((route) => [route.path, `${route.path}/index.html`]),
  );

  expectedRewrites.set(
    '/politique-de-confidentialite/*',
    '/politique-de-confidentialite/index.html',
  );
  expectedRewrites.set('/formulaire', '/soumission/index.html');
  expectedRewrites.set('/formulaire/*', '/soumission/index.html');
  expectedRewrites.set('/formulaire.html', '/soumission/index.html');

  const mismatches = [...expectedRewrites].filter(
    ([from, to]) => rewriteTargets.get(from) !== to,
  );
  if (mismatches.length > 0) {
    const details = mismatches
      .map(([from, to]) => `${from} → ${to}`)
      .join(', ');
    throw new Error(
      `Production rewrites are not synchronized with prerendered routes: ${details}`,
    );
  }
}

/**
 * Contenu de la page, rendu par l'application React elle-même.
 *
 * Le formulaire de soumission n'est monté qu'une fois la page vivante, dans un
 * emplacement réservé : la version statique y dépose un aperçu non interactif,
 * remplacé par le vrai formulaire dès que React démarre.
 */
function renderRouteBody(route) {
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
    /<noscript>\s*<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>\s*<\/noscript>\s*/gi,
  );
  html = removeHeadTag(
    html,
    /<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>\s*/gi,
  );

  const canonical = `${siteOrigin}${route.path === '/' ? '/' : route.path}`;
  /* Une page d'erreur ne représente aucune adresse : lui donner une adresse
     canonique reviendrait à désigner une page réelle qui n'existe pas. */
  const addressTags =
    route.canonical === false
      ? ''
      : `<link rel="canonical" href="${canonical}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:url" content="${canonical}">`;
  const headTags = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLoadingMarkup}
  <title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}">
  <meta name="robots" content="${route.path.startsWith('/pub/') || route.noindex === true ? 'noindex, follow' : 'index, follow'}">
  ${addressTags}
  <meta property="og:title" content="${escapeHtml(route.title)}">
  <meta property="og:description" content="${escapeHtml(route.description)}">
  <meta name="twitter:title" content="${escapeHtml(route.title)}">
  <meta name="twitter:description" content="${escapeHtml(route.description)}">
  ${createSchemaTag(route.schema)}
  ${noScriptRevealStyle}
`;
  html = html.replace(/<head([^>]*)>/i, `<head$1>${headTags}`);

  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not find a body in ${route.path}`);
  }

  const bodyAttributes = bodyMatch[1] || '';
  const staticBody = `<body${bodyAttributes}><div id="root">${renderRouteBody(route)}</div>${appScript}</body>`;
  return normalizeAttributeUrls(
    html.replace(/<body[^>]*>[\s\S]*?<\/body>/i, staticBody),
  );
}

const appShell = await readFile(path.join(outputDir, 'index.html'), 'utf8');
assertProductionRewrites();
const appScriptMatch = appShell.match(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/i,
);
if (!appScriptMatch) {
  throw new Error('Could not find the Vite module script in the built index.html');
}

const appScript = `<script type="module" src="${appScriptMatch[1]}"></script>`;

for (const route of routes) {
  const renderedHtml = createPrerenderedPage(appShell, route, appScript);
  const routeOutput =
    route.path === '/'
      ? path.join(outputDir, 'index.html')
      : path.join(outputDir, route.path.slice(1), 'index.html');
  await mkdir(path.dirname(routeOutput), { recursive: true });
  await writeFile(routeOutput, renderedHtml);
}

/**
 * Page servie quand l'adresse demandée n'existe pas.
 *
 * L'application React affiche déjà sa propre page « Page introuvable », mais
 * l'hébergement ne sert que des fichiers : sans document `404.html` à la racine
 * du site publié, une adresse inconnue reçoit la page d'erreur nue de
 * l'hébergeur, sans entête, sans pied de page et sans retour vers le site. Le
 * fichier est donc rendu à partir de la même application que les autres pages.
 */
await writeFile(
  path.join(outputDir, '404.html'),
  createPrerenderedPage(appShell, notFoundRoute, appScript),
);

await writeFile(path.join(outputDir, 'sitemap.xml'), createSitemap());

console.log(
  `Prerendered ${routes.length} public routes, the not-found page and the sitemap from the React application.`,
);
