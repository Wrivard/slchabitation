/**
 * Table des pages héritées en cours de conversion.
 *
 * Chaque entrée relie une route publique au fichier exporté par Webflow, au
 * composant React correspondant et aux traitements que la page applique
 * aujourd'hui à son balisage. C'est cette table que suit le convertisseur.
 */
export const legacyPages = [
  { route: '/', file: 'index.html', component: 'Home.tsx', semantics: 'index' },
  { route: '/a-propos', file: 'a-propos.html', component: 'APropos.tsx', semantics: 'a-propos' },
  { route: '/renovation', file: 'renovation.html', component: 'Renovation.tsx', semantics: 'renovation' },
  {
    route: '/agrandissement-construction-neuve',
    file: 'agrandissement-construction-neuve.html',
    component: 'Agrandissement.tsx',
    semantics: 'agrandissement-construction-neuve',
  },
  {
    route: '/travaux-sur-mesure',
    file: 'travaux-sur-mesure.html',
    component: 'TravauxSurMesure.tsx',
    semantics: 'travaux-sur-mesure',
  },
  { route: '/realisations', file: 'realisations.html', component: 'Realisations.tsx', semantics: 'realisations' },
  { route: '/soumission', file: 'soumission.html', component: 'Soumission.tsx', semantics: 'soumission' },
  {
    route: '/politique-de-cookie',
    file: 'politique-de-cookie.html',
    component: 'PolitiqueDeCookie.tsx',
    semantics: 'politique-de-cookie',
  },
  /* Anciennes adresses qui redirigent dans l'application : leur document
     statique expose toujours le contenu hérité. */
  { route: '/formulaire', file: 'formulaire.html', component: 'Formulaire.tsx', semantics: 'formulaire', redirects: true },
  {
    route: '/renovation-cuisine',
    file: 'renovation-cuisine.html',
    component: 'RenovationCuisine.tsx',
    semantics: 'renovation-cuisine',
    redirects: true,
  },
  {
    route: '/renovation-salle-de-bain',
    file: 'renovation-salle-de-bain.html',
    component: 'RenovationSalleDeBain.tsx',
    semantics: 'renovation-salle-de-bain',
    redirects: true,
  },
  {
    route: '/renovation-sous-sol',
    file: 'renovation-sous-sol.html',
    component: 'RenovationSousSol.tsx',
    semantics: 'renovation-sous-sol',
    redirects: true,
  },
];

export function legacyPageFor(routeOrFile) {
  return legacyPages.find(
    (page) => page.route === routeOrFile || page.file === routeOrFile || page.component === routeOrFile,
  );
}
