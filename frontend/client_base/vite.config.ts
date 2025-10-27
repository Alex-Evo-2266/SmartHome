// vite.config.ts
import path from 'path'                       // builtin

import react from '@vitejs/plugin-react'      // external
import { defineConfig } from 'vite'           // external

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@types': path.resolve(__dirname, 'types'),
    },
  },
  server: {
    proxy: {
      '/api-auth': 'http://127.0.0.1:1337',
      '/api-devices': 'http://127.0.0.1:1337',
      '/api-pages': 'http://127.0.0.1:1337',
      '/api-scripts': 'http://127.0.0.1:1337',
      '/modules': 'https://localhost:1338',
      '/modules-manager': 'https://localhost:1338',
      '/api-modules-manager': 'https://localhost:1338',
      '/ws': 'http://127.0.0.1:1337',
      '/media': 'http://127.0.0.1:1337',
    },
  },
})
