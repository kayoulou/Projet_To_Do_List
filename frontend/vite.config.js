import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // ✅ On place le port ici, pas dans proxy
    proxy: {
      '/tasks': {
        target: 'http://backend:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tasks/, '')
      }
    }
  }
})
