const publicRouteMap = {
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
 * Adresses propres dans le balisage hérité.
 *
 * Les pages exportées par Webflow renvoient vers des fichiers `.html` et vers
 * des chemins relatifs (`images/…`). Le site sert des adresses sans extension
 * et des chemins absolus : cette conversion est appliquée une fois pour toutes
 * au moment de convertir une page héritée en composants React, et reste
 * disponible pour les pages qui n'ont pas encore été converties.
 */
export function normalizePublicLinks(html) {
  return html.replace(
    /(href|src|srcset)=("|')([^"']*)\2/gi,
    (_match, attribute, quote, value) => {
      if (attribute.toLowerCase() === 'href') {
        const normalizedRoute = publicRouteMap[value.replace(/^\.?\//, '')];
        if (normalizedRoute) {
          return `href=${quote}${normalizedRoute}${quote}`;
        }
      }

      const normalizedValue = value.replace(/(^|[\s,])(?:\.\/)?(css|images|js)\//g, '$1/$2/');
      return `${attribute}=${quote}${normalizedValue}${quote}`;
    },
  );
}
