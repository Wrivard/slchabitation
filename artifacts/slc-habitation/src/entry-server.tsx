import { renderToString } from 'react-dom/server';

import App, { type LegacyPages } from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import Home from '@/pages/Home';
import APropos from '@/pages/APropos';
import Renovation from '@/pages/Renovation';
import RenovationSousSol from '@/pages/RenovationSousSol';
import RenovationSalleDeBain from '@/pages/RenovationSalleDeBain';
import RenovationCuisine from '@/pages/RenovationCuisine';
import Agrandissement from '@/pages/Agrandissement';
import TravauxSurMesure from '@/pages/TravauxSurMesure';
import Realisations from '@/pages/Realisations';
import Merci from '@/pages/Merci';
import PolitiqueDeCookie from '@/pages/PolitiqueDeCookie';
import Unauthorized from '@/pages/Unauthorized';
import NotFoundPage from '@/pages/NotFoundPage';
import VerificationInteractions from '@/pages/VerificationInteractions';
import PolitiqueDeConfidentialite from '@/pages/PolitiqueDeConfidentialite';

const serverLegacyPages: LegacyPages = {
  Home, APropos, Renovation, RenovationSousSol, RenovationSalleDeBain,
  RenovationCuisine, Agrandissement, TravauxSurMesure, Realisations,
  Merci, PolitiqueDeCookie, Unauthorized, NotFoundPage,
  VerificationInteractions, PolitiqueDeConfidentialite,
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
      <App ssrPath={pathname} legacyPages={serverLegacyPages} />
    </ErrorBoundary>,
  );
}
