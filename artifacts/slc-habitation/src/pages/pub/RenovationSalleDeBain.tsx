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
  MapPin, ShieldCheck, Sparkles, Ruler, Lightbulb,
  ClipboardCheck, Wrench, Hammer, Droplets, MessageSquare, CalendarCheck, Check,
} from 'lucide-react';

const bathroomImages = {
  hero: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20221021_145907-p-2000.jpg',
  wide: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20240709_151409-p-1600.jpg',
  visit: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20230427_135113-p-1600.jpg',
  testimonial: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241030_163652-p-1600.jpg',
  bright: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg',
};

const navItems = [
  { href: '#inclus', label: 'Ce qui est inclus' },
  { href: '#etapes', label: 'Comment ça se passe' },
  { href: '#visite', label: 'La visite' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#faq', label: 'Questions' },
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

const includedCards = [
  {
    icon: Hammer,
    title: 'La démolition et la préparation',
    points: ['Retrait de l’ancienne salle de bain', 'Protection du reste de la maison', 'Plancher et murs remis d’aplomb'],
  },
  {
    icon: Wrench,
    title: 'La plomberie et la ventilation',
    points: ['Douche, bain, toilette, vanité', 'Membrane étanche dans la douche', 'Ventilateur évacué vers l’extérieur'],
  },
  {
    icon: Droplets,
    title: 'La céramique et les finitions',
    points: ['Céramique au sol et aux murs', 'Vanité, miroir, robinetterie', 'Éclairage, prises et peinture'],
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
    text: 'La visite est sans frais. Nous mesurons la pièce et notons ce qui doit changer.',
  },
  {
    icon: ClipboardCheck,
    title: 'Vous recevez votre soumission',
    text: 'Les travaux prévus y sont détaillés. La soumission est sans frais.',
  },
  {
    icon: CalendarCheck,
    title: 'On réalise les travaux',
    text: 'Une équipe, un ordre de travail clair, de la démolition aux finitions.',
  },
];

const visitPoints = [
  { title: 'L’eau', text: 'Où sont l’entrée d’eau et le drain, et jusqu’où on peut les déplacer.' },
  { title: 'Le plancher', text: 'L’état du sous-plancher et le sens des solives.' },
  { title: 'L’air', text: 'Le ventilateur, son parcours vers l’extérieur et les traces d’humidité.' },
  { title: 'L’électricité', text: 'Les prises, l’éclairage et le panneau, surtout pour un plancher chauffant.' },
];

const visitChecklist = [
  'Ce qui vous dérange aujourd’hui',
  'Des photos ou des idées que vous aimez',
  'Bain, douche ou les deux',
  'Votre budget approximatif',
];

const faqs = [
  {
    question: 'Combien coûte une rénovation de salle de bain?',
    answer: 'Le prix dépend de la grandeur de la pièce, des matériaux et des travaux de plomberie nécessaires. Nous venons voir la pièce, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.',
  },
  {
    question: 'Combien de temps dure le chantier?',
    answer: 'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.',
  },
  {
    question: 'Peut-on déplacer la toilette, le bain ou la douche?',
    answer: 'Souvent oui. Tout dépend de la position du drain et de la structure du plancher. Nous le vérifions pendant la visite avant de vous confirmer le plan.',
  },
  {
    question: 'Peut-on remplacer le bain par une grande douche?',
    answer: 'Oui, c’est une demande fréquente. Nous regardons l’espace disponible, le drain et l’étanchéité à prévoir, puis nous vous proposons ce qui entre dans la pièce.',
  },
  {
    question: 'Est-ce que vous vous occupez de tout?',
    answer: 'Oui. Démolition, plomberie, ventilation, électricité, céramique et finitions sont coordonnées par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 18 ans d’expérience.',
  },
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
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Entrepreneur en rénovation</p>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">Rénovation de salle de bain <br />à Laval et dans les Laurentides</h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-200 md:text-[1.0625rem]">Nous venons voir votre salle de bain, puis nous vous remettons votre soumission. Plus de 500 projets complétés en 18 ans.</p>
            <PubCTA service="renovation-salle-de-bain" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>
            <p className="mt-4 text-sm text-slate-300">Estimation et visite sans frais · Réponse sous 48 heures</p>
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
            title="Une salle de bain refaite au complet, par une seule équipe"
            description="Vous n’avez pas à engager un plombier, un électricien et un céramiste chacun de leur côté. Nous nous occupons de tout."
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
            action={<PubCTA service="renovation-salle-de-bain" testId="button-inclus-cta">Obtenir ma soumission sans frais</PubCTA>}
          />

          <div className="mt-14 aspect-[16/9] w-full overflow-hidden rounded-none border border-border">
            <img src={bathroomImages.wide} alt="Bain autoportant et robinetterie dans une salle de bain rénovée" width="1600" height="1200" loading="lazy" className="h-full w-full object-cover" />
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
            action={<PubCTA service="renovation-salle-de-bain" testId="button-etapes-cta">Obtenir ma soumission sans frais</PubCTA>}
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
                <img src={bathroomImages.visit} alt="Vanité en bois clair et miroir rond dans une salle de bain rénovée" width="1600" height="2133" loading="lazy" className="h-full w-full object-cover" />
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
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubTestimonial
            quote="Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l'écoute, je recommande vivement!"
            author="Isabelle Baril"
            role="Propriétaire"
            image={{
              src: bathroomImages.testimonial,
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
        title="Des salles de bain terminées par notre équipe"
        description="Quelques projets menés de la démolition aux finitions, parmi les 500 réalisés depuis 18 ans."
        images={bathroomGallery}
      />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="mx-auto text-center mb-16 max-w-3xl"
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
          src={bathroomImages.bright}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-secondary/85" />
        <div className="container-large relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-primary">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-5 font-bold">Prêt à recevoir votre soumission?</h2>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Dites-nous ce que vous voulez changer dans votre salle de bain. Réponse sous 48 heures, visite sans frais.</p>
          <PubCTA service="renovation-salle-de-bain" size="lg" testId="button-bottom-cta">Demander ma soumission sans frais</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
