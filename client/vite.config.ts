import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config. Three.js is large; we split it into its own chunk so the UI
// shell can paint before the engine bundle finishes downloading.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'zustand', 'socket.io-client'],
        },
      },
    },
  },
});
