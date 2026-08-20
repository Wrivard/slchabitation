/**
 * Adds semantic, keyboard, and screen-reader support to the imported Webflow
 * page markup before it is mounted by React.
 */
export function enhanceAccessibility(html: string): string {
  let accessibleHtml = html
    .replace(
      /<div class="navbar3_menu-button w-nav-button">([\s\S]*?)<\/div>\n\s*<nav role="navigation" class="navbar3_menu w-nav-menu">/,
      `<button type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="site-navigation" class="navbar3_menu-button w-nav-button">$1</button>
          <nav id="site-navigation" role="navigation" class="navbar3_menu w-nav-menu">`,
    )
    .replace(
      /<a href="https:\/\/www\.facebook\.com\/SLCHabitation"/g,
      '<a aria-label="Facebook de SLC Habitation" href="https://www.facebook.com/SLCHabitation"',
    )
    .replace(
      /<a href="https:\/\/m\.me\/SLCHabitation"/g,
      '<a aria-label="Contacter SLC Habitation sur Messenger" href="https://m.me/SLCHabitation"',
    )
    .replace(
      /<a href="https:\/\/www\.facebook\.com\/SLCHabitation"([^>]*class="messenger_button)/g,
      '<a aria-label="Contacter SLC Habitation sur Messenger" href="https://www.facebook.com/SLCHabitation"$1',
    )
    .replace(
      /<a aria-label="Facebook de SLC Habitation" href="https:\/\/www\.facebook\.com\/SLCHabitation"([^>]*class="messenger_button)/g,
      '<a aria-label="Contacter SLC Habitation sur Messenger" href="https://www.facebook.com/SLCHabitation"$1',
    )
    .replace(
      '<button data-back-to-top="button" class="back-top__button">',
      '<button type="button" aria-label="Retour en haut" data-back-to-top="button" class="back-top__button">',
    )
    .replace(
      /(<div class="social-icon w-embed"><svg)(?![^>]*aria-hidden)/g,
      '$1 aria-hidden="true" focusable="false"',
    )
    .replace(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 60 60" fill="none" class="back-top__arrow">',
      '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 60 60" fill="none" class="back-top__arrow">',
    )
    .replace(
      /<a href="#" class="banner9_social-link w-inline-block">[\s\S]*?<\/a>/g,
      '',
    )
    .replace(
      /<div data-w-id="([^"]+)" class="faq2_question">([\s\S]*?)<\/div>\n\s*<div style="width:100%;height:0px" class="faq2_answer">/g,
      `<button type="button" data-w-id="$1" class="faq2_question" aria-expanded="false" aria-controls="faq-answer-$1">$2</button>
                    <div id="faq-answer-$1" style="width:100%;height:0px" class="faq2_answer" aria-hidden="true">`,
    );

  if (accessibleHtml.includes('Contact-6-Radio')) {
    accessibleHtml = accessibleHtml
      .replace(
        '<div class="margin-bottom margin-xsmall"><label for="Contact-2-Select-3" class="form_field-label">Votre budget ?</label></div>\n                          <div class="w-layout-grid form_radio-2col">',
        '<fieldset class="form_fieldset"><legend class="form_field-label">Votre budget ?</legend>\n                          <div class="w-layout-grid form_radio-2col">',
      )
      .replace(
        '</label></div>\n                        </div>\n                      </div>\n                      <div class="form_field-wrapper"><label for="Contact-6-Message"',
        '</label></div></fieldset>\n                        </div>\n                      </div>\n                      <div class="form_field-wrapper"><label for="Contact-6-Message"',
      );
  }

  return accessibleHtml;
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