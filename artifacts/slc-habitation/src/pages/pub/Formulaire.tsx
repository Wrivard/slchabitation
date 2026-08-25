import { PubLayout } from '@/components/pub/PubLayout';
import { QuoteForm } from '@/components/pub/QuoteForm';
import { ShieldCheck, Clock, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import { useMemo } from 'react';

export default function FormulairePub() {
  const [location] = useLocation();

  const defaultService = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const validServices = ['renovation-sous-sol', 'renovation-salle-de-bain', 'renovation-cuisine'];
    return validServices.includes(serviceParam || '') ? serviceParam! : '';
  }, [location]);

  return (
    <PubLayout>
      <section className="bg-background py-16 md:py-24 relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="container-large px-6 mx-auto max-w-3xl">
          <div className="text-center mb-10 fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading leading-tight text-foreground">
              Demande de soumission
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Veuillez remplir ce formulaire. Nous examinerons votre projet et vous contacterons pour discuter de vos besoins.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Licence RBQ : 8351-9033-59</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border hidden sm:flex">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">18 ans d'expérience</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border hidden sm:flex">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Laval et Laurentides</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-20 fade-up delay-100">
            <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-[3rem] -z-10"></div>
            <QuoteForm key={defaultService} defaultService={defaultService} />
          </div>
        </div>
      </section>
    </PubLayout>
  );
}