import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Phone } from 'lucide-react';
import { useTrackingParams } from '@/hooks/use-tracking-params';
import { PubCTA } from './PubCTA';

export function PubLayout({ children }: { children: ReactNode }) {
  useTrackingParams(); // Initialize tracking params capture

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header className="py-4 px-6 md:px-12 grid grid-cols-2 items-center border-b border-border bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-start">
          <div className="inline-block" data-testid="img-brand-logo">
            <img
              src="/images/relume-567884.png"
              alt="SLC Habitation"
              className="h-10 md:h-12 w-[140px] md:w-[180px] object-contain object-left"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <a
            href="tel:5144048494"
            className="inline-flex items-center justify-center lg:hidden w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            data-testid="link-phone-mobile"
            aria-label="Appeler SLC Habitation au 514 404-8494"
            onClick={() => {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ event: 'phone_click' });
            }}
          >
            <Phone className="w-5 h-5" />
          </a>
          <a
            href="tel:5144048494"
            className="hidden lg:inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors text-lg"
            data-testid="link-phone"
            onClick={() => {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ event: 'phone_click' });
            }}
          >
            <Phone className="w-5 h-5 text-primary" />
            <span>(514) 404-8494</span>
          </a>
          <PubCTA service="" className="shadow-none hidden sm:flex">
            Obtenir une soumission
          </PubCTA>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="py-16 px-6 md:px-12 bg-secondary text-secondary-foreground">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <img
              src="/images/Logo.svg"
              alt="SLC Habitation"
              className="h-10 md:h-12 brightness-0 invert opacity-90 object-contain object-left"
            />
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs">
              Studio de rénovation résidentielle desservant Laval et les Laurentides avec une approche attentive à chaque projet.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Contact</h4>
            <div className="space-y-4 text-secondary-foreground/80">
              <a href="tel:5144048494" className="flex items-center gap-3 hover:text-white transition-colors w-fit">
                <Phone className="w-4 h-4 text-primary" />
                <span>(514) 404-8494</span>
              </a>
              <p className="flex items-start gap-3">
                <span className="text-primary mt-1">RBQ</span>
                <span>8351-9033-59</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li>Rénovation de sous-sol</li>
              <li>Rénovation de salle de bain</li>
              <li>Rénovation de cuisine</li>
              <li>Agrandissement</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Légal</h4>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li>
                <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors" data-testid="link-privacy">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/politique-de-cookie" className="hover:text-white transition-colors" data-testid="link-cookies">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} SLC Habitation. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
