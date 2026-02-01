import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/capital-efficiency-dashboard/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})