import { Link, useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

export function PubCTA({
  service,
  className = "",
  children = "Demander une soumission",
  testId
}: {
  service: string;
  className?: string;
  children?: React.ReactNode;
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
      className={`inline-flex items-center justify-center gap-3 rounded-none font-bold transition-all hover:bg-primary-foreground hover:text-primary border border-transparent hover:border-primary px-8 py-4 !bg-primary hover:!bg-white !text-primary-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-offset-2 focus-visible:!ring-primary !no-underline ${className}`}
      data-testid={testId || "link-pub-cta"}
      onClick={() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'quote_cta_click',
          service: serviceContext || 'formulaire',
          destination: '/pub/formulaire',
        });
      }}
    >
      {children} <ArrowRight className="w-5 h-5" />
    </Link>
  );
}