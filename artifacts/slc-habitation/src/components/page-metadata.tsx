import { useEffect } from 'react';
import seoRouteMetadata from '@/lib/seo-route-metadata.json';

const SITE_URL = seoRouteMetadata.siteOrigin;
const SOCIAL_IMAGE = `${SITE_URL}/images/relume-657269-p-1200.jpeg`;
const PAGE_SCHEMA_ID = 'page-schema';

type PageMetadataProps = {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown>;
  noindex?: boolean;
  /** Mettre à `false` pour une page qui ne représente aucune adresse réelle. */
  canonical?: boolean;
};

function setMeta(selector: string, attribute: 'name' | 'property', value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector.match(/["']([^"']+)["']/)?.[1] ?? '');
    document.head.appendChild(element);
  }

  element.content = value;
}

function setCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

function removeHeadElement(selector: string) {
  document.head.querySelector(selector)?.remove();
}

function setStructuredData(schema?: Record<string, unknown>) {
  const existing = document.head.querySelector<HTMLScriptElement>(`#${PAGE_SCHEMA_ID}`);

  if (!schema) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement('script');
  script.id = PAGE_SCHEMA_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c');

  if (!existing) {
    document.head.appendChild(script);
  }
}

export function PageMetadata({
  title,
  description,
  path,
  schema,
  noindex,
  canonical = true,
}: PageMetadataProps) {
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = 'fr-CA';

    /* Une page d'erreur peut apparaître sous n'importe quelle adresse : lui en
       donner une canonique désignerait comme page réelle celle que le visiteur
       n'a justement pas trouvée. Les adresses écrites par le rendu statique
       sont donc retirées plutôt que mises à jour. */
    if (canonical) {
      setCanonical(url);
      setMeta('meta[property="og:url"]', 'property', url);
      setMeta('meta[name="twitter:url"]', 'name', url);
    } else {
      removeHeadElement('link[rel="canonical"]');
      removeHeadElement('meta[property="og:url"]');
      removeHeadElement('meta[name="twitter:url"]');
    }

    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:image"]', 'property', SOCIAL_IMAGE);
    setMeta('meta[property="og:image:secure_url"]', 'property', SOCIAL_IMAGE);
    setMeta('meta[property="og:image:alt"]', 'property', 'SLC Habitation — rénovation et construction résidentielle');
    setMeta('meta[property="og:site_name"]', 'property', 'SLC Habitation');
    setMeta('meta[property="og:locale"]', 'property', 'fr_CA');
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', SOCIAL_IMAGE);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'SLC Habitation — rénovation et construction résidentielle');
    setStructuredData(schema);

    let noindexMeta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!noindexMeta) {
        noindexMeta = document.createElement('meta');
        noindexMeta.name = 'robots';
        document.head.appendChild(noindexMeta);
      }
      noindexMeta.content = 'noindex, follow';
    } else if (noindexMeta) {
      noindexMeta.remove();
    }
  }, [canonical, description, schema, title, url, noindex]);

  return null;
}

type RouteMetadata = Omit<PageMetadataProps, 'schema'> & {
  schema?: Record<string, unknown>;
  source?: string;
};

const routes = Object.fromEntries(
  (seoRouteMetadata.routes as RouteMetadata[]).map((route) => [route.path, route]),
) as Record<string, RouteMetadata>;

const notFoundRoute = seoRouteMetadata.notFoundRoute as RouteMetadata;

/* Adresses qui affichent une vraie page sans faire partie du site public :
   l'alias historique du formulaire, la page d'accès refusé et la page de
   vérification interne. Elles gardent le titre générique — ce ne sont pas des
   pages introuvables — mais restent hors des moteurs de recherche. */
const utilityPaths = new Set(['/formulaire', '/401', '/verification-interactions']);

export function metadataForPath(location: string) {
  const normalizedPath = location
    .replace(/\/index(?:\.html)?$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';

  const isPubRoute = normalizedPath.startsWith('/pub');
  const isUtilityPath = utilityPaths.has(normalizedPath);
  /* Toute adresse inconnue affiche la page « Page introuvable » : sa fiche
     descriptive doit suivre, sinon le navigateur réécrirait l'adresse demandée
     comme si elle désignait une page du site. */
  const route =
    routes[normalizedPath] ??
    (isUtilityPath
      ? {
          path: normalizedPath,
          title: 'SLC Habitation | Rénovation résidentielle',
          description:
            'SLC Habitation accompagne les propriétaires pour leurs projets de rénovation, d’agrandissement et de construction résidentielle.',
          noindex: true,
        }
      : notFoundRoute);

  /* Les pages du tunnel publicitaire sont exclues des moteurs par principe;
     les autres pages le demandent explicitement (page de confirmation). */
  return {
    ...route,
    noindex: isPubRoute || route.noindex === true,
  };
}
