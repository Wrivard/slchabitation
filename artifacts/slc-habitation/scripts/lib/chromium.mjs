import { execFileSync } from 'node:child_process';

/**
 * Chromium vient de l'environnement Nix : il n'y a pas de navigateur téléchargé
 * par Playwright dans ce projet. `CHROMIUM_PATH` permet de pointer ailleurs.
 */
export function resolveChromiumPath() {
  if (process.env.CHROMIUM_PATH) {
    return process.env.CHROMIUM_PATH;
  }

  try {
    return execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
  } catch {
    throw new Error(
      "Chromium est introuvable. Installez-le (dépendance système « chromium ») ou définissez CHROMIUM_PATH.",
    );
  }
}

export const chromiumLaunchArgs = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--hide-scrollbars',
  '--force-color-profile=srgb',
  '--font-render-hinting=none',
  '--disable-lcd-text',
];

/**
 * Domaines coupés pendant les captures : bandeau de consentement, marqueurs
 * publicitaires et mesure d'audience s'affichent ou se déclenchent de façon
 * imprévisible et rendraient chaque capture différente de la précédente.
 */
export const blockedHostPatterns = [
  'consent.cookiebot.com',
  'consentcdn.cookiebot.com',
  'googletagmanager.com',
  'google-analytics.com',
  'googleadservices.com',
  'doubleclick.net',
  'challenges.cloudflare.com',
];
