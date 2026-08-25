import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';
import { useTrackingParams } from '@/hooks/use-tracking-params';
import { TurnstileWidget } from '@/components/pub/TurnstileWidget';

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

const formSchema = z.object({
  service: z.string().min(1, "Veuillez sélectionner un type de travaux"),
  budget: z.string().min(1, "Veuillez sélectionner un budget approximatif"),
  description: z.string().min(10, "Veuillez décrire brièvement votre projet (min 10 caractères)"),
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Courriel invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  consent: z.boolean().refine((value) => value, {
    message: "Vous devez consentir pour envoyer la demande",
  }),
  honeypot: z.string().max(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface QuoteFormProps {
  defaultService?: string;
  className?: string;
}

const serviceMap: Record<string, string> = {
  'renovation-sous-sol': 'Rénovation de sous-sol',
  'renovation-salle-de-bain': 'Rénovation de salle de bain',
  'renovation-cuisine': 'Rénovation de cuisine',
};

const budgetMap: Record<string, string> = {
  '25 000 $ et moins': 'Contact 6 Radio 1',
  '25 000 $ – 50 000 $': 'Contact 6 Radio 2',
  '50 000 $ – 100 000 $': 'Contact 6 Radio 3',
  '100 000 $ et plus': 'Contact 6 Radio 4',
};

export function QuoteForm({ defaultService = "", className = "" }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  
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
      
      const exactService = serviceMap[data.service];
      const exactBudget = budgetMap[data.budget];
      if (!exactService || !exactBudget) {
        setErrorMsg("Le service ou le budget sélectionné n'est pas valide.");
        return;
      }
      payload.append('Contact-6-Select', exactService);
      payload.append('Contact-6-Radio', exactBudget);
      
      payload.append('Contact-6-Message', data.description);
      
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

      const result = await response.json().catch(() => ({}));

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
      <div className={`bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg border border-border flex flex-col items-center ${className}`} data-testid="status-success">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-foreground mb-4">Demande envoyée avec succès</h3>
        <p className="text-muted-foreground mb-6">
          Merci de votre confiance. Notre équipe examinera vos informations et vous contactera rapidement pour discuter de votre projet.
        </p>
        <Link
          href="/"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg font-semibold transition-colors"
          data-testid="button-return-home"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-border p-6 md:p-8 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8 relative" data-testid={`status-step-${step}`}>
        <div className="flex justify-between mb-2 relative z-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                step >= s 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-white border-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-0">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out"
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

        {/* STEP 1: Qualification */}
        <div className={step === 1 ? 'block' : 'hidden'}>
          <h3 className="text-2xl font-bold font-heading text-foreground mb-6">Quel est votre projet ?</h3>
          
          <div className="space-y-6">
            {!defaultService && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Type de travaux <span className="text-destructive">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'renovation-sous-sol', label: 'Rénovation de sous-sol' },
                    { id: 'renovation-salle-de-bain', label: 'Rénovation de salle de bain' },
                    { id: 'renovation-cuisine', label: 'Rénovation de cuisine' },
                  ].map(svc => (
                    <label 
                      key={svc.id} 
                      className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                        watch('service') === svc.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input type="radio" value={svc.id} {...register("service")} className="w-4 h-4 text-primary focus:ring-primary" data-testid={`radio-service-${svc.id}`} />
                      <span className="font-medium">{svc.label}</span>
                    </label>
                  ))}
                </div>
                {errors.service && <p className="text-sm text-destructive mt-1" data-testid="error-service">{errors.service.message}</p>}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Budget approximatif <span className="text-destructive">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '25 000 $ et moins',
                  '25 000 $ – 50 000 $',
                  '50 000 $ – 100 000 $',
                  '100 000 $ et plus'
                ].map((b, idx) => (
                  <label 
                    key={b} 
                    className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                      watch('budget') === b ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input type="radio" value={b} {...register("budget")} className="w-4 h-4 text-primary focus:ring-primary" data-testid={`radio-budget-${idx}`} />
                    <span className="font-medium">{b}</span>
                  </label>
                ))}
              </div>
              {errors.budget && <p className="text-sm text-destructive mt-1" data-testid="error-budget">{errors.budget.message}</p>}
            </div>

            <button 
              type="button" 
              onClick={() => nextStep(['service', 'budget'])}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-8"
              data-testid="button-next-step-1"
            >
              Continuer <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 2: Project Details */}
        <div className={step === 2 ? 'block' : 'hidden'}>
          <h3
            ref={stepTwoHeadingRef}
            tabIndex={-1}
            className="text-2xl font-bold font-heading text-foreground mb-6 outline-none"
          >
            Parlez-nous de votre vision
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="description" className="block text-sm font-semibold text-foreground">
                Description brève de votre projet <span className="text-destructive">*</span>
              </label>
              <p className="text-sm text-muted-foreground mb-2">Mentionnez ce qui doit être changé, conservé ou amélioré.</p>
              <textarea 
                id="description" 
                {...register("description")} 
                rows={5}
                className="w-full p-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-background/50"
                placeholder="Ex: Nous souhaitons abattre le mur entre la cuisine et le salon, et refaire l'îlot central..."
                data-testid="input-description"
              ></textarea>
              {errors.description && <p className="text-sm text-destructive mt-1" data-testid="error-description">{errors.description.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={prevStep}
                className="w-14 h-14 shrink-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl flex items-center justify-center transition-colors"
                aria-label="Retour"
                data-testid="button-prev-step-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button 
                type="button" 
                onClick={() => nextStep(['description'])}
                className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                data-testid="button-next-step-2"
              >
                Dernière étape <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* STEP 3: Contact */}
        <div className={step === 3 ? 'block' : 'hidden'}>
          <h3
            ref={stepThreeHeadingRef}
            tabIndex={-1}
            className="text-2xl font-bold font-heading text-foreground mb-6 outline-none"
          >
            Où pouvons-nous vous joindre ?
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">Prénom <span className="text-destructive">*</span></label>
                <input 
                  type="text" 
                  id="firstName" 
                  {...register("firstName")} 
                  className="w-full p-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-background/50" 
                  data-testid="input-firstname"
                />
                {errors.firstName && <p className="text-sm text-destructive" data-testid="error-firstname">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-foreground">Nom <span className="text-destructive">*</span></label>
                <input 
                  type="text" 
                  id="lastName" 
                  {...register("lastName")} 
                  className="w-full p-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-background/50" 
                  data-testid="input-lastname"
                />
                {errors.lastName && <p className="text-sm text-destructive" data-testid="error-lastname">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">Courriel <span className="text-destructive">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  {...register("email")} 
                  className="w-full p-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-background/50" 
                  data-testid="input-email"
                />
                {errors.email && <p className="text-sm text-destructive" data-testid="error-email">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground">Téléphone <span className="text-destructive">*</span></label>
                <input 
                  type="tel" 
                  id="phone" 
                  {...register("phone")} 
                  className="w-full p-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-background/50" 
                  data-testid="input-phone"
                />
                {errors.phone && <p className="text-sm text-destructive" data-testid="error-phone">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="pt-1">
                  <input 
                    type="checkbox" 
                    {...register("consent")} 
                    className="w-5 h-5 rounded border-input text-primary focus:ring-primary cursor-pointer" 
                    data-testid="checkbox-consent"
                  />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Je consens à être contacté(e) concernant ma demande et j'accepte la <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" data-testid="link-form-privacy">politique de confidentialité</a>. <span className="text-destructive">*</span>
                </span>
              </label>
              {errors.consent && <p className="text-sm text-destructive mt-1 ml-8" data-testid="error-consent">{errors.consent.message}</p>}
            </div>

            <div className="flex justify-center">
              <TurnstileWidget 
                onVerify={handleTurnstileVerify}
                onError={handleTurnstileError}
                onResetRef={handleTurnstileReset}
              />
            </div>

            {errorMsg && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm border border-destructive/20 font-medium" data-testid="status-error">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={prevStep}
                className="w-14 h-14 shrink-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                disabled={isSubmitting}
                aria-label="Retour"
                data-testid="button-prev-step-3"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || turnstileError}
                className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                data-testid="button-submit-quote"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                ) : (
                  <>Envoyer ma demande <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}