import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// Build library yang dipublish ke NPM (npm run build:lib -> folder dist/).
// React & Tailwind sengaja TIDAK di-bundle: jadi peerDependencies consumer.
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src/lib'], rollupTypes: true, tsconfigPath: './tsconfig.app.json' }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
  },
})
