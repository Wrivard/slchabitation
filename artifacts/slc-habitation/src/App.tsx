import { type ReactNode } from 'react';
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
import Formulaire from '@/pages/Formulaire';
import Agrandissement from '@/pages/Agrandissement';
import TravauxSurMesure from '@/pages/TravauxSurMesure';
import Realisations from '@/pages/Realisations';
import Soumission from '@/pages/Soumission';
import PolitiqueDeCookie from '@/pages/PolitiqueDeCookie';
import Unauthorized from '@/pages/Unauthorized';
import NotFoundPage from '@/pages/NotFoundPage';
import StyleGuide from '@/pages/StyleGuide';

import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const metadata = metadataForPath(location);

  return (
    <RoutedErrorBoundary>
      <PageMetadata {...metadata} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/a-propos" component={APropos} />
        <Route path="/renovation" component={Renovation} />
        <Route path="/renovation-sous-sol" component={RenovationSousSol} />
        <Route path="/renovation-salle-de-bain" component={RenovationSalleDeBain} />
        <Route path="/renovation-cuisine" component={RenovationCuisine} />
        <Route path="/formulaire" component={Formulaire} />
        <Route path="/agrandissement-construction-neuve" component={Agrandissement} />
        <Route path="/travaux-sur-mesure" component={TravauxSurMesure} />
        <Route path="/realisations" component={Realisations} />
        <Route path="/soumission" component={Soumission} />
        <Route path="/politique-de-cookie" component={PolitiqueDeCookie} />
        <Route path="/401.html" component={Unauthorized} />
        <Route path="/404.html" component={NotFoundPage} />
        <Route path="/style-guide-a2eb197e-ef3b-4620-ad8c-6507e3057840.html" component={StyleGuide} />
        
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
