import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { FAQ } from '@/components/pub/FAQ';
import { ShieldCheck, Clock, MapPin, Search, Maximize2, Zap, Utensils, Grid, Lightbulb, ClipboardCheck } from 'lucide-react';

export default function RenovationCuisinePub() {
  return (
    <PubLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground pt-20 pb-28 md:pt-32 md:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/60">
          <img
            src="/images/relume-655453.jpeg"
            alt="Cuisine moderne par SLC Habitation"
            className="w-full h-full object-cover mix-blend-overlay"
            width="1407"
            height="1875"
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
            Rénovation de cuisine{' '}<br/>à Laval et dans les Laurentides
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            La rénovation de cuisine exige une planification globale : optimisation de l'espace, ergonomie des déplacements et intégration technique soignée.
          </p>

          <PubCTA service="renovation-cuisine" className="text-lg px-8 py-5" testId="button-hero-cta" />
        </div>
      </section>

      {/* Configurations */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Éléments de configuration</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
              Des détails qui transforment l'expérience
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Du choix des surfaces à la disposition de l'îlot, nous coordonnons chaque aspect de votre projet pour créer un espace à la fois esthétique et hautement fonctionnel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Grid className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Ébénisterie et surfaces</h3>
              <p className="text-muted-foreground leading-relaxed">
                Coordination de l'installation de vos armoires personnalisées et de comptoirs durables pour une intégration harmonieuse des matériaux.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-100 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Rangement ergonomique</h3>
              <p className="text-muted-foreground leading-relaxed">
                Planification des zones de préparation et de rangement pour un accès facilité à vos ustensiles et provisions au quotidien.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-200 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Éclairage par zones</h3>
              <p className="text-muted-foreground leading-relaxed">
                Conception d'un éclairage adapté combinant lumière de travail sous les armoires et éclairage d'ambiance au-dessus des îlots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-background">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Approche architecturale</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground font-heading leading-tight">
              Bien plus qu'un changement d'armoires
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nous évaluons la configuration architecturale de votre espace pour optimiser vos déplacements, maximiser le rangement et intégrer de façon harmonieuse vos nouveaux électroménagers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-card p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up group">
              <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-heading">Optimisation spatiale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Repenser le triangle d'activité (frigo, évier, cuisinière) pour faciliter vos déplacements. Si la structure le permet et après évaluation, il est parfois possible de modifier les cloisons pour une aire plus ouverte.
              </p>
            </div>

            <div className="bg-card p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-100 group">
              <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-heading">Ajustements techniques</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ajout de circuits électriques nécessaires pour les nouveaux appareils, prises intégrées de façon sécuritaire aux îlots et un éclairage encastré stratégiquement positionné.
              </p>
            </div>

            <div className="bg-card p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-200 group">
              <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform">
                <Maximize2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-heading">Maîtrise d'œuvre</h3>
              <p className="text-muted-foreground leading-relaxed">
                Démolition contrôlée, plomberie, menuiserie et installation des surfaces. Un suivi organisé pour coordonner les travaux de différents quarts de métier.
              </p>
            </div>
          </div>

          <div className="fade-up relative px-4 md:px-12">
            <div className="absolute inset-0 bg-secondary/5 rounded-[3rem] transform rotate-1 -z-10"></div>
            <img
              src="/images/relume-567906.jpeg"
              alt="Aire ouverte et cuisine moderne"
              className="w-full h-[50vh] min-h-[400px] object-cover rounded-[2rem] shadow-2xl border-8 border-white relative z-10"
              loading="lazy"
              width="1440"
              height="1440"
            />
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="py-24 bg-muted/10 border-t border-border">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="max-w-3xl mb-16 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Analyse avant-projet</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
              Évaluation architecturale
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Transformer une cuisine demande de composer avec l'ossature existante de votre domicile. Avant d'amorcer les travaux, nous relevons les particularités techniques pour orienter la planification.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 fade-up delay-100">
            {[
              { title: "Murs porteurs", desc: "Identification des cloisons porteuses afin de déterminer s'il est réaliste de modifier la répartition des pièces." },
              { title: "Plomberie et ventilation", desc: "Localisation des colonnes de renvoi et des parcours de ventilation pour anticiper le positionnement de l'évier et de la hotte." },
              { title: "Charges électriques", desc: "Vérification de la capacité du panneau principal face aux exigences des nouveaux électroménagers." },
              { title: "Sous-planchers", desc: "Évaluation des niveaux de plancher existants pour planifier la continuité des nouveaux revêtements." }
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
            « Excellente compagnie, service professionnel et soucis du détails! Merci à votre équipe pour vos bons conseils. Je recommande à tous pour la réalisation de vos projets! »
          </blockquote>
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-white text-lg tracking-wide">Mélodie Binette</div>
            <div className="text-gray-400">Propriétaire</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container-large px-6 mx-auto max-w-4xl">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground text-lg">Informations clés pour votre projet de cuisine.</p>
          </div>

          <div className="space-y-4 fade-up delay-100">
            <FAQ
              question="Est-ce possible d'abattre un mur pour créer une aire ouverte ?"
              answer="Il est souvent possible de le faire. Nous déterminons d'abord si le mur est porteur. Le cas échéant, une évaluation d'ingénieur en structure sera nécessaire pour planifier le soutien approprié."
            />
            <FAQ
              question="Doit-on commander les électroménagers avant le début des travaux ?"
              answer="C'est fortement recommandé. Connaître les dimensions exactes et les spécifications techniques de vos appareils permet d'éviter des ajustements imprévus."
            />
            <FAQ
              question="Pouvons-nous refaire le plancher de la cuisine pour l'harmoniser avec le salon ?"
              answer="Lors de la création d'une aire ouverte, l'unification des planchers est fréquente. Nous préparons le sous-plancher pour favoriser une transition adéquate entre les pièces."
            />
            <FAQ
              question="Comment gérez-vous la démolition ?"
              answer="Nous protégeons les espaces de vie adjacents contre la poussière. La démolition est exécutée méthodiquement pour limiter les impacts sur le reste de la maison."
            />
            <FAQ
              question="Est-il nécessaire de refaire l'électricité ?"
              answer="Lors d'une rénovation majeure, les circuits électriques doivent souvent être modifiés ou ajoutés pour répondre aux exigences des nouveaux appareils de cuisine."
            />
            <FAQ
              question="Peut-on conserver les armoires existantes et ne changer que les portes ?"
              answer="Si les caissons sont en bon état et que la configuration vous convient, le resurfaçage (refacing) peut être une option à évaluer lors de la planification."
            />
            <FAQ
              question="Où installer le micro-ondes ?"
              answer="L'emplacement du micro-ondes se planifie en fonction de l'ergonomie, du rangement disponible et des possibilités de dégagement dans la nouvelle disposition."
            />
            <FAQ
              question="La hotte de cuisine doit-elle sortir à l'extérieur ?"
              answer="Une évacuation extérieure est recommandée pour une meilleure gestion des odeurs et de l'humidité, selon les contraintes de votre domicile."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-background">
        <div className="container-large px-6 mx-auto max-w-4xl text-center fade-up">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-6">Prêt à repenser votre cuisine ?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Bénéficiez de l'expertise d'une équipe structurée pour coordonner l'ensemble de votre projet, de l'évaluation technique jusqu'à l'installation des finitions.
          </p>
          <PubCTA service="renovation-cuisine" className="text-lg px-10 py-5" testId="button-bottom-cta" />
        </div>
      </section>
    </PubLayout>
  );
}