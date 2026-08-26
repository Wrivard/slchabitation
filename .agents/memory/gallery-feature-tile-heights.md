---
name: Galerie « tuile vedette + tuiles empilées »
description: Pourquoi une tuile vedette ne dicte pas la hauteur d'un bloc CSS grid tant que les images voisines restent dans le flux.
---

Dans une composition « une grande tuile d'un côté, deux tuiles empilées de l'autre », la hauteur du bloc doit venir uniquement du ratio de la tuile vedette. Ça ne marche pas si les images des tuiles empilées restent dans le flux : le conteneur n'a pas de hauteur définie, donc des rangées en `1fr` se dimensionnent sur le contenu, et la hauteur naturelle des photos (souvent 800 px et plus une fois mises à la largeur de la colonne) l'emporte sur la vedette.

La combinaison qui tient :
- la pile passe en `display: contents` pour que ses tuiles deviennent des cellules du bloc ;
- la tuile vedette occupe les deux rangées et porte l'`aspect-ratio` ;
- les images sont sorties du flux (`position: absolute; inset: 0`) pour n'apporter aucune hauteur naturelle ;
- un modificateur gère le cas « une seule tuile empilée », qui doit alors occuper les deux rangées, sinon une rangée reste vide.

**Why:** une première version reposait sur `height: 100%` et `grid-auto-rows: 1fr` ; elle mesurait juste par hasard dans un cas, puis a produit des tuiles de 800 px et une grande zone blanche dès que le calcul des rangées a réellement pris le contenu en compte.

**How to apply:** dès qu'une tuile doit imposer sa hauteur à ses voisines dans une grille à hauteur automatique, retirer les images du flux plutôt que de leur donner une hauteur en pourcentage. Garder les ratios d'image pour le repli mobile en une colonne, où c'est l'image qui doit dimensionner la tuile.

Un libellé superposé sur photo ne peut pas se fier à un dégradé qui s'estompe : le texte le plus haut (surtitre, ou titre sur deux lignes) finit dans la zone claire. Garder le fond plein sous toute la zone de texte et ne faire le fondu qu'au-dessus.
