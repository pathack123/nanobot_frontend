import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Enable SPA fallback - redirect all requests to index.html
    historyApiFallback: true
  },
  preview: {
    port: 4173,
    // Enable SPA fallback for preview mode too
    historyApiFallback: true
  }
})

