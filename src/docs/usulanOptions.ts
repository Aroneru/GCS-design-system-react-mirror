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
