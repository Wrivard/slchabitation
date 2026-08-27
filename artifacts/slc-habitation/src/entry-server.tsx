import { renderToString } from 'react-dom/server';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

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
