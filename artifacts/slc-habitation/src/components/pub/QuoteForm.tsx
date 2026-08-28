import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  X,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { useTrackingParams } from '@/hooks/use-tracking-params';
import { rememberQuoteSubmission } from '@/lib/quote-submission';
import { TurnstileWidget, type TurnstileStatus } from '@/components/pub/TurnstileWidget';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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

const budgetOptions = [
  '25 000 $ et moins',
  '25 000 $ – 50 000 $',
  '50 000 $ – 100 000 $',
  '100 000 $ et plus',
];

const budgetMap: Record<string, string> = {
  '25 000 $ et moins': 'Contact 6 Radio 1',
  '25 000 $ – 50 000 $': 'Contact 6 Radio 2',
  '50 000 $ – 100 000 $': 'Contact 6 Radio 3',
  '100 000 $ et plus': 'Contact 6 Radio 4',
};

const steps = [
  { number: 1, label: 'Projet' },
  { number: 2, label: 'Détails' },
  { number: 3, label: 'Coordonnées' },
];

/* Habillage commun aux champs : hauteur confortable au doigt, bordure qui
   réagit au survol, anneau de focus visible au clavier et bordure rouge dès
   que react-hook-form marque le champ invalide. */
const fieldClass =
  'h-12 rounded-md border-input bg-white px-4 text-base shadow-none transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive';

const selectTriggerClass =
  'h-12 rounded-md border-input bg-white px-4 text-base shadow-none transition-colors hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/40 aria-[invalid=true]:border-destructive';

const labelClass = 'text-xs font-bold uppercase tracking-[0.12em] text-foreground';

const optionalHintClass = 'ml-1 font-medium normal-case tracking-normal text-muted-foreground';

/* Carte de choix : la sélection et le focus clavier se lisent d'un coup d'œil
   grâce à l'état du bouton radio qu'elle contient. */
const choiceCardClass =
  'quote-form-choice flex cursor-pointer items-center gap-3 rounded-md border border-border bg-white p-4 text-base transition-[background-color,border-color,box-shadow,color] duration-200 ease-out hover:border-primary/60 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-white has-[[data-state=checked]]:shadow-[0_12px_28px_-18px_hsl(var(--primary))] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2';

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
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>('loading');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const prefersReducedMotion = useReducedMotion();

  const formSchema = useMemo(
    () => createFormSchema(services.map((service) => service.id)),
    [services],
  );

  const startedAt = useRef<number>(Date.now());
  const submissionId = useRef<string>(crypto.randomUUID());
  const formStarted = useRef(false);
  const turnstileResetRef = useRef<(() => void) | undefined>(undefined);
  const shellRef = useRef<HTMLDivElement>(null);
  const stepHeadingRefs = [
    useRef<HTMLHeadingElement>(null),
    useRef<HTMLHeadingElement>(null),
    useRef<HTMLHeadingElement>(null),
  ];

  const getTrackingParams = useTrackingParams();
  const [, navigate] = useLocation();

  const form = useForm<FormData>({
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

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const descriptionLength = watch('description')?.length ?? 0;

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

  /* Changement d'étape : le formulaire revient sous les yeux du visiteur et le
     titre de la nouvelle étape prend le focus pour les lecteurs d'écran. */
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    shellRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    stepHeadingRefs[step - 1]?.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, prefersReducedMotion]);

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

  const handleTurnstileStatusChange = useCallback((status: TurnstileStatus) => {
    setTurnstileStatus(status);
    if (status === 'unavailable') {
      setTurnstileToken(null);
    }
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
      !turnstileToken
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
      payload.append('project_city', data.city);
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

        /* La conversion se mesure sur `/merci` : le marqueur dit à cette page
           qu'une demande vient réellement d'être envoyée. */
        rememberQuoteSubmission({
          submittedAt: Date.now(),
          submissionId: submissionId.current,
          service: exactService,
          paidPage: trackingParams.paid_page,
        });

        /* L'écran de confirmation reste affiché en repli : si la navigation
           n'aboutit pas, le visiteur voit quand même que c'est parti. */
        setIsSuccess(true);
        navigate(`/merci?service=${encodeURIComponent(data.service)}`);
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

  const stepVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        hidden: { opacity: 0, x: 16, transition: { duration: 0.24, ease: 'easeOut' } },
        visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: 'easeOut' } },
        exit: { opacity: 0, x: -16, transition: { duration: 0.18, ease: 'easeIn' } },
      };

  if (isSuccess) {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
        data-testid="status-success"
      >
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/50">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="mb-4 font-heading text-3xl font-bold text-foreground">Demande envoyée</h3>
        <p className="mb-4 max-w-md text-lg text-muted-foreground">
          Merci de votre confiance. Nous examinons votre demande et nous vous répondons sous 48 heures pour convenir d’une visite d’évaluation sans frais.
        </p>
        <p className="mb-10 max-w-md text-base text-muted-foreground">
          Besoin de nous joindre avant?{' '}
          <a href="tel:5144048494" className="font-semibold text-primary" data-testid="link-success-phone">
            (514) 404-8494
          </a>
        </p>
        <Button asChild variant="secondary" size="lg" className="h-12 px-8 text-base font-semibold">
          <Link href="/" data-testid="button-return-home">
            Retour à l'accueil
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div ref={shellRef} className={`scroll-mt-28 ${className}`}>
      {/* Progression : étape courante, barre de remplissage et repères nommés. */}
      <div className="mb-8" data-testid={`status-step-${step}`}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Étape {step} sur {steps.length}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {steps.length - step === 0
              ? 'Dernière étape'
              : `Encore ${steps.length - step} étape${steps.length - step > 1 ? 's' : ''}`}
          </p>
        </div>
        <Progress
          value={(step / steps.length) * 100}
          className="mt-3 h-1.5 bg-muted"
          aria-label={`Étape ${step} sur ${steps.length}`}
        />
        <ol className="mt-3 grid grid-cols-3 gap-2">
          {steps.map(({ number, label }) => (
            <li
              key={number}
              className={`text-xs font-semibold ${
                step >= number ? 'text-foreground' : 'text-muted-foreground'
              } ${number === 2 ? 'text-center' : ''} ${number === 3 ? 'text-right' : ''}`}
              aria-current={step === number ? 'step' : undefined}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input
            type="text"
            {...register("honeypot")}
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            data-testid="input-honeypot"
          />

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full will-change-transform"
                  aria-live="polite"
                >
                  <div className="mb-8">
                    <h3
                      ref={stepHeadingRefs[0]}
                      tabIndex={-1}
                      className="mb-2 font-heading text-2xl font-bold text-foreground outline-none md:text-3xl"
                    >
                      Quel est votre projet ?
                    </h3>
                    <p className="text-muted-foreground">Aidez-nous à comprendre vos besoins initiaux.</p>
                  </div>

                  <div className="space-y-8">
                    {showServiceChoice && services.length > 4 && (
                      /* Au-delà de quatre services, la liste déroulante reste plus
                         lisible que des cartes à cocher, surtout sur mobile. */
                      <FormField
                        control={control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Type de travaux <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className={selectTriggerClass} data-testid="select-service">
                                  <SelectValue placeholder="Sélectionnez un service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services.map((svc) => (
                                  <SelectItem key={svc.id} value={svc.id} className="text-base">
                                    {svc.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage data-testid="error-service" />
                          </FormItem>
                        )}
                      />
                    )}

                    {showServiceChoice && services.length <= 4 && (
                      <FormField
                        control={control}
                        name="service"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            {/* Titre du groupe : un `span` plutôt qu'un `label`, sinon
                                chaque carte imbriquerait un label dans un autre. */}
                            <span
                              id="service-group-label"
                              className={cn('block', labelClass, fieldState.error && 'text-destructive')}
                            >
                              Type de travaux <span className="text-destructive">*</span>
                            </span>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-labelledby="service-group-label"
                                className="grid grid-cols-1 gap-3"
                              >
                                {services.map((svc) => (
                                  <Label
                                    key={svc.id}
                                    htmlFor={`service-${svc.id}`}
                                    className={`${choiceCardClass} p-5 font-semibold`}
                                  >
                                    <RadioGroupItem
                                      value={svc.id}
                                      id={`service-${svc.id}`}
                                      className="h-5 w-5 shrink-0 border-muted-foreground/50 data-[state=checked]:border-primary"
                                      data-testid={`radio-service-${svc.id}`}
                                    />
                                    <span className="text-lg">{svc.label}</span>
                                  </Label>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage data-testid="error-service" />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={control}
                      name="budget"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <span
                            id="budget-group-label"
                            className={cn('block', labelClass, fieldState.error && 'text-destructive')}
                          >
                            Budget approximatif <span className="text-destructive">*</span>
                          </span>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              aria-labelledby="budget-group-label"
                              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                            >
                              {budgetOptions.map((budget, index) => (
                                <Label
                                  key={budget}
                                  htmlFor={`budget-${index}`}
                                  className={`${choiceCardClass} font-medium`}
                                >
                                  <RadioGroupItem
                                    value={budget}
                                    id={`budget-${index}`}
                                    className="h-5 w-5 shrink-0 border-muted-foreground/50 data-[state=checked]:border-primary"
                                    data-testid={`radio-budget-${index}`}
                                  />
                                  <span>{budget}</span>
                                </Label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage data-testid="error-budget" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      size="lg"
                      onClick={() => nextStep(['service', 'budget'])}
                      className="mt-2 h-14 w-full text-base font-bold"
                      data-testid="button-next-step-1"
                    >
                      Continuer <ArrowRight className="h-5 w-5" />
                    </Button>
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
                  className="w-full will-change-transform"
                  aria-live="polite"
                >
                  <div className="mb-8">
                    <h3
                      ref={stepHeadingRefs[1]}
                      tabIndex={-1}
                      className="mb-2 font-heading text-2xl font-bold text-foreground outline-none md:text-3xl"
                    >
                      Parlez-nous de votre vision
                    </h3>
                    <p className="text-muted-foreground">Les détails nous aident à mieux préparer notre premier appel.</p>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Description de votre projet <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              maxLength={MAX_DESCRIPTION_LENGTH}
                              placeholder="Ex: Nous souhaitons abattre le mur entre la cuisine et le salon, et refaire l'îlot central pour créer un espace ouvert..."
                              className="min-h-[10rem] resize-y rounded-md border-input bg-white p-4 text-base shadow-none transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
                              data-testid="input-description"
                            />
                          </FormControl>
                          <div className="flex items-start justify-between gap-4">
                            <FormMessage data-testid="error-description" />
                            <FormDescription
                              className={`ml-auto shrink-0 tabular-nums ${
                                descriptionLength > MAX_DESCRIPTION_LENGTH - 100 ? 'text-destructive' : ''
                              }`}
                            >
                              {descriptionLength} / {MAX_DESCRIPTION_LENGTH}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Ville du projet <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ''}
                                placeholder="Ex. Saint-Eustache"
                                className={selectTriggerClass}
                                data-testid="input-city"
                              />
                            </FormControl>
                            <FormMessage data-testid="error-city" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Échéancier souhaité <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className={selectTriggerClass} data-testid="select-timeline">
                                  <SelectValue placeholder="Sélectionnez un moment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {projectTimelines.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline} className="text-base">
                                    {timeline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage data-testid="error-timeline" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {allowPhotos && (
                      <div className="space-y-2">
                        <label htmlFor="photos" className={`block ${labelClass}`}>
                          Photos du projet <span className={optionalHintClass}>(facultatif)</span>
                        </label>
                        <div className="space-y-4 rounded-md border border-dashed border-input bg-muted/50 p-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => photoInputRef.current?.click()}
                              disabled={photos.length >= MAX_PHOTOS}
                              className="h-11 bg-white px-4 text-base font-semibold"
                              data-testid="button-add-photos"
                            >
                              <ImagePlus className="h-5 w-5" /> Ajouter des photos
                            </Button>
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
                                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-white px-4 py-3"
                                >
                                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{photo.name}</span>
                                  <span className="shrink-0 text-sm text-muted-foreground">{formatFileSize(photo.size)}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePhoto(index)}
                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                    aria-label={`Retirer la photo ${photo.name}`}
                                    data-testid={`button-remove-photo-${index}`}
                                  >
                                    <X className="h-5 w-5" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, GIF ou WEBP — {formatFileSize(MAX_PHOTO_BYTES)} par photo, {MAX_PHOTOS} photos et {formatFileSize(MAX_PHOTOS_TOTAL_BYTES)} au total.
                          </p>
                          {photoError && (
                            <p
                              className="flex items-start gap-2 text-sm font-medium text-destructive"
                              role="alert"
                              data-testid="error-photos"
                            >
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                              {photoError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={prevStep}
                        className="h-14 w-14 shrink-0 bg-white"
                        aria-label="Retour à l’étape précédente"
                        data-testid="button-prev-step-2"
                      >
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        onClick={() => nextStep(['description', 'city', 'timeline'])}
                        className="h-14 flex-1 text-base font-bold"
                        data-testid="button-next-step-2"
                      >
                        Dernière étape <ArrowRight className="h-5 w-5" />
                      </Button>
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
                  className="w-full pb-2 will-change-transform"
                  aria-live="polite"
                >
                  <div className="mb-8">
                    <h3
                      ref={stepHeadingRefs[2]}
                      tabIndex={-1}
                      className="mb-2 font-heading text-2xl font-bold text-foreground outline-none md:text-3xl"
                    >
                      Où pouvons-nous vous joindre ?
                    </h3>
                    <p className="text-muted-foreground">Vos coordonnées pour que nous puissions vous contacter.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Prénom <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                autoComplete="given-name"
                                className={fieldClass}
                                data-testid="input-firstname"
                              />
                            </FormControl>
                            <FormMessage data-testid="error-firstname" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Nom <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                autoComplete="family-name"
                                className={fieldClass}
                                data-testid="input-lastname"
                              />
                            </FormControl>
                            <FormMessage data-testid="error-lastname" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Courriel <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                className={fieldClass}
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage data-testid="error-email" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>
                              Téléphone <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                className={fieldClass}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage data-testid="error-phone" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={control}
                      name="referral"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Comment nous avez-vous connus?
                            <span className={optionalHintClass}>(facultatif)</span>
                          </FormLabel>
                          <Select value={field.value ?? ''} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className={selectTriggerClass} data-testid="select-referral">
                                <SelectValue placeholder="Préfère ne pas répondre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {referralSources.map((source) => (
                                <SelectItem key={source} value={source} className="text-base">
                                  {source}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel
                            htmlFor="consent"
                            className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-muted/50 p-4 text-sm font-normal leading-relaxed text-muted-foreground transition-colors hover:border-primary/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2"
                          >
                            <FormControl>
                              <Checkbox
                                id="consent"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5 h-5 w-5 shrink-0 border-muted-foreground/50 data-[state=checked]:border-primary"
                                data-testid="checkbox-consent"
                              />
                            </FormControl>
                            <span>
                              Je consens à être contacté(e) concernant ma demande et j'accepte la{' '}
                              <a
                                href="/politique-de-confidentialite"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-foreground underline transition-colors hover:text-primary"
                                data-testid="link-form-privacy"
                              >
                                politique de confidentialité
                              </a>
                              . <span className="text-destructive">*</span>
                            </span>
                          </FormLabel>
                          <FormMessage data-testid="error-consent" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center">
                      <TurnstileWidget
                        onVerify={handleTurnstileVerify}
                        onError={handleTurnstileError}
                        onResetRef={handleTurnstileReset}
                        onStatusChange={handleTurnstileStatusChange}
                      />
                    </div>

                    {import.meta.env.PROD && turnstileStatus === 'unavailable' && (
                      <p
                        className="text-center text-sm font-medium text-destructive"
                        role="status"
                        data-testid="turnstile-status"
                      >
                        La vérification de sécurité est temporairement indisponible. Veuillez réessayer plus tard.
                      </p>
                    )}

                    {errorMsg && (
                      <div
                        className="flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive"
                        role="alert"
                        data-testid="status-error"
                      >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={prevStep}
                        disabled={isSubmitting}
                        className="h-14 w-14 shrink-0 bg-white"
                        aria-label="Retour à l’étape précédente"
                        data-testid="button-prev-step-3"
                      >
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={
                          isSubmitting ||
                          (import.meta.env.PROD &&
                            (turnstileStatus !== 'ready' || turnstileError))
                        }
                        className="h-14 flex-1 text-base font-bold"
                        data-testid="button-submit-quote"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer ma demande <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                    <p
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                      data-testid="text-submit-reassurance"
                    >
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      Réponse sous 48 heures. La visite d’évaluation et l’estimation sont sans frais.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Form>
    </div>
  );
}
