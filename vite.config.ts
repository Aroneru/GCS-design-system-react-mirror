import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Config untuk situs dokumentasi (npm run dev / npm run build).
// Build library-nya pakai vite.lib.config.ts (npm run build:lib).

// GitHub Pages menyajikan project site dari sub-path (/<repo>/), bukan root
// domain. Workflow deploy mengisi VITE_BASE dari base_path milik Pages; di
// dev server dan build lokal nilainya kosong sehingga base tetap "/".
const rawBase = process.env.VITE_BASE ?? '/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
