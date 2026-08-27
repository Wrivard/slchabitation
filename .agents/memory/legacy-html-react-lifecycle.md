---
name: HTML hérité monté dans React
description: Contraintes de cycle de vie quand une page Webflow entière est injectée via dangerouslySetInnerHTML puis complétée par du React.
---

# Rejouer les écouteurs tardifs

Les scripts embarqués dans le balisage hérité s'exécutent après le montage React :
leurs écouteurs `DOMContentLoaded` / `load` ne se déclencheront jamais, car ces
événements sont déjà passés. Il faut intercepter `document.addEventListener` /
`window.addEventListener` pendant l'exécution des scripts et rejouer ces
rappels une fois le balisage en place.

**Pourquoi :** sans cela, menus, carrousels et interactions Webflow restent inertes.

**Comment l'appliquer :** dans l'effet qui ré-exécute les `<script>` du balisage
injecté.

# Ne jamais laisser React réappliquer `dangerouslySetInnerHTML`

React réécrit `innerHTML` du conteneur à chaque rendu de cet élément. Tout nœud
du balisage hérité capturé auparavant (par `querySelector`, pour y monter un
portail ou y attacher un observateur) devient alors **détaché du document** :
il garde ses enfants, mais plus rien ne s'affiche, sans la moindre erreur.

**Pourquoi :** symptôme observé sur une page où un formulaire React monté par
`createPortal` dans un emplacement du balisage hérité disparaissait dès le
premier changement d'état ; le nœud conservé était `isConnected === false` et un
nouveau nœud homonyme vivait dans le document.

**Comment l'appliquer :** mémoriser l'élément conteneur (`useMemo(() => <div
ref=... dangerouslySetInnerHTML=... />, [])`) pour que React saute sa
réconciliation, ou le sortir dans un composant `memo` sans props. Diagnostic
rapide : journaliser `node.isConnected` et comparer avec
`document.getElementById(...)`.
