---
name: Publication GitHub
description: Contraintes non évidentes pour publier les changements de ce projet sur GitHub.
---

Le dépôt local ne possède aucun identifiant HTTPS : `git push` échoue toujours par authentification invalide. Publier par la connexion GitHub de Replit, en écrivant le commit via l'API Git Data (blobs, arbre, commit, mise à jour de la référence) avec le client authentifié de la connexion.

**Why:** Le push standard n'est jamais utilisable ici, et une publication est parfois indispensable pour déclencher la construction de l'hébergeur qui sert le domaine public. Lors d'un incident distinct, les lectures de l'API fonctionnaient mais les écritures renvoyaient une page HTML 403 du proxy ; l'écriture par l'API a depuis fonctionné, donc l'essayer avant de déclarer le blocage.

**How to apply:**

- Construire l'arbre à partir de l'arbre du commit distant courant ; une suppression s'exprime par une entrée dont le `sha` est nul.
- **Ne jamais publier un arbre partiel.** Si la lecture d'un fichier échoue, interrompre : publier les suppressions sans leurs remplaçants laisse la branche dans un état cassé qui part aussitôt en construction.
- La sortie de `git diff --name-only` peut arriver avec un retour chariot en fin de ligne dans cet environnement ; le retirer, sinon le chemin ne correspond à aucun fichier et le fichier disparaît silencieusement de la publication.
- Après la mise à jour de la référence, relire un fichier publié depuis la branche distante pour confirmer, puis réaligner la branche locale sur le distant.
- Si les endpoints Git Data et Contents renvoient tous deux un 403 HTML, conserver le commit local et signaler le blocage plutôt que de demander ou manipuler un jeton.
