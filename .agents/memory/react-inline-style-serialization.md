---
name: Styles en ligne et sélecteurs [style*=…]
description: Passer d'un HTML injecté à du JSX réécrit les styles en ligne et casse silencieusement les sélecteurs CSS qui les ciblent par sous-chaîne.
---

React sérialise `style` sans espace après les deux-points ni point-virgule final
(`position:absolute;left:50%`), là où un export d'outil visuel écrit
`position: absolute; left: 50%;`. Toute règle CSS de la forme
`[style*="position: absolute"]` cesse donc de s'appliquer dès qu'un balisage
passe de l'injection HTML au JSX.

**Pourquoi :** en convertissant les pages du site en composants React, un
correctif mobile du pied de page ciblait le crédit par son style en ligne. Le
sélecteur ne matchait plus : l'élément redevenait positionné en absolu, et la
page perdait 64 px de hauteur sur mobile — invisible dans les contrôles DOM,
visible seulement à la comparaison de captures.

**Comment l'appliquer :** avant toute conversion de balisage vers JSX, chercher
`style*=` dans les feuilles du projet et rendre ces sélecteurs tolérants aux
deux écritures. Plus généralement, se méfier de toute règle qui dépend du
*texte* d'un attribut réécrit par le rendu (style, et par extension les
comparaisons d'attributs sérialisés dans les garde-fous, qu'il faut normaliser
des deux côtés).
