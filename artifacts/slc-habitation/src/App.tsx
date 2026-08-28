import { type ReactNode, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { PageMetadata, metadataForPath } from '@/components/page-metadata';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import Home from '@/pages/Home';
import APropos from '@/pages/APropos';
import Renovation from '@/pages/Renovation';
import RenovationSousSol from '@/pages/RenovationSousSol';
import RenovationSalleDeBain from '@/pages/RenovationSalleDeBain';
import RenovationCuisine from '@/pages/RenovationCuisine';
import Agrandissement from '@/pages/Agrandissement';
import TravauxSurMesure from '@/pages/TravauxSurMesure';
import Realisations from '@/pages/Realisations';
import Soumission from '@/pages/Soumission';
import Merci from '@/pages/Merci';
import PolitiqueDeCookie from '@/pages/PolitiqueDeCookie';
import Unauthorized from '@/pages/Unauthorized';
import NotFoundPage from '@/pages/NotFoundPage';
import VerificationInteractions from '@/pages/VerificationInteractions';

// New Pub Routes
import RenovationSousSolPub from '@/pages/pub/RenovationSousSol';
import RenovationSalleDeBainPub from '@/pages/pub/RenovationSalleDeBain';
import RenovationCuisinePub from '@/pages/pub/RenovationCuisine';
import AgrandissementPub from '@/pages/pub/Agrandissement';
import PolitiqueDeConfidentialite from '@/pages/PolitiqueDeConfidentialite';

import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function FunnelRedirect({ to }: { to: string }) {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate(`${to}${window.location.search}`, { replace: true });
  }, [navigate, to]);

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-center text-foreground">
      <p data-testid="status-funnel-redirect">Redirection vers le formulaire de soumission…</p>
    </main>
  );
}

function FormulaireRedirect() {
  return <FunnelRedirect to="/soumission" />;
}

/**
 * Une navigation interne doit toujours afficher le haut de la nouvelle page :
 * sans cela, un visiteur qui clique sur « Obtenir une soumission » depuis le bas
 * d'une page publicitaire arrive au milieu du formulaire.
 *
 * Deux exceptions : les ancres internes (`#visite`, `#faq`), qui gardent leur
 * comportement, et les retours arrière du navigateur, où c'est la position
 * mémorisée qui doit être restaurée. Le drapeau `popstate` est remis à zéro
 * dans une tâche différée : les effets React déclenchés par la navigation
 * s'exécutent avant, les clics suivants sont donc traités normalement.
 */
function useScrollToTopOnNavigation(location: string) {
  const previousLocation = useRef<string | null>(null);
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const markHistoryNavigation = () => {
      isHistoryNavigation.current = true;
      window.setTimeout(() => {
        isHistoryNavigation.current = false;
      }, 0);
    };

    window.addEventListener('popstate', markHistoryNavigation);
    return () => window.removeEventListener('popstate', markHistoryNavigation);
  }, []);

  useEffect(() => {
    const isFirstRender = previousLocation.current === null;
    const hasChanged = previousLocation.current !== location;
    previousLocation.current = location;

    if (isFirstRender || !hasChanged) return;
    if (isHistoryNavigation.current) return;
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);
}

function Router() {
  const [location] = useLocation();
  const metadata = metadataForPath(location);
  useScrollToTopOnNavigation(location);

  return (
    <RoutedErrorBoundary>
      <PageMetadata {...metadata} />
      <Switch>
        {/* Main Site Routes */}
        <Route path="/" component={Home} />
        <Route path="/a-propos" component={APropos} />
        <Route path="/renovation" component={Renovation} />
        <Route path="/renovation-sous-sol" component={RenovationSousSol} />
        <Route path="/renovation-salle-de-bain" component={RenovationSalleDeBain} />
        <Route path="/renovation-cuisine" component={RenovationCuisine} />
        {/* L'ancien formulaire est conservé comme alias historique de /soumission. */}
        <Route path="/formulaire" component={FormulaireRedirect} />
        <Route path="/agrandissement-construction-neuve" component={Agrandissement} />
        <Route path="/travaux-sur-mesure" component={TravauxSurMesure} />
        <Route path="/realisations" component={Realisations} />
        <Route path="/soumission" component={Soumission} />
        <Route path="/merci" component={Merci} />
        <Route path="/politique-de-cookie" component={PolitiqueDeCookie} />
        <Route path="/401.html" component={Unauthorized} />
        <Route path="/404.html" component={NotFoundPage} />
        {/* Banc d'essai des interactions reprises du site hérité : hors menu,
            hors plan de site, jamais prérendu. */}
        <Route path="/verification-interactions" component={VerificationInteractions} />
        
        {/* Paid Funnel (Pub) Routes */}
        <Route path="/pub/renovation-sous-sol" component={RenovationSousSolPub} />
        <Route path="/pub/renovation-salle-de-bain" component={RenovationSalleDeBainPub} />
        <Route path="/pub/renovation-cuisine" component={RenovationCuisinePub} />
        <Route path="/pub/agrandissement-maison" component={AgrandissementPub} />
        {/* L'ancienne page du tunnel publicitaire a été fusionnée avec /soumission. */}
        <Route path="/pub/formulaire" component={FormulaireRedirect} />
        <Route path="/politique-de-confidentialite" component={PolitiqueDeConfidentialite} />

        {/* Fallback to NotFoundPage (the one from Webflow) for custom 404 */}
        <Route component={NotFoundPage} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

/**
 * `ssrPath` n'est utilisé que par le prérendu : il indique la page à rendre
 * puisqu'il n'y a pas de barre d'adresse côté serveur. Dans le navigateur, la
 * propriété reste absente et wouter lit l'URL courante comme avant.
 */
function App({ ssrPath }: { ssrPath?: string } = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')} ssrPath={ssrPath}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
