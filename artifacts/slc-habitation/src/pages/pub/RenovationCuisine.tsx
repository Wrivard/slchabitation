import { PubLayout } from '@/components/pub/PubLayout';
import { QuoteForm } from '@/components/pub/QuoteForm';
import { FAQ } from '@/components/pub/FAQ';
import { CheckCircle2, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function RenovationCuisinePub() {
  return (
    <PubLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/60">
          <img 
            src="/images/relume-655453.jpeg" 
            alt="Cuisine moderne par SLC Habitation" 
            className="w-full h-full object-cover mix-blend-overlay"
            width="1407"
            height="1875"
          />
        </div>
        <div className="container-large relative z-10 px-6 mx-auto grid lg:grid-cols-12 gap-12 items-center max-w-7xl">
          <div className="lg:col-span-7 fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading leading-tight text-white">
              Rénovation de cuisine à Laval et dans les Laurentides
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Alliez ergonomie, rangement intelligent et design. Nous orchestrons la transformation complète de votre cuisine pour en faire une pièce maîtresse.
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
            <QuoteForm defaultService="renovation-cuisine" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
              Bien plus qu'un changement d'armoires
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nous prenons en charge la refonte architecturale de votre espace pour optimiser vos déplacements, maximiser le rangement et moderniser l'allure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-10 rounded-[2rem] border border-border hover:border-primary/50 transition-colors fade-up">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Optimisation spatiale</h3>
              <p className="text-muted-foreground">
                Nous repensons l'emplacement du frigo, de l'évier et de la cuisinière pour réduire vos déplacements et rendre l'espace de préparation intuitif.
              </p>
            </div>
            
            <div className="bg-card p-10 rounded-[2rem] border border-border hover:border-primary/50 transition-colors fade-up delay-100">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Mise aux normes électriques</h3>
              <p className="text-muted-foreground">
                Ajout d'îlots avec prises intégrées, éclairage encastré et circuits dédiés pour vos électroménagers.
              </p>
            </div>
            
            <div className="bg-card p-10 rounded-[2rem] border border-border hover:border-primary/50 transition-colors fade-up delay-200">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Coordination de projet</h3>
              <p className="text-muted-foreground">
                Démolition, plomberie, menuiserie, pose des comptoirs et dosserets. Un seul entrepreneur pour orchestrer tous les quarts de métier.
              </p>
            </div>
          </div>

          <div className="fade-up relative">
            <div className="absolute -inset-2 bg-secondary/5 rounded-[2rem] transform rotate-1 -z-10"></div>
            <img 
              src="/images/relume-567906.jpeg" 
              alt="Intérieur résidentiel rénové par SLC Habitation" 
              className="w-full h-[50vh] min-h-[300px] object-cover rounded-[2rem] shadow-xl border-4 border-white" 
              loading="lazy"
              width="1440"
              height="1440"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container-large px-6 mx-auto max-w-4xl">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-4">Questions fréquentes sur la rénovation de cuisine</h2>
            <p className="text-muted-foreground">Voici les réponses aux questions les plus courantes de nos clients.</p>
          </div>
          
          <div className="space-y-4 fade-up delay-100">
            <FAQ 
              question="Est-ce possible d'abattre un mur pour créer une aire ouverte ?" 
              answer="C'est souvent possible après avoir déterminé si le mur est porteur. Un ingénieur en structure peut être requis pour concevoir le soutien approprié." 
            />
            <FAQ 
              question="Doit-on commander les électroménagers avant le début des travaux ?" 
              answer="Il est recommandé de connaître leurs dimensions et leurs spécifications avant les travaux afin de planifier les armoires, prises et raccordements." 
            />
            <FAQ 
              question="Installez-vous des planchers chauffants dans la cuisine ?" 
              answer="Un plancher chauffant peut être intégré lorsque le système choisi est compatible avec le nouveau revêtement et les conditions d'installation." 
            />
            <FAQ 
              question="Quel est votre processus de travail ?" 
              answer="Nous commençons par écouter vos besoins et évaluer l'espace actuel. Nous préparons ensuite une soumission détaillée et, une fois approuvée, nous coordonnons l'ensemble des travaux." 
            />
            <FAQ 
              question="Combien coûte une rénovation de cuisine ?" 
              answer="Le coût dépend de l'ampleur des travaux, des modifications structurelles et des matériaux choisis. Nous fournissons une évaluation claire et détaillée de chaque aspect du projet." 
            />
            <FAQ 
              question="Utilisez-vous des matériaux durables ?" 
              answer="Absolument. Nous sélectionnons des matériaux de qualité supérieure qui résistent au temps et à l'usage quotidien." 
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
            « Excellente compagnie, service professionnel et soucis du détails! Merci a votre équipe pour vos bon conseil. Je recommande a tous pour la réalisation de vos projet! »
          </blockquote>
          <div className="font-bold text-foreground text-lg">Mélodie Binette</div>
          <div className="text-muted-foreground">Propriétaire, Laval</div>
        </div>
      </section>
    </PubLayout>
  );
}
