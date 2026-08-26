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
  PubCardNumber,
  PubCardText,
  PubCardTitle,
  PubChecklist,
  PubGallery,
  PubTestimonial,
} from '@/components/pub/PubShared';
import { FAQ, FAQList } from '@/components/pub/FAQ';
import {
  MapPin, ShieldCheck, Sparkles, Ruler, Droplets, Lightbulb,
  ClipboardCheck, Fan, Wrench, Layers, Waves, Wind, Zap,
  Ear, ScanLine, PencilRuler, Settings2, Hammer
} from 'lucide-react';

const bathroomImages = {
  hero: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20221021_145907-p-2000.jpg',
  vanity: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230427_135113-p-1600.jpg',
  shower: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241018_153927-p-1600.jpg',
  dark: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg',
  bright: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg',
  extra1: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20240709_151409-p-1600.jpg',
  extra2: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20220511_145711-p-1600.jpg',
  extra3: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241030_163652-p-1600.jpg'
};

const navigation = [
  ['#approche', 'Notre approche'],
  ['#possibilites', 'Possibilités'],
  ['#planification', 'Planifier'],
  ['#realisation', 'Réalisation'],
  ['#realisations', 'Réalisations'],
  ['#questions', 'FAQ'],
];

const bathroomGallery = [
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg',
    alt: 'Salle de bain lumineuse avec douche vitrée, bain et céramique blanche',
    caption: 'Douche vitrée et céramique claire',
    category: 'Rénovation de salle de bain',
    project: 'Douche vitrée',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241030_163652-p-1600.jpg',
    alt: 'Salle de bain rénovée avec vanité et grand miroir',
    caption: 'Vanité, miroir et éclairage coordonnés',
    category: 'Rénovation de salle de bain',
    project: 'Vanité et miroir',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg',
    alt: 'Salle de bain aux murs foncés avec douche en céramique',
    caption: 'Palette foncée et douche en céramique',
    category: 'Rénovation de salle de bain',
    project: 'Palette foncée',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20240709_151409-p-1600.jpg',
    alt: 'Bain autoportant et robinetterie dans une salle de bain rénovée',
    caption: 'Bain autoportant et dégagements',
    category: 'Rénovation de salle de bain',
    project: 'Bain autoportant',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230410_141714-p-1600.jpg',
    alt: 'Salle de bain avec douche en céramique et paroi vitrée',
    caption: 'Paroi vitrée et niche de douche',
    category: 'Rénovation de salle de bain',
    project: 'Niche de douche',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20251024_145742-p-1600.jpg',
    alt: 'Salle de bain rénovée avec vanité en bois et céramique au mur',
    caption: 'Vanité en bois et mur en céramique',
    category: 'Rénovation de salle de bain',
    project: 'Vanité en bois',
  },
];

const projectPriorities = [
  {
    icon: Ruler,
    title: 'Circulation et proportions',
    points: [
      'Dégagement devant la vanité, ouverture de porte et espace autour du bain guident le plan.',
      'Dans une petite pièce, des volumes justes comptent plus que le nombre d’éléments.',
    ],
  },
  {
    icon: Droplets,
    title: 'Zones exposées à l’eau',
    points: [
      'Douche, bain et raccords ont leurs propres contraintes.',
      'Surfaces, joints, pente et étanchéité sont étudiés selon la configuration.',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Lumière et gestes quotidiens',
    points: [
      'Miroir, éclairage général et commandes suivent les habitudes de la maisonnée.',
      'Leur position se prévoit avant la fermeture des murs.',
    ],
  },
];

const assessmentPoints = [
  { icon: Layers, title: 'Structure et plancher', text: 'Sens des solives, état du sous-plancher et charge des revêtements peuvent orienter le plan.' },
  { icon: Waves, title: 'Plomberie existante', text: 'Arrivées d’eau, drain et appareils indiquent ce qui peut rester ou être repensé.' },
  { icon: Wind, title: 'Ventilation', text: 'Parcours d’évacuation, emplacement de l’appareil et contraintes du bâtiment sont vérifiés avant les travaux.' },
  { icon: Zap, title: 'Électricité et éclairage', text: 'Panneau, circuits, prises et éclairage sont considérés selon les besoins du projet.' },
];

const preparationChecklist = [
  'Photos d’inspiration',
  'Habitudes de rangement',
  'Éléments à conserver',
  'Irritants actuels',
];

const steps = [
  { icon: Ear, title: 'Écouter la pièce et vos priorités', text: 'Douche, vanité, rangement, ambiance et circulation : la discussion cerne ce qui doit changer. Vos inspirations précisent matières et contrastes.' },
  { icon: ScanLine, title: 'Observer l’existant', text: 'Murs, ouvertures, installations et accès relient le plan au bâtiment. Un déplacement d’appareil se confirme après cette lecture technique.' },
  { icon: PencilRuler, title: 'Composer un plan cohérent', text: 'Douche, vanité, miroir, rangement, niches et revêtements sont comparés ensemble, selon la pièce.' },
  { icon: Settings2, title: 'Préparer les détails techniques', text: 'Plomberie, électricité requise, ventilation et surfaces à protéger sont coordonnées avant les finis, la robinetterie et les accessoires.' },
  { icon: Hammer, title: 'Avancer par zones', text: 'Démolition nécessaire, supports, technique et finitions suivent un ordre adapté à la portée et aux choix retenus.' },
];

const faqs = [
  ['Faut-il rénover toute la salle de bain ou seulement la douche ?', 'Les deux sont possibles. Le périmètre dépend des surfaces voisines, de la plomberie, de l’âge des composantes et du résultat visé. Une intervention ciblée demande aussi de vérifier la continuité des finis et la protection autour; l’évaluation aide à fixer une portée raisonnable.'],
  ['Peut-on déplacer la toilette, le bain ou la douche ?', 'Cela dépend du drain, de la structure du plancher et de l’accès aux installations. Comme un déplacement peut toucher plusieurs éléments, les options se valident après l’observation de la pièce.'],
  ['Comment se planifie une douche sans seuil ?', 'Il faut examiner le niveau du plancher, la pente, le drain, l’étanchéité, la paroi et les dimensions disponibles. L’évaluation indique si une solution de plain-pied ou une base convient mieux.'],
  ['Quels revêtements conviennent au sol et aux murs ?', 'Céramique, porcelaine, mosaïque ou autres surfaces se choisissent selon l’usage, le style et l’entretien. Le format influence la perception et les coupes; dans la douche, pose et zones à protéger comptent autant que la couleur.'],
  ['Est-ce qu’un plancher chauffant est possible ?', 'Il faut considérer le plancher, l’alimentation électrique, le revêtement et le confort recherché. La céramique est souvent envisagée, mais l’ensemble du projet — thermostat et zones non chauffées compris — doit être évalué.'],
  ['Pourquoi la ventilation est-elle importante ?', 'La salle de bain produit de l’humidité chaque jour. Volume, fenêtre, parcours vers l’extérieur et installations existantes orientent l’extraction d’air, à prévoir avant les finis des murs et du plafond.'],
  ['Comment choisir une vanité et le rangement ?', 'Partez des objets à ranger et de la circulation nécessaire. Tiroirs, pharmacie, niches ou colonne dépendent des murs disponibles; profondeur du meuble, miroir et prises influencent aussi l’usage.'],
  ['Que faut-il prévoir pour l’éclairage ?', 'Distinguez lumière générale, éclairage du miroir et ambiance. Zones près de l’eau, commandes et besoins électriques s’intègrent au plan avant les finitions.'],
  ['Comment préparer la rencontre pour un projet de salle de bain ?', 'Notez les irritants, les appareils à conserver ou remplacer, puis vos priorités de rangement et d’entretien. Dimensions approximatives, photos et inspirations alimentent l’échange; l’observation sur place précise ensuite les possibilités.'],
];

export default function RenovationSalleDeBainPub() {
  return (
    <PubLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary text-white min-h-[72vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src={bathroomImages.hero}
            alt="Salle de bain avec douche vitrée, vanité et céramique"
            width="2000"
            height="2667"
            className="h-full w-full object-cover object-[center_40%]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
        </div>
        <div className="container-large relative mx-auto max-w-7xl px-6 pb-16 pt-24 fade-up">
          <div className="max-w-4xl">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-semibold tracking-wide sm:text-sm">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><ShieldCheck className="h-4 w-4 text-primary" />RBQ : 8351-9033-59</span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><MapPin className="h-4 w-4 text-primary" />Laval et Laurentides</span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none border border-white/10"><Sparkles className="h-4 w-4 text-primary" />18 ans d’expérience</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Salle de bain pensée dans son ensemble</p>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">Rénovation de salle de bain <br />à Laval et dans les Laurentides</h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-200 md:text-[1.0625rem]">Usage, matières et technique doivent avancer ensemble. SLC Habitation examine votre espace avec vous pour envisager une rénovation cohérente avec votre maison.</p>
            <PubCTA service="renovation-salle-de-bain" size="lg" testId="button-hero-cta">Parler de votre projet</PubCTA>
          </div>
        </div>
      </section>

      <PubPageNav items={navigation.map(([href, label]) => ({ href, label }))} />

      {/* NOTRE APPROCHE */}
      <section id="approche" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <PubSectionHeader
                kicker="Une pièce intime, plusieurs décisions"
                title="Donner une direction claire à votre salle de bain"
              />
              <figure className="mt-8">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-none">
                  <img src={bathroomImages.vanity} alt="Vanité en bois clair et miroir rond dans une salle de bain rénovée" width="1600" height="2133" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground">Les matériaux, les volumes et la lumière se considèrent ensemble pour composer une pièce agréable à utiliser.</figcaption>
              </figure>
            </div>
            <div className="lg:col-span-7 lg:pl-8">
              <div className="space-y-4 text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground">
                <p className="text-xl text-foreground font-medium mb-8">Aucun choix n’est isolé. Le passage influence la vanité, la robinetterie touche les murs et la lumière transforme les textures.</p>
                <p>À Laval et dans les Laurentides, chaque plan est différent : fenêtre ou pièce compacte, plomberie conservée ou disposition revue. Nous partons de l’espace réel, de vos habitudes et des contraintes visibles.</p>
                <div className="border-y border-border py-2">
                  {[
                    ['Usage', 'Qui utilise la pièce? Que faut-il ranger? Qu’est-ce qui gêne aujourd’hui?'],
                    ['Priorités', 'Bain à conserver, rangement à gagner ou douche plus accessible orientent d’abord le plan.'],
                    ['Finitions', 'Couleur du robinet, miroir et tablette se comparent ensuite, sans engagement.'],
                    ['Évolution', 'Passage libre, commandes accessibles, zone de séchage et comptoir dégagé servent tous les âges.'],
                  ].map(([label, text]) => (
                    <div key={label} className="grid gap-1 border-b border-border py-5 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:gap-6">
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">{label}</p>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
                <p>Un enjeu de mobilité actuel ou futur mérite d’être nommé tôt. Accès, dégagements et renforts possibles peuvent alors être examinés avant les finitions, sans donner à la pièce un aspect clinique.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSSIBILITÉS */}
      <section id="possibilites" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-12 max-w-3xl"
            kicker="Repères de conception"
            title="Des choix qui servent votre quotidien"
            description="Lumineuse, texturée ou contrastée : la pièce part de l’usage, pas d’une tendance. Se préparer à deux, simplifier l’entretien, ranger les serviettes, aménager une douche ou garder un bain donnent la direction."
          />

          <div className="grid gap-6 border-t border-border pt-12 md:grid-cols-3">
            {projectPriorities.map(({ icon: Icon, title, points }) => (
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
            note="Choix comparés avant d’être retenus."
            action={<PubCTA service="renovation-salle-de-bain" testId="button-possibilites-cta">Obtenir une soumission</PubCTA>}
          />

          <div className="mt-16 grid lg:grid-cols-2 gap-12">
            <div className="aspect-[4/3] rounded-none overflow-hidden shadow-2xl shadow-black/5">
               <img src={bathroomImages.extra1} alt="Bain autoportant et détails" width="1600" height="1200" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1 lg:content-center rounded-none bg-secondary p-10 text-secondary-foreground">
              <div>
                <h3 className="mb-4 text-2xl font-bold text-white">Douche, bain, vanité : les composer sans les isoler</h3>
                 <ul className="space-y-3 leading-relaxed text-slate-300">
                   <li className="border-l border-primary pl-4"><strong className="text-white">Paroi vitrée :</strong> peut préserver la profondeur visuelle.</li>
                   <li className="border-l border-primary pl-4"><strong className="text-white">Niche :</strong> garde les produits accessibles.</li>
                   <li className="border-l border-primary pl-4"><strong className="text-white">Bain autoportant :</strong> peut devenir un point focal si dégagements, robinetterie et accès s’y prêtent.</li>
                 </ul>
                 <p className="mt-4 leading-relaxed text-slate-300">Chaque option est confrontée aux dimensions avant d’être retenue.</p>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold text-white">Le détail qui change la routine</h3>
                 <p className="leading-relaxed text-slate-300">Miroir, prise, tablette et tiroirs rendent les gestes plus intuitifs. Planifiés tôt, ces détails complètent les fondations techniques et clarifient les décisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATIÈRES ET EAU (Murs & Planchers) */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 aspect-[4/5] rounded-none overflow-hidden shadow-2xl shadow-black/5">
               <img src={bathroomImages.shower} alt="Douche vitrée et céramique grise" width="1600" height="2133" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <PubSectionHeader
                kicker="Matières et eau"
                title="Penser les surfaces avant de penser les accessoires"
                description="Murs et plancher encadrent l’eau, la perspective et l’entretien. Formats, joints et coupes se lisent avec le plan de la pièce."
              />
              <div className="text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground">
                <div className="border-t border-border">
                  {[
                    ['Formats', 'Un grand format peut unifier la lecture. Une mosaïque peut servir certains détails ou certaines surfaces.'],
                    ['Douche', 'Forme, seuil éventuel, drain, murs, porte, niveaux et raccords forment un seul système. Imperméabilisation et matériaux se choisissent avant la céramique et la robinetterie.'],
                    ['Lumière', 'Elle modifie les finis mats, veinages et teintes de bois. Une palette courte — céramique principale, accent et métal — peut garder la pièce calme et personnelle.'],
                    ['Sous la surface', 'Support, étanchéité et transitions au plancher, aux murs, au drain et aux pénétrations de plomberie demandent des détails adaptés. Dans la douche, le fini visible ne suffit pas à gérer l’eau.'],
                  ].map(([label, text]) => (
                    <div key={label} className="grid gap-2 border-b border-border py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                      <p className="font-bold text-foreground">{label}</p>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-base">Le système retenu et les conditions observées sur place guident les décisions techniques.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANIFICATION */}
      <section id="planification" className="scroll-mt-20 border-y border-border bg-muted/30 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <PubSectionHeader
                kicker="Avant de démarrer"
                title="Une évaluation pour situer les possibilités"
                description="L’évaluation confronte l’idée aux conditions du bâtiment. Elle repère ce qui influence le plan et remet les choix dans un ordre utile."
              />
              <div className="border-l-2 border-primary pl-6 text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground">
                <p className="mb-3 font-bold text-foreground">Exemple : déplacer un drain</p>
                <p>Son parcours dépend de la hauteur disponible, des solives et de la construction du plancher. Garder une douche ou une toilette près de sa position peut limiter les interventions; ailleurs, revoir le plan peut convenir. L’observation vient avant la conclusion.</p>
              </div>

              <PubChecklist
                className="mt-12"
                icon={ClipboardCheck}
                title="À apporter à la discussion"
                items={preparationChecklist}
              />
            </div>

            <div className="lg:col-span-7">
               <div className="mb-12 aspect-[16/9] overflow-hidden rounded-none">
                  <img src={bathroomImages.extra2} alt="Salle de bain moderne" width="1600" height="2133" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:border-t lg:border-border lg:pt-12">
                {assessmentPoints.map(({ icon: Icon, title, text }) => (
                  <PubCard key={title}>
                    <PubCardBody>
                      <PubCardIcon icon={Icon} />
                      <PubCardTitle>{title}</PubCardTitle>
                      <PubCardText>{text}</PubCardText>
                    </PubCardBody>
                  </PubCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉALISATION */}
      <section id="realisation" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="max-w-3xl mb-12"
            kicker="Une démarche lisible"
            title="Passer de l’intention à une salle de bain habitable"
             description="Chaque rénovation a son contexte. Cette séquence reste à confirmer par l’évaluation et les choix de conception."
          />

          <div className="grid gap-6 border-y border-border py-16 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <PubCard key={title}>
                <PubCardBody>
                  <PubCardNumber icon={Icon}>{`0${index + 1}`}</PubCardNumber>
                  <PubCardTitle rule>{title}</PubCardTitle>
                  <PubCardText>{text}</PubCardText>
                </PubCardBody>
              </PubCard>
            ))}
          </div>

          <PubActionBar
            className="mt-12"
            note="Séquence confirmée après l’évaluation."
            action={<PubCTA service="renovation-salle-de-bain" testId="button-realisation-cta">Obtenir une soumission</PubCTA>}
          />

          <div className="mt-16 grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
               <div className="flex items-center gap-4 border-b border-border pb-4">
                 <Fan className="h-8 w-8 text-primary stroke-[1.5]" />
                  <h3 className="text-2xl font-bold text-foreground">Humidité et renouvellement d’air</h3>
               </div>
               <ul className="space-y-3 text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground">
                 <li className="border-l border-primary pl-4">Prévoir l’évacuation de l’air humide selon le parcours disponible.</li>
                 <li className="border-l border-primary pl-4">Examiner plafond, conduits, fenêtre existante et position de la douche.</li>
                 <li className="border-l border-primary pl-4">Coordonner ouvertures, commandes et accès avant les finis.</li>
               </ul>
            </div>
            <div className="space-y-6">
               <div className="flex items-center gap-4 border-b border-border pb-4">
                 <Lightbulb className="h-8 w-8 text-primary stroke-[1.5]" />
                  <h3 className="text-2xl font-bold text-foreground">Lumière, prises et commandes</h3>
               </div>
               <ul className="space-y-3 text-base leading-relaxed md:text-[1.0625rem] text-muted-foreground">
                 <li className="border-l border-primary pl-4">Distinguer lumière générale, miroir et ambiance éventuelle.</li>
                 <li className="border-l border-primary pl-4">Observer hauteur du miroir, ombres et moments d’usage.</li>
                 <li className="border-l border-primary pl-4">Situer prises, commandes et luminaires après la vanité et la douche, puis valider selon le projet.</li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DEUXIÈME LECTURE */}
      <section className="bg-secondary py-16 text-white md:py-20 overflow-hidden">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <PubSectionHeader
                tone="dark"
                kicker="Une seconde lecture de votre projet"
                title="Clarifier vos priorités avant les choix de finition"
              />
               <div className="text-base leading-relaxed md:text-[1.0625rem] text-slate-300 mb-8">
                 <p className="mb-6">La rencontre remet les décisions dans l’ordre : appareils à conserver, rangement utile et ambiance liée aux autres pièces.</p>
                 <div className="mb-6 grid border-y border-white/15 sm:grid-cols-3">
                   <div className="border-b border-white/15 py-4 sm:border-b-0 sm:border-r sm:pr-4">
                     <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Licence</p>
                     <p className="mt-1 text-white">RBQ 8351-9033-59</p>
                   </div>
                   <div className="border-b border-white/15 py-4 sm:border-b-0 sm:border-r sm:px-4">
                     <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Expérience</p>
                     <p className="mt-1 text-white">18 ans</p>
                   </div>
                   <div className="py-4 sm:pl-4">
                     <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Territoire</p>
                     <p className="mt-1 text-white">Laval et Laurentides</p>
                   </div>
                 </div>
                 <p className="mb-4">L’accessibilité n’impose pas un style. Circulation directe, entrée de douche adaptée, banquette, profondeur de vanité et appuis peuvent être discutés selon les besoins.</p>
                 <p>Les avenues dépendent des dimensions, des supports, des produits retenus et des conditions observées dans la maison.</p>
              </div>
              <PubCTA service="renovation-salle-de-bain" size="lg" testId="button-middle-cta">Discuter de ma salle de bain</PubCTA>
            </div>
            <div className="aspect-[4/5] rounded-none overflow-hidden">
              <img src={bathroomImages.dark} alt="Salle de bain aux murs foncés" width="1600" height="2133" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubTestimonial
            quote="Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l'écoute, je recommande vivement!"
            author="Isabelle Baril"
            role="Propriétaire"
            image={{
              src: bathroomImages.extra3,
              alt: 'Salle de bain rénovée, lumineuse, avec vanité et grand miroir',
            }}
          />
        </div>
      </section>

      {/* GALERIE */}
      <PubGallery
        id="realisations"
        surface="muted"
        kicker="Salles de bain réalisées"
        title="Des pièces terminées à Laval et dans les Laurentides"
        description="Quelques projets menés par l’équipe : douches, vanités, céramique et éclairage choisis avec les propriétaires."
        images={bathroomGallery}
      />

      {/* FAQ */}
      <section id="questions" className="scroll-mt-20 border-y border-border bg-muted/30 py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="mx-auto text-center mb-16 max-w-3xl"
            kicker="Planifier avec plus de repères"
            title="Questions fréquentes sur la rénovation de salle de bain"
             description="Des repères à nuancer selon la pièce, le bâtiment et les choix du projet."
          />
          <FAQList>
            {faqs.map(([question, answer]) => <FAQ key={question} question={question as string} answer={answer as string} />)}
          </FAQList>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section data-sticky-hide className="relative isolate overflow-hidden bg-secondary py-20 text-white md:py-24">
        <img
          src={bathroomImages.bright}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-secondary/85" />
        <div className="container-large relative mx-auto max-w-3xl px-6 text-center">
          <Wrench className="mx-auto mb-5 h-9 w-9 text-primary" />
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">Votre projet, votre espace</p>
          <h2 className="mb-5 font-bold text-white">Parlons de la salle de bain que vous souhaitez transformer</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Présentez votre pièce, vos idées et vos priorités. Nous pourrons examiner les options pour votre rénovation à Laval ou dans les Laurentides.</p>
          <PubCTA service="renovation-salle-de-bain" size="lg" testId="button-bottom-cta">Demander une évaluation</PubCTA>
          <p className="mt-6 text-sm text-gray-400">La portée et les possibilités sont précisées en fonction de l’évaluation du projet.</p>
        </div>
      </section>
    </PubLayout>
  );
}
