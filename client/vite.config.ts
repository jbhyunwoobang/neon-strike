import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config. Three.js is large; we split it into its own chunk so the UI
// shell can paint before the engine bundle finishes downloading.
// GitHub Pages serves from /<repo>/; Vercel/Render serve from root.
// The Pages CI sets GH_PAGES=true so only that build gets the subpath.
// (Node's `process` is available at config runtime; not typechecked by the
// browser tsconfig, which only includes `src`.)
declare const process: { env: Record<string, string | undefined> };
const BASE = process.env.GH_PAGES ? '/neon-strike/' : '/';

export default defineConfig({
  plugins: [react()],
  base: BASE,
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 2600,   // Rapier's WASM chunk is large but lazy-loaded
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
});
