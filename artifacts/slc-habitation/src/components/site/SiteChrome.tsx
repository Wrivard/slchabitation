import { useEffect, useMemo, useRef } from 'react';
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

const CALL_ANCHOR = '<a href="tel:(514)404-8494" class="text-weight-semibold">(514) 404-8494</a>';
const CALL_BUTTON =
  '<a href="tel:+15144048494" class="text-weight-semibold site-call-button"><span class="site-call-button__label">Appeler</span><span class="site-call-button__number">(514) 404-8494</span></a>';

export function SiteHeader({ callButton = false }: { callButton?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  /* PubLayout se rerend pendant le défilement pour changer sa section active.
     Garder cet élément identique empêche React de remplacer le HTML Webflow :
     ses nœuds ont des écouteurs natifs attachés par initSiteNav. */
  const header = useMemo(
    () => (
      <div
        ref={containerRef}
        className="site-chrome site-chrome--header"
        data-testid="site-navbar"
        dangerouslySetInnerHTML={{
          __html: addAccessibleNames(callButton ? siteHeaderHtml.replace(CALL_ANCHOR, CALL_BUTTON) : siteHeaderHtml),
        }}
      />
    ),
    [callButton],
  );

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

  return header;
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
