import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Source unique de la navigation et du pied de page du site.
 *
 * Le gabarit legacy exporté de Webflow (`site/index.html`) reste la référence :
 * la navbar et le footer en sont extraits au moment de la génération, puis
 * réutilisés tels quels par les pages React du tunnel publicitaire et par les
 * documents statiques prérendus. Personne ne recopie le balisage à la main,
 * donc les deux versions ne peuvent pas diverger.
 */

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

/** Ramène les liens et les ressources du gabarit legacy sur les URL propres. */
export function normalizeChromeUrls(html) {
  return html.replace(
    /(href|src|srcset)=("|')([^"']*)\2/gi,
    (_match, attribute, quote, value) => {
      if (attribute.toLowerCase() === 'href') {
        const route = publicRouteMap[value.replace(/^\.?\//, '')];
        if (route) {
          return `${attribute}=${quote}${route}${quote}`;
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

/** Découpe l'élément ouvert à `startIndex` en suivant l'imbrication de `tag`. */
function sliceBalanced(html, startIndex, tag) {
  const tokens = new RegExp(`<${tag}\\b[^>]*>|</${tag}\\s*>`, 'gi');
  tokens.lastIndex = startIndex;

  let depth = 0;
  let token;
  while ((token = tokens.exec(html)) !== null) {
    if (token[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(startIndex, token.index + token[0].length);
      }
      continue;
    }

    if (!token[0].endsWith('/>')) {
      depth += 1;
    }
  }

  throw new Error(`Balise <${tag}> non refermée à partir de l'index ${startIndex}.`);
}

/** Extrait le bloc unique qui commence par `opening` (ex. `<footer class="footer3_component`). */
function extractBlock(html, opening, tag) {
  const first = html.indexOf(opening);
  if (first === -1) {
    throw new Error(`Bloc « ${opening} » introuvable dans site/index.html.`);
  }
  if (html.indexOf(opening, first + 1) !== -1) {
    throw new Error(`Bloc « ${opening} » présent plusieurs fois dans site/index.html.`);
  }

  return sliceBalanced(html, first, tag);
}

/**
 * La page d'accueil marque ses propres liens comme actifs. L'état courant est
 * recalculé à l'exécution, donc le balisage partagé part sans marquage.
 */
function clearCurrentState(html) {
  return html
    .replace(/\s+w--current(?=["\s])/g, '')
    .replace(/\s+aria-current="page"/g, '');
}

export async function readSiteChrome(root) {
  const source = await readFile(path.join(root, 'site', 'index.html'), 'utf8');

  const banner = extractBlock(source, '<section class="banner9_component', 'section');
  const navbar = extractBlock(source, '<div data-collapse="medium"', 'div');
  const footer = extractBlock(source, '<footer class="footer3_component', 'footer');

  if (!navbar.includes('navbar3_component')) {
    throw new Error("Le bloc de navigation extrait n'est pas la navbar attendue.");
  }

  const prepare = (block) => clearCurrentState(normalizeChromeUrls(block)).trim();

  return {
    headerHtml: `${prepare(banner)}\n${prepare(navbar)}`,
    footerHtml: prepare(footer),
  };
}
