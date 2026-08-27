import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { siteFooterHtml, siteHeaderHtml } from '@/generated/site-chrome';
import { initSiteNav } from '@/lib/site-nav';

/**
 * Navbar et pied de page du site principal, réutilisés tels quels partout.
 *
 * Le balisage vient de `src/generated/site-chrome.ts`, extrait du gabarit
 * legacy au moment du build. Les pages qui embarquent déjà `webflow.js`
 * gardent leur copie interne ; ces composants servent aux pages React qui ne
 * chargent pas le script legacy, comme le tunnel publicitaire.
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
      dangerouslySetInnerHTML={{ __html: siteHeaderHtml }}
    />
  );
}

export function SiteFooter({ stickyHide = false }: { stickyHide?: boolean }) {
  return (
    <div
      className="site-chrome site-chrome--footer"
      data-testid="site-footer"
      data-sticky-hide={stickyHide ? '' : undefined}
      dangerouslySetInnerHTML={{ __html: siteFooterHtml }}
    />
  );
}
