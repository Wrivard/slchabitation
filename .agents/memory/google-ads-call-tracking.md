---
name: Marquage publicitaire Google sur un site rendu par React
description: Pourquoi une commande « config » seule ne suffit pas quand le site passe par un conteneur de balises, et pourquoi le numéro de téléphone doit être redemandé après chaque rendu.
---

Google fournit deux lignes à coller (« ajoutez-les à chaque instance de la balise Google ») en supposant que la bibliothèque `gtag.js` est déjà chargée. Ce n'est pas le cas ici : le site charge un **conteneur** de balises (Tag Manager). Le conteneur partage bien la même file `dataLayer`, mais il n'exécute que les comptes déclarés à l'intérieur de lui. Une commande visant un compte publicitaire absent du conteneur tombe donc dans le vide, silencieusement.

**Why:** Suivi impossible à distinguer d'un problème de configuration côté Google : aucune erreur, aucune requête, la file contient bien la commande. Charger explicitement la bibliothèque pour l'identifiant publicitaire règle le cas et cohabite sans conflit avec le conteneur.

**How to apply:**

- Vérifier d'abord ce qui est réellement chargé dans l'entête : un conteneur (`gtm.js`) n'équivaut pas à la bibliothèque `gtag.js`.
- Laisser les valeurs par défaut du mode consentement s'exécuter avant tout chargement de balise ; y ajouter une balise après ces blocs, pas avant.
- **Le remplacement du numéro de téléphone ne survit pas au rendu React.** Il réécrit des nœuds de texte au chargement ; l'hydratation restaure ensuite le texte du document, et une navigation interne affiche des nœuds neufs. Rejouer la commande dans un effet lié à l'adresse courante. Rejouer est sans danger : ce n'est pas un événement de conversion, donc rien n'est compté deux fois.
- Pour vérifier, lire `window.dataLayer` dans un vrai navigateur et compter les commandes, plutôt que de se fier à l'interface de Google : une navigation interne doit en ajouter une sans recharger le document. Attention, les liens du balisage hérité provoquent un vrai rechargement ; simuler la navigation interne par `pushState` + `popstate`.
