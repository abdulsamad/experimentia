import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ['react-copy-to-clipboard', 'react-syntax-highlighter/dist/esm/styles/prism/coy'],
  },
  build: {
    sourcemap: false,
  },
});
