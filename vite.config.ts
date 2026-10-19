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
    rollupOptions: {
      output: {
        // Default chunking gives every lucide-react icon (and several other
        // small shared deps) its own ~150-byte file - 90+ extra HTTP
        // requests on a single page (confirmed on /listed-companies). Group
        // the icon set and the react/router core into stable vendor
        // chunks so the browser fetches a handful of cacheable bundles
        // instead of a hundred tiny ones; everything else keeps Rollup's
        // normal per-route splitting.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('lucide-react')) return 'icons-vendor'
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/react-router') || id.includes('/scheduler/')) return 'react-vendor'
          return undefined
        },
      },
    },
  },
})
