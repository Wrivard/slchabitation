import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  applyPageSemantics,
  enhanceAccessibility,
  getPageSemantics,
} from '../src/lib/publicPageSemantics.mjs';
import { readSiteChrome } from './lib/site-chrome.mjs';
import {
  prepareSoumissionMarkup,
  soumissionFormStaticMarkup,
} from '../src/lib/soumission-form-slot.mjs';

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'dist', 'public');
const sourceDir = path.join(root, 'site');
const seoMetadata = JSON.parse(
  await readFile(path.join(root, 'src/lib/seo-route-metadata.json'), 'utf8'),
);
const { siteOrigin, routes } = seoMetadata;
const fontStylesheet =
  'https://fonts.googleapis.com/css2?family=Alexandria:wght@400&family=Inter:wght@400;500;600;700&display=swap';

/* Pages issues d'un gabarit Webflow qui montent malgré tout un composant React
   stylé avec la feuille de l'application. Les pages de repli héritent déjà de
   l'entête du shell Vite, qui la référence. */
const routesNeedingAppStyles = new Set(['/soumission']);

// Même navbar et même pied de page que les pages React : le balisage vient du
// gabarit legacy, comme le module `src/generated/site-chrome.ts`.
const { headerHtml: siteHeaderHtml, footerHtml: siteFooterHtml } = await readSiteChrome(root);
const staticSiteHeader = `<div class="site-chrome site-chrome--header" data-testid="site-navbar">${siteHeaderHtml}</div>`;
const staticSiteFooter = `<div class="site-chrome site-chrome--footer" data-testid="site-footer" data-sticky-hide>${siteFooterHtml}</div>`;

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

// Mêmes entrées que la constante `navItems` de chaque page React. L'entrée
// « Les finitions » n'existe que sur les pages qui affichent une bande photo.
function createPaidNav(hasDetails) {
  return [
    ['inclus', 'Ce qui est inclus'],
    ['etapes', 'Comment ça se passe'],
    ...(hasDetails ? [['finitions', 'Les finitions']] : []),
    ['visite', 'La visite'],
    ['avis', 'Avis'],
    ['realisations', 'Réalisations'],
    ['faq', 'Questions'],
  ];
}

// Mêmes municipalités que le composant PubServiceArea et le pied de page.
const paidServiceCities = [
  'Laval',
  'Saint-Eustache',
  'Terrebonne',
  'Sainte-Thérèse',
  'Rosemère',
  'Mirabel',
  'Boisbriand',
  'Blainville',
  'Saint-Jérôme',
];

const paidServiceNote =
  'Votre municipalité n’est pas dans la liste? Écrivez-nous, nous vous dirons si nous nous déplaçons chez vous.';

// Les trois avis Google publiés sur le site principal, dans le même ordre que
// la constante `reviews` de chaque page React.
const paidReviews = {
  melodie: [
    'Excellente compagnie, service professionnel et soucis du détails! Merci a votre équipe pour vos bon conseil. Je recommande a tous pour la réalisation de vos projet!',
    'Mélodie Binette',
  ],
  isabelle: [
    'Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!',
    'Isabelle Baril',
  ],
  johanne: [
    'Magnifique travail de l’équipe SLC Habitation. Nous avions un projet complexe d’agrandissement et de rénovation d’une vieille maison avec plusieurs défis! Ils ont fait un travail exceptionnel!!! Un gros merci pour votre patience et votre professionnalisme! Je recommande sans hésiter!',
    'Johanne Duguay',
  ],
};

const paidReviewsTitle = 'Ce que les propriétaires écrivent sur Google';
const paidReviewsIntro =
  '19 avis Google, tous 5 étoiles. En voici trois, laissés par des clients de SLC Habitation.';

const formGallery = [
  ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg', 'Salle de bain lumineuse avec douche vitrée, bain et céramique blanche', 1600, 1200, 'Rénovation de salle de bain', 'Douche vitrée'],
  ['/images/relume-657406.jpeg', 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses', 2048, 1536, 'Rénovation de sous-sol', 'Aire de vie et cuisine'],
  ['/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1600.jpg', 'Cuisine avec îlot en bois, rangements blancs et suspensions', 1600, 2133, 'Rénovation de cuisine', 'Îlot en bois'],
  ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg', 'Salle de bain aux murs foncés avec douche en céramique', 1600, 2133, 'Rénovation de salle de bain', 'Palette foncée'],
];

function createFormGalleryMarkup() {
  const blocks = [];
  for (let index = 0; index < formGallery.length; index += 4) {
    blocks.push(formGallery.slice(index, index + 4));
  }

  const galleryBlocks = blocks.map((block, blockIndex) => {
    const [feature, ...stack] = block;
    const modifiers = [
      stack.length === 0 ? 'pub-gallery__block--single' : '',
      stack.length === 1 ? 'pub-gallery__block--pair' : '',
      stack.length >= 3 ? 'pub-gallery__block--bento' : '',
      stack.length > 0 && blockIndex % 2 === 1 ? 'pub-gallery__block--reverse' : '',
    ].filter(Boolean).join(' ');
    const imageMarkup = ([src, alt, width, height, category, project], variant, stackIndex = -1) => {
      const label = variant === 'feature'
        ? `<figcaption class="pub-gallery__label"><span class="pub-gallery__label-category">${escapeHtml(category)}</span><span class="pub-gallery__label-project">${escapeHtml(project)}</span></figcaption>`
        : '';
      const stackClass = variant === 'stack' ? ` pub-gallery__item--stack-${stackIndex + 1}` : '';
      return `<figure class="pub-gallery__item pub-gallery__item--${variant}${stackClass}"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" class="pub-gallery__image">${label}</figure>`;
    };
    return `<div class="pub-gallery__block ${modifiers}">${imageMarkup(feature, 'feature')}<div class="pub-gallery__stack">${stack.map((image, stackIndex) => imageMarkup(image, 'stack', stackIndex)).join('')}</div></div>`;
  }).join('');

  return `<section id="realisations" class="bg-background py-16 md:py-20" data-testid="section-gallery"><div class="container-large mx-auto max-w-7xl px-6"><div class="pub-gallery-head"><div class="pub-gallery-head__main"><p class="pub-section-header__kicker">Réalisations</p><h2 class="pub-section-header__title pub-gallery-head__title">Des projets terminés par notre équipe</h2></div><div class="pub-gallery-head__aside"><p class="pub-section-header__lede pub-gallery-head__text">Cuisine, salle de bain ou sous-sol : découvrez quelques réalisations parmi les 500 projets menés depuis 25 ans.</p></div></div><div class="pub-gallery">${galleryBlocks}</div></div></section>`;
}

function createPaidGalleryMarkup(images) {
  const blocks = [];
  for (let index = 0; index < images.length; index += 4) {
    blocks.push(images.slice(index, index + 4));
  }

  const galleryBlocks = blocks.map((block, blockIndex) => {
    const [feature, ...stack] = block;
    const modifiers = [
      stack.length === 0 ? 'pub-gallery__block--single' : '',
      stack.length === 1 ? 'pub-gallery__block--pair' : '',
      stack.length >= 3 ? 'pub-gallery__block--bento' : '',
      stack.length > 0 && blockIndex % 2 === 1 ? 'pub-gallery__block--reverse' : '',
    ].filter(Boolean).join(' ');
    const imageMarkup = ([src, alt, width, height, caption], variant, stackIndex = -1) => {
      const stackClass = variant === 'stack' ? ` pub-gallery__item--stack-${stackIndex + 1}` : '';
      const captionMarkup = variant === 'feature'
        ? `<figcaption class="pub-gallery__label"><span class="pub-gallery__label-project">${escapeHtml(caption || alt)}</span></figcaption>`
        : `<figcaption class="pub-gallery__caption">${escapeHtml(caption || alt)}</figcaption>`;
      return `<figure class="pub-gallery__item pub-gallery__item--${variant}${stackClass}"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" class="pub-gallery__image">${captionMarkup}</figure>`;
    };
    return `<div class="pub-gallery__block ${modifiers}">${imageMarkup(feature, 'feature')}<div class="pub-gallery__stack">${stack.map((image, stackIndex) => imageMarkup(image, 'stack', stackIndex)).join('')}</div></div>`;
  }).join('');

  return `<div class="pub-gallery">${galleryBlocks}</div>`;
}

const paidPageContent = {
  '/pub/renovation-sous-sol': {
    h1: 'Rénovation de sous-sol à Laval et dans les Laurentides',
    intro:
      'Nous venons voir votre sous-sol, puis nous vous remettons votre soumission.',
    steps: [
      ['Vous nous écrivez', 'Un formulaire de 3 étapes. Nous vous répondons sous 48 heures.'],
      ['Nous venons voir', 'La visite est sans frais. Nous mesurons le sous-sol et notons l’usage que vous visez.'],
      ['Vous recevez votre soumission', 'Les travaux prévus y sont détaillés. La soumission est sans frais.'],
      ['On réalise les travaux', 'Une équipe, un ordre de travail clair, de la structure aux finitions.'],
    ],
    includedTitle: 'Un sous-sol fini au complet, par une seule équipe',
    includedIntro:
      'Salle familiale, chambre, bureau ou salle de bain : vous n’avez pas à coordonner plusieurs entrepreneurs. Nous nous occupons de tout.',
    included: [
      ['La structure et l’isolation', ['Divisions et cloisons', 'Isolation des murs et du plafond', 'Insonorisation si vous la voulez']],
      ['La plomberie et l’électricité', ['Salle de bain ou salle d’eau', 'Prises, éclairage, chauffage', 'Ventilation de l’espace']],
      ['Les finitions', ['Plancher, gypse, peinture', 'Portes, moulures, rangements', 'Plafond et escalier']],
    ],
    visit: [
      ['L’humidité', 'Les traces d’eau, les odeurs et l’état des murs de fondation.'],
      ['La hauteur', 'Les poutres, les conduits et les tuyaux qui descendent du plafond.'],
      ['La dalle', 'La position des drains, si vous voulez une salle de bain.'],
      ['Les fenêtres', 'Leur taille et leur sortie, surtout si vous voulez une chambre.'],
    ],
    checklist: [
      'L’usage que vous voulez donner à la pièce',
      'Les pièces fermées souhaitées (chambre, bureau)',
      'Les traces d’humidité que vous avez déjà vues',
      'Votre budget approximatif',
    ],
    galleryTitle: 'Des sous-sols transformés en pièces de vie',
    galleryIntro: 'Quelques projets menés de la structure aux finitions, parmi les 500 réalisés depuis 25 ans.',
    ctaText: 'Dites-nous ce que vous voulez faire de votre sous-sol. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte l’aménagement d’un sous-sol?', 'Le prix dépend de la superficie, des pièces à fermer et des travaux de plomberie ou d’électricité nécessaires. Nous venons voir votre sous-sol, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Que faire s’il y a de l’humidité?', 'Il faut régler la cause avant de fermer les murs. Pendant la visite, nous cherchons les traces d’eau et les odeurs, puis nous vous disons ce qui doit être corrigé en premier.'],
      ['Peut-on aménager une chambre au sous-sol?', 'Souvent oui. Il faut une fenêtre qui sert de sortie et une hauteur suffisante. Nous vérifions ces points sur place et nous validons les exigences de votre municipalité.'],
      ['Peut-on ajouter une salle de bain s’il n’y a rien de prévu?', 'C’est possible dans bien des cas. Tout dépend de la position du drain principal et de la dalle de béton. Nous le vérifions pendant la visite.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Structure, isolation, plomberie, électricité, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.'],
    ],
  },
  '/pub/renovation-salle-de-bain': {
    h1: 'Rénovation de salle de bain à Laval et dans les Laurentides',
    intro:
      'Nous venons voir votre salle de bain, puis nous vous remettons votre soumission.',
    steps: [
      ['Vous nous écrivez', 'Un formulaire de 3 étapes. Nous vous répondons sous 48 heures.'],
      ['Nous venons voir', 'La visite est sans frais. Nous mesurons la pièce et notons ce qui doit changer.'],
      ['Vous recevez votre soumission', 'Les travaux prévus y sont détaillés. La soumission est sans frais.'],
      ['On réalise les travaux', 'Une équipe, un ordre de travail clair, de la démolition aux finitions.'],
    ],
    includedTitle: 'Une salle de bain refaite au complet, par une seule équipe',
    includedIntro:
      'Vous n’avez pas à engager un plombier, un électricien et un céramiste chacun de leur côté. Nous nous occupons de tout.',
    included: [
      ['La démolition et la préparation', ['Retrait de l’ancienne salle de bain', 'Protection du reste de la maison', 'Plancher et murs remis d’aplomb']],
      ['La plomberie et la ventilation', ['Douche, bain, toilette, vanité', 'Membrane étanche dans la douche', 'Ventilateur évacué vers l’extérieur']],
      ['La céramique et les finitions', ['Céramique au sol et aux murs', 'Vanité, miroir, robinetterie', 'Éclairage, prises et peinture']],
    ],
    visit: [
      ['L’eau', 'Où sont l’entrée d’eau et le drain, et jusqu’où on peut les déplacer.'],
      ['Le plancher', 'L’état du sous-plancher et le sens des solives.'],
      ['L’air', 'Le ventilateur, son parcours vers l’extérieur et les traces d’humidité.'],
      ['L’électricité', 'Les prises, l’éclairage et le panneau, surtout pour un plancher chauffant.'],
    ],
    checklist: [
      'Ce qui vous dérange aujourd’hui',
      'Des photos ou des idées que vous aimez',
      'Bain, douche ou les deux',
      'Votre budget approximatif',
    ],
    galleryTitle: 'Des salles de bain terminées par notre équipe',
    galleryIntro: 'Quelques projets menés de la démolition aux finitions, parmi les 500 réalisés depuis 25 ans.',
    ctaText: 'Dites-nous ce que vous voulez changer dans votre salle de bain. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte une rénovation de salle de bain?', 'Le prix dépend de la grandeur de la pièce, des matériaux et des travaux de plomberie nécessaires. Nous venons voir la pièce, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Combien de temps dure le chantier?', 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.'],
      ['Peut-on déplacer la toilette, le bain ou la douche?', 'Souvent oui. Tout dépend de la position du drain et de la structure du plancher. Nous le vérifions pendant la visite avant de vous confirmer le plan.'],
      ['Peut-on remplacer le bain par une grande douche?', 'Oui, c’est une demande fréquente. Nous regardons l’espace disponible, le drain et l’étanchéité à prévoir, puis nous vous proposons ce qui entre dans la pièce.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Démolition, plomberie, ventilation, électricité, céramique et finitions sont coordonnées par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.'],
    ],
  },
  '/pub/renovation-cuisine': {
    h1: 'Rénovation de cuisine à Laval et dans les Laurentides',
    intro:
      'Nous venons voir votre cuisine, puis nous vous remettons votre soumission.',
    steps: [
      ['Vous nous écrivez', 'Un formulaire de 3 étapes. Nous vous répondons sous 48 heures.'],
      ['Nous venons voir', 'La visite est sans frais. Nous mesurons et nous écoutons ce que vous voulez changer.'],
      ['Vous recevez votre soumission', 'Les travaux prévus y sont détaillés. La soumission est sans frais.'],
      ['On réalise les travaux', 'Une équipe, un ordre de travail clair, du premier coup de marteau aux finitions.'],
    ],
    includedTitle: 'Une cuisine refaite au complet, par une seule équipe',
    includedIntro:
      'Vous n’avez pas à engager un plombier, un électricien et un menuisier chacun de leur côté. Nous nous occupons de tout.',
    included: [
      ['La démolition et la préparation', ['Retrait de l’ancienne cuisine', 'Protection des pièces voisines', 'Murs et planchers remis d’aplomb']],
      ['La plomberie et l’électricité', ['Évier, lave-vaisselle, hotte', 'Prises, éclairage, îlot', 'Ventilation vers l’extérieur']],
      ['Les armoires et les finitions', ['Armoires, comptoirs, dosseret', 'Plancher et peinture', 'Poignées, moulures, retouches']],
    ],
    visit: [
      ['L’espace', 'Les dimensions, les passages et les portes qui s’ouvrent.'],
      ['Les murs', 'Ce qu’on peut ouvrir et ce qui soutient la maison.'],
      ['La tuyauterie et les fils', 'Où sont l’eau, le drain, la ventilation et le panneau électrique.'],
      ['Vos appareils', 'Ceux que vous gardez et ceux que vous remplacez.'],
    ],
    checklist: [
      'Ce qui vous dérange dans la cuisine actuelle',
      'Des photos ou des idées que vous aimez',
      'Les électroménagers que vous gardez',
      'Votre budget approximatif',
    ],
    galleryTitle: 'Des cuisines terminées par notre équipe',
    galleryIntro: 'Quelques projets menés de la démolition aux finitions, parmi les 500 réalisés depuis 25 ans.',
    ctaText: 'Dites-nous ce que vous voulez changer dans votre cuisine. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte une rénovation de cuisine?', 'Le prix dépend de la grandeur de la pièce, des matériaux et des travaux de plomberie ou d’électricité nécessaires. Nous venons voir votre cuisine, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Combien de temps dure le chantier?', 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.'],
      ['Peut-on ouvrir le mur entre la cuisine et le salon?', 'Souvent oui. Nous vérifions d’abord si le mur soutient la maison. Si c’est le cas, un renfort est prévu au plan avant les travaux.'],
      ['Est-ce que je peux rester chez moi pendant les travaux?', 'La plupart des clients restent à la maison. Nous protégeons les pièces voisines et nous convenons avec vous des accès à garder libres.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Démolition, plomberie, électricité, armoires, comptoirs, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.'],
    ],
  },
  '/pub/agrandissement-maison': {
    h1: 'Agrandissement de maison à Laval et dans les Laurentides',
    intro:
      'Nous venons voir votre maison et votre terrain, puis nous vous remettons votre soumission.',
    steps: [
      ['Vous nous écrivez', 'Un formulaire de 3 étapes. Nous vous répondons sous 48 heures.'],
      ['Nous venons voir', 'La visite est sans frais. Nous regardons la maison, le terrain et l’espace que vous voulez gagner.'],
      ['Vous recevez votre soumission', 'Les travaux prévus y sont détaillés. La soumission est sans frais.'],
      ['On réalise les travaux', 'Une équipe, un ordre de travail clair, de la fondation aux finitions.'],
    ],
    includedTitle: 'Un agrandissement mené de la fondation aux finitions, par une seule équipe',
    includedIntro:
      'Vous n’avez pas à engager un excavateur, un charpentier, un couvreur et un finisseur chacun de leur côté. Nous nous occupons de tout.',
    included: [
      ['La fondation et la structure', ['Fondation ou dalle selon le projet', 'Charpente de l’agrandissement', 'Ouverture du mur existant']],
      ['L’enveloppe et la toiture', ['Toiture raccordée à l’existant', 'Isolation, pare-air et fenêtres', 'Revêtement extérieur']],
      ['Les finitions, dedans comme dehors', ['Plomberie et électricité de l’ajout', 'Gypse, plancher, peinture', 'Raccords avec les pièces existantes']],
    ],
    visit: [
      ['Le terrain', 'L’espace autour de la maison, la pente et les accès pour la machinerie.'],
      ['La structure existante', 'Le mur à ouvrir, la fondation en place et ce qui soutient la maison.'],
      ['La toiture', 'Comment le nouveau toit se raccorde à l’ancien et où l’eau s’écoule.'],
      ['Les services', 'L’électricité, la plomberie et le chauffage à prolonger dans le nouvel espace.'],
    ],
    checklist: [
      'L’usage que vous voulez donner à l’espace ajouté',
      'Le certificat de localisation, si vous l’avez',
      'Des photos ou des idées que vous aimez',
      'Votre budget approximatif',
    ],
    galleryTitle: 'Des agrandissements terminés par notre équipe',
    galleryIntro: 'Quelques projets menés de la fondation aux finitions, parmi les 500 réalisés depuis 25 ans.',
    ctaText: 'Dites-nous l’espace que vous voulez gagner. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte un agrandissement de maison?', 'Le prix dépend de la superficie ajoutée, du type de fondation, de la toiture et des finitions choisies. Nous venons voir la maison et le terrain, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Combien de temps durent les travaux?', 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.'],
      ['Faut-il un permis de la municipalité?', 'Un agrandissement demande presque toujours un permis, et les règles changent d’une municipalité à l’autre. Nous en parlons pendant la visite et nous vous disons ce qui doit être obtenu avant le début des travaux.'],
      ['Peut-on ajouter un étage plutôt qu’agrandir au sol?', 'C’est possible dans bien des cas, quand la fondation et la structure peuvent porter un étage de plus. C’est l’un des points que nous vérifions pendant la visite.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Fondation, charpente, toiture, revêtement, plomberie, électricité et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.'],
    ],
  },
};

const paidPageEnhancements = {
  'renovation-cuisine': {
    hero: ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg', 'Cuisine rénovée avec îlot central, armoires en bois et salle à manger attenante', 1600, 1200],
    thumbsLabel: 'Cuisines réalisées',
    thumbs: [
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2023-ilot-bois-p-500.jpg', 'Cuisine avec îlot en bois, armoires noires et comptoir clair', 500, 333],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-500.jpg', 'Cuisine blanche avec îlot et fenêtre donnant sur la cour', 500, 375],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-500.jpg', 'Cuisine avec îlot, armoires en bois et luminaires suspendus', 500, 375],
    ],
    cardImages: [
      ['/images/INT%C3%89RIEUR/Cuisine/20221021_145939-p-800.jpg', 'Cuisine refaite avec hotte au-dessus de l’îlot et armoires deux tons', 800, 1067],
      ['/images/INT%C3%89RIEUR/Cuisine/20250106_124707-p-800.jpg', 'Cuisine blanche avec cuisinière, hotte encastrée et électroménagers en inox', 800, 1067],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine%20st%20jerome%20apres.png', 'Cuisine rénovée à Saint-Jérôme avec armoires claires et comptoir contrastant', 940, 788],
    ],
    detailsTitle: 'Le détail qui change une cuisine',
    detailsIntro:
      'Ces trois photos viennent de cuisines que nous avons livrées. Voici ce qu’on y remarque de près.',
    details: [
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2023-ilot-bois-p-1600.jpg', 'Cuisine avec îlot en bois, armoires noires, comptoir clair et suspensions', 1600, 1067, 'Îlot et contraste des matériaux', 'Le bois de l’îlot, les armoires foncées et le comptoir clair créent un point central chaleureux.'],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-1600.jpg', 'Cuisine blanche avec fenêtre, évier sous la fenêtre et îlot central', 1600, 1200, 'Lumière naturelle et espace de travail', 'La fenêtre éclaire le plan de travail et l’îlot garde une circulation pratique autour de la cuisine.'],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg', 'Cuisine avec armoires en bois, îlot central, dosseret en pierre et salle à manger', 1600, 1200, 'Cuisine et salle à manger coordonnées', 'Les armoires, le dosseret et le plancher prolongent la cuisine jusque dans l’espace repas.'],
    ],
    visitImage: ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-1600.jpg', 'Cuisine blanche avec îlot, dosseret en petits carreaux et grande fenêtre', 1600, 1200],
    ctaImage: ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg', 1600, 1200],
    reviews: [paidReviews.melodie, paidReviews.isabelle, paidReviews.johanne],
    images: [
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2023-ilot-bois-p-1600.jpg', 'Cuisine avec îlot en bois, armoires noires et comptoir clair', 1600, 1067, 'Îlot en bois et armoires noires'],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg', 'Cuisine avec îlot central, armoires en bois et salle à manger attenante', 1600, 1200, 'Cuisine et salle à manger'],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-1600.jpg', 'Cuisine blanche avec fenêtre, îlot central et dosseret en petits carreaux', 1600, 1200, 'Cuisine blanche et fenêtre'],
      ['/images/INT%C3%89RIEUR/Cuisine/2403-p-1600.jpg', 'Détail d’une cuisine avec éclairage sous les armoires', 1600, 2133, 'Éclairage de travail sous les armoires'],
    ],
    label: 'Entrepreneur en rénovation',
  },
  'renovation-salle-de-bain': {
    hero: ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-1600.jpg', 'Salle de bain avec vanité en bois, grande douche vitrée et céramique grise', 1600, 1200],
    thumbsLabel: 'Salles de bain réalisées',
    thumbs: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-bain-autoportant-p-500.jpg', 'Salle de bain avec bain autoportant, robinetterie noire et plancher gris', 500, 375],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-500.jpg', 'Salle de bain avec vanité en bois et douche vitrée', 500, 375],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-vanite-noire-p-500.jpg', 'Salle de bain avec vanité noire, mur hexagonal et douche vitrée', 500, 667],
    ],
    cardImages: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20220511_145711-p-800.jpg', 'Salle de bain refaite avec bain, mur de céramique blanche et plancher de terrazzo', 800, 1067],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241018_153927-p-800.jpg', 'Salle de bain avec douche d’angle vitrée, vanité blanche et murs foncés', 800, 1067],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20220511_145731-p-800.jpg', 'Vanité suspendue en bois, miroir rond et plancher de terrazzo', 800, 1067],
    ],
    detailsTitle: 'Le détail qui change une salle de bain',
    detailsIntro:
      'Ces trois photos viennent de salles de bain que nous avons livrées. Voici ce qu’on y remarque de près.',
    details: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-1600.jpg', 'Salle de bain avec vanité en bois, grande douche vitrée et céramique grise', 1600, 1200, 'Douche et vanité coordonnées', 'La vanité en bois et la douche vitrée se répondent dans une pièce claire et fonctionnelle.'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vitre-p-800.jpg', 'Douche vitrée avec grande céramique grise et robinetterie noire', 800, 1067, 'Douche vitrée et céramique', 'La grande douche vitrée met en valeur la céramique et garde la pièce visuellement ouverte.'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2023-vanite-bois-p-800.jpg', 'Vanité en bois avec lavabo noir, miroirs ronds et dosseret décoratif', 800, 1067, 'Vanité et mur accent', 'La vanité en bois et le mur accent donnent du caractère à cette salle de bain sans alourdir l’espace.'],
    ],
    visitImage: ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vitre-p-1600.jpg', 'Douche vitrée avec grande céramique grise et robinetterie noire', 1200, 1600],
    ctaImage: ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-bain-autoportant-p-1600.jpg', 1600, 1200],
    reviews: [paidReviews.isabelle, paidReviews.melodie, paidReviews.johanne],
    images: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-bain-autoportant-p-1600.jpg', 'Salle de bain avec bain autoportant blanc, robinetterie noire et plancher gris', 1600, 1200, 'Bain autoportant et robinetterie noire'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-1600.jpg', 'Salle de bain avec vanité en bois, grande douche vitrée et céramique grise', 1600, 1200, 'Vanité en bois et douche vitrée'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vitre-p-1600.jpg', 'Douche vitrée avec grande céramique grise et robinetterie noire', 1200, 1600, 'Grande douche vitrée'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-vanite-noire-p-1600.jpg', 'Salle de bain avec vanité noire, mur hexagonal et douche vitrée', 1200, 1600, 'Vanité noire et mur hexagonal'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2023-vanite-bois-p-1600.jpg', 'Salle de bain avec vanité en bois, lavabo noir et mur décoratif', 1200, 1600, 'Vanité en bois et lavabo noir'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2024-douche-vanite-p-1600.jpg', 'Salle de bain avec meuble-lavabo en bois, douche vitrée et porte coulissante', 1200, 1600, 'Meuble-lavabo et porte coulissante'],
    ],
    label: 'Entrepreneur en rénovation',
  },
  'renovation-sous-sol': {
    hero: ['/images/INT%C3%89RIEUR/randoms/20260224_143901_1787769689776.jpg', 'Sous-sol aménagé avec escalier, portes et plancher de bois', 4000, 3000],
    thumbsLabel: 'Sous-sols réalisés',
    thumbs: [
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142_1787769672173-p-500.jpg', 'Salle polyvalente au sous-sol avec portes françaises', 500, 375],
      ['/images/INT%C3%89RIEUR/randoms/20260224_144034_1787769693505-p-500.jpg', 'Sous-sol en cours d’aménagement avec escalier et plafond suspendu', 500, 375],
      ['/images/INT%C3%89RIEUR/randoms/IMG_20231107_093929_1787769698943-p-500.jpg', 'Cuisine aménagée dans un sous-sol lumineux', 500, 375],
    ],
    cardImages: [
      ['/images/INT%C3%89RIEUR/randoms/20230223_130423_1787769737375-p-800.jpg', 'Sous-sol avec escalier, garde-corps et plancher de bois', 800, 600],
      ['/images/INT%C3%89RIEUR/randoms/20260224_144034_1787769693505-p-800.jpg', 'Sous-sol en cours d’aménagement avec câblage et plafond suspendu', 800, 600],
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142_1787769672173-p-800.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 800, 600],
    ],
    detailsTitle: 'Un sous-sol pensé jusque dans les détails',
    detailsIntro:
      'Voici quelques éléments qui donnent au sous-sol une vraie finition et une utilisation agréable au quotidien.',
    details: [
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142_1787769672173-p-1600.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 1600, 1200, 'Plancher et portes', 'Le plancher, les portes et les moulures donnent une finition propre et durable à la pièce.'],
      ['/images/INT%C3%89RIEUR/randoms/20260224_143901_1787769689776-p-1600.jpg', 'Sous-sol aménagé avec escalier, portes et plancher de bois', 1600, 1200, 'Escalier et accès', 'L’escalier et les accès sont intégrés à l’aménagement pour garder une circulation naturelle.'],
      ['/images/INT%C3%89RIEUR/randoms/IMG_20231107_093929_1787769698943-p-1600.jpg', 'Cuisine aménagée dans un sous-sol avec îlot central et armoires', 1600, 1200, 'Cuisine et rangement', 'Une cuisine et des rangements bien intégrés rendent l’aire de vie du sous-sol vraiment utile.'],
    ],
    visitImage: ['/images/INT%C3%89RIEUR/randoms/20260224_144034_1787769693505.jpg', 'Sous-sol en cours d’aménagement avec escalier, câblage et plafond suspendu', 4000, 3000],
    visitNote: [
      'L’humidité ne se cache pas sous le gypse',
      'Si vous avez déjà vu de l’eau, une odeur ou de la peinture qui pèle, dites-le-nous. Ça change l’ordre des travaux.',
    ],
    ctaImage: ['/images/INT%C3%89RIEUR/randoms/20260224_143901_1787769689776.jpg', 4000, 3000],
    reviews: [paidReviews.johanne, paidReviews.melodie, paidReviews.isabelle],
    images: [
      ['/images/INT%C3%89RIEUR/randoms/20260224_143901_1787769689776.jpg', 'Sous-sol aménagé avec escalier, portes et plancher de bois', 4000, 3000, 'Escalier et aire de vie aménagés'],
      ['/images/INT%C3%89RIEUR/randoms/20260224_144034_1787769693505.jpg', 'Sous-sol en cours d’aménagement avec escalier, câblage et plafond suspendu', 4000, 3000, 'Travaux en cours dans l’aire de vie'],
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142_1787769672173.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 4000, 3000, 'Salle polyvalente avec finitions complètes'],
      ['/images/INT%C3%89RIEUR/randoms/IMG_20231107_093929_1787769698943.jpg', 'Cuisine aménagée dans un sous-sol avec îlot central et armoires', 4000, 3000, 'Cuisine et aire de vie au sous-sol'],
    ],
    label: 'Entrepreneur en rénovation',
  },
  'agrandissement-maison': {
    hero: ['/images/upscale-house-1-min-1-p-1600.webp', 'Maison agrandie à l’arrière avec un volume contemporain vitré, éclairé en soirée', 1600, 1044],
    thumbsLabel: 'Agrandissements réalisés',
    thumbs: [
      ['/images/ajout-etage-01-p-500.jpeg', 'Chantier d’ajout d’étage : charpente montée au-dessus d’une maison en hiver', 500, 375],
      ['/images/relume-655431-p-500.jpeg', 'Agrandissement terminé avec revêtement de bois et de métal', 500, 779],
      ['/images/relume-655499-p-500.jpeg', 'Agrandissement à l’arrière d’une maison avec terrasse de bois', 500, 667],
    ],
    cardImages: [
      ['/images/ajout-etage-01-p-800.jpeg', 'Charpente d’un ajout d’étage montée au-dessus d’une maison en hiver', 800, 600],
      ['/images/relume-655441-p-800.jpeg', 'Chantier résidentiel : murs recouverts de pare-air avant la pose du revêtement', 800, 1066],
      ['/images/relume-655431-p-800.jpeg', 'Agrandissement terminé avec revêtement de bois et de métal', 800, 1247],
    ],
    detailsTitle: 'Un ajout qui ne se voit pas comme un ajout',
    detailsIntro:
      'Ces trois photos viennent de chantiers d’agrandissement. Voici ce qu’on y remarque de près.',
    details: [
      ['/images/relume-655431-p-1600.jpeg', 'Façade d’un agrandissement avec revêtement de bois, panneaux foncés et grandes fenêtres', 1600, 2493, 'Le revêtement et les ouvertures', 'Les matériaux et les fenêtres de l’ajout suivent les lignes de la maison pour que le volume reste dans le même ton.'],
      ['/images/relume-655434-p-1600.jpeg', 'Étage ajouté vu de l’intérieur, plafond mansardé refermé et plancher de bois protégé', 1600, 1200, 'L’étage ajouté avant la peinture', 'À l’intérieur, le nouvel espace est fermé, isolé et prêt pour le plancher, la peinture et les moulures.'],
      ['/images/relume-655496-p-1600.jpeg', 'Toiture et lucarnes refaites au-dessus d’une maison en pierre pendant les travaux', 1600, 1200, 'Le raccord de toiture', 'La toiture et les lucarnes sont reprises pour que le raccord reste étanche et que l’eau s’écoule au bon endroit.'],
    ],
    visitImage: ['/images/relume-655499-p-1600.jpeg', 'Maison agrandie à l’arrière avec grandes portes vitrées et terrasse de bois', 1600, 2133],
    ctaImage: ['/images/upscale-house-1-min-1-p-1600.webp', 1600, 1044],
    reviews: [paidReviews.johanne, paidReviews.melodie, paidReviews.isabelle],
    images: [
      ['/images/upscale-house-1-min-1-p-1600.webp', 'Maison agrandie à l’arrière avec un volume contemporain vitré', 1600, 1044, 'Agrandissement contemporain à l’arrière'],
      ['/images/relume-655431-p-1600.jpeg', 'Agrandissement terminé avec revêtement de bois et de métal', 1600, 2493, 'Revêtement de bois et de métal'],
      ['/images/relume-655496-p-1600.jpeg', 'Toiture et lucarnes refaites sur une maison en pierre', 1600, 1200, 'Toiture et lucarnes reprises'],
      ['/images/relume-655499-p-1600.jpeg', 'Agrandissement à l’arrière d’une maison avec portes vitrées et terrasse', 1600, 2133, 'Pièce ajoutée ouverte sur la cour'],
    ],
    label: 'Entrepreneur en agrandissement',
  },
};

function createPaidStaticBody(content, routePath) {
  const serviceSlug = routePath.replace('/pub/', '');
  const extra = paidPageEnhancements[serviceSlug];
  const cta = `<a class="inline-flex rounded-none bg-primary px-6 py-3 font-semibold text-white" href="/pub/formulaire?service=${escapeHtml(serviceSlug)}">Obtenir ma soumission sans frais</a>`;
  // Mêmes faits que le composant PubProofBar de la version React.
  const proofBar = `<section aria-label="Ce que vous obtenez en nous écrivant" class="bg-secondary py-6 text-white"><div class="container-large mx-auto max-w-7xl px-6"><ul class="flex flex-wrap gap-8"><li><strong>Réponse sous 48 h</strong> — à chaque demande reçue</li><li><strong>Estimation sans frais</strong> — visite comprise</li><li><strong>500+ projets complétés</strong> — en 25 ans</li><li><strong>Laval et les Laurentides</strong> — 9 municipalités desservies</li></ul></div></section>`;
  // Même structure que le composant PubNavLinks (variante « bar »).
  const nav = createPaidNav(Boolean(extra.details))
    .map(([id, label]) =>
      `<a href="#${escapeHtml(id)}" class="pub-header-nav__link" data-active="false">${escapeHtml(label)}</a>`)
    .join('');
  const headerNav = `<div class="pub-section-nav"><nav aria-label="Sections de la page" class="pub-header-nav pub-header-nav--bar" data-testid="pub-toc"><div class="pub-header-nav__list no-scrollbar">${nav}</div></nav></div>`;
  const images = createPaidGalleryMarkup(extra.images);
  const [heroSrc, heroAlt, heroWidth, heroHeight] = extra.hero;
  const heroThumbs = extra.thumbs
    .map(([src, alt, width, height]) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy">`)
    .join('');
  const [visitSrc, visitAlt, visitWidth, visitHeight] = extra.visitImage;
  const included = content.included.map(([title, points], index) => {
    const [src, alt, width, height] = extra.cardImages[index];
    return `<article><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy"><h3>${escapeHtml(title)}</h3><ul>${points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></article>`;
  }).join('');
  const details = extra.details
    ? `<section id="finitions" class="bg-secondary py-20 text-white"><div class="container-large mx-auto max-w-7xl px-6"><p>Les finitions</p><h2>${escapeHtml(extra.detailsTitle)}</h2><p>${escapeHtml(extra.detailsIntro)}</p>${extra.details
        .map(([src, alt, width, height, caption, text]) =>
          `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy"><figcaption><strong>${escapeHtml(caption)}</strong> ${escapeHtml(text)}</figcaption></figure>`)
        .join('')}</div></section>`
    : '';
  const reviews = extra.reviews
    .map(([quote, author]) =>
      `<figure><p>5 étoiles sur 5</p><blockquote>« ${escapeHtml(quote)} »</blockquote><figcaption><strong>${escapeHtml(author)}</strong>, propriétaire</figcaption></figure>`)
    .join('');
  const [ctaSrc, ctaWidth, ctaHeight] = extra.ctaImage;
  const ctaImage = `<img src="${escapeHtml(ctaSrc)}" alt="" aria-hidden="true" width="${ctaWidth}" height="${ctaHeight}" loading="lazy">`;
  const serviceArea = `<section class="pt-12 pb-12 md:pt-16 md:pb-20"><div class="container-large mx-auto max-w-7xl px-6"><p><strong>Nous travaillons à</strong></p><ul>${paidServiceCities.map((city) => `<li>${escapeHtml(city)}</li>`).join('')}</ul><p>${escapeHtml(paidServiceNote)}</p></div></section>`;
  const steps = content.steps.map(([title, text], index) =>
    `<li><strong>0${index + 1} — ${escapeHtml(title)}</strong> ${escapeHtml(text)}</li>`).join('');
  const visit = content.visit.map(([title, text]) => `<div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`).join('');
  // Encadré propre à la page sous-sol, entre les points de visite et la liste de préparation.
  const visitNote = extra.visitNote
    ? `<div><h3>${escapeHtml(extra.visitNote[0])}</h3><p>${escapeHtml(extra.visitNote[1])}</p></div>`
    : '';
  const checklist = content.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const faqItems = content.faqs.map(([question, answer]) =>
    `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('');
  return `${staticSiteHeader}${headerNav}
  <main><section class="bg-secondary py-20 text-white"><div class="container-large mx-auto max-w-5xl px-6"><img src="${escapeHtml(heroSrc)}" alt="${escapeHtml(heroAlt)}" width="${heroWidth}" height="${heroHeight}"><p class="text-primary font-bold uppercase tracking-widest mb-4">${escapeHtml(extra.label)}</p><h1 class="text-4xl md:text-6xl font-bold mb-6">${escapeHtml(content.h1)}</h1><p class="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">${escapeHtml(content.intro)}</p><ul class="flex flex-wrap gap-4 mb-8"><li class="border border-white/25 bg-white/10 px-4 py-2">19 avis Google 5 étoiles</li><li class="border border-white/25 bg-white/10 px-4 py-2">Licence RBQ : 8351-9033-59</li></ul>${cta}<p>${escapeHtml(extra.thumbsLabel)}</p>${heroThumbs}</div></section>
  ${proofBar}
     <section id="inclus" class="pub-section-grid py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>Ce qui est inclus</p><h2>${escapeHtml(content.includedTitle)}</h2><p>${escapeHtml(content.includedIntro)}</p>${included}<p>Visite et estimation sans frais, réponse sous 48 heures.</p>${cta}</div></section>
   <section id="etapes" class="pub-section-muted py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>Comment ça se passe</p><h2>Quatre étapes simples</h2><ol>${steps}</ol><p>Plus de 500 projets complétés, 19 avis Google 5 étoiles.</p>${cta}</div></section>
  ${details}
   <section id="visite" class="pub-section-grid py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>La visite</p><h2>Ce que nous regardons chez vous</h2><p>La visite est sans frais. Elle sert à chiffrer votre projet correctement.</p>${visit}${visitNote}<h3>À préparer pour la visite</h3><ul>${checklist}</ul><img src="${escapeHtml(visitSrc)}" alt="${escapeHtml(visitAlt)}" width="${visitWidth}" height="${visitHeight}" loading="lazy"></div></section>
   <section id="avis" class="pub-section-muted py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>Avis Google</p><h2>${escapeHtml(paidReviewsTitle)}</h2><p>${escapeHtml(paidReviewsIntro)}</p>${reviews}</div></section>
  <section id="realisations" class="bg-muted py-20"><div class="container-large mx-auto max-w-7xl px-6"><h2>${escapeHtml(content.galleryTitle)}</h2><p>${escapeHtml(content.galleryIntro)}</p>${images}</div></section>
   <section id="faq" class="pub-section-muted py-20"><div class="container-large mx-auto max-w-4xl px-6"><p>Questions fréquentes</p><h2>Ce que les propriétaires nous demandent</h2>${faqItems}</div></section>
   ${serviceArea}
  <section class="bg-secondary py-20 text-white text-center">${ctaImage}<div class="container-large mx-auto max-w-4xl px-6"><h2>Prêt à recevoir votre soumission?</h2><p class="mb-8">${escapeHtml(content.ctaText)}</p>${cta}</div></section></main>
  ${staticSiteFooter}`;
}

function createFallbackSource(appShell, route) {
  const content = paidPageContent[route.path];
  let bodyContent;

  if (content) {
    bodyContent = createPaidStaticBody(content, route.path);
  } else if (route.path === '/pub/formulaire') {
    // Même ordre de lecture que la version React : entête avec photo, formulaire,
    // réassurance, puis questions fréquentes en section distincte.
    bodyContent = `${staticSiteHeader}
    <main><section class="pub-form-hero"><img src="/images/relume-655417.jpeg" width="2560" height="1920" alt="" aria-hidden="true" class="pub-form-hero__image"><div class="pub-form-hero__scrim" aria-hidden="true"></div><div class="pub-form-hero__inner"><p class="pub-form-hero__label">Demande de soumission</p><h1 class="pub-form-hero__title">Parlons de votre projet de rénovation</h1><p>Dites-nous ce que vous voulez rénover à Laval ou dans les Laurentides. Nous vous répondons sous 48 heures. La visite et l’estimation sont sans frais.</p></div></section>
     <section id="formulaire" class="pub-form-section py-16" aria-labelledby="formulaire-title"><div class="container-large mx-auto max-w-6xl px-6"><h2 id="formulaire-title">Parlez-nous de votre projet</h2><p>Le formulaire vous demande le type de travaux, votre budget approximatif, ce que vous voulez changer, la ville du projet, l’échéancier souhaité et vos coordonnées. Nous vous répondons sous 48 heures.</p><p>Le formulaire s’affiche dès que les fonctions de sécurité de la page sont chargées.</p><noscript><p>JavaScript est requis pour transmettre la demande en ligne. Vous pouvez aussi appeler SLC Habitation au <a href="tel:5144048494">(514) 404-8494</a>.</p></noscript><ul><li>Licence RBQ : 8351-9033-59</li><li>19 avis Google, tous 5 étoiles</li><li>Estimation sans frais, visite comprise</li></ul><figure class="pub-quote"><blockquote class="pub-quote__text">Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!</blockquote><figcaption class="pub-quote__author"><span class="pub-quote__name">Isabelle Baril</span> <span class="pub-quote__role">Avis Google</span></figcaption></figure><p>Vous préférez en parler de vive voix? <a href="tel:5144048494">(514) 404-8494</a></p></div></section>
     ${createFormGalleryMarkup()}
     <section id="faq" class="bg-muted py-16"><div class="container-large mx-auto max-w-4xl px-6"><p>Questions fréquentes</p><h2>Ce que les propriétaires nous demandent</h2><details><summary>Que se passe-t-il après l’envoi du formulaire?</summary><p>Nous vous répondons sous 48 heures et nous convenons d’une visite sans frais. Votre soumission est préparée à partir de cette visite.</p></details><details><summary>Quand les travaux peuvent-ils commencer?</summary><p>L’échéancier vous est donné après la visite, avec votre soumission. Il dépend de l’ampleur des travaux et de nos disponibilités.</p></details><details><summary>Est-ce que la soumission est payante?</summary><p>Non. La visite et l’estimation sont sans frais. SLC Habitation détient la licence RBQ 8351-9033-59.</p></details></div></section></main>
    ${staticSiteFooter}`;
  } else {
    // Les pages sans contenu statique dédié gardent tout de même la vraie
    // navbar et le vrai pied de page, comme leur rendu React.
    bodyContent = `${staticSiteHeader}<main class="min-h-screen bg-background py-16"><div class="container-large px-6 mx-auto max-w-3xl"><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p></div></main>${staticSiteFooter}`;
  }

  // Les pages publicitaires s'affichent dans le conteneur `.pub-shell`, qui porte
  // les jetons de couleur et l'isolation vis-à-vis du CSS hérité de Webflow.
  const shelledBodyContent = route.path.startsWith('/pub/')
    ? `<div class="pub-shell">${bodyContent}</div>`
    : bodyContent;

  return appShell.replace(
    /<body[^>]*>[\s\S]*?<\/body>/i,
    `<body><div id="root">${shelledBodyContent}</div></body>`,
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
  ${routesNeedingAppStyles.has(route.path) ? appStylesheet : ''}
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
  let sourceHtml = route.source
    ? await readFile(path.join(sourceDir, route.source), 'utf8')
    : createFallbackSource(appShell, route);

  if (route.source === 'soumission.html') {
    // Version statique du formulaire progressif, affichée avant l'hydratation.
    sourceHtml = prepareSoumissionMarkup(sourceHtml, soumissionFormStaticMarkup);
  }

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
