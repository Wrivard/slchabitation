---
name: Scripts tiers liés à un domaine autorisé
description: Pourquoi une balise tierce (Cookiebot, widgets à liste blanche) fait « planter » l'aperçu de développement alors que le site publié va bien.
---

Un service tiers dont la configuration est indexée par nom de domaine (Cookiebot en tête, mais
aussi la plupart des widgets à liste blanche) renvoie un 404 sur son fichier de configuration
lorsqu'il est chargé depuis `127.0.0.1` ou depuis le domaine `.replit.dev` de l'aperçu. L'échec de
chargement d'une balise `<script>` déclenche un événement `error` sans objet `Error` : la
surcouche d'erreurs de Replit l'affiche alors comme « (unknown runtime error) », sans pile utile
et sans rapport visible avec le code de l'application. Le site publié, lui, fonctionne
parfaitement.

**Why:** on cherche longtemps une régression dans son propre code alors que le message ne vient
pas de l'application. Le signe distinctif est un `event.error` indéfini avec un `event.target` de
type `SCRIPT` : c'est une ressource qui n'a pas pu se charger, pas une exception.

**How to apply:** devant une « erreur d'exécution » sans pile, écouter `window` en phase de capture
et journaliser `event.target.src` avant toute autre hypothèse. Quand c'est bien un tiers lié au
domaine, retirer la balise **uniquement en développement** (greffon Vite `apply: 'serve'` +
`transformIndexHtml`), jamais du HTML construit : la version publiée doit conserver le script
d'origine, au même endroit dans l'entête.
