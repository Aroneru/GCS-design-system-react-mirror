/// <reference types="vite/client" />

/**
 * Variabel lingkungan yang dibaca situs dokumentasi.
 *
 * Vite hanya membuka variabel berawalan `VITE_` ke kode sisi klien, dan nilainya
 * SELALU string — tidak ada boolean di sini. Karena itu tiap pembacaannya harus
 * dibandingkan dengan teks (`=== 'true'`); menaruhnya langsung di `if` membuat
 * `'false'` ikut bernilai benar, sebab string tak kosong selalu truthy.
 *
 * Apa pun yang berawalan `VITE_` ikut tertanam di bundle yang terbit dan bisa
 * dibaca siapa saja. Jangan pernah menaruh rahasia di sini.
 */
interface ImportMetaEnv {
  /**
   * Menyalakan easter egg di jendela kode beranda — foto latar berkedip dan
   * tombol suaranya. `'true'` untuk menyalakan; nilai lain berarti mati.
   *
   * Default-nya mati lewat `.env` yang ikut di-commit, jadi build siapa pun —
   * termasuk workflow deploy — menghasilkan situs tanpa easter egg tanpa perlu
   * mengatur apa-apa. Yang mau melihatnya menyalakan sendiri di `.env.local`,
   * yang tidak ikut ter-commit.
   */
  readonly VITE_EASTER_EGG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
