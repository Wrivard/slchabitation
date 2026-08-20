const publicRouteMap: Record<string, string> = {
  'index.html': '/',
  'a-propos.html': '/a-propos',
  'renovation.html': '/renovation',
  'agrandissement-construction-neuve.html': '/agrandissement-construction-neuve',
  'travaux-sur-mesure.html': '/travaux-sur-mesure',
  'realisations.html': '/realisations',
  'soumission.html': '/soumission',
  'politique-de-cookie.html': '/politique-de-cookie',
};

/**
 * The migrated pages are rendered from legacy Webflow HTML strings. Keep
 * internal links on the clean URL form so the rendered app and prerendered
 * documents share one crawlable URL for each page.
 */
export function normalizePublicLinks(html: string): string {
  return html.replace(
    /(href|src|srcset)=("|')([^"']*)\2/gi,
    (_match, attribute: string, quote: string, value: string) => {
      if (attribute.toLowerCase() === 'href') {
        const normalizedRoute = publicRouteMap[value.replace(/^\.?\//, '')];
        if (normalizedRoute) {
          return `href=${quote}${normalizedRoute}${quote}`;
        }
      }

      const normalizedValue = value.replace(
        /(^|[\s,])(?:\.\/)?(css|images|js)\//g,
        '$1/$2/',
      );
      return `${attribute}=${quote}${normalizedValue}${quote}`;
    },
  );
}