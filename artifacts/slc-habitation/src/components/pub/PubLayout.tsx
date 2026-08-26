import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Phone } from 'lucide-react';
import { useTrackingParams } from '@/hooks/use-tracking-params';
import { PubCTA } from './PubCTA';
import { PubStickyCTA } from './PubStickyCTA';

export function PubLayout({ children }: { children: ReactNode }) {
  useTrackingParams(); // Initialize tracking params capture

  return (
    <div className="pub-shell min-h-[100dvh] flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header
        className="pub-site-header border-b border-border bg-background sticky top-0 z-50"
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
      >
        <div className="pub-site-header__logo" data-testid="img-brand-logo">
          <img
            src="/images/relume-567884.png"
            alt="SLC Habitation"
            className="h-8 md:h-10 w-auto object-contain object-left max-w-[120px] md:max-w-[160px]"
          />
        </div>

        <div
          className="pub-site-header__actions"
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <a
            href="tel:5144048494"
            className="pub-site-header__phone font-semibold text-foreground hover:text-primary transition-colors !no-underline"
            data-testid="link-phone"
            onClick={() => {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ event: 'phone_click' });
            }}
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="hidden sm:inline">(514) 404-8494</span>
          </a>
          <PubCTA service="" className="pub-site-header__cta shadow-none !no-underline h-auto min-h-0">
            <span className="hidden sm:inline">Obtenir une soumission</span>
            <span className="sm:hidden">Soumission</span>
          </PubCTA>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <PubStickyCTA />

      <footer data-sticky-hide className="pub-footer bg-secondary px-6 py-14 text-white md:px-12 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
          <div className="col-span-2 lg:col-span-1">
            <img
              src="/images/relume-567884.png"
              alt="SLC Habitation"
              width={320}
              height={107}
              className="mb-5 h-9 w-auto object-contain object-left brightness-0 invert"
            />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Studio de rénovation résidentielle desservant Laval et les Laurentides avec une approche attentive à chaque projet.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60" data-testid="text-footer-territoire">
              Laval, Saint-Eustache, Terrebonne, Sainte-Thérèse, Rosemère, Mirabel, Boisbriand, Blainville et Saint-Jérôme.
            </p>
          </div>

          <div>
            <h4 className="pub-footer__title">Contact</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a href="tel:5144048494" className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>(514) 404-8494</span>
                </a>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="shrink-0 font-semibold text-primary">RBQ</span>
                <span>8351-9033-59</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="pub-footer__title">Services</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>Rénovation de sous-sol</li>
              <li>Rénovation de salle de bain</li>
              <li>Rénovation de cuisine</li>
              <li>Agrandissement</li>
            </ul>
          </div>

          <div>
            <h4 className="pub-footer__title">Légal</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <Link href="/politique-de-confidentialite" data-testid="link-privacy">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/politique-de-cookie" data-testid="link-cookies">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} SLC Habitation. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
