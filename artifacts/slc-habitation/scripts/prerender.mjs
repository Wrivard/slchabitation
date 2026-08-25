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

const paidPageContent = {
  '/pub/renovation-sous-sol': {
    h1: 'Rénovation de sous-sol à Laval et dans les Laurentides',
    intro:
      'SLC Habitation planifie et réalise des rénovations de sous-sol adaptées à l’usage prévu, à la structure existante et aux besoins des propriétaires.',
    points: [
      'Vérification des signes d’humidité avant la finition',
      'Planification de l’isolation et de l’insonorisation',
      'Agencement tenant compte de la mécanique du bâtiment',
      'Coordination des travaux de démolition à la finition',
    ],
    faqs: [
      ['Pourquoi vérifier l’humidité avant les travaux?', 'Les signes d’infiltration et l’état de la fondation doivent être évalués avant de planifier l’isolation et les finis.'],
      ['Peut-on insonoriser un sous-sol?', 'Les solutions dépendent de la structure et de l’usage prévu. Elles sont déterminées pendant l’évaluation du projet.'],
      ['Une salle de bain peut-elle être ajoutée?', 'La possibilité dépend notamment des drains, du renvoi principal et de la dalle existante.'],
      ['Comment le projet est-il planifié?', 'L’équipe écoute les besoins, évalue les lieux et prépare une soumission détaillée avant le début des travaux.'],
      ['Quel budget faut-il prévoir?', 'Le budget varie selon la superficie, l’état existant, les matériaux et la complexité des travaux.'],
      ['Où SLC Habitation se déplace-t-elle?', 'Les projets présentés dans ce funnel sont destinés aux propriétaires de Laval et des Laurentides.'],
    ],
  },
  '/pub/renovation-salle-de-bain': {
    h1: 'Rénovation de salle de bain à Laval et dans les Laurentides',
    intro:
      'SLC Habitation coordonne la rénovation de salles de bain en tenant compte de la plomberie, de la ventilation, de l’étanchéité, de la céramique et de l’aménagement.',
    points: [
      'Planification de la plomberie et des appareils',
      'Préparation des surfaces et gestion de l’étanchéité',
      'Ventilation adaptée à la pièce',
      'Coordination des travaux et des finitions',
    ],
    faqs: [
      ['Quels éléments sont évalués avant les travaux?', 'La configuration, la plomberie, la ventilation, les surfaces et les besoins d’utilisation font partie de l’évaluation.'],
      ['Peut-on modifier l’emplacement des appareils?', 'Cela dépend de la structure et du réseau de plomberie existant. Une visite permet de confirmer les options.'],
      ['Comment l’étanchéité est-elle planifiée?', 'La préparation et les matériaux sont choisis selon les surfaces et la configuration de la salle de bain.'],
      ['La ventilation fait-elle partie de la planification?', 'Oui, la gestion de l’humidité et la ventilation sont considérées selon les conditions de la pièce.'],
      ['Quel budget faut-il prévoir?', 'Le budget dépend de la configuration, des appareils, des matériaux et de l’ampleur des travaux.'],
      ['Où SLC Habitation se déplace-t-elle?', 'Les projets présentés dans ce funnel sont destinés aux propriétaires de Laval et des Laurentides.'],
    ],
  },
  '/pub/renovation-cuisine': {
    h1: 'Rénovation de cuisine à Laval et dans les Laurentides',
    intro:
      'SLC Habitation planifie la rénovation de cuisines en fonction de la circulation, du rangement, des armoires, des comptoirs et des raccordements techniques.',
    points: [
      'Analyse de la configuration et des besoins de rangement',
      'Coordination des armoires, comptoirs et finitions',
      'Planification de la plomberie et de l’électricité',
      'Organisation structurée des étapes du projet',
    ],
    faqs: [
      ['Quels besoins sont évalués au départ?', 'La circulation, le rangement, les surfaces de travail et les équipements souhaités orientent la planification.'],
      ['Peut-on modifier la configuration?', 'Les options dépendent de la structure, de la plomberie, de l’électricité et des contraintes de la pièce.'],
      ['Comment les armoires et comptoirs sont-ils coordonnés?', 'Leur choix et leur installation sont intégrés à la séquence globale des travaux.'],
      ['Les raccordements techniques sont-ils considérés?', 'La plomberie et l’électricité sont planifiées selon la configuration retenue et les appareils prévus.'],
      ['Quel budget faut-il prévoir?', 'Le budget varie selon les dimensions, les matériaux, les équipements et la complexité des modifications.'],
      ['Où SLC Habitation se déplace-t-elle?', 'Les projets présentés dans ce funnel sont destinés aux propriétaires de Laval et des Laurentides.'],
    ],
  },
};

function createPaidStaticBody(content) {
  const points = content.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
  const faqs = content.faqs
    .map(
      ([question, answer]) =>
        `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`,
    )
    .join('');

  return `<header class="border-b bg-white"><div class="container-large px-6 py-4 mx-auto"><img src="/images/relume-567884.png" width="135" height="90" alt="SLC Habitation"><a href="tel:+15144048494">514 404-8494</a></div></header>
  <main>
    <section class="bg-secondary text-white py-16"><div class="container-large px-6 mx-auto max-w-5xl">
      <h1>${escapeHtml(content.h1)}</h1><p>${escapeHtml(content.intro)}</p>
      <ul><li>Licence RBQ : 8351-9033-59</li><li>18 ans d’expérience</li><li>Laval et Laurentides</li></ul>
      <div aria-label="Formulaire de soumission"><h2>Parlez-nous de votre projet</h2><p>Le formulaire sécurisé permet de préciser le service, le budget, le projet et vos coordonnées.</p></div>
    </div></section>
    <section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>Une planification adaptée à votre projet</h2><ul>${points}</ul></div></section>
    <section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>Questions fréquentes</h2>${faqs}</div></section>
  </main>
  <footer class="border-t bg-white"><div class="container-large px-6 py-8 mx-auto"><a href="tel:+15144048494">514 404-8494</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a></div></footer>`;
}

function createFallbackSource(appShell, route) {
  const content = paidPageContent[route.path];
  let bodyContent;

  if (content) {
    bodyContent = createPaidStaticBody(content);
  } else if (route.path === '/pub/formulaire') {
    bodyContent = `<main class="min-h-screen bg-background py-16"><div class="container-large px-6 mx-auto max-w-3xl"><h1>Demande de soumission</h1><p>Décrivez votre projet de rénovation à Laval ou dans les Laurentides. Le formulaire sécurisé recueille uniquement les renseignements nécessaires au suivi de votre demande.</p><ul><li>Licence RBQ : 8351-9033-59</li><li>18 ans d’expérience</li><li>Téléphone : <a href="tel:+15144048494">514 404-8494</a></li></ul><h2>Informations demandées</h2><p>Service, budget approximatif, description du projet et coordonnées de contact.</p><p><a href="/politique-de-confidentialite">Consulter la politique de confidentialité</a></p></div></main>`;
  } else {
    bodyContent = `<main class="min-h-screen bg-background py-16"><div class="container-large px-6 mx-auto max-w-3xl"><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p></div></main>`;
  }

  return appShell.replace(
    /<body[^>]*>[\s\S]*?<\/body>/i,
    `<body><div id="root">${bodyContent}</div></body>`,
  );
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
  <meta name="robots" content="${route.path.startsWith('/pub/') ? 'noindex, follow' : 'index, follow'}">
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
  const semanticBodyContent = route.source
    ? applyPageSemantics(bodyContent, getPageSemantics(route.source))
    : bodyContent;
  const accessibleBodyContent = enhanceAccessibility(semanticBodyContent);
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
  const sourceHtml = route.source
    ? await readFile(path.join(sourceDir, route.source), 'utf8')
    : createFallbackSource(appShell, route);
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

console.log(`Prerendered ${routes.length} public routes with clean canonical URLs.`);