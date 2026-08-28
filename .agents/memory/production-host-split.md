---
name: Domaine public et API sur deux hébergeurs
description: Le domaine réel n'est pas servi par le déploiement Replit; triage à faire avant de diagnostiquer une panne d'API.
---

Le domaine public de ce projet est servi par un hébergeur statique externe, alors que l'API vit dans le déploiement Replit. Les deux coexistent et servent des versions différentes du site.

Conséquence : un hébergeur de fichiers statiques n'a aucun backend, donc toutes les routes `/api/*` y répondent 404 même si le code serveur est correct et déployé ailleurs.

**Why:** Une panne de formulaire a été diagnostiquée plusieurs fois sur le mauvais hôte. Le déploiement Replit répondait correctement pendant que le vrai domaine, servi ailleurs, n'avait tout simplement pas d'API. Chaque correctif applicatif semblait donc « ne rien changer ».

**How to apply:** Avant de diagnostiquer une panne d'API en production, établir d'abord ces trois faits, dans l'ordre :

1. Quel hôte répond réellement sur le domaine du client (en-têtes de réponse et DNS), et non quel déploiement existe.
2. Si les routes `/api/*` existent sur cet hôte, ou si elles renvoient un 404 de l'hébergeur statique.
3. Si les variables et secrets dont dépend la route existent vraiment dans l'environnement — leur absence produit une erreur applicative propre qu'on prend facilement pour un bogue de code.

Quand le site statique doit joindre l'API, faire mandater `/api/*` par l'hébergeur statique vers le déploiement qui possède l'API : le navigateur reste en même origine et le CORS ne s'en mêle pas. Retenir que ce montage impose deux publications distinctes, une par hôte, et qu'une seule des deux ne suffit jamais.
