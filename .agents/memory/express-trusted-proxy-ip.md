---
name: Adresse client derrière un proxy (Express)
description: req.ip suit x-forwarded-for dès que trust proxy est actif; choisir la bonne source selon l'usage.
---

Avec `trust proxy` actif, `req.ip` est dérivé de `x-forwarded-for`. Il suit donc ce que le client déclare et ne prouve rien. Seul `req.socket.remoteAddress` correspond à la connexion réelle.

**Why:** Un plafond anti-abus censé être infalsifiable avait été indexé sur `req.ip`. En faisant tourner un `x-forwarded-for` forgé, chaque requête obtenait un compteur neuf et le plafond ne se déclenchait jamais. Le test l'a révélé ; la lecture du code ne l'avait pas montré.

**How to apply:** Séparer les deux usages.

- Distinguer les visiteurs entre eux (limite par personne derrière un proxy partagé) : première entrée de `x-forwarded-for`. Utile, mais falsifiable.
- Poser une borne qu'un en-tête forgé ne peut pas contourner : `req.socket.remoteAddress`, avec un plafond plus haut. Derrière un proxy, cette borne devient globale au site — la dimensionner en conséquence.

Ne pas envoyer une adresse issue d'un en-tête au `remoteip` d'une vérification anti-robot : si elle est fausse, le fournisseur rejette des soumissions légitimes. Le paramètre est optionnel ; l'omettre est plus sûr que le renseigner approximativement.

Vérifier ce genre de limite par une requête réelle répétée, pas par relecture : le comportement dépend de la configuration du proxy, pas du code seul.
