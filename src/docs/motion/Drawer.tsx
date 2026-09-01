import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

/**
 * Panel navigasi yang meluncur masuk dari tepi kiri, lengkap dengan animasi
 * keluar.
 *
 * Bagian yang menuntut kehati-hatian di sini adalah animasi KELUAR. Kalau panel
 * dilepas dari DOM begitu `open` menjadi false, tidak ada lagi yang tersisa
 * untuk dianimasikan — ia sekadar hilang. Karena itu komponen ini memisahkan
 * dua hal: `open` adalah niat pengguna, `mounted` adalah apakah panel masih ada
 * di DOM. Menutup berarti memundurkan timeline lebih dulu, dan baru pada
 * `onReverseComplete` panel benar-benar dilepas.
 *
 * Timeline dibuat sekali dalam keadaan `paused` lalu dimainkan maju dan mundur,
 * bukan dua timeline terpisah untuk masuk dan keluar. Dengan begitu menutup di
 * tengah animasi membuka akan berbalik dari posisi saat itu juga — tidak ada
 * lompatan ke keadaan awal.
 *
 * Saat gerak dikurangi, tidak ada timeline sama sekali: panel muncul dan hilang
 * seketika, dan `mounted` mengikuti `open` secara langsung.
 */
export function Drawer({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  /** Nama dialog untuk pembaca layar. */
  label: string
  children: ReactNode
}) {
  const [mounted, setMounted] = useState(open)
  const root = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const animated = !prefersReducedMotion()

  useLayoutEffect(() => {
    if (!mounted || !animated) return

    const ctx = gsap.context((self) => {
      const q = self.selector as unknown as (s: string) => HTMLElement[]

      // `fromTo` menerapkan keadaan awalnya seketika saat timeline dibuat, jadi
      // panel sudah berada di luar layar sebelum frame pertama digambar — tidak
      // ada kedipan panel yang terlanjur terlihat di tempatnya.
      timeline.current = gsap
        .timeline({ paused: true })
        .fromTo(
          q('[data-drawer-overlay]'),
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' },
          0,
        )
        .fromTo(
          q('[data-drawer-panel]'),
          { xPercent: -100 },
          { xPercent: 0, duration: 0.45, ease: 'power3.out' },
          0,
        )
        // Isi panel menyusul sedikit di belakang panelnya sendiri, supaya
        // terbaca sebagai daftar yang tersusun — bukan satu lempeng utuh yang
        // digeser.
        .fromTo(
          q('[data-drawer-item]'),
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.035 },
          0.14,
        )
    }, root)

    return () => {
      ctx.revert()
      timeline.current = null
    }
  }, [mounted, animated])

  // Menjalankan timeline sesuai arah yang diminta. Melepas panel dari DOM
  // ditangani `onReverseComplete`, bukan efek ini — jadi tidak ada setState yang
  // dipanggil langsung di badan efek.
  useEffect(() => {
    const tl = timeline.current
    if (!mounted || !tl) return

    if (open) {
      tl.play()
    } else {
      tl.eventCallback('onReverseComplete', () => setMounted(false))
      tl.reverse()
    }
  }, [open, mounted])

  // Escape menutup panel — perilaku yang diharapkan dari apa pun yang
  // mengumumkan dirinya sebagai dialog modal.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /*
   * `mounted` disesuaikan saat render, bukan lewat efek.
   *
   * Membuka harus memasang panel sebelum frame berikutnya digambar; kalau ini
   * dikerjakan di useEffect, React sempat menggambar satu frame tanpa panel dan
   * animasi masuk kehilangan awalnya. Menyetel state saat render membuat React
   * membuang keluaran ini dan langsung merender ulang — pola resmi untuk
   * menyelaraskan state dengan prop yang berubah — dan kedua cabang di bawah
   * dijaga syarat sehingga tidak bisa berputar.
   *
   * Cabang kedua hanya untuk mode gerak dikurangi: di sana tidak ada timeline
   * yang bisa dimundurkan, jadi tidak ada pula yang akan memanggil
   * `onReverseComplete` untuk melepasnya.
   */
  if (open && !mounted) setMounted(true)
  if (!open && mounted && !animated) setMounted(false)

  if (!mounted) return null

  return (
    <div ref={root} className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={label}>
      <div
        data-drawer-overlay
        className="absolute inset-0 bg-gray-900/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        data-drawer-panel
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl"
      >
        {children}
      </aside>
    </div>
  )
}
