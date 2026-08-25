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

const paidPageEnhancements = {
  'renovation-cuisine': {
    nav: [['demarche', 'La démarche'], ['implantation', 'Implantation'], ['materiaux', 'Détails pratiques'], ['chantier', 'Le chantier'], ['faq', 'FAQ']],
    images: [
      ['/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg', 'Grande cuisine blanche avec îlot central et comptoirs clairs', 1600, 1200],
      ['/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1080.jpg', 'Cuisine rénovée avec îlot en bois, rangements blancs et suspensions', 1080, 1440],
      ['/images/INT%C3%89RIEUR/Cuisine/20221021_145939-p-1080.jpg', 'Cuisine lumineuse avec armoires blanches, comptoir et hotte', 1080, 1440],
      ['/images/INT%C3%89RIEUR/Cuisine/20250106_124701-p-1080.jpg', 'Cuisine avec îlot, plancher clair et porte coulissante en bois', 1080, 1440],
      ['/images/INT%C3%89RIEUR/Cuisine/20250106_124707-p-1080.jpg', 'Cuisine compacte avec armoires blanches et noires près d’un escalier', 1080, 1440],
    ],
    label: 'Cuisine pensée pour votre quotidien',
    subject: 'cuisine', spaces: 'la conservation, le lavage, la préparation et la cuisson',
    details: 'les armoires, les comptoirs, le dosseret, les appareils et l’éclairage',
    technical: 'la plomberie, l’alimentation électrique, la ventilation et les particularités structurelles',
  },
  'renovation-salle-de-bain': {
    nav: [['approche', 'Notre approche'], ['possibilites', 'Possibilités'], ['planification', 'Planifier'], ['realisation', 'Réalisation'], ['faq', 'FAQ']],
    images: [
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20221021_145907-p-2000.jpg', 'Salle de bain avec douche vitrée, vanité et céramique', 2000, 2667],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230427_135113-p-1600.jpg', 'Vanité en bois clair et miroir rond dans une salle de bain rénovée', 1600, 2133],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241018_153927-p-1600.jpg', 'Douche vitrée et céramique grise dans une salle de bain', 1600, 2133],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg', 'Salle de bain aux murs foncés avec douche et vanité suspendue', 1600, 2133],
      ['/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg', 'Salle de bain lumineuse avec douche, bain et céramique blanche', 1600, 1200],
    ],
    label: 'Salle de bain pensée dans son ensemble',
    subject: 'salle de bain', spaces: 'la douche, le bain, la vanité et les passages',
    details: 'la céramique, les joints, la robinetterie, le rangement et l’éclairage',
    technical: 'la plomberie, l’étanchéité, la ventilation, l’électricité et la structure du plancher',
  },
  'renovation-sous-sol': {
    nav: [['possibilites', 'Possibilités'], ['diagnostic', 'Diagnostic'], ['demarche', 'Démarche'], ['inspirations', 'Réalisations'], ['faq', 'FAQ']],
    images: [
      ['/images/relume-657406.jpeg', 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses', 2048, 1536],
      ['/images/INT%C3%89RIEUR/randoms/20240926_155408.jpg', 'Sous-sol dégagé avant un projet de réaménagement avec petites fenêtres et plafond suspendu', 4000, 3000],
      ['/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg', 'Espace de sous-sol aménagé avec plancher de bois clair, fenêtres basses et murs beiges', 4000, 3000],
      ['/images/INT%C3%89RIEUR/randoms/20241018_161142.jpg', 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond', 4000, 3000],
      ['/images/relume-655394.jpeg', 'Douche vitrée et fenêtre basse dans une salle de bain aménagée au sous-sol', 1536, 2048],
    ],
    label: 'Aménagement intérieur résidentiel',
    subject: 'sous-sol', spaces: 'la salle familiale, le bureau, la chambre, le rangement ou la salle de bain',
    details: 'le plancher, les cloisons, les plafonds, l’éclairage et les rangements',
    technical: 'l’humidité, la fondation, la dalle, la plomberie, les ouvertures et la mécanique du bâtiment',
  },
};

function createPaidStaticBody(content, routePath) {
  const serviceSlug = routePath.replace('/pub/', '');
  const extra = paidPageEnhancements[serviceSlug];
  const cta = `<a class="inline-flex rounded bg-primary px-6 py-3 font-semibold text-white" href="/pub/formulaire?service=${escapeHtml(serviceSlug)}">Parler de mon projet</a>`;
  const nav = extra.nav.map(([id, label]) => `<a href="#${escapeHtml(id)}">${escapeHtml(label)}</a>`).join(' · ');
  const images = extra.images.map(([src, alt, width, height], index) => `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="${index ? 'lazy' : 'eager'}"><figcaption>${escapeHtml(alt)}</figcaption></figure>`).join('');
  const faqItems = content.faqs.slice(0, 9).map(([question, answer]) =>
    `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)} Cette réponse constitue un repère de planification : les conditions observées, les produits retenus et la configuration de la résidence permettent ensuite de préciser les options à examiner.</p></details>`).join('');
  const evaluation = content.evaluations.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const configurations = content.configurations.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const p = (text) => `<p>${escapeHtml(text)}</p>`;
  const longText = [
    `Rénover une ${extra.subject} demande de partir de la manière dont la maison est réellement vécue. Avant de choisir une couleur ou une image d’inspiration, il est utile de nommer les gestes qui se répètent, les passages qui se croisent et les éléments qui compliquent la routine. Dans une résidence de Laval ou des Laurentides, la pièce existante apporte aussi son propre cadre : dimensions, ouvertures, lumière, murs, niveaux et accès aux autres espaces. SLC Habitation aborde cette première lecture avec vous afin de relier vos priorités à un aménagement compréhensible. L’objectif n’est pas d’appliquer une formule, mais de donner une place à chaque usage et de savoir quelles questions doivent être vérifiées avant de retenir une solution.`,
    `Les zones de ${extra.spaces} ne fonctionnent pas isolément. Leur position influence les parcours, la place disponible et les interventions qui devront être coordonnées. Une idée peut paraître simple sur un croquis, puis demander une lecture différente lorsqu’on ouvre une porte, qu’on déplace un meuble ou qu’on considère une fenêtre. Nous invitons les propriétaires à préparer des photos, des dimensions connues, une liste des éléments à conserver et des images qui expliquent l’ambiance recherchée. Ces repères rendent la discussion plus précise, sans remplacer l’observation du lieu. Ils permettent surtout de distinguer les besoins essentiels des souhaits à explorer.`,
    `La planification rassemble les détails visibles et ceux qui se trouvent derrière les finis. Pour ce projet, ${extra.technical} doivent être regardées au bon moment. Leur position peut influencer le plan, les raccordements et la séquence des travaux. Une visite aide à identifier ce qui est apparent et ce qui mérite une validation plus poussée. Selon la configuration, certaines avenues pourront être approfondies, adaptées ou écartées. Cette démarche évite de présumer qu’un déplacement ou une modification est possible avant d’avoir considéré le bâtiment. Elle donne aussi un langage commun pour comparer des options qui répondent aux mêmes besoins de départ.`,
    `Les choix de ${extra.details} prennent davantage de sens lorsqu’ils sont discutés ensemble. Une surface ne se résume pas à son échantillon : elle rencontre une autre matière, une hauteur, un seuil ou une source de lumière. Un équipement occupe une place précise et comporte des dimensions, des ouvertures ou des raccordements à considérer. En observant ces relations tôt, on peut mieux expliquer les arbitrages nécessaires. La recherche d’une pièce cohérente passe souvent par une palette lisible, des proportions adaptées et des détails qui correspondent à l’usage plutôt que par l’accumulation d’éléments. Vos préférences restent importantes; elles sont simplement ramenées aux conditions réelles de l’espace.`,
    `Le chantier se prépare comme une succession d’interventions liées entre elles. Le retrait des éléments existants, les ajustements techniques, la préparation des supports, l’installation des composantes puis les finitions ne sont pas des étapes indépendantes. Leur ordre dépend de la portée retenue et de ce qui est rencontré sur place. Protéger les zones adjacentes, organiser les accès et garder les décisions raccordées au plan font partie de cette coordination. SLC Habitation compte 18 ans d’expérience et détient la licence RBQ 8351-9033-59. Cette expérience sert à accompagner la conversation sur le projet à Laval et dans les Laurentides, avec attention aux éléments à évaluer.`,
    `Il est utile d’imaginer la pièce à différents moments de la journée. Qui y entre en premier? Où les objets se déposent-ils? Qu’est-ce qui doit rester accessible et qu’est-ce qui peut être rangé? Les réponses ne sont pas identiques pour tous les foyers, mais elles donnent des indications concrètes sur la circulation, la lumière, le rangement et les surfaces. Elles aident également à remarquer les contraintes de vie pendant les travaux, par exemple une pièce voisine utilisée quotidiennement ou un accès qui doit demeurer considéré. Plus ces situations sont exprimées clairement, plus le projet peut être discuté avec des repères utiles.`,
    `Une rénovation ne se résume donc pas à remplacer ce qui est visible. Elle relie le volume disponible, les usages, les installations et les finitions dans une même réflexion. Les dimensions exactes, l’état des supports et les exigences applicables au projet guident les réponses détaillées. Lorsque des démarches, des permis ou des validations sont pertinents, ils doivent être considérés selon le contexte. Cette prudence ne limite pas l’inspiration : elle permet de la transformer en choix mieux documentés. Le résultat recherché peut alors être expliqué à partir de la pièce réelle et non seulement d’une image.`,
    `Pour préparer une rencontre, notez ce qui vous convient dans la ${extra.subject} actuelle et ce que vous aimeriez faire plus facilement demain. Ajoutez les objets qui manquent de place, les appareils ou composantes que vous souhaitez conserver, ainsi que les questions qui reviennent dans votre quotidien. Des photos de la pièce, des murs, des fenêtres et des installations visibles complètent utilement ce portrait. Nous pourrons ensuite parler de l’usage envisagé, des contraintes à examiner et des choix à coordonner. Cette première étape sert à clarifier le projet avant de donner toute l’attention aux finitions.`,
    `Les inspirations ont leur place dans cette préparation lorsqu’elles servent à préciser une intention. Une photo peut révéler une préférence pour une pièce plus lumineuse, une ligne épurée, une texture naturelle ou un rangement moins apparent. Elle ne dit pas nécessairement comment cette intention s’adaptera à votre maison. C’est pourquoi il est utile de l’accompagner d’une observation concrète : ce qui attire votre regard, ce que vous ne souhaitez pas reproduire et la façon dont cet élément serait utilisé chez vous. Cette distinction aide à garder les discussions ouvertes tout en ancrant les décisions dans les dimensions, les ouvertures et les installations existantes.`,
    `La circulation mérite aussi une attention particulière. Il ne suffit pas qu’un élément trouve place sur le plan : il faut pouvoir l’approcher, l’utiliser et le contourner dans les scènes ordinaires de la maison. Les portes, les tiroirs, les fenêtres, les accès et les personnes qui partagent l’espace créent des interactions à observer. En les décrivant dès le départ, vous permettez de comparer les options avec plus de justesse. Un parcours bien compris peut parfois orienter le choix d’un volume, d’une ouverture ou d’un rangement plus efficacement qu’une solution ajoutée en fin de réflexion.`,
    `Les matériaux et les détails de finition peuvent alors être considérés avec un regard plus complet. Leur entretien, leur texture, les raccords qu’ils créent et leur comportement dans la lumière font partie du choix. Une transition avec une pièce voisine, une moulure, une poignée, une grille ou une prise sont de petits éléments qui participent à l’ensemble. Les nommer n’oblige pas à tout décider immédiatement; cela évite plutôt que les points de rencontre deviennent des choix isolés. Le projet gagne en lisibilité lorsque les éléments visibles répondent à la fonction de la pièce et aux décisions techniques préparées en amont.`,
    `Tout au long de la réflexion, les réponses doivent conserver une part de nuance. Les conditions derrière un mur, sous un plancher ou près d’une ouverture ne sont pas toujours connues avant l’évaluation et les interventions nécessaires. Une discussion utile identifie donc les questions, les documents à consulter et les observations à faire plutôt que de promettre une issue identique pour toutes les résidences. Cette manière de planifier permet aux propriétaires de comprendre ce qui est certain, ce qui reste à vérifier et comment les décisions seront reliées au projet dans son ensemble.`,
    `Les échanges avec les personnes qui habitent la maison apportent un autre niveau de détail. Il peut être pertinent de noter les moments où l’espace est le plus sollicité, les objets qui circulent d’une pièce à l’autre et les habitudes qui ne paraissent pas sur un plan. Une famille qui reçoit, qui travaille à domicile ou qui partage les tâches n’utilise pas nécessairement la pièce de la même façon. Cette réalité peut orienter la place accordée aux passages, aux surfaces accessibles et aux zones plus calmes. En donnant un exemple concret de votre quotidien, vous aidez à relier une préférence d’aménagement à une fonction réelle, puis à évaluer cette intention avec les limites et les possibilités du lieu.`,
    `Enfin, garder une liste de décisions aide à suivre la cohérence du projet. Elle peut regrouper les éléments à confirmer, les produits dont les dimensions doivent être vérifiées et les questions techniques soulevées lors de l’évaluation. Cette liste n’est pas un plan définitif; elle sert plutôt de fil conducteur entre vos priorités et les sujets qui demandent une réponse. Elle facilite les comparaisons lorsqu’il faut choisir entre deux configurations ou deux finis. En revenant régulièrement à l’usage recherché, à la circulation et aux conditions existantes, la discussion reste centrée sur ce qui compte pour votre ${extra.subject}. Les choix gagnent ainsi une raison claire d’être et s’inscrivent plus naturellement dans la maison.`,
    `Cette préparation favorise aussi une conversation plus simple avec les intervenants du projet. Plutôt que de chercher une réponse immédiate à chaque détail, les propriétaires peuvent présenter leurs priorités, leurs références et les contraintes déjà connues. Les observations faites dans la maison complètent ensuite ce portrait. Les décisions peuvent alors être prises dans un ordre plus utile, en tenant compte des liens entre l’usage, les installations et les finitions. C’est une façon concrète de faire évoluer l’idée initiale vers une rénovation réfléchie, adaptée aux caractéristiques de votre espace et aux questions qui méritent d’être examinées.`,
  ].map(p).join('');
  return `<header class="border-b bg-background"><div class="container-large mx-auto flex items-center justify-between px-6 py-4"><a href="/"><img src="/images/relume-567884.png" width="180" height="60" alt="SLC Habitation"></a><div class="flex items-center gap-6"><a href="tel:5144048494" class="font-semibold">(514) 404-8494</a>${cta}</div></div></header>
  <main><section class="bg-secondary py-20 text-white"><div class="container-large mx-auto max-w-5xl px-6"><p class="text-primary font-bold uppercase tracking-widest mb-4">${escapeHtml(extra.label)}</p><h1 class="text-4xl md:text-6xl font-bold mb-6">${escapeHtml(content.h1)}</h1><p class="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">${escapeHtml(content.intro)}</p><ul class="flex flex-wrap gap-4 mb-8"><li class="border border-white/25 bg-white/10 px-4 py-2">Licence RBQ : 8351-9033-59</li><li class="border border-white/25 bg-white/10 px-4 py-2">18 ans d’expérience</li><li class="border border-white/25 bg-white/10 px-4 py-2">Laval et Laurentides</li></ul>${cta}</div></section>
  <nav aria-label="Navigation dans la page" class="border-b border-border bg-background"><div class="container-large mx-auto flex gap-6 overflow-x-auto px-6 py-5">${nav}</div></nav>
  <section id="${escapeHtml(extra.nav[0][0])}" class="py-20"><div class="container-large mx-auto max-w-7xl px-6"><h2>Une lecture complète de votre projet</h2>${longText}</div></section>
  <section id="${escapeHtml(extra.nav[1][0])}" class="bg-muted py-20"><div class="container-large mx-auto max-w-7xl px-6"><h2>Possibilités et décisions de conception</h2><ul>${configurations}</ul>${images}</div></section>
  <section id="${escapeHtml(extra.nav[2][0])}" class="py-20"><div class="container-large mx-auto max-w-7xl px-6"><h2>Évaluation et planification technique</h2><p>Les points suivants font partie de la lecture initiale; ils sont précisés selon la résidence et le projet envisagé.</p><ul>${evaluation}</ul>${cta}</div></section>
  <section id="${escapeHtml(extra.nav[3][0])}" class="bg-secondary py-20 text-white"><div class="container-large mx-auto max-w-7xl px-6"><h2>Une démarche organisée, du plan aux finitions</h2><p>La coordination relie les choix retenus aux interventions nécessaires et tient compte des conditions observées pendant les travaux.</p><ol><li>Comprendre l’espace et les priorités.</li><li>Mettre le plan en relation avec les éléments techniques.</li><li>Préparer les interventions et les surfaces.</li><li>Coordonner les composantes et les finitions.</li></ol></div></section>
  <section class="py-20"><div class="container-large mx-auto max-w-4xl px-6 text-center"><blockquote>« ${escapeHtml(content.testimonial.quote)} »</blockquote><p><strong>${escapeHtml(content.testimonial.author)}</strong>, propriétaire</p></div></section>
  <section id="faq" class="bg-muted py-20"><div class="container-large mx-auto max-w-4xl px-6"><h2>Questions fréquentes</h2><p>Voici des pistes pour préparer votre réflexion. Les réponses précises dépendent de la pièce, du bâtiment et des choix du projet.</p>${faqItems}</div></section>
  <section class="bg-secondary py-20 text-white text-center"><div class="container-large mx-auto max-w-4xl px-6"><h2>Parlons de votre projet</h2><p class="mb-8">Présentez-nous votre espace, vos idées et vos priorités. Nous pourrons amorcer une discussion sur les éléments à examiner.</p>${cta}</div></section></main>
  <footer class="bg-secondary py-16 text-white"><div class="container-large mx-auto max-w-7xl px-6"><p>Studio de rénovation résidentielle desservant Laval et les Laurentides.</p><p>RBQ 8351-9033-59 · <a href="tel:5144048494">(514) 404-8494</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a></p></div></footer>`;
}

function createFallbackSource(appShell, route) {
  const content = paidPageContent[route.path];
  let bodyContent;

  if (content) {
    bodyContent = createPaidStaticBody(content, route.path);
  } else if (route.path === '/pub/formulaire') {
    bodyContent = `<header class="border-b bg-white"><div class="container-large mx-auto flex items-center justify-between px-6 py-4"><img src="/images/relume-567884.png" width="180" height="60" alt="SLC Habitation"><a href="tel:5144048494">(514) 404-8494</a><a href="#formulaire">Obtenir une soumission</a></div></header>
    <main><section class="py-16"><div class="container-large mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2"><div><p>Votre projet, votre espace</p><h1>Demande de soumission</h1><p>SLC Habitation accompagne les projets de rénovation résidentielle à Laval et dans les Laurentides. Décrivez votre projet, votre espace et les changements envisagés : ces informations nous aident à amorcer une discussion adaptée à votre situation.</p><p>Notre approche relie les usages de la maison, les conditions observées et les choix à planifier. Vous n’avez pas besoin d’avoir toutes les réponses avant de nous écrire; les photos, les dimensions connues et vos priorités constituent déjà de bons repères.</p><ul><li>Licence RBQ : 8351-9033-59</li><li>18 ans d’expérience</li><li><a href="tel:5144048494">(514) 404-8494</a></li></ul><img src="/images/upscale-house-1-min-1-p-1080.png" width="1080" height="810" alt="Rénovation résidentielle réalisée par SLC Habitation" loading="lazy"></div>
    <div id="formulaire" aria-labelledby="formulaire-title"><h2 id="formulaire-title">Parlez-nous de votre projet</h2><p>Le formulaire interactif sécurisé recueille le type de travaux, votre budget approximatif, une courte description ainsi que vos coordonnées. Ces renseignements servent uniquement à examiner votre demande et à vous contacter à son sujet.</p><ol><li><strong>Projet</strong> — choisissez le service et la plage budgétaire qui correspondent le mieux à votre situation.</li><li><strong>Détails</strong> — décrivez les changements souhaités, les éléments à conserver et les particularités déjà connues.</li><li><strong>Coordonnées</strong> — indiquez comment nous pouvons vous joindre et confirmez votre consentement.</li></ol><p>Le formulaire complet s’affiche dès que les fonctions de sécurité de la page sont chargées.</p><noscript><p>JavaScript est requis pour protéger et transmettre la demande en ligne. Vous pouvez aussi appeler SLC Habitation au <a href="tel:5144048494">(514) 404-8494</a>.</p></noscript></div></div></section>
    <section class="bg-muted py-16"><div class="container-large mx-auto max-w-5xl px-6"><h2>Une démarche en trois étapes</h2><ol><li><strong>1. Présentez votre idée.</strong> Indiquez le service, ce que vous souhaitez changer et les informations déjà connues.</li><li><strong>2. Nous examinons le contexte.</strong> Vos réponses donnent un point de départ pour discuter de l’espace, des priorités et des éléments à évaluer.</li><li><strong>3. Planifiez avec des repères.</strong> Les possibilités se précisent selon la résidence, les choix retenus et les conditions observées.</li></ol><h2>Questions fréquentes</h2><details><summary>Que dois-je inclure dans ma demande?</summary><p>Une description simple de votre projet, les pièces visées, vos priorités et des dimensions ou photos si vous en avez. Ces éléments facilitent la première discussion.</p></details><details><summary>Les réponses du formulaire sont-elles suffisantes pour confirmer un projet?</summary><p>Elles servent à amorcer l’échange. Les réponses détaillées dépendent de l’évaluation de l’espace, des conditions existantes et des choix à examiner.</p></details><details><summary>Comment sont utilisés mes renseignements?</summary><p>Ils servent au suivi de votre demande. Consultez notre politique de confidentialité pour en savoir plus.</p></details></div></section></main>
    <footer class="bg-secondary py-12 text-white"><div class="container-large mx-auto px-6"><p>Studio de rénovation résidentielle desservant Laval et les Laurentides.</p><p>RBQ 8351-9033-59 · <a href="tel:5144048494">(514) 404-8494</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a></p></div></footer>`;
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
