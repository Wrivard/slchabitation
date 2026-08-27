import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import {
  PubSectionHeader,
  PubActionBar,
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
  CalendarCheck,
  Check,
  ClipboardCheck,
  Hammer,
  Home,
  Lightbulb,
  MessageSquare,
  Paintbrush,
  Ruler,
  ShieldCheck,
  Star,
} from 'lucide-react';

/* Toutes les photos viennent de chantiers déjà photographiés pour le site :
   agrandissements terminés, ajouts d'étage en construction et raccords de
   toiture. Aucune image de banque, aucune image d'un autre type de projet. */
const extensionImages = {
  hero: {
    src: '/images/upscale-house-1-min-1-p-1600.webp',
    alt: 'Maison agrandie à l’arrière avec un volume contemporain vitré, éclairé en soirée',
    width: 1600,
    height: 1044,
  },
  visit: {
    src: '/images/relume-655499-p-1600.jpeg',
    alt: 'Maison agrandie à l’arrière avec grandes portes vitrées et terrasse de bois',
    width: 1600,
    height: 2133,
  },
};

const heroThumbs = [
  {
    src: '/images/ajout-etage-01-p-500.jpeg',
    alt: 'Chantier d’ajout d’étage : charpente montée au-dessus d’une maison en hiver',
    width: 500,
    height: 375,
  },
  {
    src: '/images/relume-655431-p-500.jpeg',
    alt: 'Agrandissement terminé avec revêtement de bois et de métal',
    width: 500,
    height: 779,
  },
  {
    src: '/images/relume-655499-p-500.jpeg',
    alt: 'Agrandissement à l’arrière d’une maison avec terrasse de bois',
    width: 500,
    height: 667,
  },
];

const detailPhotos = [
  {
    src: '/images/relume-655431-p-1600.jpeg',
    alt: 'Façade d’un agrandissement avec revêtement de bois, panneaux foncés et grandes fenêtres',
    width: 1600,
    height: 2493,
    caption: 'Le revêtement et les ouvertures',
    text: 'Les matériaux et les fenêtres de l’ajout suivent les lignes de la maison pour que le volume reste dans le même ton.',
  },
  {
    src: '/images/relume-655434-p-1600.jpeg',
    alt: 'Étage ajouté vu de l’intérieur, plafond mansardé refermé et plancher de bois protégé',
    width: 1600,
    height: 1200,
    caption: 'L’étage ajouté avant la peinture',
    text: 'À l’intérieur, le nouvel espace est fermé, isolé et prêt pour le plancher, la peinture et les moulures.',
  },
  {
    src: '/images/relume-655496-p-1600.jpeg',
    alt: 'Toiture et lucarnes refaites au-dessus d’une maison en pierre pendant les travaux',
    width: 1600,
    height: 1200,
    caption: 'Le raccord de toiture',
    text: 'La toiture et les lucarnes sont reprises pour que le raccord reste étanche et que l’eau s’écoule au bon endroit.',
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

/* L'avis de Johanne Duguay parle d'un agrandissement : il ouvre la section. */
const reviews = [
  {
    quote:
      'Magnifique travail de l’équipe SLC Habitation. Nous avions un projet complexe d’agrandissement et de rénovation d’une vieille maison avec plusieurs défis! Ils ont fait un travail exceptionnel!!! Un gros merci pour votre patience et votre professionnalisme! Je recommande sans hésiter!',
    author: 'Johanne Duguay',
  },
  {
    quote:
      'Excellente compagnie, service professionnel et soucis du détails! Merci a votre équipe pour vos bon conseil. Je recommande a tous pour la réalisation de vos projet!',
    author: 'Mélodie Binette',
  },
  {
    quote: 'Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!',
    author: 'Isabelle Baril',
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

const extensionGallery = [
  {
    src: '/images/upscale-house-1-min-1-p-1600.webp',
    alt: 'Maison agrandie à l’arrière avec un volume contemporain vitré',
    width: 1600,
    height: 1044,
    caption: 'Agrandissement contemporain à l’arrière',
    category: 'Agrandissement',
    project: 'Volume vitré à l’arrière',
  },
  {
    src: '/images/relume-655431-p-1600.jpeg',
    alt: 'Agrandissement terminé avec revêtement de bois et de métal',
    width: 1600,
    height: 2493,
    caption: 'Revêtement de bois et de métal',
    category: 'Agrandissement',
    project: 'Extension deux étages',
  },
  {
    src: '/images/relume-655496-p-1600.jpeg',
    alt: 'Toiture et lucarnes refaites sur une maison en pierre',
    width: 1600,
    height: 1200,
    caption: 'Toiture et lucarnes reprises',
    category: 'Agrandissement',
    project: 'Toiture et lucarnes',
  },
  {
    src: '/images/relume-655499-p-1600.jpeg',
    alt: 'Agrandissement à l’arrière d’une maison avec portes vitrées et terrasse',
    width: 1600,
    height: 2133,
    caption: 'Pièce ajoutée ouverte sur la cour',
    category: 'Agrandissement',
    project: 'Extension et terrasse',
  },
];

const includedCards = [
  {
    icon: Hammer,
    title: 'La fondation et la structure',
    points: ['Fondation ou dalle selon le projet', 'Charpente de l’agrandissement', 'Ouverture du mur existant'],
    image: {
      src: '/images/ajout-etage-01-p-800.jpeg',
      alt: 'Charpente d’un ajout d’étage montée au-dessus d’une maison en hiver',
      width: 800,
      height: 600,
    },
  },
  {
    icon: Home,
    title: 'L’enveloppe et la toiture',
    points: ['Toiture raccordée à l’existant', 'Isolation, pare-air et fenêtres', 'Revêtement extérieur'],
    image: {
      src: '/images/relume-655441-p-800.jpeg',
      alt: 'Chantier résidentiel : murs recouverts de pare-air avant la pose du revêtement',
      width: 800,
      height: 1066,
    },
  },
  {
    icon: Paintbrush,
    title: 'Les finitions, dedans comme dehors',
    points: ['Plomberie et électricité de l’ajout', 'Gypse, plancher, peinture', 'Raccords avec les pièces existantes'],
    image: {
      src: '/images/relume-655431-p-800.jpeg',
      alt: 'Agrandissement terminé avec revêtement de bois et de métal',
      width: 800,
      height: 1247,
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
    text: 'La visite est sans frais. Nous regardons la maison, le terrain et l’espace que vous voulez gagner.',
  },
  {
    icon: ClipboardCheck,
    title: 'Vous recevez votre soumission',
    text: 'Les travaux prévus y sont détaillés. La soumission est sans frais.',
  },
  {
    icon: CalendarCheck,
    title: 'On réalise les travaux',
    text: 'Une équipe, un ordre de travail clair, de la fondation aux finitions.',
  },
];

const visitPoints = [
  { title: 'Le terrain', text: 'L’espace autour de la maison, la pente et les accès pour la machinerie.' },
  { title: 'La structure existante', text: 'Le mur à ouvrir, la fondation en place et ce qui soutient la maison.' },
  { title: 'La toiture', text: 'Comment le nouveau toit se raccorde à l’ancien et où l’eau s’écoule.' },
  { title: 'Les services', text: 'L’électricité, la plomberie et le chauffage à prolonger dans le nouvel espace.' },
];

const visitChecklist = [
  'L’usage que vous voulez donner à l’espace ajouté',
  'Le certificat de localisation, si vous l’avez',
  'Des photos ou des idées que vous aimez',
  'Votre budget approximatif',
];

const faqs = [
  {
    question: 'Combien coûte un agrandissement de maison?',
    answer:
      'Le prix dépend de la superficie ajoutée, du type de fondation, de la toiture et des finitions choisies. Nous venons voir la maison et le terrain, puis nous vous remettons une soumission détaillée. La visite et l’estimation sont sans frais.',
  },
  {
    question: 'Combien de temps durent les travaux?',
    answer:
      'Cela varie d’un projet à l’autre. Nous vous donnons l’échéancier avec votre soumission, une fois la visite faite.',
  },
  {
    question: 'Faut-il un permis de la municipalité?',
    answer:
      'Un agrandissement demande presque toujours un permis, et les règles changent d’une municipalité à l’autre. Nous en parlons pendant la visite et nous vous disons ce qui doit être obtenu avant le début des travaux.',
  },
  {
    question: 'Peut-on ajouter un étage plutôt qu’agrandir au sol?',
    answer:
      'C’est possible dans bien des cas, quand la fondation et la structure peuvent porter un étage de plus. C’est l’un des points que nous vérifions pendant la visite.',
  },
  {
    question: 'Est-ce que vous vous occupez de tout?',
    answer:
      'Oui. Fondation, charpente, toiture, revêtement, plomberie, électricité et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.',
  },
];

export default function AgrandissementPub() {
  return (
    <PubLayout navItems={navItems}>
      {/* HERO */}
      <PubHero
        label="Entrepreneur en agrandissement"
        title="Agrandissement de maison à Laval et dans les Laurentides"
        intro="Nous venons voir votre maison et votre terrain, puis nous vous remettons votre soumission."
        badges={[
          { icon: Star, text: '19 avis Google 5 étoiles' },
          { icon: ShieldCheck, text: 'Licence RBQ : 8351-9033-59' },
        ]}
        action={<PubCTA service="agrandissement-maison" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>}
        image={extensionImages.hero}
        objectPosition="center 55%"
        thumbs={heroThumbs}
        thumbsLabel="Agrandissements réalisés"
      />

      <PubProofBar />

      {/* CE QUI EST INCLUS */}
      <section id="inclus" className="pub-section-grid scroll-mt-20 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-12 max-w-3xl"
            kicker="Ce qui est inclus"
            title="Un agrandissement mené de la fondation aux finitions, par une seule équipe"
            description="Vous n’avez pas à engager un excavateur, un charpentier, un couvreur et un finisseur chacun de leur côté. Nous nous occupons de tout."
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
            action={<PubCTA service="agrandissement-maison" testId="button-inclus-cta">Obtenir ma soumission sans frais</PubCTA>}
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
            note="Plus de 500 projets complétés depuis 25 ans."
            action={<PubCTA service="agrandissement-maison" testId="button-etapes-cta">Obtenir ma soumission sans frais</PubCTA>}
          />
        </div>
      </section>

      {/* LES FINITIONS */}
      <PubPhotoRow
        id="finitions"
        kicker="Les finitions"
        title="Un ajout qui ne se voit pas comme un ajout"
        description="Ces trois photos viennent de chantiers d’agrandissement. Voici ce qu’on y remarque de près."
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
                <img
                  src={extensionImages.visit.src}
                  alt={extensionImages.visit.alt}
                  width={extensionImages.visit.width}
                  height={extensionImages.visit.height}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
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
        kicker="Agrandissements réalisés"
        title="Des agrandissements terminés par notre équipe"
        description="Quelques projets menés de la fondation aux finitions, parmi les 500 réalisés depuis 25 ans."
        images={extensionGallery}
      />

      {/* FAQ */}
      <section id="faq" className="pub-section-muted scroll-mt-20 py-16 md:py-20">
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

      {/* ZONE DESSERVIE */}
      <PubServiceArea
        cities={serviceCities}
        note="Votre municipalité n’est pas dans la liste? Écrivez-nous, nous vous dirons si nous nous déplaçons chez vous."
      />

      {/* CTA FOOTER */}
      <section data-sticky-hide className="pub-section-dark relative isolate overflow-hidden py-20 text-white md:py-24">
        <img
          src={extensionImages.hero.src}
          alt=""
          aria-hidden="true"
          width={extensionImages.hero.width}
          height={extensionImages.hero.height}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-secondary/85" />
        <div className="container-large relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-primary">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-5 font-bold">Prêt à recevoir votre soumission?</h2>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-gray-200 md:text-[1.0625rem]">Dites-nous l’espace que vous voulez gagner. Réponse sous 48 heures, visite sans frais.</p>
          <PubCTA service="agrandissement-maison" size="lg" testId="button-bottom-cta">Demander ma soumission sans frais</PubCTA>
        </div>
      </section>
    </PubLayout>
  );
}
