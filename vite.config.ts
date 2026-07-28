import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Config untuk situs dokumentasi (npm run dev / npm run build).
// Build library-nya pakai vite.lib.config.ts (npm run build:lib).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
