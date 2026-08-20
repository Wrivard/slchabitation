import { useEffect } from 'react';

const SITE_URL = 'https://slchabitation.com';
const SOCIAL_IMAGE = `${SITE_URL}/images/relume-657269-p-1200.jpeg`;

type PageMetadataProps = {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown>;
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

export function PageMetadata({ title, description, path, schema }: PageMetadataProps) {
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = 'fr-CA';
    setCanonical(url);

    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:image"]', 'property', SOCIAL_IMAGE);
    setMeta('meta[property="og:image:secure_url"]', 'property', SOCIAL_IMAGE);
    setMeta('meta[property="og:image:alt"]', 'property', 'SLC Habitation — rénovation et construction résidentielle');
    setMeta('meta[property="og:site_name"]', 'property', 'SLC Habitation');
    setMeta('meta[property="og:locale"]', 'property', 'fr_CA');
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:url"]', 'name', url);
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', SOCIAL_IMAGE);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'SLC Habitation — rénovation et construction résidentielle');
  }, [description, title, url]);

  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}

const businessReference = {
  '@type': 'HomeAndConstructionBusiness',
  name: 'SLC Habitation',
  url: SITE_URL,
};

const serviceArea = [
  'Saint-Eustache',
  'Mirabel',
  'Boisbriand',
  'Blainville',
  'Laval',
  'Terrebonne',
  'Sainte-Thérèse',
  'Rosemère',
].map((name) => ({ '@type': 'City', name }));

function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: businessReference,
    areaServed: serviceArea,
  };
}

type RouteMetadata = Omit<PageMetadataProps, 'schema'> & {
  schema?: Record<string, unknown>;
};

const routes: Record<string, RouteMetadata> = {
  '/': {
    path: '/',
    title: 'Rénovation et construction neuve | SLC Habitation',
    description:
      'SLC Habitation réalise des projets de rénovation, d’agrandissement, de construction neuve et de travaux sur mesure dans les Laurentides et Laval.',
  },
  '/a-propos': {
    path: '/a-propos',
    title: 'À propos de SLC Habitation | Rénovation résidentielle',
    description:
      'Découvrez SLC Habitation, une équipe de rénovation résidentielle à l’écoute des propriétaires des Laurentides, de Laval et des environs.',
  },
  '/renovation': {
    path: '/renovation',
    title: 'Rénovation résidentielle | SLC Habitation',
    description:
      'Confiez votre rénovation résidentielle à SLC Habitation : cuisines, salles de bains, sous-sols et espaces de vie pensés pour vos besoins.',
    schema: serviceSchema(
      'Rénovation résidentielle',
      'Rénovation de cuisines, salles de bains, sous-sols et espaces de vie adaptée aux besoins des propriétaires.',
      '/renovation',
    ),
  },
  '/agrandissement-construction-neuve': {
    path: '/agrandissement-construction-neuve',
    title: 'Agrandissement et maison neuve | SLC Habitation',
    description:
      'SLC Habitation conçoit des agrandissements résidentiels et des constructions neuves pour créer des espaces de vie fonctionnels et durables.',
    schema: serviceSchema(
      'Agrandissement et construction neuve',
      'Projets d’agrandissement résidentiel et de construction neuve, incluant maisons neuves et garages.',
      '/agrandissement-construction-neuve',
    ),
  },
  '/travaux-sur-mesure': {
    path: '/travaux-sur-mesure',
    title: 'Travaux sur mesure | SLC Habitation',
    description:
      'SLC Habitation réalise des travaux sur mesure pour adapter, embellir et renforcer votre maison selon votre situation et vos priorités.',
    schema: serviceSchema(
      'Travaux résidentiels sur mesure',
      'Solutions de travaux résidentiels sur mesure, évaluées avec soin et conçues pour produire des résultats durables.',
      '/travaux-sur-mesure',
    ),
  },
  '/realisations': {
    path: '/realisations',
    title: 'Réalisations de rénovation | SLC Habitation',
    description:
      'Parcourez les réalisations de SLC Habitation et découvrez des projets de rénovation, d’agrandissement et de construction résidentielle.',
  },
  '/soumission': {
    path: '/soumission',
    title: 'Demander une soumission | SLC Habitation',
    description:
      'Décrivez votre projet à SLC Habitation et demandez une soumission pour vos travaux de rénovation, d’agrandissement ou de construction neuve.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Demander une soumission — SLC Habitation',
      url: `${SITE_URL}/soumission`,
      about: businessReference,
    },
  },
};

export function metadataForPath(location: string) {
  const normalizedPath = location
    .replace(/\/index(?:\.html)?$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';

  return routes[normalizedPath] ?? {
    path: normalizedPath,
    title: 'SLC Habitation | Rénovation résidentielle',
    description:
      'SLC Habitation accompagne les propriétaires pour leurs projets de rénovation, d’agrandissement et de construction résidentielle.',
  };
}