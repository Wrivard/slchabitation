import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { PubPageNav, PubSectionHeader } from '@/components/pub/PubShared';
import { FAQ } from '@/components/pub/FAQ';
import {
  Bath, Bed, CheckCircle2, Droplets, Hammer,
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
    text: "Coin lecture, jeux, téléviseur ou rangement : le plan relie les usages à la circulation, aux prises, à l’éclairage et aux accès.",
  },
  {
    icon: Bed,
    title: 'Chambre ou bureau à domicile',
    text: "Pour une pièce fermée, la lumière, la fenêtre, la sortie et la configuration existante orientent les possibilités.",
  },
  {
    icon: Bath,
    title: 'Salle de bain ou salle d’eau',
    text: "Conduites, renvoi, dalle et ventilation sont évalués avant de définir l’emplacement et les interventions.",
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
    points: [
      "À signaler : marque d’eau, peinture écaillée, odeur persistante, condensation ou dépôt blanchâtre.",
      "Ces signes peuvent avoir des causes différentes. L’évaluation tient compte de ce qui est visible, des saisons et de l’usage prévu.",
      "Selon les observations : étanchéité, drainage extérieur, ventilation, matériaux existants ou ordre des travaux peuvent être discutés.",
    ],
    note: "Indiquez si le phénomène suit la pluie, le dégel ou une saison précise.",
  },
  {
    number: 'B',
    title: 'Dalle de béton, drains et plomberie',
    icon: Ruler,
    points: [
      "La dalle influence le niveau du plancher, les cloisons, le passage de plomberie et l’ajout possible d’une salle de bain.",
      "La position des drains, du renvoi et des raccordements guide celle d’une douche, toilette, buanderie ou lavabo.",
      "Toute intervention jugée pertinente dans la dalle se coordonne avec le revêtement, la hauteur, les accès et les murs.",
    ],
    note: "Notez l’emplacement connu du renvoi, de la pompe ou des appareils actuels.",
  },
  {
    number: 'C',
    title: 'Isolation, confort thermique et acoustique',
    icon: Volume2,
    points: [
      "Isolation : murs, humidité, fondation et mode de chauffage se lisent ensemble. Les matériaux et leur ordre peuvent varier.",
      "Confort : jeux, télétravail et sommeil n’imposent pas les mêmes attentes.",
      "Acoustique : plafond, ouvertures, conduits et passages techniques sont examinés.",
      "Selon la structure, laine isolante, désolidarisation ou couches de finition peuvent être envisagées.",
    ],
    note: "Précisez les bruits les plus dérangeants et les moments où ils surviennent.",
  },
  {
    number: 'D',
    title: 'Plafond, poutres et mécanique du bâtiment',
    icon: PanelTop,
    points: [
      "À relever : conduits, plomberie, fils, poutres et accès aux appareils.",
      "La hauteur libre compte aussi dans les parcours vers l’escalier, les portes et les zones utilisées.",
      "Plafond continu, retombée ou accès conservé : la solution dépend de l’ensemble mécanique.",
      "Une retombée peut structurer les zones. Des panneaux ou portes maintiennent les accès d’entretien nécessaires.",
    ],
    note: "Laissez les conduits et accès techniques visibles pour la visite.",
  },
  {
    number: 'E',
    title: 'Fenêtres, lumière et projet de chambre',
    icon: Bed,
    points: [
      "Format et position des fenêtres orientent le bureau, la salle familiale et toute pièce fermée.",
      "Margelles, finis et état apparent des ouvertures font partie de l’examen.",
      "Pour une chambre, exigences applicables, sortie, fenêtre, hauteur et configuration sont vérifiées au cas par cas.",
      "Agrandir une ouverture peut toucher la fondation et le fini extérieur : ce n’est pas un simple choix décoratif.",
    ],
    note: "Mentionnez les pièces fermées envisagées et le rôle de chacune.",
  },
  {
    number: 'F',
    title: 'Électricité, éclairage, chauffage et ventilation',
    icon: Lightbulb,
    points: [
      "L’éclairage se planifie par zone : circulation, travail, lecture, salle de bain, escalier et rangement.",
      "Circuits, interrupteurs, prises et luminaires tiennent compte du futur ameublement.",
      "Bureau, salle familiale et salle de bain peuvent avoir des besoins distincts de chauffage et de ventilation.",
      "Panneau, chauffage, conduits et appareils sont évalués avant de refermer murs et plafonds.",
    ],
    note: "Listez les appareils importants, postes de travail et zones à éclairer.",
  },
  {
    number: 'G',
    title: 'Plancher, usages évolutifs et entretien courant',
    icon: Home,
    points: [
      "Le sol se choisit selon la dalle, l’humidité, le niveau visé et l’usage — après avoir compris le support.",
      "Toucher, bruit, entretien et transitions orientent aussi le matériau.",
      "Prises, rangements et cloisons bien placés facilitent l’évolution d’une salle de jeux vers la détente ou le travail.",
      "Après les travaux, surveillez joints, fenêtres, appareils et tout changement d’odeur ou d’humidité.",
    ],
    note: "Apportez les mesures des meubles importants et l’usage futur envisagé.",
  },
];

const steps = [
  {
    number: '01',
    title: 'Écouter le projet et observer le lieu',
    text: "Nous précisons les usages. Sur place, dimensions, ouvertures, mécanique visible et état général cadrent la réflexion.",
  },
  {
    number: '02',
    title: 'Définir une configuration cohérente',
    text: "Les zones composent avec la circulation et la technique. Salle de bain, cloison, plafond et ouverture sont discutés avant les finis.",
  },
  {
    number: '03',
    title: 'Prévoir les interventions techniques',
    text: "Isolation, plomberie, électricité, chauffage et ventilation précèdent les surfaces. Leur portée, les permis et les validations dépendent du projet.",
  },
  {
    number: '04',
    title: 'Passer aux finitions choisies',
    text: "Sol, murs, portes, éclairage, menuiserie et accessoires s’accordent à l’usage. Chaque type de pièce appelle ses propres détails.",
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
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground min-h-[72vh] flex flex-col justify-end">
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
        <div className="container-large relative mx-auto max-w-7xl px-6 pb-16 pt-24 fade-up">
          <div className="max-w-4xl">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-medium tracking-wide sm:text-sm text-white">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><ShieldCheck className="h-4 w-4 text-primary" />Licence RBQ : 8351-9033-59</span>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><Hammer className="h-4 w-4 text-primary" />18 ans d'expérience</span>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><MapPin className="h-4 w-4 text-primary" />Laval et Laurentides</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Aménagement intérieur résidentiel</p>
            <h1 className="mb-6 max-w-4xl font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">Rénovation de sous-sol <br />à Laval et dans les Laurentides</h1>
            <p className="mb-8 max-w-3xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Transformez le sous-sol à partir de sa structure, de ses ouvertures et de votre quotidien. SLC Habitation vous aide à clarifier les possibilités avant de planifier.</p>
            <PubCTA service="renovation-sous-sol" className="px-8 py-5 text-lg rounded-none" testId="button-hero-cta">Parler de votre projet</PubCTA>
          </div>
        </div>
      </section>

      <PubPageNav items={navigation} />

      {/* POSSIBILITÉS */}
      <section id="possibilites" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end mb-12">
            <div className="lg:col-span-7">
              <PubSectionHeader
                kicker="Un niveau à réinventer"
                title="Partir de l’espace réel, puis imaginer la vie qui s’y passe"
              />
              <p className="text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground">Conduits, poutres, panneau, salle mécanique et fenêtres basses guident la place des pièces, la lumière et les priorités.</p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-none border border-primary/20 bg-primary/5 p-8">
                <h3 className="mb-3 font-bold text-xl flex items-center gap-2">
                  <Lightbulb className="text-primary w-5 h-5" /> À clarifier avant le plan
                </h3>
                <p className="leading-relaxed text-muted-foreground">Notez trois choses : usages à réunir, pièces à fermer et équipements à garder accessibles.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-border pt-12">
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

          <div className="mt-16 grid lg:grid-cols-2 gap-12">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1 lg:content-center rounded-none bg-muted/40 p-10 text-foreground">
              <div>
                <h3 className="mb-4 text-2xl font-bold">Un lieu pour le quotidien</h3>
                <p className="leading-relaxed text-muted-foreground">Espace calme, jeux, écran ou bibliothèque peuvent cohabiter. Rangements fermés et passages clairs simplifient les usages multiples.</p>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold">Un projet qui respecte la maison</h3>
                <p className="leading-relaxed text-muted-foreground">Retombée, poutre ou fenêtre peuvent structurer les zones. Les solutions se précisent après l’évaluation de la résidence.</p>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-none overflow-hidden shadow-2xl shadow-black/5">
               <img src={gallery[2].src} alt={gallery[2].alt} width={gallery[2].width} height={gallery[2].height} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC */}
      <section id="diagnostic" className="scroll-mt-20 border-y border-border bg-muted/30 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-16"
            kicker="Avant de refermer les murs"
            title="Le diagnostic donne une direction au projet"
             description="Les conditions existantes orientent les matériaux, la disposition et les travaux. L’analyse initiale aide à choisir un scénario."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {diagnosticPoints.map(([title, text]) => (
              <div key={title} className="group border-t border-border pt-6">
                <div className="mb-4 h-px w-12 bg-primary transition-all duration-300 group-hover:w-full" />
                <h3 className="mb-3 text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <figure className="mt-14 overflow-hidden rounded-none">
            <img src={gallery[1].src} alt={gallery[1].alt} width={gallery[1].width} height={gallery[1].height} loading="lazy" className="h-[360px] w-full object-cover" />
            <figcaption className="mt-4 text-sm text-muted-foreground">{gallery[1].caption}</figcaption>
          </figure>

          <div className="mt-14 flex flex-col md:flex-row items-center md:items-start gap-8 rounded-none bg-secondary p-10 text-white shadow-2xl shadow-black/5">
            <Droplets className="h-12 w-12 shrink-0 text-primary" />
            <div>
              <h3 className="mb-3 text-xl font-bold">Repère pratique : l’humidité ne se masque pas</h3>
              <p className="text-base leading-relaxed md:text-[1.0625rem] text-gray-300">Avant les finis, signalez eau, efflorescence, odeur, condensation ou dégradation. La cause peut changer l’ordre des travaux.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REPÈRES TECHNIQUES */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-14"
            kicker="Repères techniques pour mieux planifier"
            title="Les sujets qui transforment une idée en projet réfléchi"
            description="Sept repères pour préparer la visite — sans remplacer l’évaluation de votre résidence."
          />

          <div className="space-y-12 md:space-y-14">
            {technicalChapters.map(({ number, title, icon: Icon, points, note }) => (
              <article key={number} className="grid gap-6 border-t border-border pt-10 lg:grid-cols-12 lg:gap-10 lg:pt-12 group">
                <div className="lg:col-span-1 text-center hidden lg:block">
                  <div className="text-5xl font-black text-primary/10 tracking-tighter mb-2">{number}</div>
                </div>
                <div className="lg:col-span-11 lg:pl-4">
                  <div className="flex items-start gap-4 mb-7">
                    <Icon className="mt-1 w-7 h-7 shrink-0 text-primary stroke-[1.5]" />
                    <div>
                      <span className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-primary lg:hidden">Chapitre {number}</span>
                      <h3 className="text-2xl font-bold leading-tight text-foreground">{title}</h3>
                    </div>
                  </div>
                  <ul className="mb-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
                    {points.map((point) => (
                      <li key={point} className="flex gap-3 border-t border-border/70 pt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
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
      <section id="demarche" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
              <PubSectionHeader
                kicker="Une démarche lisible"
                title="Décider dans le bon ordre"
              />
               <p className="text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground mb-8">Les étapes séparent bâtiment, usage et esthétique. Vous gardez la vue d’ensemble avant de choisir.</p>
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

              <div className="mt-14 rounded-none bg-background border border-border p-10 md:flex md:items-center md:justify-between md:gap-10 shadow-xl shadow-black/5">
                <div>
                  <h3 className="mb-3 text-2xl font-bold">Votre projet commence par les bonnes questions</h3>
                   <p className="max-w-xl leading-relaxed text-muted-foreground">Partagez l’usage visé et vos préoccupations. L’évaluation permet de discuter des possibilités propres au sous-sol.</p>
                </div>
                <PubCTA service="renovation-sous-sol" className="mt-8 shrink-0 px-8 py-4 rounded-none md:mt-0" testId="button-middle-cta">Discuter de mon sous-sol</PubCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="bg-secondary py-16 text-secondary-foreground md:py-20">
        <div className="container-large mx-auto max-w-5xl px-6 text-center">
          <Volume2 className="mx-auto mb-8 h-10 w-10 text-primary" />
          <blockquote className="font-heading text-3xl md:text-4xl font-medium leading-tight text-white mb-8">
            « Magnifique travail de l'équipe SLC Habitation. Nous avions un projet complexe avec plusieurs défis! Ils ont fait un travail exceptionnel. Un gros merci pour votre professionnalisme! Je recommande sans hésiter. »
          </blockquote>
          <div className="font-bold text-lg text-white">Johanne Duguay</div>
          <div className="mt-1 text-gray-400">Propriétaire</div>
        </div>
      </section>

      {/* INSPIRATIONS (Galerie Editoriale) */}
      <section id="inspirations" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-16"
            kicker="Espaces de vie au niveau inférieur"
            title="Des réalisations qui montrent les possibilités"
            description="Volume dégagé, aire de vie, pièce polyvalente et salle de bain. Votre espace guidera les choix pertinents."
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

          <div className="mt-16 grid md:grid-cols-3 gap-12 border-t border-border pt-12">
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
      <section id="faq" className="scroll-mt-20 border-y border-border bg-muted/30 py-16 md:py-20">
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
      <section data-sticky-hide className="relative isolate overflow-hidden bg-secondary py-20 text-white md:py-24">
        <img
          src={gallery[0].src}
          alt=""
          aria-hidden="true"
          width={gallery[0].width}
          height={gallery[0].height}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-secondary/85" />
        <div className="container-large relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <PubSectionHeader
            className="text-center"
            tone="dark"
            kicker="Parlons de votre espace"
            title="Donnez une nouvelle place à votre sous-sol"
            description="Décrivez votre idée et l’espace actuel. Échangeons sur les points à évaluer à Laval ou dans les Laurentides."
          />
          <PubCTA service="renovation-sous-sol" className="px-10 py-5 text-lg rounded-none" testId="button-bottom-cta">Présenter mon projet</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
