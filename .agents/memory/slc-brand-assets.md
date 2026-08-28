---
name: Repères visuels de la marque SLC
description: Où se trouve le vrai logo, quelle couleur est réellement celle de la marque, et le piège des fichiers laissés par le gabarit Webflow.
---

Le vrai logo est le fichier importé de Webflow au nom de gabarit (préfixe
`relume-`), référencé par l'entête du site : « SLC » en orange, « HABITATION »
en noir. Le fichier au nom évident, `Logo.svg`, est un reste du gabarit et
affiche le mot « Logo » en écriture cursive.

**Pourquoi :** un logo choisi par son nom de fichier a déjà failli partir dans
des courriels de production. Le nom parlant appartient au gabarit, pas au
client ; le fichier utile porte un nom opaque.

**Comment l'appliquer :** chercher quel fichier l'entête du site charge
réellement avant d'utiliser un logo ailleurs, puis l'ouvrir pour le regarder.
La couleur de la marque se lit dans ce fichier — orange — et non dans les
variables de thème héritées de shadcn, qui coïncident par hasard.

Le site lui-même est monochrome : noir, blanc, gris. L'orange est un accent,
pas une couleur de fond. Sur un fond sombre, le mot noir du logo disparaît :
prévoir une variante aux lettres blanches plutôt que d'éclaircir le fond.
