import { enhanceAccessibility as enhanceStaticMarkupAccessibility } from './publicPageSemantics.mjs';

/**
 * Adds semantic, keyboard, and screen-reader support to the imported Webflow
 * page markup before it is mounted by React.
 */
export function enhanceAccessibility(html: string): string {
  return enhanceStaticMarkupAccessibility(html);
}

/**
 * Keeps the semantic state of the imported FAQ disclosures in step with
 * Webflow's existing visual interactions.
 */
export function enableFaqAccessibility(container: HTMLElement): () => void {
  const controls = Array.from(
    container.querySelectorAll<HTMLButtonElement>('button.faq2_question[aria-controls]'),
  );

  const toggleAnswer = (event: Event) => {
    const control = event.currentTarget as HTMLButtonElement;
    const panelId = control.getAttribute('aria-controls');
    const panel = panelId ? container.querySelector<HTMLElement>(`#${panelId}`) : null;
    const isExpanded = control.getAttribute('aria-expanded') === 'true';

    control.setAttribute('aria-expanded', String(!isExpanded));
    panel?.setAttribute('aria-hidden', String(isExpanded));
  };

  controls.forEach((control) => control.addEventListener('click', toggleAnswer));
  return () => controls.forEach((control) => control.removeEventListener('click', toggleAnswer));
}