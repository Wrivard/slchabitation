import { PubLayout } from '@/components/pub/PubLayout';
import { QuoteForm } from '@/components/pub/QuoteForm';
import { FAQ } from '@/components/pub/FAQ';
import { CheckCircle2, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function RenovationSalleDeBainPub() {
  return (
    <PubLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/60">
          <img 
            src="/images/relume-567908.jpeg" 
            alt="Salle de bain élégante par SLC Habitation" 
            className="w-full h-full object-cover mix-blend-overlay"
            width="1440"
            height="1440"
          />
        </div>
        <div className="container-large relative z-10 px-6 mx-auto grid lg:grid-cols-12 gap-12 items-center max-w-7xl">
          <div className="lg:col-span-7 fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading leading-tight text-white">
              Rénovation de salle de bain à Laval et dans les Laurentides
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              De la douche italienne au bain autoportant, nous créons des espaces sur mesure. Nous gérons la plomberie, l'électricité et la céramique avec minutie.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-white">Licence RBQ : 8351-9033-59</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-white">18 ans d'expérience</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-white">Laval et Laurentides</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative z-20">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-[3rem] -z-10"></div>
            <QuoteForm defaultService="renovation-salle-de-bain" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative fade-up">
              <div className="absolute -inset-4 bg-secondary/5 rounded-[2rem] transform -rotate-3 transition-transform hover:-rotate-6 duration-700"></div>
              <img 
                src="/images/relume-655419.jpeg" 
                alt="Détail de salle de bain" 
                className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-square object-center border-4 border-white"
                loading="lazy"
                width="800"
                height="800"
              />
            </div>

            <div className="order-1 md:order-2 fade-up delay-200">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">L'Excellence Technique</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
                Une esthétique soignée repose sur une exécution rigoureuse
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Une rénovation de salle de bain nécessite une expertise technique. Une mauvaise étanchéité peut causer des dégâts majeurs. C'est pourquoi nous accordons une grande importance aux matériaux dissimulés derrière vos murs.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">Étanchéité planifiée</h3>
                    <p className="text-muted-foreground">
                      Nous installons des systèmes d'imperméabilisation reconnus dans l'industrie pour protéger la structure contre les infiltrations.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">Pose de céramique précise</h3>
                    <p className="text-muted-foreground">
                      Mosaïque, grand format, niches encastrées : nos carreleurs maîtrisent les techniques complexes pour des lignes droites et des coupes précises.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">Ventilation et chauffage</h3>
                    <p className="text-muted-foreground">
                      Possibilité d'intégrer des planchers chauffants et des systèmes d'extraction d'air performants pour un confort optimisé au quotidien.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container-large px-6 mx-auto max-w-4xl">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-4">Questions fréquentes sur la rénovation de salle de bain</h2>
            <p className="text-muted-foreground">Voici les réponses aux questions les plus courantes de nos clients.</p>
          </div>
          
          <div className="space-y-4 fade-up delay-100">
            <FAQ 
              question="Faut-il refaire toute la plomberie lors d'une rénovation ?" 
              answer="Pas systématiquement. La plomberie doit toutefois être adaptée si les appareils sont déplacés, et son état peut être évalué lorsque les murs sont ouverts." 
            />
            <FAQ 
              question="Comment assurer une bonne étanchéité pour une douche italienne ?" 
              answer="Une douche italienne exige une imperméabilisation soignée. Un système de membrane appliqué sur les murs et le plancher, avec un drain adapté et une pente précise, forme une barrière continue avant la pose de la céramique." 
            />
            <FAQ 
              question="Peut-on installer un plancher chauffant sous n'importe quel revêtement ?" 
              answer="La compatibilité dépend du système et du revêtement. La céramique et la pierre conduisent bien la chaleur; les spécifications du fabricant doivent être vérifiées pour les autres matériaux." 
            />
            <FAQ 
              question="Quel est votre processus de travail ?" 
              answer="Nous commençons par écouter vos besoins. Ensuite, notre équipe évalue le projet sur place, puis nous préparons une soumission détaillée. Une fois approuvée, nous exécutons le travail avec rigueur." 
            />
            <FAQ 
              question="Combien coûte une rénovation de salle de bain ?" 
              answer="Le coût dépend de l'ampleur et de la complexité de votre projet, ainsi que des matériaux choisis. Nous offrons des soumissions détaillant chaque aspect des travaux." 
            />
            <FAQ 
              question="Utilisez-vous des matériaux durables ?" 
              answer="Absolument. Nous sélectionnons des matériaux de qualité qui résistent au temps et à l'humidité pour assurer la pérennité de votre investissement." 
            />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container-large px-6 mx-auto max-w-4xl text-center fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/></svg>
          </div>
          <blockquote className="text-2xl md:text-3xl font-heading font-medium text-foreground mb-8 leading-snug">
            « Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l'écoute, je recommande vivement! »
          </blockquote>
          <div className="font-bold text-foreground text-lg">Isabelle Baril</div>
          <div className="text-muted-foreground">Propriétaire, Montréal</div>
        </div>
      </section>
    </PubLayout>
  );
}
