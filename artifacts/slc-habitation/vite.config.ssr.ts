import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Construction de l'application pour le prérendu.
 *
 * Le même code React est empaqueté pour Node afin que `scripts/prerender.mjs`
 * puisse produire le HTML statique de chaque page. Aucune feuille de style
 * n'est nécessaire ici : les pages statiques référencent les fichiers CSS
 * générés par la construction destinée au navigateur.
 */
export default defineConfig({
  root: path.resolve(import.meta.dirname),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    ssr: path.resolve(import.meta.dirname, 'src/entry-server.tsx'),
    outDir: path.resolve(import.meta.dirname, 'dist/server'),
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: { entryFileNames: 'entry-server.js' },
    },
  },
});
