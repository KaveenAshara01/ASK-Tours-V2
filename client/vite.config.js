import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['4e78d78ab589.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
})

