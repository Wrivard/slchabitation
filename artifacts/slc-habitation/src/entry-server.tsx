import { renderToString } from 'react-dom/server';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import Formulaire from './pages/Formulaire';
import RenovationCuisine from './pages/RenovationCuisine';
import RenovationSalleDeBain from './pages/RenovationSalleDeBain';
import RenovationSousSol from './pages/RenovationSousSol';

/**
 * Anciennes adresses qui redirigent dès que l'application démarre.
 *
 * L'application ne monte jamais leur page : elle envoie aussitôt le visiteur
 * vers la page qui l'a remplacée. Leur document statique, lui, doit garder le
 * contenu d'origine — ces adresses sont indexées par les moteurs de recherche.
 * Ce contenu est produit ici en rendant leur page, comme pour le reste du site.
 */
const redirectPages: Record<string, () => React.JSX.Element> = {
  '/formulaire': Formulaire,
  '/renovation-cuisine': RenovationCuisine,
  '/renovation-salle-de-bain': RenovationSalleDeBain,
  '/renovation-sous-sol': RenovationSousSol,
};

/**
 * Point d'entrée du prérendu.
 *
 * Les pages statiques déposées dans `dist/public` sont produites en exécutant
 * ici la même application React que le navigateur. C'est ce qui garantit qu'un
 * visiteur, un robot d'indexation et un clic dans le site voient exactement la
 * même page : il n'existe plus de version « de secours » écrite à la main qui
 * puisse s'écarter du vrai site.
 */
export function renderRoute(pathname: string): string {
  return renderToString(
    <ErrorBoundary>
      <App ssrPath={pathname} />
    </ErrorBoundary>,
  );
}

/**
 * Contenu statique d'une ancienne adresse qui redirige au chargement.
 */
export function renderRedirectPage(pathname: string): string {
  const Page = redirectPages[pathname];
  if (!Page) {
    throw new Error(`« ${pathname} » n'est pas une ancienne adresse qui redirige.`);
  }

  return renderToString(<Page />);
}
