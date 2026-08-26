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
  CalendarCheck,
  Check,
  ClipboardCheck,
  Grid,
  Hammer,
  Lightbulb,
  MapPin,
  MessageSquare,
  Ruler,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

const kitchenImages = {
  hero: {
    src: '/images/INT%C3%89RIEUR/Cuisine/IMG_20231107_093929-p-1600.jpg',
    alt: 'Grande cuisine blanche avec îlot central et comptoirs clairs',
    width: 1600,
    height: 1200,
  },
  wide: {
    src: '/images/INT%C3%89RIEUR/Cuisine/20220823_074355-p-1600.jpg',
    alt: 'Cuisine élégante avec finitions soignées',
    width: 1600,
    height: 1200,
  },
  visit: {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine%20st%20jerome%20apres.png',
    alt: 'Cuisine rénovée à Saint-Jérôme avec armoires claires et comptoir contrastant',
    width: 940,
    height: 788,
  },
};

const navItems = [
  { href: '#inclus', label: 'Ce qui est inclus' },
  { href: '#etapes', label: 'Comment ça se passe' },
  { href: '#visite', label: 'La visite' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#faq', label: 'Questions' },
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

const includedCards = [
  {
    icon: Hammer,
    title: 'La démolition et la préparation',
    points: ['Retrait de l’ancienne cuisine', 'Protection des pièces voisines', 'Murs et planchers remis d’aplomb'],
  },
  {
    icon: Wrench,
    title: 'La plomberie et l’électricité',
    points: ['Évier, lave-vaisselle, hotte', 'Prises, éclairage, îlot', 'Ventilation vers l’extérieur'],
  },
  {
    icon: Grid,
    title: 'Les armoires et les finitions',
    points: ['Armoires, comptoirs, dosseret', 'Plancher et peinture', 'Poignées, moulures, retouches'],
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
    text: 'La visite est sans frais. Nous mesurons et nous écoutons ce que vous voulez changer.',
  },
  {
    icon: ClipboardCheck,
    title: 'Vous recevez votre soumission',
    text: 'Les travaux prévus y sont détaillés. La soumission est sans frais.',
  },
  {
    icon: CalendarCheck,
    title: 'On réalise les travaux',
    text: 'Une équipe, un ordre de travail clair, du premier coup de marteau aux finitions.',
  },
];

const visitPoints = [
  { title: 'L’espace', text: 'Les dimensions, les passages et les portes qui s’ouvrent.' },
  { title: 'Les murs', text: 'Ce qu’on peut ouvrir et ce qui soutient la maison.' },
  { title: 'La tuyauterie et les fils', text: 'Où sont l’eau, le drain, la ventilation et le panneau électrique.' },
  { title: 'Vos appareils', text: 'Ceux que vous gardez et ceux que vous remplacez.' },
];

const visitChecklist = [
  'Ce qui vous dérange dans la cuisine actuelle',
  'Des photos ou des idées que vous aimez',
  'Les électroménagers que vous gardez',
  'Votre budget approximatif',
];

const faqs = [
  {
    question: 'Combien coûte une rénovation de cuisine?',
    answer: 'Le prix dépend de la grandeur de la pièce, des matériaux et des travaux de plomberie ou d’électricité nécessaires. Nous venons voir votre cuisine, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.',
  },
  {
    question: 'Combien de temps dure le chantier?',
    answer: 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.',
  },
  {
    question: 'Peut-on ouvrir le mur entre la cuisine et le salon?',
    answer: 'Souvent oui. Nous vérifions d’abord si le mur soutient la maison. Si c’est le cas, un renfort est prévu au plan avant les travaux.',
  },
  {
    question: 'Est-ce que je peux rester chez moi pendant les travaux?',
    answer: 'La plupart des clients restent à la maison. Nous protégeons les pièces voisines et nous convenons avec vous des accès à garder libres.',
  },
  {
    question: 'Est-ce que vous vous occupez de tout?',
    answer: 'Oui. Démolition, plomberie, électricité, armoires, comptoirs, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 18 ans d’expérience.',
  },
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
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Entrepreneur en rénovation</p>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">Rénovation de cuisine à Laval et dans les Laurentides</h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Nous venons voir votre cuisine, puis nous vous remettons votre soumission. Plus de 500 projets complétés en 18 ans.</p>
            <PubCTA service="renovation-cuisine" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>
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
            title="Une cuisine refaite au complet, par une seule équipe"
            description="Vous n’avez pas à engager un plombier, un électricien et un menuisier chacun de leur côté. Nous nous occupons de tout."
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
            action={<PubCTA service="renovation-cuisine" testId="button-inclus-cta">Obtenir ma soumission sans frais</PubCTA>}
          />

          <div className="mt-14 aspect-[16/9] w-full overflow-hidden rounded-none border border-border">
            <img
              src={kitchenImages.wide.src}
              alt={kitchenImages.wide.alt}
              width={kitchenImages.wide.width}
              height={kitchenImages.wide.height}
              loading="lazy"
              className="h-full w-full object-cover"
            />
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
            note="Plus de 500 projets complétés depuis 18 ans."
            action={<PubCTA service="renovation-cuisine" testId="button-etapes-cta">Obtenir ma soumission sans frais</PubCTA>}
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
            </div>
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-none border border-border">
                <img
                  src={kitchenImages.visit.src}
                  alt={kitchenImages.visit.alt}
                  width={kitchenImages.visit.width}
                  height={kitchenImages.visit.height}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
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
        description="Quelques projets menés du plan aux finitions, parmi les 500 réalisés depuis 18 ans."
        images={kitchenGallery}
      />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="mx-auto text-center max-w-3xl mb-16"
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
          <h2 className="mb-5 font-bold">Prêt à recevoir votre soumission?</h2>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Dites-nous ce que vous voulez changer dans votre cuisine. Réponse sous 48 heures, visite sans frais.</p>
          <PubCTA service="renovation-cuisine" size="lg" testId="button-bottom-cta">Demander ma soumission sans frais</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
