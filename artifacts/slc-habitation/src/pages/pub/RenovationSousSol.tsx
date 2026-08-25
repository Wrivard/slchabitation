import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { PubPageNav, PubSectionHeader } from '@/components/pub/PubShared';
import { FAQ } from '@/components/pub/FAQ';
import {
  Bath, Bed, CheckCircle2, ClipboardCheck, Droplets, Hammer,
  Home, Lightbulb, MapPin, PanelTop, Ruler, ShieldCheck, Volume2, ArrowRight, ArrowDown
} from 'lucide-react';

const navigation = [
  { href: '#possibilites', label: 'Possibilités' },
  { href: '#diagnostic', label: 'Diagnostic' },
  { href: '#demarche', label: 'Démarche' },
  { href: '#inspirations', label: 'Réalisations' },
  { href: '#faq', label: 'FAQ' },
];

const possibilities = [
  {
    icon: Home,
    title: 'Salle familiale ou aire polyvalente',
    text: "Un espace ouvert peut accueillir un coin lecture, une zone de jeux, un téléviseur ou des rangements. La circulation, les prises, l'éclairage et les accès sont considérés selon les habitudes du foyer.",
  },
  {
    icon: Bed,
    title: 'Chambre ou bureau à domicile',
    text: "Lorsqu'une pièce fermée est envisagée, nous examinons notamment la lumière, la fenêtre, la sortie et la configuration existante. Ces éléments orientent la possibilité d'aménager une chambre ou un bureau.",
  },
  {
    icon: Bath,
    title: 'Salle de bain ou salle d’eau',
    text: "Une salle de bain au sous-sol demande une lecture attentive des conduites, du renvoi, de la dalle et de la ventilation. L'emplacement souhaité est évalué avant de définir les interventions.",
  },
];

const diagnosticPoints = [
  ['Humidité et fondation', "Signes d'humidité, état apparent des murs de fondation et conditions à corriger avant de fermer les assemblages."],
  ['Hauteur et mécanique', 'Poutres, conduits, plomberie et câblage qui influencent la hauteur libre et le tracé des plafonds.'],
  ['Dalle et plomberie', 'Emplacement des drains, du renvoi principal et des appareils projetés lorsque la plomberie fait partie du scénario.'],
  ['Ouvertures et sécurité', "Fenêtres, accès et usage prévu de chaque pièce, notamment lorsqu'une chambre est envisagée."],
  ['Électricité et chauffage', "Panneau, circuits existants, zones d'éclairage et besoins de chauffage à considérer dans la planification."],
  ['Structure et accès', "Murs, poutres, escaliers et parcours des matériaux qui peuvent influencer l'ordre des travaux."],
];

const technicalChapters = [
  {
    number: 'A',
    title: 'Humidité, fondation et air intérieur',
    icon: Droplets,
    paragraphs: [
      "Un sous-sol est en contact direct avec le sol et réagit aux saisons, à la ventilation de la maison et aux conditions autour de la fondation. Avant de choisir un mur décoratif ou un plancher, il est utile d’observer les indices simples : marque d’eau, peinture qui s’écaille, odeur persistante, condensation sur une surface froide ou dépôt blanchâtre sur le béton. Ces signes ne désignent pas automatiquement une même cause, mais ils méritent d’être signalés.",
      "L’évaluation porte sur ce qui est visible et sur l’usage prévu de la pièce. Une zone de rangement, une salle familiale et une chambre n’ont pas la même tolérance aux variations de confort. Selon les observations, la discussion peut toucher l’étanchéité, le drainage extérieur, la ventilation, les matériaux déjà en place ou la séquence des travaux.",
    ],
    note: "Indiquez si le phénomène suit la pluie, le dégel ou une saison précise.",
  },
  {
    number: 'B',
    title: 'Dalle de béton, drains et plomberie',
    icon: Ruler,
    paragraphs: [
      "La dalle est le point de départ de plusieurs décisions : niveau du futur plancher, emplacement d’une cloison, passage de plomberie et possibilité d’ajouter une salle de bain. Les drains, le renvoi principal et les raccordements existants ne sont pas toujours visibles de la même façon d’une maison à l’autre. Leur position peut influencer l’endroit le plus logique pour une douche, une toilette, une buanderie ou un lavabo.",
      "Lorsqu’un nouvel appareil est envisagé, l’analyse du tracé souhaité permet de distinguer les options à examiner avant de définir le plan final. Une intervention dans la dalle, si elle s’avère pertinente, demande une coordination avec le revêtement, la hauteur disponible, l’accès aux équipements et la finition des murs.",
    ],
    note: "Notez l’emplacement connu du renvoi, de la pompe ou des appareils actuels.",
  },
  {
    number: 'C',
    title: 'Isolation, confort thermique et acoustique',
    icon: Volume2,
    paragraphs: [
      "L’isolation d’un sous-sol ne se résume pas à remplir une cavité. La composition des murs, les conditions d’humidité observées, la fondation et la façon dont la pièce sera chauffée sont considérées ensemble. Selon le bâtiment, le choix des matériaux et l’ordre d’installation peuvent varier. Un espace destiné aux jeux, au télétravail ou au sommeil gagne à être réfléchi à partir du confort attendu, plutôt qu’à partir d’une solution identique partout.",
      "L’acoustique est aussi liée à l’usage. Pour atténuer les sons entre le rez-de-chaussée et le sous-sol, on peut examiner le plafond existant, les ouvertures, les conduits et les passages autour des fils ou des tuyaux. La laine isolante, la désolidarisation et certaines couches de finition sont des pistes possibles selon la structure.",
    ],
    note: "Précisez les bruits les plus dérangeants et les moments où ils surviennent.",
  },
  {
    number: 'D',
    title: 'Plafond, poutres et mécanique du bâtiment',
    icon: PanelTop,
    paragraphs: [
      "Les plafonds de sous-sol révèlent souvent la mécanique de la maison : conduits de ventilation, plomberie, fils, retours de poutres et accès à certains appareils. Avant de choisir entre un plafond continu, une retombée ou une solution qui conserve des accès, il faut lire ces éléments dans leur ensemble. La hauteur libre ne se mesure pas seulement au centre de la pièce; les parcours vers l’escalier, les portes et les zones utilisées comptent aussi.",
      "Une configuration peut parfois transformer une contrainte en repère visuel. Une retombée peut séparer un coin télé d’un espace de jeu ou accompagner un corridor. Certaines zones doivent rester accessibles pour l’entretien. Le plan peut donc prévoir des panneaux ou des portes discrètes.",
    ],
    note: "Laissez les conduits et accès techniques visibles pour la visite.",
  },
  {
    number: 'E',
    title: 'Fenêtres, lumière et projet de chambre',
    icon: Bed,
    paragraphs: [
      "Les fenêtres de sous-sol apportent une lumière précieuse, mais leur format et leur position orientent aussi la disposition des pièces. Un coin bureau peut profiter d’une ouverture existante; une salle familiale peut être organisée pour ne pas bloquer la lumière; une pièce fermée demande de réfléchir à son accès, à sa luminosité et à sa relation avec le reste du niveau. Les margelles, les finis autour des fenêtres et l’état apparent des ouvertures font partie des éléments à regarder.",
      "Si une chambre est souhaitée, il est préférable de le dire dès le départ. Les exigences applicables à une pièce utilisée pour dormir, les possibilités de sortie, la fenêtre, la hauteur et la configuration doivent être examinées pour le cas précis. L’agrandissement d’une ouverture peut toucher la fondation et la finition extérieure; ce n’est pas une décision de décoration. Une discussion précoce aide à distinguer une intention intéressante des interventions qu’elle pourrait demander.",
    ],
    note: "Mentionnez les pièces fermées envisagées et le rôle de chacune.",
  },
  {
    number: 'F',
    title: 'Électricité, éclairage, chauffage et ventilation',
    icon: Lightbulb,
    paragraphs: [
      "Un sous-sol transformé en espace de vie peut demander une nouvelle façon de répartir l’éclairage. Les petites fenêtres et les plafonds plus bas rendent les zones lumineuses particulièrement importantes : circulation, poste de travail, coin lecture, salle de bain, escalier et rangements. La discussion peut porter sur les circuits, les interrupteurs, les prises et la position des luminaires, en tenant compte du plan d’ameublement envisagé plutôt que d’une pièce vide.",
      "Le chauffage et la ventilation sont tout aussi liés à l’usage. Un bureau occupé plusieurs heures, une salle familiale fréquentée le soir ou une salle de bain peuvent soulever des besoins différents. Le panneau électrique, les sources de chauffage existantes, les conduits et les appareils en place sont des points à évaluer. Cette lecture aide à prévoir les interventions à discuter avant que les murs et plafonds ne soient refermés.",
    ],
    note: "Listez les appareils importants, postes de travail et zones à éclairer.",
  },
  {
    number: 'G',
    title: 'Plancher, usages évolutifs et entretien courant',
    icon: Home,
    paragraphs: [
      "Le revêtement de sol se choisit avec la dalle, les conditions d’humidité, le niveau souhaité et la fonction de la pièce. Une aire de jeux, un bureau, une salle familiale ou une salle de bain n’imposent pas les mêmes priorités. Le toucher, le bruit, la facilité de nettoyage et la transition vers l’escalier ou une autre pièce peuvent orienter la sélection. Un matériau peut être discuté après avoir compris ce qui se trouve sous la surface.",
      "Penser à un usage évolutif peut rendre l’aménagement plus durable dans le quotidien. Une grande salle peut d’abord servir aux enfants, puis devenir un coin détente ou un espace de travail; des prises bien placées, des rangements et des cloisons choisies avec soin laissent davantage de possibilités. Après les travaux, il reste pertinent d’observer les joints, les zones près des fenêtres, le fonctionnement des appareils et tout changement d’odeur ou d’humidité afin de réagir à ce qui est observé.",
    ],
    note: "Apportez les mesures des meubles importants et l’usage futur envisagé.",
  },
];

const steps = [
  {
    number: '01',
    title: 'Écouter le projet et observer le lieu',
    text: "La première discussion sert à comprendre l'usage recherché : pièce pour la famille, bureau, chambre, salle de bain, rangement ou combinaison de fonctions. Sur place, les dimensions, les ouvertures, la mécanique visible et l'état général donnent un cadre plus concret à la réflexion.",
  },
  {
    number: '02',
    title: 'Définir une configuration cohérente',
    text: "À partir des contraintes observées, les zones sont placées de façon à préserver la circulation et à composer avec les éléments techniques. Une salle de bain, une cloison, un plafond ou une ouverture peuvent modifier l'organisation. Les choix sont donc discutés avant que les détails de finition prennent toute la place.",
  },
  {
    number: '03',
    title: 'Prévoir les interventions techniques',
    text: "Avant les surfaces visibles viennent les travaux qui se trouvent derrière les murs : isolation, plomberie, électricité, chauffage, ventilation ou ajustements requis par la configuration. Leur portée dépend du bâtiment et du résultat visé. C'est aussi le moment de clarifier les permis ou validations pouvant être applicables.",
  },
  {
    number: '04',
    title: 'Passer aux finitions choisies',
    text: "Revêtement de sol, murs, portes, éclairage, menuiserie et accessoires sont coordonnés avec l'usage de la pièce. L'objectif n'est pas de suivre une formule unique : une salle familiale, une pièce de travail et une salle de bain ne sollicitent pas les mêmes matériaux ni les mêmes détails.",
  },
];

const gallery = [
  {
    src: '/images/relume-657406.jpeg',
    alt: 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses',
    width: 2048,
    height: 1536,
    caption: 'Aire de vie et cuisine au sous-sol',
  },
  {
    src: '/images/INT%C3%89RIEUR/randoms/20240926_155408.jpg',
    alt: 'Sous-sol dégagé avant un projet de réaménagement avec petites fenêtres et plafond suspendu',
    width: 4000,
    height: 3000,
    caption: 'Point de départ : volume et éléments existants',
  },
  {
    src: '/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg',
    alt: 'Espace de sous-sol aménagé avec plancher de bois clair, fenêtres basses et murs beiges',
    width: 4000,
    height: 3000,
    caption: 'Pièce de vie lumineuse au niveau inférieur',
  },
  {
    src: '/images/INT%C3%89RIEUR/randoms/20241018_161142.jpg',
    alt: 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond',
    width: 4000,
    height: 3000,
    caption: 'Configuration ouverte avec accès fermé',
  },
  {
    src: '/images/relume-655394.jpeg',
    alt: 'Douche vitrée et fenêtre basse dans une salle de bain aménagée au sous-sol',
    width: 1536,
    height: 2048,
    caption: 'Salle de bain : détail de douche et ventilation',
  },
];

const faqs = [
  {
    question: "Faut-il examiner l'humidité avant de finir un sous-sol ?",
    answer: "Oui. Des signes d'infiltration, de condensation, d'odeur persistante ou de matériau endommagé méritent d'être examinés avant de recouvrir les murs. Selon ce qui est observé, des correctifs peuvent devoir être considérés avant l'isolation et les finitions.",
  },
  {
    question: "Peut-on créer une chambre au sous-sol ?",
    answer: "Cela dépend notamment de la fenêtre, de l'issue, de la hauteur, de la configuration et des exigences applicables au projet. Une visite permet d'examiner l'espace et de déterminer les options à approfondir.",
  },
  {
    question: "Une salle de bain peut-elle être ajoutée si rien n’est prévu ?",
    answer: "C'est une possibilité qui doit être évaluée selon la plomberie existante, le renvoi principal, la dalle et l'emplacement proposé. La portée des travaux varie donc d'une résidence à l'autre.",
  },
  {
    question: "Quel revêtement de sol considérer au sous-sol ?",
    answer: "Le choix se fait en fonction de l'usage de la pièce, de l'état de la dalle, des conditions d'humidité et du style recherché. Le vinyle, la céramique et d'autres matériaux peuvent être discutés au cas par cas.",
  },
  {
    question: "Comment conserver une bonne hauteur libre ?",
    answer: "Les conduits, poutres, fils et tuyaux sont relevés au départ. Leur position peut guider le tracé d'un plafond, l'emplacement des zones de circulation ou la disposition des pièces. Il est préférable d'en parler avant de figer le plan.",
  },
  {
    question: "L’insonorisation du plafond est-elle envisageable ?",
    answer: "L'approche dépend du bruit à atténuer et de la composition actuelle du plafond. Laine isolante, désolidarisation et couches de finition peuvent être envisagées selon la structure et l'objectif du projet.",
  },
  {
    question: "Faut-il un permis pour rénover un sous-sol ?",
    answer: "Les exigences peuvent varier selon la municipalité et la nature des travaux, en particulier pour la plomberie, la structure, les fenêtres ou un changement d'usage. Les démarches applicables sont à valider pour le projet concerné.",
  },
  {
    question: "Peut-on agrandir une fenêtre de sous-sol ?",
    answer: "Cette intervention touche potentiellement la fondation, l'étanchéité et la finition extérieure. Elle doit être analysée selon la structure existante, l'ouverture envisagée et les exigences qui s'appliquent.",
  },
  {
    question: "Que faut-il prévoir pour un bureau au sous-sol ?",
    answer: "Au-delà du mobilier, il est utile de prévoir les prises, l'éclairage de travail, le réseau, le chauffage et le rangement. La position du bureau peut aussi être choisie en tenant compte de la lumière disponible et du bruit dans la maison.",
  },
];

export default function RenovationSousSolPub() {
  return (
    <PubLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground min-h-[85vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src={gallery[0].src}
            alt={gallery[0].alt}
            width={gallery[0].width}
            height={gallery[0].height}
            loading="eager"
            className="h-full w-full object-cover object-[center_60%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/60 to-transparent" />
        </div>
        <div className="container-large relative mx-auto max-w-7xl px-6 pb-20 pt-32 fade-up">
          <div className="max-w-4xl">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-medium tracking-wide sm:text-sm text-white">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><ShieldCheck className="h-4 w-4 text-primary" />Licence RBQ : 8351-9033-59</span>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><Hammer className="h-4 w-4 text-primary" />18 ans d'expérience</span>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><MapPin className="h-4 w-4 text-primary" />Laval et Laurentides</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Aménagement intérieur résidentiel</p>
            <h1 className="mb-6 max-w-4xl font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">Rénovation de sous-sol <br />à Laval et dans les Laurentides</h1>
            <p className="mb-10 max-w-3xl text-lg leading-relaxed text-gray-200 md:text-xl">Un sous-sol peut devenir une véritable extension de la maison lorsqu’il est pensé à partir de sa structure, de ses ouvertures et de votre quotidien. SLC Habitation vous accompagne pour clarifier les possibilités de votre espace avant d’en planifier l’aménagement.</p>
            <PubCTA service="renovation-sous-sol" className="px-8 py-5 text-lg rounded-none" testId="button-hero-cta">Parler de votre projet</PubCTA>
          </div>
        </div>
      </section>

      <PubPageNav items={navigation} />

      {/* POSSIBILITÉS */}
      <section id="possibilites" className="scroll-mt-20 bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-end mb-20">
            <div className="lg:col-span-7">
              <PubSectionHeader
                kicker="Un niveau à réinventer"
                title="Partir de l’espace réel, puis imaginer la vie qui s’y passe"
              />
              <p className="text-lg leading-relaxed text-muted-foreground">Le sous-sol abrite souvent des conduits, une poutre, un panneau, une salle mécanique ou des fenêtres plus basses. Une rénovation réfléchie les intègre au plan pour guider la place des pièces, la lumière et les détails à prioriser.</p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-none border border-primary/20 bg-primary/5 p-8">
                <h3 className="mb-3 font-bold text-xl flex items-center gap-2">
                  <Lightbulb className="text-primary w-5 h-5" /> À clarifier avant le plan
                </h3>
                <p className="leading-relaxed text-muted-foreground">Notez les usages à réunir, les pièces à fermer et les équipements qui doivent rester accessibles. Cette liste rend la première discussion plus précise.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-16 border-t border-border pt-16">
            {possibilities.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group">
                <div className="mb-6 h-14 w-14 rounded-none bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-foreground">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 grid lg:grid-cols-2 gap-12">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1 lg:content-center rounded-none bg-muted/40 p-10 text-foreground">
              <div>
                <h3 className="mb-4 text-2xl font-bold">Un lieu pour le quotidien</h3>
                <p className="leading-relaxed text-muted-foreground">Une salle familiale peut réunir un espace calme, un coin jeux et une surface pour un écran ou une bibliothèque. Des rangements fermés et des passages bien définis simplifient aussi l’usage lorsque le sous-sol accueille plusieurs fonctions.</p>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold">Un projet qui respecte la maison</h3>
                <p className="leading-relaxed text-muted-foreground">Une retombée de plafond peut marquer une transition; une poutre peut cadrer un coin bureau; une fenêtre peut guider la place d’un espace de détente. Les solutions se précisent après l’évaluation des conditions propres à la résidence.</p>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-none overflow-hidden shadow-2xl shadow-black/5">
               <img src={gallery[2].src} alt={gallery[2].alt} width={gallery[2].width} height={gallery[2].height} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC */}
      <section id="diagnostic" className="scroll-mt-20 border-y border-border bg-muted/30 py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-16"
            kicker="Avant de refermer les murs"
            title="Le diagnostic donne une direction au projet"
            description="Au sous-sol, les conditions existantes peuvent influencer les matériaux, la disposition et les travaux à prévoir. Une analyse initiale aide à poser les bonnes questions avant de retenir un scénario."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {diagnosticPoints.map(([title, text]) => (
              <div key={title} className="group border-t border-border pt-6">
                <div className="mb-4 h-px w-12 bg-primary transition-all duration-300 group-hover:w-full" />
                <h3 className="mb-3 text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <figure className="mt-20 overflow-hidden rounded-none">
            <img src={gallery[1].src} alt={gallery[1].alt} width={gallery[1].width} height={gallery[1].height} loading="lazy" className="h-[360px] w-full object-cover" />
            <figcaption className="mt-4 text-sm text-muted-foreground">{gallery[1].caption}</figcaption>
          </figure>

          <div className="mt-20 flex flex-col md:flex-row items-center md:items-start gap-8 rounded-none bg-secondary p-10 text-white shadow-2xl shadow-black/5">
            <Droplets className="h-12 w-12 shrink-0 text-primary" />
            <div>
              <h3 className="mb-3 text-xl font-bold">Repère pratique : l’humidité ne se masque pas</h3>
              <p className="text-lg leading-relaxed text-gray-300">Signalez toute trace d’eau, efflorescence, odeur de moisi, condensation ou dégradation avant de choisir les finis. Selon la cause, l’ordre des interventions peut changer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REPÈRES TECHNIQUES */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-24"
            kicker="Repères techniques pour mieux planifier"
            title="Les sujets qui transforment une idée en projet réfléchi"
            description="Chaque chapitre ci-dessous sert à préparer une conversation concrète. Il ne remplace pas l’évaluation de votre résidence : les conditions observées, les équipements existants et l’usage recherché permettent de déterminer quelles pistes méritent d’être approfondies."
          />

          <div className="space-y-24">
            {technicalChapters.map(({ number, title, icon: Icon, paragraphs, note }) => (
              <article key={number} className="grid lg:grid-cols-12 gap-10 items-start group">
                <div className="lg:col-span-1 text-center hidden lg:block">
                  <div className="text-5xl font-black text-primary/10 tracking-tighter mb-2">{number}</div>
                </div>
                <div className="lg:col-span-11 lg:pl-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon className="w-8 h-8 text-primary stroke-[1.5]" />
                    <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8 text-lg leading-relaxed text-muted-foreground mb-8">
                    {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  <div className="border-l-2 border-primary pl-6 py-2">
                    <strong className="block text-foreground text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" /> Pour la visite
                    </strong>
                    <p className="text-muted-foreground text-sm leading-relaxed">{note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DÉMARCHE */}
      <section id="demarche" className="scroll-mt-20 border-y border-border bg-muted/40 py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
              <PubSectionHeader
                kicker="Une démarche lisible"
                title="Décider dans le bon ordre"
              />
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">Une approche par étapes aide à distinguer ce qui relève du bâtiment, de l’usage et de l’esthétique. Vous gardez une vue d’ensemble avant de discuter des choix qui influencent l’espace.</p>
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                <ArrowDown className="h-5 w-5 text-primary" />Du constat initial aux finitions
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-12">
                {steps.map((step) => (
                  <div key={step.number} className="grid md:grid-cols-[80px_1fr] gap-6 group">
                    <div className="text-5xl font-black text-primary/20 tracking-tighter group-hover:text-primary transition-colors duration-300">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
                      <p className="leading-relaxed text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 rounded-none bg-background border border-border p-10 md:flex md:items-center md:justify-between md:gap-10 shadow-xl shadow-black/5">
                <div>
                  <h3 className="mb-3 text-2xl font-bold">Votre projet commence par les bonnes questions</h3>
                  <p className="max-w-xl leading-relaxed text-muted-foreground">Partagez l’usage envisagé et les éléments qui vous préoccupent. Une évaluation permet de discuter de la faisabilité selon votre sous-sol.</p>
                </div>
                <PubCTA service="renovation-sous-sol" className="mt-8 shrink-0 px-8 py-4 rounded-none md:mt-0" testId="button-middle-cta">Discuter de mon sous-sol</PubCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="bg-secondary py-24 text-secondary-foreground md:py-32">
        <div className="container-large mx-auto max-w-5xl px-6 text-center">
          <Volume2 className="mx-auto mb-8 h-10 w-10 text-primary" />
          <blockquote className="font-heading text-3xl md:text-4xl font-medium leading-tight text-white mb-10">
            « Magnifique travail de l'équipe SLC Habitation. Nous avions un projet complexe avec plusieurs défis! Ils ont fait un travail exceptionnel. Un gros merci pour votre professionnalisme! Je recommande sans hésiter. »
          </blockquote>
          <div className="font-bold text-lg text-white">Johanne Duguay</div>
          <div className="mt-1 text-gray-400">Propriétaire</div>
        </div>
      </section>

      {/* INSPIRATIONS (Galerie Editoriale) */}
      <section id="inspirations" className="scroll-mt-20 bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-16"
            kicker="Espaces de vie au niveau inférieur"
            title="Des réalisations qui montrent les possibilités"
            description="Ces photos illustrent un volume dégagé, une aire de vie, une pièce polyvalente et une salle de bain. Les dimensions, ouvertures et installations de votre résidence guideront les choix pertinents pour votre projet."
          />

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {gallery.map((image) => (
              <figure key={image.src} className="break-inside-avoid relative group overflow-hidden rounded-none bg-muted">
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <figcaption className="text-sm font-medium text-white">{image.caption}</figcaption>
                </div>
              </figure>
            ))}
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-12 border-t border-border pt-16">
            <div>
              <PanelTop className="mb-4 h-8 w-8 text-primary stroke-[1.5]" />
              <h3 className="mb-3 text-xl font-bold">Plafonds et détails techniques</h3>
              <p className="leading-relaxed text-muted-foreground">Un plafond continu ou des zones abaissées peuvent être envisagés selon les conduits et la hauteur disponible.</p>
            </div>
            <div>
              <Ruler className="mb-4 h-8 w-8 text-primary stroke-[1.5]" />
              <h3 className="mb-3 text-xl font-bold">Circulation et rangement</h3>
              <p className="leading-relaxed text-muted-foreground">Le passage vers l’escalier, la salle mécanique ou les fenêtres conserve son importance dans un plan confortable.</p>
            </div>
            <div>
              <CheckCircle2 className="mb-4 h-8 w-8 text-primary stroke-[1.5]" />
              <h3 className="mb-3 text-xl font-bold">Choix adaptés à l’usage</h3>
              <p className="leading-relaxed text-muted-foreground">L’éclairage, les revêtements et l’acoustique se sélectionnent plus facilement lorsque la fonction de chaque zone est claire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-y border-border bg-muted/30 py-24 md:py-32">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="text-center mx-auto mb-16 max-w-3xl"
            kicker="Préparer votre réflexion"
            title="Questions fréquentes sur la rénovation de sous-sol"
            description="Ces repères amorcent la conversation; une réponse adaptée dépend de votre résidence et du projet envisagé."
          />
          <div className="space-y-2 border-t border-border pt-8">
            {faqs.map((faq) => <FAQ key={faq.question} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-large mx-auto max-w-4xl px-6 text-center flex flex-col items-center">
          <PubSectionHeader
            className="text-center"
            kicker="Parlons de votre espace"
            title="Donnez une nouvelle place à votre sous-sol"
            description="Décrivez-nous votre idée et votre espace actuel. Nous pourrons échanger sur les éléments à évaluer pour votre projet à Laval ou dans les Laurentides."
          />
          <PubCTA service="renovation-sous-sol" className="px-10 py-5 text-lg rounded-none" testId="button-bottom-cta">Présenter mon projet</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
