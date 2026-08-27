---
name: Lisibilité et audit de contraste
description: Comment mesurer le contraste réel d'un site (fond photo compris) et pourquoi les règles de hiérarchie écrites à la main pendant une conversion repeignent des blocs non prévus.
---

## Mesurer le fond, ne pas le déduire

Pour savoir ce qu'il y a derrière un texte, photographier la page une seconde
fois après avoir rendu tous les textes transparents (`color`,
`-webkit-text-fill-color`, `text-shadow`, `text-decoration-color`). Les pixels
de la seconde image, lus aux coordonnées des `getClientRects()` des nœuds de
texte, donnent le fond exact : photo, dégradé, voile semi-opaque compris.

**Pourquoi :** remonter les `background-color` des ancêtres ne voit ni les
images ni les voiles, et rate précisément le cas « texte sombre sur photo
sombre ». Prendre la **médiane** des contrastes échantillonnés le long de la
ligne : un pixel clair isolé ne doit ni masquer ni inventer un problème.

**Comment l'appliquer :** viser les rectangles des nœuds de texte, pas la boîte
de l'élément (sinon on mesure la marge) ; ignorer ce dont l'opacité cumulée des
ancêtres est < 1 (blocs en attente d'apparition) ; déclarer les exceptions par
**paire de couleurs** et non par texte ou liste de classes, sinon toute
correction de contenu fait échouer la vérification.

## Séparer un défaut hérité d'une régression

Lancer la même mesure sur une construction du site d'avant la modification et
comparer les paires : ce qui échoue des deux côtés relève de la charte, ce qui
n'échoue que d'un côté est la régression à corriger.

**Attention :** le commit de référence d'un projet n'est pas forcément l'état
« d'origine ». Vérifier ce qu'il contient avant de conclure qu'un défaut
préexistait.

## Règles de hiérarchie écrites à la main

Une règle du genre « le titre qui suit un surtitre prend telle couleur »
(`.margin-bottom:has(> .tagline) ~ h3`) attrape tout bloc qui a la même forme —
y compris le contenu d'une carte photo, dont le titre doit rester blanc.

**Pourquoi :** dans un export Webflow, la couleur vient d'une classe posée sur
un ancêtre (`.text-color-white`) et de l'héritage ; une règle qui vise
directement le titre casse cet héritage sans que rien ne le signale.

**Comment l'appliquer :** faire gagner la classe de couleur portée par le bloc
en ajoutant une règle plus spécifique (`.text-color-white ... ~ :is(h1..h6)`),
plutôt que d'exclure au cas par cas.

## `:has()` imbriqué : règle silencieusement ignorée

`:has(> .a:has(> .b))` est invalide : le navigateur jette **toute la règle** et
elle n'apparaît même pas dans `document.styleSheets[].cssRules`.

**Comment le vérifier :** `CSS.supports('selector(:has(> .a:has(> .b)))')` et la
liste des `cssRules` de la feuille concernée. Une règle absente de cette liste
ne colore rien, quoi qu'en dise le fichier.
