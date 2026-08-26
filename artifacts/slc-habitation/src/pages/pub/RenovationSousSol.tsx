import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import {
  PubActionBar,
  PubPageNav,
  PubSectionHeader,
  PubCard,
  PubCardBody,
  PubCardIcon,
  PubCardList,
  PubCardNote,
  PubCardNumber,
  PubCardText,
  PubCardTitle,
  PubChecklist,
  PubGallery,
  PubInvite,
  PubTestimonial,
} from '@/components/pub/PubShared';
import { FAQ, FAQList } from '@/components/pub/FAQ';
import {
  Bath, Bed, CheckCircle2, Droplets, Hammer,
  Home, Lightbulb, MapPin, PanelTop, Ruler, ShieldCheck, Volume2, ArrowDown,
  Ear, LayoutGrid, Wrench, Paintbrush, Waves, ArrowUpDown, Zap, DoorOpen, Layers, ClipboardList
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
  { icon: Droplets, title: 'Humidité et fondation', text: "Signes d'humidité, état apparent des murs de fondation et conditions à corriger avant de fermer les assemblages." },
  { icon: ArrowUpDown, title: 'Hauteur et mécanique', text: 'Poutres, conduits, plomberie et câblage qui influencent la hauteur libre et le tracé des plafonds.' },
  { icon: Waves, title: 'Dalle et plomberie', text: 'Emplacement des drains, du renvoi principal et des appareils projetés lorsque la plomberie fait partie du scénario.' },
  { icon: DoorOpen, title: 'Ouvertures et sécurité', text: "Fenêtres, accès et usage prévu de chaque pièce, notamment lorsqu'une chambre est envisagée." },
  { icon: Zap, title: 'Électricité et chauffage', text: "Panneau, circuits existants, zones d'éclairage et besoins de chauffage à considérer dans la planification." },
  { icon: Layers, title: 'Structure et accès', text: "Murs, poutres, escaliers et parcours des matériaux qui peuvent influencer l'ordre des travaux." },
];

const planningChecklist = [
  'Les usages à réunir dans l’espace',
  'Les pièces à fermer',
  'Les équipements à garder accessibles',
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
    icon: Ear,
    title: 'Écouter le projet et observer le lieu',
    text: "Nous précisons les usages. Sur place, dimensions, ouvertures, mécanique visible et état général cadrent la réflexion.",
  },
  {
    number: '02',
    icon: LayoutGrid,
    title: 'Définir une configuration cohérente',
    text: "Les zones composent avec la circulation et la technique. Salle de bain, cloison, plafond et ouverture sont discutés avant les finis.",
  },
  {
    number: '03',
    icon: Wrench,
    title: 'Prévoir les interventions techniques',
    text: "Isolation, plomberie, électricité, chauffage et ventilation précèdent les surfaces. Leur portée, les permis et les validations dépendent du projet.",
  },
  {
    number: '04',
    icon: Paintbrush,
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
    category: 'Rénovation de sous-sol',
    project: 'Aire de vie et cuisine',
  },
  {
    src: '/images/INT%C3%89RIEUR/randoms/20240926_155408.jpg',
    alt: 'Sous-sol dégagé avant un projet de réaménagement avec petites fenêtres et plafond suspendu',
    width: 4000,
    height: 3000,
    caption: 'Point de départ : volume et éléments existants',
    category: 'Rénovation de sous-sol',
    project: 'Avant les travaux',
  },
  {
    src: '/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg',
    alt: 'Espace de sous-sol aménagé avec plancher de bois clair, fenêtres basses et murs beiges',
    width: 4000,
    height: 3000,
    caption: 'Pièce de vie lumineuse au niveau inférieur',
    category: 'Rénovation de sous-sol',
    project: 'Pièce de vie lumineuse',
  },
  {
    src: '/images/INT%C3%89RIEUR/randoms/20241018_161142.jpg',
    alt: 'Salle polyvalente au sous-sol avec portes françaises, plancher clair et éclairage au plafond',
    width: 4000,
    height: 3000,
    caption: 'Configuration ouverte avec accès fermé',
    category: 'Rénovation de sous-sol',
    project: 'Salle polyvalente',
  },
  {
    src: '/images/relume-655394.jpeg',
    alt: 'Douche vitrée et fenêtre basse dans une salle de bain aménagée au sous-sol',
    width: 1536,
    height: 2048,
    caption: 'Salle de bain : détail de douche et ventilation',
    category: 'Rénovation de sous-sol',
    project: 'Salle de bain au sous-sol',
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
            <PubCTA service="renovation-sous-sol" size="lg" testId="button-hero-cta">Parler de votre projet</PubCTA>
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
                className="mb-0"
                kicker="Un niveau à réinventer"
                title="Partir de l’espace réel, puis imaginer la vie qui s’y passe"
                description="Conduits, poutres, panneau, salle mécanique et fenêtres basses guident la place des pièces, la lumière et les priorités."
              />
            </div>
            <div className="lg:col-span-5">
              <PubChecklist icon={Lightbulb} title="À clarifier avant le plan" items={planningChecklist} />
            </div>
          </div>

          <div className="grid gap-6 border-t border-border pt-12 md:grid-cols-3">
            {possibilities.map(({ icon: Icon, title, text }) => (
              <PubCard key={title}>
                <PubCardBody>
                  <PubCardIcon icon={Icon} />
                  <PubCardTitle>{title}</PubCardTitle>
                  <PubCardText>{text}</PubCardText>
                </PubCardBody>
              </PubCard>
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosticPoints.map(({ icon: Icon, title, text }) => (
              <PubCard key={title}>
                <PubCardBody>
                  <PubCardIcon icon={Icon} />
                  <PubCardTitle>{title}</PubCardTitle>
                  <PubCardText>{text}</PubCardText>
                </PubCardBody>
              </PubCard>
            ))}
          </div>

          <PubActionBar
            className="mt-10"
            note="Un diagnostic avant les décisions."
            action={<PubCTA service="renovation-sous-sol" testId="button-diagnostic-cta">Obtenir une soumission</PubCTA>}
          />

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

          <div className="grid gap-6 md:grid-cols-2">
            {technicalChapters.map(({ number, title, icon: Icon, points, note }) => (
              <PubCard key={number}>
                <PubCardBody>
                  <PubCardNumber icon={Icon}>{number}</PubCardNumber>
                  <PubCardTitle rule>{title}</PubCardTitle>
                  <PubCardList items={points} />
                </PubCardBody>
                <PubCardNote label="Pour la visite" icon={ClipboardList}>{note}</PubCardNote>
              </PubCard>
            ))}
          </div>

          <PubActionBar
            className="mt-10"
            note="Des repères, puis une évaluation sur place."
            action={<PubCTA service="renovation-sous-sol" testId="button-reperes-cta">Obtenir une soumission</PubCTA>}
          />
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
                description="Les étapes séparent bâtiment, usage et esthétique. Vous gardez la vue d’ensemble avant de choisir."
              />
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                <ArrowDown className="h-5 w-5 text-primary" />Du constat initial aux finitions
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {steps.map((step) => (
                  <PubCard key={step.number}>
                    <PubCardBody>
                      <PubCardNumber icon={step.icon}>{step.number}</PubCardNumber>
                      <PubCardTitle rule>{step.title}</PubCardTitle>
                      <PubCardText>{step.text}</PubCardText>
                    </PubCardBody>
                  </PubCard>
                ))}
              </div>

              <PubInvite
                className="mt-14"
                kicker="Prochaine étape"
                title="Votre projet commence par les bonnes questions"
                description="Partagez l’usage visé et vos préoccupations. L’évaluation permet de discuter des possibilités propres au sous-sol."
                action={<PubCTA service="renovation-sous-sol" testId="button-middle-cta">Discuter de mon sous-sol</PubCTA>}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-large mx-auto max-w-5xl px-6">
          <PubTestimonial
            tone="dark"
            quote="Magnifique travail de l'équipe SLC Habitation. Nous avions un projet complexe avec plusieurs défis! Ils ont fait un travail exceptionnel. Un gros merci pour votre professionnalisme! Je recommande sans hésiter."
            author="Johanne Duguay"
            role="Propriétaire"
          />
        </div>
      </section>

      {/* RÉALISATIONS */}
      <PubGallery
        id="inspirations"
        kicker="Espaces de vie au niveau inférieur"
        title="Des réalisations qui montrent les possibilités"
        description="Volume dégagé, aire de vie, pièce polyvalente et salle de bain. Votre espace guidera les choix pertinents."
        images={gallery}
      />

      {/* REPÈRES D’AMÉNAGEMENT */}
      <section className="border-t border-border bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <PubCard>
              <PubCardBody>
                <PubCardIcon icon={PanelTop} />
                <PubCardTitle>Plafonds et détails techniques</PubCardTitle>
                <PubCardText>Un plafond continu ou des zones abaissées peuvent être envisagés selon les conduits et la hauteur disponible.</PubCardText>
              </PubCardBody>
            </PubCard>
            <PubCard>
              <PubCardBody>
                <PubCardIcon icon={Ruler} />
                <PubCardTitle>Circulation et rangement</PubCardTitle>
                <PubCardText>Le passage vers l’escalier, la salle mécanique ou les fenêtres conserve son importance dans un plan confortable.</PubCardText>
              </PubCardBody>
            </PubCard>
            <PubCard>
              <PubCardBody>
                <PubCardIcon icon={CheckCircle2} />
                <PubCardTitle>Choix adaptés à l’usage</PubCardTitle>
                <PubCardText>L’éclairage, les revêtements et l’acoustique se sélectionnent plus facilement lorsque la fonction de chaque zone est claire.</PubCardText>
              </PubCardBody>
            </PubCard>
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
          <FAQList>
            {faqs.map((faq) => <FAQ key={faq.question} question={faq.question} answer={faq.answer} />)}
          </FAQList>
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
          <PubCTA service="renovation-sous-sol" size="lg" testId="button-bottom-cta">Présenter mon projet</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
