import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/styles.css'
// Gaya khusus situs dokumentasi. Dimuat setelah styles.css supaya bisa menimpa
// bila perlu, dan tetap di luar paket yang dipublish.
import './docs/motion/motion.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
