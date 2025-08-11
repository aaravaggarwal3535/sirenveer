import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',        // where the production build goes
    emptyOutDir: true      // clean old files
  },
  server: {
    historyApiFallback: true // SPA routing in dev
  }
})
