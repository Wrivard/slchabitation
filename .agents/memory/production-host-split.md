---
name: Quel hôte répond vraiment sur le domaine public
description: Triage obligatoire avant de diagnostiquer une panne d'API en production; le déploiement Replit n'est pas forcément ce que voit le visiteur.
---

Un projet peut avoir plusieurs publications vivantes en même temps (déploiement Replit et hébergeur externe), servant des versions différentes du même site. Le domaine du client n'en désigne qu'une seule.

Conséquence : un hébergeur de fichiers statiques n'a aucun backend, donc toutes les routes `/api/*` y répondent 404 même quand le code serveur est correct et déployé ailleurs.

**Why:** Une panne de formulaire a été diagnostiquée plusieurs fois sur le mauvais hôte. Le déploiement Replit répondait correctement pendant que le vrai domaine, servi ailleurs, n'avait tout simplement pas d'API. Chaque correctif applicatif semblait donc « ne rien changer ».

**How to apply:** Avant de diagnostiquer une panne d'API en production, établir d'abord ces trois faits, dans l'ordre :

1. Quel hôte répond réellement sur le domaine du client (en-têtes de réponse et DNS), et non quel déploiement existe.
2. Si les routes `/api/*` existent sur cet hôte, ou si elles renvoient un 404 de l'hébergeur statique.
3. Si les variables et secrets dont dépend la route existent vraiment dans l'environnement de **cet** hôte — leur absence produit une erreur applicative propre qu'on prend facilement pour un bogue de code.

Deux montages possibles quand le site public est statique : faire mandater `/api/*` vers le déploiement qui possède l'API (impose deux publications distinctes, une par hôte, et une seule ne suffit jamais), ou donner un backend à l'hôte public lui-même. Préférer le second : un seul hôte à publier, pas de saut réseau supplémentaire, et les secrets ne vivent qu'à un endroit.
