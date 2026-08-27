import { chromium } from 'playwright-core';

import { chromiumLaunchArgs, resolveChromiumPath } from './lib/chromium.mjs';
import { startStaticServer } from './lib/static-server.mjs';
import path from 'node:path';

/**
 * Vérifie les interactions reprises du site hérité.
 *
 * Les animations du site Webflow sont écrites dans un script inline recopié sur
 * chaque page. Les pages converties en React appellent à la place les
 * comportements de `src/lib/behaviors`. Ce script confirme sur la page technique
 * `/verification-interactions` qu'ils réagissent comme l'original : blocs
 * masqués tant qu'ils ne sont pas à l'écran, apparition en cascade, bouton de
 * retour en haut qui se déplie après une demi-hauteur d'écran, et affichage
 * immédiat lorsque le visiteur demande moins d'animations.
 */

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist', 'public');
const checkPath = '/verification-interactions';

const failures = [];

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
    return;
  }
  failures.push(detail ? `${label} — ${detail}` : label);
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
}

async function visibilityOf(page, testId) {
  return page.evaluate((id) => {
    const element = document.querySelector(`[data-testid="${id}"]`);
    if (!element) return null;
    const style = window.getComputedStyle(element);
    return {
      opacity: Number.parseFloat(style.opacity),
      visibility: style.visibility,
      transform: style.transform,
    };
  }, testId);
}

const server = await startStaticServer(distDir, { spaFallback: true });
const browser = await chromium.launch({
  executablePath: resolveChromiumPath(),
  args: chromiumLaunchArgs,
});

try {
  console.log('Apparition au défilement');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}${checkPath}`, { waitUntil: 'networkidle' });

    const hidden = await visibilityOf(page, 'reveal-item-1');
    check(
      'les blocs restent masqués tant qu\'ils ne sont pas à l\'écran',
      hidden !== null && (hidden.opacity === 0 || hidden.visibility === 'hidden'),
      JSON.stringify(hidden),
    );

    await page.getByTestId('reveal-item-1').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);

    const early = await Promise.all([
      visibilityOf(page, 'reveal-item-1'),
      visibilityOf(page, 'reveal-nested-2'),
    ]);
    check(
      'les blocs apparaissent en cascade, pas tous en même temps',
      early[0].opacity > early[1].opacity,
      `premier=${early[0].opacity} dernier=${early[1].opacity}`,
    );

    await page.waitForTimeout(1600);
    const revealed = await Promise.all(
      [
        'reveal-item-1',
        'reveal-item-2',
        'reveal-parent',
        'reveal-nested-1',
        'reveal-nested-2',
      ].map((id) => visibilityOf(page, id)),
    );
    check(
      'tous les blocs sont visibles une fois l\'animation terminée',
      revealed.every((state) => state.opacity === 1 && state.visibility === 'visible'),
      JSON.stringify(revealed.map((state) => state.opacity)),
    );
    check(
      'aucune transformation résiduelle ne subsiste',
      revealed.every((state) => state.transform === 'none' || state.transform === 'matrix(1, 0, 0, 1, 0, 0)'),
      JSON.stringify(revealed.map((state) => state.transform)),
    );

    await context.close();
  }

  console.log('Bouton de retour en haut');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}${checkPath}`, { waitUntil: 'networkidle' });

    const atTop = await visibilityOf(page, 'button-back-to-top');
    check(
      'le bouton est masqué en haut de page',
      atTop !== null && atTop.opacity === 0,
      JSON.stringify(atTop),
    );

    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'instant' }));
    await page.waitForTimeout(700);
    const afterScroll = await visibilityOf(page, 'button-back-to-top');
    check(
      'le bouton se déplie après une demi-hauteur d\'écran',
      afterScroll.opacity === 1 && afterScroll.visibility === 'visible',
      JSON.stringify(afterScroll),
    );

    await page.getByTestId('button-back-to-top').click();
    await page.waitForFunction(() => window.scrollY === 0, undefined, { timeout: 5000 });
    check('le clic ramène en haut de la page', true);

    await page.waitForTimeout(600);
    const backAtTop = await visibilityOf(page, 'button-back-to-top');
    check(
      'le bouton se replie une fois revenu en haut',
      backAtTop.opacity === 0,
      JSON.stringify(backAtTop),
    );

    await context.close();
  }

  console.log('Préférence « animations réduites »');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(`${server.origin}${checkPath}`, { waitUntil: 'networkidle' });

    const state = await visibilityOf(page, 'reveal-item-1');
    check(
      'les blocs sont affichés sans animation',
      state.opacity === 1 && state.visibility === 'visible',
      JSON.stringify(state),
    );

    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

if (failures.length > 0) {
  console.error(`\n${failures.length} vérification(s) en échec.`);
  process.exitCode = 1;
} else {
  console.log('\nToutes les interactions se comportent comme le site hérité.');
}
