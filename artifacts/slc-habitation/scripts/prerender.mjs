import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'dist', 'public');
const sourceDir = path.join(root, 'site');
const siteOrigin = 'https://slchabitation.com';

const routes = [
  {
    source: 'index.html',
    path: '/',
    title: 'SLC Habitation | Rénovation et construction dans les Laurentides',
    description:
      'SLC Habitation réalise vos projets de rénovation et de construction neuve dans les Laurentides et à Laval.',
  },
  {
    source: 'a-propos.html',
    path: '/a-propos',
    title: 'À propos de SLC Habitation | Entrepreneur général',
    description:
      'À propos de SLC Habitation, entrepreneur général spécialisé en rénovation et construction neuve dans les Laurentides et à Laval.',
  },
  {
    source: 'renovation.html',
    path: '/renovation',
    title: 'Rénovation | SLC Habitation',
    description:
      'Services de rénovation par SLC Habitation : rénovation complète, cuisine, salle de bain et sous-sol dans les Laurentides et à Laval.',
  },
  {
    source: 'agrandissement-construction-neuve.html',
    path: '/agrandissement-construction-neuve',
    title: 'Agrandissement et construction neuve | SLC Habitation',
    description:
      'Agrandissement de maison et construction neuve sur mesure par SLC Habitation dans les Laurentides et à Laval.',
  },
  {
    source: 'travaux-sur-mesure.html',
    path: '/travaux-sur-mesure',
    title: 'Travaux sur mesure | SLC Habitation',
    description:
      'Solutions de travaux sur mesure pour vos projets de rénovation et de construction par SLC Habitation dans les Laurentides et à Laval.',
  },
  {
    source: 'realisations.html',
    path: '/realisations',
    title: 'Réalisations | SLC Habitation',
    description:
      'Découvrez les réalisations de SLC Habitation : projets de rénovation et de construction neuve dans les Laurentides et à Laval.',
  },
  {
    source: 'soumission.html',
    path: '/soumission',
    title: 'Demander une soumission | SLC Habitation',
    description:
      'Demandez une soumission gratuite pour votre projet de rénovation ou de construction neuve avec SLC Habitation.',
  },
  {
    source: 'politique-de-cookie.html',
    path: '/politique-de-cookie',
    title: 'Politique de cookies | SLC Habitation',
    description:
      'Consultez la politique de cookies de SLC Habitation et découvrez comment nous utilisons les cookies sur notre site.',
  },
];

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

function createPrerenderedPage(sourceHtml, route, appScript) {
  let html = normalizeAttributeUrls(sourceHtml);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = removeHeadTag(html, /<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']description["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*property=["']og:url["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']twitter:url["'][^>]*>\s*/gi);

  const canonical = `${siteOrigin}${route.path === '/' ? '/' : route.path}`;
  const headTags = `
  <title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:url" content="${canonical}">
`;
  html = html.replace(/<head([^>]*)>/i, `<head$1>${headTags}`);

  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not find a body in ${route.source}`);
  }

  const bodyAttributes = bodyMatch[1] || '';
  const bodyContent = bodyMatch[2];
  const staticBody = `<body${bodyAttributes}><div id="root">${bodyContent}</div>${appScript}</body>`;
  return html.replace(/<body[^>]*>[\s\S]*?<\/body>/i, staticBody);
}

const appShell = await readFile(path.join(outputDir, 'index.html'), 'utf8');
const appScriptMatch = appShell.match(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/i,
);
if (!appScriptMatch) {
  throw new Error('Could not find the Vite module script in the built index.html');
}

const appScript = `<script type="module" src="${appScriptMatch[1]}"></script>`;

for (const route of routes) {
  const sourceHtml = await readFile(path.join(sourceDir, route.source), 'utf8');
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
  if (route.path !== '/') {
    await rm(path.join(outputDir, route.source), { force: true });
  }
}

console.log(`Prerendered ${routes.length} public routes with clean canonical URLs.`);