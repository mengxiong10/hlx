import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { splitVendorChunkPlugin } from 'vite';

// react({
//   jsxRuntime: 'automatic',
//   jsxImportSource: '@emotion/react',
//   babel: {
//     plugins: ['@emotion/babel-plugin'],
//   },
// })

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  plugins: [svgr({ exportAsDefault: true }), react(), splitVendorChunkPlugin()],
});
