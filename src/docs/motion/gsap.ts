/**
 * Satu-satunya tempat GSAP di-setup untuk situs dokumentasi.
 *
 * PENTING — batas paket: berkas ini dan seluruh isi `src/docs/motion/` hanya
 * dipakai situs dokumentasi, tidak pernah diekspor lewat `src/lib`. GSAP
 * terpasang sebagai devDependency, jadi konsumen `@stasi/design-kit-react`
 * tidak ikut menariknya. Jangan mengimpor apa pun dari sini di dalam `src/lib`.
 *
 * `registerPlugin` idempoten, tapi tetap dipanggil sekali di level modul supaya
 * urutannya pasti: ScrollTrigger sudah terdaftar sebelum komponen mana pun
 * sempat membuat timeline.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * Pengguna yang meminta gerak dikurangi tidak mendapat animasi sama sekali —
 * elemen langsung tampil di keadaan akhirnya. Dicek saat efek berjalan (bukan
 * saat modul dimuat) supaya perubahan setelan sistem ikut terbaca pada render
 * berikutnya.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Layar sentuh tidak punya kursor yang bisa diikuti, dan GPU-nya biasanya lebih
 * terbatas. Efek yang bergantung pada posisi pointer (spotlight, tilt, magnet)
 * dimatikan di sini, bukan sekadar diperkecil.
 */
export const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
