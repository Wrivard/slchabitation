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
  PubProofBar,
  PubTestimonial,
} from '@/components/pub/PubShared';
import { FAQ, FAQList } from '@/components/pub/FAQ';
import {
  CalendarCheck, Check, ClipboardCheck, Droplets, Hammer, Lightbulb, MapPin,
  MessageSquare, Ruler, ShieldCheck, Wrench,
} from 'lucide-react';

const navItems = [
  { href: '#inclus', label: 'Ce qui est inclus' },
  { href: '#etapes', label: 'Comment ça se passe' },
  { href: '#visite', label: 'La visite' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#faq', label: 'Questions' },
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

const includedCards = [
  {
    icon: Hammer,
    title: 'La structure et l’isolation',
    points: ['Divisions et cloisons', 'Isolation des murs et du plafond', 'Insonorisation si vous la voulez'],
  },
  {
    icon: Wrench,
    title: 'La plomberie et l’électricité',
    points: ['Salle de bain ou salle d’eau', 'Prises, éclairage, chauffage', 'Ventilation de l’espace'],
  },
  {
    icon: Check,
    title: 'Les finitions',
    points: ['Plancher, gypse, peinture', 'Portes, moulures, rangements', 'Plafond et escalier'],
  },
];

const steps = [
  {
    icon: MessageSquare,
    title: 'Vous nous écrivez',
    text: 'Un formulaire de 3 étapes. Nous vous répondons sous 48 heures.',
  },
  {
    icon: Ruler,
    title: 'Nous venons voir',
    text: 'La visite est sans frais. Nous mesurons le sous-sol et notons l’usage que vous visez.',
  },
  {
    icon: ClipboardCheck,
    title: 'Vous recevez votre soumission',
    text: 'Les travaux prévus y sont détaillés. La soumission est sans frais.',
  },
  {
    icon: CalendarCheck,
    title: 'On réalise les travaux',
    text: 'Une équipe, un ordre de travail clair, de la structure aux finitions.',
  },
];

const visitPoints = [
  { title: 'L’humidité', text: 'Les traces d’eau, les odeurs et l’état des murs de fondation.' },
  { title: 'La hauteur', text: 'Les poutres, les conduits et les tuyaux qui descendent du plafond.' },
  { title: 'La dalle', text: 'La position des drains, si vous voulez une salle de bain.' },
  { title: 'Les fenêtres', text: 'Leur taille et leur sortie, surtout si vous voulez une chambre.' },
];

const visitChecklist = [
  'L’usage que vous voulez donner à la pièce',
  'Les pièces fermées souhaitées (chambre, bureau)',
  'Les traces d’humidité que vous avez déjà vues',
  'Votre budget approximatif',
];

const faqs = [
  {
    question: 'Combien coûte l’aménagement d’un sous-sol?',
    answer: 'Le prix dépend de la superficie, des pièces à fermer et des travaux de plomberie ou d’électricité nécessaires. Nous venons voir votre sous-sol, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.',
  },
  {
    question: 'Que faire s’il y a de l’humidité?',
    answer: 'Il faut régler la cause avant de fermer les murs. Pendant la visite, nous cherchons les traces d’eau et les odeurs, puis nous vous disons ce qui doit être corrigé en premier.',
  },
  {
    question: 'Peut-on aménager une chambre au sous-sol?',
    answer: 'Souvent oui. Il faut une fenêtre qui sert de sortie et une hauteur suffisante. Nous vérifions ces points sur place et nous validons les exigences de votre municipalité.',
  },
  {
    question: 'Peut-on ajouter une salle de bain s’il n’y a rien de prévu?',
    answer: 'C’est possible dans bien des cas. Tout dépend de la position du drain principal et de la dalle de béton. Nous le vérifions pendant la visite.',
  },
  {
    question: 'Est-ce que vous vous occupez de tout?',
    answer: 'Oui. Structure, isolation, plomberie, électricité, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 18 ans d’expérience.',
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
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Entrepreneur en rénovation</p>
            <h1 className="mb-6 max-w-4xl font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">Rénovation de sous-sol <br />à Laval et dans les Laurentides</h1>
            <p className="mb-8 max-w-3xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Nous venons voir votre sous-sol, puis nous vous remettons votre soumission. Plus de 500 projets complétés en 18 ans.</p>
            <PubCTA service="renovation-sous-sol" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>
            <p className="mt-4 text-sm text-gray-300">Estimation et visite sans frais · Réponse sous 48 heures</p>
          </div>
        </div>
      </section>

      <PubProofBar />

      <PubPageNav items={navItems} />

      {/* CE QUI EST INCLUS */}
      <section id="inclus" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-12 max-w-3xl"
            kicker="Ce qui est inclus"
            title="Un sous-sol fini au complet, par une seule équipe"
            description="Salle familiale, chambre, bureau ou salle de bain : vous n’avez pas à coordonner plusieurs entrepreneurs. Nous nous occupons de tout."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {includedCards.map(({ icon: Icon, title, points }) => (
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
            note="Visite et estimation sans frais, réponse sous 48 heures."
            action={<PubCTA service="renovation-sous-sol" testId="button-inclus-cta">Obtenir ma soumission sans frais</PubCTA>}
          />

          <div className="mt-14 aspect-[16/9] w-full overflow-hidden rounded-none border border-border">
            <img src={gallery[2].src} alt={gallery[2].alt} width={gallery[2].width} height={gallery[2].height} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* COMMENT ÇA SE PASSE */}
      <section id="etapes" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-12 max-w-3xl"
            kicker="Comment ça se passe"
            title="Quatre étapes simples"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            className="mt-10"
            note="Plus de 500 projets complétés, 19 avis Google 5 étoiles."
            action={<PubCTA service="renovation-sous-sol" testId="button-etapes-cta">Obtenir ma soumission sans frais</PubCTA>}
          />
        </div>
      </section>

      {/* LA VISITE */}
      <section id="visite" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <PubSectionHeader
                className="mb-8 max-w-xl"
                kicker="La visite"
                title="Ce que nous regardons chez vous"
                description="La visite est sans frais. Elle sert à chiffrer votre projet correctement."
              />
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {visitPoints.map((item) => (
                  <div key={item.title}>
                    <div className="mb-3 h-px w-12 bg-primary" />
                    <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-6 rounded-none bg-secondary p-8 text-white sm:flex-row sm:items-start">
                <Droplets className="h-10 w-10 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="mb-2 text-xl font-bold">L’humidité ne se cache pas sous le gypse</h3>
                  <p className="leading-relaxed text-gray-300">Si vous avez déjà vu de l’eau, une odeur ou de la peinture qui pèle, dites-le-nous. Ça change l’ordre des travaux.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-none border border-border">
                <img src={gallery[1].src} alt={gallery[1].alt} width={gallery[1].width} height={gallery[1].height} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <PubChecklist
                className="mt-8"
                icon={Lightbulb}
                title="À préparer pour la visite"
                items={visitChecklist}
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
        id="realisations"
        kicker="Sous-sols réalisés"
        title="Des sous-sols transformés en pièces de vie"
        description="Quelques projets menés de la structure aux finitions, parmi les 500 réalisés depuis 18 ans."
        images={gallery}
      />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-y border-border bg-muted/30 py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="text-center mx-auto mb-16 max-w-3xl"
            kicker="Questions fréquentes"
            title="Ce que les propriétaires nous demandent"
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
        <div className="container-large relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-primary">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-5 font-bold">Prêt à recevoir votre soumission?</h2>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Dites-nous ce que vous voulez faire de votre sous-sol. Réponse sous 48 heures, visite sans frais.</p>
          <PubCTA service="renovation-sous-sol" size="lg" testId="button-bottom-cta">Demander ma soumission sans frais</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
