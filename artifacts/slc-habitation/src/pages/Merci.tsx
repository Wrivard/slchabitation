import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, Phone } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { paidFunnelServices } from '@/components/pub/QuoteForm';
import { soumissionServices } from '@/components/site/SoumissionQuoteForm';
import { consumeQuoteSubmission } from '@/lib/quote-submission';
import {
  merciContactTitle,
  merciContacts,
  merciHero,
  merciLinks,
  merciServiceNote,
  merciSteps,
  merciStepsTitle,
} from '@/lib/merci-content.mjs';

/* Le formulaire redirige avec `?service=<identifiant>` : la page affiche le
   libellé correspondant, jamais la valeur brute de l'adresse. */
const serviceLabels = new Map(
  [...soumissionServices, ...paidFunnelServices].map((service) => [service.id, service.label]),
);

function readServiceLabel(): string | null {
  if (typeof window === 'undefined') return null;
  const requested = new URLSearchParams(window.location.search).get('service') ?? '';
  return serviceLabels.get(requested) ?? null;
}

const contactIcons = { phone: Phone, email: Mail } as const;

/**
 * Page de confirmation affichée après l'envoi d'une demande de soumission.
 *
 * Elle sert deux buts : rassurer le visiteur (ce qui arrive ensuite, comment
 * nous joindre) et donner une adresse mesurable sur laquelle brancher la
 * conversion. L'événement n'est émis que si le marqueur de session posé par le
 * formulaire est présent : une visite directe ne compte pas.
 */
export default function Merci() {
  const prefersReducedMotion = useReducedMotion();
  const serviceLabel = useMemo(() => readServiceLabel(), []);
  const [conversionTracked, setConversionTracked] = useState(false);
  const hasCheckedMarker = useRef(false);

  useEffect(() => {
    // React monte deux fois en développement : le marqueur ne se lit qu'une fois.
    if (hasCheckedMarker.current) return;
    hasCheckedMarker.current = true;

    const submission = consumeQuoteSubmission();
    if (!submission) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'quote_form_conversion',
      service: submission.service || serviceLabel || 'formulaire',
      submission_id: submission.submissionId,
      ...(submission.paidPage ? { paid_page: submission.paidPage } : {}),
    });
    setConversionTracked(true);
  }, [serviceLabel]);

  const distance = prefersReducedMotion ? 0 : 24;
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="merci-shell flex min-h-[100dvh] flex-col bg-background font-sans text-foreground">
      <SiteHeader />

      <main className="flex-grow" data-conversion-tracked={conversionTracked ? 'true' : 'false'}>
        {/* Entête pleine largeur : photo de réalisation, voile sombre, texte lisible. */}
        <header className="relative flex min-h-[22rem] items-end overflow-hidden bg-secondary text-white md:min-h-[28rem]">
          <img
            src={merciHero.image.src}
            alt={merciHero.image.alt}
            width={merciHero.image.width}
            height={merciHero.image.height}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 45%' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/85 to-secondary/40"
          />
          <div className="relative mx-auto w-full max-w-5xl px-6 pb-14 pt-24 md:pb-20 md:pt-32">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {merciHero.kicker}
            </p>
            <h1
              className="mb-4 max-w-3xl font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
              data-testid="text-merci-title"
            >
              {merciHero.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {merciHero.intro}
            </p>
          </div>
        </header>

        {/* Bloc de remerciement : apparaît en fondu au chargement de la page. */}
        <motion.section
          className="bg-background py-16 md:py-24"
          initial="hidden"
          animate="visible"
          variants={container}
          aria-labelledby="merci-etapes"
          data-testid="section-merci"
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <motion.h2
                id="merci-etapes"
                className="font-heading text-2xl font-bold leading-tight text-foreground md:text-3xl"
                variants={item}
              >
                {merciStepsTitle}
              </motion.h2>

              {serviceLabel && (
                <motion.p
                  className="mt-4 text-base text-muted-foreground"
                  variants={item}
                  data-testid="text-merci-service"
                >
                  {merciServiceNote(serviceLabel)}
                </motion.p>
              )}

              <ol className="mt-8 space-y-6" data-testid="list-merci-steps">
                {merciSteps.map((step, index) => (
                  <motion.li key={step.title} className="flex gap-4" variants={item}>
                    <span
                      className="flex h-9 w-9 flex-none items-center justify-center border border-primary/30 bg-accent font-heading text-sm font-bold text-accent-foreground"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                        {step.text}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>

            <motion.aside className="lg:col-span-5" variants={item}>
              <div className="border border-border bg-white p-6 md:p-8">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  {merciContactTitle}
                </h2>
                <ul className="mt-5 space-y-4">
                  {merciContacts.map((contact) => {
                    const Icon = contactIcons[contact.kind as keyof typeof contactIcons];
                    return (
                      <li key={contact.href}>
                        <a
                          href={contact.href}
                          className="flex items-center gap-3 text-base font-semibold text-foreground hover:text-primary"
                          data-testid={contact.testId}
                        >
                          <Icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                          <span className="break-all">{contact.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 space-y-3 border-t border-border pt-6">
                  {merciLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between gap-3 text-base font-semibold text-foreground hover:text-primary"
                      data-testid={link.testId}
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 flex-none text-primary" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  );
}
