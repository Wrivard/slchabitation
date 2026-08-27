import path from 'path';
import { URL } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

const legacyRouteRedirects: Record<string, string> = {
  '/index': '/',
  '/index.html': '/',
  '/a-propos.html': '/a-propos',
  '/renovation.html': '/renovation',
  '/renovation-sous-sol.html': '/renovation-sous-sol',
  '/renovation-salle-de-bain.html': '/renovation-salle-de-bain',
  '/renovation-cuisine.html': '/renovation-cuisine',
  '/formulaire.html': '/formulaire',
  '/agrandissement-construction-neuve.html': '/agrandissement-construction-neuve',
  '/travaux-sur-mesure.html': '/travaux-sur-mesure',
  '/realisations.html': '/realisations',
  '/soumission.html': '/soumission',
  '/politique-de-cookie.html': '/politique-de-cookie',
};
const prerenderedRoutePaths = new Set(
  [
    ...Object.values(legacyRouteRedirects).filter((route) => route !== '/'),
    '/pub/agrandissement-maison',
    '/pub/renovation-cuisine',
    '/pub/renovation-salle-de-bain',
    '/pub/renovation-sous-sol',
  ],
);

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
    {
      name: 'rewrite-html-to-index',
      configureServer(server) {
        server.middlewares.use(redirectLegacyRoutes);
      },

      configurePreviewServer(server) {
        server.middlewares.use(redirectLegacyRoutes);
        server.middlewares.use(servePrerenderedRoute);
      },
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  publicDir: 'public',
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, 'index.html'),
        about: path.resolve(import.meta.dirname, 'a-propos.html'),
        renovation: path.resolve(import.meta.dirname, 'renovation.html'),
        sousSol: path.resolve(import.meta.dirname, 'renovation-sous-sol.html'),
        salleDeBain: path.resolve(import.meta.dirname, 'renovation-salle-de-bain.html'),
        cuisine: path.resolve(import.meta.dirname, 'renovation-cuisine.html'),
        formulaire: path.resolve(import.meta.dirname, 'formulaire.html'),
        expansion: path.resolve(import.meta.dirname, 'agrandissement-construction-neuve.html'),
        customWork: path.resolve(import.meta.dirname, 'travaux-sur-mesure.html'),
        projects: path.resolve(import.meta.dirname, 'realisations.html'),
        quote: path.resolve(import.meta.dirname, 'soumission.html'),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});

function redirectLegacyRoutes(
  req: { url?: string },
  res: { statusCode: number; setHeader: (name: string, value: string) => void; end: () => void },
  next: () => void,
) {
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  const cleanPath = legacyRouteRedirects[requestUrl.pathname];
  if (!cleanPath) {
    next();
    return;
  }

  res.statusCode = 308;
  res.setHeader('Location', `${cleanPath}${requestUrl.search}`);
  res.end();
}

function servePrerenderedRoute(
  req: { url?: string },
  _res: unknown,
  next: () => void,
) {
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  if (prerenderedRoutePaths.has(requestUrl.pathname)) {
    req.url = `${requestUrl.pathname}/index.html${requestUrl.search}`;
  }
  next();
}
