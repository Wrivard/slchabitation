import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  applyPageSemantics,
  enhanceAccessibility,
  getPageSemantics,
} from '../src/lib/publicPageSemantics.mjs';

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'dist', 'public');
const sourceDir = path.join(root, 'site');
const seoMetadata = JSON.parse(
  await readFile(path.join(root, 'src/lib/seo-route-metadata.json'), 'utf8'),
);
const { siteOrigin, routes } = seoMetadata;
const fontStylesheet =
  'https://fonts.googleapis.com/css2?family=Alexandria:wght@400&family=Inter:wght@400;500;600;700&display=swap';

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

function createPrerenderedPage(sourceHtml, route, appScript) {
  let html = sourceHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = removeHeadTag(html, /<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi);
  html = removeHeadTag(html, /<meta\b[^>]*name=["']description["'][^>]*>\s*/gi);
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
  <link rel="canonical" href="${canonical}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(route.title)}">
  <meta property="og:description" content="${escapeHtml(route.description)}">
  <meta name="twitter:url" content="${canonical}">
  <meta name="twitter:title" content="${escapeHtml(route.title)}">
  <meta name="twitter:description" content="${escapeHtml(route.description)}">
  ${createSchemaTag(route.schema)}
`;
  html = html.replace(/<head([^>]*)>/i, `<head$1>${headTags}`);

  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not find a body in ${route.source}`);
  }

  const bodyAttributes = bodyMatch[1] || '';
  const bodyContent = bodyMatch[2];
  const accessibleBodyContent = enhanceAccessibility(
    applyPageSemantics(bodyContent, getPageSemantics(route.source)),
  );
  const staticBody = `<body${bodyAttributes}><div id="root">${accessibleBodyContent}</div>${appScript}</body>`;
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