import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Phone } from 'lucide-react';
import { useTrackingParams } from '@/hooks/use-tracking-params';

export function PubLayout({ children }: { children: ReactNode }) {
  useTrackingParams(); // Initialize tracking params capture

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-border bg-white sticky top-0 z-50">
        <div className="inline-block" data-testid="img-brand-logo">
          <img src="/images/relume-567884.png" alt="SLC Habitation" className="h-10 w-auto" width="76" height="44" />
        </div>
        <a 
          href="tel:5144048494" 
          className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors text-lg"
          data-testid="link-phone"
          onClick={() => {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'phone_click' });
          }}
        >
          <Phone className="w-5 h-5 hidden sm:inline-block" />
          <span>(514) 404-8494</span>
        </a>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="py-12 px-6 md:px-12 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <img src="/images/relume-567884.png" alt="SLC Habitation" className="h-8 mb-4 brightness-0 invert opacity-80 mx-auto md:mx-0" width="76" height="44" />
            <p className="text-sm text-muted-foreground mb-1">© {new Date().getFullYear()} SLC Habitation. Tous droits réservés.</p>
            <p className="text-sm text-muted-foreground font-medium text-white/70">Licence RBQ : 8351-9033-59</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted-foreground">
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors" data-testid="link-privacy">
              Politique de confidentialité
            </Link>
            <p className="text-center md:text-right max-w-xs mt-2">
              Entrepreneur en rénovation résidentielle desservant Laval et les Laurentides.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
