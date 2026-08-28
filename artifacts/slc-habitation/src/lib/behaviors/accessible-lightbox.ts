type LightboxPayload = {
  items?: Array<{
    url?: string;
    caption?: string;
  }>;
  group?: string;
};

type LightboxEntry = {
  anchor: HTMLAnchorElement;
  src: string;
  caption: string;
  group: string;
};

const LIGHTBOX_SELECTOR = 'a.w-lightbox[href]';

function normalizeImageUrl(value: string): string {
  const url = value.trim();
  if (/^(?:https?:|data:|blob:|\/)/i.test(url)) return url;
  return `/${url.replace(/^\.\//, '')}`;
}

function readPayload(anchor: HTMLAnchorElement): LightboxPayload {
  const script = anchor.querySelector<HTMLScriptElement>('script.w-json[type="application/json"]');
  if (!script?.textContent) return {};

  try {
    return JSON.parse(script.textContent) as LightboxPayload;
  } catch {
    return {};
  }
}

/**
 * Visionneuse accessible pour les liens lightbox hérités de Webflow.
 *
 * Le JSON Webflow reste dans le HTML afin que l'image et sa légende soient
 * détectables à la source. Ce comportement fournit l'interaction que le moteur
 * Webflow assurait auparavant, tout en conservant le `href` réel comme solution
 * de secours lorsque JavaScript est désactivé.
 */
export function enableAccessibleLightboxes(container: HTMLElement): () => void {
  if (typeof HTMLDialogElement === 'undefined') return () => undefined;

  const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>(LIGHTBOX_SELECTOR));
  if (anchors.length === 0) return () => undefined;

  const entries = anchors.map<LightboxEntry>((anchor, index) => {
    const payload = readPayload(anchor);
    const item = payload.items?.[0];
    const image = anchor.querySelector<HTMLImageElement>('img');
    const href = anchor.getAttribute('href') ?? '';

    return {
      anchor,
      src: normalizeImageUrl(item?.url || href),
      caption: item?.caption?.trim() || image?.alt.trim() || 'Réalisation de SLC Habitation',
      group: payload.group?.trim() || `lightbox-${index}`,
    };
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'site-lightbox';
  dialog.setAttribute('aria-label', 'Visionneuse de réalisations');

  const panel = document.createElement('div');
  panel.className = 'site-lightbox__panel';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'site-lightbox__close';
  closeButton.setAttribute('aria-label', 'Fermer l’image agrandie');
  closeButton.textContent = '×';

  const figure = document.createElement('figure');
  figure.className = 'site-lightbox__figure';

  const image = document.createElement('img');
  image.className = 'site-lightbox__image';

  const caption = document.createElement('figcaption');
  caption.className = 'site-lightbox__caption';
  caption.setAttribute('aria-live', 'polite');

  const controls = document.createElement('div');
  controls.className = 'site-lightbox__controls';

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.className = 'site-lightbox__control';
  previousButton.setAttribute('aria-label', 'Image précédente');
  previousButton.textContent = 'Précédente';

  const counter = document.createElement('span');
  counter.className = 'site-lightbox__counter';
  counter.setAttribute('aria-live', 'polite');

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'site-lightbox__control';
  nextButton.setAttribute('aria-label', 'Image suivante');
  nextButton.textContent = 'Suivante';

  controls.append(previousButton, counter, nextButton);
  figure.append(image, caption);
  panel.append(closeButton, figure, controls);
  dialog.append(panel);
  document.body.append(dialog);

  let activeEntries: LightboxEntry[] = [];
  let activeIndex = 0;
  let opener: HTMLAnchorElement | null = null;

  const render = () => {
    const entry = activeEntries[activeIndex];
    if (!entry) return;

    image.src = entry.src;
    image.alt = entry.caption;
    caption.textContent = entry.caption;
    counter.textContent = `${activeIndex + 1} sur ${activeEntries.length}`;

    const hasMultipleImages = activeEntries.length > 1;
    previousButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;
    counter.hidden = !hasMultipleImages;
  };

  const move = (direction: number) => {
    if (activeEntries.length < 2) return;
    activeIndex = (activeIndex + direction + activeEntries.length) % activeEntries.length;
    render();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const open = (entry: LightboxEntry) => {
    activeEntries = entries.filter((candidate) => candidate.group === entry.group);
    activeIndex = Math.max(0, activeEntries.indexOf(entry));
    opener = entry.anchor;
    render();
    document.body.classList.add('site-lightbox-open');
    dialog.showModal();
    closeButton.focus();
  };

  const anchorHandlers = entries.map(({ anchor }, index) => {
    const handler = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      open(entries[index]);
    };
    anchor.addEventListener('click', handler);
    return { anchor, handler };
  });

  const handleDialogClick = (event: MouseEvent) => {
    if (event.target === dialog) close();
  };
  const handleCancel = (event: Event) => {
    event.preventDefault();
    close();
  };
  const handleClose = () => {
    document.body.classList.remove('site-lightbox-open');
    opener?.focus();
    opener = null;
  };
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  closeButton.addEventListener('click', close);
  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  dialog.addEventListener('click', handleDialogClick);
  dialog.addEventListener('cancel', handleCancel);
  dialog.addEventListener('close', handleClose);
  dialog.addEventListener('keydown', handleKeydown);

  return () => {
    for (const { anchor, handler } of anchorHandlers) {
      anchor.removeEventListener('click', handler);
    }
    closeButton.removeEventListener('click', close);
    dialog.removeEventListener('click', handleDialogClick);
    dialog.removeEventListener('cancel', handleCancel);
    dialog.removeEventListener('close', handleClose);
    dialog.removeEventListener('keydown', handleKeydown);
    document.body.classList.remove('site-lightbox-open');
    dialog.remove();
  };
}