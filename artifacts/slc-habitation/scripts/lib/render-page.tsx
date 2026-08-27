import { renderToString } from 'react-dom/server';
import { Router } from 'wouter';

/**
 * Rendu isolé d'un composant de page, pour le contrôle de conversion.
 *
 * La page est rendue seule, avec seulement le routeur dont ses liens ont
 * besoin : la comparaison porte donc sur la page elle-même, sans les
 * préchargements ni les fournisseurs de contexte que l'application ajoute
 * autour.
 */
export async function renderPage(modulePath: string, route: string): Promise<string> {
  const module = await import(/* @vite-ignore */ modulePath);
  const Page = module.default as () => JSX.Element;
  return renderToString(
    <Router ssrPath={route}>
      <Page />
    </Router>,
  );
}
