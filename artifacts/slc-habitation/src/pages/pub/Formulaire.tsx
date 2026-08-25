import { PubLayout } from '@/components/pub/PubLayout';
import { QuoteForm } from '@/components/pub/QuoteForm';
import { FAQ } from '@/components/pub/FAQ';
import { ShieldCheck, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

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
      <section className="bg-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-[800px] bg-primary/5 rounded-none l-[100px] -z-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-[500px] bg-accent/30 rounded-none r-[100px] -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20 lg:py-24">
          <div className="lg:hidden mb-8">
            <p className="text-primary text-sm font-bold uppercase tracking-[0.18em] mb-3">Demande de soumission</p>
            <h1 className="text-4xl font-bold font-heading leading-tight text-foreground">
              Parlons de votre projet de rénovation
            </h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Trois étapes simples pour nous transmettre les renseignements essentiels sur votre projet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left Column: Context, Trust, and Narrative */}
            <motion.div
              className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5 space-y-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="hidden lg:block space-y-6">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
                  Demande de soumission
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-[1.1] text-foreground tracking-tight">
                  Parlons de votre <span className="text-primary italic font-serif pr-2">projet</span> de rénovation.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Décrivez-nous l’espace que vous souhaitez rénover à Laval ou dans les Laurentides. Ces premiers renseignements nous aideront à préparer une discussion adaptée à votre propriété.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-5 rounded-none bg-white border border-border/50">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Licence RBQ</h4>
                  <p className="text-sm text-muted-foreground">8351-9033-59</p>
                </div>
                <div className="flex flex-col gap-2 p-5 rounded-none bg-white border border-border/50">
                  <Clock className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-foreground">18 ans d’expérience</h4>
                  <p className="text-sm text-muted-foreground">En rénovation résidentielle</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3" aria-label="Les trois étapes du formulaire">
                {[
                  ['01', 'Projet'],
                  ['02', 'Détails'],
                  ['03', 'Coordonnées'],
                ].map(([number, label]) => (
                  <div key={number} className="rounded-none border border-border bg-white p-4">
                    <span className="text-xs font-bold text-primary tracking-wider">{number}</span>
                    <p className="font-semibold text-foreground mt-2">{label}</p>
                  </div>
                ))}
              </div>

              <div className="relative rounded-none overflow-hidden aspect-[4/3]">
                <img
                  src="/images/relume-567906.jpeg"
                  alt="Exemple d’un espace intérieur rénové"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="1440"
                  height="1440"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-2xl font-bold font-heading text-foreground">Questions fréquentes</h3>
                <div className="space-y-3">
                  <FAQ
                    question="Comment fonctionne le processus de soumission ?"
                    answer="Après l’envoi du formulaire, notre équipe examine les renseignements transmis afin de préparer la discussion. Une visite peut ensuite être planifiée lorsque l’évaluation sur place est nécessaire pour préciser la portée des travaux."
                  />
                  <FAQ
                    question="Combien de temps faut-il pour démarrer les travaux ?"
                    answer="Le calendrier précis de votre projet sera discuté et établi suite à notre évaluation initiale. L'échéancier dépendra de l'envergure des travaux, de la préparation nécessaire et de nos disponibilités."
                  />
                  <FAQ
                    question="Comment encadrez-vous les projets ?"
                    answer="Les modalités du contrat, les responsabilités de chaque partie et les éléments propres au projet seront expliqués lors de l'évaluation."
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column: The Form */}
            <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7 lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative bg-white p-6 sm:p-8 md:p-10 border border-border">
                  <QuoteForm key={defaultService} defaultService={defaultService} />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </PubLayout>
  );
}