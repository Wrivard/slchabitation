import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, ImagePlus, X } from 'lucide-react';
import { Link } from 'wouter';
import { useTrackingParams } from '@/hooks/use-tracking-params';
import { TurnstileWidget } from '@/components/pub/TurnstileWidget';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    dataLayer: any[];
    Cookiebot?: {
      consent?: {
        marketing?: boolean;
      };
    };
  }
}

/* Le serveur n'accepte qu'une liste fermée de libellés de service : `label` est
   la valeur envoyée, `id` sert uniquement à l'affichage et à la validation
   locale. Toute entrée ajoutée ici doit exister dans `ALLOWED_SERVICES`
   (artifacts/api-server/src/routes/submit-form.ts), sinon l'envoi est rejeté. */
export interface QuoteFormService {
  id: string;
  label: string;
}

export const paidFunnelServices: QuoteFormService[] = [
  { id: 'renovation-sous-sol', label: 'Rénovation de sous-sol' },
  { id: 'renovation-salle-de-bain', label: 'Rénovation de salle de bain' },
  { id: 'renovation-cuisine', label: 'Rénovation de cuisine' },
  { id: 'agrandissement-maison', label: 'Agrandissement' },
];

/* Mêmes limites que celles annoncées par l'ancien formulaire de /soumission et
   appliquées par le serveur. */
export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const MAX_PHOTOS_TOTAL_BYTES = Math.round(4.5 * 1024 * 1024);

/* Le serveur refuse au-delà de 2 000 caractères : la limite est reprise ici
   pour que le visiteur le voie avant l'envoi. */
const MAX_DESCRIPTION_LENGTH = 2_000;

const createFormSchema = (serviceIds: string[]) =>
  z.object({
    service: z.string().refine((val) => serviceIds.includes(val), {
      message: "Veuillez sélectionner un type de travaux valide",
    }),
    budget: z.string().min(1, "Veuillez sélectionner un budget approximatif"),
    description: z
      .string()
      .min(10, "Veuillez décrire brièvement votre projet (min 10 caractères)")
      .max(MAX_DESCRIPTION_LENGTH, `La description ne peut pas dépasser ${MAX_DESCRIPTION_LENGTH} caractères`),
    city: z.string().min(1, "Veuillez indiquer la ville du projet"),
    timeline: z.string().min(1, "Veuillez indiquer quand vous souhaitez faire les travaux"),
    referral: z.string().optional(),
    firstName: z.string().min(2, "Le prénom est requis"),
    lastName: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Courriel invalide"),
    phone: z.string().min(10, "Numéro de téléphone invalide"),
    consent: z.boolean().refine((value) => value, {
      message: "Vous devez consentir pour envoyer la demande",
    }),
    honeypot: z.string().max(0).optional(),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

interface QuoteFormProps {
  defaultService?: string;
  className?: string;
  /** Services proposés à l'étape 1. Par défaut, les trois du tunnel publicitaire. */
  services?: QuoteFormService[];
  /** Ajoute le dépôt de photos du projet à l'étape 2. */
  allowPhotos?: boolean;
  /**
   * Garde le choix du service affiché même lorsqu'un service est présélectionné.
   * Les pages publicitaires masquent ce choix, car la page ne parle que d'un
   * service; la page de soumission le laisse visible pour que le visiteur
   * puisse corriger la présélection venue de l'adresse.
   */
  allowServiceChange?: boolean;
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(1).replace('.', ',')} Mo`;
}

/* Les neuf municipalités déjà annoncées sur le site, plus une sortie de secours
   pour les demandes qui viennent d'à côté. Les valeurs envoyées au serveur sont
   exactement ces libellés. */
const projectCities = [
  'Laval',
  'Saint-Eustache',
  'Terrebonne',
  'Sainte-Thérèse',
  'Rosemère',
  'Mirabel',
  'Boisbriand',
  'Blainville',
  'Saint-Jérôme',
  'Autre municipalité',
];

const projectTimelines = [
  'Dès que possible',
  'Dans les 3 prochains mois',
  'Dans 3 à 6 mois',
  'Dans plus de 6 mois',
  'Je ne sais pas encore',
];

const referralSources = [
  'Recherche Google',
  'Publicité en ligne',
  'Recommandation d’un proche',
  'Réseaux sociaux',
  'Nous avons déjà fait affaire ensemble',
  'Autre',
];

const budgetMap: Record<string, string> = {
  '25 000 $ et moins': 'Contact 6 Radio 1',
  '25 000 $ – 50 000 $': 'Contact 6 Radio 2',
  '50 000 $ – 100 000 $': 'Contact 6 Radio 3',
  '100 000 $ et plus': 'Contact 6 Radio 4',
};

const stepVariants = {
  hidden: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

export function QuoteForm({
  defaultService = "",
  className = "",
  services = paidFunnelServices,
  allowPhotos = false,
  allowServiceChange = false,
}: QuoteFormProps) {
  const showServiceChoice = allowServiceChange || !defaultService;
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const formSchema = useMemo(
    () => createFormSchema(services.map((service) => service.id)),
    [services],
  );

  const startedAt = useRef<number>(Date.now());
  const submissionId = useRef<string>(crypto.randomUUID());
  const formStarted = useRef(false);
  const turnstileResetRef = useRef<(() => void) | undefined>(undefined);
  const stepTwoHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepThreeHeadingRef = useRef<HTMLHeadingElement>(null);

  const getTrackingParams = useTrackingParams();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: defaultService,
      budget: "",
      description: "",
      city: "",
      timeline: "",
      referral: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      consent: false,
      honeypot: ""
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (!formStarted.current && (value.budget || value.description || value.firstName)) {
        formStarted.current = true;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'form_start', service: defaultService || 'formulaire', step: 1 });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, defaultService]);

  useEffect(() => {
    if (step === 2) stepTwoHeadingRef.current?.focus();
    if (step === 3) stepThreeHeadingRef.current?.focus();
  }, [step]);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileError(true);
  }, []);

  const handleTurnstileReset = useCallback((resetFn: () => void) => {
    turnstileResetRef.current = resetFn;
  }, []);

  const nextStep = async (fieldsToValidate: (keyof FormData)[]) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_step_complete', service: defaultService || 'formulaire', step });
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const addPhotos = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const accepted: File[] = [];
    let error: string | null = null;
    let totalSize = photos.reduce((total, photo) => total + photo.size, 0);

    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        error = `« ${file.name} » n’est pas une image. Formats acceptés : JPG, PNG, GIF, WEBP.`;
        continue;
      }
      if (photos.length + accepted.length >= MAX_PHOTOS) {
        error = `Vous pouvez joindre au maximum ${MAX_PHOTOS} photos.`;
        break;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        error = `« ${file.name} » pèse ${formatFileSize(file.size)} : chaque photo doit faire au plus ${formatFileSize(MAX_PHOTO_BYTES)}.`;
        continue;
      }
      if (totalSize + file.size > MAX_PHOTOS_TOTAL_BYTES) {
        error = `Le poids total des photos doit rester sous ${formatFileSize(MAX_PHOTOS_TOTAL_BYTES)}.`;
        continue;
      }
      accepted.push(file);
      totalSize += file.size;
    }

    if (accepted.length > 0) {
      setPhotos((previous) => [...previous, ...accepted]);
    }
    setPhotoError(error);

    // Permet de re-sélectionner le même fichier après un retrait.
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((previous) => previous.filter((_, position) => position !== index));
    setPhotoError(null);
  };

  const onSubmit = async (data: FormData) => {
    setErrorMsg(null);

    if (
      import.meta.env.PROD &&
      (!import.meta.env.VITE_TURNSTILE_SITE_KEY || !turnstileToken)
    ) {
      setErrorMsg("La vérification de sécurité est temporairement indisponible. Veuillez nous appeler ou réessayer plus tard.");
      return;
    }

    try {
      const payload = new window.FormData();
      payload.append('Contact-6-First-Name', data.firstName);
      payload.append('Contact-6-Last-Name', data.lastName);
      payload.append('Contact-6-Email', data.email);
      payload.append('Contact-6-Phone', data.phone);

      const exactService = services.find((service) => service.id === data.service)?.label;
      const exactBudget = budgetMap[data.budget];
      if (!exactService || !exactBudget) {
        setErrorMsg("Le service ou le budget sélectionné n'est pas valide.");
        return;
      }
      payload.append('Contact-6-Select', exactService);
      payload.append('Contact-6-Radio', exactBudget);

      payload.append('Contact-6-Message', data.description);

      /* Photos facultatives : le serveur les lit sous ce nom de champ et
         applique les mêmes limites que celles affichées au visiteur. */
      for (const photo of photos) {
        payload.append('Contact-6-Image', photo, photo.name);
      }

      /* Réponses ajoutées au formulaire : le serveur les accepte comme des
         compléments, une valeur absente ne bloque jamais l'envoi. */
      if (projectCities.includes(data.city)) {
        payload.append('project_city', data.city);
      }
      if (projectTimelines.includes(data.timeline)) {
        payload.append('project_timeline', data.timeline);
      }
      if (data.referral && referralSources.includes(data.referral)) {
        payload.append('referral_source', data.referral);
      }

      if (data.honeypot) {
        payload.append('company_website', data.honeypot);
      }

      payload.append('startedAt', startedAt.current.toString());
      payload.append('consent_contact', 'true');
      payload.append('consent_text', "Je consens à être contacté(e) concernant ma demande et j'accepte la politique de confidentialité.");
      payload.append('consent_version', '2026-08-25');
      const marketingConsent = window.Cookiebot?.consent?.marketing === true;
      payload.append('consent_marketing', String(marketingConsent));
      payload.append('consent_marketing_version', 'cookiebot-2026-08-25');
      payload.append('source_page', window.location.pathname);
      payload.append('submission_id', submissionId.current);

      // Tracking parameters
      const trackingParams = getTrackingParams();
      Object.entries(trackingParams).forEach(([key, val]) => {
        if (
          !marketingConsent &&
          ['gclid', 'gbraid', 'wbraid'].includes(key)
        ) {
          return;
        }
        payload.append(key, val);
      });

      if (turnstileToken) {
        payload.append('cf-turnstile-response', turnstileToken);
        payload.append('turnstileToken', turnstileToken);
      }

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Idempotency-Key': submissionId.current,
        },
        body: payload
      });

      const result = await response.json().catch(() => ({} as Record<string, any>));

      if (response.status === 413) {
        throw new Error(
          result.error?.message ||
            `Les photos jointes sont trop volumineuses. Retirez-en une ou réduisez leur poids (maximum ${formatFileSize(MAX_PHOTOS_TOTAL_BYTES)} au total).`,
        );
      }

      if (response.ok && result.success === true) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'quote_form_submit', service: defaultService || 'formulaire', step: 3 });
        setIsSuccess(true);
      } else {
        throw new Error(result.error?.message || result.message || "Une erreur inattendue est survenue.");
      }
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer la demande pour le moment.",
      );
      if (turnstileResetRef.current) {
        turnstileResetRef.current();
      }
      setTurnstileToken(null);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col items-center justify-center text-center py-12 ${className}`}
        data-testid="status-success"
      >
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 ring-8 ring-green-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-bold font-heading text-foreground mb-4">Demande envoyée</h3>
        <p className="text-lg text-muted-foreground mb-4 max-w-md">
          Merci de votre confiance. Nous examinons votre demande et nous vous répondons sous 48 heures pour convenir d’une visite d’évaluation sans frais.
        </p>
        <p className="text-base text-muted-foreground mb-10 max-w-md">
          Besoin de nous joindre avant?{' '}
          <a href="tel:5144048494" className="font-semibold text-primary" data-testid="link-success-phone">
            (514) 404-8494
          </a>
        </p>
        <Link
          href="/"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 rounded-none font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
          data-testid="button-return-home"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {/* Progress Indicator */}
      <div className="mb-10 relative" data-testid={`status-step-${step}`}>
        <div className="flex justify-between mb-2 relative z-10">
          {[
            { number: 1, label: 'Projet' },
            { number: 2, label: 'Détails' },
            { number: 3, label: 'Coordonnées' },
          ].map(({ number, label }) => (
            <div
              key={number}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                  step >= number
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-white border-border text-muted-foreground'
                }`}
              >
                {number}
              </span>
              <span className={`text-xs font-semibold ${step >= number ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border -z-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input
          type="text"
          {...register("honeypot")}
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          data-testid="input-honeypot"
        />

        <div className="overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">Quel est votre projet ?</h3>
                  <p className="text-muted-foreground">Aidez-nous à comprendre vos besoins initiaux.</p>
                </div>

                <div className="space-y-8">
                  {showServiceChoice && services.length > 4 && (
                    /* Au-delà de quatre services, la liste déroulante reste plus
                       lisible que des cartes à cocher, surtout sur mobile. */
                    <div className="space-y-3">
                      <label htmlFor="service" className="block text-sm font-bold text-foreground uppercase tracking-wider">
                        Type de travaux <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="service"
                        {...register("service")}
                        aria-invalid={errors.service ? 'true' : undefined}
                        aria-describedby={errors.service ? 'service-error' : undefined}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="select-service"
                      >
                        <option value="">Sélectionnez un service</option>
                        {services.map((svc) => (
                          <option key={svc.id} value={svc.id}>{svc.label}</option>
                        ))}
                      </select>
                      {errors.service && <p id="service-error" className="text-sm text-destructive" data-testid="error-service">{errors.service.message}</p>}
                    </div>
                  )}

                  {showServiceChoice && services.length <= 4 && (
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-foreground uppercase tracking-wider">Type de travaux <span className="text-destructive">*</span></label>
                      <div className="grid grid-cols-1 gap-3">
                        {services.map(svc => (
                          <label
                            key={svc.id}
                            className={`border rounded-none p-5 cursor-pointer transition-all flex items-center gap-4 group ${
                              watch('service') === svc.id
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-border hover:border-primary/40 hover:bg-accent/10'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${watch('service') === svc.id ? 'border-primary' : 'border-muted-foreground/40 group-hover:border-primary/50'}`}>
                              {watch('service') === svc.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                            <input type="radio" value={svc.id} {...register("service")} className="sr-only" data-testid={`radio-service-${svc.id}`} />
                            <span className="font-semibold text-foreground text-lg">{svc.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.service && <p className="text-sm text-destructive mt-2 flex items-center gap-1" data-testid="error-service"><Loader2 className="w-3 h-3" /> {errors.service.message}</p>}
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-foreground uppercase tracking-wider">Budget approximatif <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        '25 000 $ et moins',
                        '25 000 $ – 50 000 $',
                        '50 000 $ – 100 000 $',
                        '100 000 $ et plus'
                      ].map((b, idx) => (
                        <label
                          key={b}
                          className={`border rounded-none p-4 cursor-pointer transition-all flex items-center gap-3 group ${
                            watch('budget') === b
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:border-primary/40 hover:bg-accent/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${watch('budget') === b ? 'border-primary' : 'border-muted-foreground/40 group-hover:border-primary/50'}`}>
                            {watch('budget') === b && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <input type="radio" value={b} {...register("budget")} className="sr-only" data-testid={`radio-budget-${idx}`} />
                          <span className="font-medium text-foreground">{b}</span>
                        </label>
                      ))}
                    </div>
                    {errors.budget && <p className="text-sm text-destructive mt-2" data-testid="error-budget">{errors.budget.message}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={() => nextStep(['service', 'budget'])}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-none flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 mt-8 text-lg"
                    data-testid="button-next-step-1"
                  >
                    Continuer <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="mb-8">
                  <h3
                    ref={stepTwoHeadingRef}
                    tabIndex={-1}
                    className="text-3xl font-bold font-heading text-foreground mb-2 outline-none"
                  >
                    Parlez-nous de votre vision
                  </h3>
                  <p className="text-muted-foreground">Les détails nous aident à mieux préparer notre premier appel.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="description" className="block text-sm font-bold text-foreground uppercase tracking-wider">
                      Description de votre projet <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="description"
                      {...register("description")}
                      rows={6}
                      className="w-full p-5 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-accent/5 text-lg"
                      placeholder="Ex: Nous souhaitons abattre le mur entre la cuisine et le salon, et refaire l'îlot central pour créer un espace ouvert..."
                      data-testid="input-description"
                    ></textarea>
                    {errors.description && <p className="text-sm text-destructive mt-1" data-testid="error-description">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="city" className="block text-sm font-bold text-foreground uppercase tracking-wider">
                        Ville du projet <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="city"
                        {...register("city")}
                        aria-invalid={errors.city ? 'true' : undefined}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="select-city"
                      >
                        <option value="">Sélectionnez une ville</option>
                        {projectCities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && <p id="city-error" className="text-sm text-destructive" data-testid="error-city">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="timeline" className="block text-sm font-bold text-foreground uppercase tracking-wider">
                        Échéancier souhaité <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="timeline"
                        {...register("timeline")}
                        aria-invalid={errors.timeline ? 'true' : undefined}
                        aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="select-timeline"
                      >
                        <option value="">Sélectionnez un moment</option>
                        {projectTimelines.map((timeline) => (
                          <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                      {errors.timeline && <p id="timeline-error" className="text-sm text-destructive" data-testid="error-timeline">{errors.timeline.message}</p>}
                    </div>
                  </div>

                  {allowPhotos && (
                    <div className="space-y-3">
                      <label htmlFor="photos" className="block text-sm font-bold text-foreground uppercase tracking-wider">
                        Photos du projet <span className="font-medium normal-case tracking-normal text-muted-foreground">(facultatif)</span>
                      </label>
                      <div className="border border-dashed border-input bg-accent/5 p-5 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            disabled={photos.length >= MAX_PHOTOS}
                            className="inline-flex items-center gap-2 border border-border bg-white px-4 py-3 font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                            data-testid="button-add-photos"
                          >
                            <ImagePlus className="h-5 w-5" /> Ajouter des photos
                          </button>
                          <span className="text-sm text-muted-foreground" data-testid="text-photo-count">
                            {photos.length} / {MAX_PHOTOS} photo{photos.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <input
                          ref={photoInputRef}
                          id="photos"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={(event) => addPhotos(event.target.files)}
                          data-testid="input-photos"
                        />
                        {photos.length > 0 && (
                          <ul className="space-y-2" data-testid="list-photos">
                            {photos.map((photo, index) => (
                              <li
                                key={`${photo.name}-${index}`}
                                className="flex items-center justify-between gap-3 border border-border bg-white px-4 py-3"
                              >
                                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{photo.name}</span>
                                <span className="shrink-0 text-sm text-muted-foreground">{formatFileSize(photo.size)}</span>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                                  aria-label={`Retirer la photo ${photo.name}`}
                                  data-testid={`button-remove-photo-${index}`}
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, GIF ou WEBP — {formatFileSize(MAX_PHOTO_BYTES)} par photo, {MAX_PHOTOS} photos et {formatFileSize(MAX_PHOTOS_TOTAL_BYTES)} au total.
                        </p>
                        {photoError && (
                          <p className="text-sm text-destructive" role="alert" data-testid="error-photos">{photoError}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-16 h-16 shrink-0 bg-accent/70 hover:bg-accent text-foreground border border-border rounded-none flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-label="Retour"
                      data-testid="button-prev-step-2"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep(['description', 'city', 'timeline'])}
                      className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-none flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 text-lg"
                      data-testid="button-next-step-2"
                    >
                      Dernière étape <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full pb-2"
              >
                <div className="mb-8">
                  <h3
                    ref={stepThreeHeadingRef}
                    tabIndex={-1}
                    className="text-3xl font-bold font-heading text-foreground mb-2 outline-none"
                  >
                    Où pouvons-nous vous joindre ?
                  </h3>
                  <p className="text-muted-foreground">Vos coordonnées pour que nous puissions vous contacter.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-bold text-foreground uppercase tracking-wider">Prénom <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        id="firstName"
                        {...register("firstName")}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="input-firstname"
                      />
                      {errors.firstName && <p className="text-sm text-destructive" data-testid="error-firstname">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-bold text-foreground uppercase tracking-wider">Nom <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        id="lastName"
                        {...register("lastName")}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="input-lastname"
                      />
                      {errors.lastName && <p className="text-sm text-destructive" data-testid="error-lastname">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-foreground uppercase tracking-wider">Courriel <span className="text-destructive">*</span></label>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="input-email"
                      />
                      {errors.email && <p className="text-sm text-destructive" data-testid="error-email">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-bold text-foreground uppercase tracking-wider">Téléphone <span className="text-destructive">*</span></label>
                      <input
                        type="tel"
                        id="phone"
                        {...register("phone")}
                        className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                        data-testid="input-phone"
                      />
                      {errors.phone && <p className="text-sm text-destructive" data-testid="error-phone">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="referral" className="block text-sm font-bold text-foreground uppercase tracking-wider">
                      Comment nous avez-vous connus? <span className="font-medium normal-case tracking-normal text-muted-foreground">(facultatif)</span>
                    </label>
                    <select
                      id="referral"
                      {...register("referral")}
                      className="w-full p-4 rounded-none border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-accent/5 text-lg"
                      data-testid="select-referral"
                    >
                      <option value="">Préfère ne pas répondre</option>
                      {referralSources.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-4 cursor-pointer group bg-accent/5 p-4 rounded-none border border-transparent hover:border-primary/20 transition-colors">
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          {...register("consent")}
                          className="w-5 h-5 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
                          data-testid="checkbox-consent"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        Je consens à être contacté(e) concernant ma demande et j'accepte la <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary text-foreground font-medium transition-colors" data-testid="link-form-privacy">politique de confidentialité</a>. <span className="text-destructive">*</span>
                      </span>
                    </label>
                    {errors.consent && <p className="text-sm text-destructive mt-2 ml-9" data-testid="error-consent">{errors.consent.message}</p>}
                  </div>

                  <div className="flex justify-center py-2">
                    <TurnstileWidget
                      onVerify={handleTurnstileVerify}
                      onError={handleTurnstileError}
                      onResetRef={handleTurnstileReset}
                    />
                  </div>

                  {errorMsg && (
                    <div className="bg-destructive/10 text-destructive p-5 rounded-none text-sm border border-destructive/20 font-medium flex items-start gap-3" data-testid="status-error">
                      <div className="w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">!</div>
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-16 h-16 shrink-0 bg-accent/70 hover:bg-accent text-foreground border border-border rounded-none flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                      disabled={isSubmitting}
                      aria-label="Retour"
                      data-testid="button-prev-step-3"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || turnstileError}
                      className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-none flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 text-lg"
                      data-testid="button-submit-quote"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-6 h-6 animate-spin" /> Envoi en cours...</>
                      ) : (
                        <>Envoyer ma demande <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid="text-submit-reassurance">
                    Réponse sous 48 heures. La visite d’évaluation et l’estimation sont sans frais.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0,0,0,0.2);
        }
      `}} />
    </div>
  );
}