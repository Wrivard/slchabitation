import { Link } from 'wouter';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';

export default function PolitiqueDeConfidentialite() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <SiteHeader />

      <main className="flex-grow container-large px-6 py-16 md:py-24 mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold font-heading mb-8">Politique de confidentialité</h1>
        
        <div className="prose prose-neutral max-w-none text-muted-foreground space-y-6">
          <p>
            Dernière mise à jour : <strong>25 août 2026</strong>
          </p>

          <p>
            Cette politique décrit les pratiques de SLC Habitation (« nous », « notre » ou « nos »)
            concernant les renseignements personnels recueillis sur notre site et dans le cadre
            d’une demande de soumission. Elle vise à présenter ces pratiques de façon claire,
            notamment au regard des règles québécoises applicables.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Collecte des renseignements personnels</h2>
          <p>
            Nous recueillons uniquement les renseignements personnels nécessaires pour vous fournir nos services d'estimation 
            et de rénovation. Les informations que vous pouvez nous fournir via nos formulaires incluent :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nom et prénom</li>
            <li>Adresse courriel</li>
            <li>Numéro de téléphone</li>
            <li>Détails concernant votre projet (type de travaux, budget approximatif, description)</li>
            <li>Données de navigation et témoins (cookies) tels qu'identifiés ci-bas</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Utilisation des renseignements</h2>
          <p>Vos renseignements personnels sont utilisés exclusivement pour les fins suivantes :</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Répondre à votre demande de soumission ou de contact</li>
            <li>Communiquer avec vous concernant l'évaluation et l'exécution de votre projet</li>
            <li>Comprendre la provenance de nos demandes (via l'analyse des campagnes publicitaires)</li>
            <li>Améliorer l'expérience de navigation sur notre site web</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Consentement et Témoins (Cookies)</h2>
          <p>
            Nous utilisons des outils d'analyse et de suivi (notamment Google Analytics et Google Ads) pour comprendre 
            les performances de nos campagnes publicitaires. Lorsque la loi l'exige, nous recueillons votre consentement 
            exprès avant d'activer des témoins publicitaires (Consent Mode v2). Vous pouvez à tout moment refuser ces témoins 
            dans la bannière de consentement. Le refus ou le retrait du consentement aux témoins
            non essentiels n’empêche pas l’envoi d’une demande de soumission.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Protection et conservation des données</h2>
          <p>
            Nous appliquons des mesures administratives, techniques et organisationnelles
            raisonnables pour protéger vos renseignements contre l’accès, l’utilisation ou la
            communication non autorisés.
          </p>
          <p>
            Nous conservons les demandes pendant la période nécessaire au suivi du projet, puis
            selon les délais requis pour nos obligations contractuelles, fiscales ou légales. À
            l’échéance applicable, les renseignements sont supprimés ou anonymisés de manière
            sécuritaire.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Partage des renseignements</h2>
          <p>
            Nous ne vendons ni ne louons vos renseignements personnels. Ils peuvent être transmis
            aux fournisseurs techniques nécessaires au fonctionnement du formulaire, à la sécurité,
            à l’envoi de courriels et, avec votre consentement lorsque requis, à la mesure
            publicitaire. Certains fournisseurs peuvent traiter des données hors du Québec ou du
            Canada; nous limitons alors les renseignements transmis et utilisons les mesures
            contractuelles et techniques disponibles.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. Vos droits</h2>
          <p>
            Conformément à la législation québécoise, vous disposez des droits suivants concernant vos renseignements personnels :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Le droit d'accéder aux renseignements que nous détenons à votre sujet</li>
            <li>Le droit de demander la rectification de renseignements inexacts ou incomplets</li>
            <li>Le droit de retirer votre consentement à tout moment</li>
            <li>Le droit de demander la suppression de vos renseignements personnels</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">7. Responsable de la protection des renseignements personnels</h2>
          <p>
            Pour toute question concernant cette politique, ou pour exercer vos droits, vous pouvez contacter notre 
            responsable de la protection des renseignements personnels :
          </p>
          <div className="bg-muted p-6 rounded-xl mt-4">
            <p><strong>Responsable :</strong> Responsable de la protection des renseignements personnels — SLC Habitation</p>
            <p><strong>Courriel :</strong> <a href="mailto:slchabitation@gmail.com" data-testid="link-privacy-email">slchabitation@gmail.com</a></p>
            <p><strong>Téléphone :</strong> <a href="tel:+15144048494" data-testid="link-privacy-phone">(514) 404-8494</a></p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-primary font-semibold hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
