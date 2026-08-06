import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// Build library yang dipublish ke NPM (npm run build:lib -> folder dist/).
// React & Tailwind sengaja TIDAK di-bundle: jadi peerDependencies consumer.
export default defineConfig({
  plugins: [
    react(),
    // rollupTypes tidak dipakai: api-extractor hanya mendukung satu entry,
    // sedangkan library ini punya subpath icons/outline & icons/solid.
    dts({ include: ['src/lib'], entryRoot: 'src/lib', tsconfigPath: './tsconfig.app.json' }),
  ],
  build: {
    lib: {
      // Multi-entry: index + subpath ikon (lihat "exports" di package.json).
      entry: {
        index: resolve(__dirname, 'src/lib/index.ts'),
        'icons/outline': resolve(__dirname, 'src/lib/icons/outline.ts'),
        'icons/solid': resolve(__dirname, 'src/lib/icons/solid.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // flowbite-react-icons ikut external supaya tidak diduplikasi ke bundle
      // consumer — sudah terdaftar sebagai dependency package ini.
      external: ['react', 'react-dom', 'react/jsx-runtime', /^flowbite-react-icons/],
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
  },
})
