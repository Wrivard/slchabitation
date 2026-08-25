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

  const href = useMemo(() => {
    if (typeof window === 'undefined') return `/pub/formulaire?service=${service}`;
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('service', service);
    return `/pub/formulaire?${currentParams.toString()}`;
  }, [location, service]);

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl !bg-[hsl(26,91%,55%)] hover:!bg-[hsl(26,91%,50%)] !text-white focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-offset-2 focus-visible:!ring-[hsl(26,91%,55%)] active-elevate ${className}`}
      data-testid={testId || "link-pub-cta"}
      onClick={() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'quote_cta_click',
          service,
          destination: '/pub/formulaire',
        });
      }}
    >
      {children} <ArrowRight className="w-5 h-5" />
    </Link>
  );
}