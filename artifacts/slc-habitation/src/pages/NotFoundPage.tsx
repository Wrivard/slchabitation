import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';

/**
 * Page 404 : le contenu utilitaire vient de l'export Webflow, mais il est
 * présenté dans la vraie navbar et le vrai pied de page comme le reste du site.
 * Les scripts legacy de la page d'origine ne sont pas repris : ils n'animent
 * rien ici et entreraient en conflit avec le contrôleur de la navbar partagée.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <SiteHeader />

      <main className="flex-grow">
        <div className="utility_component">
          <div className="utility_form-block w-form">
            <img
              src="https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg"
              alt=""
              className="utility_image"
            />
            <h1>Page introuvable</h1>
            <div className="padding-xxsmall"></div>
            <div>La page que vous cherchez n'existe pas ou a été déplacée.</div>
            <div className="padding-xxsmall"></div>
            <a href="/" className="button w-button">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
