import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { FAQ } from '@/components/pub/FAQ';
import { ShieldCheck, Clock, MapPin, ShowerHead, Grid2X2, Fan, Bath, Box, Lightbulb, ClipboardCheck } from 'lucide-react';

export default function RenovationSalleDeBainPub() {
  return (
    <PubLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground pt-20 pb-28 md:pt-32 md:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/60">
          <img
            src="/images/relume-567908.jpeg"
            alt="Salle de bain élégante par SLC Habitation"
            className="w-full h-full object-cover mix-blend-overlay"
            width="1440"
            height="1440"
          />
        </div>
        <div className="container-large relative z-10 px-6 mx-auto flex flex-col items-center text-center max-w-4xl fade-up">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium text-white tracking-wide">Licence RBQ : 8351-9033-59</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hidden sm:flex">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium text-white tracking-wide">18 ans d'expérience</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hidden sm:flex">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium text-white tracking-wide">Laval et Laurentides</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading leading-tight text-white tracking-tight">
            Rénovation de salle de bain{' '}<br/>à Laval et dans les Laurentides
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Un espace de détente exceptionnel repose sur une exécution technique soignée. Nous coordonnons chaque détail, de la plomberie à la pose de céramique.
          </p>

          <PubCTA service="renovation-salle-de-bain" className="text-lg px-8 py-5" testId="button-hero-cta" />
        </div>
      </section>

      {/* Configurations */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Configurations et matériaux</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
              Personnalisation de votre espace
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nous coordonnons l'installation de chaque composante pour créer un aménagement harmonieux, adapté à vos préférences et à la superficie disponible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShowerHead className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Douches sur mesure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Douches à l'italienne ou avec base, intégration de niches encastrées et sélection de parois vitrées adaptées à la configuration de la pièce.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-100 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bath className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Bains autoportants</h3>
              <p className="text-muted-foreground leading-relaxed">
                Évaluation de l'espace pour l'intégration d'un bain autoportant, planification de la robinetterie murale ou sur pied pour une esthétique épurée.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-200 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Vanités et rangement</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimisation du rangement avec des meubles-lavabos bien proportionnés, accompagnés d'un éclairage adapté pour faciliter vos routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-24 bg-background">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 relative fade-up">
              <div className="aspect-square rounded-[2rem] overflow-hidden relative border-8 border-white shadow-2xl z-10">
                <img
                  src="/images/relume-655419.jpeg"
                  alt="Détail de pose de céramique"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="800"
                  height="800"
                />
              </div>
              <div className="absolute -inset-6 bg-secondary/5 rounded-[3rem] transform -rotate-3 -z-10"></div>
            </div>

            <div className="lg:col-span-6 fade-up delay-200">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">L'Excellence Technique</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
                Une esthétique soignée repose sur une exécution méthodique
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Une salle de bain nécessite une attention particulière à l'imperméabilisation pour préserver l'intégrité de la structure. Notre approche tient compte des matériaux invisibles autant que des finitions apparentes.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Grid2X2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground font-heading">Étanchéité adéquate</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Application de membranes d'imperméabilisation appropriées pour les zones humides, favorisant une protection durable contre les infiltrations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground font-heading">Pose de céramique soignée</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Qu'il s'agisse de mosaïque ou de céramique grand format, nos équipes portent une grande attention à l'alignement et aux détails de finition.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Fan className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground font-heading">Confort thermique et ventilation</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Intégration de systèmes d'extraction d'air performants et possibilité de planchers chauffants pour un confort optimisé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="py-24 bg-muted/10 border-t border-border">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="max-w-3xl mb-16 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Évaluation technique</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
              Analyse préalable à votre projet
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Les maisons de Laval et des Laurentides présentent des dispositions de plomberie et des structures variées. Une planification soignée débute toujours par une évaluation technique des éléments en place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 fade-up delay-100">
            {[
              { title: "Sens des solives", desc: "Analyse de la structure du plancher pour déterminer les possibilités de cheminement des nouveaux drains." },
              { title: "Réseau de ventilation", desc: "Vérification du parcours possible pour l'évacuation de l'air humide vers l'extérieur du bâtiment." },
              { title: "État du sous-plancher", desc: "Inspection de la solidité du plancher existant pour s'assurer qu'il supportera le poids de la céramique." },
              { title: "Capacité électrique", desc: "Évaluation du panneau pour l'ajout potentiel d'un plancher chauffant ou d'un nouvel éclairage." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground font-heading">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Testimonial */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container-large px-6 mx-auto max-w-4xl text-center fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/></svg>
          </div>
          <blockquote className="text-2xl md:text-4xl font-heading font-medium text-white mb-10 leading-snug">
            « Plusieurs projets avec cette équipe et toujours ultra satisfaite! Fiable, à l'écoute, je recommande vivement! »
          </blockquote>
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-white text-lg tracking-wide">Isabelle Baril</div>
            <div className="text-gray-400">Propriétaire</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container-large px-6 mx-auto max-w-4xl">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground text-lg">Pour vous aider à mieux planifier la rénovation de votre salle de bain.</p>
          </div>

          <div className="space-y-4 fade-up delay-100">
            <FAQ
              question="Faut-il refaire toute la plomberie lors d'une rénovation ?"
              answer="Ce n'est pas systématique. Toutefois, si la plomberie est ancienne ou si nous déplaçons les appareils sanitaires, il peut être nécessaire de mettre le réseau aux normes."
            />
            <FAQ
              question="Comment assurer une bonne étanchéité pour une douche italienne ?"
              answer="Une douche italienne exige une imperméabilisation attentive. Nous appliquons un système de membrane sur les murs et le plancher, avec une pente appropriée vers le drain."
            />
            <FAQ
              question="Peut-on installer un plancher chauffant sous n'importe quel revêtement ?"
              answer="La céramique et la pierre naturelle conduisent bien la chaleur. Pour les autres revêtements, il faut vérifier les spécifications de transfert thermique du fabricant."
            />
            <FAQ
              question="Quel budget devrais-je prévoir ?"
              answer="Une rénovation complète demande un investissement structuré selon les matériaux et la complexité. Chaque projet fait l'objet d'une évaluation précise de l'ampleur des travaux."
            />
            <FAQ
              question="Quels types de ventilation recommandez-vous ?"
              answer="Le choix du système d'extraction dépend du volume de la pièce et de sa configuration afin d'assurer une évacuation adéquate de l'humidité."
            />
            <FAQ
              question="Pouvons-nous déplacer la toilette ou le bain ?"
              answer="Le déplacement des appareils sanitaires dépend de l'emplacement des solives et du renvoi principal. Une évaluation sur place est requise pour confirmer la faisabilité."
            />
            <FAQ
              question="Est-il préférable d'installer un bain ou une grande douche ?"
              answer="Le choix dépend de vos habitudes de vie et de l'espace disponible. Une douche spacieuse est souvent privilégiée si la maison dispose déjà d'un bain."
            />
            <FAQ
              question="Offrez-vous des solutions pour adapter la salle de bain à la mobilité réduite ?"
              answer="Nous pouvons planifier des aménagements intégrant des douches sans seuil, des barres d'appui et une circulation facilitée pour répondre à des besoins spécifiques."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-background">
        <div className="container-large px-6 mx-auto max-w-4xl text-center fade-up">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-6">Prêt à rénover votre salle de bain ?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Discutez de votre vision avec nos experts. Nous vous proposerons des solutions esthétiques soutenues par une réalisation technique soignée.
          </p>
          <PubCTA service="renovation-salle-de-bain" className="text-lg px-10 py-5" testId="button-bottom-cta" />
        </div>
      </section>
    </PubLayout>
  );
}