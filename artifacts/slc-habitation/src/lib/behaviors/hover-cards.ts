/**
 * Mise en retrait des cartes voisines au survol.
 *
 * Sur la page d'accueil, survoler une carte de service estompe les autres. La
 * page héritée le faisait avec jQuery : la classe `inactive` est posée sur le
 * contenu de toutes les cartes sauf celle survolée, et retirée quand la souris
 * ressort. Comme à l'origine, l'effet ne s'applique qu'à partir de 992 pixels
 * de large, c'est-à-dire hors mobile et tablette.
 */

const CARD_SELECTOR = '.layout423_card';
const CONTENT_SELECTOR = '.layout423_card-content';
const MINIMUM_WIDTH = 992;

export function setupHoverCards(container: HTMLElement): () => void {
  if (window.innerWidth < MINIMUM_WIDTH) return () => {};

  const cards = Array.from(container.querySelectorAll<HTMLElement>(CARD_SELECTOR));
  const contents = Array.from(container.querySelectorAll<HTMLElement>(CONTENT_SELECTOR));
  if (!cards.length || !contents.length) return () => {};

  const cleanups: Array<() => void> = [];

  for (const card of cards) {
    const own = Array.from(card.querySelectorAll<HTMLElement>(CONTENT_SELECTOR));

    const enter = () => {
      for (const content of contents) {
        if (!own.includes(content)) content.classList.add('inactive');
      }
    };
    const leave = () => {
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
  };
}
