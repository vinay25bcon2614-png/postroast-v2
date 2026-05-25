import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-syntax-import-attributes'],
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Pass environment variables to frontend at build time
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3001'),
    __SITE_URL__: JSON.stringify(process.env.VITE_SITE_URL || 'http://localhost:5174'),
  },
  server: {
    port: 5174,
    proxy: {
      // Proxy API calls to backend during development
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    minify: false
  }
})
