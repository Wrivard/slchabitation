# Conformité — Québec et Google Ads

Ce fichier n'est pas un avis juridique. C'est la liste opérationnelle de ce qui doit être vrai sur une page publicitaire livrée à un client québécois, avec la source de l'obligation pour que le client puisse valider avec son conseiller.

Table des matières :
1. Loi 25 — renseignements personnels
2. Loi 96 — langue française
3. RBQ — licence d'entrepreneur
4. Politiques Google Ads sur les destinations
5. Bloc de conformité type à mettre en pied de page

---

## 1. Loi 25 — renseignements personnels

La Loi 25 s'applique à toute entreprise qui exerce au Québec, **sans seuil de taille**, dès le premier renseignement personnel recueilli. Elle s'applique aussi selon la **localisation du visiteur** : un visiteur québécois est couvert, peu importe où est l'entreprise.

**Ce qui doit exister sur le site :**

| Obligation | Vérification concrète |
|---|---|
| Politique de confidentialité publiée, en termes simples et clairs | Lien accessible depuis la page funnel, page à jour (pas un document de 2019) |
| Titre et coordonnées du responsable de la protection des renseignements personnels publiés sur le site | Nom ou titre + courriel ou téléphone, visibles. Par défaut, c'est la personne ayant la plus haute autorité ; la fonction peut être déléguée par écrit. |
| Consentement explicite avant tout témoin non essentiel | Aucun script analytique ou publicitaire ne se déclenche avant le choix |
| Consentement granulaire par finalité | Pas un seul bouton qui regroupe stockage, analytique et personnalisation |
| Bannière en français | Une bannière uniquement en anglais n'est pas conforme |
| Possibilité de changer d'avis | Lien permanent vers les préférences |
| Information sur les finalités, la durée de conservation, les destinataires, le retrait du consentement | Dans le formulaire et dans la politique |
| Consentement distinct pour les communications marketing | Case séparée, non pré-cochée (la LCAP s'applique en plus) |
| Protection raisonnable des données | RLS activée, clés serveur uniquement, accès limité |
| Registre des incidents de confidentialité | Côté client — à mentionner dans la remise |

**Témoins essentiels vs non essentiels :**
- Essentiels (pas de consentement préalable, mais à mentionner) : session, panier, préférence de langue, sécurité
- Non essentiels (consentement explicite préalable requis) : Google Analytics, Google Ads, Meta Pixel, vidéos intégrées, widgets de clavardage

**Hébergement :** garder les données au Canada (`ca-central-1`) évite d'avoir à justifier une communication hors Québec, qui déclenche une évaluation des facteurs relatifs à la vie privée.

**L'erreur la plus fréquente :** charger tous les scripts au chargement de la page, puis afficher la bannière en décoration. Si les témoins non essentiels se déposent avant le choix, la page n'est pas conforme, quel que soit le design de la bannière.

## 2. Loi 96 — langue française

La publicité commerciale et les sites web destinés à la clientèle québécoise doivent être disponibles en français. Une présence en ligne uniquement en anglais visant le Québec peut placer l'entreprise en non-conformité même si l'affichage physique est conforme.

Pour une page funnel :
- **La page est en français.** Point de départ, pas une option.
- Si une version anglaise existe, la version française doit être au moins équivalente et accessible aussi facilement.
- Le formulaire, les messages d'erreur, les courriels de confirmation et la bannière de consentement sont en français.
- Attention aux composants d'interface qui restent en anglais par défaut (validation de formulaire, sélecteurs de date, messages de Turnstile ou reCAPTCHA — Turnstile se configure en français).

**Marques de commerce :** les règles renforcées sur l'affichage et les marques sont entrées en vigueur le 1er juin 2025. Elles visent surtout l'affichage extérieur et l'emballage. Si le client a un nom de marque en anglais, ne pas improviser — c'est une question à valider avec son conseiller, pas une décision de page d'atterrissage.

## 3. RBQ — licence d'entrepreneur

**Obligation légale, pas un choix de design.** Un entrepreneur en construction doit indiquer son numéro de licence RBQ notamment sur son site web et ses publicités, y compris sur les réseaux sociaux professionnels ou personnels où il annonce ses services.

- **Format exact :** `Licence RBQ : XXXX-XXXX-XX` (10 chiffres)
- **Placement :** visible sur la page funnel — dans la barre de confiance en haut, et rappelé au pied de page
- **Interdit :** afficher le drapeau du gouvernement du Québec ou le logo de la RBQ. Les inspecteurs vérifient ce point.
- **Exemptions :** les membres de la CMEQ (maîtres électriciens) et de la CMMTQ (maîtres mécaniciens en tuyauterie) sont identifiés par le logo de leur corporation ; les entrepreneurs domiciliés hors Québec sont également exemptés.

**Argument de vente autant qu'obligation.** La RBQ mène des campagnes publiques pour inciter les consommateurs à vérifier la licence avant de signer. Une page qui affiche clairement le numéro et invite à le vérifier au registre officiel se démarque et augmente la confiance — c'est aussi un signal de transparence dans le landing page experience.

Formulation utilisable :
> Licence RBQ : 5678-1234-01 — vérifiable au registre officiel de la Régie du bâtiment du Québec.

## 4. Politiques Google Ads sur les destinations

Les violations de cette politique n'entraînent pas de suspension immédiate : un avertissement est émis au moins 7 jours avant. Mais une annonce refusée ne diffuse pas, et c'est immédiat.

| Motif de refus | Ce qui le déclenche | Prévention |
|---|---|---|
| **Destination not working** | Erreur HTTP, page intermittente, URL avec faute de frappe | Vérifier le 200 sur chaque URL finale, sur mobile et desktop |
| **Destination mismatch** | Domaine de l'URL d'affichage ≠ URL finale ; redirection vers un autre domaine ; modèle de suivi qui mène à un autre contenu | Garder les pages sur le domaine principal ; tester le suffixe d'URL final |
| **Destination not crawlable** | robots.txt bloque AdsBot ; crawl saturé par un traqueur de clics | Ne jamais créer de règle robots.txt nommant AdsBot ; publier les nouvelles URL par lots |
| **Destination not accessible** | Page inaccessible depuis la région ciblée, géo-blocage | Tester depuis les régions ciblées |
| **Insufficient original content** | Contenu faible ou dupliqué, plus de pub que de contenu | Voir la règle des ~20 % de contenu partagé dans `contenu-et-pertinence.md` |
| **Destination experience** | Navigation difficile, interstitiels piégeants, faux messages système, zones cliquables invisibles | Pas de pop-up qui bloque la sortie, pas de faux avertissements |

**Détail utile :** AdsBot-Google et AdsBot-Google-Mobile ignorent le groupe `user-agent: *` dans robots.txt. Une règle générique n'affecte donc pas les annonces — mais elle empêche Googlebot de lire le `noindex`, ce qui est un autre problème. Voir `technique-et-performance.md`.

**Formulaires de prospects Google Ads** (l'autre format, hébergé chez Google) : ils exigent une politique de confidentialité pour l'entreprise et sont réservés aux annonceurs de première partie ou aux agences ayant une relation directe établie avec le service annoncé. Une agence qui gère le compte de son client est dans ce cas.

## 5. Bloc de conformité type à mettre en pied de page

À adapter avec les vraies valeurs du client :

```
[Nom de l'entreprise]
Licence RBQ : XXXX-XXXX-XX — vérifiable au registre de la Régie du bâtiment du Québec
[Adresse ou zone desservie] · [Téléphone] · [Courriel]

Politique de confidentialité · Préférences de témoins

Responsable de la protection des renseignements personnels :
[Titre] — [courriel] — [téléphone]

© [Année] [Nom de l'entreprise]. Tous droits réservés.
```

**Vérification finale avant livraison :** si l'un de ces éléments manque, il devient un marqueur `[[À CONFIRMER : ...]]` dans le livrable, pas une invention.
