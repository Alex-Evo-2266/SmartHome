// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve:{
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@types': path.resolve(__dirname, 'types'),
    }
  },
  server:{
    proxy:{
      '/api-auth': "http://127.0.0.1:1337",
      '/api-devices': "http://127.0.0.1:1337",
      '/api-pages': "http://127.0.0.1:1337",
      '/api-scripts': "http://127.0.0.1:1337",
      '/modules': "https://localhost:1338",
      '/ws': "http://127.0.0.1:1337",
      '/media': "http://127.0.0.1:1337"
    }
  }
})
