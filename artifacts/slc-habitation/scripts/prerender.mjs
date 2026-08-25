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
    evaluations: [
      'Hauteur libre et disposition de la mécanique du bâtiment (conduits, poutres).',
      'État de la dalle de béton et des drains existants.',
      'Capacité du panneau électrique pour l\'ajout de nouvelles zones de chauffage.',
      'Conformité des fenêtres pour l\'aménagement de nouvelles chambres.'
    ],
    configurations: [
      'Espace de vie, salle familiale et cinéma maison.',
      'Chambres supplémentaires et bureaux à domicile.',
      'Salles de bain complètes et salles d\'eau.'
    ],
    testimonial: {
      quote: "Magnifique travail de l'équipe SLC Habitation. Nous avions un projet complexe avec plusieurs défis! Ils ont fait un travail exceptionnel. Un gros merci pour votre professionnalisme! Je recommande sans hésiter.",
      author: 'Johanne Duguay',
    },
    faqs: [
      ['Faut-il traiter l\'humidité avant de finir le sous-sol ?', 'Il est essentiel de vérifier les signes d\'infiltration, l\'état de la fondation et le taux d\'humidité avant de refermer les murs.'],
      ['Quelles sont les étapes pour insonoriser un plafond ?', 'L\'approche dépend du niveau d\'atténuation acoustique désiré. Elle comprend généralement de la laine insonorisante, des profilés résilients et des couches de gypse appropriées.'],
      ['Est-ce possible d\'ajouter une salle de bain si la plomberie n\'est pas prévue ?', 'C\'est souvent possible, mais nécessite une évaluation technique des drains, du renvoi principal et de la dalle de béton.'],
      ['Combien de temps durent les travaux ?', 'La durée varie selon la complexité du projet (ajout de salle de bain, modifications structurelles). Nous fournissons un échéancier lors de la planification.'],
      ['Quel type de revêtement de sol est recommandé ?', 'Les matériaux qui tolèrent bien les variations d\'humidité, comme le vinyle ou la céramique, sont généralement privilégiés au sous-sol.'],
      ['Faut-il un permis pour aménager un sous-sol ?', 'Dans la plupart des municipalités, un permis est requis, particulièrement si les travaux impliquent de la plomberie ou des modifications structurelles.'],
      ['Comment maximiser la hauteur du plafond ?', 'Nous évaluons la disposition de la mécanique du bâtiment afin de déterminer les options d\'aménagement du plafond les mieux adaptées.'],
      ['Peut-on agrandir les fenêtres existantes ?', 'L\'agrandissement de fenêtres implique des travaux de fondation et de maçonnerie, ce qui est généralement possible après une analyse de la structure.']
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
    evaluations: [
      'Sens des solives pour l\'aménagement des drains.',
      'Cheminement de la ventilation vers l\'extérieur.',
      'État de la structure du sous-plancher.',
      'Capacité du circuit électrique pour le plancher chauffant.'
    ],
    configurations: [
      'Douches sur mesure, italiennes ou avec base.',
      'Bains autoportants et robinetterie adaptée.',
      'Vanités optimisées et éclairage intégré.'
    ],
    testimonial: {
      quote: "Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l'écoute, je recommande vivement!",
      author: 'Isabelle Baril',
    },
    faqs: [
      ['Faut-il refaire toute la plomberie lors d\'une rénovation ?', 'Ce n\'est pas systématique. Toutefois, si la plomberie est ancienne ou si nous déplaçons les appareils sanitaires, il peut être nécessaire de mettre le réseau aux normes.'],
      ['Comment assurer une bonne étanchéité pour une douche italienne ?', 'Une douche italienne exige une imperméabilisation adéquate. Nous utilisons un système de membrane étanche appliqué sur les murs et le plancher.'],
      ['Peut-on installer un plancher chauffant sous n\'importe quel revêtement ?', 'La céramique et la pierre naturelle conduisent bien la chaleur. Pour les autres revêtements, il faut vérifier les spécifications de transfert thermique du fabricant.'],
      ['Quel budget devrais-je prévoir ?', 'Une rénovation complète demande un investissement structuré. Chaque projet fait l\'objet d\'une évaluation précise de l\'ampleur des travaux.'],
      ['Quels types de ventilation recommandez-vous ?', 'Le choix du système d\'extraction dépend du volume de la pièce et de sa configuration afin d\'assurer une évacuation adéquate de l\'humidité.'],
      ['Pouvons-nous déplacer la toilette ou le bain ?', 'Le déplacement des appareils sanitaires dépend de l\'emplacement des solives et du renvoi principal. Une évaluation sur place est requise.'],
      ['Est-il préférable d\'installer un bain ou une grande douche ?', 'Le choix dépend de vos habitudes de vie et de l\'espace disponible. Une douche spacieuse est souvent privilégiée si la maison dispose déjà d\'un bain.'],
      ['Offrez-vous des solutions pour adapter la salle de bain à la mobilité réduite ?', 'Nous pouvons planifier des aménagements intégrant des douches sans seuil, des barres d\'appui et une circulation facilitée.']
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
    evaluations: [
      'Identification des murs porteurs potentiels.',
      'Localisation des colonnes de ventilation et plomberie.',
      'Exigences électriques des nouveaux appareils.',
      'Continuité et préparation des sous-planchers.'
    ],
    configurations: [
      'Ébénisterie personnalisée et surfaces adaptées à l’usage.',
      'Rangement ergonomique et tiroirs spécialisés.',
      'Éclairage par zones (travail et ambiance).'
    ],
    testimonial: {
      quote: 'Excellente compagnie, service professionnel et soucis du détails! Merci à votre équipe pour vos bons conseils. Je recommande à tous pour la réalisation de vos projets!',
      author: 'Mélodie Binette',
    },
    faqs: [
      ['Est-ce possible d\'abattre un mur pour créer une aire ouverte ?', 'Il est souvent possible de le faire. Nous déterminons d\'abord si le mur est porteur. Le cas échéant, un ingénieur en structure conçoit le soutien approprié.'],
      ['Doit-on commander les électroménagers avant le début des travaux ?', 'C\'est fortement recommandé. Connaître les dimensions exactes et les spécifications techniques de vos appareils permet d\'éviter des ajustements imprévus.'],
      ['Pouvons-nous refaire le plancher de la cuisine pour l\'harmoniser avec le salon ?', 'Oui. Lors de la création d\'une aire ouverte, l\'unification des planchers est fréquente. Nous préparons le sous-plancher pour assurer une transition adéquate.'],
      ['Comment gérez-vous la démolition ?', 'Nous protégeons les espaces de vie adjacents contre la poussière. La démolition est exécutée méthodiquement et les débris sont gérés de manière structurée.'],
      ['Est-il nécessaire de refaire l\'électricité ?', 'Lors d\'une rénovation majeure, les circuits électriques doivent souvent être mis aux normes, notamment pour les nouveaux appareils et les prises d\'îlot.'],
      ['Peut-on conserver les armoires existantes et ne changer que les portes ?', 'Si les caissons sont en bon état et que la configuration vous convient, le resurfaçage (refacing) peut être une option à évaluer.'],
      ['Où installer le micro-ondes ?', 'L\'emplacement du micro-ondes se planifie en fonction de l\'ergonomie, du rangement disponible et des exigences de ventilation.'],
      ['La hotte de cuisine doit-elle sortir à l\'extérieur ?', 'Une évacuation extérieure est recommandée pour une meilleure gestion des odeurs et de l\'humidité, selon les possibilités offertes par la structure.']
    ],
  },
};

function createPaidStaticBody(content, routePath) {
  const points = content.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
  const faqs = content.faqs
    .map(
      ([question, answer]) =>
        `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`,
    )
    .join('');

  const evals = content.evaluations ? `<section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>Évaluation initiale</h2><ul>${content.evaluations.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul></div></section>` : '';
  const configs = content.configurations ? `<section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>Aménagements sur mesure</h2><ul>${content.configurations.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul></div></section>` : '';
  const testimonial = `<section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>L’expérience de nos clients</h2><blockquote>« ${escapeHtml(content.testimonial.quote)} »</blockquote><p>${escapeHtml(content.testimonial.author)}</p></div></section>`;
  const serviceSlug = routePath ? routePath.replace('/pub/', '') : '';

  return `<header class="border-b bg-white"><div class="container-large px-6 py-4 mx-auto"><img src="/images/relume-567884.png" width="135" height="90" alt="SLC Habitation"><a href="tel:+15144048494">514 404-8494</a></div></header>
  <main>
    <section class="bg-secondary text-white py-16"><div class="container-large px-6 mx-auto max-w-5xl">
      <h1>${escapeHtml(content.h1)}</h1><p>${escapeHtml(content.intro)}</p>
      <ul><li>Licence RBQ : 8351-9033-59</li><li>18 ans d’expérience</li><li>Laval et Laurentides</li></ul>
      <a href="/pub/formulaire?service=${escapeHtml(serviceSlug)}">Demander une soumission</a>
    </div></section>
    ${configs}
    <section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>L'expertise derrière les murs</h2><p>Une planification technique adaptée à votre projet, du contrôle de la structure aux finitions apparentes.</p><ul>${points}</ul></div></section>
    ${evals}
    ${testimonial}
    <section class="py-16"><div class="container-large px-6 mx-auto max-w-4xl"><h2>Questions fréquentes</h2>${faqs}</div></section>
    <section class="py-16 bg-secondary text-white"><div class="container-large px-6 mx-auto max-w-4xl">
      <h2>Prêt à débuter?</h2>
      <a href="/pub/formulaire?service=${escapeHtml(serviceSlug)}">Demander une soumission</a>
    </div></section>
  </main>
  <footer class="border-t bg-white"><div class="container-large px-6 py-8 mx-auto"><a href="tel:+15144048494">514 404-8494</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a></div></footer>`;
}

function createFallbackSource(appShell, route) {
  const content = paidPageContent[route.path];
  let bodyContent;

  if (content) {
    bodyContent = createPaidStaticBody(content, route.path);
  } else if (route.path === '/pub/formulaire') {
    bodyContent = `<main class="min-h-screen bg-background py-16"><div class="container-large px-6 mx-auto max-w-3xl"><h1>Demande de soumission</h1><p>Décrivez votre projet de rénovation à Laval ou dans les Laurentides. Le formulaire recueille uniquement les renseignements nécessaires au suivi de votre demande.</p><ul><li>Licence RBQ : 8351-9033-59</li><li>18 ans d’expérience</li><li>Téléphone : <a href="tel:+15144048494">514 404-8494</a></li></ul><h2>Informations demandées</h2><p>Service, budget approximatif, description du projet et coordonnées de contact.</p><p><a href="/politique-de-confidentialite">Consulter la politique de confidentialité</a></p></div></main>`;
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
