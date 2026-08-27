import { PubLayout } from '@/components/pub/PubLayout';
import { QuoteForm } from '@/components/pub/QuoteForm';
import { FAQ, FAQList } from '@/components/pub/FAQ';
import { PubGallery, PubSectionHeader, PubTestimonial } from '@/components/pub/PubShared';
import { ShieldCheck, Star, Wallet, Phone } from 'lucide-react';
import { useLocation } from 'wouter';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

/* Trois faits seulement : l'entête annonce déjà le délai de réponse et la
   gratuité de la visite, inutile de les répéter mot pour mot juste en dessous. */
const trustItems = [
  { icon: ShieldCheck, title: 'Licence RBQ', text: '8351-9033-59' },
  { icon: Star, title: '19 avis Google', text: 'Tous 5 étoiles' },
  { icon: Wallet, title: 'Estimation sans frais', text: 'Visite comprise' },
];

const formGallery = [
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20250920_190401-p-1600.jpg',
    alt: 'Salle de bain lumineuse avec douche vitrée, bain et céramique blanche',
    width: 1600,
    height: 1200,
    category: 'Rénovation de salle de bain',
    project: 'Douche vitrée',
  },
  {
    src: '/images/relume-657406.jpeg',
    alt: 'Espace de vie au sous-sol avec grande cuisine, plancher en vinyle et fenêtres basses',
    width: 2048,
    height: 1536,
    category: 'Rénovation de sous-sol',
    project: 'Aire de vie et cuisine',
  },
  {
    src: '/images/INT%C3%89RIEUR/Cuisine/corinne%202-p-1600.jpg',
    alt: 'Cuisine avec îlot en bois, rangements blancs et suspensions',
    width: 1600,
    height: 2133,
    category: 'Rénovation de cuisine',
    project: 'Îlot en bois',
  },
  {
    src: '/images/INT%C3%89RIEUR/Salle%20de%20Bain/20241219_152819-p-1600.jpg',
    alt: 'Salle de bain aux murs foncés avec douche en céramique',
    width: 1600,
    height: 2133,
    category: 'Rénovation de salle de bain',
    project: 'Palette foncée',
  },
];

const faqs: { question: string; answer: string }[] = [
  {
    question: 'Que se passe-t-il après l’envoi du formulaire?',
    answer:
      'Nous vous répondons sous 48 heures et nous convenons d’une visite sans frais. Votre soumission est préparée à partir de cette visite.',
  },
  {
    question: 'Quand les travaux peuvent-ils commencer?',
    answer:
      'L’échéancier vous est donné après la visite, avec votre soumission. Il dépend de l’ampleur des travaux et de nos disponibilités.',
  },
  {
    question: 'Est-ce que la soumission est payante?',
    answer:
      'Non. La visite et l’estimation sont sans frais. SLC Habitation détient la licence RBQ 8351-9033-59.',
  },
];

export default function FormulairePub() {
  const [location] = useLocation();

  const defaultService = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const validServices = [
      'renovation-sous-sol',
      'renovation-salle-de-bain',
      'renovation-cuisine',
      'agrandissement-maison',
    ];
    return validServices.includes(serviceParam || '') ? serviceParam! : '';
  }, [location]);

  return (
    <PubLayout>
      {/* ENTÊTE : photo en arrière-plan, titre et repères de confiance */}
      <section className="pub-form-hero" data-testid="section-form-hero">
        <img
          src="/images/relume-655417.jpeg"
          alt=""
          aria-hidden="true"
          width={2560}
          height={1920}
          fetchPriority="high"
          className="pub-form-hero__image"
        />
        <div className="pub-form-hero__scrim" aria-hidden="true" />
        <div className="pub-form-hero__inner">
          <p className="pub-form-hero__label">Demande de soumission</p>
          <h1 className="pub-form-hero__title">Parlons de votre projet de rénovation</h1>
          <p className="pub-form-hero__intro">
            Dites-nous ce que vous voulez rénover à Laval ou dans les Laurentides. Nous vous répondons sous
            48 heures. La visite et l’estimation sont sans frais.
          </p>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="formulaire" className="pub-form-section scroll-mt-20 bg-background py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Le formulaire reste le point d'attention : premier sur mobile, à droite sur grand écran. */}
            <motion.div
              className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="border border-border bg-white p-6 sm:p-8 md:p-10">
                <QuoteForm key={defaultService} defaultService={defaultService} />
              </div>
            </motion.div>

            {/* Réassurance : faits déjà utilisés partout dans le parcours publicitaire. */}
            <div className="order-2 space-y-8 lg:order-1 lg:col-span-6 xl:col-span-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {trustItems.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex flex-col gap-2 border border-border/60 bg-white p-5">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <p className="text-base font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              {/* Avis Google réel : la preuve remplace la description des étapes,
                  déjà visible dans l'indicateur en haut du formulaire. */}
              <PubTestimonial
                quote="Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement!"
                author="Isabelle Baril"
                role="Avis Google"
              />

              <div className="border border-border bg-muted p-5">
                <p className="text-sm text-muted-foreground">
                  Vous préférez en parler de vive voix?
                </p>
                <a
                  href="tel:5144048494"
                  className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary"
                  data-testid="link-form-phone"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: 'phone_click' });
                  }}
                >
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  (514) 404-8494
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉALISATIONS : même composition portfolio que les pages de service. */}
      <PubGallery
        id="realisations"
        kicker="Réalisations"
        title="Des projets terminés par notre équipe"
        description="Cuisine, salle de bain ou sous-sol : découvrez quelques réalisations parmi les 500 projets menés depuis 25 ans."
        images={formGallery}
      />

      {/* QUESTIONS FRÉQUENTES : section complète, sous le formulaire */}
      <section id="faq" className="pub-section-muted scroll-mt-20 py-16 md:py-20">
        <div className="container-large mx-auto max-w-4xl px-6">
          <PubSectionHeader
            className="mx-auto mb-12 max-w-3xl text-center"
            kicker="Questions fréquentes"
            title="Ce que les propriétaires nous demandent"
          />
          <FAQList>
            {faqs.map((faq) => (
              <FAQ key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </FAQList>
        </div>
      </section>
    </PubLayout>
  );
}
