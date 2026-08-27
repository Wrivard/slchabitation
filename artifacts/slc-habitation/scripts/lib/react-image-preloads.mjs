/**
 * Préchargements d'images ajoutés par React.
 *
 * Quand React rend une page, il ajoute de lui-même une balise
 * `<link rel="preload" as="image">` pour chaque image qui n'est pas différée
 * (`loading="lazy"`). Ces balises n'affichent rien et n'existent pas dans
 * l'export Webflow d'origine : elles apparaissent donc comme un écart dans les
 * comparaisons, alors qu'elles ne changent rien à ce que voit le visiteur.
 *
 * Ce module reconnaît ces balises — et elles seules : un préchargement qui ne
 * correspond à aucune image de la page reste signalé.
 */

function normalize(value) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

/** Adresses des images de la page que le navigateur charge sans attendre. */
export function nonLazyImageSources(root) {
  const sources = new Set();

  for (const image of root.querySelectorAll('img')) {
    if (image.getAttribute('loading') === 'lazy') continue;
    const source = normalize(image.getAttribute('srcset') ?? image.getAttribute('src'));
    if (source) sources.add(source);
  }

  return sources;
}

/** Vrai si cette balise `<link>` est un préchargement ajouté par React. */
export function isAutomaticImagePreload(link, sources) {
  if ((link.rawTagName || '').toLowerCase() !== 'link') return false;
  if (normalize(link.getAttribute('rel')) !== 'preload') return false;
  if (normalize(link.getAttribute('as')) !== 'image') return false;

  const target = normalize(link.getAttribute('imagesrcset') || link.getAttribute('href'));
  return sources.has(target);
}
