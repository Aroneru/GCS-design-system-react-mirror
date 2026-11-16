import { createContext, useContext, useSyncExternalStore } from 'react'

/**
 * Mode gelap situs dokumentasi.
 *
 * Terpisah dari tema komponen kit. Kit memakai `data-theme="dark"`, dan atribut
 * itu mengganti nilai token (surface, border, field, …) untuk seluruh isinya:
 * dipasang di <html>, komponen tanpa `darkMode` ikut gelap setengah-setengah
 * dan Container di Home berubah menjadi kotak gray-700. Karena itu docs memakai
 * atributnya sendiri, `data-docs-theme`, yang hanya dibaca varian `dark:` milik
 * situs (lihat docs.css). Komponen kit tidak membacanya, jadi pratinjau
 * komponen baru gelap bila halamannya memberi prop `darkMode`.
 */

/**
 * Halaman yang sudah punya tampilan gelap. Mode gelap dicoba di sebagian
 * halaman dulu. Di halaman lain situs tetap terang dan tombolnya diredupkan,
 * sedangkan pilihan pembaca tetap disimpan untuk halaman yang sudah siap.
 *
 * Menambah halaman: beri elemen halamannya varian `dark:`, beri `darkMode` pada
 * komponen kit di pratinjaunya (cuplikan kode di sebelahnya ikut menuliskannya),
 * lalu daftarkan rutenya di sini. Aplikasi Portal Dashboard yang penuh layar
 * menerima mode gelapnya lewat prop dari App, karena berkasnya hanya boleh
 * memakai kit.
 */
const darkPages = new Set([
  '/',
  '/form',
  '/form/input-field',
  '/form/search',
  '/portal-dashboard',
  '/portal-dashboard/app',
])

export const hasDarkMode = (path: string) => darkPages.has(path)

/** Kunci localStorage pilihan pembaca. Skrip kecil di index.html membacanya juga. */
const STORAGE_KEY = 'ceplok-docs-theme'

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark'
  } catch {
    // localStorage bisa diblokir, mis. oleh pengaturan privasi peramban.
    return false
  }
}

let preference = readPreference()
const listeners = new Set<() => void>()

export function setDarkPreference(dark: boolean) {
  preference = dark
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch {
    // Tanpa localStorage pilihannya tetap berlaku sampai halaman dimuat ulang.
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Pilihan pembaca, terlepas dari apakah halaman yang sedang dibuka sudah mendukungnya. */
export const useDarkPreference = () => useSyncExternalStore(subscribe, () => preference)

/** Memasang atau melepas mode gelap di <html>. */
export function applyDocsTheme(dark: boolean) {
  const html = document.documentElement
  if (dark) html.dataset.docsTheme = 'dark'
  else delete html.dataset.docsTheme
}

/**
 * Dipanggil sekali dari main.tsx, sebelum React merender. Skrip di index.html
 * hanya menebak dari pilihan pembaca karena belum tahu halaman yang dibuka; di
 * sini tebakan itu disesuaikan dengan rutenya, mis. dilepas di aplikasi
 * Example dan pratinjau Navbar, sebelum React sempat menggambar apa pun.
 * Sesudahnya App yang menjaganya setiap kali halaman berganti.
 */
export function syncDocsTheme(path: string) {
  applyDocsTheme(preference && hasDarkMode(path))
}

/**
 * Mode gelap yang benar-benar berlaku di halaman yang sedang dibuka, disediakan
 * DocsLayout. Halaman memakainya untuk memberi `darkMode` pada pratinjau.
 */
export const DocsDarkContext = createContext(false)

export const useDocsDark = () => useContext(DocsDarkContext)
