import { useEffect, type RefObject } from 'react';

/**
 * Apparition des blocs au défilement.
 *
 * Reprend, sans GSAP, l'animation que le site hérité déclare dans un script
 * inline répété sur chaque page : un bloc marqué `data-reveal-group` fait
 * monter ses enfants un à un lorsqu'il entre dans l'écran. Les réglages, les
 * durées et la courbe d'accélération sont identiques à l'original, afin qu'une
 * page convertie en React bouge exactement comme avant.
 *
 * Attributs reconnus, comme sur le site hérité :
 * - `data-reveal-group` : le bloc dont les enfants apparaissent l'un après
 *   l'autre ;
 * - `data-reveal-group-nested` : un sous-bloc dont les enfants prennent le
 *   relais, avec son propre décalage ;
 * - `data-distance` : distance parcourue (« 2em » par défaut) ;
 * - `data-stagger` : décalage entre deux éléments, en millisecondes (100 par
 *   défaut) ;
 * - `data-start` : position de déclenchement, au format « top 80% » ;
 * - `data-ignore="false"` : fait aussi apparaître le parent d'un sous-bloc.
 *
 * Comme sur le site hérité, la préférence système « animations réduites »
 * affiche tout immédiatement.
 */

const DURATION_MS = 800;
/* Équivalent CSS de la courbe « power4.inOut » de GSAP. */
const EASING = 'cubic-bezier(0.77, 0, 0.175, 1)';
const DEFAULT_DISTANCE = '2em';
const DEFAULT_STAGGER_MS = 100;
const DEFAULT_START = 'top 80%';

type Slot =
  | { type: 'item'; element: HTMLElement; distance: string }
  | {
      type: 'nested';
      parent: HTMLElement;
      children: HTMLElement[];
      includeParent: boolean;
      distance: string;
      nestedDistance: string;
      nestedStaggerMs: number;
    };

function elementChildren(element: HTMLElement): HTMLElement[] {
  return Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
}

/**
 * « top 80% » signifie : déclencher quand le haut du bloc atteint 80 % de la
 * hauteur de l'écran. Un observateur d'intersection produit le même résultat en
 * repoussant le bas de sa zone de détection d'autant.
 */
function rootMarginFor(start: string): string {
  const percentage = Number.parseFloat(start.split(/\s+/)[1] ?? '80');
  const bottomInset = Number.isFinite(percentage) ? 100 - percentage : 20;
  return `0px 0px -${bottomInset}%`;
}

function hide(element: HTMLElement, distance: string) {
  element.style.transform = `translateY(${distance})`;
  element.style.opacity = '0';
  element.style.visibility = 'hidden';
}

function reveal(element: HTMLElement, delayMs: number) {
  element.style.visibility = 'visible';

  const animation = element.animate(
    [
      { transform: element.style.transform || 'translateY(0)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    { duration: DURATION_MS, delay: delayMs, easing: EASING, fill: 'backwards' },
  );

  /* Le script hérité efface les styles en fin d'animation : sans cela, une
     transformation résiduelle empêcherait par exemple un élément fixe de se
     positionner correctement. */
  const clear = () => {
    element.style.transform = '';
    element.style.opacity = '';
    element.style.visibility = '';
  };

  animation.addEventListener('finish', clear, { once: true });
  animation.addEventListener('cancel', clear, { once: true });
}

function buildSlots(group: HTMLElement, groupDistance: string): Slot[] {
  return elementChildren(group).map((child) => {
    const nested = child.matches('[data-reveal-group-nested]')
      ? child
      : child.querySelector<HTMLElement>(':scope [data-reveal-group-nested]');

    if (!nested) {
      return {
        type: 'item',
        element: child,
        distance: child.getAttribute('data-distance') || groupDistance,
      };
    }

    const nestedStagger = Number.parseFloat(nested.getAttribute('data-stagger') ?? '');

    return {
      type: 'nested',
      parent: child,
      children: elementChildren(nested),
      includeParent:
        child.getAttribute('data-ignore') === 'false' ||
        nested.getAttribute('data-ignore') === 'false',
      distance: groupDistance,
      nestedDistance: nested.getAttribute('data-distance') || groupDistance,
      nestedStaggerMs: Number.isNaN(nestedStagger) ? Number.NaN : nestedStagger,
    };
  });
}

function setupGroup(group: HTMLElement, observers: IntersectionObserver[]) {
  const groupDistance = group.getAttribute('data-distance') || DEFAULT_DISTANCE;
  const groupStaggerMs =
    Number.parseFloat(group.getAttribute('data-stagger') ?? '') || DEFAULT_STAGGER_MS;
  const start = group.getAttribute('data-start') || DEFAULT_START;
  const children = elementChildren(group);

  /* Un bloc sans enfant direct s'anime lui-même. */
  if (children.length === 0) {
    hide(group, groupDistance);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          reveal(group, 0);
        }
      },
      { rootMargin: rootMarginFor(start) },
    );
    observer.observe(group);
    observers.push(observer);
    return;
  }

  const slots = buildSlots(group, groupDistance);

  for (const slot of slots) {
    if (slot.type === 'item') {
      hide(slot.element, slot.distance);
      continue;
    }
    if (slot.includeParent) hide(slot.parent, slot.distance);
    for (const child of slot.children) hide(child, slot.nestedDistance);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.disconnect();

        slots.forEach((slot, slotIndex) => {
          const slotDelay = slotIndex * groupStaggerMs;

          if (slot.type === 'item') {
            reveal(slot.element, slotDelay);
            return;
          }

          if (slot.includeParent) reveal(slot.parent, slotDelay);

          const nestedStagger = Number.isNaN(slot.nestedStaggerMs)
            ? groupStaggerMs
            : slot.nestedStaggerMs;
          slot.children.forEach((child, childIndex) => {
            reveal(child, slotDelay + childIndex * nestedStagger);
          });
        });
      }
    },
    { rootMargin: rootMarginFor(start) },
  );

  observer.observe(group);
  observers.push(observer);
}

/**
 * @param containerRef Limite la recherche à un sous-arbre. Sans référence, la
 * page entière est parcourue, comme le script hérité.
 */
export function useRevealOnScroll(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope: ParentNode | null = containerRef ? containerRef.current : document;
    if (!scope) return;

    const groups = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal-group]'));
    if (groups.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observers: IntersectionObserver[] = [];
    for (const group of groups) {
      setupGroup(group, observers);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [containerRef]);
}
