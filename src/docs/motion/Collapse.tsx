import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

/**
 * Tinggi alami isi sekarang, diukur tanpa mengganggu tinggi yang sedang
 * terpasang. `offsetHeight` di sini aman karena pembungkusnya sudah
 * `overflow-hidden`: isinya tidak pernah meluber keluar kotak.
 */
function ukurAlami(el: HTMLElement) {
  const simpan = el.style.height
  el.style.height = 'auto'
  const tinggi = el.offsetHeight
  el.style.height = simpan
  return tinggi
}

/**
 * Daftar yang membuka, menutup, dan BERGANTI isi dengan tinggi yang dianimasikan.
 *
 * Dipakai daftar sub-halaman di dalam panel navigasi ponsel, yang sebelumnya
 * berganti seketika begitu areanya ditukar — persis masalah yang sudah
 * diselesaikan `SlideIn` untuk panel samping di desktop.
 *
 * Yang menuntut kehati-hatian adalah titik BERANGKATnya. Saat efek ini
 * berjalan, DOM sudah berisi daftar yang baru, jadi tinggi daftar lama tidak
 * bisa diukur lagi dari elemennya — ia harus diingat dari putaran sebelumnya.
 * Itu tugas `lalu`.
 *
 * Tinggi tetapnya dilepas begitu animasi membuka selesai. Angka px yang
 * menempel akan salah begitu isinya berubah ukuran sendiri — layar diputar,
 * label membungkus jadi dua baris — sedangkan `height: auto` mengikuti.
 *
 * Tinggi memang bukan properti yang murah untuk dianimasikan, tapi di sini
 * tidak terhindarkan: isi di bawahnya harus ikut bergeser. Yang bisa dihindari
 * adalah menganimasikan tiap tautannya dengan cara yang sama — itu dikerjakan
 * dengan transform lewat `[data-slide-item]`, penanda yang sama dengan
 * `SlideIn`.
 */
export function Collapse({
  open,
  keyed,
  children,
}: {
  /** Niat buka/tutup. Isinya tetap dirender saat menutup supaya ada yang menyusut. */
  open: boolean
  /** Identitas isi. Berubah nilainya = tingginya ditransisikan ke isi yang baru. */
  keyed: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  /** Tinggi yang terpasang saat animasi terakhir selesai. */
  const lalu = useRef(0)
  const pertama = useRef(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // Menutup di tengah membuka harus berbalik dari posisi saat itu juga, jadi
    // yang dibaca tinggi yang sedang TERLIHAT — bukan tinggi akhir yang dituju.
    const dari = tween.current?.isActive() ? el.offsetHeight : lalu.current
    const tujuan = open ? ukurAlami(el) : 0

    // Pemasangan pertama tidak dianimasikan: panelnya sendiri baru meluncur
    // masuk lewat `Drawer`, dan dua animasi yang bertumpuk membuat daftarnya
    // terbaca goyah alih-alih tenang.
    if (pertama.current || prefersReducedMotion()) {
      pertama.current = false
      el.style.height = open ? '' : '0px'
      lalu.current = tujuan
      return
    }

    lalu.current = tujuan
    if (dari === tujuan) return

    tween.current?.kill()
    tween.current = gsap.fromTo(
      el,
      { height: dari },
      {
        height: tujuan,
        duration: 0.42,
        ease: 'power3.out',
        onComplete: () => {
          if (open) el.style.height = ''
        },
      },
    )

    // Tautannya menyusul sedikit di belakang kotaknya, supaya terbaca sebagai
    // daftar yang tersusun — bukan satu lempeng yang dimuaikan.
    const isi = open ? gsap.from(el.querySelectorAll('[data-slide-item]'), {
      opacity: 0,
      x: -12,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.03,
      delay: 0.08,
    }) : null

    return () => {
      isi?.kill()
    }
  }, [open, keyed])

  return (
    <div
      ref={ref}
      className="overflow-hidden"
      // Daftar yang tingginya nol masih punya tautan yang bisa difokus dengan
      // Tab meski tak terlihat sama sekali. `inert` menutup keduanya sekaligus:
      // hilang dari urutan fokus sekaligus dari pembaca layar.
      inert={!open}
    >
      {children}
    </div>
  )
}
