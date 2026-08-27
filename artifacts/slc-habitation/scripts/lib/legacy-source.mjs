import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

/**
 * Accès aux deux formes actuelles d'une page héritée.
 *
 * Pendant la migration, la même page existe en deux exemplaires : le fichier
 * exporté par Webflow (`site/<page>.html`), utilisé par le prérendu, et la
 * chaîne `htmlContent` recopiée dans le composant React, utilisée par le
 * navigateur. La conversion doit partir d'une source unique : ces fonctions
 * servent d'abord à vérifier que les deux exemplaires disent bien la même
 * chose.
 */

export const parseOptions = {
  comment: true,
  blockTextElements: { script: true, style: true, pre: true, textarea: true },
};

/** Contenu du <body> du fichier exporté par Webflow. */
export async function readLegacyBody(root, file) {
  const raw = await readFile(path.join(root, 'site', file), 'utf8');
  const document = parse(raw, parseOptions);
  const body = document.querySelector('body');
  if (!body) throw new Error(`Aucun <body> dans site/${file}`);
  return body.innerHTML;
}

/** Chaîne `htmlContent` recopiée dans un composant de page. */
export async function readComponentHtml(root, componentFile) {
  const source = await readFile(path.join(root, 'src/pages', componentFile), 'utf8');
  const match = source.match(/const (?:semantic)?[hH]tmlContent = `([\s\S]*?)`;\n/);
  if (!match) return null;
  // La chaîne est un littéral gabarit échappé : on la relit comme telle.
  return new Function(`return \`${match[1]}\`;`)();
}
