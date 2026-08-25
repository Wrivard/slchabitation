import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { PubPageNav, PubSectionHeader, PubFigure } from '@/components/pub/PubShared';
import { FAQ } from '@/components/pub/FAQ';
import {
  Bath, CheckCircle2, ChevronRight, ClipboardCheck, Droplets, Fan, Grid2X2,
  Lightbulb, MapPin, Ruler, ShieldCheck, ShowerHead, Sparkles, Wrench
} from 'lucide-react';

const bathroomImages = {
  hero: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20221021_145907-p-2000.jpg',
  vanity: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230427_135113-p-1600.jpg',
  shower: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241018_153927-p-1600.jpg',
  dark: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg',
  bright: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg',
};

const navigation = [
  ['#approche', 'Notre approche'],
  ['#possibilites', 'Possibilités'],
  ['#planification', 'Planifier'],
  ['#realisation', 'Réalisation'],
  ['#questions', 'FAQ'],
];

const projectPriorities = [
  { icon: Ruler, title: 'Circulation et proportions', text: 'Le dégagement devant la vanité, l’ouverture de la porte et la place autour du bain guident le plan. Une petite pièce peut gagner en clarté avec des volumes bien choisis plutôt qu’avec davantage d’éléments.' },
  { icon: Droplets, title: 'Zones exposées à l’eau', text: 'La douche, le bain et les raccords demandent une réflexion distincte. Le choix des surfaces, des joints, de la pente et des détails d’étanchéité est abordé selon la configuration retenue.' },
  { icon: Lightbulb, title: 'Lumière et gestes quotidiens', text: 'L’éclairage au miroir, l’ambiance générale et les commandes se réfléchissent avec les habitudes de la maisonnée. Cela aide à positionner chaque élément avant la fermeture des murs.' },
];

const assessmentPoints = [
  ['Structure et plancher', 'Le sens des solives, l’état du sous-plancher et la charge prévue par les revêtements peuvent influencer les options de plan.'],
  ['Plomberie existante', 'La position des arrivées d’eau, du drain et des appareils permet d’évaluer ce qui peut rester en place et ce qui mérite d’être repensé.'],
  ['Ventilation', 'Le parcours d’évacuation de l’air humide, l’emplacement de l’appareil et les contraintes du bâtiment sont à examiner avant les travaux.'],
  ['Électricité et éclairage', 'Le panneau, les circuits existants, les prises et les besoins d’éclairage sont considérés lorsque le projet le demande.'],
];

const steps = [
  ['1', 'Écouter la pièce et vos priorités', 'Une première discussion sert à comprendre ce que vous souhaitez changer : une douche plus ouverte, une vanité mieux adaptée, du rangement, une ambiance différente ou une circulation plus simple. Les photos d’inspiration sont utiles pour préciser les matériaux et le niveau de contraste que vous aimez.'],
  ['2', 'Observer l’existant', 'L’évaluation sur place met le plan en relation avec le bâtiment. Les murs, les ouvertures, les installations visibles et les accès sont des repères concrets. Certaines décisions, notamment un déplacement d’appareil, se confirment après cette lecture technique.'],
  ['3', 'Composer un plan cohérent', 'Les composantes sont ensuite envisagées ensemble : dimensions de la douche, type de vanité, emplacement du miroir, rangement, niches et revêtements. Cette étape permet de comparer des avenues adaptées à la pièce plutôt que de sélectionner chaque produit isolément.'],
  ['4', 'Préparer les détails techniques', 'Avant la finition, les parcours de plomberie, les interventions électriques requises, la ventilation et les surfaces à protéger sont coordonnés selon le projet. La céramique, la robinetterie et les accessoires prennent alors place dans une séquence plus lisible.'],
  ['5', 'Avancer par zones', 'La réalisation se structure habituellement autour de la démolition nécessaire, de la préparation des supports, des composantes techniques et des finitions. La portée exacte et l’ordre des interventions sont établis en fonction de votre salle de bain et des choix retenus.'],
];

const faqs = [
  ['Faut-il rénover toute la salle de bain ou seulement la douche ?', 'Les deux approches peuvent être envisagées. Le bon périmètre dépend de l’état des surfaces adjacentes, de la plomberie, de l’âge des composantes et du résultat recherché. Une intervention ciblée peut aussi amener à vérifier la continuité des finis et la protection des zones voisines. Une évaluation aide à déterminer une portée raisonnable pour votre pièce.'],
  ['Peut-on déplacer la toilette, le bain ou la douche ?', 'Cela dépend notamment du cheminement du drain, de la structure du plancher et de l’accès aux installations existantes. Déplacer un appareil peut modifier plusieurs éléments du projet; il est donc préférable de le valider après l’observation de la salle de bain. Nous pouvons discuter d’options qui tiennent compte de ces contraintes.'],
  ['Comment se planifie une douche sans seuil ?', 'Une douche sans seuil demande une attention particulière au niveau du plancher, à la pente vers le drain, à l’étanchéité et à la paroi. Les dimensions disponibles et le type de drain influencent aussi le dessin. Selon l’évaluation, une solution de plain-pied ou une alternative avec base peut être plus appropriée.'],
  ['Quels revêtements conviennent au sol et aux murs ?', 'La céramique, la porcelaine, la mosaïque et d’autres surfaces peuvent être considérées selon l’usage, le style et l’entretien souhaité. Le format des carreaux change la perception de l’espace et peut influencer les coupes. Dans la douche, les détails de pose et les zones à protéger font partie de la discussion, pas seulement la couleur.'],
  ['Est-ce qu’un plancher chauffant est possible ?', 'Cette possibilité est examinée avec la composition du plancher, l’alimentation électrique disponible, le revêtement choisi et le confort recherché. La céramique est souvent considérée pour ce type d’application, mais le projet doit être évalué dans son ensemble. Le positionnement du thermostat et les zones non chauffées peuvent aussi être planifiés.'],
  ['Pourquoi la ventilation est-elle importante ?', 'Une salle de bain produit de l’humidité au quotidien. Le volume de la pièce, la présence d’une fenêtre, le parcours vers l’extérieur et les installations en place sont des éléments utiles pour réfléchir à l’extraction d’air. La ventilation se prévoit idéalement avant que les murs et le plafond reçoivent leurs finis.'],
  ['Comment choisir une vanité et le rangement ?', 'Commencez par les objets que vous utilisez réellement et par l’espace de circulation nécessaire. Des tiroirs, une pharmacie, des niches ou une colonne peuvent être considérés selon les murs disponibles. La profondeur du meuble, la hauteur du miroir et la position des prises contribuent également à l’usage quotidien.'],
  ['Que faut-il prévoir pour l’éclairage ?', 'Il est utile de distinguer l’éclairage général de la lumière autour du miroir et de l’éclairage d’ambiance. Les zones près de l’eau, les commandes et les besoins électriques sont à intégrer au plan. Une réflexion en amont évite de choisir les luminaires seulement après les finitions.'],
  ['Comment préparer la rencontre pour un projet de salle de bain ?', 'Notez ce qui fonctionne moins bien aujourd’hui, les appareils que vous souhaitez conserver ou remplacer, ainsi que vos priorités de rangement et d’entretien. Des dimensions approximatives, des photos de la pièce et quelques images d’inspiration enrichissent l’échange. Les conditions observées sur place servent ensuite à préciser les possibilités.'],
];

export default function RenovationSalleDeBainPub() {
  return (
    <PubLayout>
      <section className="relative isolate overflow-hidden bg-secondary py-20 text-secondary-foreground md:py-32">
        <img src={bathroomImages.hero} alt="Salle de bain avec douche vitrée, vanité et céramique" width="2000" height="2667" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-slate-950/75" />
        <div className="container-large mx-auto max-w-6xl px-6">
          <div className="max-w-3xl fade-up">
            <div className="mb-7 flex flex-wrap gap-3 text-xs font-semibold tracking-wide text-white sm:text-sm">
              <span className="inline-flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2"><ShieldCheck className="h-4 w-4 text-primary" /> RBQ : 8351-9033-59</span>
              <span className="inline-flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2"><Sparkles className="h-4 w-4 text-primary" /> 18 ans d’expérience</span>
              <span className="inline-flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2"><MapPin className="h-4 w-4 text-primary" /> Laval et Laurentides</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Salle de bain pensée dans son ensemble</p>
            <h1 className="mb-7 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">Rénovation de salle de bain <br />à Laval et dans les Laurentides</h1>
            <p className="mb-9 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">Réimaginer une salle de bain, c’est accorder les gestes du matin, les matières que l’on voit et les éléments techniques que l’on ne voit pas. SLC Habitation vous accompagne pour examiner votre espace et envisager une rénovation cohérente avec votre maison.</p>
            <PubCTA service="renovation-salle-de-bain" className="px-8 py-5 text-lg" testId="button-hero-cta">Parler de votre projet</PubCTA>
          </div>
        </div>
      </section>

      <PubPageNav items={navigation.map(([href, label]) => ({ href, label }))} />

      <section id="approche" className="scroll-mt-20 bg-background py-20 md:py-28">
        <div className="container-large mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Une pièce intime, plusieurs décisions</p>
            <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">Donner une direction claire à votre salle de bain</h2>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>Une rénovation de salle de bain commence rarement par un seul choix. Vous pensez peut-être à une douche plus confortable, à un meuble-lavabo qui libère le comptoir ou à une céramique qui change l’atmosphère. Pourtant, ces choix se répondent : la largeur de passage influence la vanité, la robinetterie influence les murs, et la lumière modifie la lecture des textures.</p>
              <p>À Laval comme dans les Laurentides, les salles de bain se trouvent dans des maisons aux plans très différents. Certaines offrent une fenêtre, d’autres sont compactes; certaines conservent leur plomberie au même endroit, d’autres invitent à revoir la disposition. L’objectif est de partir de l’espace réel, de vos habitudes et des contraintes observables afin d’orienter le projet avec discernement.</p>
              <p>Nous privilégions une conversation pratique : qui utilise la pièce, quels objets doivent y trouver place, quelle ambiance vous convient et quels éléments posent problème aujourd’hui? Ces réponses aident à élaborer un aménagement lisible. Elles permettent aussi de prioriser les décisions qui doivent être prises avant les finis, sans présumer de ce que la structure ou les installations permettront.</p>
              <p>Avant l’évaluation, il peut être utile de distinguer les souhaits essentiels des préférences secondaires. Par exemple, conserver un bain, créer davantage de rangement ou faciliter l’entrée dans la douche sont des priorités qui orientent vraiment le plan. La couleur d’un robinet, le format du miroir ou la position d’une tablette peuvent ensuite être comparés avec plus de recul. Cette préparation ne vous engage pas : elle donne simplement un vocabulaire plus clair pour expliquer ce que vous attendez de la pièce.</p>
              <p>Il est aussi pertinent de penser aux changements de besoins, sans transformer la salle de bain en espace clinique. Une porte qui ne gêne pas le passage, des commandes faciles à atteindre, une zone de séchage près de la douche ou une surface de comptoir dégagée peuvent être appréciés par des personnes de tous âges. Si la mobilité est un enjeu actuel ou futur, dites-le dès la première discussion. Cela permet d’examiner l’accès, les dégagements et les renforts possibles avant que les choix de finition ne prennent toute la place.</p>
            </div>
          </div>
          <figure className="lg:col-span-6">
            <img src={bathroomImages.vanity} alt="Vanité en bois clair et miroir rond dans une salle de bain rénovée" width="1600" height="2133" loading="lazy" className="h-[500px] w-full rounded-none object-cover" />
            <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground">Les matériaux, les volumes et la lumière se considèrent ensemble pour composer une pièce agréable à utiliser.</figcaption>
          </figure>
        </div>
      </section>

      <section id="possibilites" className="scroll-mt-20 border-y border-border bg-muted/35 py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Repères de conception</p>
            <h2 className="mb-5 text-3xl font-bold md:text-4xl">Des choix qui servent votre quotidien</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">Une salle de bain réussie ne repose pas sur une tendance unique. Elle peut être lumineuse et minimale, texturée et chaleureuse, ou plus contrastée. Le point de départ reste l’usage : se préparer à deux, faciliter le nettoyage, accueillir les serviettes, aménager une douche ou conserver un bain selon votre réalité.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projectPriorities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-none border border-border bg-background p-8">
              <Icon className="mb-5 h-8 w-8 text-primary" /><h3 className="mb-3 text-xl font-bold">{title}</h3><p className="leading-relaxed text-muted-foreground">{text}</p>
            </article>)}
          </div>
          <div className="mt-12 grid gap-8 rounded-none bg-secondary p-8 text-secondary-foreground md:grid-cols-2 md:p-10">
            <div><h3 className="mb-4 text-2xl font-bold text-white">Douche, bain, vanité : les composer sans les isoler</h3><p className="leading-relaxed text-slate-300">Une douche avec paroi vitrée peut préserver la profondeur visuelle d’une petite salle de bain. Une niche peut être utile quand les produits de soin doivent rester accessibles. Un bain autoportant peut devenir un point focal si les dégagements, la robinetterie et les accès s’y prêtent. Chaque option est mise en relation avec les dimensions de la pièce avant de devenir un choix définitif.</p></div>
            <div><h3 className="mb-4 text-2xl font-bold text-white">Le détail qui change la routine</h3><p className="leading-relaxed text-slate-300">Un miroir bien positionné, une prise au bon endroit, une tablette près du bain ou des tiroirs organisés peuvent rendre la pièce plus intuitive. Ces détails ne remplacent pas les fondations techniques; ils donnent toutefois du sens à la rénovation. Les intégrer dès la planification facilite une vision d’ensemble et des décisions plus sereines.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container-large mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <figure className="order-2 lg:order-1"><img src={bathroomImages.shower} alt="Douche vitrée et céramique grise dans une salle de bain" width="1600" height="2133" loading="lazy" className="h-[520px] w-full rounded-none object-cover" /></figure>
          <div className="order-1 lg:order-2">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Matières et eau</p>
            <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">Penser les surfaces avant de penser les accessoires</h2>
            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p>Dans une salle de bain, les murs et le plancher sont plus qu’un décor. Ils encadrent les zones humides, structurent la perspective et déterminent une part importante de l’entretien. Un grand format peut créer une lecture plus continue; une mosaïque peut convenir à certains détails ou à certaines surfaces. Les dimensions, les joints et les coupes méritent d’être regardés avec le plan de la pièce.</p>
              <p>La douche appelle une attention particulière. Sa forme, son seuil éventuel, son drain, ses murs et sa porte s’inscrivent dans un ensemble où les niveaux et les raccords comptent. Les systèmes d’imperméabilisation et les matériaux appropriés sont considérés selon la solution retenue. Il est préférable de discuter de ces aspects avant de fixer la céramique ou la robinetterie.</p>
              <p>Les échantillons sont utiles, mais la lumière réelle change les nuances. Observer une finition mate, un veinage ou une teinte de bois avec l’éclairage prévu peut aider à faire un choix plus juste. Une palette volontairement courte — par exemple une céramique principale, un accent et un métal — peut aussi soutenir une pièce calme sans limiter votre personnalité.</p>
              <p>Les couches situées sous le revêtement font également partie de la réflexion. Selon la zone, le support doit être préparé avant l’application d’un système d’étanchéité, puis les transitions entre le plancher, les murs, le drain et les pénétrations de plomberie demandent des détails adaptés. Cette séquence est particulièrement importante dans une douche, car la surface visible ne suffit pas à décrire la gestion de l’eau. Le système envisagé et les conditions relevées sur place guident les décisions techniques.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="planification" className="scroll-mt-20 bg-muted/35 py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Avant de démarrer</p><h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">Une évaluation pour situer les possibilités</h2><p className="text-lg leading-relaxed text-muted-foreground">Une belle idée prend une forme plus précise lorsqu’elle rencontre les conditions du bâtiment. L’évaluation ne sert pas à compliquer le projet : elle sert à identifier les points qui peuvent influencer le plan et à aborder les choix dans un ordre utile.</p><p className="mt-5 leading-relaxed text-muted-foreground">Le déplacement d’un drain illustre bien cette logique. Son parcours possible dépend notamment de la hauteur disponible, du sens des solives et de la manière dont le plancher est construit. Une douche ou une toilette peut parfois rester près de son emplacement actuel pour limiter les interventions à examiner; dans d’autres cas, le plan peut être revu. Le rôle de l’évaluation est d’éviter de conclure avant d’avoir observé ces repères.</p><aside className="mt-8 rounded-none border-l-4 border-primary bg-background p-6"><h3 className="mb-2 font-bold">À apporter à la discussion</h3><p className="text-sm leading-relaxed text-muted-foreground">Vos photos d’inspiration, vos habitudes de rangement, une liste de ce que vous souhaitez conserver et les irritants de la pièce actuelle donnent des repères concrets pour l’échange.</p></aside></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">{assessmentPoints.map(([title, text]) => <article key={title} className="rounded-none border border-border bg-background p-6"><ClipboardCheck className="mb-4 h-6 w-6 text-primary" /><h3 className="mb-2 text-lg font-bold">{title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
          </div>
        </div>
      </section>

      <section id="realisation" className="scroll-mt-20 bg-background py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-3xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Une démarche lisible</p><h2 className="mb-5 text-3xl font-bold md:text-4xl">Passer de l’intention à une salle de bain habitable</h2><p className="text-lg leading-relaxed text-muted-foreground">Chaque rénovation a son contexte. Cette séquence présente les sujets qui peuvent être abordés dans un projet, en restant attentive à ce que l’évaluation et les choix de conception permettent de confirmer.</p></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">{steps.map(([number, title, text]) => <article key={number} className="rounded-none border border-border p-6"><span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{number}</span><h3 className="mb-3 text-lg font-bold">{title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
          <div className="mt-10 grid gap-6 rounded-none border border-border bg-muted/30 p-7 md:grid-cols-2 md:p-9">
            <div><div className="mb-3 flex items-center gap-3"><Fan className="h-6 w-6 text-primary" /><h3 className="text-xl font-bold">Humidité et renouvellement d’air</h3></div><p className="leading-relaxed text-muted-foreground">La ventilation mérite d’être pensée avec l’usage de la pièce, et non comme un accessoire ajouté à la fin. L’air humide doit pouvoir être évacué selon le parcours disponible dans le bâtiment. Le plafond, les conduits, une fenêtre existante et la position de la douche peuvent tous influencer la solution à étudier. Prévoir cet échange avant les finis aide à coordonner les ouvertures, les commandes et l’accès requis pour l’installation.</p></div>
            <div><div className="mb-3 flex items-center gap-3"><Lightbulb className="h-6 w-6 text-primary" /><h3 className="text-xl font-bold">Lumière, prises et commandes</h3></div><p className="leading-relaxed text-muted-foreground">Une salle de bain peut réunir une lumière générale, un éclairage au miroir et, selon le projet, une ambiance plus douce. Pensez à la hauteur du miroir, aux zones d’ombre et aux moments où la pièce est utilisée. Les prises, interrupteurs, luminaires et besoins électriques éventuels sont plus simples à discuter lorsque la vanité et la douche sont déjà situées sur le plan. Leur implantation demeure à valider selon les conditions du projet.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 text-secondary-foreground md:py-28">
        <div className="container-large mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Une seconde lecture de votre projet</p><h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">Clarifier vos priorités avant les choix de finition</h2><p className="mb-5 leading-relaxed text-slate-300">Une rencontre peut être l’occasion de remettre de l’ordre dans les décisions : faut-il conserver l’emplacement des appareils? Quel rangement est réellement utile? Quelle ambiance s’accorde aux autres pièces? SLC Habitation détient la licence RBQ 8351-9033-59 et compte 18 ans d’expérience pour accompagner les projets à Laval et dans les Laurentides.</p><p className="mb-5 leading-relaxed text-slate-300">L’accessibilité peut aussi faire partie de la conversation, sans imposer un style particulier. Une circulation plus directe, une douche avec une entrée adaptée, une banquette envisagée, une vanité dont la profondeur convient ou des appuis prévus au bon endroit sont des sujets à soulever selon les besoins. Les dimensions de la pièce et les supports disponibles permettent ensuite d’examiner quelles avenues sont pertinentes.</p><p className="mb-8 leading-relaxed text-slate-300">Nous pouvons parler de votre espace tel qu’il est, de vos intentions et des éléments à vérifier. Les réponses détaillées dépendent de l’évaluation, des produits retenus et des conditions rencontrées dans la maison.</p><PubCTA service="renovation-salle-de-bain" className="px-8 py-5" testId="button-middle-cta">Discuter de ma salle de bain</PubCTA></div>
          <figure><img src={bathroomImages.dark} alt="Salle de bain aux murs foncés avec douche et vanité suspendue" width="1600" height="2133" loading="lazy" className="h-[500px] w-full rounded-none object-cover" /></figure>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center"><figure className="lg:col-span-5"><img src={bathroomImages.bright} alt="Salle de bain lumineuse avec douche, bain et céramique blanche" width="1600" height="1200" loading="lazy" className="h-[390px] w-full rounded-none object-cover" /></figure><div className="lg:col-span-7"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Un témoignage</p><blockquote className="mb-6 text-2xl font-medium leading-relaxed md:text-3xl">« Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l'écoute, je recommande vivement! »</blockquote><p className="font-bold">Isabelle Baril</p><p className="mt-1 text-sm text-muted-foreground">Propriétaire</p></div></div>
        </div>
      </section>

      <section id="questions" className="scroll-mt-20 border-y border-border bg-muted/35 py-20 md:py-28">
        <div className="container-large mx-auto max-w-4xl px-6"><div className="mb-12 text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Planifier avec plus de repères</p><h2 className="mb-4 text-3xl font-bold md:text-4xl">Questions fréquentes sur la rénovation de salle de bain</h2><p className="text-lg leading-relaxed text-muted-foreground">Voici des pistes pour préparer votre réflexion. Les réponses précises se nuancent selon la salle de bain, le bâtiment et les choix du projet.</p></div><div className="space-y-4">{faqs.map(([question, answer]) => <FAQ key={question} question={question} answer={answer} />)}</div></div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container-large mx-auto max-w-4xl px-6 text-center"><Wrench className="mx-auto mb-5 h-9 w-9 text-primary" /><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Votre projet, votre espace</p><h2 className="mb-6 text-3xl font-bold md:text-5xl">Parlons de la salle de bain que vous souhaitez transformer</h2><p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">Présentez-nous votre pièce, vos idées et vos priorités. Nous pourrons amorcer une discussion sur les options à examiner pour votre rénovation de salle de bain à Laval ou dans les Laurentides.</p><PubCTA service="renovation-salle-de-bain" className="px-10 py-5 text-lg" testId="button-bottom-cta">Demander une évaluation</PubCTA><p className="mt-5 text-sm text-muted-foreground">La portée et les possibilités sont précisées en fonction de l’évaluation du projet.</p></div>
      </section>
    </PubLayout>
  );
}