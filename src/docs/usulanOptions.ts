import { createContext, useContext } from 'react'

/**
 * Pilihan Segmented yang dipakai berulang di Playground halaman usulan.
 *
 * Dipisah dari usulanKit.tsx — bukan karena rapi-rapi saja: react-refresh
 * mensyaratkan berkas komponen hanya mengekspor komponen, jadi konstanta
 * seperti ini akan mematikan fast refresh bila ikut ditaruh di sana.
 */
export const adaTidakAda = [
  { value: true, label: 'Ada' },
  { value: false, label: 'Tidak ada' },
]

/**
 * Pilihan Typography di Playground: tiga font kit, sama dengan pemilih di
 * halaman Foundations › Typography. Kelasnya dipasang di Stage, jadi komponen
 * di dalamnya mewarisi font itu, persis seperti consumer memasang `font-alt`
 * di pembungkus halamannya.
 */
export type PlaygroundFont = 'sans' | 'alt' | 'alt2'

export const typographyOptions: { value: PlaygroundFont; label: string }[] = [
  { value: 'sans', label: 'Lato' },
  { value: 'alt', label: 'Inter' },
  { value: 'alt2', label: 'Arial' },
]

export const fontClass: Record<PlaygroundFont, string> = {
  sans: 'font-sans',
  alt: 'font-alt',
  alt2: 'font-alt-2',
}

const fontVar: Record<PlaygroundFont, string> = {
  sans: '--font-sans',
  alt: '--font-alt',
  alt2: '--font-alt-2',
}

/**
 * Kelas saja tidak cukup: beberapa komponen memasang `font-sans` atau
 * `font-alt` sendiri (Navbar, Avatar, judul Modal), jadi mereka tidak ikut
 * mewarisi. Di dalam panggung, dua token font lainnya diarahkan ke font
 * pilihan, sehingga kelas font apa pun di dalamnya menghasilkan font yang sama.
 * Token font pilihan sendiri tidak ditimpa, supaya var() tidak melingkar.
 */
export function fontScopeStyle(font: PlaygroundFont): Record<string, string> {
  const target = `var(${fontVar[font]})`
  return Object.fromEntries(
    (Object.keys(fontVar) as PlaygroundFont[])
      .filter((key) => key !== font)
      .map((key) => [fontVar[key], target]),
  )
}

/**
 * Font Playground. Disediakan oleh <FlowSection id="playground">; di luar
 * bagian Playground nilainya null, jadi contoh lain di halaman tidak ikut
 * berubah font.
 */
export const PlaygroundFontContext = createContext<{
  font: PlaygroundFont
  setFont: (font: PlaygroundFont) => void
} | null>(null)

/** Font pilihan kontrol Typography; `undefined` di luar bagian Playground. */
export function usePlaygroundFont(): PlaygroundFont | undefined {
  return useContext(PlaygroundFontContext)?.font
}

/** Nilai `font` di URL iframe pratinjau (mis. Navbar). */
export function readPlaygroundFont(value: string | null): PlaygroundFont | undefined {
  return value === 'sans' || value === 'alt' || value === 'alt2' ? value : undefined
}
