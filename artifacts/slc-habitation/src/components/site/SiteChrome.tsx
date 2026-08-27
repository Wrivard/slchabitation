import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { addAccessibleNames, siteFooterHtml, siteHeaderHtml } from './site-chrome-markup';
import { initSiteNav } from '@/lib/site-nav';

/**
 * Navbar et pied de page du site principal, réutilisés tels quels partout.
 *
 * Le balisage vient de `site-chrome-markup.ts`. Les pages du site principal
 * écrivent le leur directement dans leur composant ; ces composants servent aux
 * pages qui n'ont pas ce gabarit, comme le tunnel publicitaire et la page de
 * remerciement.
 */

/** Marque le lien de la page courante comme Webflow le ferait. */
function markCurrentLink(root: HTMLElement, pathname: string) {
  const links = root.querySelectorAll<HTMLAnchorElement>('a[href]');
  for (const link of links) {
    const href = link.getAttribute('href');
    const isCurrent = Boolean(href) && href === pathname;
    link.classList.toggle('w--current', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

export function SiteHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return initSiteNav(container);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    markCurrentLink(container, location);
  }, [location]);

  return (
    <div
      ref={containerRef}
      className="site-chrome site-chrome--header"
      data-testid="site-navbar"
      dangerouslySetInnerHTML={{ __html: addAccessibleNames(siteHeaderHtml) }}
    />
  );
}

export function SiteFooter({ stickyHide = false }: { stickyHide?: boolean }) {
  return (
    <div
      className="site-chrome site-chrome--footer"
      data-testid="site-footer"
      data-sticky-hide={stickyHide ? '' : undefined}
      dangerouslySetInnerHTML={{ __html: addAccessibleNames(siteFooterHtml) }}
    />
  );
}
