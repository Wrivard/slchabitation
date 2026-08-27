import { ShieldCheck, Star, Wallet, Clock, Phone, Mail, MapPin } from 'lucide-react';
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

/* Moyens de contact du bloc hérité que cette section remplace. */
const contactItems = [
  { icon: Phone, label: '(514) 404-8494', href: 'tel:5144048494', testId: 'link-soumission-phone' },
  {
    icon: Mail,
    label: 'slchabitation@gmail.com',
    href: 'mailto:slchabitation@gmail.com',
    testId: 'link-soumission-email',
  },
  { icon: MapPin, label: 'Saint-Eustache, QC', href: null, testId: 'text-soumission-address' },
];

/**
 * La section « Soumission en ligne » de la page héritée de Webflow : entête,
 * colonne de réassurance et formulaire progressif du tunnel publicitaire.
 *
 * Le formulaire occupe la colonne de droite en grand écran et passe en premier
 * sur mobile; la réassurance suit le défilement à côté de lui.
 *
 * La version statique de cette même section vit dans
 * `src/lib/soumission-form-slot.mjs` : toute modification visible ici doit y
 * être reportée pour que la page prérendue ne saute pas au montage.
 */
export function SoumissionQuoteForm({ defaultService = '' }: { defaultService?: string }) {
  return (
    <div className="soumission-quote-form" data-testid="section-soumission-form">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Le formulaire reste le point d'attention : premier sur mobile, à droite sur grand écran. */}
        <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7">
          <div className="soumission-quote-form__card rounded-lg border border-border bg-black p-6 text-white shadow-[0_24px_60px_-40px_rgb(0_0_0_/_0.45)] sm:p-8 md:p-10">
            <QuoteForm
              key={defaultService}
              services={soumissionServices}
              defaultService={defaultService}
              allowServiceChange
              allowPhotos
            />
          </div>
        </div>

        {/* Réassurance : reste visible à côté du formulaire pendant la saisie. */}
        <aside className="order-2 space-y-6 lg:sticky lg:top-24 lg:order-1 lg:col-span-6 xl:col-span-5">
          <ul className="grid grid-cols-2 gap-3" data-testid="list-form-trust">
            {trustItems.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-1 rounded-md border border-border/70 bg-white p-4">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>

          {/* Avis Google réel, déjà utilisé sur les pages du tunnel publicitaire. */}
          <figure className="soumission-quote-form__review testimonials-card" data-testid="quote-form-review">
            <div className="mb-2 flex gap-0.5 text-primary" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-base leading-relaxed text-foreground">
              « Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je
              recommande vivement! »
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <img
                src="/images/relume-657334.png"
                alt="Portrait d’Isabelle Baril"
                width="44"
                height="44"
                loading="lazy"
                className="h-11 w-11 rounded-full border border-border object-cover"
              />
              <span>Isabelle Baril — Avis Google</span>
            </figcaption>
          </figure>

          <div className="border border-border bg-muted p-5">
            <p className="text-sm text-muted-foreground">Vous préférez en parler de vive voix?</p>
            <ul className="mt-3 space-y-2">
              {contactItems.map(({ icon: Icon, label, href, testId }) => (
                <li key={label} className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  {href ? (
                    <a href={href} className="hover:text-primary" data-testid={testId}>
                      {label}
                    </a>
                  ) : (
                    <span data-testid={testId}>{label}</span>
                  )}
                </li>
              ))}
            </ul>
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
        </aside>
      </div>
    </div>
  );
}
