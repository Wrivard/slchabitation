/**
 * Ouverture et fermeture des questions fréquentes.
 *
 * Les blocs « FAQ » viennent du gabarit d'origine : une question est un bouton,
 * la réponse un panneau dont la hauteur s'anime. Ce comportement tient les deux
 * en phase — l'état annoncé aux lecteurs d'écran (`aria-expanded`,
 * `aria-hidden`) et la hauteur du panneau — et remplace l'animation que le
 * moteur Webflow jouait autrefois.
 */
export function enableFaqAccessibility(container: HTMLElement): () => void {
  const controls = Array.from(
    container.querySelectorAll<HTMLButtonElement>('button.faq2_question[aria-controls]'),
  );

  const settleHandlers = new WeakMap<HTMLElement, (event: TransitionEvent) => void>();

  const clearSettleHandler = (panel: HTMLElement) => {
    const handler = settleHandlers.get(panel);
    if (handler) {
      panel.removeEventListener('transitionend', handler);
      settleHandlers.delete(panel);
    }
  };

  const openPanel = (panel: HTMLElement) => {
    clearSettleHandler(panel);
    panel.style.height = `${panel.scrollHeight}px`;
    const settle = (event: TransitionEvent) => {
      if (event.propertyName !== 'height' || event.target !== panel) return;
      panel.style.height = 'auto';
      clearSettleHandler(panel);
    };
    settleHandlers.set(panel, settle);
    panel.addEventListener('transitionend', settle);
  };

  const closePanel = (panel: HTMLElement) => {
    clearSettleHandler(panel);
    panel.style.height = `${panel.scrollHeight}px`;
    // Force un reflow pour que la transition parte d'une hauteur connue.
    void panel.offsetHeight;
    panel.style.height = '0px';
  };

  const toggleAnswer = (event: Event) => {
    const control = event.currentTarget as HTMLButtonElement;
    const panelId = control.getAttribute('aria-controls');
    const panel = panelId ? container.querySelector<HTMLElement>(`#${panelId}`) : null;
    const isExpanded = control.getAttribute('aria-expanded') === 'true';

    control.setAttribute('aria-expanded', String(!isExpanded));
    panel?.setAttribute('aria-hidden', String(isExpanded));

    if (!panel) return;
    if (isExpanded) closePanel(panel);
    else openPanel(panel);
  };

  controls.forEach((control) => control.addEventListener('click', toggleAnswer));

  return () => {
    controls.forEach((control) => {
      control.removeEventListener('click', toggleAnswer);
      const panelId = control.getAttribute('aria-controls');
      const panel = panelId ? container.querySelector<HTMLElement>(`#${panelId}`) : null;
      if (panel) clearSettleHandler(panel);
    });
  };
}
