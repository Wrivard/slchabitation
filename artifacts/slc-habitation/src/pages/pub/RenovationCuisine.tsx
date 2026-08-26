import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import {
  PubPageNav,
  PubSectionHeader,
  PubActionBar,
  PubCard,
  PubCardBody,
  PubCardIcon,
  PubCardList,
  PubCardMedia,
  PubCardNote,
  PubCardNumber,
  PubCardText,
  PubCardTitle,
  PubChecklist,
  PubGallery,
  PubInvite,
  PubProofBar,
  PubTestimonial,
} from '@/components/pub/PubShared';
import { FAQ, FAQList } from '@/components/pub/FAQ';
import {
  CalendarCheck,
  Check,
  ChefHat,
  ClipboardCheck,
  Grid,
  Hammer,
  Layers,
  Lightbulb,
  MapPin,
  MoveHorizontal,
  Refrigerator,
  Ruler,
  ShieldCheck,
  Utensils,
} from 'lucide-react';

const kitchenImages = {
  hero: {
    src: '/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg',
    alt: 'Grande cuisine blanche avec îlot central et comptoirs clairs',
    width: 1600,
    height: 1200,
  },
  island: {
    src: '/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1080.jpg',
    alt: 'Cuisine rénovée avec îlot en bois, rangements blancs et suspensions',
    width: 1080,
    height: 1440,
  },
  modern: {
    src: '/images/INT%C3%89RIEUR/Cuisine/20221021_145939-p-1080.jpg',
    alt: 'Cuisine lumineuse avec armoires blanches, comptoir et hotte',
    width: 1080,
    height: 1440,
  },
  floor: {
    src: '/images/INT%C3%89RIEUR/Cuisine/20250106_124701-p-1080.jpg',
    alt: 'Cuisine avec îlot, plancher clair et porte coulissante en bois',
    width: 1080,
    height: 1440,
  },
  compact: {
    src: '/images/INT%C3%89RIEUR/Cuisine/20250106_124707-p-1080.jpg',
    alt: 'Cuisine compacte avec armoires blanches et noires près d’un escalier',
    width: 1080,
    height: 1440,
  },
  extra1: {
    src: '/images/INT%C3%89RIEUR/Cuisine/20220823_074355-p-1600.jpg',
    alt: 'Cuisine élégante avec finitions soignées',
    width: 1600,
    height: 1200,
  },
  extra2: {
    src: '/images/INT%C3%89RIEUR/Cuisine/2403-p-1080.jpg',
    alt: 'Détail de cuisine et éclairage',
    width: 1080,
    height: 1440,
  },
  extra3: {
    src: '/images/relume-567906.jpeg',
    alt: 'Cuisine moderne ouverte avec îlot',
    width: 1440,
    height: 1440,
  },
  extra4: {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine%20st%20jerome%20apres.png',
    alt: 'Cuisine rénovée à Saint-Jérôme avec armoires claires et comptoir contrastant',
    width: 940,
    height: 788,
  }
};

const navItems = [
  { href: '#demarche', label: 'La démarche' },
  { href: '#implantation', label: 'Implantation' },
  { href: '#materiaux', label: 'Détails pratiques' },
  { href: '#chantier', label: 'Le chantier' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#faq', label: 'FAQ' },
];

const kitchenGallery = [
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/20220823_074355-p-2000.jpg',
    alt: 'Cuisine rénovée avec armoires claires, comptoir continu et éclairage intégré',
    caption: 'Plan de travail continu et armoires claires',
    category: 'Rénovation de cuisine',
    project: 'Comptoir continu',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1600.jpg',
    alt: 'Cuisine avec îlot en bois, rangements blancs et suspensions',
    caption: 'Îlot en bois et rangements intégrés',
    category: 'Rénovation de cuisine',
    project: 'Îlot en bois',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine%20st%20jerome%20apres.png',
    alt: 'Cuisine rénovée à Saint-Jérôme avec armoires claires et comptoir contrastant',
    caption: 'Saint-Jérôme : armoires claires, comptoir contrastant',
    category: 'Rénovation de cuisine',
    project: 'Projet Saint-Jérôme',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg',
    alt: 'Grande cuisine blanche avec îlot central et comptoirs clairs',
    caption: 'Cuisine ouverte sur l’aire de vie',
    category: 'Rénovation de cuisine',
    project: 'Cuisine ouverte',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/2403-p-1600.jpg',
    alt: 'Détail d’une cuisine avec éclairage sous les armoires',
    caption: 'Éclairage de travail sous les armoires',
    category: 'Rénovation de cuisine',
    project: 'Éclairage de travail',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/20250106_124701-p-1600.jpg',
    alt: 'Cuisine avec îlot, plancher clair et porte coulissante en bois',
    caption: 'Plancher clair et porte coulissante',
    category: 'Rénovation de cuisine',
    project: 'Plancher clair',
  },
];

const assessmentItems = [
  { title: 'Implantation et circulation', text: 'Passages, ouvertures, lumière et espace autour des zones de travail.' },
  { title: 'Structure existante', text: 'Murs, niveaux et particularités du bâtiment orientent la configuration possible.' },
  { title: 'Services techniques', text: 'Plomberie, ventilation et alimentation électrique sont considérées avant les choix.' },
  { title: 'Équipements et finitions', text: 'Appareils, rangements, surfaces et raccords se planifient ensemble.' },
];

const configurationCards = [
  {
    icon: Grid,
    title: 'Armoires et surfaces',
    points: [
      'Caissons, façades, poignées, comptoirs et dosserets forment un ensemble.',
      'Proportions, joints et transitions comptent aussi.',
    ],
  },
  {
    icon: Utensils,
    title: 'Rangement utile',
    points: ['Tiroirs, garde-manger et armoires s’organisent selon vos objets et vos gestes réels.'],
  },
  {
    icon: Lightbulb,
    title: 'Éclairage par usage',
    points: [
      'Éclairages général, de travail et d’ambiance se distinguent.',
      'Leur emplacement se prévoit avec les armoires.',
    ],
  },
];

const chapters = [
  {
    number: '01',
    title: 'Partir de vos habitudes, pas seulement d’une image',
    paragraphs: [
      'D’abord, vos usages : cuisiner seul ou à plusieurs, manger sur place, accueillir les enfants ou accéder au garde-manger.',
      'Puis, les irritants : passages bloqués, comptoirs courts, prises mal situées, évier éloigné ou armoires peu pratiques.',
    ],
    callout: 'À préparer : photos, dimensions connues, appareils à conserver ou remplacer et besoins du quotidien.',
    image: kitchenImages.island,
  },
  {
    number: '02',
    title: 'Composer une implantation qui laisse respirer la pièce',
    paragraphs: [
      'L’implantation relie conservation, lavage, préparation et cuisson. Corridor, L, U ou aire ouverte : chaque forme répond à ses accès, fenêtres et portes.',
      'Îlot, péninsule ou long plan de travail se comparent selon l’espace réel, le rangement et les dégagements.',
    ],
    callout: 'Repère : imaginez portes, lave-vaisselle et tiroirs ouverts en même temps. Vérifiez les passages.',
    image: kitchenImages.modern,
  },
  {
    number: '03',
    title: 'Coordonner les détails avant qu’ils ne deviennent des ajustements',
    paragraphs: [
      'Les dimensions des appareils influencent armoires, dégagements, prises et parfois ventilation. Les fiches techniques permettent de vérifier l’installation.',
      'Évier, robinetterie, hotte, cuisson, comptoir, dosseret et plancher exigent aussi des raccords précis.',
    ],
    callout: 'À conserver : fiches des appareils, avec dimensions, branchements et dégagements.',
    image: kitchenImages.floor,
  },
  {
    number: '04',
    title: 'Prévoir le rangement à partir de ce que vous possédez',
    paragraphs: [
      'Casseroles, provisions, contenants, petits appareils et vaisselle n’exigent pas le même accès. Leur fréquence d’usage guide leur place.',
      'Tiroirs, armoires verticales, tablettes ou garde-manger doivent préserver les surfaces de préparation et les parcours.',
    ],
    callout: 'Exercice : listez cinq objets qui encombrent le comptoir et leur fréquence d’usage.',
    image: kitchenImages.compact,
  },
  {
    number: '05',
    title: 'Faire de la lumière un outil de confort et de précision',
    paragraphs: [
      'Préparation, repas et passage en soirée n’appellent pas le même éclairage. Son placement se réfléchit avec les armoires, l’îlot et les zones d’ombre.',
      'La lumière du jour change la perception des couleurs et des surfaces. Observez les finis à plusieurs moments.',
    ],
    callout: 'À observer : où préparez-vous les aliments le matin et le soir?',
    image: kitchenImages.extra2,
  },
];

const siteSteps = [
  { icon: Ruler, title: 'Comprendre le lieu', text: 'Volumes, murs, accès, installations et objectifs.' },
  { icon: ClipboardCheck, title: 'Planifier les interventions', text: 'Implantation et matériaux reliés à la plomberie, l’électricité, la ventilation et la menuiserie.' },
  { icon: Hammer, title: 'Préparer les séquences', text: 'Démolition, ajustements techniques, surfaces et finitions dans un ordre adapté.' },
  { icon: CalendarCheck, title: 'Avancer avec méthode', text: 'Décisions et interventions alignées sur le plan et les conditions observées.' },
];

const decisionPoints = [
  {
    icon: ChefHat,
    title: 'Le plan de travail',
    text: 'Suivez le trajet des aliments : arrivée, lavage, préparation, cuisson. Position, continuité et dégagement comptent autant que la superficie.',
  },
  {
    icon: Refrigerator,
    title: 'Les appareils',
    text: 'Réfrigérateur, lave-vaisselle, four, micro-ondes et petits appareils ont leurs dimensions, portes et raccordements. Leur interaction compte à plusieurs.',
  },
  {
    icon: MoveHorizontal,
    title: 'Les passages',
    text: 'Les trajets vers le salon, la salle à manger, l’extérieur ou l’escalier traversent parfois la cuisine. L’évaluation situe les zones actives et les conflits possibles.',
  },
  {
    icon: Layers,
    title: 'Les finitions',
    text: 'Jonctions comptoir-dosseret, transitions de plancher, moulures et poignées façonnent l’ensemble. Les discuter tôt facilite leur coordination.',
  },
];

const meetingChecklist = [
  'Ce qui fonctionne et ce qui dérange aujourd’hui',
  'Dimensions connues et photos de la pièce',
  'L’usage visé : repas, préparation, rangement',
  'Les accès et pièces voisines à protéger',
];

const faqs = [
  { question: 'Peut-on modifier un mur pour ouvrir la cuisine?', answer: 'Cela dépend notamment du rôle du mur et de la structure existante. Une évaluation permet de déterminer ce qui peut être envisagé; lorsqu’une intervention structurale est requise, les démarches appropriées doivent être considérées avant les travaux.' },
  { question: 'Dois-je choisir mes électroménagers avant de finaliser le plan?', answer: 'Il est utile de connaître les dimensions et les fiches techniques des appareils retenus. Elles aident à prévoir les espaces, les dégagements et les raccordements à considérer dans l’implantation.' },
  { question: 'Peut-on déplacer l’évier ou la cuisinière?', answer: 'C’est évalué selon la position actuelle des services, les parcours possibles et la configuration du bâtiment. La plomberie, l’électricité et la ventilation font partie de l’analyse avant de confirmer une nouvelle position.' },
  { question: 'Comment choisir entre un îlot et une péninsule?', answer: 'Le choix dépend de la largeur de la pièce, des passages, du rangement recherché et de l’usage souhaité. Une implantation dessinée à partir des dimensions réelles aide à comparer les options.' },
  { question: 'Faut-il changer le plancher en même temps que la cuisine?', answer: 'Ce n’est pas systématique. Lorsque la cuisine s’ouvre sur une pièce voisine, la continuité du revêtement, les niveaux de sol et les seuils peuvent toutefois faire partie de la réflexion.' },
  { question: 'Comment planifier les prises et l’éclairage?', answer: 'Les besoins d’appareils, les zones de préparation, l’îlot et les armoires influencent leur emplacement. Les ajustements électriques sont évalués dans le cadre de la planification technique du projet.' },
  { question: 'Une hotte peut-elle être intégrée au plan?', answer: 'Oui, son type et son emplacement doivent être réfléchis avec la cuisson, les armoires et les possibilités de ventilation de la maison. Les contraintes existantes sont vérifiées avant de retenir une solution.' },
  { question: 'Que faut-il prévoir pour la démolition?', answer: 'La démolition se planifie avec les éléments à retirer, les zones adjacentes, les accès et les interventions qui suivent. Une approche méthodique aide à organiser la suite des travaux.' },
  { question: 'Peut-on conserver certains éléments de la cuisine actuelle?', answer: 'Selon leur état, leur compatibilité avec la nouvelle disposition et vos objectifs, certains éléments peuvent être discutés pendant l’évaluation. Le projet se définit à partir de ce qui est pertinent pour votre espace.' },
];

export default function RenovationCuisinePub() {
  return (
    <PubLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary text-white min-h-[72vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src={kitchenImages.hero.src}
            alt={kitchenImages.hero.alt}
            width={kitchenImages.hero.width}
            height={kitchenImages.hero.height}
            className="h-full w-full object-cover object-[center_30%]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/60 to-transparent" />
        </div>
        <div className="container-large relative mx-auto max-w-7xl px-6 pb-16 pt-24 fade-up">
          <div className="max-w-4xl">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-medium tracking-wide sm:text-sm">
              <span className="flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2 rounded-none"><ShieldCheck className="h-4 w-4 text-primary" />Licence RBQ : 8351-9033-59</span>
              <span className="flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2 rounded-none"><MapPin className="h-4 w-4 text-primary" />Laval et Laurentides</span>
              <span className="border border-white/25 bg-white/10 px-4 py-2 rounded-none">18 ans d&apos;expérience</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Cuisine pensée pour votre quotidien</p>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">Rénovation de cuisine à Laval et dans les Laurentides</h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Nous venons voir votre cuisine, nous écoutons comment vous l’utilisez, puis nous préparons votre soumission. Plus de 500 projets complétés en 18 ans.</p>
            <PubCTA service="renovation-cuisine" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>
            <p className="mt-4 text-sm text-gray-300">Estimation et visite sans frais · Réponse sous 48 heures</p>
          </div>
        </div>
      </section>

      <PubProofBar />

      <PubPageNav items={navItems} />

      {/* LECTURE COMPLÈTE */}
      <section id="demarche" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
              <PubSectionHeader
                className="mb-0 max-w-3xl"
                kicker="Une lecture complète de la pièce"
                title="Avant les choix visibles, comprendre ce qui soutient le projet"
                description={[
                  'Au-delà des armoires, le projet relie circulation, rangement, surfaces de travail, appareils, éclairage et finitions.',
                  'À Laval et dans les Laurentides, la démarche commence par votre lieu et vos besoins. L’évaluation aide à approfondir, adapter ou écarter les idées.',
                ]}
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-none mb-12">
                <img
                  src={kitchenImages.extra1.src}
                  alt={kitchenImages.extra1.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
                {assessmentItems.map((item) => (
                  <div key={item.title} className="group">
                    <div className="mb-4 h-px w-12 bg-primary transition-all duration-300 group-hover:w-full" />
                    <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPLANTATION (Chapitres compactés et photographiques) */}
      <section id="implantation" className="scroll-mt-20 border-y border-border bg-muted/40 py-14 md:py-16">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-14 max-w-3xl"
            kicker="Les chapitres d’une cuisine cohérente"
            title="Transformer l’intention en décisions concrètes"
            description="Implantation, rangement, lumière et détails se répondent. Un choix d’îlot, par exemple, influence les autres."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {chapters.map((chapter, index) => (
              <PubCard key={chapter.number} className={index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <PubCardMedia
                  src={chapter.image.src}
                  alt={chapter.image.alt}
                  width={chapter.image.width}
                  height={chapter.image.height}
                  badge={chapter.number}
                />
                <PubCardBody>
                  <PubCardTitle>{chapter.title}</PubCardTitle>
                  <PubCardList items={chapter.paragraphs} />
                </PubCardBody>
                <PubCardNote label="Point de planification" icon={Lightbulb}>
                  {chapter.callout}
                </PubCardNote>
              </PubCard>
            ))}
          </div>

          <PubActionBar
            className="mt-10"
            note="Visite et estimation sans frais, réponse sous 48 heures."
            action={<PubCTA service="renovation-cuisine" testId="button-implantation-cta">Obtenir ma soumission sans frais</PubCTA>}
          />
        </div>
      </section>

      {/* MATÉRIAUX */}
      <section id="materiaux" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-12">
            <div>
              <PubSectionHeader
                className="mb-0 max-w-3xl"
                kicker="Des choix à rendre lisibles"
                title="Des détails qui servent la cuisine, jour après jour"
                description={[
                  'Matériaux et équipements influencent le caractère, l’entretien, les usages et la continuité visuelle.',
                  'Textures, lumière naturelle, comptoirs, hauteurs de rangement et mobilier adjacent sont examinés comme un ensemble.',
                ]}
              />
            </div>
            <div className="aspect-[4/3] rounded-none overflow-hidden border border-border">
               <img src={kitchenImages.extra4.src} alt={kitchenImages.extra4.alt} width={kitchenImages.extra4.width} height={kitchenImages.extra4.height} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid gap-6 border-t border-border pt-12 md:grid-cols-3">
            {configurationCards.map(({ icon: Icon, title, points }) => (
              <PubCard key={title}>
                <PubCardBody>
                  <PubCardIcon icon={Icon} />
                  <PubCardTitle>{title}</PubCardTitle>
                  <PubCardList items={points} />
                </PubCardBody>
              </PubCard>
            ))}
          </div>

          <PubActionBar
            className="mt-10"
            note="Plus de 500 projets complétés depuis 18 ans."
            action={<PubCTA service="renovation-cuisine" testId="button-materiaux-cta">Obtenir ma soumission sans frais</PubCTA>}
          />

          <div className="mt-16 rounded-none bg-secondary p-10 text-secondary-foreground md:flex md:items-center md:gap-10">
            <Ruler className="mb-6 h-12 w-12 shrink-0 text-primary md:mb-0" />
            <p className="text-base leading-relaxed md:text-[1.0625rem] text-gray-200">
              <strong className="text-white font-bold block mb-1">Un plan se vérifie dans l’espace.</strong>
              Croquis et inspirations se confrontent aux dimensions, ouvertures, appareils et contraintes du lieu.
            </p>
          </div>
        </div>
      </section>

      {/* UN PROJET PLUS FACILE À EXPLIQUER */}
      <section className="bg-secondary py-16 text-secondary-foreground md:py-20 relative overflow-hidden">
        <div className="container-large mx-auto max-w-7xl px-6 relative z-10">
          <PubSectionHeader
            className="mb-14 max-w-4xl"
            tone="dark"
            kicker="Un projet plus facile à expliquer"
            title="Les bonnes questions avant de confirmer les choix"
            description="Regardez la cuisine en action : courses, café, préparation, rangement et circulation. Ces scènes révèlent ce qui fonctionne ou doit être revu."
          />

          <div className="grid gap-6 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {decisionPoints.map(({ icon: Icon, title, text }) => (
              <PubCard key={title} tone="dark">
                <PubCardBody>
                  <PubCardIcon icon={Icon} />
                  <PubCardTitle>{title}</PubCardTitle>
                  <PubCardText>{text}</PubCardText>
                </PubCardBody>
              </PubCard>
            ))}
          </div>

          <PubChecklist
            className="mt-12"
            tone="dark"
            icon={ClipboardCheck}
            title="À préparer pour la rencontre"
            items={meetingChecklist}
          />

          <PubActionBar
            className="mt-6"
            tone="dark"
            note="19 avis Google 5 étoiles, licence RBQ 8351-9033-59."
            action={<PubCTA service="renovation-cuisine" testId="button-questions-cta">Obtenir ma soumission sans frais</PubCTA>}
          />
        </div>
      </section>

      {/* LE CHANTIER */}
      <section id="chantier" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-12">
            <div className="order-2 lg:order-1 rounded-none overflow-hidden aspect-[4/3] border border-border">
              <img src={kitchenImages.extra3.src} alt={kitchenImages.extra3.alt} width={kitchenImages.extra3.width} height={kitchenImages.extra3.height} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <PubSectionHeader
                className="mb-0 max-w-3xl"
                kicker="Du plan aux travaux"
                title="Une séquence de chantier à organiser avec soin"
                description={[
                  'Retrait, services, surfaces, installation et finitions suivent une séquence adaptée aux choix et aux conditions sur place.',
                  'SLC Habitation relie la planification aux interventions nécessaires et aux éléments à évaluer pendant le chantier.',
                ]}
              />
            </div>
          </div>

          <div className="grid gap-6 border-t border-border pt-12 md:grid-cols-4">
            {siteSteps.map(({ icon: Icon, title, text }, index) => (
              <PubCard key={title}>
                <PubCardBody>
                  <PubCardNumber icon={Icon}>{`0${index + 1}`}</PubCardNumber>
                  <PubCardTitle rule>{title}</PubCardTitle>
                  <PubCardText>{text}</PubCardText>
                </PubCardBody>
              </PubCard>
            ))}
          </div>

          <PubInvite
            className="mt-16"
            kicker="Prochaine étape"
            title="Votre cuisine mérite une réflexion complète"
            description="Présentez la pièce, vos priorités et les changements envisagés. Une première discussion situe les éléments à examiner."
            action={<PubCTA service="renovation-cuisine" testId="button-middle-cta">Discuter de ma cuisine</PubCTA>}
          />
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-y border-border bg-primary/5 py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubTestimonial
            quote="Excellente compagnie, service professionnel et souci du détail! Merci à votre équipe pour vos bons conseils. Je recommande à tous pour la réalisation de vos projets!"
            author="Mélodie Binette"
            role="Propriétaire"
          />
        </div>
      </section>

      {/* GALERIE */}
      <PubGallery
        id="realisations"
        kicker="Cuisines réalisées"
        title="Des cuisines terminées par notre équipe"
        description="Quelques projets menés du plan aux finitions, avec les propriétaires, parmi les 500 réalisés depuis 18 ans."
        images={kitchenGallery}
      />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="mx-auto text-center max-w-3xl mb-16"
            kicker="Réponses utiles"
            title="Questions fréquentes sur une rénovation de cuisine"
            description="Les réponses ci-dessous donnent des repères; les possibilités précises dépendent toujours de votre espace et de l’évaluation du projet."
          />
          <FAQList>
            {faqs.map((faq) => <FAQ key={faq.question} question={faq.question} answer={faq.answer} />)}
          </FAQList>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section data-sticky-hide className="relative isolate overflow-hidden bg-secondary py-20 text-white md:py-24">
        <img
          src={kitchenImages.hero.src}
          alt=""
          aria-hidden="true"
          width={kitchenImages.hero.width}
          height={kitchenImages.hero.height}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-secondary/85" />
        <div className="container-large relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-primary">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-5 font-bold">Prêt à clarifier votre projet de cuisine?</h2>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Décrivez votre cuisine actuelle et ce que vous voulez changer. Nous vous répondons sous 48 heures et la visite d’évaluation est sans frais.</p>
          <PubCTA service="renovation-cuisine" size="lg" testId="button-bottom-cta">Demander ma soumission sans frais</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
