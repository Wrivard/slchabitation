---
name: Lightbox Webflow sans runtime
description: Règle d’interaction et de secours pour les galeries héritées du site Webflow.
---

Le balisage lightbox exporté par Webflow reste inerte lorsque le moteur Webflow
n’est plus chargé. Une galerie qui le conserve a donc besoin de son propre
comportement, sans sacrifier une véritable URL d’image de secours.

**Why:** le JSON est utile dans le HTML source, mais sans gestionnaire un clic
quitte la page au lieu d’ouvrir la photo. Le `href` réel reste indispensable
pour les visiteurs sans JavaScript et pour les robots.

**How to apply:** lors d’un changement de galerie héritée, vérifier séparément
le comportement avec JavaScript et la destination utile sans JavaScript.