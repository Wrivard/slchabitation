import { useEffect, type RefObject } from 'react';

/**
 * Bouton « retour en haut ».
 *
 * Reprend, sans GSAP, le comportement du script inline du site hérité : le
 * bouton reste caché tant que la page n'a pas défilé d'une demi-hauteur
 * d'écran, puis se déplie en tournant ; il se replie quand le visiteur remonte.
 * Le clic ramène en haut de page en défilement doux.
 *
 * Le balisage attendu est celui du site hérité : un conteneur
 * `data-back-to-top="wrap"`, masqué par la feuille de style tant que le script
 * n'a pas pris la main, et un bouton `data-back-to-top="button"` à l'intérieur.
 */

/* Distance minimale, en pourcentage de la hauteur de l'écran. */
const MINIMUM_SCROLL_PERCENT = 50;
/* Équivalent CSS de la courbe « power4.out » de GSAP. */
const EASING = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
const ENTER_DURATION_MS = 450;
const LEAVE_DURATION_MS = 400;

const HIDDEN_KEYFRAME = { opacity: 0, transform: 'rotate(-65deg) scale(0.4)', visibility: 'hidden' };
const VISIBLE_KEYFRAME = { opacity: 1, transform: 'rotate(0deg) scale(1)', visibility: 'visible' };
const LEAVE_KEYFRAME = { opacity: 0, transform: 'rotate(-65deg) scale(0.6)', visibility: 'hidden' };

export function useBackToTop(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope: ParentNode | null = containerRef ? containerRef.current : document;
    if (!scope) return;

    const wrap = scope.querySelector<HTMLElement>('[data-back-to-top="wrap"]');
    const button = scope.querySelector<HTMLElement>('[data-back-to-top="button"]');
    if (!wrap || !button) return;

    /* La feuille de style masque le conteneur pour éviter que le bouton
       n'apparaisse le temps du chargement : c'est au comportement de le
       révéler. */
    wrap.style.opacity = '1';
    wrap.style.visibility = 'visible';

    let visible = false;
    let animation: Animation | null = null;

    const applyState = (nextVisible: boolean, animate: boolean) => {
      const keyframe = nextVisible ? VISIBLE_KEYFRAME : LEAVE_KEYFRAME;
      animation?.cancel();

      if (!animate) {
        Object.assign(button.style, keyframe);
        return;
      }

      animation = button.animate(
        [nextVisible ? HIDDEN_KEYFRAME : VISIBLE_KEYFRAME, keyframe],
        {
          duration: nextVisible ? ENTER_DURATION_MS : LEAVE_DURATION_MS,
          easing: EASING,
          fill: 'forwards',
        },
      );
    };

    applyState(false, false);

    const update = () => {
      const threshold = (window.innerHeight * MINIMUM_SCROLL_PERCENT) / 100;
      const shouldShow = window.scrollY > threshold;
      if (shouldShow === visible) return;
      visible = shouldShow;
      applyState(shouldShow, true);
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    button.addEventListener('click', scrollToTop);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      button.removeEventListener('click', scrollToTop);
      animation?.cancel();
    };
  }, [containerRef]);
}
