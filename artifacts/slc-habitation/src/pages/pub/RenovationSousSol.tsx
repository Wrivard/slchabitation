import { PubLayout } from '@/components/pub/PubLayout';
import { QuoteForm } from '@/components/pub/QuoteForm';
import { FAQ } from '@/components/pub/FAQ';
import { CheckCircle2, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function RenovationSousSolPub() {
  return (
    <PubLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/60">
          <img 
            src="/images/relume-657406.jpeg" 
            alt="Sous-sol aménagé par SLC Habitation" 
            className="w-full h-full object-cover mix-blend-overlay"
            width="2048"
            height="1536"
          />
        </div>
        <div className="container-large relative z-10 px-6 mx-auto grid lg:grid-cols-12 gap-12 items-center max-w-7xl">
          <div className="lg:col-span-7 fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading leading-tight text-white">
              Rénovation de sous-sol à Laval et dans les Laurentides
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Transformez votre sous-sol avec une finition soignée. Nous concevons et réalisons des projets sur mesure adaptés à vos besoins.
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
            <QuoteForm defaultService="renovation-sous-sol" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Notre Différence</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground font-heading">
                Pourquoi confier votre sous-sol à nos experts ?
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Isolation et confort maîtrisés</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous évaluons les signes d'humidité, planifions l'isolation et proposons des solutions d'insonorisation adaptées à l'usage prévu de la pièce.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Agencement intelligent</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous repensons la configuration pour dissimuler la mécanique du bâtiment tout en préservant la hauteur sous plafond.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Coordination de projet</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Un seul entrepreneur pour orchestrer tous les quarts de métier, assurant un processus structuré et transparent de la démolition à la finition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative fade-up delay-200">
              <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] transform rotate-3 transition-transform hover:rotate-6 duration-700"></div>
              <img 
                src="/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg" 
                alt="Sous-sol après des travaux de finition" 
                className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5] object-center border-4 border-white"
                loading="lazy"
                width="800"
                height="1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container-large px-6 mx-auto max-w-4xl">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-4">Questions fréquentes sur la rénovation de sous-sol</h2>
            <p className="text-muted-foreground">Voici les réponses aux questions les plus courantes de nos clients.</p>
          </div>
          
          <div className="space-y-4 fade-up delay-100">
            <FAQ 
              question="Quelles sont les étapes pour insonoriser un sous-sol ?" 
              answer="L'approche dépend de la structure et de l'usage prévu. Elle peut comprendre des barres résilientes, de la laine insonorisante et des couches de gypse adaptées." 
            />
            <FAQ 
              question="Faut-il traiter l'humidité avant de finir le sous-sol ?" 
              answer="Oui. Il faut d'abord vérifier les signes d'infiltration, l'état de la fondation et le taux d'humidité avant de planifier l'isolation et la finition." 
            />
            <FAQ 
              question="Est-ce possible d'ajouter une salle de bain au sous-sol si la plomberie n'est pas prévue ?" 
              answer="C'est souvent possible après une évaluation des drains, du renvoi principal et de la dalle afin de déterminer les travaux de plomberie requis." 
            />
            <FAQ 
              question="Quel est votre processus de travail ?" 
              answer="Nous commençons par écouter vos besoins et votre vision. Ensuite, notre équipe évalue le projet sur place, puis nous préparons une soumission détaillée. Une fois approuvée, nous exécutons le travail avec rigueur." 
            />
            <FAQ 
              question="Combien coûte une rénovation ?" 
              answer="Le coût dépend de l'ampleur et de la complexité de votre projet. Nous offrons des soumissions détaillant chaque aspect des travaux." 
            />
            <FAQ 
              question="Utilisez-vous des matériaux durables ?" 
              answer="Absolument. Nous sélectionnons des matériaux de qualité qui résistent au temps pour assurer la pérennité de votre investissement." 
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
            « Magnifique travail de l'équipe SLC Habitation. Nous avions un projet complexe d'agrandissement et de rénovation d'une vieille maison avec plusieurs défis! Ils ont fait un travail exceptionnel!!! Un gros merci pour votre patience et votre professionnalisme! Je recommande sans hésiter! »
          </blockquote>
          <div className="font-bold text-foreground text-lg">Johanne Duguay</div>
          <div className="text-muted-foreground">Propriétaire, Montréal</div>
        </div>
      </section>
    </PubLayout>
  );
}
