import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import {
  readParityRoutes,
  renderModes,
  shotName,
  viewports,
} from './lib/parity-targets.mjs';
import { startStaticServer } from './lib/static-server.mjs';
import { blockedHostPatterns, chromiumLaunchArgs, resolveChromiumPath } from './lib/chromium.mjs';

/**
 * Filet de sécurité visuel du site.
 *
 * `--update` enregistre les images de référence, sans argument le script
 * compare la version construite aux références et échoue à la moindre
 * différence. Chaque page est photographiée en trois largeurs et dans deux
 * états : document prérendu seul (sans JavaScript) puis page hydratée par
 * React. La convergence des deux états est justement ce qui doit être préservé
 * pendant la migration.
 */

const root = path.resolve(import.meta.dirname, '..');
const baselineDir = path.join(root, 'visual-baseline');
const reportDir = path.join(root, 'dist', 'visual-report');

const args = process.argv.slice(2);
const isUpdate = args.includes('--update');
const distOverride = args.find((arg) => arg.startsWith('--dist='))?.slice('--dist='.length);
const outputDir = distOverride
  ? path.resolve(distOverride)
  : path.join(root, 'dist', 'public');
const scale = Number(process.env.VISUAL_SCALE || '0.5');
const routeFilter = args.find((arg) => arg.startsWith('--routes='))?.slice('--routes='.length);
const maxDiffRatio = Number(process.env.VISUAL_MAX_DIFF_RATIO || '0.0008');

/**
 * Écarts déjà examinés et acceptés par rapport au commit de référence.
 *
 * Les 113 Mo de captures de référence ne peuvent pas être versionnés : elles
 * sont reconstruites depuis un commit (`pnpm run parity:baseline`). Sur un
 * nouveau poste, la comparaison retrouve donc les écarts déjà approuvés une
 * fois pour toutes. Cette liste, elle, est versionnée : elle les nomme un par
 * un, avec leur raison, et n'est valable que pour le commit de référence
 * inscrit dedans.
 */
async function readAcceptedDeltas() {
  const accepted = await readFile(path.join(root, 'visual-accepted-deltas.json'), 'utf8')
    .then(JSON.parse)
    .catch(() => null);
  if (!accepted) return new Map();

  const reference = await readFile(path.join(root, 'parity-reference.json'), 'utf8')
    .then((raw) => JSON.parse(raw).commit)
    .catch(() => null);

  if (accepted.reference !== reference) {
    console.log(
      `Le commit de référence a changé (${reference}) : les écarts acceptés pour ${accepted.reference} sont ignorés et la liste devrait être vidée.`,
    );
    return new Map();
  }

  return new Map(Object.entries(accepted.shots ?? {}));
}

async function collectRoutes() {
  const routes = await readParityRoutes(root);
  if (!routeFilter) return routes;
  const wanted = routeFilter.split(',').map((value) => value.trim()).filter(Boolean);
  return routes.filter((route) => wanted.includes(route));
}

/**
 * Sans JavaScript, on ne peut pas piloter la page depuis l'intérieur : le
 * défilement se fait au clavier pour déclencher le chargement des images
 * différées, puis on laisse le temps au navigateur de les recevoir.
 */
async function settleStaticPage(page) {
  await page.keyboard.press('End');
  await page.waitForTimeout(1200);
  await page.keyboard.press('Home');
  await page.waitForTimeout(800);
}

/** Amène toutes les images paresseuses et les animations dans leur état final. */
async function settlePage(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let offset = 0; offset < document.body.scrollHeight; offset += step) {
      window.scrollTo(0, offset);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 120));

    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 3000);
            }),
        ),
    );

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  await page.waitForTimeout(250);
}

async function capture(browser, origin, routePath, viewport, mode) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: scale,
    javaScriptEnabled: mode !== 'static',
    reducedMotion: 'reduce',
    locale: 'fr-CA',
    timezoneId: 'America/Toronto',
  });

  await context.route('**/*', (route) => {
    const url = route.request().url();
    if (blockedHostPatterns.some((pattern) => url.includes(pattern))) {
      return route.abort();
    }
    return route.continue();
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', (error) => consoleErrors.push(String(error.message || error)));

  try {
    await page.goto(`${origin}${routePath}`, { waitUntil: 'load', timeout: 60_000 });
    if (mode === 'static') {
      await settleStaticPage(page);
    } else {
      await page.waitForTimeout(300);
      await settlePage(page);
    }
    const buffer = await page.screenshot({ fullPage: true, animations: 'disabled' });
    return { buffer, consoleErrors };
  } finally {
    await context.close();
  }
}

/**
 * Erreurs JavaScript déjà présentes sur le site hérité avant la migration.
 * Elles proviennent du moteur Webflow et de son chargement en double ; elles
 * disparaîtront avec lui. Toute autre erreur fait échouer la vérification.
 */
const knownJsErrors = [
  't is not a function',
  "Identifier 'originalWarn' has already been declared",
];

function comparePngs(baselineBuffer, currentBuffer) {
  const baseline = PNG.sync.read(baselineBuffer);
  const current = PNG.sync.read(currentBuffer);

  if (baseline.width !== current.width || baseline.height !== current.height) {
    return {
      ok: false,
      reason: `dimensions ${baseline.width}×${baseline.height} → ${current.width}×${current.height}`,
      diffBuffer: null,
      diffRatio: 1,
    };
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const changed = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0.12, includeAA: false },
  );
  const total = baseline.width * baseline.height;
  const diffRatio = changed / total;

  return {
    ok: diffRatio <= maxDiffRatio,
    reason: `${changed} pixels différents (${(diffRatio * 100).toFixed(4)} %)`,
    diffBuffer: changed > 0 ? PNG.sync.write(diff) : null,
    diffRatio,
  };
}

async function main() {
  const routes = await collectRoutes();
  if (routes.length === 0) {
    throw new Error('Aucune route à vérifier.');
  }

  const entries = await readdir(outputDir).catch(() => []);
  if (entries.length === 0) {
    throw new Error(
      `Rien à photographier dans ${path.relative(root, outputDir)}. Lancez « pnpm build » d'abord.`,
    );
  }

  await mkdir(isUpdate ? baselineDir : reportDir, { recursive: true });
  if (!isUpdate) {
    await rm(reportDir, { recursive: true, force: true });
    await mkdir(reportDir, { recursive: true });
  }

  const server = await startStaticServer(outputDir);
  const browser = await chromium.launch({
    executablePath: resolveChromiumPath(),
    args: chromiumLaunchArgs,
  });

  const acceptedDeltas = isUpdate ? new Map() : await readAcceptedDeltas();
  const acceptedSeen = [];
  const failures = [];
  const pageErrors = [];
  let compared = 0;

  try {
    for (const routePath of routes) {
      for (const viewport of viewports) {
        for (const mode of renderModes) {
          const name = shotName(routePath, viewport.name, mode);
          const { buffer, consoleErrors } = await capture(
            browser,
            server.origin,
            routePath,
            viewport,
            mode,
          );

          /* Une erreur peut ne toucher qu'une seule largeur : on écoute donc
             toutes les captures hydratées, et pas seulement l'ordinateur. */
          if (consoleErrors.length > 0 && mode === 'hydrated') {
            pageErrors.push({ route: routePath, viewport: viewport.name, errors: consoleErrors });
          }

          if (isUpdate) {
            await writeFile(path.join(baselineDir, name), buffer);
            compared += 1;
            continue;
          }

          const baselinePath = path.join(baselineDir, name);
          const baselineBuffer = await readFile(baselinePath).catch(() => null);
          if (!baselineBuffer) {
            failures.push({ name, reason: 'aucune référence enregistrée' });
            await writeFile(path.join(reportDir, name), buffer);
            continue;
          }

          const result = comparePngs(baselineBuffer, buffer);
          compared += 1;
          if (!result.ok) {
            if (acceptedDeltas.has(name)) {
              acceptedSeen.push({ name, reason: result.reason });
              continue;
            }
            failures.push({ name, reason: result.reason });
            await writeFile(path.join(reportDir, name.replace(/\.png$/, '.actual.png')), buffer);
            if (result.diffBuffer) {
              await writeFile(path.join(reportDir, name.replace(/\.png$/, '.diff.png')), result.diffBuffer);
            }
          }
        }
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }

  if (pageErrors.length > 0) {
    /* Le même défaut hérité se répète sur les trois largeurs : l'affichage le
       regroupe par route, mais la vérification, elle, examine chaque capture. */
    const grouped = new Map();
    for (const entry of pageErrors) {
      const seen = grouped.get(entry.route) ?? new Set();
      for (const message of entry.errors) seen.add(message);
      grouped.set(entry.route, seen);
    }
    console.log('Erreurs JavaScript relevées pendant les captures :');
    for (const [route, messages] of grouped) {
      console.log(`  ${route} → ${[...messages].join(' | ')}`);
    }
  }

  /* Une page qui casse au chargement peut rester visuellement identique à sa
     référence : sans ce contrôle, la vérification passerait au vert alors que le
     site ne fonctionne plus. Seules les erreurs déjà présentes avant la
     migration sont tolérées. */
  for (const entry of pageErrors) {
    const unknown = entry.errors.filter(
      (message) => !knownJsErrors.some((known) => message.includes(known)),
    );
    if (unknown.length > 0) {
      failures.push({
        name: shotName(entry.route, entry.viewport, 'hydrated'),
        reason: `erreur JavaScript — ${[...new Set(unknown)].join(' | ')}`,
      });
    }
  }

  if (isUpdate) {
    console.log(`${compared} images de référence enregistrées dans ${path.relative(root, baselineDir)}.`);
    return;
  }

  if (acceptedSeen.length > 0) {
    console.log(`\n${acceptedSeen.length} écart(s) déjà accepté(s), listés dans visual-accepted-deltas.json :`);
    for (const entry of acceptedSeen) {
      console.log(`  • ${entry.name} — ${entry.reason}`);
    }
  }

  /* Une exception qui ne correspond plus à rien laisse une page sans
     surveillance : on le signale pour qu'elle soit retirée. */
  const obsolete = [...acceptedDeltas.keys()].filter(
    (name) => !acceptedSeen.some((entry) => entry.name === name),
  );
  if (obsolete.length > 0 && !routeFilter) {
    console.log(
      `\n${obsolete.length} écart(s) accepté(s) ne se produisent plus : retirer ces entrées de visual-accepted-deltas.json.`,
    );
    for (const name of obsolete) console.log(`  • ${name}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} différence(s) visuelle(s) sur ${compared} captures :`);
    for (const failure of failures) {
      console.error(`  ✗ ${failure.name} — ${failure.reason}`);
    }
    console.error(`\nImages produites : ${path.relative(root, reportDir)}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Aucune différence visuelle sur ${compared} captures.`);
}

await main();
