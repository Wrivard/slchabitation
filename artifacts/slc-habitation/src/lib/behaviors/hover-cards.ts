/**
 * Animation des cartes de services au survol.
 *
 * Le site Webflow élargissait la carte active de 50 % à 70 %, dévoilait son
 * panneau inférieur en le faisant remonter, assombrissait son voile et
 * estompait le contenu des cartes voisines. Comme à l'origine, l'effet ne
 * s'applique qu'à partir de 992 pixels de large.
 */

const CARD_SELECTOR = '.layout423_card';
const CONTENT_SELECTOR = '.layout423_card-content';
const BOTTOM_CONTENT_SELECTOR = '.layout423_card-content-bottom';
const ACTIVE_CLASS = 'is-hovered';
const MINIMUM_WIDTH = 992;
const ENTER_DURATION = 300;
const LEAVE_DURATION = 200;

export function setupHoverCards(container: HTMLElement): () => void {
  if (window.innerWidth < MINIMUM_WIDTH) return () => {};

  const cards = Array.from(container.querySelectorAll<HTMLElement>(CARD_SELECTOR));
  const contents = Array.from(container.querySelectorAll<HTMLElement>(CONTENT_SELECTOR));
  if (!cards.length || !contents.length) return () => {};

  const cleanups: Array<() => void> = [];

  for (const card of cards) {
    const own = Array.from(card.querySelectorAll<HTMLElement>(CONTENT_SELECTOR));
    const bottomContent = card.querySelector<HTMLElement>(BOTTOM_CONTENT_SELECTOR);

    const enter = () => {
      card.style.setProperty('--layout423-hover-duration', `${ENTER_DURATION}ms`);
      card.classList.add(ACTIVE_CLASS);
      if (bottomContent) {
        bottomContent.style.height = `${bottomContent.scrollHeight}px`;
      }

      for (const content of contents) {
        if (!own.includes(content)) content.classList.add('inactive');
      }
    };

    const leave = () => {
      card.style.setProperty('--layout423-hover-duration', `${LEAVE_DURATION}ms`);
      card.classList.remove(ACTIVE_CLASS);
      if (bottomContent) bottomContent.style.height = '0px';

      for (const content of contents) content.classList.remove('inactive');
    };

    card.addEventListener('mouseenter', enter);
    card.addEventListener('mouseleave', leave);
    cleanups.push(() => {
      card.removeEventListener('mouseenter', enter);
      card.removeEventListener('mouseleave', leave);
    });
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
    for (const content of contents) content.classList.remove('inactive');
    for (const card of cards) {
      card.classList.remove(ACTIVE_CLASS);
      card.style.removeProperty('--layout423-hover-duration');
      card
        .querySelector<HTMLElement>(BOTTOM_CONTENT_SELECTOR)
        ?.style.removeProperty('height');
    }
  };
}
