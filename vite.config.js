import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      // credentialless allows CDN imports (jsdelivr) without CORP headers
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
})
