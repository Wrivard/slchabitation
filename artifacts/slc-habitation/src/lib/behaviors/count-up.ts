import { useEffect, type RefObject } from 'react';

/**
 * Compteurs qui défilent jusqu'à leur valeur.
 *
 * Reprend le script inline du site hérité : un nombre marqué
 * `counter-element="number"` part de zéro dès qu'il entre à l'écran et rejoint
 * la valeur écrite dans la page, en ralentissant vers la fin. La durée se règle
 * avec l'attribut `duration`, en millisecondes.
 *
 * Le nombre affiché à l'arrivée est celui que le script hérité écrivait, c'est
 * à dire le nombre seul : un suffixe présent dans le texte de départ (« 25+ »)
 * disparaît une fois l'animation jouée, comme sur le site d'origine.
 */

const DEFAULT_DURATION_MS = 2000;

/* Équivalent de la courbe « ease-out quartique » du script hérité. */
function easeOutQuart(progress: number): number {
  return 1 - Math.pow(1 - progress, 4);
}

function animateNumber(element: HTMLElement, target: number, durationMs: number) {
  let startTime: number | null = null;

  const step = (time: number) => {
    if (startTime === null) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    element.textContent = String(Math.round(target * easeOutQuart(progress)));

    if (elapsed < durationMs) {
      requestAnimationFrame(step);
    } else {
      element.textContent = String(target);
    }
  };

  requestAnimationFrame(step);
}

/**
 * @param containerRef Limite la recherche à un sous-arbre. Sans référence, la
 * page entière est parcourue, comme le script hérité.
 */
export function useCountUp(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope: ParentNode | null = containerRef ? containerRef.current : document;
    if (!scope) return;

    const counters = Array.from(
      scope.querySelectorAll<HTMLElement>('[counter-element="number"]'),
    );
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const element = entry.target as HTMLElement;
        observer.unobserve(element);

        const target = Number.parseInt(element.textContent ?? '', 10);
        if (Number.isNaN(target)) continue;

        const duration =
          Number.parseInt(element.getAttribute('duration') ?? '', 10) || DEFAULT_DURATION_MS;
        animateNumber(element, target, duration);
      }
    });

    for (const counter of counters) observer.observe(counter);

    return () => observer.disconnect();
  }, [containerRef]);
}
