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
  Grid,
  Hammer,
  Lightbulb,
  MessageSquare,
  Ruler,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react';

const kitchenImages = {
  hero: {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg',
    alt: 'Cuisine rénovée avec îlot central, armoires en bois et salle à manger attenante',
    width: 1600,
    height: 1200,
  },
  visit: {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-1600.jpg',
    alt: 'Cuisine blanche avec îlot, dosseret en petits carreaux et grande fenêtre',
    width: 1600,
    height: 1200,
  },
};

const heroThumbs = [
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2023-ilot-bois-p-500.jpg',
    alt: 'Cuisine avec îlot en bois, armoires noires et comptoir clair',
    width: 500,
    height: 333,
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-500.jpg',
    alt: 'Cuisine blanche avec îlot et fenêtre donnant sur la cour',
    width: 500,
    height: 375,
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-500.jpg',
    alt: 'Cuisine avec îlot, armoires en bois et luminaires suspendus',
    width: 500,
    height: 375,
  },
];

const detailPhotos = [
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2023-ilot-bois-p-1600.jpg',
    alt: 'Cuisine avec îlot en bois, armoires noires, comptoir clair et suspensions',
    width: 1600,
    height: 1067,
    caption: 'Îlot et contraste des matériaux',
    text: 'Le bois de l’îlot, les armoires foncées et le comptoir clair créent un point central chaleureux.',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-1600.jpg',
    alt: 'Cuisine blanche avec fenêtre, évier sous la fenêtre et îlot central',
    width: 1600,
    height: 1200,
    caption: 'Lumière naturelle et espace de travail',
    text: 'La fenêtre éclaire le plan de travail et l’îlot garde une circulation pratique autour de la cuisine.',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg',
    alt: 'Cuisine avec armoires en bois, îlot central, dosseret en pierre et salle à manger',
    width: 1600,
    height: 1200,
    caption: 'Cuisine et salle à manger coordonnées',
    text: 'Les armoires, le dosseret et le plancher prolongent la cuisine jusque dans l’espace repas.',
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
    quote:
      'Excellente compagnie, service professionnel et soucis du détails! Merci a votre équipe pour vos bon conseil. Je recommande a tous pour la réalisation de vos projet!',
    author: 'Mélodie Binette',
  },
  {
    quote: 'Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!',
    author: 'Isabelle Baril',
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

const kitchenGallery = [
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2023-ilot-bois-p-1600.jpg',
    alt: 'Cuisine avec îlot en bois, armoires noires et comptoir clair',
    caption: 'Îlot en bois et armoires noires',
    category: 'Rénovation de cuisine',
    project: 'Îlot et rangement',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2026-salle-a-manger-p-1600.jpg',
    alt: 'Cuisine avec îlot central, armoires en bois et salle à manger attenante',
    caption: 'Cuisine et salle à manger',
    category: 'Rénovation de cuisine',
    project: 'Projet cuisine et repas',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/cuisine-2018-fenetre-p-1600.jpg',
    alt: 'Cuisine blanche avec fenêtre, îlot central et dosseret en petits carreaux',
    caption: 'Cuisine blanche et fenêtre',
    category: 'Rénovation de cuisine',
    project: 'Cuisine lumineuse',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/2403-p-1600.jpg',
    alt: 'Détail d’une cuisine avec éclairage sous les armoires',
    caption: 'Éclairage de travail sous les armoires',
    category: 'Rénovation de cuisine',
    project: 'Éclairage de travail',
  },
];

const includedCards = [
  {
    icon: Hammer,
    title: 'La démolition et la préparation',
    points: ['Retrait de l’ancienne cuisine', 'Protection des pièces voisines', 'Murs et planchers remis d’aplomb'],
    image: {
      src: '/images/INT%C3%89RIEUR/Cuisine/20221021_145939-p-800.jpg',
      alt: 'Cuisine refaite avec hotte au-dessus de l’îlot et armoires deux tons',
      width: 800,
      height: 1067,
    },
  },
  {
    icon: Wrench,
    title: 'La plomberie et l’électricité',
    points: ['Évier, lave-vaisselle, hotte', 'Prises, éclairage, îlot', 'Ventilation vers l’extérieur'],
    image: {
      src: '/images/INT%C3%89RIEUR/Cuisine/20250106_124707-p-800.jpg',
      alt: 'Cuisine blanche avec cuisinière, hotte encastrée et électroménagers en inox',
      width: 800,
      height: 1067,
    },
  },
  {
    icon: Grid,
    title: 'Les armoires et les finitions',
    points: ['Armoires, comptoirs, dosseret', 'Plancher et peinture', 'Poignées, moulures, retouches'],
    image: {
      src: '/images/INT%C3%89RIEUR/Cuisine/cuisine%20st%20jerome%20apres.png',
      alt: 'Cuisine rénovée à Saint-Jérôme avec armoires claires et comptoir contrastant',
      width: 940,
      height: 788,
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
    answer: 'Oui. Démolition, plomberie, électricité, armoires, comptoirs, plancher et finitions sont coordonnés par notre équipe. SLC Habitation détient la licence RBQ 8351-9033-59 et cumule 25 ans d’expérience.',
  },
];

export default function RenovationCuisinePub() {
  return (
    <PubLayout navItems={navItems}>
      {/* HERO */}
      <PubHero
        label="Entrepreneur en rénovation"
        title="Rénovation de cuisine à Laval et dans les Laurentides"
        intro="Nous venons voir votre cuisine, puis nous vous remettons votre soumission."
        badges={[
          { icon: Star, text: '19 avis Google 5 étoiles' },
          { icon: ShieldCheck, text: 'Licence RBQ : 8351-9033-59' },
        ]}
        action={<PubCTA service="renovation-cuisine" size="lg" testId="button-hero-cta">Obtenir ma soumission sans frais</PubCTA>}
        image={kitchenImages.hero}
        objectPosition="center 30%"
        thumbs={heroThumbs}
        thumbsLabel="Cuisines réalisées"
      />

      <PubProofBar />

      {/* CE QUI EST INCLUS */}
      <section id="inclus" className="pub-section-grid scroll-mt-20 py-16 md:py-20">
        <div className="container-large mx-auto max-w-7xl px-6">
          <PubSectionHeader
            className="mb-12 max-w-3xl"
            kicker="Ce qui est inclus"
            title="Une cuisine refaite au complet, par une seule équipe"
            description="Vous n’avez pas à engager un plombier, un électricien et un menuisier chacun de leur côté. Nous nous occupons de tout."
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
            action={<PubCTA service="renovation-cuisine" testId="button-inclus-cta">Obtenir ma soumission sans frais</PubCTA>}
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
            action={<PubCTA service="renovation-cuisine" testId="button-etapes-cta">Obtenir ma soumission sans frais</PubCTA>}
          />
        </div>
      </section>

      {/* LES FINITIONS */}
      <PubPhotoRow
        id="finitions"
        kicker="Les finitions"
        title="Le détail qui change une cuisine"
        description="Ces trois photos viennent de cuisines que nous avons livrées. Voici ce qu’on y remarque de près."
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
                  src={kitchenImages.visit.src}
                  alt={kitchenImages.visit.alt}
                  width={kitchenImages.visit.width}
                  height={kitchenImages.visit.height}
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
        kicker="Cuisines réalisées"
        title="Des cuisines terminées par notre équipe"
        description="Quelques projets menés du plan aux finitions, parmi les 500 réalisés depuis 25 ans."
        images={kitchenGallery}
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
