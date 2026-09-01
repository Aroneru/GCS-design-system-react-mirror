import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

/**
 * Selektor tercakup yang diberikan `gsap.context`. Tipe bawaan GSAP
 * mendeklarasikannya sebagai `Function | null` karena baru terisi saat context
 * dibuat; di dalam hook ini ia dijamin ada, jadi dipersempit ke bentuk yang
 * sebenarnya dipakai.
 */
export type ScopedSelector = (selector: string) => HTMLElement[]

/**
 * Menjalankan setup GSAP di dalam `gsap.context` yang tercakup pada satu elemen.
 *
 * Context menyimpan setiap tween, timeline, dan ScrollTrigger yang dibuat di
 * dalamnya, lalu `revert()` mengembalikan semuanya saat komponen dilepas. Ini
 * yang membuat StrictMode React 19 — yang sengaja memasang lalu melepas efek dua
 * kali — tidak meninggalkan trigger ganda atau inline style yang menempel.
 *
 * Selektor di dalam callback otomatis dibatasi ke `scope`, jadi `q('.stat')`
 * hanya menemukan elemen di dalam komponen ini, bukan di seluruh halaman.
 *
 * Saat pengguna meminta gerak dikurangi, callback tidak dijalankan sama sekali.
 * Karena itu setiap animasi di sini memakai `gsap.from` (bukan `fromTo` apalagi
 * `to`): keadaan akhir sudah menjadi keadaan asli di markup, sehingga tanpa
 * animasi pun halaman tampil utuh dan benar.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: { scope: T; q: ScopedSelector }) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T>(null)

  useLayoutEffect(() => {
    const el = scope.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(
      (self) => setup({ scope: el, q: self.selector as unknown as ScopedSelector }),
      el,
    )
    return () => ctx.revert()
    // `setup` sengaja tidak masuk daftar dependensi: pemanggil menuliskannya
    // sebagai fungsi inline yang identitasnya berubah tiap render, sehingga
    // memasukkannya akan membangun ulang seluruh timeline di setiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
