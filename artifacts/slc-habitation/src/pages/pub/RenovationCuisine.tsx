import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { FAQ } from '@/components/pub/FAQ';
import { ArrowDown, Check, ClipboardCheck, Grid, Lightbulb, MapPin, Ruler, ShieldCheck, Utensils, Zap } from 'lucide-react';

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
};

const navItems = [
  { href: '#demarche', label: 'La démarche' },
  { href: '#implantation', label: 'Implantation' },
  { href: '#materiaux', label: 'Détails pratiques' },
  { href: '#chantier', label: 'Le chantier' },
  { href: '#faq', label: 'FAQ' },
];

const assessmentItems = [
  { title: 'Implantation et circulation', text: 'Nous observons les passages, les ouvertures, la lumière et la place réellement disponible autour des zones de travail.' },
  { title: 'Structure existante', text: 'Les murs, les niveaux et les particularités du bâtiment orientent ce qui peut être envisagé pour une nouvelle configuration.' },
  { title: 'Services techniques', text: 'La position de la plomberie, de la ventilation et de l’alimentation électrique est considérée avant de fixer les choix.' },
  { title: 'Équipements et finitions', text: 'Les dimensions des appareils, le type de rangement, les surfaces et les raccords se planifient ensemble plutôt qu’en dernier.' },
];

const configurationCards = [
  { icon: Grid, title: 'Armoires et surfaces', text: 'La sélection des caissons, façades, poignées, comptoirs et dosserets se réfléchit comme un ensemble. Les proportions, les joints et les transitions comptent autant que chaque matériau pris séparément.' },
  { icon: Utensils, title: 'Rangement utile', text: 'Tiroirs, garde-manger, armoires hautes et espaces près des zones de préparation peuvent être organisés selon les objets que vous utilisez vraiment et les gestes que vous répétez.' },
  { icon: Lightbulb, title: 'Éclairage par usage', text: 'Une cuisine gagne à distinguer l’éclairage général, l’éclairage de travail et l’éclairage d’ambiance. Leur emplacement se prévoit avec les armoires et non après leur pose.' },
];

const chapters = [
  {
    number: '01',
    title: 'Partir de vos habitudes, pas seulement d’une image',
    paragraphs: [
      'Une cuisine réussie commence par une lecture attentive de votre quotidien. Préparez-vous souvent les repas à deux ou à plusieurs? Avez-vous besoin d’une grande surface pour cuisiner, d’un coin repas, d’un espace pour les enfants ou d’un garde-manger plus accessible? Ces questions permettent de donner une fonction précise à chaque zone avant de parler de finis.',
      'Nous examinons avec vous les irritants de la cuisine actuelle : un réfrigérateur qui coupe le passage, des comptoirs trop courts, des prises mal situées, un évier éloigné de la préparation ou des armoires difficiles à utiliser. Une rénovation peut alors viser une circulation plus lisible et des choix cohérents avec le volume de la pièce.',
    ],
    callout: 'À préparer pour la rencontre : quelques photos de la pièce, les dimensions connues, vos électroménagers à conserver ou à remplacer, et une liste de ce qui vous manque au quotidien.',
    image: kitchenImages.island,
  },
  {
    number: '02',
    title: 'Composer une implantation qui laisse respirer la pièce',
    paragraphs: [
      'L’implantation met en relation les principales zones de la cuisine : conservation, lavage, préparation et cuisson. Il ne s’agit pas d’appliquer une formule identique à toutes les maisons; une cuisine en corridor, en L, en U ou ouverte sur le séjour présente des contraintes et des occasions différentes. Les accès, les fenêtres et les portes font partie de l’équation.',
      'Un îlot peut offrir un comptoir additionnel, du rangement ou un point de rencontre, à condition que les dégagements autour de lui soient étudiés. Dans d’autres pièces, une péninsule ou un long plan de travail peut mieux convenir. L’évaluation de l’espace existant aide à choisir une solution proportionnée, sans encombrer les parcours.',
    ],
    callout: 'Repère pratique : ouvrez mentalement les portes d’armoires, le lave-vaisselle et les tiroirs. Les zones de passage doivent rester considérées lorsque plusieurs éléments sont utilisés en même temps.',
    image: kitchenImages.modern,
  },
  {
    number: '03',
    title: 'Coordonner les détails avant qu’ils ne deviennent des ajustements',
    paragraphs: [
      'Les dimensions réelles des appareils influencent l’implantation des armoires, les dégagements, les prises et parfois la ventilation. Avoir leurs fiches techniques au moment de la planification permet de vérifier les besoins liés à l’installation. Le même principe s’applique au choix de l’évier, de la robinetterie, de la hotte et de la surface de cuisson.',
      'Les matériaux demandent aussi une coordination concrète. Un comptoir, un dosseret, une moulure ou un plancher se rencontrent à des endroits précis. Nous portons attention aux lignes visibles, aux hauteurs, aux seuils et aux retours de finition afin de préparer une composition qui s’accorde à votre intérieur.',
    ],
    callout: 'Bon à noter : conservez les documents techniques des appareils choisis. Ils donnent les dimensions, les exigences de branchement et les dégagements à valider dans le plan.',
    image: kitchenImages.floor,
  },
  {
    number: '04',
    title: 'Prévoir le rangement à partir de ce que vous possédez',
    paragraphs: [
      'Le rangement n’est pas une quantité abstraite d’armoires. Il est plus utile lorsqu’il répond aux objets, aux formats et aux habitudes de la maison. Les casseroles, les provisions, les contenants, les petits appareils et la vaisselle n’ont pas tous besoin du même accès. En les nommant dès le départ, vous pouvez distinguer ce qui doit rester à portée de main de ce qui peut prendre place plus haut ou plus loin.',
      'Les grands tiroirs peuvent convenir à certains usages, tandis que les armoires verticales, les tablettes ou un garde-manger peuvent répondre à d’autres. L’important est d’éviter que le rangement empiète sur les surfaces nécessaires à la préparation. La profondeur, la largeur des façades et le sens d’ouverture se regardent avec les parcours réels autour de la cuisine.',
    ],
    callout: 'Exercice simple : faites la liste de cinq objets qui encombrent votre comptoir aujourd’hui. Leur usage et leur fréquence aideront à imaginer où ils pourraient être rangés demain.',
    image: kitchenImages.compact,
  },
  {
    number: '05',
    title: 'Faire de la lumière un outil de confort et de précision',
    paragraphs: [
      'Une seule source de lumière au plafond ne répond pas toujours aux différents moments vécus dans la cuisine. Préparer un repas demande de voir clairement le plan de travail; un repas partagé ou un passage en soirée appelle souvent une ambiance différente. Le placement de l’éclairage se réfléchit en parallèle avec l’implantation des armoires, l’îlot et les zones où les ombres pourraient gêner.',
      'La lumière du jour influence également les couleurs et les surfaces. Une porte, une fenêtre, une orientation ou une aire ouverte peuvent modifier la perception d’un fini au fil de la journée. Observer la pièce à plusieurs moments donne des repères utiles lorsque vous comparez des matériaux. Les besoins techniques associés à l’éclairage sont ensuite considérés dans la planification du projet.',
    ],
    callout: 'À observer chez vous : repérez les zones où vous préparez les aliments le matin et le soir. Cette observation concrète aide à exprimer les besoins d’éclairage au bon endroit.',
    image: kitchenImages.island,
  },
];

const siteSteps = [
  { title: 'Comprendre le lieu', text: 'Le point de départ est la cuisine telle qu’elle existe : volumes, murs, accès, installations et objectifs du projet.' },
  { title: 'Planifier les interventions', text: 'Les choix d’implantation et de matériaux sont mis en relation avec les travaux nécessaires en plomberie, électricité, ventilation et menuiserie.' },
  { title: 'Préparer les séquences', text: 'La démolition, les ajustements techniques, les surfaces et les finitions nécessitent un ordre de travail adapté au projet.' },
  { title: 'Avancer avec méthode', text: 'La coordination vise à garder les décisions et les interventions alignées avec le plan retenu, selon les conditions observées sur place.' },
];

const decisionPoints = [
  {
    title: 'Le plan de travail',
    text: 'Demandez-vous où les aliments arrivent, où ils sont lavés, puis où ils sont préparés. La place disponible entre l’évier, la cuisson et les autres éléments peut être examinée selon vos habitudes. Une grande surface n’est pas la seule réponse : sa position, sa continuité et la possibilité de la garder dégagée font aussi une différence dans l’usage quotidien.',
  },
  {
    title: 'Les appareils',
    text: 'Réfrigérateur, lave-vaisselle, four, micro-ondes et petit électroménager créent des besoins différents. Leurs dimensions, leurs portes et leurs raccordements ne doivent pas être traités comme de simples cases sur un dessin. Prévoir ces informations aide à discuter de l’emplacement de chacun et des interactions possibles lorsque la cuisine est utilisée par plusieurs personnes.',
  },
  {
    title: 'Les passages',
    text: 'Une cuisine est traversée pour aller vers le salon, la salle à manger, une porte extérieure ou un escalier. Un projet tient compte de ces déplacements et des personnes qui ne cuisinent pas nécessairement au même moment. Les parcours peuvent être observés lors de l’évaluation afin de situer les zones actives et de limiter les conflits d’usage dans la mesure permise par l’espace.',
  },
  {
    title: 'Les finitions',
    text: 'Une finition se juge autant dans ses détails que dans un échantillon. Les jonctions entre le comptoir et le dosseret, la rencontre du plancher avec les pièces voisines, les moulures et les poignées participent à l’ensemble. Les discuter tôt permet de relier le caractère souhaité aux éléments qui doivent être coordonnés pendant les travaux.',
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
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0">
          <img src={kitchenImages.hero.src} alt={kitchenImages.hero.alt} width={kitchenImages.hero.width} height={kitchenImages.hero.height} className="h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="container-large relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
          <div className="max-w-4xl">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-medium tracking-wide sm:text-sm">
              <span className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2"><ShieldCheck className="h-4 w-4 text-primary" />Licence RBQ : 8351-9033-59</span>
              <span className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2"><MapPin className="h-4 w-4 text-primary" />Laval et Laurentides</span>
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2">18 ans d&apos;expérience</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Cuisine pensée pour votre quotidien</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">Rénovation de cuisine à Laval et dans les Laurentides</h1>
            <p className="mb-9 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">Réfléchir à une cuisine, c’est organiser des usages, des volumes et des interventions techniques dans un espace qui doit rester agréable à vivre. SLC Habitation vous accompagne pour examiner votre pièce et planifier une rénovation adaptée à ses particularités.</p>
            <PubCTA service="renovation-cuisine" className="px-8 py-5 text-lg" testId="button-hero-cta">Parler de mon projet</PubCTA>
          </div>
        </div>
      </section>

      <nav aria-label="Navigation dans la page" className="sticky top-0 z-20 border-b border-border bg-background/95 shadow-sm backdrop-blur">
        <div className="container-large mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-3">
          <span className="hidden shrink-0 text-sm font-bold text-foreground md:inline">Explorer la page</span>
          {navItems.map((item) => <a key={item.href} href={item.href} className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">{item.label}</a>)}
          <a href="#demarche" aria-label="Aller à la démarche" className="ml-auto shrink-0 rounded-full p-2 text-primary"><ArrowDown className="h-4 w-4" /></a>
        </div>
      </nav>

      <section id="demarche" className="scroll-mt-20 bg-background py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Une lecture complète de la pièce</p>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-foreground md:text-5xl">Avant les choix visibles, comprendre ce qui soutient le projet</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>Une rénovation de cuisine ne se limite pas au remplacement des armoires. La pièce est liée aux autres espaces de la maison, à ses installations existantes et à la manière dont votre foyer l’utilise. Une réflexion globale aide à mettre les priorités dans le bon ordre : circulation, rangement, surfaces de travail, appareils, éclairage et finitions.</p>
              <p>À Laval et dans les Laurentides, chaque domicile présente sa propre configuration. La démarche commence donc par une évaluation du lieu et de vos besoins. Selon ce qui est observé, certaines idées pourront être approfondies, adaptées ou écartées. Cette étape donne une base plus claire aux décisions qui suivent.</p>
            </div>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {assessmentItems.map((item) => <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm"><ClipboardCheck className="mb-5 h-6 w-6 text-primary" /><h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3><p className="leading-relaxed text-muted-foreground">{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="implantation" className="scroll-mt-20 border-y border-border bg-muted/30 py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <header className="mx-auto mb-14 max-w-3xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Les chapitres d’une cuisine cohérente</p><h2 className="mb-5 text-3xl font-bold text-foreground md:text-5xl">Transformer l’intention en décisions concrètes</h2><p className="text-lg leading-relaxed text-muted-foreground">Chaque chapitre éclaire une partie du projet. Ils sont courts à lire, mais se répondent : une décision sur l’îlot peut influencer l’éclairage, le rangement et les parcours autour de la cuisine.</p></header>
          <div className="space-y-16">
            {chapters.map((chapter, index) => <article key={chapter.number} className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
              <div><span className="text-5xl font-bold text-primary/35">{chapter.number}</span><h3 className="mb-5 mt-2 text-3xl font-bold leading-tight text-foreground">{chapter.title}</h3><div className="space-y-4 leading-relaxed text-muted-foreground">{chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><aside className="mt-6 rounded-r-xl border-l-4 border-primary bg-background p-5 text-sm leading-relaxed text-foreground"><strong className="block pb-1">Point de planification</strong>{chapter.callout}</aside></div>
              <figure className="overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-lg"><img src={chapter.image.src} alt={chapter.image.alt} width={chapter.image.width} height={chapter.image.height} loading="lazy" className="h-[360px] w-full object-cover" /></figure>
            </article>)}
          </div>
        </div>
      </section>

      <section id="materiaux" className="scroll-mt-20 bg-background py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Des choix à rendre lisibles</p><h2 className="mb-6 text-3xl font-bold leading-tight text-foreground md:text-5xl">Des détails qui servent la cuisine, jour après jour</h2><p className="mb-5 text-lg leading-relaxed text-muted-foreground">Les matériaux et les équipements donnent un caractère à la pièce, mais ils ont aussi une incidence sur l’entretien, les usages et la continuité visuelle. Le bon choix est celui qui tient compte de l’ensemble : la lumière naturelle, le mobilier adjacent, le niveau d’activité de la cuisine et les préférences du foyer.</p><p className="leading-relaxed text-muted-foreground">Au lieu d’additionner les tendances, nous pouvons examiner les associations de textures, la profondeur des comptoirs, les hauteurs de rangement et les points de contact du quotidien. Cette attention aide à obtenir une cuisine dont chaque élément a une raison d’être.</p></div>
            <figure className="overflow-hidden rounded-[2rem] shadow-xl"><img src={kitchenImages.compact.src} alt={kitchenImages.compact.alt} width={kitchenImages.compact.width} height={kitchenImages.compact.height} loading="lazy" className="h-[420px] w-full object-cover" /></figure>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">{configurationCards.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border p-7"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div><h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3><p className="leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
          <div className="mt-10 rounded-2xl bg-secondary p-7 text-secondary-foreground md:flex md:items-center md:gap-8"><Ruler className="mb-4 h-9 w-9 shrink-0 text-primary md:mb-0" /><p className="leading-relaxed text-gray-200"><strong className="text-white">Un plan se vérifie dans l’espace.</strong> Les croquis et les inspirations sont utiles, puis les dimensions, les ouvertures, les appareils et les contraintes du lieu permettent de les confronter à la réalité de votre cuisine.</p></div>
        </div>
      </section>

      <section className="bg-secondary py-20 text-secondary-foreground md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Un projet plus facile à expliquer</p>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-5xl">Les bonnes questions avant de confirmer les choix</h2>
              <p className="mb-5 text-lg leading-relaxed text-gray-300">Avant d’arrêter un plan, il est utile de regarder la cuisine comme une succession de scènes : l’arrivée des courses, le café du matin, la préparation d’un repas, le rangement et la circulation vers les autres pièces. Cette approche donne un langage simple pour partager ce qui fonctionne et ce qui mérite d’être revu.</p>
              <p className="leading-relaxed text-gray-300">Vous n’avez pas besoin d’avoir toutes les réponses avant d’amorcer une discussion. Des photos d’inspiration peuvent aider à communiquer une ambiance, mais les décisions prennent leur sens lorsqu’elles sont ramenées à la pièce réelle. Le projet peut alors s’appuyer sur des priorités concrètes plutôt que sur une liste de tendances.</p>
              <p className="mt-5 leading-relaxed text-gray-300">Il est également utile de séparer les besoins essentiels des souhaits à explorer. Par exemple, une famille peut vouloir davantage de rangement près de la préparation, tout en se demandant si une ouverture vers une pièce voisine est envisageable. En distinguant ces deux niveaux, la conversation peut avancer sans présumer qu’une option sera possible avant d’avoir regardé les conditions du bâtiment. Les préférences de style, elles aussi, gagnent à être accompagnées de références précises : une couleur, une texture, le type de poignée, la présence ou non d’armoires hautes, ou la place accordée à un îlot. Ces repères aident à mettre des mots sur une ambiance, puis à l’ajuster en fonction de la lumière, des dimensions et des choix techniques. Une cuisine cohérente ne résulte pas nécessairement d’un seul geste spectaculaire; elle peut naître d’une série de décisions compatibles entre elles. Enfin, pensez aux pièces adjacentes : une nouvelle cuisine peut modifier les vues depuis le séjour, la salle à manger ou l’entrée. La couleur des murs, la continuité des sols et le niveau de rangement visible sont des points simples à noter afin que la nouvelle pièce s’inscrive naturellement dans l’ensemble de la maison. Cette vision d’ensemble permet aussi de mieux expliquer vos arbitrages lorsque toutes les options ne se combinent pas dans une même configuration, avec des décisions documentées et comprises avant les interventions à coordonner.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">{decisionPoints.map((item) => <article key={item.title} className="rounded-2xl border border-white/15 bg-white/5 p-6"><h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3><p className="text-sm leading-relaxed text-gray-300">{item.text}</p></article>)}</div>
          </div>
          <aside className="mt-10 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-gray-200">
            <h3 className="mb-2 text-lg font-bold text-white">Pour une rencontre productive</h3>
            <p className="leading-relaxed">Notez ce que vous souhaitez conserver, ce qui vous dérange et ce que vous voulez pouvoir faire plus facilement dans votre future cuisine. Ajoutez les dimensions connues, les photos des murs, des fenêtres et des installations existantes. Ces éléments ne remplacent pas l’évaluation, mais ils rendent la conversation plus précise dès le départ. Si vous hésitez entre plusieurs idées, indiquez ce que chacune changerait dans votre quotidien. Une banquette peut créer une place pour les repas, un îlot peut devenir une zone de préparation, et une armoire pleine hauteur peut répondre au besoin de provisions; le contexte permet de comparer ces intentions. Il est aussi pertinent de signaler les contraintes de vie pendant les travaux, comme un accès utilisé régulièrement ou une pièce voisine à protéger. Ces informations donnent une image plus complète du projet à examiner et des choix qui devront être coordonnés.</p>
          </aside>
        </div>
      </section>

      <section id="chantier" className="scroll-mt-20 border-y border-border bg-muted/30 py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <figure className="overflow-hidden rounded-[2rem] shadow-xl"><img src="/images/relume-567906.jpeg" alt="Cuisine moderne ouverte avec îlot" width="1440" height="1440" loading="lazy" className="h-[420px] w-full object-cover" /></figure>
            <div><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Du plan aux travaux</p><h2 className="mb-6 text-3xl font-bold leading-tight text-foreground md:text-5xl">Une séquence de chantier à organiser avec soin</h2><p className="mb-5 text-lg leading-relaxed text-muted-foreground">La rénovation met en présence plusieurs types d’intervention. Retirer les éléments existants, ajuster les services, préparer les surfaces, installer les composantes puis traiter les finitions demande une coordination qui tient compte des choix retenus et de la situation rencontrée sur place.</p><p className="leading-relaxed text-muted-foreground">SLC Habitation aborde le projet comme un ensemble. L’objectif est de relier les décisions de planification aux interventions nécessaires, en gardant une communication claire sur ce qui doit être évalué à mesure que le chantier avance.</p></div>
          </div>
          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{siteSteps.map((step, index) => <li key={step.title} className="rounded-2xl border border-border bg-background p-6"><span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</span><h3 className="mb-3 text-lg font-bold text-foreground">{step.title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p></li>)}</ol>
          <div className="mt-12 text-center"><h2 className="mb-4 text-3xl font-bold text-foreground">Votre cuisine mérite une réflexion complète</h2><p className="mx-auto mb-7 max-w-2xl leading-relaxed text-muted-foreground">Parlez-nous de la pièce, de vos priorités et des changements envisagés. Une première discussion permet de situer votre projet et les éléments à examiner.</p><PubCTA service="renovation-cuisine" className="px-8 py-5 text-lg" testId="button-middle-cta">Discuter de ma cuisine</PubCTA></div>
        </div>
      </section>

      <section className="bg-secondary py-20 text-secondary-foreground md:py-24">
        <div className="container-large mx-auto max-w-4xl px-6 text-center"><blockquote className="mb-8 text-2xl font-medium leading-snug text-white md:text-3xl">« Excellente compagnie, service professionnel et soucis du détails! Merci à votre équipe pour vos bons conseils. Je recommande à tous pour la réalisation de vos projets! »</blockquote><p className="font-bold text-white">Mélodie Binette</p><p className="text-sm text-gray-400">Propriétaire</p></div>
      </section>

      <section id="faq" className="scroll-mt-20 bg-background py-20 md:py-28">
        <div className="container-large mx-auto max-w-4xl px-6"><header className="mb-12 text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Réponses utiles</p><h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">Questions fréquentes sur une rénovation de cuisine</h2><p className="text-lg text-muted-foreground">Les réponses ci-dessous donnent des repères; les possibilités précises dépendent toujours de votre espace et de l’évaluation du projet.</p></header><div className="space-y-4">{faqs.map((faq) => <FAQ key={faq.question} question={faq.question} answer={faq.answer} />)}</div></div>
      </section>

      <section className="border-t border-border bg-muted/30 py-20 md:py-28">
        <div className="container-large mx-auto max-w-4xl px-6 text-center"><div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Check className="h-7 w-7" /></div><h2 className="mb-5 text-3xl font-bold text-foreground md:text-5xl">Prêt à clarifier votre projet de cuisine?</h2><p className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-muted-foreground">Expliquez-nous votre point de départ, les usages que vous souhaitez améliorer et les changements envisagés. Nous pourrons vous orienter vers les éléments à considérer pour votre rénovation à Laval ou dans les Laurentides.</p><PubCTA service="renovation-cuisine" className="px-10 py-5 text-lg" testId="button-bottom-cta">Demander une soumission</PubCTA></div>
      </section>
    </PubLayout>
  );
}