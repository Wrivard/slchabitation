import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Liste des pages à comparer avant/après une modification.
 *
 * La source de vérité reste `src/lib/seo-route-metadata.json` : toute route
 * prérendue y figure déjà, donc une nouvelle page entre automatiquement dans la
 * vérification sans qu'on l'ajoute ici.
 */
export async function readParityRoutes(root) {
  const metadata = JSON.parse(
    await readFile(path.join(root, 'src/lib/seo-route-metadata.json'), 'utf8'),
  );

  return metadata.routes.map((route) => route.path);
}

/** Largeurs représentatives : téléphone, tablette, ordinateur. */
export const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'desktop', width: 1440, height: 900 },
];

/**
 * Deux états sont comparés pour chaque page :
 * - `static` : le document prérendu seul, sans JavaScript. C'est ce que voit un
 *   robot d'indexation et ce que le visiteur voit avant l'hydratation.
 * - `hydrated` : la même page une fois React monté.
 * Une divergence entre les deux trahit une version de secours qui s'écarte du
 * vrai site.
 */
export const renderModes = ['static', 'hydrated'];

/** Nom de fichier stable pour une capture. */
export function shotName(routePath, viewportName, mode) {
  const slug = routePath === '/' ? 'accueil' : routePath.slice(1).replaceAll('/', '__');
  return `${slug}--${viewportName}--${mode}.png`;
}

/** Chemin du fichier prérendu correspondant à une route. */
export function prerenderedFileFor(outputDir, routePath) {
  return routePath === '/'
    ? path.join(outputDir, 'index.html')
    : path.join(outputDir, routePath.slice(1), 'index.html');
}
