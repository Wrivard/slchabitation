# Formulaire du funnel et anti-spam

Table des matières :
1. Pourquoi un formulaire séparé de celui du site
2. Nombre de champs : les chiffres
3. Découpage multi-étapes
4. Champs recommandés par type de service
5. UX de saisie sur mobile
6. Consentement Loi 25 dans le formulaire
7. Anti-spam en couches
8. Validation serveur
9. Schéma de données
10. Après la soumission

---

## 1. Pourquoi un formulaire séparé de celui du site

Le formulaire du funnel a sa propre route, sa propre table, sa propre action de conversion et ses propres notifications. Ce n'est pas de la duplication gratuite :

- **Mesure propre** — on sait exactement combien de leads viennent du payant, sans démêler l'organique
- **Bidding propre** — seules les soumissions du funnel alimentent les conversions Google Ads
- **Anti-spam calibré** — le trafic payant attire plus de bots ; on peut y mettre plus de friction sans pénaliser les visiteurs organiques
- **Qualification différente** — le formulaire du site sert à tout ; celui du funnel sert à qualifier une intention précise
- **Itération sans risque** — on teste des variantes sans toucher au formulaire de contact principal

## 2. Nombre de champs : les chiffres

La chute du taux de conversion n'est pas linéaire — elle est la plus brutale entre 4 et 7 champs.

| Nombre de champs | Taux de conversion observé |
|---|---|
| 1 | ~13,4 % |
| 3 | ~10,1 % |
| 5 | ~7,8 % |
| 7 | ~5,3 % |
| 9 | ~3,6 % |

**Cible : 5 champs visibles maximum au total**, répartis sur 2-3 étapes. Chaque champ supplémentaire doit gagner sa place en répondant à : « est-ce qu'on a absolument besoin de ça avant le premier appel ? » Sinon on le demande au téléphone.

Sur mobile, les formulaires de 3-4 champs convertissent 30 à 60 % mieux que ceux de 6 champs et plus, et le mobile est la majorité du trafic.

## 3. Découpage multi-étapes

Les formulaires multi-étapes surpassent les formulaires monoblocs à nombre de champs égal (autour de +21 %, davantage sur mobile). Le mécanisme est l'engagement : une fois la première étape franchie, la personne se sent embarquée.

**Structure à 3 étapes (défaut) :**

```
Étape 1 — Engagement faible, aucune donnée personnelle
  → Type de projet          [boutons, pas un menu déroulant]
  → (parfois) Échéancier    [boutons]

Étape 2 — Qualification
  → Détail du projet ou budget approximatif   [boutons, fourchettes]

Étape 3 — Coordonnées
  → Prénom + nom
  → Téléphone
  → Courriel
  → Consentement
```

Règles :
- **L'étape 1 ne demande jamais de coordonnées.** C'est ce qui rend le premier clic gratuit psychologiquement.
- **Boutons plutôt que menus déroulants** dans les étapes de qualification : un tap au lieu de trois, et ça se voit dans les chiffres mobiles.
- **Barre de progression visible.** L'ambiguïté sur la longueur restante fait abandonner.
- **Bouton retour** à chaque étape après la première.
- **Aucune perte de données** entre les étapes si l'utilisateur revient.
- **La hauteur du conteneur est réservée** pour éviter le CLS entre les étapes.

## 4. Champs recommandés par type de service

| Service | Étape 1 | Étape 2 | Étape 3 |
|---|---|---|---|
| Rénovation cuisine | Type : complète / armoires+comptoir / rafraîchissement | Échéancier : < 3 mois / 3-6 mois / j'explore | Nom, téléphone, courriel |
| Rénovation salle de bain | Type : complète / douche / vanité | Nombre de salles de bain à rénover | Nom, téléphone, courriel |
| Rénovation sous-sol | État actuel : brut / à refaire / partiellement fini | Superficie approximative | Nom, téléphone, courriel |
| Toiture | Type : bardeaux / membrane élastomère / réparation | Urgence : fuite active / préventif | Nom, téléphone, courriel |

**Le champ d'échéancier est le meilleur qualifieur rapport friction/valeur** en rénovation : il coûte un tap et sépare le projet réel de la curiosité.

**Le budget est délicat.** Il améliore la qualité mais fait fuir. Compromis : le poser en fourchettes larges, en optionnel, avec une option « je ne sais pas encore » — c'est souvent la réponse la plus honnête d'un propriétaire, et la refuser fait perdre de bons leads.

**Ne jamais demander en formulaire :** adresse complète, code postal exact, date de naissance, détails financiers. Ça se prend au téléphone.

## 5. UX de saisie sur mobile

- **Étiquettes visibles au-dessus du champ**, jamais un placeholder comme seule étiquette. Le placeholder disparaît dès la frappe et l'utilisateur oublie ce qu'on lui demandait.
- **Bons attributs :**
  ```html
  <input type="tel"   inputMode="tel"   autoComplete="tel" />
  <input type="email" inputMode="email" autoComplete="email" />
  <input type="text"  autoComplete="name" />
  ```
- **Validation en temps réel non punitive** : valider à la sortie du champ (`onBlur`), pas à chaque frappe. Message d'erreur sous le champ, en français clair, avec l'action à faire.
- **Zone de tap ≥ 44 px** pour tous les boutons de choix.
- **Bouton de soumission qui décrit le résultat** : « Obtenir mon estimation » plutôt que « Envoyer ».
- **État de chargement** au clic, bouton désactivé pendant l'envoi, pour éviter la double soumission.
- **Formatage automatique du téléphone** `(514) 555-0123` pendant la saisie — ça réduit les fautes de frappe qui rendent le lead injoignable.

## 6. Consentement Loi 25 dans le formulaire

Ce que la loi demande concrètement dans un formulaire de collecte :

- Indiquer **quelles données** sont collectées, **à quelles fins**, **combien de temps** elles sont conservées, **à qui** elles peuvent être communiquées, et **comment retirer le consentement**
- Le consentement doit être **séparé des conditions générales**
- **Case non pré-cochée pour chaque finalité distincte**
- La soumission d'une demande de soumission est une finalité évidente dans le contexte — mais **l'ajout à une liste d'infolettre en est une autre** et exige son propre consentement (la LCAP s'applique aussi)

Formulation utilisable :

```
[ ] J'accepte que [Entreprise] utilise mes coordonnées pour me contacter
    au sujet de ma demande de soumission.  (requis)

[ ] Je souhaite recevoir les promotions et conseils de [Entreprise].
    (facultatif — je peux me désabonner en tout temps)

Vos renseignements sont conservés [durée] et ne sont jamais vendus.
Politique de confidentialité · Responsable de la protection des
renseignements personnels : [titre], [courriel]
```

Ne pas fusionner les deux cases. Ne pas pré-cocher. Ne pas cacher le lien vers la politique.

## 7. Anti-spam en couches

Le trafic payant attire des bots, et un bot qui soumet un formulaire déclenche une conversion qui **entraîne le Smart Bidding à chercher d'autres bots**. C'est un problème de bidding avant d'être un problème de boîte de réception.

Défense en quatre couches, de la moins à la plus intrusive :

**Couche 1 — Honeypot.** Un champ caché que les humains ne voient pas et que les bots simples remplissent. Gratuit, invisible, zéro friction. Cacher en CSS (`position:absolute; left:-9999px`), pas en `display:none` (certains bots le détectent), avec `tabIndex={-1}` et `autoComplete="off"`. Nommer le champ de façon crédible (`company_website`, pas `honeypot`).

**Couche 2 — Piège temporel.** Enregistrer l'horodatage du rendu du formulaire dans un champ caché. Une soumission en moins de 3 secondes est un bot. Rejeter silencieusement.

**Couche 3 — Défi invisible.** Cloudflare Turnstile ou reCAPTCHA v3. Ils notent le visiteur sans lui imposer de grille d'images. Turnstile est préférable en contexte québécois : plus rapide, gratuit, et il ne renvoie pas les données à Google (un argument de conformité de moins à défendre).

**Couche 4 — Validation serveur (la vraie).** Les trois premières couches réduisent le volume mais **ne nettoient pas le signal déjà envoyé à Google**. C'est pour ça que la conversion se déclenche côté serveur, après validation — jamais sur le `onSubmit` du client.

Compléments côté campagne, hors de la page :
- Audit régulier des termes de recherche et mots-clés négatifs
- Exclure les emplacements Display de mauvaise qualité
- Un qualifieur clair dans l'annonce et sur la page (zone desservie, taille minimale de projet, prix de départ)

## 8. Validation serveur

Ordre des vérifications dans la route handler, du moins cher au plus cher :

1. **Méthode et origine** — POST uniquement, vérifier l'en-tête `Origin`
2. **Honeypot** rempli → rejet silencieux (répondre 200, ne rien enregistrer)
3. **Délai** < 3 s → rejet silencieux
4. **Limitation de débit** par IP — max 3 soumissions / 10 minutes
5. **Schéma** — valider avec Zod : champs requis, longueurs maximales, types
6. **Turnstile** — vérifier le jeton auprès de Cloudflare
7. **Téléphone** — format nord-américain valide, indicatif régional plausible pour le Québec (`418, 438, 450, 468, 514, 579, 581, 819, 873`) — avertir sans bloquer si hors Québec, un client peut appeler d'ailleurs
8. **Courriel** — syntaxe, puis liste de domaines jetables, puis (optionnel) vérification MX
9. **Contenu** — rejeter les champs texte contenant des URL ou du BBCode, signature classique du spam de formulaire

**Seulement si tout passe :** insérer en base, envoyer les notifications, **puis** déclencher la conversion côté serveur.

Un lead rejeté n'est pas supprimé : il est marqué `status: 'rejected'` avec le motif, dans une table de quarantaine. On veut pouvoir vérifier qu'on ne jette pas de vrais clients.

## 9. Schéma de données

```sql
create table funnel_leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- identification du funnel
  funnel_slug       text not null,          -- 'renovation-cuisine'
  variant           text,                   -- jeton de variante

  -- réponses
  project_type      text,
  timeline          text,
  budget_range      text,
  details           text,

  -- coordonnées
  first_name        text not null,
  last_name         text,
  phone             text not null,
  email             text not null,

  -- consentement (Loi 25)
  consent_contact   boolean not null default false,
  consent_marketing boolean not null default false,
  consent_at        timestamptz,
  consent_text      text,                   -- le texte exact affiché, horodaté

  -- attribution
  gclid             varchar(255),
  gbraid            varchar(255),
  wbraid            varchar(255),
  gad_source        text,
  gad_campaignid    text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  landing_page      text,
  referrer          text,

  -- qualité et cycle de vie
  status            text not null default 'new',  -- new|validated|rejected|contacted|won|lost
  reject_reason     text,
  conversion_sent   boolean not null default false,
  qualified_at      timestamptz,
  won_at            timestamptz,
  value_cad         numeric
);

alter table funnel_leads enable row level security;
create index on funnel_leads (funnel_slug, created_at desc);
create index on funnel_leads (status);
```

**Conserver le texte exact du consentement affiché** (`consent_text`) : c'est la preuve, et la formulation évolue.

Les colonnes `status`, `qualified_at`, `won_at` et `value_cad` ne sont pas décoratives : ce sont elles qui permettent de renvoyer les vraies conversions à Google Ads plus tard (voir `tracking-et-mesure.md`).

## 10. Après la soumission

**Immédiatement :**
- Rediriger vers `/pub/merci` avec un message qui confirme le délai promis
- Afficher le numéro de téléphone : certains veulent appeler tout de suite après avoir rempli
- Courriel de confirmation au prospect avec un récapitulatif de sa demande

**Au client, en moins de 60 secondes :**
- SMS **et** courriel — pas seulement le courriel, qui dort dans une boîte
- Contenu : nom, téléphone cliquable, type de projet, échéancier, page d'origine

Le chiffre qui justifie tout ce paragraphe : environ 78 % des clients achètent de la première entreprise qui répond, et répondre en moins d'une minute multiplie fortement le taux de conversion, alors qu'attendre cinq minutes fait chuter les chances de qualification d'environ 80 %. En rénovation, plus de la moitié des entrepreneurs mettent plusieurs jours. C'est là que se gagne le funnel — pas dans le choix de la couleur du bouton.

**Si le client ne peut pas s'engager sur un délai court**, l'écrire honnêtement sur la page (« On vous rappelle en moins de 4 heures ouvrables ») plutôt que de promettre ce qui ne sera pas tenu.
