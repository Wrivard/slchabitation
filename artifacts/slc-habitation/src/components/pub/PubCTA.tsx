import { Link, useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

export function PubCTA({
  service,
  className = "",
  children = "Demander une soumission",
  size = 'md',
  variant = 'primary',
  testId
}: {
  service: string;
  className?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'alternate';
  testId?: string;
}) {
  const [location] = useLocation();
  const serviceContext = useMemo(() => {
    if (service) return service;
    if (typeof window === 'undefined') return '';
    const pathnameService = window.location.pathname.replace(/^\/pub\//, '');
    const validServices = [
      'renovation-sous-sol',
      'renovation-salle-de-bain',
      'renovation-cuisine',
    ];
    if (validServices.includes(pathnameService)) return pathnameService;
    const queryService = new URLSearchParams(window.location.search).get('service') || '';
    return validServices.includes(queryService) ? queryService : '';
  }, [location, service]);

  const href = useMemo(() => {
    if (typeof window === 'undefined') {
      return serviceContext ? `/pub/formulaire?service=${serviceContext}` : '/pub/formulaire';
    }
    const currentParams = new URLSearchParams(window.location.search);
    if (serviceContext) {
      currentParams.set('service', serviceContext);
    } else {
      currentParams.delete('service');
    }
    const query = currentParams.toString();
    return query ? `/pub/formulaire?${query}` : '/pub/formulaire';
  }, [location, serviceContext]);

  return (
    <Link
      href={href}
      className={`pub-button pub-button--${size} pub-button--${variant} ${className}`.trim()}
      data-testid={testId || "link-pub-cta"}
      onClick={() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'quote_cta_click',
          service: serviceContext || 'formulaire',
          destination: '/pub/formulaire',
        });
        // Quand la route change, c'est le routeur qui remet la vue en haut :
        // remonter ici écraserait la position mémorisée pour le bouton Retour.
        // Il ne reste donc que le cas d'un clic depuis la page du formulaire.
        if (location === '/pub/formulaire') {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      }}
    >
      {children} <ArrowRight className="pub-button__icon" aria-hidden="true" />
    </Link>
  );
}
