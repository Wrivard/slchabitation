import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

/**
 * Sert `dist/public` comme le fera l'hébergement : une URL propre renvoie le
 * document prérendu `<route>/index.html`. Volontairement minimal, pour que la
 * vérification visuelle mesure le site et non le serveur de développement.
 */

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function resolveFile(rootDir, pathname) {
  const decoded = decodeURIComponent(pathname);
  const unsafe = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const target = path.join(rootDir, unsafe);

  if (!target.startsWith(rootDir)) {
    return null;
  }

  const candidates = [target, path.join(target, 'index.html')];
  for (const candidate of candidates) {
    try {
      const stats = await stat(candidate);
      if (stats.isFile()) return candidate;
    } catch {
      // Le candidat suivant sera essayé.
    }
  }

  return null;
}

/**
 * @param spaFallback Renvoie l'application pour une adresse sans document
 * prérendu. Réservé aux vérifications d'interactions, qui utilisent une page
 * technique absente du site publié.
 */
export async function startStaticServer(rootDir, { port = 0, spaFallback = false } = {}) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    void resolveFile(rootDir, url.pathname).then(async (resolved) => {
      const file =
        resolved ??
        (spaFallback && !path.extname(url.pathname)
          ? await resolveFile(rootDir, '/index.html')
          : null);

      if (!file) {
        res.statusCode = 404;
        res.setHeader('content-type', 'text/plain; charset=utf-8');
        res.end(`Introuvable : ${url.pathname}`);
        return;
      }

      res.statusCode = 200;
      res.setHeader('content-type', mimeTypes[path.extname(file).toLowerCase()] || 'application/octet-stream');
      res.setHeader('cache-control', 'no-store');
      createReadStream(file).pipe(res);
    });
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });

  const address = server.address();
  const boundPort = typeof address === 'object' && address ? address.port : port;

  return {
    origin: `http://127.0.0.1:${boundPort}`,
    async close() {
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
