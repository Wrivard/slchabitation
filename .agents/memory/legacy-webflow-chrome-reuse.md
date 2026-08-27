---
name: Réutiliser la navbar Webflow hors des pages exportées
description: Ce qu'il faut emporter avec le balisage quand la navigation d'un export Webflow sert à des pages React.
---

Réutiliser la navbar / le pied de page d'un export Webflow ailleurs que dans les pages exportées
demande plus que le balisage :

1. **L'extraire au build** depuis la page source, avec échec bruyant si la structure change,
   plutôt que de recopier le balisage dans chaque page.
2. **Réimplémenter les interactions** (menu mobile, menus déroulants) en posant les mêmes
   marqueurs que Webflow, plutôt que de charger jQuery et `webflow.js` sur une page moderne.
3. **Reprendre les variables de thème** définies dans les balises `<style>` internes aux pages
   exportées : sans elles, les blocs repris changent de couleur.

**Why:** décision prise pour garder une seule source de vérité visuelle entre les pages legacy et
les pages React, sans embarquer le moteur d'interactions complet de Webflow.

**How to apply:** vaut pour tout bloc legacy réemployé ailleurs. Si le bloc s'affiche « presque
bien » mais avec de mauvaises couleurs, chercher les variables manquantes ; s'il s'affiche bien
mais ne réagit pas, c'est l'interaction qui manque.
