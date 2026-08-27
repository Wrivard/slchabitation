import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import {
  PubActionBar,
  PubSectionHeader,
  PubCard,
  PubCardBody,
  PubCardIcon,
  PubCardList,
  PubCardMedia,
  PubCardNumber,
  PubCardText,
  PubCardTitle,
  PubChecklist,
  PubGallery,
  PubHero,
  PubPhotoRow,
  PubProofBar,
  PubReviews,
  PubServiceArea,
} from '@/components/pub/PubShared';
import { FAQ, FAQList } from '@/components/pub/FAQ';
import {
  ShieldCheck, Star, Ruler, Lightbulb,
  ClipboardCheck, Wrench, Hammer, Droplets, MessageSquare, CalendarCheck, Check,
} from 'lucide-react';

const bathroomImages = {
  hero: {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-1600.jpg',
    alt: 'Salle de bain avec vanité en bois, grande douche vitrée et céramique grise',
    width: 1600,
    height: 1200,
  },
  visit: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vitre-p-1600.jpg',
  bright: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-bain-autoportant-p-1600.jpg',
};

const heroThumbs = [
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-bain-autoportant-p-500.jpg',
    alt: 'Salle de bain avec bain autoportant, robinetterie noire et plancher gris',
    width: 500,
    height: 375,
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-500.jpg',
    alt: 'Salle de bain avec vanité en bois et douche vitrée',
    width: 500,
    height: 375,
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-vanite-noire-p-500.jpg',
    alt: 'Salle de bain avec vanité noire, mur hexagonal et douche vitrée',
    width: 500,
    height: 667,
  },
];

const detailPhotos = [
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-1600.jpg',
    alt: 'Salle de bain avec vanité en bois, grande douche vitrée et céramique grise',
    width: 1600,
    height: 1200,
    caption: 'Douche et vanité coordonnées',
    text: 'La vanité en bois et la douche vitrée se répondent dans une pièce claire et fonctionnelle.',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vitre-p-800.jpg',
    alt: 'Douche vitrée avec grande céramique grise et robinetterie noire',
    width: 800,
    height: 1067,
    caption: 'Douche vitrée et céramique',
    text: 'La grande douche vitrée met en valeur la céramique et garde la pièce visuellement ouverte.',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2023-vanite-bois-p-800.jpg',
    alt: 'Vanité en bois avec lavabo noir, miroirs ronds et dosseret décoratif',
    width: 800,
    height: 1067,
    caption: 'Vanité et mur accent',
    text: 'La vanité en bois et le mur accent donnent du caractère à cette salle de bain sans alourdir l’espace.',
  },
];

const navItems = [
  { href: '#inclus', label: 'Ce qui est inclus' },
  { href: '#etapes', label: 'Comment ça se passe' },
  { href: '#finitions', label: 'Les finitions' },
  { href: '#visite', label: 'La visite' },
  { href: '#avis', label: 'Avis' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#faq', label: 'Questions' },
];

const reviews = [
  {
    quote: 'Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!',
    author: 'Isabelle Baril',
  },
  {
    quote:
      'Excellente compagnie, service professionnel et soucis du détails! Merci a votre équipe pour vos bon conseil. Je recommande a tous pour la réalisation de vos projet!',
    author: 'Mélodie Binette',
  },
  {
    quote:
      'Magnifique travail de l’équipe SLC Habitation. Nous avions un projet complexe d’agrandissement et de rénovation d’une vieille maison avec plusieurs défis! Ils ont fait un travail exceptionnel!!! Un gros merci pour votre patience et votre professionnalisme! Je recommande sans hésiter!',
    author: 'Johanne Duguay',
  },
];

const serviceCities = [
  'Laval',
  'Saint-Eustache',
  'Terrebonne',
  'Sainte-Thérèse',
  'Rosemère',
  'Mirabel',
  'Boisbriand',
  'Blainville',
  'Saint-Jérôme',
];

const bathroomGallery = [
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-bain-autoportant-p-1600.jpg',
    alt: 'Salle de bain avec bain autoportant blanc, robinetterie noire et plancher gris',
    caption: 'Bain autoportant et robinetterie noire',
    category: 'Rénovation de salle de bain',
    project: 'Bain autoportant',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vanite-p-1600.jpg',
    alt: 'Salle de bain avec vanité en bois, grande douche vitrée et céramique grise',
    caption: 'Vanité en bois et douche vitrée',
    category: 'Rénovation de salle de bain',
    project: 'Douche et vanité',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-douche-vitre-p-1600.jpg',
    alt: 'Douche vitrée avec grande céramique grise et robinetterie noire',
    caption: 'Grande douche vitrée',
    category: 'Rénovation de salle de bain',
    project: 'Douche sur mesure',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2022-vanite-noire-p-1600.jpg',
    alt: 'Salle de bain avec vanité noire, mur hexagonal et douche vitrée',
    caption: 'Vanité noire et mur hexagonal',
    category: 'Rénovation de salle de bain',
    project: 'Vanité et mur accent',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2023-vanite-bois-p-1600.jpg',
    alt: 'Salle de bain avec vanité en bois, lavabo noir et mur décoratif',
    caption: 'Vanité en bois et lavabo noir',
    category: 'Rénovation de salle de bain',
    project: 'Vanité sur mesure',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/salle-bain-2024-douche-vanite-p-1600.jpg',
    alt: 'Salle de bain avec meuble-lavabo en bois, douche vitrée et porte coulissante',
    caption: 'Meuble-lavabo et porte coulissante',
    category: 'Rénovation de salle de bain',
    project: 'Salle de bain complète',
  },
];

const includedCards = [
  {
    icon: Hammer,
    title: 'La démolition et la préparation',
    points: ['Retrait de l’ancienne salle de bain', 'Protection du reste de la maison', 'Plancher et murs remis d’aplomb'],
    image: {
      src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20220511_145711-p-800.jpg',
      alt: 'Salle de bain refaite avec bain, mur de céramique blanche et plancher de terrazzo',
      width: 800,
      height: 1067,
    },
  },
  {
    icon: Wrench,
    title: 'La plomberie et la ventilation',
    points: ['Douche, bain, toilette, vanité', 'Membrane étanche dans la douche', 'Ventilateur évacué vers l’extérieur'],
    image: {
      src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241018_153927-p-800.jpg',
      alt: 'Salle de bain avec douche d’angle vitrée, vanité blanche et murs foncés',
      width: 800,
      height: 1067,
    },
  },
  {
    icon: Droplets,
    title: 'La céramique et les finitions',
    points: ['Céramique au sol et aux murs', 'Vanité, miroir, robinetterie', 'Éclairage, prises et peinture'],
    image: {
      src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20220511_145731-p-800.jpg',
      alt: 'Vanité suspendue en bois, miroir rond et plancher de terrazzo',
      width: 800,
      height: 1067,
    },
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
    answer: 'Oui. Démolition, plomberie, ventilation, électricité, céramique et finitions sont coordonnées par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.',
  },
];

export default function RenovationSalleDeBainPub() {
  return (
    <PubLayout navItems={navItems}>
      {/* HERO */}
      <PubHero
        label="Entrepreneur en rénovation"
        title="Rénovation de salle de bain à Laval et dans les Laurentides"
        intro="Nous venons voir votre salle de bain, puis nous vous remettons votre soumission."
        badges={[
          { icon: Star, text: '19 avis Google 5 étoiles' },
          { icon: ShieldCheck, text: 'Licence RBQ : 8351-9033-59' },
        ]}
        action={<PubCTA service="renovation-salle-de-bain" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>}
        image={bathroomImages.hero}
        objectPosition="center 40%"
        thumbs={heroThumbs}
        thumbsLabel="Salles de bain réalisées"
      />

      <PubProofBar />

      {/* CE QUI EST INCLUS */}
      <section id="inclus" className="pub-section-grid scroll-mt-20 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-12 max-w-3xl"
            kicker="Ce qui est inclus"
            title="Une salle de bain refaite au complet, par une seule équipe"
            description="Vous n’avez pas à engager un plombier, un électricien et un céramiste chacun de leur côté. Nous nous occupons de tout."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {includedCards.map(({ icon: Icon, title, points, image }) => (
              <PubCard key={title}>
                <PubCardMedia src={image.src} alt={image.alt} width={image.width} height={image.height} />
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
        </div>
      </section>

      {/* COMMENT ÇA SE PASSE */}
      <section id="etapes" className="pub-section-muted scroll-mt-20 border-y border-border py-16 md:py-20">
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

      {/* LES FINITIONS */}
      <PubPhotoRow
        id="finitions"
        kicker="Les finitions"
        title="Le détail qui change une salle de bain"
        description="Ces trois photos viennent de salles de bain que nous avons livrées. Voici ce qu’on y remarque de près."
        items={detailPhotos}
      />

      {/* LA VISITE */}
      <section id="visite" className="pub-section-grid scroll-mt-20 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
            <div className="lg:col-span-7">
              <PubSectionHeader
                className="mb-8 max-w-xl"
                kicker="La visite"
                title="Ce que nous regardons chez vous"
                description="La visite est sans frais. Elle sert à chiffrer votre projet correctement."
              />
              <div className="pub-visit-points">
                {visitPoints.map((item) => (
                  <div key={item.title} className="pub-visit-point">
                    <h3 className="pub-visit-point__title">{item.title}</h3>
                    <p className="pub-visit-point__text">{item.text}</p>
                  </div>
                ))}
              </div>

              <PubChecklist
                className="pub-visit-checklist"
                icon={Lightbulb}
                title="À préparer pour la visite"
                items={visitChecklist}
              />
            </div>
            <div className="pub-visit-panel lg:col-span-5">
              <div className="pub-visit-panel__media aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto">
                <img src={bathroomImages.visit} alt="Douche vitrée avec grande céramique grise et robinetterie noire" width="1200" height="1600" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <PubReviews
        title="Ce que les propriétaires écrivent sur Google"
        description="19 avis Google, tous 5 étoiles. En voici trois, laissés par des clients de SLC Habitation."
        items={reviews}
      />

      {/* GALERIE */}
      <PubGallery
        id="realisations"
        surface="muted"
        kicker="Salles de bain réalisées"
        title="Des salles de bain terminées par notre équipe"
        description="Quelques projets menés de la démolition aux finitions, parmi les 500 réalisés depuis 25 ans."
        images={bathroomGallery}
      />

      {/* FAQ */}
      <section id="faq" className="pub-section-muted scroll-mt-20 py-16 md:py-20">
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

      {/* ZONE DESSERVIE */}
      <PubServiceArea
        cities={serviceCities}
        note="Votre municipalité n’est pas dans la liste? Écrivez-nous, nous vous dirons si nous nous déplaçons chez vous."
      />

      {/* CTA FOOTER */}
      <section data-sticky-hide className="pub-section-dark relative isolate overflow-hidden py-20 text-white md:py-24">
        <img
          src={bathroomImages.bright}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
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
