# Checklist de lancement

Deux usages : QA avant de lancer une campagne, et grille de diagnostic pour auditer une page qui performe mal (section 8).

---

## 1. Contenu et pertinence

- [ ] Le H1 reprend le mot-clé tête du groupe d'annonces quasi mot pour mot
- [ ] Le titre de l'annonce et le H1 se lisent comme la même phrase
- [ ] Le `<title>` et la meta description contiennent le mot-clé tête
- [ ] Le premier paragraphe tient la promesse de l'annonce
- [ ] Chaque page a du contenu réellement unique (test : retirer le nom du service, les deux pages restent distinguables)
- [ ] 700 à 1200 mots de contenu spécifique, pas de remplissage
- [ ] Le bloc de prix ou de fourchettes de prix existe
- [ ] Le processus est décrit avec des durées réelles
- [ ] La FAQ répond à 6-8 vraies questions du métier
- [ ] Aucun témoignage, chiffre, prix, garantie ou certification inventé
- [ ] Tous les `[[À CONFIRMER : ...]]` ont été résolus ou listés au client

## 2. Structure et conversion

- [ ] Aucun menu de navigation du site — un seul objectif sur la page
- [ ] Un seul CTA principal, répété
- [ ] L'étape 1 du formulaire est visible sans défiler sur mobile (iPhone SE, 375 px)
- [ ] Le numéro de téléphone est cliquable et visible dès le hero
- [ ] La preuve sociale apparaît avant le premier point de décision
- [ ] Les photos sont réelles, pas de banque d'images
- [ ] La zone desservie est nommée avec de vraies villes ou quartiers

## 3. Formulaire

- [ ] 5 champs visibles maximum au total
- [ ] 2 ou 3 étapes, 3-4 champs par étape
- [ ] L'étape 1 ne demande aucune coordonnée
- [ ] Boutons plutôt que menus déroulants dans les étapes de qualification
- [ ] Barre de progression visible, bouton retour fonctionnel
- [ ] Aucune perte de données en revenant en arrière
- [ ] Étiquettes visibles au-dessus des champs (pas de placeholder seul)
- [ ] `type`, `inputMode` et `autoComplete` corrects sur chaque champ
- [ ] Validation à `onBlur`, messages d'erreur en français sous le champ
- [ ] Formatage automatique du téléphone
- [ ] État de chargement au clic, protection contre la double soumission
- [ ] Zones de tap ≥ 44 px

## 4. Anti-spam

- [ ] Honeypot présent, caché hors écran (pas `display:none`), nom crédible
- [ ] Piège temporel — rejet sous 3 secondes
- [ ] Turnstile (ou reCAPTCHA v3) configuré, en français
- [ ] Limitation de débit par IP côté serveur
- [ ] Validation Zod du schéma complet
- [ ] Vérification du format de téléphone nord-américain
- [ ] Rejet des domaines de courriel jetables
- [ ] Rejet des champs texte contenant des URL
- [ ] Les leads rejetés sont conservés en quarantaine avec le motif

## 5. Tracking

- [ ] Consent Mode v2 en `default: denied` **avant** le chargement de tout tag
- [ ] Aucun script non essentiel ne se déclenche avant le choix de l'utilisateur (vérifier dans l'onglet Réseau)
- [ ] Bannière en français, granulaire par finalité, réversible
- [ ] `gclid`, `gbraid`, `wbraid`, `gad_source`, `gad_campaignid` et tous les `utm_*` captés
- [ ] Captation côté client **et** côté serveur
- [ ] Les valeurs sont stockées telles quelles, en `varchar(255)`
- [ ] Les champs cachés du formulaire sont bien remplis (inspecter le DOM avant soumission)
- [ ] **La conversion se déclenche côté serveur, après validation** — pas sur le `onSubmit`
- [ ] `conversion_sent` empêche les doublons
- [ ] Actions de conversion créées et nommées comme le CRM
- [ ] Une seule source par action de conversion (pas de double comptage GA4 + Ads)
- [ ] Balisage automatique activé dans Google Ads
- [ ] Conditions relatives aux données client acceptées (prérequis des enhanced conversions)
- [ ] Événements GA4 par étape du formulaire configurés
- [ ] Le clic sur le téléphone déclenche un événement

## 6. Technique

- [ ] `noindex` par balise meta ou en-tête `X-Robots-Tag`
- [ ] **Aucune** règle `Disallow` sur le répertoire du funnel dans robots.txt
- [ ] **Aucune** règle robots.txt nommant AdsBot
- [ ] Pas de `canonical` vers une autre page en même temps que le `noindex`
- [ ] Pages exclues du sitemap
- [ ] HTTP 200 sur chaque URL finale, mobile et desktop
- [ ] Aucune redirection qui perd les paramètres d'URL
- [ ] Le domaine de l'URL finale correspond à l'URL d'affichage de l'annonce
- [ ] Page accessible depuis toutes les régions ciblées
- [ ] Contenu principal présent dans le HTML servi (pas uniquement rendu côté client)
- [ ] LCP < 1,5 s, INP < 150 ms, CLS < 0,05 en test mobile throttlé
- [ ] JS initial < 100 kB gzip
- [ ] Hero en `next/image` avec `priority` et dimensions explicites
- [ ] Polices en local via `next/font`
- [ ] Aucun script tiers hérité du site principal
- [ ] Hauteur du formulaire réservée entre les étapes (pas de CLS)
- [ ] HTTPS, RLS activée, clés serveur uniquement

## 7. Conformité

- [ ] Page en français
- [ ] `Licence RBQ : XXXX-XXXX-XX` visible (barre de confiance + pied de page)
- [ ] Ni drapeau du Québec ni logo de la RBQ affichés
- [ ] Politique de confidentialité accessible et à jour
- [ ] Titre et coordonnées du responsable de la protection des renseignements personnels publiés
- [ ] Consentement de contact et consentement marketing séparés, aucune case pré-cochée
- [ ] Le texte exact du consentement est stocké avec le lead
- [ ] Durée de conservation précisée
- [ ] Données hébergées au Canada
- [ ] Aucun interstitiel bloquant, aucun faux message système

## 8. Volet Google Ads à livrer

- [ ] Tableau groupe d'annonces → URL finale → H1 → titre d'annonce
- [ ] Suffixe d'URL final défini (et testé)
- [ ] Liste des actions de conversion à créer, avec lesquelles sont primaires
- [ ] Note sur le délai de réponse promis sur la page — le client doit pouvoir le tenir

---

## 9. Mode diagnostic — une page qui performe mal

Suivre dans l'ordre. Le premier vrai « non » est presque toujours la cause.

**Le trafic arrive-t-il ?**
1. L'annonce est-elle approuvée ? Vérifier le motif de refus s'il y en a un.
2. L'URL après clic contient-elle un identifiant de clic ?

**Les gens restent-ils ?**
3. Note de landing page experience dans Google Ads — si « Below average », c'est un problème de page, pas de campagne
4. LCP réel au 75e centile (données de champ, pas de laboratoire)
5. Le H1 correspond-il à ce que l'annonce promettait ?
6. Le formulaire est-il visible sans défiler sur mobile ?

**Commencent-ils le formulaire ?**
7. Événement `form_start` dans GA4 — s'il est bas, c'est le hero ou l'offre
8. Le CTA décrit-il un résultat ou dit-il juste « Envoyer » ?

**Le terminent-ils ?**
9. Événements `form_step_complete` — repérer l'étape où ça décroche
10. Combien de champs, et lesquels sont demandés trop tôt ?

**Les conversions remontent-elles ?**
11. `conversion_sent` en base vs conversions dans Google Ads — l'écart est le bug
12. Double comptage GA4 + Ads ?
13. Ne capte-t-on que `gclid` ?

**Les leads sont-ils bons ?**
14. Taux de rejet en quarantaine — s'il est élevé, c'est un problème de source de trafic autant que de formulaire
15. Le bidding optimise-t-il sur `Lead soumis` alors qu'on a des données de qualification disponibles ?
16. Le client répond-il en moins d'une heure ? Sinon, c'est là que le funnel perd, pas sur la page.
