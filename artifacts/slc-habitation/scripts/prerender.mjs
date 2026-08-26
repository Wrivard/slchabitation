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
  ['/images/INT%C3%89RIEUR/Cuisine/20220823_074355-p-2000.jpg', 'Cuisine rénovée avec armoires claires, comptoir continu et éclairage intégré', 2000, 2667, 'Rénovation de cuisine', 'Comptoir continu'],
  ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg', 'Salle de bain lumineuse avec douche vitrée, bain et céramique blanche', 1600, 1200, 'Rénovation de salle de bain', 'Douche vitrée'],
  ['/images/relume-657406.jpeg', 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses', 2048, 1536, 'Rénovation de sous-sol', 'Aire de vie et cuisine'],
  ['/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1600.jpg', 'Cuisine avec îlot en bois, rangements blancs et suspensions', 1600, 2133, 'Rénovation de cuisine', 'Îlot en bois'],
  ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg', 'Salle de bain aux murs foncés avec douche en céramique', 1600, 2133, 'Rénovation de salle de bain', 'Palette foncée'],
  ['/images/INT%C3%89RIEUR/randoms/20241018_161142.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 4000, 3000, 'Rénovation de sous-sol', 'Salle polyvalente'],
];

function createFormGalleryMarkup() {
  const blocks = [];
  for (let index = 0; index < formGallery.length; index += 3) {
    blocks.push(formGallery.slice(index, index + 3));
  }

  const galleryBlocks = blocks.map((block, blockIndex) => {
    const [feature, ...stack] = block;
    const modifiers = [
      stack.length === 0 ? 'pub-gallery__block--single' : '',
      stack.length === 1 ? 'pub-gallery__block--pair' : '',
      stack.length > 0 && blockIndex % 2 === 1 ? 'pub-gallery__block--reverse' : '',
    ].filter(Boolean).join(' ');
    const imageMarkup = ([src, alt, width, height, category, project], variant) => {
      const label = variant === 'feature'
        ? `<figcaption class="pub-gallery__label"><span class="pub-gallery__label-category">${escapeHtml(category)}</span><span class="pub-gallery__label-project">${escapeHtml(project)}</span></figcaption>`
        : '';
      return `<figure class="pub-gallery__item pub-gallery__item--${variant}"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" class="pub-gallery__image">${label}</figure>`;
    };
    return `<div class="pub-gallery__block ${modifiers}">${imageMarkup(feature, 'feature')}<div class="pub-gallery__stack">${stack.map((image) => imageMarkup(image, 'stack')).join('')}</div></div>`;
  }).join('');

  return `<section id="realisations" class="bg-background py-16 md:py-20" data-testid="section-gallery"><div class="container-large mx-auto max-w-7xl px-6"><div class="pub-gallery-head"><div class="pub-gallery-head__main"><p class="pub-section-header__kicker">Réalisations</p><h2 class="pub-section-header__title pub-gallery-head__title">Des projets terminés par notre équipe</h2></div><div class="pub-gallery-head__aside"><p class="pub-section-header__lede pub-gallery-head__text">Cuisine, salle de bain ou sous-sol : découvrez quelques réalisations parmi les 500 projets menés depuis 18 ans.</p></div></div><div class="pub-gallery">${galleryBlocks}</div></div></section>`;
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
    galleryIntro: 'Quelques projets menés de la structure aux finitions, parmi les 500 réalisés depuis 18 ans.',
    ctaText: 'Dites-nous ce que vous voulez faire de votre sous-sol. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte l’aménagement d’un sous-sol?', 'Le prix dépend de la superficie, des pièces à fermer et des travaux de plomberie ou d’électricité nécessaires. Nous venons voir votre sous-sol, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Que faire s’il y a de l’humidité?', 'Il faut régler la cause avant de fermer les murs. Pendant la visite, nous cherchons les traces d’eau et les odeurs, puis nous vous disons ce qui doit être corrigé en premier.'],
      ['Peut-on aménager une chambre au sous-sol?', 'Souvent oui. Il faut une fenêtre qui sert de sortie et une hauteur suffisante. Nous vérifions ces points sur place et nous validons les exigences de votre municipalité.'],
      ['Peut-on ajouter une salle de bain s’il n’y a rien de prévu?', 'C’est possible dans bien des cas. Tout dépend de la position du drain principal et de la dalle de béton. Nous le vérifions pendant la visite.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Structure, isolation, plomberie, électricité, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 18 ans d’expérience.'],
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
    galleryIntro: 'Quelques projets menés de la démolition aux finitions, parmi les 500 réalisés depuis 18 ans.',
    ctaText: 'Dites-nous ce que vous voulez changer dans votre salle de bain. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte une rénovation de salle de bain?', 'Le prix dépend de la grandeur de la pièce, des matériaux et des travaux de plomberie nécessaires. Nous venons voir la pièce, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Combien de temps dure le chantier?', 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.'],
      ['Peut-on déplacer la toilette, le bain ou la douche?', 'Souvent oui. Tout dépend de la position du drain et de la structure du plancher. Nous le vérifions pendant la visite avant de vous confirmer le plan.'],
      ['Peut-on remplacer le bain par une grande douche?', 'Oui, c’est une demande fréquente. Nous regardons l’espace disponible, le drain et l’étanchéité à prévoir, puis nous vous proposons ce qui entre dans la pièce.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Démolition, plomberie, ventilation, électricité, céramique et finitions sont coordonnées par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 18 ans d’expérience.'],
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
    galleryIntro: 'Quelques projets menés de la démolition aux finitions, parmi les 500 réalisés depuis 18 ans.',
    ctaText: 'Dites-nous ce que vous voulez changer dans votre cuisine. Réponse sous 48 heures, visite sans frais.',
    faqs: [
      ['Combien coûte une rénovation de cuisine?', 'Le prix dépend de la grandeur de la pièce, des matériaux et des travaux de plomberie ou d’électricité nécessaires. Nous venons voir votre cuisine, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.'],
      ['Combien de temps dure le chantier?', 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.'],
      ['Peut-on ouvrir le mur entre la cuisine et le salon?', 'Souvent oui. Nous vérifions d’abord si le mur soutient la maison. Si c’est le cas, un renfort est prévu au plan avant les travaux.'],
      ['Est-ce que je peux rester chez moi pendant les travaux?', 'La plupart des clients restent à la maison. Nous protégeons les pièces voisines et nous convenons avec vous des accès à garder libres.'],
      ['Est-ce que vous vous occupez de tout?', 'Oui. Démolition, plomberie, électricité, armoires, comptoirs, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 18 ans d’expérience.'],
    ],
  },
};

const paidPageEnhancements = {
  'renovation-cuisine': {
    hero: ['/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg', 'Grande cuisine blanche avec îlot central et comptoirs clairs', 1600, 1200],
    thumbsLabel: 'Cuisines réalisées',
    thumbs: [
      ['/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-500.jpg', 'Cuisine avec îlot en bois et rangements blancs', 500, 667],
      ['/images/INT%C3%89RIEUR/Cuisine/20221021_145939-p-500.jpg', 'Cuisine deux tons avec hotte au-dessus du comptoir et armoires foncées', 500, 667],
      ['/images/INT%C3%89RIEUR/Cuisine/20250106_124701-p-500.jpg', 'Cuisine avec îlot et plancher clair', 500, 667],
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
      ['/images/INT%C3%89RIEUR/Cuisine/20220823_074355-p-800.jpg', 'Cuisine avec comptoir continu, armoires claires et éclairage intégré', 800, 1067, 'Comptoir continu', 'Le plan de travail file d’un mur à l’autre, sans joint apparent au passage de l’évier.'],
      ['/images/INT%C3%89RIEUR/Cuisine/2403-p-800.jpg', 'Éclairage installé sous les armoires d’une cuisine rénovée', 800, 1067, 'Éclairage sous les armoires', 'La lumière est amenée directement sur le plan de travail.'],
      ['/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-800.jpg', 'Îlot en bois avec suspensions et rangements blancs', 800, 1067, 'Îlot et rangements', 'L’îlot, les suspensions et les rangements suivent le même axe.'],
    ],
    visitImage: ['/images/INT%C3%89RIEUR/Cuisine/20250106_124701-p-1600.jpg', 'Cuisine avec îlot, plancher clair et porte coulissante en bois', 1600, 2133],
    ctaImage: ['/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg', 1600, 1200],
    reviews: [paidReviews.melodie, paidReviews.isabelle, paidReviews.johanne],
    images: [
      ['/images/INT%C3%89RIEUR/Cuisine/20220823_074355-p-2000.jpg', 'Cuisine rénovée avec armoires claires, comptoir continu et éclairage intégré', 2000, 2667, 'Plan de travail continu et armoires claires'],
      ['/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1600.jpg', 'Cuisine avec îlot en bois, rangements blancs et suspensions', 1600, 2133, 'Îlot en bois et rangements intégrés'],
      ['/images/INT%C3%89RIEUR/Cuisine/cuisine%20st%20jerome%20apres.png', 'Cuisine rénovée à Saint-Jérôme avec armoires claires et comptoir contrastant', 940, 788, 'Saint-Jérôme : armoires claires, comptoir contrastant'],
      ['/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg', 'Grande cuisine blanche avec îlot central et comptoirs clairs', 1600, 1200, 'Cuisine ouverte sur l’aire de vie'],
      ['/images/INT%C3%89RIEUR/Cuisine/2403-p-1600.jpg', 'Détail d’une cuisine avec éclairage sous les armoires', 1600, 2133, 'Éclairage de travail sous les armoires'],
      ['/images/INT%C3%89RIEUR/Cuisine/20250106_124701-p-1600.jpg', 'Cuisine avec îlot, plancher clair et porte coulissante en bois', 1600, 2133, 'Plancher clair et porte coulissante'],
      ['/images/INT%C3%89RIEUR/Cuisine/20221021_145939-p-1600.jpg', 'Cuisine refaite avec hotte au-dessus de l’îlot et armoires deux tons', 1600, 2133, 'Hotte au-dessus de l’îlot, armoires deux tons'],
      ['/images/INT%C3%89RIEUR/Cuisine/20250106_124707-p-1600.jpg', 'Cuisine blanche avec cuisinière, hotte encastrée et électroménagers en inox', 1600, 2133, 'Cuisine blanche ouverte sur l’escalier'],
    ],
    label: 'Entrepreneur en rénovation',
  },
  'renovation-salle-de-bain': {
    hero: ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20221021_145907-p-2000.jpg', 'Salle de bain avec porte de grange en bois, douche vitrée et mur de céramique hexagonale', 2000, 2667],
    thumbsLabel: 'Salles de bain réalisées',
    thumbs: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-500.jpg', 'Salle de bain lumineuse avec douche vitrée et céramique blanche', 500, 375],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-500.jpg', 'Salle de bain aux murs foncés avec douche en céramique', 500, 667],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20251024_145742-p-500.jpg', 'Salle de bain avec vanité en bois et céramique au mur', 500, 667],
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
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152903-p-800.jpg', 'Douche d’angle vitrée dans une salle de bain en céramique grand format', 800, 1067, 'Céramique grand format', 'Moins de joints au mur et au sol, et une douche vitrée sans cadre encombrant.'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190331-p-800.jpg', 'Vanité en bois avec vasque ronde, miroir rond et murs foncés', 800, 600, 'Vanité, miroir, robinetterie', 'La vanité, le miroir et la robinetterie sont alignés sur le même axe.'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241030_163611-p-800.jpg', 'Douche vitrée, toilette et colonne de rangement dans une salle de bain rénovée', 800, 600, 'Rangement et éclairage', 'La colonne de rangement est intégrée à côté de la douche, et l’éclairage est encastré au plafond.'],
    ],
    visitImage: ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230427_135113-p-1600.jpg', 'Vanité en bois clair et miroir rond dans une salle de bain rénovée', 1600, 2133],
    ctaImage: ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg', 1600, 1200],
    reviews: [paidReviews.isabelle, paidReviews.melodie, paidReviews.johanne],
    images: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg', 'Salle de bain lumineuse avec douche vitrée, bain et céramique blanche', 1600, 1200, 'Douche vitrée et céramique claire'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241030_163652-p-1600.jpg', 'Salle de bain rénovée avec vanité et grand miroir', 1600, 1200, 'Vanité, miroir et éclairage coordonnés'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg', 'Salle de bain aux murs foncés avec douche en céramique', 1600, 2133, 'Palette foncée et douche en céramique'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20240709_151409-p-1600.jpg', 'Bain autoportant et robinetterie dans une salle de bain rénovée', 1600, 1200, 'Bain autoportant et dégagements'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230410_141714-p-1600.jpg', 'Salle de bain avec douche en céramique et paroi vitrée', 1600, 2133, 'Paroi vitrée et niche de douche'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20251024_145742-p-1600.jpg', 'Salle de bain rénovée avec vanité en bois et céramique au mur', 1600, 2133, 'Vanité en bois et mur en céramique'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152903-p-1600.jpg', 'Douche d’angle vitrée avec niche en bois et céramique grand format', 1600, 2133, 'Douche vitrée et niche en bois'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190331-p-1600.jpg', 'Vanité en bois avec vasque ronde, miroir rond et murs foncés', 1600, 1200, 'Vasque ronde et miroir rond'],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241018_153927-p-1600.jpg', 'Salle de bain avec douche d’angle vitrée, vanité blanche et murs foncés', 1600, 2133, 'Douche d’angle et vanité blanche'],
    ],
    label: 'Entrepreneur en rénovation',
  },
  'renovation-sous-sol': {
    hero: ['/images/relume-657406.jpeg', 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses', 2048, 1536],
    thumbsLabel: 'Sous-sols réalisés',
    thumbs: [
      ['/images/INT%C3%89RIEUR/randoms/20241017_152123-p-500.jpg', 'Pièce de vie au sous-sol avec plancher de bois clair', 500, 375],
      ['/images/relume-655394-p-500.jpeg', 'Douche vitrée dans une salle de bain aménagée au sous-sol', 500, 667],
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142-p-500.jpg', 'Salle polyvalente au sous-sol avec portes françaises', 500, 375],
    ],
    cardImages: [
      ['/images/INT%C3%89RIEUR/randoms/PXL_20211105_201904641-p-800.jpg', 'Chantier en cours : cloisons montées, murs peints et plancher protégé', 800, 600],
      ['/images/relume-655394-p-800.jpeg', 'Douche vitrée et fenêtre basse dans une salle de bain aménagée au sous-sol', 800, 1067],
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142-p-800.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 800, 600],
    ],
    includedWide: ['/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg', 'Espace de sous-sol aménagé avec plancher de bois clair, fenêtres basses et murs beiges', 4000, 3000],
    visitImage: ['/images/INT%C3%89RIEUR/randoms/20240926_155408.jpg', 'Sous-sol dégagé avant un projet de réaménagement avec petites fenêtres et plafond suspendu', 4000, 3000],
    visitNote: [
      'L’humidité ne se cache pas sous le gypse',
      'Si vous avez déjà vu de l’eau, une odeur ou de la peinture qui pèle, dites-le-nous. Ça change l’ordre des travaux.',
    ],
    ctaImage: ['/images/relume-657406.jpeg', 2048, 1536],
    reviews: [paidReviews.johanne, paidReviews.melodie, paidReviews.isabelle],
    images: [
      ['/images/relume-657406.jpeg', 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses', 2048, 1536, 'Aire de vie et cuisine au sous-sol'],
      ['/images/INT%C3%89RIEUR/randoms/20240926_155408.jpg', 'Sous-sol dégagé avant un projet de réaménagement avec petites fenêtres et plafond suspendu', 4000, 3000, 'Point de départ : volume et éléments existants'],
      ['/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg', 'Espace de sous-sol aménagé avec plancher de bois clair, fenêtres basses et murs beiges', 4000, 3000, 'Pièce de vie lumineuse au niveau inférieur'],
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 4000, 3000, 'Configuration ouverte avec accès fermé'],
      ['/images/relume-655394.jpeg', 'Douche vitrée et fenêtre basse dans une salle de bain aménagée au sous-sol', 1536, 2048, 'Salle de bain : détail de douche et ventilation'],
    ],
    label: 'Entrepreneur en rénovation',
  },
};

function createPaidStaticBody(content, routePath) {
  const serviceSlug = routePath.replace('/pub/', '');
  const extra = paidPageEnhancements[serviceSlug];
  const cta = `<a class="inline-flex rounded-none bg-primary px-6 py-3 font-semibold text-white" href="/pub/formulaire?service=${escapeHtml(serviceSlug)}">Obtenir ma soumission sans frais</a>`;
  // Mêmes faits que le composant PubProofBar de la version React.
  const proofBar = `<section aria-label="Ce que vous obtenez en nous écrivant" class="bg-secondary py-6 text-white"><div class="container-large mx-auto max-w-7xl px-6"><ul class="flex flex-wrap gap-8"><li><strong>Réponse sous 48 h</strong> — à chaque demande reçue</li><li><strong>Estimation sans frais</strong> — visite comprise</li><li><strong>500+ projets complétés</strong> — en 18 ans</li><li><strong>Laval et les Laurentides</strong> — 9 municipalités desservies</li></ul></div></section>`;
  const nav = createPaidNav(Boolean(extra.details))
    .map(([id, label]) => `<a href="#${escapeHtml(id)}">${escapeHtml(label)}</a>`)
    .join(' · ');
  const headerNav = `<nav aria-label="Sections de la page" class="border-t border-border"><div class="container-large mx-auto flex gap-4 overflow-x-auto px-6 py-2">${nav}</div></nav>`;
  const images = extra.images.map(([src, alt, width, height, caption]) => `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy"><figcaption>${escapeHtml(caption || alt)}</figcaption></figure>`).join('');
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
  const includedWide = extra.includedWide
    ? `<figure><img src="${escapeHtml(extra.includedWide[0])}" alt="${escapeHtml(extra.includedWide[1])}" width="${extra.includedWide[2]}" height="${extra.includedWide[3]}" loading="lazy"></figure>`
    : '';
  const [ctaSrc, ctaWidth, ctaHeight] = extra.ctaImage;
  const ctaImage = `<img src="${escapeHtml(ctaSrc)}" alt="" aria-hidden="true" width="${ctaWidth}" height="${ctaHeight}" loading="lazy">`;
  const serviceArea = `<section class="py-12"><div class="container-large mx-auto max-w-7xl px-6"><p><strong>Nous travaillons à</strong></p><ul>${paidServiceCities.map((city) => `<li>${escapeHtml(city)}</li>`).join('')}</ul><p>${escapeHtml(paidServiceNote)}</p></div></section>`;
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
  return `<header class="border-b bg-background"><div class="container-large mx-auto flex items-center justify-between px-6 py-4"><a href="/"><img src="/images/relume-567884.png" width="180" height="60" alt="SLC Habitation"></a><div class="flex items-center gap-6"><a href="tel:5144048494" class="font-semibold">(514) 404-8494</a>${cta}</div></div>${headerNav}</header>
  <main><section class="bg-secondary py-20 text-white"><div class="container-large mx-auto max-w-5xl px-6"><img src="${escapeHtml(heroSrc)}" alt="${escapeHtml(heroAlt)}" width="${heroWidth}" height="${heroHeight}"><p class="text-primary font-bold uppercase tracking-widest mb-4">${escapeHtml(extra.label)}</p><h1 class="text-4xl md:text-6xl font-bold mb-6">${escapeHtml(content.h1)}</h1><p class="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">${escapeHtml(content.intro)}</p><ul class="flex flex-wrap gap-4 mb-8"><li class="border border-white/25 bg-white/10 px-4 py-2">19 avis Google 5 étoiles</li><li class="border border-white/25 bg-white/10 px-4 py-2">Licence RBQ : 8351-9033-59</li></ul>${cta}<p>${escapeHtml(extra.thumbsLabel)}</p>${heroThumbs}</div></section>
  ${proofBar}
  <section id="inclus" class="py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>Ce qui est inclus</p><h2>${escapeHtml(content.includedTitle)}</h2><p>${escapeHtml(content.includedIntro)}</p>${included}<p>Visite et estimation sans frais, réponse sous 48 heures.</p>${cta}${includedWide}</div></section>
  <section id="etapes" class="bg-muted py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>Comment ça se passe</p><h2>Quatre étapes simples</h2><ol>${steps}</ol><p>Plus de 500 projets complétés, 19 avis Google 5 étoiles.</p>${cta}</div></section>
  ${details}
  <section id="visite" class="py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>La visite</p><h2>Ce que nous regardons chez vous</h2><p>La visite est sans frais. Elle sert à chiffrer votre projet correctement.</p>${visit}${visitNote}<h3>À préparer pour la visite</h3><ul>${checklist}</ul><img src="${escapeHtml(visitSrc)}" alt="${escapeHtml(visitAlt)}" width="${visitWidth}" height="${visitHeight}" loading="lazy"></div></section>
  <section id="avis" class="py-20"><div class="container-large mx-auto max-w-7xl px-6"><p>Avis Google</p><h2>${escapeHtml(paidReviewsTitle)}</h2><p>${escapeHtml(paidReviewsIntro)}</p>${reviews}</div></section>
  <section id="realisations" class="bg-muted py-20"><div class="container-large mx-auto max-w-7xl px-6"><h2>${escapeHtml(content.galleryTitle)}</h2><p>${escapeHtml(content.galleryIntro)}</p>${images}</div></section>
  <section id="faq" class="py-20"><div class="container-large mx-auto max-w-4xl px-6"><p>Questions fréquentes</p><h2>Ce que les propriétaires nous demandent</h2>${faqItems}</div></section>
  ${serviceArea}
  <section class="bg-secondary py-20 text-white text-center">${ctaImage}<div class="container-large mx-auto max-w-4xl px-6"><h2>Prêt à recevoir votre soumission?</h2><p class="mb-8">${escapeHtml(content.ctaText)}</p>${cta}</div></section></main>
  <footer class="pub-footer bg-secondary py-16 text-white"><div class="container-large mx-auto max-w-7xl px-6"><p>Studio de rénovation résidentielle desservant Laval et les Laurentides.</p><p>Laval, Saint-Eustache, Terrebonne, Sainte-Thérèse, Rosemère, Mirabel, Boisbriand, Blainville et Saint-Jérôme.</p><p>RBQ 8351-9033-59 · <a href="tel:5144048494">(514) 404-8494</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a></p></div></footer>`;
}

function createFallbackSource(appShell, route) {
  const content = paidPageContent[route.path];
  let bodyContent;

  if (content) {
    bodyContent = createPaidStaticBody(content, route.path);
  } else if (route.path === '/pub/formulaire') {
    // Même ordre de lecture que la version React : entête avec photo, formulaire,
    // réassurance, puis questions fréquentes en section distincte.
    bodyContent = `<header class="border-b bg-white"><div class="container-large mx-auto flex items-center justify-between px-6 py-4"><img src="/images/relume-567884.png" width="180" height="60" alt="SLC Habitation"><a href="tel:5144048494">(514) 404-8494</a><a href="/pub/formulaire">Obtenir une soumission</a></div></header>
    <main><section class="pub-form-hero"><img src="/images/relume-655417.jpeg" width="2560" height="1920" alt="" aria-hidden="true" class="pub-form-hero__image"><div class="pub-form-hero__scrim" aria-hidden="true"></div><div class="pub-form-hero__inner"><p class="pub-form-hero__label">Demande de soumission</p><h1 class="pub-form-hero__title">Parlons de votre projet de rénovation</h1><p>Dites-nous ce que vous voulez rénover à Laval ou dans les Laurentides. Nous vous répondons sous 48 heures. La visite et l’estimation sont sans frais.</p></div></section>
    <section id="formulaire" class="py-16" aria-labelledby="formulaire-title"><div class="container-large mx-auto max-w-6xl px-6"><h2 id="formulaire-title">Parlez-nous de votre projet</h2><p>Le formulaire vous demande le type de travaux, votre budget approximatif, ce que vous voulez changer, la ville du projet, l’échéancier souhaité et vos coordonnées. Nous vous répondons sous 48 heures.</p><p>Le formulaire s’affiche dès que les fonctions de sécurité de la page sont chargées.</p><noscript><p>JavaScript est requis pour transmettre la demande en ligne. Vous pouvez aussi appeler SLC Habitation au <a href="tel:5144048494">(514) 404-8494</a>.</p></noscript><ul><li>Licence RBQ : 8351-9033-59</li><li>19 avis Google, tous 5 étoiles</li><li>Estimation sans frais, visite comprise</li></ul><figure class="pub-quote"><blockquote class="pub-quote__text">Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!</blockquote><figcaption class="pub-quote__author"><span class="pub-quote__name">Isabelle Baril</span> <span class="pub-quote__role">Avis Google</span></figcaption></figure><p>Vous préférez en parler de vive voix? <a href="tel:5144048494">(514) 404-8494</a></p></div></section>
     ${createFormGalleryMarkup()}
     <section id="faq" class="bg-muted py-16"><div class="container-large mx-auto max-w-4xl px-6"><p>Questions fréquentes</p><h2>Ce que les propriétaires nous demandent</h2><details><summary>Que se passe-t-il après l’envoi du formulaire?</summary><p>Nous vous répondons sous 48 heures et nous convenons d’une visite sans frais. Votre soumission est préparée à partir de cette visite.</p></details><details><summary>Quand les travaux peuvent-ils commencer?</summary><p>L’échéancier vous est donné après la visite, avec votre soumission. Il dépend de l’ampleur des travaux et de nos disponibilités.</p></details><details><summary>Est-ce que la soumission est payante?</summary><p>Non. La visite et l’estimation sont sans frais. SLC Habitation détient la licence RBQ 8351-9033-59.</p></details></div></section></main>
    <footer class="pub-footer bg-secondary py-12 text-white"><div class="container-large mx-auto px-6"><p>Studio de rénovation résidentielle desservant Laval et les Laurentides.</p><p>Laval, Saint-Eustache, Terrebonne, Sainte-Thérèse, Rosemère, Mirabel, Boisbriand, Blainville et Saint-Jérôme.</p><p>RBQ 8351-9033-59 · <a href="tel:5144048494">(514) 404-8494</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a></p></div></footer>`;
  } else {
    bodyContent = `<main class="min-h-screen bg-background py-16"><div class="container-large px-6 mx-auto max-w-3xl"><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p></div></main>`;
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
