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

**Attention — le chrome est dupliqué.** Les pages issues de l'export gardent chacune leur propre
copie de la navigation et du pied de page, à côté du bloc partagé. Changer une entrée de menu
demande donc de modifier toutes les copies d'un coup (script de réécriture, pas édition à la main)
puis de vérifier le **rendu construit** de plusieurs pages : une copie oubliée ne se voit sur
aucune page que l'on regarde par hasard. Les empreintes de parité doivent être régénérées après un
changement de menu volontaire, sinon la vérification reste rouge et cesse de servir d'alerte.

**How to apply:** vaut pour tout bloc legacy réemployé ailleurs. Si le bloc s'affiche « presque
bien » mais avec de mauvaises couleurs, chercher les variables manquantes ; s'il s'affiche bien
mais ne réagit pas, c'est l'interaction qui manque.
