---
name: Publication GitHub
description: Contraintes non évidentes pour publier les changements de ce projet sur GitHub.
---

Utiliser la connexion GitHub de Replit pour publier; le dépôt local ne possède pas d’identifiants HTTPS utilisables.

**Why:** Le push Git standard échoue avec une authentification invalide. Lors d’un incident distinct, les lectures de l’API GitHub fonctionnaient encore, mais plusieurs méthodes d’écriture renvoyaient toutes une page HTML 403 du proxy.

**How to apply:** Publier par la connexion GitHub. Si les lectures réussissent mais que les endpoints Git Data et Contents renvoient tous deux un 403 HTML, conserver le commit local et signaler le blocage plutôt que de demander ou manipuler un jeton.