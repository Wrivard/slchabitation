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
 *
 * La seconde moitié du script vérifie les mêmes gestes sur les vraies pages :
 * menu mobile, menu déroulant « Services », filtre des réalisations, mise en
 * retrait des cartes au survol et compteurs animés. Ces comportements étaient
 * assurés par le moteur Webflow et par des scripts recopiés dans l'entête de
 * chaque page ; ils sont désormais tenus par l'application elle-même, et c'est
 * ici qu'on s'assure qu'ils n'ont pas changé.
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

/**
 * Laisse à la page le temps de brancher ses gestes.
 *
 * Les comportements sont posés au montage des composants : la page peut être
 * « inactive » pendant un court instant après le chargement réseau.
 */
async function settle(page) {
  await page.waitForTimeout(1500);
}

/**
 * Parcourt la page de haut en bas puis remonte.
 *
 * Les blocs n'apparaissent qu'une fois entrés à l'écran : tant qu'ils
 * attendent, ils sont masqués et rien ne peut être cliqué. Un visiteur les
 * découvre en défilant ; c'est ce que ce passage reproduit avant de vérifier ce
 * qui se trouve plus bas dans la page.
 */
async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let offset = 0; offset < document.body.scrollHeight; offset += step) {
      window.scrollTo(0, offset);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
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

  console.log('Menu mobile');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });
    await settle(page);

    const menuState = () =>
      page.evaluate(() => {
        const menu = document.querySelector('.navbar3_component .w-nav-menu');
        const button = document.querySelector('.navbar3_component .w-nav-button');
        if (!menu || !button) return null;
        return {
          open: menu.hasAttribute('data-nav-menu-open'),
          expanded: button.getAttribute('aria-expanded'),
          height: Math.round(menu.getBoundingClientRect().height),
          bodyLocked: document.body.style.overflow === 'hidden',
        };
      });

    const closed = await menuState();
    check('le panneau est replié au chargement', closed !== null && !closed.open && closed.height < 50, JSON.stringify(closed));

    await page.locator('.navbar3_component .w-nav-button').click();
    await page.waitForTimeout(500);
    const opened = await menuState();
    check(
      'le bouton déploie le panneau sur toute la page',
      opened.open && opened.height > 300 && opened.expanded === 'true',
      JSON.stringify(opened),
    );
    check('le fond ne défile plus derrière le panneau', opened.bodyLocked, JSON.stringify(opened));

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const afterEscape = await menuState();
    check('la touche Échap referme le panneau', !afterEscape.open, JSON.stringify(afterEscape));

    await page.locator('.navbar3_component .w-nav-button').click();
    await page.waitForTimeout(400);
    await page.locator('.navbar3_component .w-nav-menu a[href="/realisations"]').first().click();
    await page.waitForTimeout(600);
    check(
      'un lien du panneau conduit bien à la page demandée',
      new URL(page.url()).pathname === '/realisations',
      page.url(),
    );

    await context.close();
  }

  console.log('Menu déroulant « Services »');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });
    await settle(page);

    const dropdownState = () =>
      page.evaluate(() => {
        const list = document.querySelector('.navbar3_component .w-dropdown-list');
        if (!list) return null;
        return {
          open: list.classList.contains('w--open'),
          height: Math.round(list.getBoundingClientRect().height),
        };
      });

    const initial = await dropdownState();
    check('le menu est replié au chargement', initial !== null && !initial.open, JSON.stringify(initial));

    await page.locator('.navbar3_component .w-dropdown-toggle').first().hover();
    await page.waitForTimeout(400);
    const hovered = await dropdownState();
    check(
      'le survol déroule la liste des services',
      hovered.open && hovered.height > 50,
      JSON.stringify(hovered),
    );

    await page.mouse.move(700, 600);
    await page.waitForTimeout(400);
    const left = await dropdownState();
    check('la liste se replie quand la souris ressort', !left.open, JSON.stringify(left));

    await page.locator('.navbar3_component .w-dropdown-toggle').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const byKeyboard = await dropdownState();
    check('le clavier déroule aussi la liste', byKeyboard.open, JSON.stringify(byKeyboard));

    await context.close();
  }

  console.log('Filtre des réalisations');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/realisations`, { waitUntil: 'networkidle' });
    await settle(page);
    await scrollThroughPage(page);

    const visibleProjects = () =>
      page.evaluate(() =>
        Array.from(document.querySelectorAll('.blog22_item')).filter(
          (element) => element.getBoundingClientRect().height > 0,
        ).length,
      );

    const total = await visibleProjects();
    check('toutes les réalisations sont visibles au départ', total > 0, `${total} projet(s)`);

    const filters = page.locator('.category-filter-link');
    const filterCount = await filters.count();
    check('les boutons de filtre sont présents', filterCount > 1, `${filterCount} bouton(s)`);

    if (filterCount > 1) {
      await filters.nth(1).click();
      await page.waitForTimeout(500);
      const filtered = await visibleProjects();
      check(
        'un filtre ne laisse qu\'une partie des réalisations',
        filtered > 0 && filtered < total,
        `${filtered} sur ${total}`,
      );

      await filters.nth(0).click();
      await page.waitForTimeout(500);
      const restored = await visibleProjects();
      check(
        '« Tous » ramène l\'ensemble des réalisations',
        restored === total,
        `${restored} sur ${total}`,
      );
    }

    await context.close();
  }

  console.log('Visionneuse des réalisations');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });

    await settle(page);
    await scrollThroughPage(page);

    const firstCard = page.locator('a.gallery8_lightbox-link').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.focus();
    await firstCard.press('Enter');
    await page.waitForTimeout(200);

    const opened = await page.evaluate(() => {
      const dialog = document.querySelector('dialog.site-lightbox');
      const image = dialog?.querySelector('img.site-lightbox__image');
      return {
        open: dialog?.hasAttribute('open') ?? false,
        imagePath: image instanceof HTMLImageElement ? new URL(image.src).pathname : '',
        focus: document.activeElement?.className ?? '',
        bodyLocked: document.body.classList.contains('site-lightbox-open'),
      };
    });
    check(
      'Entrée ouvre l’image agrandie dans un dialogue',
      opened.open && opened.imagePath === '/images/relume-655453.jpeg',
      JSON.stringify(opened),
    );
    check(
      'le bouton de fermeture reçoit le focus et la page ne défile plus',
      String(opened.focus).includes('site-lightbox__close') && opened.bodyLocked,
      JSON.stringify(opened),
    );

    await page.keyboard.press('ArrowRight');
    const nextPath = await page
      .locator('dialog.site-lightbox img.site-lightbox__image')
      .evaluate((image) => new URL(image.src).pathname);
    check(
      'les flèches parcourent les images du même groupe',
      nextPath === '/images/relume-657284-p-800.png',
      nextPath,
    );

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const closed = await page.evaluate(() => ({
      open: document.querySelector('dialog.site-lightbox')?.hasAttribute('open') ?? false,
      focusRestored: document.activeElement?.matches('a.gallery8_lightbox-link') ?? false,
      bodyLocked: document.body.classList.contains('site-lightbox-open'),
    }));
    check(
      'Échap ferme la visionneuse et rend le focus à la carte',
      !closed.open && closed.focusRestored && !closed.bodyLocked,
      JSON.stringify(closed),
    );

    await context.close();
  }

  console.log('Cartes de services au survol');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });

    await settle(page);
    await scrollThroughPage(page);

    const card = page.locator('.layout423_card').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const before = await page.evaluate(
      () => {
        const card = document.querySelector('.layout423_card');
        const bottom = card?.querySelector('.layout423_card-content-bottom');
        const overlay = card?.querySelector('.layout423_overlay');
        if (!card || !bottom || !overlay) return null;
        return {
          inactive: document.querySelectorAll('.layout423_card-content.inactive').length,
          cardWidth: card.getBoundingClientRect().width,
          bottomHeight: bottom.getBoundingClientRect().height,
          bottomOpacity: Number.parseFloat(getComputedStyle(bottom).opacity),
          overlay: getComputedStyle(overlay).backgroundColor,
        };
      },
    );
    check(
      'aucune carte n\'est estompée au départ',
      before !== null && before.inactive === 0,
      JSON.stringify(before),
    );
    check(
      'le descriptif détaillé est replié au départ',
      before !== null && before.bottomHeight === 0 && before.bottomOpacity === 0,
      JSON.stringify(before),
    );

    await card.hover();
    await page.waitForTimeout(380);
    const during = await page.evaluate(() => ({
      inactive: document.querySelectorAll('.layout423_card-content.inactive').length,
      total: document.querySelectorAll('.layout423_card-content').length,
      cardWidth: document.querySelector('.layout423_card')?.getBoundingClientRect().width ?? 0,
      bottomHeight:
        document
          .querySelector('.layout423_card .layout423_card-content-bottom')
          ?.getBoundingClientRect().height ?? 0,
      bottomOpacity: Number.parseFloat(
        getComputedStyle(
          document.querySelector('.layout423_card .layout423_card-content-bottom'),
        ).opacity,
      ),
      overlay: getComputedStyle(
        document.querySelector('.layout423_card .layout423_overlay'),
      ).backgroundColor,
    }));
    check(
      'survoler une carte estompe les autres',
      during.inactive > 0 && during.inactive < during.total,
      JSON.stringify(during),
    );
    check(
      'la carte survolée s\'agrandit',
      before !== null && during.cardWidth > before.cardWidth * 1.15,
      JSON.stringify({ before: before?.cardWidth, during: during.cardWidth }),
    );
    check(
      'le descriptif remonte et devient visible',
      during.bottomHeight > 0 && during.bottomOpacity > 0.95,
      JSON.stringify(during),
    );
    check(
      'le voile de la carte survolée s\'assombrit',
      during.overlay === 'rgba(0, 0, 0, 0.7)',
      during.overlay,
    );

    await page.mouse.move(5, 5);
    await page.waitForTimeout(280);
    const after = await page.evaluate(() => {
      const card = document.querySelector('.layout423_card');
      const bottom = card?.querySelector('.layout423_card-content-bottom');
      if (!card || !bottom) return null;
      return {
        inactive: document.querySelectorAll('.layout423_card-content.inactive').length,
        cardWidth: card.getBoundingClientRect().width,
        bottomHeight: bottom.getBoundingClientRect().height,
        bottomOpacity: Number.parseFloat(getComputedStyle(bottom).opacity),
      };
    });
    check(
      'les cartes retrouvent leur teinte à la sortie',
      after !== null && after.inactive === 0,
      JSON.stringify(after),
    );
    check(
      'la carte et son descriptif se replient à la sortie',
      before !== null &&
        after !== null &&
        Math.abs(after.cardWidth - before.cardWidth) < 2 &&
        after.bottomHeight === 0 &&
        after.bottomOpacity === 0,
      JSON.stringify({ before, after }),
    );

    await context.close();
  }

  console.log('Compteurs animés');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/`, { waitUntil: 'networkidle' });

    const numbers = page.locator('[counter-element="number"]');
    const count = await numbers.count();
    check('la page d\'accueil affiche des compteurs', count > 0, `${count} compteur(s)`);

    if (count > 0) {
      await settle(page);
      /* Le compteur peut attendre son tour d'apparition : on l'amène à l'écran
         sans passer par la visibilité, puis on relève ce qu'il affiche. */
      await numbers.first().evaluate((element) => {
        element.scrollIntoView({ block: 'center' });
      });

      /* Le compte défile trop vite pour une capture unique : on relève les
         valeurs successives pendant toute la durée annoncée par la page. */
      const seen = new Set();
      for (let elapsed = 0; elapsed < 4500; elapsed += 100) {
        seen.add((await numbers.first().textContent())?.trim());
        await page.waitForTimeout(100);
      }

      const values = [...seen];
      const final = (await numbers.allTextContents()).map((value) => value.trim());
      check(
        'le compte défile au lieu d\'afficher directement sa valeur',
        values.length > 3,
        `${values.length} valeur(s) : ${values.slice(0, 5).join(', ')}…`,
      );
      check(
        'le compte s\'arrête sur la valeur de la page',
        final[0] === '25' && final[1] === '500',
        JSON.stringify(final),
      );
    }

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
