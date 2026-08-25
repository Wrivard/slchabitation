# Tracking et mesure

Table des matières :
1. Architecture de mesure
2. Consent Mode v2 et Loi 25
3. Captation des identifiants de clic
4. Actions de conversion : les définir correctement
5. Conversion côté serveur
6. Enhanced conversions
7. Boucle de rétroaction sur la qualité des leads
8. GA4 et double comptage
9. Suivi des appels
10. Débogage

---

## 1. Architecture de mesure

```
Clic sur l'annonce
  └─ URL avec gclid/gbraid/wbraid + suffixe d'URL final
       └─ Page funnel
            ├─ Consent Mode v2 : default denied (avant tout tag)
            ├─ Bannière de consentement (français, granulaire)
            ├─ Captation des identifiants → sessionStorage + champs cachés
            │                             + captation serveur de l'URL
            └─ Soumission du formulaire
                 └─ POST /api/funnel/lead
                      ├─ validation anti-spam + schéma
                      ├─ insertion Supabase
                      ├─ notifications (SMS + courriel, < 60 s)
                      └─ CONVERSION déclenchée ici, pas avant
                           ├─ Google Ads (Lead soumis)
                           └─ GA4 (événement clé)

Plus tard, dans le CRM
  └─ Lead qualifié / RDV pris / Contrat signé
       └─ Import de conversions hors ligne (Data Manager)
            └─ C'est CETTE conversion qui devrait piloter le bidding
```

## 2. Consent Mode v2 et Loi 25

Au Québec, la Loi 25 exige un consentement **explicite et préalable** pour tout témoin non essentiel — analytique et publicitaire inclus. C'est plus strict que la baseline fédérale. La Loi 25 s'applique selon la localisation du visiteur, pas celle de l'entreprise.

Ce que ça implique concrètement :

- **Chargement conditionnel réel** des scripts, pas un bandeau décoratif. Si les tags se déclenchent avant le choix, la page n'est pas conforme, peu importe la bannière.
- **Mode avancé de Consent Mode v2** plutôt que le mode de base : `default: denied` posé **avant** le chargement du tag, puis `update` après le choix.
- **Granularité par finalité.** Un seul bouton « Tout accepter » qui regroupe stockage, analytique et personnalisation est à risque ; le régulateur a signalé une préférence pour des choix par finalité.
- **Bannière en français.** Une bannière uniquement en anglais n'est pas conforme au Québec.
- **Possibilité de changer d'avis** — un lien permanent vers les préférences, dans le pied de page.
- **Lien vers une politique de confidentialité réelle et à jour.**

```html
<!-- AVANT tout autre tag, en inline dans le <head> -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
</script>
```

Puis, au clic de l'utilisateur :

```ts
gtag('consent', 'update', {
  ad_storage: choices.ads ? 'granted' : 'denied',
  ad_user_data: choices.ads ? 'granted' : 'denied',
  ad_personalization: choices.ads ? 'granted' : 'denied',
  analytics_storage: choices.analytics ? 'granted' : 'denied',
})
```

**Point important :** le refus de consentement n'empêche pas de compter le lead. La conversion serveur (section 5) fonctionne indépendamment du consentement aux témoins, parce qu'elle repose sur l'identifiant de clic présent dans l'URL et sur une donnée que la personne a volontairement fournie dans un formulaire. Documenter cette finalité dans la politique de confidentialité.

## 3. Captation des identifiants de clic

Google utilise trois identifiants selon le contexte :

| Paramètre | Contexte | Utilisable pour enhanced conversions for leads |
|---|---|---|
| `gclid` | Clic web classique | Oui |
| `gbraid` | Parcours impliquant une app iOS avec consentement ATT | **Non** |
| `wbraid` | Parcours app iOS sans consentement ATT | **Non** |

**Ne capter que `gclid` est l'erreur d'implémentation la plus fréquente et la plus coûteuse.** Les clics arrivent, mais l'attribution disparaît silencieusement sur une part croissante du trafic iOS, et ça ressemble à une baisse de performance alors que c'est un problème de configuration.

Capter aussi `gad_source`, `gad_campaignid` et l'ensemble des `utm_*`.

**Deux points de captation, parce qu'un seul ne suffit plus :**

1. **Client** — au premier rendu, lire `window.location.search`, écrire en `sessionStorage`, remplir les champs cachés du formulaire. Persiste si la personne navigue sur la page.
2. **Serveur** — la route handler lit aussi le `Referer` et l'URL transmise. Le Link Tracking Protection de Safari peut retirer des paramètres avant que le JavaScript ne s'exécute.

Stocker les valeurs **telles quelles** : pas de trim, pas de changement de casse, pas de décodage-réencodage. Colonne `varchar(255)`.

Voir `assets/attribution.ts` pour l'implémentation.

## 4. Actions de conversion : les définir correctement

L'erreur structurelle la plus commune est d'avoir une seule action de conversion « Formulaire » et de laisser le Smart Bidding optimiser dessus. L'algorithme optimise alors pour la quantité de formulaires, ce qui n'est pas l'objectif d'affaires.

**À créer dans Google Ads :**

| Action | Déclenchement | Primaire pour le bidding ? |
|---|---|---|
| `Funnel – Lead soumis` | Serveur, après validation | Au démarrage seulement (volume) |
| `Funnel – Lead validé` | Import hors ligne, quand le lead est joignable et dans la zone | Oui, dès que le volume le permet |
| `Funnel – RDV pris` | Import hors ligne | Oui si le volume est suffisant |
| `Funnel – Contrat signé` | Import hors ligne, avec valeur | Idéalement, avec valeur réelle |
| `Funnel – Appel téléphonique` | Clic sur le numéro / suivi d'appel | Secondaire ou primaire selon le métier |

Règles :
- **Une action par funnel** si les services ont des valeurs très différentes (une cuisine et une salle de bain ne valent pas la même chose)
- **Nommer les actions comme le CRM les nomme.** Ne pas appeler « Qualifié » ce que l'équipe appelle « Accepté par les ventes ».
- **Ne pas marquer toutes les actions comme primaires.** Les actions secondaires servent à l'observation, pas au bidding.
- **Attribuer une valeur** dès que possible, même approximative — c'est ce qui permet de passer à une stratégie de valeur.

## 5. Conversion côté serveur

Le spam de formulaire déclenche la balise de conversion avant qu'un CAPTCHA n'ait le temps d'intervenir, et le Smart Bidding traite ce spam comme un signal d'entraînement. Le correctif durable est serveur : recevoir la soumission, valider, **puis seulement** envoyer la conversion.

Ce que ça change :
- Les bots qui passent l'interface ne polluent plus le bidding
- La conversion survit aux bloqueurs de publicité et aux limites de témoins
- On peut appliquer des règles métier (hors zone desservie = pas de conversion)

Implémentation minimale dans la route handler : après insertion réussie, envoyer la conversion à Google Ads en incluant l'identifiant de clic capté, puis marquer `conversion_sent = true` pour éviter les doublons en cas de rejeu.

Voir `assets/api-lead-route.ts`.

## 6. Enhanced conversions

Les enhanced conversions envoient des données client de première partie hachées en SHA-256 (courriel, téléphone) pour rattacher une conversion à un clic quand les témoins ne suffisent plus.

**État en 2026 :**
- Depuis avril 2026, les enhanced conversions pour le web et pour les leads sont réunies sous **un seul réglage on/off** au niveau du compte. Google accepte les données utilisateur provenant des balises du site, de Data Manager et des connexions API sans qu'il faille choisir une méthode.
- **Depuis le 15 juin 2026**, les imports de conversions hors ligne et les téléversements d'enhanced conversions for leads passent par la **Data Manager API** et sont bloqués dans l'API Google Ads. Vérifier le pipeline si un client a une intégration plus ancienne.

**Prérequis dans le compte :** conditions relatives aux données client acceptées, balisage automatique activé, collecte des données fournies par l'utilisateur activée dans les paramètres de la balise.

**Hachage :** normaliser avant de hacher — minuscules, espaces retirés, téléphone au format E.164 (`+15145550123`). Un hachage sur une valeur non normalisée ne correspondra jamais.

```ts
async function sha256(value: string) {
  const normalized = value.trim().toLowerCase()
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
```

**Limite à connaître :** les enhanced conversions for leads ne fonctionnent pas avec `gbraid` ni `wbraid`. Pour ces parcours, on reste sur l'import de conversions hors ligne classique.

## 7. Boucle de rétroaction sur la qualité des leads

C'est ce qui sépare un funnel qui s'améliore d'un funnel qui stagne.

1. L'équipe qualifie chaque lead dans le CRM : joignable, dans la zone, projet réel, budget plausible
2. Le statut est mis à jour dans `funnel_leads` (`validated`, `rejected`, `won`, avec `value_cad`)
3. Un job périodique téléverse les conversions hors ligne à Google Ads via Data Manager, avec l'identifiant de clic ou les données hachées
4. Le bidding bascule progressivement de `Lead soumis` vers `Lead validé` puis `Contrat signé`

Sans cette boucle, Google ne voit qu'une soumission de formulaire — et une soumission de mauvaise qualité ressemble en tout point à une bonne. Avec la boucle, le système apprend à chercher des clients plutôt que des remplisseurs de formulaire.

Ne pas téléverser une soumission de formulaire et un contrat signé sous la même action de conversion : ce sont des résultats différents et le mélange rend le signal inexploitable.

## 8. GA4 et double comptage

Deux façons de faire remonter les conversions dans Google Ads :
- La balise Google Ads directement
- L'import d'événements clés GA4

**Choisir une seule source par action de conversion.** Importer l'événement GA4 *et* garder la balise Ads pour le même événement double le compte et fausse le bidding.

Recommandation : **balise Google Ads pour les conversions qui pilotent le bidding**, GA4 pour l'analyse du parcours (étapes du formulaire, défilement, temps sur la page). Marquer l'événement GA4 comme événement clé sans l'importer dans Ads.

Événements GA4 utiles sur un funnel :
```
funnel_view          { funnel_slug, variant }
form_start           { funnel_slug }
form_step_complete   { funnel_slug, step }
form_submit          { funnel_slug }
phone_click          { funnel_slug }
```
Les étapes du formulaire sont le diagnostic le plus utile qui existe : elles montrent exactement à quelle question les gens abandonnent.

## 9. Suivi des appels

En services résidentiels, l'appel convertit souvent nettement mieux que le formulaire, parce que la personne s'auto-qualifie avant de composer.

- **Minimum viable :** le numéro est un lien `tel:` et le clic déclenche un événement de conversion. Simple, gratuit, sans risque.
- **Suivi d'appel avec numéro dynamique (DNI) :** plus précis, mais attention à la cohérence NAP — un numéro différent sur la page funnel que sur la fiche Google Business peut brouiller les signaux locaux. Sur une page en `noindex`, le risque est faible, mais il faut vérifier que le numéro affiché reste joignable et identifiable.
- **Extension d'appel dans Google Ads** : les conversions d'appel depuis l'annonce se configurent côté compte, pas sur la page.

Un appel manqué est un lead perdu et payé. Si le client ne peut pas répondre en tout temps, prévoir un renvoi ou une boîte vocale qui promet un rappel avec un délai précis.

## 10. Débogage

Ordre de vérification quand « le tracking ne marche pas » :

1. **L'URL après le clic contient-elle bien un identifiant de clic ?** Cliquer sur sa propre annonce en aperçu et regarder la barre d'adresse.
2. **Le paramètre survit-il aux redirections ?** Toute redirection qui perd le paramètre casse tout.
3. **Le champ caché du formulaire est-il rempli ?** Inspecter le DOM avant de soumettre.
4. **La valeur est-elle bien en base ?** Regarder la ligne insérée.
5. **La conversion est-elle envoyée ?** Vérifier `conversion_sent` et les journaux serveur.
6. **Le balisage automatique est-il activé** dans Google Ads ? Sans lui, pas de `gclid`.
7. **Les conditions relatives aux données client sont-elles acceptées ?** Sinon les enhanced conversions ne démarrent jamais.
8. **Délais normaux :** jusqu'à 48 h pour voir apparaître les données d'enhanced conversions ; jusqu'à 72 h pour les conversions attribuées via `gbraid`/`wbraid`.

Outils : Google Tag Assistant, le mode Aperçu de GTM, le DebugView de GA4, et les diagnostics de données hors ligne dans Google Ads.
