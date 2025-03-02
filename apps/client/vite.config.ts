import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({ registerType: 'autoUpdate' }) as any,
  ],
  optimizeDeps: {
    include: ['react-syntax-highlighter/dist/cjs/styles/prism'],
  },
  build: {
    sourcemap: false,
  },
});
