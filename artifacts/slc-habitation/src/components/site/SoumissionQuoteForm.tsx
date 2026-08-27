import { ShieldCheck, Star, Wallet, Clock, Phone } from 'lucide-react';
import { QuoteForm, type QuoteFormService } from '@/components/pub/QuoteForm';

/* Les services historiquement proposés sur /soumission. Les libellés sont
   ceux envoyés au serveur : ils doivent exister dans `ALLOWED_SERVICES`
   (artifacts/api-server/src/routes/submit-form.ts). */
export const soumissionServices: QuoteFormService[] = [
  { id: 'renovation-cuisine', label: 'Rénovation de cuisine' },
  { id: 'renovation-salle-de-bain', label: 'Rénovation de salle de bain' },
  { id: 'renovation-sous-sol', label: 'Rénovation de sous-sol' },
  { id: 'travaux-exterieurs', label: 'Travaux extérieurs' },
  { id: 'agrandissement', label: 'Agrandissement' },
  { id: 'construction-neuve', label: 'Construction neuve' },
  { id: 'construction-garage', label: 'Construction de garage' },
  { id: 'commercial', label: 'Projet commercial' },
  { id: 'industriel', label: 'Projet industriel' },
];

/* Faits déjà annoncés ailleurs sur le site : aucune promesse nouvelle. */
const trustItems = [
  { icon: Clock, title: 'Réponse sous 48 h', text: 'Du lundi au vendredi' },
  { icon: Wallet, title: 'Estimation sans frais', text: 'Visite comprise' },
  { icon: Star, title: '19 avis Google', text: 'Tous 5 étoiles' },
  { icon: ShieldCheck, title: 'Licence RBQ', text: '8351-9033-59' },
];

/**
 * Le formulaire progressif du tunnel publicitaire, entouré des repères de
 * confiance, tel qu'il est monté dans la page /soumission héritée de Webflow.
 *
 * La version statique de cette même section vit dans
 * `src/lib/soumission-form-slot.mjs` : toute modification visible ici doit y
 * être reportée pour que la page prérendue ne saute pas au montage.
 */
export function SoumissionQuoteForm() {
  return (
    <div className="soumission-quote-form space-y-6" data-testid="section-soumission-form">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="list-form-trust">
        {trustItems.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col gap-1 border border-border/60 bg-white p-4">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>

      <div className="border border-border bg-white p-6 sm:p-8">
        <QuoteForm services={soumissionServices} allowPhotos />
      </div>

      {/* Avis Google réel, déjà utilisé sur les pages du tunnel publicitaire. */}
      <figure className="border border-border bg-muted p-5" data-testid="quote-form-review">
        <div className="mb-2 flex gap-0.5 text-primary" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <blockquote className="text-base leading-relaxed text-foreground">
          « Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je
          recommande vivement! »
        </blockquote>
        <figcaption className="mt-2 text-sm text-muted-foreground">
          Isabelle Baril — Avis Google
        </figcaption>
      </figure>

      <div className="border border-border bg-muted p-5">
        <p className="text-sm text-muted-foreground">Vous préférez en parler de vive voix?</p>
        <a
          href="tel:5144048494"
          className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary"
          data-testid="link-soumission-phone"
        >
          <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
          (514) 404-8494
        </a>
      </div>

      <p className="text-sm text-muted-foreground" data-testid="text-form-privacy">
        Vos renseignements servent uniquement à préparer votre soumission. Ils ne sont ni vendus ni
        transmis à un tiers.{' '}
        <a
          href="/politique-de-confidentialite"
          className="underline hover:text-primary"
          data-testid="link-soumission-privacy"
        >
          Politique de confidentialité
        </a>
        .
      </p>
    </div>
  );
}
