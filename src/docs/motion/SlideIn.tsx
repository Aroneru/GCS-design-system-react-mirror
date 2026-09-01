import type { ReactNode } from 'react'
import { gsap } from './gsap'
import { useGsap } from './useGsap'

/**
 * Isi panel yang meluncur masuk dari kiri setiap kali `keyed` berubah.
 *
 * Dipakai untuk panel navigasi samping, yang sebelumnya sekadar nongol begitu
 * saja saat pengguna berpindah dari satu area ke area lain.
 *
 * Yang digeser adalah ISI panel, bukan lebar panelnya. Menganimasikan lebar
 * memaksa seluruh kolom konten di sebelahnya dihitung ulang tiap frame; menggeser
 * isinya dengan `xPercent` di dalam pembungkus yang sudah `overflow-hidden`
 * hanya menyentuh compositor, dan hasilnya justru lebih tepat — panel terbaca
 * seperti keluar dari balik rail ikon, bukan seperti kolom yang memuai.
 *
 * Elemen bertanda `data-slide-item` menyusul berurutan setelahnya, jadi
 * daftarnya tersusun alih-alih tiba sekaligus.
 *
 * `keyed` yang menjadi dependensi, bukan sekadar pemasangan komponen: panel ini
 * tetap terpasang saat berpindah antar-area, jadi tanpa itu animasinya hanya
 * berjalan sekali seumur sesi.
 */
export function SlideIn({
  keyed,
  className,
  children,
}: {
  /** Berubah nilainya = putar ulang animasi. Biasanya nama area yang sedang dibuka. */
  keyed: string
  className?: string
  children: ReactNode
}) {
  const ref = useGsap<HTMLDivElement>(({ scope, q }) => {
    gsap.from(scope, {
      xPercent: -100,
      duration: 0.45,
      ease: 'power3.out',
      willChange: 'transform',
      clearProps: 'willChange',
    })

    gsap.from(q('[data-slide-item]'), {
      opacity: 0,
      x: -12,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.04,
      delay: 0.12,
    })
  }, [keyed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
