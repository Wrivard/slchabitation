---
name: Ancres dans le markup Webflow hérité
description: Comment repérer de façon fiable un bloc du HTML exporté de Webflow quand on le remplace par du React ou du markup généré.
---

Quand un script de build repère un bloc hérité par sa classe, comparer la **liste
de classes** de la balise (découpage sur les espaces) plutôt que d'utiliser une
expression régulière avec `\b`, et exiger **exactement une** correspondance.

**Pourquoi :** dans le HTML exporté de Webflow, les blocs voisins portent des
noms dérivés (`contact6_content` et `contact6_content-left`). Le `-` est une
frontière de mot en regex, donc `\bcontact6_content\b` matche aussi la variante
suffixée : on découpe alors le mauvais bloc, sans erreur visible. Sans contrôle
d'unicité, un futur export contenant deux grilles semblables casserait la page
en silence au lieu d'échouer au build.

**Comment l'appliquer :** dans tout utilitaire qui remplace ou supprime un
morceau du markup exporté, tolérer les guillemets simples comme doubles, filtrer
sur la liste de classes exacte, et lever une erreur explicite si le compte n'est
pas de 1. Un build qui échoue vaut mieux qu'une page publique amputée.
