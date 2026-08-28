/**
 * Page publique « /formulaire ».
 *
 * Elle conserve le formulaire historique et son identité SEO propre. Le
 * composant reprend le balisage de l'export Webflow
 * (`site/formulaire.html`).
 */
export default function Formulaire() {
  return (
    <>
      {' '}
      {' '}
      <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCNZTC97"
height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
      {' '}
      {' '}
      <div className="page-wrapper">
        {' '}
        <div className="global-styles">
          {' '}
          <div className="style-overrides w-embed">
            {' '}
            <style dangerouslySetInnerHTML={{ __html: `
/* Ensure all elements inherit the color from its parent */
a,
.w-input,
.w-select,
.w-tab-link,
.w-nav-link,
.w-nav-brand,
.w-dropdown-btn,
.w-dropdown-toggle,
.w-slider-arrow-left,
.w-slider-arrow-right,
.w-dropdown-link {
  color: inherit;
  text-decoration: inherit;
  font-size: inherit;
}
/* Focus state style for keyboard navigation for the focusable elements */
*[tabindex]:focus-visible,
  input[type="file"]:focus-visible {
   outline: 0.125rem solid #4d65ff;
   outline-offset: 0.125rem;
}
/* Get rid of top margin on first element in any rich text element */
.w-richtext > :not(div):first-child, .w-richtext > div:first-child > :first-child {
  margin-top: 0 !important;
}
/* Get rid of bottom margin on last element in any rich text element */
.w-richtext>:last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child {
	margin-bottom: 0 !important;
}
/* Prevent all click and hover interaction with an element */
.pointer-events-off {
	pointer-events: none;
}
/* Enables all click and hover interaction with an element */
.pointer-events-on {
  pointer-events: auto;
}
/* Create a class of .div-square which maintains a 1:1 dimension of a div */
.div-square::after {
	content: "";
	display: block;
	padding-bottom: 100%;
}
/* Make sure containers never lose their center alignment */
.container-medium,.container-small, .container-large {
	margin-right: auto !important;
  margin-left: auto !important;
}
/* Apply "..." after 3 lines of text */
.text-style-3lines {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
/* Apply "..." after 2 lines of text */
.text-style-2lines {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
/* Adds inline flex display */
.display-inlineflex {
  display: inline-flex;
}
/* These classes are never overwritten */
.hide {
  display: none !important;
}
/* Remove default Webflow chevron from form select */
select{
  -webkit-appearance:none;
}
@media screen and (max-width: 991px) {
    .hide, .hide-tablet {
        display: none !important;
    }
}
  @media screen and (max-width: 767px) {
    .hide-mobile-landscape{
      display: none !important;
    }
}
  @media screen and (max-width: 479px) {
    .hide-mobile{
      display: none !important;
    }
}
.margin-0 {
  margin: 0rem !important;
}
.padding-0 {
  padding: 0rem !important;
}
.spacing-clean {
padding: 0rem !important;
margin: 0rem !important;
}
.margin-top {
  margin-right: 0rem !important;
  margin-bottom: 0rem !important;
  margin-left: 0rem !important;
}
.padding-top {
  padding-right: 0rem !important;
  padding-bottom: 0rem !important;
  padding-left: 0rem !important;
}
.margin-right {
  margin-top: 0rem !important;
  margin-bottom: 0rem !important;
  margin-left: 0rem !important;
}
.padding-right {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
  padding-left: 0rem !important;
}
.margin-bottom {
  margin-top: 0rem !important;
  margin-right: 0rem !important;
  margin-left: 0rem !important;
}
.padding-bottom {
  padding-top: 0rem !important;
  padding-right: 0rem !important;
  padding-left: 0rem !important;
}
.margin-left {
  margin-top: 0rem !important;
  margin-right: 0rem !important;
  margin-bottom: 0rem !important;
}
.padding-left {
  padding-top: 0rem !important;
  padding-right: 0rem !important;
  padding-bottom: 0rem !important;
}
.margin-horizontal {
  margin-top: 0rem !important;
  margin-bottom: 0rem !important;
}
.padding-horizontal {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}
.margin-vertical {
  margin-right: 0rem !important;
  margin-left: 0rem !important;
}
.padding-vertical {
  padding-right: 0rem !important;
  padding-left: 0rem !important;
}
/* Apply "..." at 100% width */
.truncate-width { 
		width: 100%; 
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
}
/* Removes native scrollbar */
.no-scrollbar {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none; 
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
` }} />
            {' '}
          </div>
          {' '}
          <div className="color-schemes w-embed">
            {' '}
            <style dangerouslySetInnerHTML={{ __html: `
.color-scheme-1 {}
  .color-scheme-2 {
    --color-scheme-1--text: var(--color-scheme-2--text);
    --color-scheme-1--background: var(--color-scheme-2--background);
    --color-scheme-1--foreground: var(--color-scheme-2--foreground);
    --color-scheme-1--border: var(--color-scheme-2--border);
    --color-scheme-1--accent: var(--color-scheme-2--accent);
  }
  .color-scheme-3 {
    --color-scheme-1--text: var(--color-scheme-3--text);
    --color-scheme-1--background: var(--color-scheme-3--background);
    --color-scheme-1--foreground: var(--color-scheme-3--foreground);
    --color-scheme-1--border: var(--color-scheme-3--border);
    --color-scheme-1--accent: var(--color-scheme-3--accent);
  }
.w-slider-dot {
  background-color: var(--color-scheme-1--text);
  opacity: 0.20;
}
.w-slider-dot.w-active {
  background-color: var(--color-scheme-1--text);
  opacity: 1;
}
/* Override .w-slider-nav-invert styles */
.w-slider-nav-invert .w-slider-dot {
  background-color: var(--color-scheme-1--text) !important;
  opacity: 0.20 !important;
}
.w-slider-nav-invert .w-slider-dot.w-active {
  background-color: var(--color-scheme-1--text) !important;
  opacity: 1 !important;
}
` }} />
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <main className="main-wrapper">
          {' '}
          <section className="banner9_component color-scheme-3">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="banner9_content-wrapper">
                {' '}
                <div className="banner9_content">
                  {' '}
                  <div className="banne9_icon-wrapper">
                    {' '}
                    <div className="icon-1x1-small w-embed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960">
                        {' '}
                        <path fill="currentColor" d="M809.6-494.41q-11.5 0-20.4-8.24-8.9-8.24-11.13-20.96-14-102.28-87.15-175.42-73.14-73.14-175.42-87.38-12.72-2-20.96-10.99-8.24-8.98-8.24-21.7 0-13.67 9.36-22.8 9.36-9.14 22.84-7.14 127.47 14.59 217.53 104.8 90.06 90.2 104.9 217.63 2 13.48-7.55 22.84-9.56 9.36-23.78 9.36Zm-175.23 0q-9.98 0-18.91-6.85t-12.5-18.35Q593.2-552.7 568.89-577q-24.3-24.3-57.39-34.07-11.48-3.71-18.34-11.78-6.86-8.07-6.86-18.94 0-15.91 10.45-25.26 10.45-9.36 25.23-5.88 52.76 12.82 91.13 51.28 38.38 38.47 52.72 91.56 3.24 14.48-6.14 25.08-9.37 10.6-25.32 10.6Zm161.11 380.39q-117.46 0-239.02-56.48-121.57-56.48-225.41-160.32-103.83-103.83-160.43-225.52-56.6-121.68-56.6-238.9 0-21.71 14.57-36.34 14.56-14.64 36.17-14.64h140q18.07 0 30.34 11.56 12.27 11.55 16.99 30.38l26.93 121.81q2.55 17.23-.67 30.76-3.22 13.54-13.36 23.2l-100.73 99.34q25.04 42.08 53.09 78.65 28.04 36.56 62.32 69.61 36.05 37.28 75.25 67.46 39.21 30.19 81.82 52.75l96.19-98.71q11.68-12.68 26.74-17.16 15.07-4.47 30.4-1.52l114.21 25.29q18.83 5.19 30.38 19.15 11.56 13.96 11.56 32.45v136.44q0 21.74-14.65 36.24-14.65 14.5-36.09 14.5ZM230.2-590.87l80.76-80.33-22.76-106.65H182.63q1.76 40.57 12.77 85.86t34.8 101.12Zm369.71 363.96q39.81 18.52 86.73 30.28 46.93 11.76 91.21 14v-106l-99.42-20.57-78.52 82.29ZM230.2-590.87Zm369.71 363.96Z" />
                        {' '}
                      </svg>
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <div className="banner9_text-wrapper">
                    {' '}
                    <a href="tel:+15144048494" className="text-weight-semibold">
                      (514) 404-8494
                    </a>
                    {' '}
                  </div>
                  {' '}
                  <div className="banner9_text-wrapper">
                    {' '}
                    <p className="text-size-small">
                      RBQ: 8351-9033-59
                    </p>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="w-layout-grid banner9_social-icons">
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </section>
          {' '}
          <div data-collapse="medium" data-animation="over-left" data-duration="400" fs-scrolldisable-element="smart-nav" data-easing="ease" data-easing2="ease" role="banner" className="navbar3_component color-scheme-1 w-nav">
            {' '}
            <div className="navbar3_container">
              {' '}
              <button type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="site-navigation" className="navbar3_menu-button w-nav-button">
                {' '}
                <div className="menu-icon3">
                  {' '}
                  <div className="menu-icon3_line-top"></div>
                  {' '}
                  <div className="menu-icon3_line-middle"></div>
                  {' '}
                  <div className="menu-icon3_line-bottom"></div>
                  {' '}
                </div>
                {' '}
              </button>
              {' '}
              <nav id="site-navigation" role="navigation" className="navbar3_menu w-nav-menu">
                {' '}
                <a href="#" className="navbar3_logo-link-menu w-nav-brand">
                  <img sizes="(max-width: 991px) 100vw, 76.8125px" height="44px" alt="" src="/images/relume-567884.png" loading="eager" srcSet="/images/relume-567884-p-500.png 500w, /images/relume-567884.png 660w" className="navbar3_logo" />
                </a>
                {' '}
                <a href="/" className="navbar3_link w-nav-link">
                  Accueil
                </a>
                {' '}
                <a href="/a-propos" className="navbar3_link w-nav-link">
                  À Propos
                </a>
                {' '}
                <div data-delay="200" data-hover="true" className="navbar3_menu-dropdown w-dropdown">
                  {' '}
                  <div className="navbar3_dropdown-toggle w-dropdown-toggle">
                    {' '}
                    <div>
                      Services
                    </div>
                    {' '}
                    <div className="dropdown-chevron w-embed">
                      <svg width=" 100%" height=" 100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {' '}
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z" fill="currentColor" />
                        {' '}
                      </svg>
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <nav className="navbar3_dropdown-list w-dropdown-list">
                    {' '}
                    <a href="/renovation" aria-current="page" className="navbar3_dropdown-link w-dropdown-link w--current">
                      Rénovation
                    </a>
                    {' '}
                    <a href="/agrandissement-construction-neuve" className="navbar3_dropdown-link w-dropdown-link">
                      Agrandissement & Construction neuve
                    </a>
                    {' '}
                    <a href="/travaux-sur-mesure" className="navbar3_dropdown-link w-dropdown-link">
                      Travaux sur mesure
                    </a>
                    {' '}
                  </nav>
                  {' '}
                </div>
                {' '}
                <a href="/realisations" className="navbar3_link w-nav-link">
                  Réalisations
                </a>
                {' '}
                <a href="/formulaire" className="navbar3_tablet-menu-button w-button">
                  Soumission
                </a>
                {' '}
              </nav>
              {' '}
              <a href="/" className="navbar3_logo-link w-nav-brand">
                <img sizes="(max-width: 479px) 86vw, 76.8125px" height="44px" alt="" src="/images/relume-567884.png" loading="eager" srcSet="/images/relume-567884-p-500.png 500w, /images/relume-567884.png 660w" className="navbar3_logo" />
              </a>
              {' '}
              <a id="w-node-e94d028c-b457-e648-e3c9-1bebe5f245fc-e5f245dc" href="/formulaire" className="button w-button">
                Soumission
              </a>
              {' '}
              <div className="navbar3_menu-background"></div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <section className="py-24 bg-neutral-lightest min-h-[80vh] flex items-center">
            {' '}
            <div className="container-large px-6 w-full">
              {' '}
              <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl p-8 md:p-14 fade-up">
                {' '}
                <div className="text-center mb-10">
                  {' '}
                  <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-mine-shaft">
                    Demande de soumission
                  </h1>
                  {' '}
                  <p id="form-service-heading" className="text-lg text-[#f58026] font-semibold uppercase tracking-wider mb-2" />
                  {' '}
                  <p className="text-neutral-dark mb-4">
                    Veuillez remplir ce formulaire. Nous vous rappellerons pour discuter de vos besoins et planifier une visite si nécessaire.
                  </p>
                  {' '}
                  <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-neutral-lightest px-6 py-3 rounded-2xl sm:rounded-full border border-neutral-lighter mb-4">
                    {' '}
                    <div className="flex items-center gap-2">
                      {' '}
                      <svg className="w-5 h-5 text-[#f58026]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {' '}
                      <span className="text-sm font-semibold text-mine-shaft">
                        Entrepreneur licencié RBQ (8351-9033-59)
                      </span>
                      {' '}
                    </div>
                    {' '}
                    <div className="hidden sm:block w-px h-4 bg-neutral-lighter"></div>
                    {' '}
                    <div className="flex items-center gap-2">
                      {' '}
                      <svg className="w-5 h-5 text-[#f58026]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {' '}
                      <span className="text-sm font-semibold text-mine-shaft">
                        25 ans d'expérience
                      </span>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <p className="text-sm text-neutral-dark">
                    {'Ou appelez-nous directement au '}
                    <a href="tel:+15144048494" className="font-bold text-[#f58026] hover:underline">
                      (514) 404-8494
                    </a>
                    .
                  </p>
                  {' '}
                </div>
                {' '}
                <p className="bg-neutral-lightest border border-neutral-lighter rounded-xl px-4 py-3 mb-8 text-sm text-center text-neutral-dark">
                  {' '}
                  <strong className="text-mine-shaft">
                    Après l'envoi :
                  </strong>
                  {' échange téléphonique, validation des besoins, puis visite si elle est utile. '}
                </p>
                {' '}
                <form id="quote-form" action="/api/submit-form" method="POST" encType="multipart/form-data" className="space-y-6">
                  {' '}
                  <div id="hidden-fields-container"></div>
                  {' '}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                    {' '}
                    <label htmlFor="Contact-6-Website">
                      Site web
                    </label>
                    {' '}
                    <input type="text" id="Contact-6-Website" name="Contact-6-Website" tabIndex={-1} autoComplete="off" />
                    {' '}
                  </div>
                  {' '}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {' '}
                    <div className="space-y-2">
                      {' '}
                      <label htmlFor="Contact-6-First-Name" className="block text-sm font-semibold text-mine-shaft">
                        Prénom *
                      </label>
                      {' '}
                      <input type="text" id="Contact-6-First-Name" name="Contact-6-First-Name" autoComplete="given-name" required className="w-full px-4 py-3 rounded-lg border border-neutral-lighter focus:border-[#f58026] focus:ring-1 focus:ring-[#f58026] outline-none transition-shadow bg-neutral-lightest/50" />
                      {' '}
                    </div>
                    {' '}
                    <div className="space-y-2">
                      {' '}
                      <label htmlFor="Contact-6-Last-Name" className="block text-sm font-semibold text-mine-shaft">
                        Nom *
                      </label>
                      {' '}
                      <input type="text" id="Contact-6-Last-Name" name="Contact-6-Last-Name" autoComplete="family-name" required className="w-full px-4 py-3 rounded-lg border border-neutral-lighter focus:border-[#f58026] focus:ring-1 focus:ring-[#f58026] outline-none transition-shadow bg-neutral-lightest/50" />
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {' '}
                    <div className="space-y-2">
                      {' '}
                      <label htmlFor="Contact-6-Email" className="block text-sm font-semibold text-mine-shaft">
                        Courriel *
                      </label>
                      {' '}
                      <input type="email" id="Contact-6-Email" name="Contact-6-Email" autoComplete="email" required className="w-full px-4 py-3 rounded-lg border border-neutral-lighter focus:border-[#f58026] focus:ring-1 focus:ring-[#f58026] outline-none transition-shadow bg-neutral-lightest/50" />
                      {' '}
                    </div>
                    {' '}
                    <div className="space-y-2">
                      {' '}
                      <label htmlFor="Contact-6-Phone" className="block text-sm font-semibold text-mine-shaft">
                        Téléphone *
                      </label>
                      {' '}
                      <input type="tel" id="Contact-6-Phone" name="Contact-6-Phone" autoComplete="tel" required className="w-full px-4 py-3 rounded-lg border border-neutral-lighter focus:border-[#f58026] focus:ring-1 focus:ring-[#f58026] outline-none transition-shadow bg-neutral-lightest/50" />
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <div className="space-y-2">
                    {' '}
                    <label htmlFor="Contact-6-Radio" className="block text-sm font-semibold text-mine-shaft">
                      Budget approximatif (optionnel)
                    </label>
                    {' '}
                    <select id="Contact-6-Radio" name="Contact-6-Radio" className="w-full px-4 py-3 rounded-lg border border-neutral-lighter focus:border-[#f58026] focus:ring-1 focus:ring-[#f58026] outline-none transition-shadow bg-neutral-lightest/50">
                      {' '}
                      <option value="">
                        Sélectionnez une fourchette
                      </option>
                      {' '}
                      <option value="Contact 6 Radio 1">
                        25 000 $ et moins
                      </option>
                      {' '}
                      <option value="Contact 6 Radio 2">
                        25 000 $ – 50 000 $
                      </option>
                      {' '}
                      <option value="Contact 6 Radio 3">
                        50 000 $ – 100 000 $
                      </option>
                      {' '}
                      <option value="Contact 6 Radio 4">
                        100 000 $ et plus
                      </option>
                      {' '}
                    </select>
                    {' '}
                  </div>
                  {' '}
                  <div className="space-y-2">
                    {' '}
                    <label htmlFor="Contact-6-Message" className="block text-sm font-semibold text-mine-shaft">
                      Description brève de votre projet *
                    </label>
                    {' '}
                    <textarea id="Contact-6-Message" name="Contact-6-Message" maxLength={5000} rows={4} required className="w-full px-4 py-3 rounded-lg border border-neutral-lighter focus:border-[#f58026] focus:ring-1 focus:ring-[#f58026] outline-none transition-shadow bg-neutral-lightest/50 resize-none"></textarea>
                    {' '}
                  </div>
                  {' '}
                  <div className="pt-4">
                    {' '}
                    <button type="submit" aria-describedby="form-error" className="w-full !bg-[#f58026] hover:bg-[#d86d1b] transition-colors py-4 rounded-lg font-bold text-white text-lg shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait">
                      {' Envoyer ma demande '}
                    </button>
                    {' '}
                  </div>
                  {' '}
                  <p id="form-error" role="alert" className="hidden text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3" />
                  {' '}
                  <p className="text-xs text-center text-neutral mt-4">
                    {'Vos coordonnées servent à répondre à votre demande et à communiquer avec vous au sujet de ce projet. Consultez notre '}
                    <a href="/politique-de-cookie" className="underline hover:text-[#f58026] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58026] rounded">
                      politique de cookies
                    </a>
                    .
                  </p>
                  {' '}
                </form>
                {' '}
                <div id="form-success" className="hidden text-center py-10" role="status" tabIndex={-1}>
                  {' '}
                  <h2 className="text-2xl font-bold text-mine-shaft mb-2">
                    Demande envoyée avec succès
                  </h2>
                  {' '}
                  <p className="text-neutral-dark">
                    Merci. Notre équipe examinera vos informations et vous contactera pour la prochaine étape de votre projet.
                  </p>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </section>
          {' '}
        </main>
        {' '}
        <footer className="footer3_component color-scheme-1">
          {' '}
          <div className="padding-global">
            {' '}
            <div className="container-large">
              {' '}
              <div className="padding-vertical padding-xxlarge">
                {' '}
                <div className="padding-bottom padding-xxlarge">
                  {' '}
                  <div className="w-layout-grid footer3_top-wrapper">
                    {' '}
                    <div className="footer3_left-wrapper">
                      {' '}
                      <div className="margin-bottom margin-medium">
                        {' '}
                        <a href="/" className="footer3_logo-link w-nav-brand">
                          <img sizes="(max-width: 479px) 86vw, 76.8125px" height="44px" alt="" src="/images/relume-567884.png" loading="lazy" srcSet="/images/relume-567884-p-500.png 500w, /images/relume-567884.png 660w" className="footer3_logo" />
                        </a>
                        {' '}
                      </div>
                      {' '}
                      <div className="margin-bottom margin-medium">
                        {' '}
                        <div className="footer3_details-wrapper">
                          {' '}
                          <div className="margin-bottom margin-tiny">
                            {' '}
                            <div className="text-size-small">
                              Adresse
                            </div>
                            {' '}
                          </div>
                          {' '}
                          <div className="margin-bottom margin-small">
                            {' '}
                            <div className="text-size-small">
                              Saint Eustache, QC
                            </div>
                            {' '}
                          </div>
                          {' '}
                          <div className="margin-bottom margin-tiny">
                            {' '}
                            <div className="text-size-small">
                              Téléphone
                            </div>
                            {' '}
                          </div>
                          {' '}
                          <a href="tel:+15144048494" className="text-size-small">
                            (514) 404-8494
                          </a>
                          {' '}
                          <a href="mailto:slchabitation@gmail.com" className="text-size-small">
                            <br />
                            slchabitation@gmail.com
                          </a>
                          {' '}
                        </div>
                        {' '}
                      </div>
                      {' '}
                      <div className="w-layout-grid footer3_social-list">
                        {' '}
                        <a href="#" className="footer3_social-link w-inline-block">
                          {' '}
                          <div className="icon-embed-xsmall w-embed">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {' '}
                              <path d="M22 12.0611C22 6.50451 17.5229 2 12 2C6.47715 2 2 6.50451 2 12.0611C2 17.0828 5.65684 21.2452 10.4375 22V14.9694H7.89844V12.0611H10.4375V9.84452C10.4375 7.32296 11.9305 5.93012 14.2146 5.93012C15.3088 5.93012 16.4531 6.12663 16.4531 6.12663V8.60261H15.1922C13.95 8.60261 13.5625 9.37822 13.5625 10.1739V12.0611H16.3359L15.8926 14.9694H13.5625V22C18.3432 21.2452 22 17.083 22 12.0611Z" fill="CurrentColor" />
                              {' '}
                            </svg>
                          </div>
                          {' '}
                        </a>
                        {' '}
                        <a href="#" className="footer3_social-link w-inline-block">
                          {' '}
                          <div className="icon-embed-xsmall w-embed">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {' '}
                              <path fillRule="evenodd" clipRule="evenodd" d="M16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3ZM19.25 16C19.2445 17.7926 17.7926 19.2445 16 19.25H8C6.20735 19.2445 4.75549 17.7926 4.75 16V8C4.75549 6.20735 6.20735 4.75549 8 4.75H16C17.7926 4.75549 19.2445 6.20735 19.25 8V16ZM16.75 8.25C17.3023 8.25 17.75 7.80228 17.75 7.25C17.75 6.69772 17.3023 6.25 16.75 6.25C16.1977 6.25 15.75 6.69772 15.75 7.25C15.75 7.80228 16.1977 8.25 16.75 8.25ZM12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5027 10.8057 16.0294 9.65957 15.1849 8.81508C14.3404 7.97059 13.1943 7.49734 12 7.5ZM9.25 12C9.25 13.5188 10.4812 14.75 12 14.75C13.5188 14.75 14.75 13.5188 14.75 12C14.75 10.4812 13.5188 9.25 12 9.25C10.4812 9.25 9.25 10.4812 9.25 12Z" fill="CurrentColor" />
                              {' '}
                            </svg>
                          </div>
                          {' '}
                        </a>
                        {' '}
                        <a href="#" className="footer3_social-link w-inline-block">
                          {' '}
                          <div className="icon-embed-xsmall w-embed">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {' '}
                              <path d="M17.1761 4H19.9362L13.9061 10.7774L21 20H15.4456L11.0951 14.4066L6.11723 20H3.35544L9.80517 12.7508L3 4H8.69545L12.6279 9.11262L17.1761 4ZM16.2073 18.3754H17.7368L7.86441 5.53928H6.2232L16.2073 18.3754Z" fill="CurrentColor" />
                              {' '}
                            </svg>
                          </div>
                          {' '}
                        </a>
                        {' '}
                        <a href="#" className="footer3_social-link w-inline-block">
                          {' '}
                          <div className="icon-embed-xsmall w-embed">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {' '}
                              <path fillRule="evenodd" clipRule="evenodd" d="M4.5 3C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3H4.5ZM8.52076 7.00272C8.52639 7.95897 7.81061 8.54819 6.96123 8.54397C6.16107 8.53975 5.46357 7.90272 5.46779 7.00413C5.47201 6.15897 6.13998 5.47975 7.00764 5.49944C7.88795 5.51913 8.52639 6.1646 8.52076 7.00272ZM12.2797 9.76176H9.75971H9.7583V18.3216H12.4217V18.1219C12.4217 17.742 12.4214 17.362 12.4211 16.9819V16.9818V16.9816V16.9815V16.9812C12.4203 15.9674 12.4194 14.9532 12.4246 13.9397C12.426 13.6936 12.4372 13.4377 12.5005 13.2028C12.7381 12.3253 13.5271 11.7586 14.4074 11.8979C14.9727 11.9864 15.3467 12.3141 15.5042 12.8471C15.6013 13.1803 15.6449 13.5389 15.6491 13.8863C15.6605 14.9339 15.6589 15.9815 15.6573 17.0292V17.0294C15.6567 17.3992 15.6561 17.769 15.6561 18.1388V18.3202H18.328V18.1149C18.328 17.6629 18.3278 17.211 18.3275 16.7591V16.759V16.7588C18.327 15.6293 18.3264 14.5001 18.3294 13.3702C18.3308 12.8597 18.276 12.3563 18.1508 11.8627C17.9638 11.1286 17.5771 10.5211 16.9485 10.0824C16.5027 9.77019 16.0133 9.5691 15.4663 9.5466C15.404 9.54401 15.3412 9.54062 15.2781 9.53721L15.2781 9.53721L15.2781 9.53721C14.9984 9.52209 14.7141 9.50673 14.4467 9.56066C13.6817 9.71394 13.0096 10.0641 12.5019 10.6814C12.4429 10.7522 12.3852 10.8241 12.2991 10.9314L12.2991 10.9315L12.2797 10.9557V9.76176ZM5.68164 18.3244H8.33242V9.76733H5.68164V18.3244Z" fill="CurrentColor" />
                              {' '}
                            </svg>
                          </div>
                          {' '}
                        </a>
                        {' '}
                        <a href="#" className="footer3_social-link w-inline-block">
                          {' '}
                          <div className="icon-embed-xsmall w-embed">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {' '}
                              <path fillRule="evenodd" clipRule="evenodd" d="M20.5686 4.77345C21.5163 5.02692 22.2555 5.76903 22.5118 6.71673C23.1821 9.42042 23.1385 14.5321 22.5259 17.278C22.2724 18.2257 21.5303 18.965 20.5826 19.2213C17.9071 19.8831 5.92356 19.8015 3.40294 19.2213C2.45524 18.9678 1.71595 18.2257 1.45966 17.278C0.827391 14.7011 0.871044 9.25144 1.44558 6.73081C1.69905 5.78311 2.44116 5.04382 3.38886 4.78753C6.96561 4.0412 19.2956 4.282 20.5686 4.77345ZM9.86682 8.70227L15.6122 11.9974L9.86682 15.2925V8.70227Z" fill="CurrentColor" />
                              {' '}
                            </svg>
                          </div>
                          {' '}
                        </a>
                        {' '}
                      </div>
                      {' '}
                    </div>
                    {' '}
                    <div className="w-layout-grid footer3_menu-wrapper">
                      {' '}
                      <div className="footer3_link-list">
                        {' '}
                        <a href="/" className="footer3_link">
                          Accueil
                        </a>
                        {' '}
                        <a href="/a-propos" className="footer3_link">
                          À propos
                        </a>
                        {' '}
                        <a href="/realisations" className="footer3_link">
                          Réalisations
                        </a>
                        {' '}
                        <a href="/formulaire" className="footer3_link">
                          Soumission
                        </a>
                        {' '}
                      </div>
                      {' '}
                      <div className="footer3_link-list">
                        {' '}
                        <a href="/renovation" aria-current="page" className="footer3_link w--current">
                          Rénovation
                        </a>
                        {' '}
                        <a href="/agrandissement-construction-neuve" className="footer3_link">
                          Agrandissement & Construction neuve
                        </a>
                        {' '}
                        <a href="/travaux-sur-mesure" className="footer3_link">
                          Travaux sur mesure
                        </a>
                        {' '}
                      </div>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="divider-horizontal"></div>
                {' '}
                <div className="padding-top padding-medium">
                  {' '}
                  <div className="footer3_bottom-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative' }}>
                    {' '}
                    <div className="footer3_credit-text" style={{ flex: '1' }}>
                      © 2025 SLC Habitation. Tous droits réservés.
                    </div>
                    {' '}
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                      {' '}
                      <p style={{ margin: '0', fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                        {' Fait localement par '}
                        <a href="https://kua.quebec" target="_blank" rel="noopener" style={{ color: '#d4a574', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                          {' '}
                          <img src="/images/black-letter-kua-logo.png" alt="KUA" style={{ height: '24px', width: 'auto', opacity: '0.8' }} />
                          {' '}
                        </a>
                        {' '}
                      </p>
                      {' '}
                    </div>
                    {' '}
                    <div className="w-layout-grid footer3_legal-list" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                      {' '}
                      <a href="/politique-de-cookie" className="footer3_legal-link">
                        Politique de cookies
                      </a>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </footer>
        {' '}
      </div>
      {' '}
    </>
  );
}
