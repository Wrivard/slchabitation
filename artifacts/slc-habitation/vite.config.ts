import path from 'path';
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
const staticRoutePages = new Map([
  ['/a-propos', '/a-propos.html'],
  ['/renovation', '/renovation.html'],
  ['/agrandissement-construction-neuve', '/agrandissement-construction-neuve.html'],
  ['/travaux-sur-mesure', '/travaux-sur-mesure.html'],
  ['/realisations', '/realisations.html'],
  ['/soumission', '/soumission.html'],
]);
const staticPagePaths = new Set(staticRoutePages.values());

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
        server.middlewares.use((req, res, next) => {
          const pathname = req.url?.split('?')[0];
          const staticPage = pathname ? staticRoutePages.get(pathname) : undefined;
          if (staticPage && req.url) {
            req.url = `${staticPage}${req.url.slice(pathname!.length)}`;
          } else if (pathname?.endsWith('.html') && pathname !== '/index.html' && !staticPagePaths.has(pathname)) {
            req.url = '/index.html';
          }
          next();
        });
      }
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
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
