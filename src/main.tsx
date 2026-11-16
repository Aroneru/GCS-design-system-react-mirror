import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// styles.css milik paket, ditambah varian `dark:` untuk mode gelap docs.
import './docs/docs.css'
// Gaya khusus situs dokumentasi. Dimuat setelah styles.css supaya bisa menimpa
// bila perlu, dan tetap di luar paket yang dipublish.
import './docs/motion/motion.css'
import App from './App.tsx'
import { syncDocsTheme } from './docs/docsTheme'
import { currentPath } from './docs/useHashRoute'

// Mode gelap docs disesuaikan dengan halaman yang dibuka sebelum render pertama.
syncDocsTheme(currentPath())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
