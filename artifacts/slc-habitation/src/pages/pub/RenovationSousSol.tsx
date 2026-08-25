import { PubLayout } from '@/components/pub/PubLayout';
import { PubCTA } from '@/components/pub/PubCTA';
import { FAQ } from '@/components/pub/FAQ';
import { ShieldCheck, Clock, MapPin, Hammer, Ruler, Droplets, MonitorPlay, Bed, Bath, ClipboardCheck } from 'lucide-react';

export default function RenovationSousSolPub() {
  return (
    <PubLayout>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground pt-20 pb-28 md:pt-32 md:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/70">
          <img
            src="/images/relume-657406.jpeg"
            alt="Sous-sol aménagé par SLC Habitation"
            className="w-full h-full object-cover mix-blend-overlay"
            width="2048"
            height="1536"
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
            Rénovation de sous-sol{' '}<br/>à Laval et dans les Laurentides
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Nous transformons les sous-sols en espaces de vie confortables et esthétiques, adaptés aux besoins de votre foyer.
          </p>

          <PubCTA service="renovation-sous-sol" className="text-lg px-8 py-5" testId="button-hero-cta" />
        </div>
      </section>

      {/* Configurations */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Aménagements sur mesure</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
              Des espaces pensés pour vos besoins
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nous adaptons la configuration de votre sous-sol pour maximiser l'espace utilisable, en respectant les contraintes structurelles de votre résidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MonitorPlay className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Espace de vie</h3>
              <p className="text-muted-foreground leading-relaxed">
                Salle familiale, espace de jeu ou cinéma maison. Nous planifions l'éclairage et l'acoustique pour concevoir un environnement convivial et confortable.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-100 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bed className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Chambres et bureaux</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ajout de chambres supplémentaires ou de bureaux à domicile, en évaluant les normes d'issues de secours et l'optimisation de la luminosité naturelle.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all fade-up delay-200 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bath className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-heading">Salles de bain</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intégration de salles de bain complètes ou de salles d'eau, selon l'emplacement du renvoi principal et des possibilités de raccordement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise & Methodology */}
      <section className="py-24 bg-background relative">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 fade-up">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Notre Méthodologie</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
                L'expertise derrière les murs
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Une belle finition s'appuie sur une structure saine. Nous concevons chaque sous-sol en considérant les enjeux techniques propres aux fondations.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground font-heading">Contrôle de l'humidité</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Inspection des fondations et gestion thermique avant l'isolation pour favoriser un environnement sain.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground font-heading">Agencement intelligent</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Intégration discrète de la mécanique du bâtiment (conduits, poutres, plomberie) pour optimiser la hauteur libre.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg">
                    <Hammer className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground font-heading">Insonorisation ciblée</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Solutions d'atténuation acoustique adaptées à l'usage prévu pour la pièce.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative fade-up delay-200">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative border-8 border-white shadow-2xl">
                <img
                  src="/images/INT%C3%89RIEUR/randoms/20241017_152123.jpg"
                  alt="Détail de finition de sous-sol"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="1000"
                  height="750"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-border max-w-xs">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-bold font-heading">Suivi structuré</span>
                </div>
                <p className="text-sm text-muted-foreground">Une coordination soignée de l'ouverture des murs jusqu'à la finition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="py-24 bg-muted/10 border-t border-border">
        <div className="container-large px-6 mx-auto max-w-7xl">
          <div className="max-w-3xl mb-16 fade-up">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Évaluation initiale</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading leading-tight">
              Analyse technique locale
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Les résidences de Laval et des Laurentides présentent des spécificités structurelles distinctes. Avant de proposer une soumission, nous analysons plusieurs éléments critiques pour planifier les travaux adéquatement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 fade-up delay-100">
            {[
              { title: "Hauteur et mécanique", desc: "Évaluation de la hauteur libre et de la disposition des conduits de ventilation et de plomberie." },
              { title: "Dalle et drains", desc: "Inspection de l'état de la dalle de béton et repérage des drains existants pour la plomberie." },
              { title: "Capacité électrique", desc: "Vérification du panneau électrique pour l'ajout de nouvelles zones de chauffage et d'éclairage." },
              { title: "Normes de sécurité", desc: "Analyse des fenêtres existantes pour évaluer la conformité des issues si des chambres sont prévues." }
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
            « Magnifique travail de l'équipe SLC Habitation. Nous avions un projet complexe avec plusieurs défis! Ils ont fait un travail exceptionnel. Un gros merci pour votre professionnalisme! Je recommande sans hésiter. »
          </blockquote>
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-white text-lg tracking-wide">Johanne Duguay</div>
            <div className="text-gray-400">Propriétaire</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container-large px-6 mx-auto max-w-4xl">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground text-lg">Ce que nos clients veulent savoir avant d'entamer un projet de sous-sol.</p>
          </div>

          <div className="space-y-4 fade-up delay-100">
            <FAQ
              question="Faut-il traiter l'humidité avant de finir le sous-sol ?"
              answer="Il est essentiel de vérifier les signes d'infiltration, l'état de la fondation et le taux d'humidité avant de refermer les murs afin d'assurer la durabilité des travaux."
            />
            <FAQ
              question="Quelles sont les étapes pour insonoriser un plafond ?"
              answer="L'approche dépend du niveau d'atténuation acoustique désiré. Elle comprend généralement de la laine insonorisante, des profilés résilients pour désolidariser le plafond, et des couches de gypse appropriées."
            />
            <FAQ
              question="Est-ce possible d'ajouter une salle de bain si la plomberie n'est pas prévue ?"
              answer="C'est souvent possible, mais nécessite une évaluation technique des drains, du renvoi principal et de la dalle de béton. S'il faut modifier la dalle, nous évaluons cette étape avec nos experts."
            />
            <FAQ
              question="Combien de temps durent les travaux ?"
              answer="La durée varie selon l'ampleur du projet et la complexité des interventions (ajout de salle de bain, modifications structurelles). Nous fournissons un échéancier lors de la planification."
            />
            <FAQ
              question="Quel type de revêtement de sol est recommandé ?"
              answer="Les matériaux qui tolèrent bien les variations d'humidité, comme le vinyle ou la céramique, sont généralement privilégiés au sous-sol."
            />
            <FAQ
              question="Faut-il un permis pour aménager un sous-sol ?"
              answer="Dans la plupart des municipalités, un permis est requis, particulièrement si les travaux impliquent de la plomberie ou des modifications structurelles."
            />
            <FAQ
              question="Comment maximiser la hauteur du plafond ?"
              answer="Nous évaluons la disposition de la mécanique du bâtiment (conduits, fils) afin de déterminer les options d'aménagement du plafond les mieux adaptées à votre espace."
            />
            <FAQ
              question="Peut-on agrandir les fenêtres existantes ?"
              answer="L'agrandissement de fenêtres implique des travaux de fondation et de maçonnerie, ce qui est généralement possible après une analyse de la structure par notre équipe."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-background">
        <div className="container-large px-6 mx-auto max-w-4xl text-center fade-up">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-6">Prêt à transformer votre sous-sol ?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Contactez-nous pour discuter de votre vision. Nous évaluerons la faisabilité et vous fournirons une soumission transparente et détaillée.
          </p>
          <PubCTA service="renovation-sous-sol" className="text-lg px-10 py-5" testId="button-bottom-cta" />
        </div>
      </section>
    </PubLayout>
  );
}