---
name: Marquage publicitaire Google sur un site rendu par React
description: Pourquoi une commande « config » seule ne suffit pas quand le site passe par un conteneur de balises, et pourquoi le numéro de téléphone doit être redemandé après chaque rendu.
---

Google fournit ses lignes à coller en supposant que la bibliothèque `gtag.js` est déjà chargée. Le site, lui, charge un **conteneur** de balises (Tag Manager). Un conteneur n'exécute que les comptes déclarés à l'intérieur de lui : une commande visant un compte absent tombe dans le vide, silencieusement. Mais un conteneur peut très bien porter déjà le compte publicitaire — c'est le cas ici — et alors la commande seule suffit.

**Why:** Les deux erreurs coûtent cher et ne se voient pas dans le code. Ne rien charger alors que le compte est absent du conteneur : aucune erreur, aucune requête, la file contient pourtant la commande. Charger la bibliothèque alors que le conteneur porte déjà le compte : chaque page est déclarée deux fois, ce qui gonfle les visites et les listes de remarketing.

**How to apply:**

- **Trancher par l'observation, pas par la lecture du code** : ouvrir le site **en ligne** dans un navigateur, accepter les témoins, puis lire `Object.keys(window.google_tag_manager)`. L'identifiant publicitaire y figure si le conteneur le porte déjà ; les requêtes vers `googleadservices.com/pagead/conversion/<id>` le confirment. Le code de l'entête ne dit rien de ce que contient le conteneur, qui se configure ailleurs.
- Laisser les valeurs par défaut du mode consentement s'exécuter avant tout chargement de balise ; y ajouter une balise après ces blocs, pas avant.
- **Le remplacement du numéro de téléphone ne survit pas au rendu React.** Il réécrit des nœuds de texte au chargement ; l'hydratation restaure ensuite le texte du document, et une navigation interne affiche des nœuds neufs. Rejouer la commande dans un effet lié à l'adresse courante. Rejouer est sans danger : ce n'est pas un événement de conversion, donc rien n'est compté deux fois.
- Pour vérifier, lire `window.dataLayer` dans un vrai navigateur et compter les commandes, plutôt que de se fier à l'interface de Google : une navigation interne doit en ajouter une sans recharger le document. Attention, les liens du balisage hérité provoquent un vrai rechargement ; simuler la navigation interne par `pushState` + `popstate`.
