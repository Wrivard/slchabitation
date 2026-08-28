import { useEffect, type RefObject } from 'react';

import { initSiteNav } from '@/lib/site-nav';
import { enableAccessibleLightboxes } from './accessible-lightbox';
import { useBackToTop } from './back-to-top';
import { useCountUp } from './count-up';
import { useRevealOnScroll } from './reveal-on-scroll';

/**
 * Gestes communs à toutes les pages du site.
 *
 * Le site exporté par Webflow confiait ces gestes à deux endroits : le moteur
 * `webflow.js` pour la navigation, et des scripts recopiés dans l'entête de
 * chaque page pour les animations. Les pages en React les réunissent ici :
 * ouverture du menu, menu déroulant « Services », apparition des blocs au
 * défilement, bouton de retour en haut et compteurs.
 *
 * Chaque geste est sans effet lorsque la page ne contient pas le balisage
 * correspondant : une page sans compteur n'observe rien.
 */
export function useSitePageBehaviors(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return initSiteNav(container);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return enableAccessibleLightboxes(container);
  }, [containerRef]);

  useRevealOnScroll(containerRef);
  useBackToTop(containerRef);
  useCountUp(containerRef);
}
