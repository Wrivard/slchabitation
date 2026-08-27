const MOBILE_BREAKPOINT = 992;

/**
 * Rejoue le comportement de la navbar Webflow sans charger `webflow.js`.
 *
 * Les pages du site principal embarquent encore le script legacy, mais les
 * pages publicitaires ne le chargent pas : elles n'ont pas besoin de jQuery ni
 * du moteur d'interactions complet pour ouvrir un menu. Ce contrôleur pose les
 * mêmes classes et attributs que Webflow (`w--open`, `data-nav-menu-open`),
 * donc la feuille de style d'origine suffit à l'affichage.
 */
export function initSiteNav(root: HTMLElement): () => void {
  const navbar = root.querySelector<HTMLElement>('.navbar3_component');
  if (!navbar) return () => {};

  const button = navbar.querySelector<HTMLElement>('.w-nav-button');
  const menu = navbar.querySelector<HTMLElement>('.w-nav-menu');
  const backdrop = navbar.querySelector<HTMLElement>('.navbar3_menu-background');
  const dropdowns = Array.from(navbar.querySelectorAll<HTMLElement>('.w-dropdown'));

  const cleanups: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(
    target: HTMLElement | Window | Document,
    type: K | string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, listener, options);
    cleanups.push(() => target.removeEventListener(type, listener, options));
  };

  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

  // --- Menu mobile -----------------------------------------------------
  let menuOpen = false;

  const setMenuOpen = (open: boolean) => {
    if (!button || !menu || menuOpen === open) return;
    menuOpen = open;

    button.classList.toggle('w--open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      menu.setAttribute('data-nav-menu-open', '');
    } else {
      menu.removeAttribute('data-nav-menu-open');
    }

    if (backdrop) {
      backdrop.style.display = open ? 'block' : '';
    }

    // Le panneau occupe toute la hauteur : le fond ne doit pas défiler dessous.
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (button && menu) {
    if (!menu.id) menu.id = 'site-nav-menu';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Menu');
    button.setAttribute('aria-controls', menu.id);
    button.setAttribute('aria-expanded', 'false');

    on(button, 'click', (event) => {
      event.preventDefault();
      setMenuOpen(!menuOpen);
    });

    on(button, 'keydown', (event) => {
      const key = (event as KeyboardEvent).key;
      if (key !== 'Enter' && key !== ' ') return;
      event.preventDefault();
      setMenuOpen(!menuOpen);
    });

    // Une navigation ferme le menu : les liens internes restent utilisables.
    on(menu, 'click', (event) => {
      const link = (event.target as HTMLElement | null)?.closest('a');
      if (link) setMenuOpen(false);
    });

    if (backdrop) {
      on(backdrop, 'click', () => setMenuOpen(false));
    }
  }

  // --- Menu déroulant « Services » -------------------------------------
  const closeDropdowns = (except?: HTMLElement) => {
    for (const dropdown of dropdowns) {
      if (dropdown === except) continue;
      dropdown.querySelector('.w-dropdown-toggle')?.classList.remove('w--open');
      dropdown.querySelector('.w-dropdown-list')?.classList.remove('w--open');
      dropdown.querySelector('.w-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    }
  };

  for (const dropdown of dropdowns) {
    const toggle = dropdown.querySelector<HTMLElement>('.w-dropdown-toggle');
    const list = dropdown.querySelector<HTMLElement>('.w-dropdown-list');
    if (!toggle || !list) continue;

    if (!list.id) list.id = 'site-nav-services';
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-controls', list.id);
    toggle.setAttribute('aria-expanded', 'false');

    const setDropdownOpen = (open: boolean) => {
      toggle.classList.toggle('w--open', open);
      list.classList.toggle('w--open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    on(toggle, 'click', (event) => {
      event.preventDefault();
      const open = !toggle.classList.contains('w--open');
      closeDropdowns(dropdown);
      setDropdownOpen(open);
    });

    on(toggle, 'keydown', (event) => {
      const key = (event as KeyboardEvent).key;
      if (key !== 'Enter' && key !== ' ') return;
      event.preventDefault();
      const open = !toggle.classList.contains('w--open');
      closeDropdowns(dropdown);
      setDropdownOpen(open);
    });

    // Sur grand écran, Webflow ouvre le menu au survol.
    on(dropdown, 'mouseenter', () => {
      if (isMobile()) return;
      closeDropdowns(dropdown);
      setDropdownOpen(true);
    });
    on(dropdown, 'mouseleave', () => {
      if (isMobile()) return;
      setDropdownOpen(false);
    });
    on(dropdown, 'focusout', (event) => {
      const next = (event as FocusEvent).relatedTarget;
      if (next instanceof Node && dropdown.contains(next)) return;
      if (isMobile()) return;
      setDropdownOpen(false);
    });

    on(list, 'click', (event) => {
      if ((event.target as HTMLElement | null)?.closest('a')) {
        setDropdownOpen(false);
      }
    });
  }

  // --- Fermetures globales ---------------------------------------------
  on(document, 'keydown', (event) => {
    if ((event as KeyboardEvent).key !== 'Escape') return;
    setMenuOpen(false);
    closeDropdowns();
  });

  on(document, 'click', (event) => {
    if (navbar.contains(event.target as Node)) return;
    setMenuOpen(false);
    closeDropdowns();
  });

  on(window, 'resize', () => {
    if (!isMobile()) {
      setMenuOpen(false);
      closeDropdowns();
    }
  });

  return () => {
    setMenuOpen(false);
    closeDropdowns();
    document.body.style.overflow = '';
    for (const cleanup of cleanups) cleanup();
  };
}
