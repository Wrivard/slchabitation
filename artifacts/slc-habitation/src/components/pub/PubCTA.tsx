import { Link, useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { isPaidPageSlug } from '@/lib/paid-pages';

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
    if (isPaidPageSlug(pathnameService)) return pathnameService;
    const queryService = new URLSearchParams(window.location.search).get('service') || '';
    return isPaidPageSlug(queryService) ? queryService : '';
  }, [location, service]);

  /* Page publicitaire d'où part le clic : le formulaire est commun à tout le
     site, ce paramètre garde la trace de l'annonce à l'origine de la demande. */
  const paidPageSlug = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const match = window.location.pathname.match(/^\/pub\/([a-z0-9-]+)\/?$/);
    return match && isPaidPageSlug(match[1]) ? match[1] : '';
  }, [location]);

  const href = useMemo(() => {
    if (typeof window === 'undefined') {
      return serviceContext ? `/soumission?service=${serviceContext}` : '/soumission';
    }
    const currentParams = new URLSearchParams(window.location.search);
    if (serviceContext) {
      currentParams.set('service', serviceContext);
    } else {
      currentParams.delete('service');
    }
    if (paidPageSlug) {
      currentParams.set('pub', paidPageSlug);
    }
    const query = currentParams.toString();
    return query ? `/soumission?${query}` : '/soumission';
  }, [location, serviceContext, paidPageSlug]);

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
          destination: '/soumission',
        });
        // Quand la route change, c'est le routeur qui remet la vue en haut :
        // remonter ici écraserait la position mémorisée pour le bouton Retour.
        // Il ne reste donc que le cas d'un clic depuis la page du formulaire.
        if (location === '/soumission') {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      }}
    >
      {children} <ArrowRight className="pub-button__icon" aria-hidden="true" />
    </Link>
  );
}
