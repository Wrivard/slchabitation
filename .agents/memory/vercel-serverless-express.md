---
name: Servir une app Express en fonction Vercel depuis un monorepo
description: Contraintes de compilation, de taille de requête et de routage quand le backend du site publié est une fonction Vercel plutôt qu'un serveur.
---

Un site statique publié sur Vercel obtient un backend en déposant une fonction attrape-tout dans `api/` à la racine du dépôt. Elle peut exporter directement une app Express : l'instance est un gestionnaire `(req, res)` valide, donc une seule implémentation sert à la fois l'hôte public et le service qui tourne en continu.

**Why:** Dupliquer la logique du formulaire (validation, captcha, courriel) dans une fonction séparée garantit que les deux copies divergent. Et une première tentative en TypeScript a fait échouer chaque déploiement.

**How to apply:**

- **Ne pas écrire la fonction en TypeScript dans un monorepo.** Vercel compile les fichiers de `api/` avec ses propres réglages de modules (résolution `node16`), pas ceux de l'espace de travail : chaque import relatif sans extension et chaque typage de dépendance échoue, y compris dans le code importé. Faire produire un paquet autonome par le build existant et n'écrire qu'un fichier `.mjs` qui le réexporte. Aucune compilation TypeScript ne dépend alors de l'hôte.
- Le corps d'une requête est plafonné à 4,5 Mo. Toute limite d'envoi de fichiers côté client doit rester sous ce seuil, sinon le refus vient de l'hébergeur et l'utilisateur ne reçoit aucun message utile.
- Un journal avec transport (pino-pretty) n'a pas sa place en serverless ; le conditionner à l'environnement, sinon le paquet embarque un worker inutile.
- Vérifier avant publication en empaquetant la fonction comme le fait l'hôte (esbuild, plateforme node) puis en la servant derrière un `http.createServer` local : cela révèle les échecs de résolution et de journalisation sans consommer un déploiement.
- Retirer toute réécriture qui renvoie `/api/*` vers un autre hôte, sinon elle court-circuite silencieusement la fonction.
