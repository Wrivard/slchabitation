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
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 px-6 py-3 !bg-primary hover:!bg-primary/90 !text-primary-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-offset-2 focus-visible:!ring-primary ${className}`}
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