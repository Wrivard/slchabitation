import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { PubPageNav, PubSectionHeader } from '@/components/pub/PubShared';
import { FAQ } from '@/components/pub/FAQ';
import { Check, Grid, Lightbulb, MapPin, Ruler, ShieldCheck, Utensils, ArrowRight, ClipboardCheck } from 'lucide-react';

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
    src: '/images/INT%C3%89RIEUR/Cuisine/12509173_866265596824275_1393287164403664650_n%20(1).jpg',
    alt: 'Cuisine classique avec boiseries',
    width: 510,
    height: 561,
  }
};

const navItems = [
  { href: '#demarche', label: 'La démarche' },
  { href: '#implantation', label: 'Implantation' },
  { href: '#materiaux', label: 'Détails pratiques' },
  { href: '#chantier', label: 'Le chantier' },
  { href: '#faq', label: 'FAQ' },
];

const assessmentItems = [
  { title: 'Implantation et circulation', text: 'Passages, ouvertures, lumière et espace autour des zones de travail.' },
  { title: 'Structure existante', text: 'Murs, niveaux et particularités du bâtiment orientent la configuration possible.' },
  { title: 'Services techniques', text: 'Plomberie, ventilation et alimentation électrique sont considérées avant les choix.' },
  { title: 'Équipements et finitions', text: 'Appareils, rangements, surfaces et raccords se planifient ensemble.' },
];

const configurationCards = [
  { icon: Grid, title: 'Armoires et surfaces', text: 'Caissons, façades, poignées, comptoirs et dosserets forment un ensemble. Proportions, joints et transitions comptent aussi.' },
  { icon: Utensils, title: 'Rangement utile', text: 'Tiroirs, garde-manger et armoires s’organisent selon vos objets et vos gestes réels.' },
  { icon: Lightbulb, title: 'Éclairage par usage', text: 'Éclairages général, de travail et d’ambiance se distinguent. Leur emplacement se prévoit avec les armoires.' },
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
  { title: 'Comprendre le lieu', text: 'Volumes, murs, accès, installations et objectifs.' },
  { title: 'Planifier les interventions', text: 'Implantation et matériaux reliés à la plomberie, l’électricité, la ventilation et la menuiserie.' },
  { title: 'Préparer les séquences', text: 'Démolition, ajustements techniques, surfaces et finitions dans un ordre adapté.' },
  { title: 'Avancer avec méthode', text: 'Décisions et interventions alignées sur le plan et les conditions observées.' },
];

const decisionPoints = [
  {
    title: 'Le plan de travail',
    text: 'Suivez le trajet des aliments : arrivée, lavage, préparation, cuisson. Position, continuité et dégagement comptent autant que la superficie.',
  },
  {
    title: 'Les appareils',
    text: 'Réfrigérateur, lave-vaisselle, four, micro-ondes et petits appareils ont leurs dimensions, portes et raccordements. Leur interaction compte à plusieurs.',
  },
  {
    title: 'Les passages',
    text: 'Les trajets vers le salon, la salle à manger, l’extérieur ou l’escalier traversent parfois la cuisine. L’évaluation situe les zones actives et les conflits possibles.',
  },
  {
    title: 'Les finitions',
    text: 'Jonctions comptoir-dosseret, transitions de plancher, moulures et poignées façonnent l’ensemble. Les discuter tôt facilite leur coordination.',
  },
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
      <section className="relative overflow-hidden bg-secondary text-white min-h-[85vh] flex flex-col justify-end">
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
        <div className="container-large relative mx-auto max-w-7xl px-6 pb-20 pt-32 fade-up">
          <div className="max-w-4xl">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-medium tracking-wide sm:text-sm">
              <span className="flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2 rounded-none"><ShieldCheck className="h-4 w-4 text-primary" />Licence RBQ : 8351-9033-59</span>
              <span className="flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2 rounded-none"><MapPin className="h-4 w-4 text-primary" />Laval et Laurentides</span>
              <span className="border border-white/25 bg-white/10 px-4 py-2 rounded-none">18 ans d&apos;expérience</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Cuisine pensée pour votre quotidien</p>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">Rénovation de cuisine à Laval et dans les Laurentides</h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">SLC Habitation examine vos usages, votre espace et ses contraintes techniques pour planifier une rénovation adaptée.</p>
            <PubCTA service="renovation-cuisine" className="px-8 py-5 text-lg" testId="button-hero-cta">Parler de mon projet</PubCTA>
          </div>
        </div>
      </section>

      <PubPageNav items={navItems} />

      {/* LECTURE COMPLÈTE */}
      <section id="demarche" className="scroll-mt-20 bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
              <PubSectionHeader
                kicker="Une lecture complète de la pièce"
                title="Avant les choix visibles, comprendre ce qui soutient le projet"
              />
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>Au-delà des armoires, le projet relie circulation, rangement, surfaces de travail, appareils, éclairage et finitions.</p>
                <p>À Laval et dans les Laurentides, la démarche commence par votre lieu et vos besoins. L’évaluation aide à approfondir, adapter ou écarter les idées.</p>
              </div>
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
      <section id="implantation" className="scroll-mt-20 border-y border-border bg-muted/40 py-20 md:py-24">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-14 max-w-3xl"
            kicker="Les chapitres d’une cuisine cohérente"
            title="Transformer l’intention en décisions concrètes"
            description="Implantation, rangement, lumière et détails se répondent. Un choix d’îlot, par exemple, influence les autres."
          />

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <article key={chapter.number} className="flex flex-col group">
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-none">
                  <img
                    src={chapter.image.src}
                    alt={chapter.image.alt}
                    width={chapter.image.width}
                    height={chapter.image.height}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 px-4 py-2 rounded-none font-bold text-primary text-sm tracking-widest">
                    {chapter.number}
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold leading-tight text-foreground">{chapter.title}</h3>
                <div className="mb-6 flex-grow space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {chapter.paragraphs.map((p) => <p key={p}>{p}</p>)}
                </div>
                <div className="mt-auto border-t border-border pt-5">
                  <strong className="block text-foreground text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" /> Point de planification
                  </strong>
                  <p className="text-muted-foreground text-sm leading-relaxed">{chapter.callout}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MATÉRIAUX */}
      <section id="materiaux" className="scroll-mt-20 bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center mb-20">
            <div>
              <PubSectionHeader
                kicker="Des choix à rendre lisibles"
                title="Des détails qui servent la cuisine, jour après jour"
                description="Matériaux et équipements influencent le caractère, l’entretien, les usages et la continuité visuelle."
              />
              <p className="text-lg leading-relaxed text-muted-foreground">Textures, lumière naturelle, comptoirs, hauteurs de rangement et mobilier adjacent sont examinés comme un ensemble.</p>
            </div>
            <div className="aspect-[4/5] rounded-none overflow-hidden border border-border">
               <img src={kitchenImages.extra4.src} alt={kitchenImages.extra4.alt} width={kitchenImages.extra4.width} height={kitchenImages.extra4.height} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-border pt-16">
            {configurationCards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col">
                <Icon className="w-8 h-8 text-primary mb-6 stroke-[1.5]" />
                <h3 className="mb-4 text-xl font-bold text-foreground">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-none bg-secondary p-10 text-secondary-foreground md:flex md:items-center md:gap-10">
            <Ruler className="mb-6 h-12 w-12 shrink-0 text-primary md:mb-0" />
            <p className="text-lg leading-relaxed text-gray-200">
              <strong className="text-white font-bold block mb-1">Un plan se vérifie dans l’espace.</strong>
              Croquis et inspirations se confrontent aux dimensions, ouvertures, appareils et contraintes du lieu.
            </p>
          </div>
        </div>
      </section>

      {/* UN PROJET PLUS FACILE À EXPLIQUER */}
      <section className="bg-secondary py-24 text-secondary-foreground md:py-32 relative overflow-hidden">
        <div className="container-large mx-auto max-w-7xl px-6 relative z-10">
          <PubSectionHeader
            className="mb-14 max-w-4xl"
            tone="dark"
            kicker="Un projet plus facile à expliquer"
            title="Les bonnes questions avant de confirmer les choix"
            description="Regardez la cuisine en action : courses, café, préparation, rangement et circulation. Ces scènes révèlent ce qui fonctionne ou doit être revu."
          />

          <div className="grid gap-x-12 gap-y-8 border-y border-white/15 py-10 text-gray-300 sm:grid-cols-2">
            <div className="border-l-2 border-primary pl-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Priorités</p>
              <p className="leading-relaxed">Séparez les besoins essentiels des souhaits à explorer. Une option reste à valider selon le bâtiment.</p>
            </div>
            <div className="border-l-2 border-primary pl-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Inspirations</p>
              <p className="leading-relaxed">Utilisez-les pour préciser une ambiance, puis ramenez-les à la pièce réelle.</p>
            </div>
            <div className="border-l-2 border-primary pl-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Style</p>
              <p className="leading-relaxed">Notez couleurs, textures, poignées, armoires hautes et place de l’îlot. Lumière, dimensions et technique guideront les ajustements.</p>
            </div>
            <div className="border-l-2 border-primary pl-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Pièces adjacentes</p>
              <p className="leading-relaxed">Observez les vues, les murs, les sols et le rangement visible depuis le séjour, la salle à manger ou l’entrée.</p>
            </div>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {decisionPoints.map((item) => (
              <div key={item.title} className="border-t border-white/20 pt-6">
                <h3 className="mb-4 text-xl font-bold text-white">{item.title}</h3>
                <p className="leading-relaxed text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>

          <aside className="mt-14 rounded-none border border-primary/30 bg-primary/10 p-8 text-gray-200">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <ClipboardCheck className="text-primary w-6 h-6" /> Pour une rencontre productive
            </h3>
            <ul className="grid gap-5 leading-relaxed md:grid-cols-2">
              <li className="border-t border-white/15 pt-4"><strong className="mb-1 block text-white">À conserver ou corriger</strong>Notez ce qui fonctionne, ce qui dérange et ce que vous voulez faciliter.</li>
              <li className="border-t border-white/15 pt-4"><strong className="mb-1 block text-white">Repères du lieu</strong>Apportez dimensions connues et photos des murs, fenêtres et installations. Elles ne remplacent pas l’évaluation.</li>
              <li className="border-t border-white/15 pt-4"><strong className="mb-1 block text-white">Options à comparer</strong>Expliquez l’usage visé : repas sur banquette, préparation sur l’îlot ou provisions en armoire haute.</li>
              <li className="border-t border-white/15 pt-4"><strong className="mb-1 block text-white">Vie pendant les travaux</strong>Signalez les accès utilisés et les pièces voisines à protéger.</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* LE CHANTIER */}
      <section id="chantier" className="scroll-mt-20 bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center mb-20">
            <div className="order-2 lg:order-1 rounded-none overflow-hidden aspect-[4/3] border border-border">
              <img src={kitchenImages.extra3.src} alt={kitchenImages.extra3.alt} width={kitchenImages.extra3.width} height={kitchenImages.extra3.height} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <PubSectionHeader
                kicker="Du plan aux travaux"
                title="Une séquence de chantier à organiser avec soin"
                description="Retrait, services, surfaces, installation et finitions suivent une séquence adaptée aux choix et aux conditions sur place."
              />
              <p className="text-lg leading-relaxed text-muted-foreground">SLC Habitation relie la planification aux interventions nécessaires et aux éléments à évaluer pendant le chantier.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-10 border-t border-border pt-16">
            {siteSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <span className="block text-6xl font-black text-primary/10 mb-4 tracking-tighter">0{index + 1}</span>
                <h3 className="mb-4 text-xl font-bold text-foreground">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center max-w-2xl mx-auto">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Votre cuisine mérite une réflexion complète</h2>
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">Présentez la pièce, vos priorités et les changements envisagés. Une première discussion situe les éléments à examiner.</p>
            <PubCTA service="renovation-cuisine" className="px-10 py-5 text-lg" testId="button-middle-cta">Discuter de ma cuisine</PubCTA>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-primary/5 py-24 text-foreground md:py-32 border-y border-border">
        <div className="container-large mx-auto max-w-4xl px-6 text-center">
          <blockquote className="mb-10 font-heading text-3xl md:text-4xl font-medium leading-tight text-foreground">
            « Excellente compagnie, service professionnel et soucis du détails! Merci à votre équipe pour vos bons conseils. Je recommande à tous pour la réalisation de vos projets! »
          </blockquote>
          <p className="font-bold text-lg text-foreground">Mélodie Binette</p>
          <p className="text-muted-foreground">Propriétaire</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="mx-auto text-center max-w-3xl mb-16"
            kicker="Réponses utiles"
            title="Questions fréquentes sur une rénovation de cuisine"
            description="Les réponses ci-dessous donnent des repères; les possibilités précises dépendent toujours de votre espace et de l’évaluation du projet."
          />
          <div className="space-y-2 border-t border-border pt-8">
            {faqs.map((faq) => <FAQ key={faq.question} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="bg-secondary py-24 text-white md:py-32">
        <div className="container-large mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-none bg-white/10">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">Prêt à clarifier votre projet de cuisine?</h2>
          <p className="mb-12 text-lg leading-relaxed text-gray-300">Présentez votre point de départ, les usages à améliorer et les changements envisagés pour votre rénovation à Laval ou dans les Laurentides.</p>
          <PubCTA service="renovation-cuisine" className="px-10 py-5 text-lg" testId="button-bottom-cta">Demander une soumission</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
