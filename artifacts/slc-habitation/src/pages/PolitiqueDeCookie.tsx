import { useRef } from 'react';

import { useSitePageBehaviors } from '@/lib/behaviors/site-page';

/**
 * Page « /politique-de-cookie ».
 *
 * Convertie depuis l'export Webflow (`site/politique-de-cookie.html`) : même balisage,
 * mêmes classes, mêmes textes, écrits en composants React plutôt qu'injectés
 * comme un bloc de HTML.
 */
export default function PolitiqueDeCookie() {
  const containerRef = useRef<HTMLDivElement>(null);

  useSitePageBehaviors(containerRef);


  return (
    <div ref={containerRef}>
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
                    <a href="/renovation" className="navbar3_dropdown-link w-dropdown-link">
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
                <a href="/soumission" className="navbar3_tablet-menu-button w-button">
                  Soumission
                </a>
                {' '}
              </nav>
              {' '}
              <a href="/" className="navbar3_logo-link w-nav-brand">
                <img sizes="(max-width: 479px) 86vw, 76.8125px" height="44px" alt="" src="/images/relume-567884.png" loading="eager" srcSet="/images/relume-567884-p-500.png 500w, /images/relume-567884.png 660w" className="navbar3_logo" />
              </a>
              {' '}
              <a id="w-node-e94d028c-b457-e648-e3c9-1bebe5f245fc-e5f245dc" href="/soumission" className="button w-button">
                Soumission
              </a>
              {' '}
              <div className="navbar3_menu-background"></div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <header className="section_header50 text-color-white color-scheme-3">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="container-large">
                {' '}
                <div className="padding-section-large">
                  {' '}
                  <div className="header50_component">
                    {' '}
                    <div data-reveal-group="" className="max-width-large">
                      {' '}
                      <div className="margin-bottom margin-xsmall">
                        {' '}
                        <div className="text-style-tagline text-color-white">
                          Confidentialité
                        </div>
                        {' '}
                      </div>
                      {' '}
                      <div className="margin-bottom margin-small">
                        {' '}
                        <h1 className="heading-style-h1">
                          Politique de cookie
                        </h1>
                        {' '}
                      </div>
                      {' '}
                      <p className="text-size-medium">
                        Comprendre comment nous utilisons les cookies pour améliorer votre expérience sur notre site web.
                      </p>
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
            <div className="header50_background-image-wrapper">
              {' '}
              <div className="image-overlay-layer-2"></div>
              <img sizes="(max-width: 3072px) 100vw, 3072px" srcSet="/images/52905772_2041603709290452_831293527185948672_n-p-500.jpg 500w, /images/52905772_2041603709290452_831293527185948672_n-p-800.jpg 800w, /images/52905772_2041603709290452_831293527185948672_n-p-1080.jpg 1080w, /images/52905772_2041603709290452_831293527185948672_n-p-1600.jpg 1600w, /images/52905772_2041603709290452_831293527185948672_n-p-2000.jpg 2000w, /images/52905772_2041603709290452_831293527185948672_n-p-2600.jpg 2600w, /images/52905772_2041603709290452_831293527185948672_n.jpg 3072w" alt="" src="/images/52905772_2041603709290452_831293527185948672_n.jpg" loading="eager" className="header50_background-image" />
              {' '}
            </div>
            {' '}
          </header>
          {' '}
          <section className="section_content28 cookie-policy-section color-scheme-1">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="container-large">
                {' '}
                <div className="padding-section-large">
                  {' '}
                  <div data-reveal-group="" className="content28_component">
                    {' '}
                    <div id="w-node-b3fae9bb-6517-4e0c-925b-25d6ed6350f6-11112a6f" className="max-width-large">
                      {' '}
                      <div className="text-rich-text w-richtext">
                        {' '}
                        <h2>
                          1. Introduction
                        </h2>
                        {' '}
                        <p>
                          {'La présente politique de cookies explique comment SLC Habitation (« nous », « notre » ou « la société ») utilise les cookies et technologies similaires sur notre site web '}
                          <strong>
                            slchabitation.com
                          </strong>
                          . Cette politique est conforme à la Loi 25 sur la protection des renseignements personnels dans le secteur privé du Québec.
                        </p>
                        {' '}
                        <p>
                          <strong>
                            Dernière mise à jour :
                          </strong>
                          {' 22 janvier 2025'}
                        </p>
                        {' '}
                        <h2>
                          2. Qu'est-ce qu'un cookie ?
                        </h2>
                        {' '}
                        <p>
                          Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, téléphone mobile) lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et préférences pendant une période déterminée, afin que vous n'ayez pas à les ressaisir à chaque fois que vous revenez sur le site ou naviguez d'une page à l'autre.
                        </p>
                        {' '}
                        <h2>
                          3. Types de cookies que nous utilisons
                        </h2>
                        {' '}
                        <h3>
                          3.1 Cookies essentiels (strictement nécessaires)
                        </h3>
                        {' '}
                        <p>
                          Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. Ils sont généralement définis en réponse à des actions que vous effectuez et qui équivalent à une demande de services, comme la définition de vos préférences de confidentialité, la connexion ou le remplissage de formulaires.
                        </p>
                        {' '}
                        <p>
                          <strong>
                            Exemples :
                          </strong>
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            Cookies de session pour maintenir votre connexion
                          </li>
                          {' '}
                          <li>
                            Cookies de consentement (Cookiebot) pour mémoriser vos préférences de cookies
                          </li>
                          {' '}
                          <li>
                            Cookies de sécurité pour protéger contre les attaques
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <p>
                          <strong>
                            Base légale :
                          </strong>
                          {' Ces cookies sont nécessaires au fonctionnement du site et ne nécessitent pas votre consentement conformément à la Loi 25.'}
                        </p>
                        {' '}
                        <h3>
                          3.2 Cookies analytiques et de performance
                        </h3>
                        {' '}
                        <p>
                          Ces cookies nous permettent de compter les visites et les sources de trafic afin d'améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus et les moins populaires et à voir comment les visiteurs se déplacent sur le site.
                        </p>
                        {' '}
                        <p>
                          <strong>
                            Exemples :
                          </strong>
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            <strong>
                              Google Tag Manager (GTM-PCNZTC97)
                            </strong>
                            {' : Gestion des balises et scripts de suivi'}
                          </li>
                          {' '}
                          <li>
                            Cookies d'analyse pour mesurer l'utilisation du site
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <p>
                          <strong>
                            Base légale :
                          </strong>
                          {' Ces cookies nécessitent votre consentement explicite avant d\'être activés. Vous pouvez les accepter ou les refuser via notre bannière de consentement Cookiebot.'}
                        </p>
                        {' '}
                        <h3>
                          3.3 Cookies de fonctionnalité
                        </h3>
                        {' '}
                        <p>
                          Ces cookies permettent au site web de fournir des fonctionnalités et une personnalisation améliorées. Ils peuvent être définis par nous ou par des fournisseurs tiers dont nous avons ajouté les services à nos pages.
                        </p>
                        {' '}
                        <p>
                          <strong>
                            Exemples :
                          </strong>
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            Cookies de préférences linguistiques
                          </li>
                          {' '}
                          <li>
                            Cookies de mémorisation des préférences utilisateur
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <p>
                          <strong>
                            Base légale :
                          </strong>
                          {' Ces cookies nécessitent votre consentement explicite.'}
                        </p>
                        {' '}
                        <h2>
                          4. Durée de conservation des cookies
                        </h2>
                        {' '}
                        <p>
                          Les cookies que nous utilisons ont différentes durées de vie :
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            <strong>
                              Cookies de session :
                            </strong>
                            {' Supprimés automatiquement lorsque vous fermez votre navigateur'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Cookies persistants :
                            </strong>
                            {' Restent sur votre appareil pendant une période déterminée (généralement entre 1 mois et 2 ans maximum) ou jusqu\'à ce que vous les supprimiez manuellement'}
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <h2>
                          5. Vos droits en vertu de la Loi 25
                        </h2>
                        {' '}
                        <p>
                          Conformément à la Loi 25 sur la protection des renseignements personnels dans le secteur privé du Québec, vous disposez des droits suivants :
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            <strong>
                              Droit d'accès :
                            </strong>
                            {' Vous avez le droit de savoir quels renseignements personnels nous détenons à votre sujet'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Droit de rectification :
                            </strong>
                            {' Vous pouvez demander la correction de renseignements inexacts ou incomplets'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Droit de retrait du consentement :
                            </strong>
                            {' Vous pouvez retirer votre consentement à tout moment pour les cookies non essentiels'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Droit de portabilité :
                            </strong>
                            {' Vous pouvez demander une copie de vos données dans un format structuré'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Droit de déposer une plainte :
                            </strong>
                            {' Vous pouvez déposer une plainte auprès de la Commission d\'accès à l\'information du Québec (CAI)'}
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <h2>
                          6. Gestion de vos préférences de cookies
                        </h2>
                        {' '}
                        <p>
                          Vous pouvez gérer vos préférences de cookies de plusieurs façons :
                        </p>
                        {' '}
                        <h3>
                          6.1 Via notre bannière de consentement
                        </h3>
                        {' '}
                        <p>
                          Lors de votre première visite, une bannière vous permet de choisir quels types de cookies vous acceptez. Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien « Politique de cookies » dans le pied de page.
                        </p>
                        {' '}
                        <h3>
                          6.2 Via les paramètres de votre navigateur
                        </h3>
                        {' '}
                        <p>
                          La plupart des navigateurs vous permettent de :
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            Voir quels cookies sont stockés sur votre appareil
                          </li>
                          {' '}
                          <li>
                            Supprimer tous les cookies ou des cookies spécifiques
                          </li>
                          {' '}
                          <li>
                            Bloquer les cookies de certains sites
                          </li>
                          {' '}
                          <li>
                            Bloquer les cookies de tiers
                          </li>
                          {' '}
                          <li>
                            Supprimer tous les cookies lorsque vous fermez le navigateur
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <p>
                          <strong>
                            Instructions par navigateur :
                          </strong>
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            <strong>
                              Chrome :
                            </strong>
                            {' Paramètres → Confidentialité et sécurité → Cookies et autres données de sites'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Firefox :
                            </strong>
                            {' Options → Vie privée et sécurité → Cookies et données de sites'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Safari :
                            </strong>
                            {' Préférences → Confidentialité → Cookies et données de sites web'}
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Edge :
                            </strong>
                            {' Paramètres → Cookies et autorisations de site → Cookies et données de sites'}
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <p>
                          <strong>
                            Note importante :
                          </strong>
                          {' La désactivation de certains cookies peut affecter le fonctionnement de certaines fonctionnalités de notre site web.'}
                        </p>
                        {' '}
                        <h2>
                          7. Cookies tiers
                        </h2>
                        {' '}
                        <p>
                          Certains cookies sont placés par des services tiers qui apparaissent sur nos pages. Nous n'avons pas de contrôle sur ces cookies tiers. Nous vous encourageons à consulter les politiques de cookies de ces services tiers :
                        </p>
                        {' '}
                        <ul>
                          {' '}
                          <li>
                            <strong>
                              Cookiebot :
                            </strong>
                            {' '}
                            <a href="https://www.cookiebot.com/fr/politique-de-confidentialite/" target="_blank" rel="noopener">
                              Politique de confidentialité Cookiebot
                            </a>
                          </li>
                          {' '}
                          <li>
                            <strong>
                              Google Tag Manager :
                            </strong>
                            {' '}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                              Politique de confidentialité Google
                            </a>
                          </li>
                          {' '}
                        </ul>
                        {' '}
                        <h2>
                          8. Sécurité et protection des données
                        </h2>
                        {' '}
                        <p>
                          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos renseignements personnels contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction.
                        </p>
                        {' '}
                        <p>
                          Les données collectées via les cookies sont stockées de manière sécurisée et ne sont utilisées que dans les limites décrites dans la présente politique.
                        </p>
                        {' '}
                        <h2>
                          9. Modifications de cette politique
                        </h2>
                        {' '}
                        <p>
                          Nous pouvons mettre à jour cette politique de cookies de temps à autre pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page avec une date de mise à jour révisée.
                        </p>
                        {' '}
                        <h2>
                          10. Contact et responsable de la protection des renseignements personnels
                        </h2>
                        {' '}
                        <p>
                          Pour toute question concernant cette politique de cookies ou pour exercer vos droits en vertu de la Loi 25, vous pouvez nous contacter :
                        </p>
                        {' '}
                        <p>
                          <strong>
                            SLC Habitation
                          </strong>
                          <br />
                          {' '}
                          <strong>
                            Courriel :
                          </strong>
                          {' '}
                          <a href="mailto:slchabitation@gmail.com">
                            slchabitation@gmail.com
                          </a>
                          <br />
                          {' '}
                          <strong>
                            Téléphone :
                          </strong>
                          {' '}
                          <a href="tel:+15144048494">
                            (514) 404-8494
                          </a>
                          <br />
                          {' '}
                          <strong>
                            Adresse :
                          </strong>
                          {' Saint-Eustache, QC'}
                        </p>
                        {' '}
                        <p>
                          {'Vous avez également le droit de déposer une plainte auprès de la '}
                          <strong>
                            Commission d'accès à l'information du Québec (CAI)
                          </strong>
                          {' si vous estimez que vos droits n\'ont pas été respectés :'}
                        </p>
                        {' '}
                        <p>
                          <strong>
                            Commission d'accès à l'information du Québec
                          </strong>
                          <br />
                          {' 575, rue Saint-Amable, bureau 1.10'}
                          <br />
                          {' Québec (Québec) G1R 2G4'}
                          <br />
                          {' Téléphone : 1-888-528-7741'}
                          <br />
                          {' Site web : '}
                          <a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noopener">
                            www.cai.gouv.qc.ca
                          </a>
                        </p>
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
          </section>
          {' '}
          <section className="section_testimonial6 testimonials-showcase color-scheme-2">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="container-large">
                {' '}
                <div className="padding-section-large">
                  {' '}
                  <div data-reveal-group="" className="testimonial6_component">
                    {' '}
                    <div className="margin-bottom margin-xxlarge">
                      {' '}
                      <div className="max-width-large">
                        {' '}
                        <div className="margin-bottom margin-small">
                          {' '}
                          <h2 className="heading-style-h2">
                            {'Témoignages '}
                            <span className="text-span-2">
                              clients
                            </span>
                          </h2>
                          {' '}
                        </div>
                        {' '}
                        <p className="text-size-medium">
                          Ce que disent ceux qui nous font confiance
                        </p>
                        {' '}
                      </div>
                      {' '}
                    </div>
                    {' '}
                    <div data-reveal-group-nested="" className="testimonial6_grid-list">
                      {' '}
                      <div className="testimonial6_content testimonials-card">
                        {' '}
                        <div className="margin-bottom margin-medium">
                          {' '}
                          <div className="testimonial6_rating-wrapper">
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <h3 className="heading-style-h6">
                          « Excellente compagnie, service professionnel et soucis du détails! Merci a votre équipe pour vos bon conseil. Je recommande a tous pour la réalisation de vos projet! »
                        </h3>
                        {' '}
                        <div className="margin-top margin-medium">
                          {' '}
                          <div className="testimonial6_client">
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="testimonial6_client-image-wrapper">
                                <img loading="eager" src="/images/relume-657333.png" alt="" className="testimonial6_client-image" />
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="testimonial6_client-info">
                                {' '}
                                <div className="text-weight-semibold">
                                  Mélodie Binette
                                </div>
                                {' '}
                                <div>
                                  Propriétaire, Laval
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
                      <div className="testimonial6_content testimonials-card">
                        {' '}
                        <div className="margin-bottom margin-medium">
                          {' '}
                          <div className="testimonial6_rating-wrapper">
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <h3 className="heading-style-h6">
                          «Magnifique travail de l’équipe SLC Habitation. Nous avions un projet complexe d’agrandissement et de rénovation d’une vieille maison avec plusieurs défis! Ils ont fait un travail exceptionnel!!! Un gros merci pour votre patience et votre professionnalisme! Je recommande sans hésiter! »
                        </h3>
                        {' '}
                        <div className="margin-top margin-medium">
                          {' '}
                          <div className="testimonial6_client">
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="testimonial6_client-image-wrapper">
                                <img loading="eager" src="/images/relume-657331.png" alt="" className="testimonial6_client-image" />
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="testimonial6_client-info">
                                {' '}
                                <div className="text-weight-semibold">
                                  Johanne Duguay
                                </div>
                                {' '}
                                <div>
                                  Propriétaire, Montréal
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
                      <div className="testimonial6_content testimonials-card">
                        {' '}
                        <div className="margin-bottom margin-medium">
                          {' '}
                          <div className="testimonial6_rating-wrapper">
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="testimonial6_rating-icon">
                              {' '}
                              <div className="icon-embed-xsmall w-embed">
                                <svg width="100%" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {' '}
                                  <path d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z" fill="currentColor" />
                                  {' '}
                                </svg>
                              </div>
                              {' '}
                            </div>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <h3 className="heading-style-h6">
                          « Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l’écoute, je recommande vivement! »
                        </h3>
                        {' '}
                        <div className="margin-top margin-medium">
                          {' '}
                          <div className="testimonial6_client">
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="testimonial6_client-image-wrapper">
                                <img loading="eager" src="/images/relume-657334.png" alt="" className="testimonial6_client-image" />
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="testimonial6_client-info">
                                {' '}
                                <div className="text-weight-semibold">
                                  Isabelle Baril
                                </div>
                                {' '}
                                <div>
                                  Propriétaire, Montréal
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
          </section>
          {' '}
          <section className="section_cta3 text-color-white color-scheme-3">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="container-large">
                {' '}
                <div className="padding-section-large">
                  {' '}
                  <div data-reveal-group="" className="cta3_component">
                    {' '}
                    <div className="max-width-large">
                      {' '}
                      <div className="margin-bottom margin-small">
                        {' '}
                        <h2 className="heading-style-h2">
                          Transformez votre espace aujourd'hui
                        </h2>
                        {' '}
                      </div>
                      {' '}
                      <p className="text-size-medium">
                        Découvrez nos services pour créer un espace qui vous ressemble et vous inspire.
                      </p>
                      {' '}
                      <div className="margin-top margin-medium">
                        {' '}
                        <div className="button-group">
                          {' '}
                          <a href="/soumission" className="button w-button">
                            Soumission en ligne
                          </a>
                          {' '}
                          <a href="#contact" className="button is-secondary is-alternate w-button">
                            Contactez-nous
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
            </div>
            {' '}
            <div className="cta3_background-image-wrapper">
              {' '}
              <div className="image-overlay-layer"></div>
              <img sizes="(max-width: 3072px) 100vw, 3072px" srcSet="/images/90639537_2793436424107173_8894610445172736000_n-p-500.jpg 500w, /images/90639537_2793436424107173_8894610445172736000_n-p-800.jpg 800w, /images/90639537_2793436424107173_8894610445172736000_n-p-1080.jpg 1080w, /images/90639537_2793436424107173_8894610445172736000_n-p-1600.jpg 1600w, /images/90639537_2793436424107173_8894610445172736000_n-p-2000.jpg 2000w, /images/90639537_2793436424107173_8894610445172736000_n-p-2600.jpg 2600w, /images/90639537_2793436424107173_8894610445172736000_n.jpg 3072w" alt="" src="/images/90639537_2793436424107173_8894610445172736000_n.jpg" loading="eager" className="cta3_background-image-position-center" />
              {' '}
            </div>
            {' '}
          </section>
          {' '}
          <section id="contact" className="section_contact16 color-scheme-2">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="container-large">
                {' '}
                <div className="padding-section-large">
                  {' '}
                  <div data-reveal-group="" className="contact16_component">
                    {' '}
                    <div className="margin-bottom margin-xxlarge">
                      {' '}
                      <div className="w-layout-grid contact16_content">
                        {' '}
                        <div className="contact16_content-left">
                          {' '}
                          <div className="max-width-large">
                            {' '}
                            <div className="margin-bottom margin-xsmall">
                              {' '}
                              <div className="text-style-tagline">
                                Contact
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div className="margin-bottom margin-small">
                              {' '}
                              <h2 className="heading-style-h2">
                                Démarrez votre projet maintenant
                              </h2>
                              {' '}
                            </div>
                            {' '}
                            <p className="text-size-medium">
                              Contactez notre équipe pour discuter de votre projet de rénovation ou construction.
                            </p>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <div className="contact16_content-right">
                          {' '}
                          <div className="w-layout-grid contact16_contact-list">
                            {' '}
                            <div id="w-node-e38c6ec8-eebd-6f74-b15f-2480144227d8-144227c5" className="contact16_item">
                              {' '}
                              <div className="contact16_item-icon-wrapper">
                                {' '}
                                <div className="icon-embed-xsmall w-embed">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                                    {' '}
                                    <path d="M3.05359 5.74219V18.9463H20.9462V6.13867L20.1708 6.64844L12.2147 11.8867C12.1544 11.9184 12.102 11.944 12.0565 11.9619C12.0534 11.9629 12.0366 11.9678 11.9999 11.9678C11.9626 11.9678 11.946 11.9628 11.9432 11.9619C11.8975 11.9439 11.8448 11.9186 11.7841 11.8867L4.05359 6.7959V6.39648L11.7264 11.4219L11.9999 11.6016L12.2733 11.4229L20.62 5.97266L21.6307 5.31152C21.6464 5.38933 21.6551 5.46973 21.6552 5.55371V18.4463C21.6552 18.7675 21.5429 19.041 21.2938 19.2891C21.0449 19.5371 20.7701 19.6494 20.4462 19.6494H3.55359C3.23187 19.6494 2.95869 19.5371 2.71082 19.2891L2.6239 19.1953C2.43623 18.9725 2.35046 18.7279 2.35046 18.4463V5.55371C2.35048 5.46519 2.35953 5.38047 2.37683 5.29883L3.05359 5.74219ZM3.55359 4.34473H20.4462C20.7696 4.34473 21.0438 4.4579 21.2928 4.70703H21.2938C21.4035 4.81669 21.485 4.93216 21.5438 5.05371H2.46082C2.5195 4.93172 2.60127 4.81595 2.71082 4.70605H2.71179C2.95976 4.45718 3.23251 4.34476 3.55359 4.34473Z" fill="currentColor" stroke="currentColor" />
                                    {' '}
                                  </svg>
                                </div>
                                {' '}
                              </div>
                              {' '}
                              <div className="contact16_item-text-wrapper">
                                {' '}
                                <div className="margin-bottom margin-xxsmall">
                                  {' '}
                                  <h3 className="heading-style-h6">
                                    Courriel
                                  </h3>
                                  {' '}
                                </div>
                                {' '}
                                <a href="mailto:slchabitation@gmail.com" className="text-style-link">
                                  slchabitation@gmail.com
                                </a>
                                {' '}
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div id="w-node-e38c6ec8-eebd-6f74-b15f-2480144227e1-144227c5" className="contact16_item">
                              {' '}
                              <div className="contact16_item-icon-wrapper">
                                {' '}
                                <div className="icon-embed-xsmall w-embed">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                                    {' '}
                                    <path d="M4.11902 3.34473H7.61902C7.80275 3.34474 7.93038 3.39945 8.03503 3.49805C8.12854 3.58614 8.20705 3.70059 8.2655 3.85156L8.31726 4.01465L8.9823 7.02832C9.01497 7.26011 9.00744 7.44511 8.97253 7.5918C8.94139 7.72276 8.8796 7.83104 8.78015 7.92578L8.77332 7.93164L6.25574 10.415L5.97644 10.6904L6.17664 11.0264C6.60337 11.7435 7.05685 12.416 7.53699 13.042C8.01981 13.6715 8.55599 14.2696 9.14441 14.8369C9.75779 15.4701 10.399 16.0453 11.0682 16.5605C11.7434 17.0804 12.4488 17.5353 13.1844 17.9248L13.5155 18.0996L13.7762 17.832L16.1815 15.3643L16.1913 15.3535C16.3309 15.2021 16.4775 15.111 16.6337 15.0645C16.7647 15.0256 16.8944 15.012 17.0253 15.0215L17.1571 15.0391L19.9774 15.6631C20.1431 15.7092 20.2749 15.7806 20.3817 15.875L20.4813 15.9775C20.5981 16.1186 20.6552 16.2764 20.6552 16.4707V19.8809C20.6552 20.1178 20.581 20.2895 20.4374 20.4316C20.2909 20.5766 20.1181 20.6494 19.8866 20.6494C18.0114 20.6494 16.0911 20.1991 14.1219 19.2842C12.1538 18.3698 10.3229 17.0691 8.62976 15.376C7.0427 13.7889 5.79967 12.0798 4.89539 10.249L4.71863 9.88086C3.80159 7.90938 3.35046 5.99008 3.35046 4.11914C3.35048 3.94128 3.39174 3.79881 3.47351 3.67773L3.56921 3.56348C3.71327 3.41863 3.88502 3.34473 4.11902 3.34473ZM4.06628 4.5752C4.09721 5.28818 4.20923 6.0365 4.39929 6.81836C4.59086 7.60639 4.89058 8.47618 5.2948 9.4248L5.58386 10.1035L6.1073 9.58301L8.12683 7.5752L8.32019 7.38281L8.26257 7.11621L7.69421 4.44922L7.60925 4.05371H4.04382L4.06628 4.5752ZM19.9462 16.377L19.5477 16.2949L17.0624 15.7803L16.7909 15.7246L16.5985 15.9248L14.6356 17.9824L14.1542 18.4863L14.787 18.7812C15.4818 19.1045 16.2353 19.3664 17.0448 19.5693C17.8555 19.7725 18.6477 19.8945 19.4208 19.9336L19.9462 19.96V16.377Z" fill="currentColor" stroke="currentColor" />
                                    {' '}
                                  </svg>
                                </div>
                                {' '}
                              </div>
                              {' '}
                              <div className="contact16_item-text-wrapper">
                                {' '}
                                <div className="margin-bottom margin-xxsmall">
                                  {' '}
                                  <h3 className="heading-style-h6">
                                    Téléphone
                                  </h3>
                                  {' '}
                                </div>
                                {' '}
                                <a href="tel:+15144048494" className="text-style-link">
                                  (514) 404-8494
                                </a>
                                {' '}
                              </div>
                              {' '}
                            </div>
                            {' '}
                            <div id="w-node-e38c6ec8-eebd-6f74-b15f-2480144227ea-144227c5" className="contact16_item">
                              {' '}
                              <div className="contact16_item-icon-wrapper">
                                {' '}
                                <div className="icon-embed-xsmall w-embed">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                                    {' '}
                                    <path d="M11.9999 2.34473C14.0242 2.34473 15.8029 3.04933 17.3553 4.47754C18.8789 5.87913 19.6552 7.7626 19.6552 10.1826C19.6551 11.1679 19.4382 12.1526 18.996 13.1406C18.5425 14.154 17.9734 15.1246 17.288 16.0527C16.5966 16.9889 15.8458 17.8627 15.035 18.6738C14.212 19.4974 13.4447 20.2259 12.7333 20.8594L12.7274 20.8643L12.7225 20.8691C12.632 20.9548 12.5274 21.017 12.4052 21.0566C12.2587 21.1041 12.1215 21.126 11.9921 21.126C11.8628 21.126 11.7292 21.104 11.5897 21.0576C11.474 21.0191 11.3759 20.959 11.2899 20.875L11.2811 20.8662L11.2714 20.8584C10.5564 20.2252 9.78741 19.497 8.96472 18.6738C8.15398 17.8627 7.40315 16.9889 6.71179 16.0527C6.02653 15.1248 5.45811 14.1547 5.00671 13.1416C4.56634 12.1534 4.35052 11.1682 4.35046 10.1826C4.35046 7.76231 5.12659 5.8791 6.64832 4.47754C8.19864 3.04953 9.9756 2.34475 11.9999 2.34473ZM11.9999 3.05371C10.0646 3.05371 8.40981 3.72261 7.06824 5.05664C5.71865 6.39887 5.05359 8.12233 5.05359 10.1826C5.0537 11.6021 5.6475 13.1413 6.75183 14.7861C7.85668 16.4317 9.49736 18.2606 11.6591 20.2715L11.996 20.585L12.3358 20.2764C14.5486 18.2689 16.2062 16.4381 17.2889 14.7852C18.3677 13.138 18.9461 11.5989 18.9462 10.1826C18.9462 8.12228 18.2812 6.39888 16.9315 5.05664V5.05566C15.5897 3.72177 13.935 3.05375 11.9999 3.05371ZM11.9979 8.70215C12.3641 8.7022 12.6619 8.82522 12.9188 9.08105C13.175 9.33617 13.2977 9.63248 13.2977 9.99805C13.2977 10.3642 13.1747 10.6605 12.9198 10.915C12.6649 11.1694 12.3682 11.292 12.0018 11.292C11.6348 11.2919 11.3391 11.169 11.0848 10.916C10.8313 10.6634 10.708 10.3691 10.7079 10.0029C10.7079 9.68146 10.8022 9.41279 10.996 9.17871L11.0848 9.08105C11.3378 8.82567 11.6324 8.70215 11.9979 8.70215Z" fill="currentColor" stroke="currentColor" />
                                    {' '}
                                  </svg>
                                </div>
                                {' '}
                              </div>
                              {' '}
                              <div className="contact16_item-text-wrapper">
                                {' '}
                                <div className="margin-bottom margin-xxsmall">
                                  {' '}
                                  <h3 className="heading-style-h6">
                                    Adresse
                                  </h3>
                                  {' '}
                                </div>
                                {' '}
                                <a href="#" className="text-style-link">
                                  Saint Eustache, QC
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
                    <div className="contact16_map-wrapper">
                      {' '}
                      <iframe src="https://www.google.com/maps/d/embed?mid=1k56IyW1TzLWOWD5u3sdZecuYDg8wjDg&ehbc=2E312F" className="contact16_map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="SLC Habitation - Zones de service"></iframe>
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
          </section>
          {' '}
          <section className="section_layout626 color-scheme-3">
            {' '}
            <div className="padding-global">
              {' '}
              <div className="container-large">
                {' '}
                <div className="padding-section-large">
                  {' '}
                  <div data-reveal-group="" className="layout626_component">
                    {' '}
                    <div className="margin-bottom margin-xxlarge">
                      {' '}
                      <div className="max-width-large">
                        {' '}
                        <div className="margin-bottom margin-xsmall">
                          {' '}
                          <div className="text-style-tagline">
                            Régions
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <div className="margin-bottom margin-small">
                          {' '}
                          <h2 className="heading-style-h2">
                            {'Nous servons les communautés de la '}
                            <span className="text-span-5">
                              région
                            </span>
                          </h2>
                          {' '}
                        </div>
                        {' '}
                        <p className="text-size-medium">
                          SLC Habitation intervient dans plusieurs municipalités des Laurentides et de Laval. Notre équipe se déplace régulièrement pour répondre aux besoins des propriétaires qui souhaitent rénover ou agrandir leur maison.
                        </p>
                        {' '}
                      </div>
                      {' '}
                    </div>
                    {' '}
                    <div className="layout626_list">
                      {' '}
                      <div className="w-layout-grid layout626_row">
                        {' '}
                        <div className="layout626_column">
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Saint-Eustache
                            </h3>
                            {' '}
                          </div>
                          {' '}
                          <div className="layout626_divider"></div>
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Mirabel
                            </h3>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <div className="layout626_divider hide-tablet"></div>
                        {' '}
                        <div className="layout626_column">
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Boisbriand
                            </h3>
                            {' '}
                          </div>
                          {' '}
                          <div className="layout626_divider"></div>
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Blainville
                            </h3>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                      </div>
                      {' '}
                      <div className="w-layout-grid layout626_row">
                        {' '}
                        <div className="layout626_column">
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Laval
                            </h3>
                            {' '}
                          </div>
                          {' '}
                          <div className="layout626_divider"></div>
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Terrebonne
                            </h3>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        {' '}
                        <div className="layout626_divider hide-tablet"></div>
                        {' '}
                        <div className="layout626_column">
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Sainte-Thérèse
                            </h3>
                            {' '}
                          </div>
                          {' '}
                          <div className="layout626_divider"></div>
                          {' '}
                          <div className="layout626_item">
                            {' '}
                            <h3 className="heading-style-h5">
                              Rosemère
                            </h3>
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
                          <img sizes="(max-width: 479px) 86vw, 76.8125px" height="44px" alt="" src="/images/relume-567884.png" loading="eager" srcSet="/images/relume-567884-p-500.png 500w, /images/relume-567884.png 660w" className="footer3_logo" />
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
                        <a href="/soumission" className="footer3_link">
                          Soumission
                        </a>
                        {' '}
                      </div>
                      {' '}
                      <div className="footer3_link-list">
                        {' '}
                        <a href="/renovation" className="footer3_link">
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
                      <a href="/politique-de-cookie" aria-current="page" className="footer3_legal-link w--current">
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
      <div data-back-to-top="wrap" className="back-top__wrap">
        {' '}
        <a aria-label="Contacter SLC Habitation sur Messenger" href="https://m.me/SLCHabitation" target="_blank" className="messenger_button w-inline-block">
          <img sizes="(max-width: 2008px) 100vw, 2008px" srcSet="/images/Messenger_Icon_Secondary_White-p-500.png 500w, /images/Messenger_Icon_Secondary_White-p-800.png 800w, /images/Messenger_Icon_Secondary_White-p-1080.png 1080w, /images/Messenger_Icon_Secondary_White-p-1600.png 1600w, /images/Messenger_Icon_Secondary_White-p-2000.png 2000w, /images/Messenger_Icon_Secondary_White.png 2008w" alt="" src="/images/Messenger_Icon_Secondary_White.png" loading="lazy" />
        </a>
        <button type="button" aria-label="Retour en haut" data-back-to-top="button" className="back-top__button">
          {' '}
          <div className="back-top__arrow-wrap">
            {' '}
            <div className="back-top__arrow-row">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 60 60" fill="none" className="back-top__arrow">
                {' '}
                <path d="M47.5 25L30 7.5L12.5 25" stroke="currentColor" strokeWidth="6" strokeMiterlimit="10" strokeLinecap="round" />
                {' '}
              </svg>
            </div>
            {' '}
          </div>
          {' '}
        </button>
        {' '}
      </div>
      {' '}
    </div>
  );
}
