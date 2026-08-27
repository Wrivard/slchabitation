---
name: Comparer avant/après avec un arbre de travail git
description: Méthode pour distinguer un vrai écart d'un simple changement d'outil de mesure quand une base de référence versionnée bouge.
---

Quand un garde-fou compare la sortie courante à une base enregistrée et que la
*normalisation* du garde-fou change en même temps que le code, le diff mélange
deux causes et ne prouve plus rien.

**Pourquoi :** régénérer la base « parce que les écarts semblent du bruit »
efface justement les régressions que la base devait attraper.

**Comment l'appliquer :** créer un arbre de travail git détaché sur le commit
d'avant, y lier les `node_modules` par lien symbolique, y copier la *version
courante* du script de mesure, reconstruire, puis comparer les deux sorties
mesurées par le même outil. Les écarts restants sont alors réels et se
revoient un par un avant de figer une nouvelle base. Penser à
`git worktree remove` ensuite.

Même méthode quand la base de référence est un commit **ancien** et qu'un garde-fou visuel signale
des dizaines d'écarts : ils mélangent alors les changements déjà acceptés et les siens. Construire
l'état d'avant dans un arbre de travail et mesurer les deux constructions avec le même script
répond seul à la question « lesquels de ces écarts viennent de moi ? ». Une simple mesure de
hauteur de page par route suffit souvent à trier avant de sortir l'artillerie des captures.
