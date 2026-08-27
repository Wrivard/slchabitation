import { ReactNode } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { useTrackingParams } from '@/hooks/use-tracking-params';
import { PubStickyCTA } from './PubStickyCTA';
import { PubNavLinks, usePubActiveSection, type PubNavItem } from './PubShared';

/**
 * Gabarit des pages publicitaires.
 *
 * La navigation et le pied de page sont ceux du site principal, extraits du
 * gabarit legacy. La table des matières de la page reste propre au tunnel :
 * elle se colle juste sous la navbar et suit la section en cours de lecture.
 */
export function PubLayout({ children, navItems = [] }: { children: ReactNode; navItems?: PubNavItem[] }) {
  useTrackingParams(); // Initialize tracking params capture
  const activeSection = usePubActiveSection(navItems);

  return (
    <div className="pub-shell min-h-[100dvh] flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      {navItems.length > 0 && (
        <div className="pub-section-nav">
          <PubNavLinks items={navItems} active={activeSection} />
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <PubStickyCTA />

      <SiteFooter stickyHide />
    </div>
  );
}
