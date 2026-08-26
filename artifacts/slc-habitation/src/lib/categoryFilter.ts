/**
 * Filtre par catégorie de la page Réalisations.
 *
 * La page provient d'un export Webflow injecté dans React : le balisage
 * (`.category-filter-link`, `.blog22_item[data-category]`) vient du HTML
 * hérité, mais le comportement est piloté ici pour survivre aux montages et
 * démontages successifs du composant. Les styles correspondants sont dans
 * `src/index.css` et, pour la version statique servie avant l'hydratation,
 * dans `site/realisations.html`.
 */
const ACTIVE_CLASS = 'active';

function statusText(visible: number, categoryLabel: string | null): string {
  const plural = visible > 1 ? 's' : '';
  const scope = categoryLabel ? ` dans « ${categoryLabel} »` : '';
  return `${visible} projet${plural} affiché${plural}${scope}`;
}

export function setupCategoryFilter(container: HTMLElement): () => void {
  const links = Array.from(
    container.querySelectorAll<HTMLAnchorElement>('.category-filter-link'),
  );
  const items = Array.from(container.querySelectorAll<HTMLElement>('.blog22_item'));

  if (links.length === 0 || items.length === 0) {
    return () => {};
  }

  const menu = container.querySelector<HTMLElement>('.category-filter-menu');
  if (menu) {
    menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', 'Filtrer les réalisations par catégorie');
  }

  const status = container.querySelector<HTMLElement>('[data-filter-status]');

  const categoryOf = (link: HTMLAnchorElement) =>
    link.getAttribute('data-category') || 'all';

  const applyCategory = (category: string) => {
    let visible = 0;
    for (const item of items) {
      const matches =
        category === 'all' || item.getAttribute('data-category') === category;
      item.classList.toggle('hidden', !matches);
      item.style.display = matches ? '' : 'none';
      if (matches) visible += 1;
    }

    let selectedLabel: string | null = null;
    for (const link of links) {
      const selected = categoryOf(link) === category;
      link.classList.toggle(ACTIVE_CLASS, selected);
      if (selected) {
        link.setAttribute('aria-current', 'true');
        if (category !== 'all') {
          selectedLabel = (link.textContent || '').trim() || null;
        }
      } else {
        link.removeAttribute('aria-current');
      }
    }

    if (status) {
      status.textContent = statusText(visible, selectedLabel);
    }
  };

  const onClick = (event: Event) => {
    event.preventDefault();
    // Le thème Webflow attache ses propres gestionnaires aux liens : on coupe
    // la propagation pour qu'aucun d'eux ne reprenne la main sur le clic.
    event.stopPropagation();
    applyCategory(categoryOf(event.currentTarget as HTMLAnchorElement));
  };

  // La barre d'espace n'active pas un lien par défaut : on l'ajoute pour que
  // les filtres se comportent comme des boutons au clavier.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== ' ' && event.key !== 'Spacebar') return;
    event.preventDefault();
    applyCategory(categoryOf(event.currentTarget as HTMLAnchorElement));
  };

  for (const link of links) {
    link.addEventListener('click', onClick, true);
    link.addEventListener('keydown', onKeyDown);
  }

  const initial = links.find((link) => link.classList.contains(ACTIVE_CLASS));
  applyCategory(initial ? categoryOf(initial) : 'all');

  return () => {
    for (const link of links) {
      link.removeEventListener('click', onClick, true);
      link.removeEventListener('keydown', onKeyDown);
    }
  };
}
