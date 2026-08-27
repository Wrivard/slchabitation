---
name: Shells HTML multiples sous Vite
description: Une entrée HTML par route implique que rien ajouté au seul index.html n'est global.
---

Quand un projet Vite déclare plusieurs entrées HTML (une par route en plus de `index.html`),
chaque route peut être servie par un shell différent. Il n'existe donc pas de « page HTML du
projet » : toute feuille de style, meta ou script global doit être ajouté à **tous** les shells.

**Why:** une règle CSS ajoutée au seul `index.html` s'appliquait à certaines routes et pas à
d'autres, ce qui se présente comme un conflit de spécificité alors que la feuille n'est
simplement pas chargée.

**How to apply:** en cas de « cette règle ne s'applique pas sur cette page », vérifier d'abord la
présence de la feuille dans `document.styleSheets` avant de chercher une surcharge.

Cas le plus coûteux observé : en développement, Vite injecte la feuille de l'application sur
n'importe quelle page servie, donc l'aperçu paraît correct ; seule la version **construite** d'une
route servie par son propre shell s'en retrouve privée. Des pages sont ainsi restées longtemps
publiées sans mise en page, sans que rien ne le signale. Un contrôle qui ne regarde que le serveur
de développement ne peut pas voir ce défaut : comparer les pages **construites**. Réunir toutes les
routes sur un seul shell supprime la classe de bugs entière.
