---
name: Courriels transactionnels
description: Contraintes de rendu et d'échappement propres aux courriels, et façon de les vérifier sans boîte de réception.
---

Un courriel n'est pas une page : pas de feuille de style externe, pas de mise en
page moderne, pas de SVG, pas de police téléchargée. Tableaux imbriqués, styles
en ligne, largeur fixe autour de 600 px, images matricielles servies en absolu.

**Échapper le texte ne suffit pas dans un attribut.** Une valeur saisie par un
visiteur — typiquement son adresse courriel — placée dans un `href` peut
refermer l'attribut et en ouvrir d'autres chez le destinataire ; la validation
d'adresse laisse passer les guillemets. Percent-encoder la destination *puis*
l'échapper, et faire échapper le lien par le composant qui le rend, pour
qu'aucun appelant ne puisse l'oublier.

**Pourquoi :** une revue a trouvé exactement cette faille dans un bouton
« Répondre » dont tout le texte visible était pourtant correctement échappé.

**Comment vérifier sans envoyer :** rendre le gabarit avec des valeurs hostiles
dans chaque champ, ouvrir le HTML dans un navigateur sans tête et compter les
balises `script`, les images inattendues et les attributs commençant par `on` —
zéro partout. Pour l'aspect, capturer le rendu en pleine page. Pour la
livraison, l'adresse bac à sable de Resend accepte un envoi complet, pièces
jointes comprises, sans écrire à personne. Toujours joindre une version texte :
son absence est un signal pour les filtres.
