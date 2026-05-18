import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/surepass': {
        target: 'https://sandbox.surepass.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/surepass/, '/api/v1')
      }
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
})
