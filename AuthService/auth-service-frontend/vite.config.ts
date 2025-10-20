import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/auth-service/',
  server:{
    port: 5174,
    proxy:{
      '/api-auth': "http://127.0.0.1:1337"
    }
  },
  plugins: [react()],
})
