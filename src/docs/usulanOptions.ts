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
