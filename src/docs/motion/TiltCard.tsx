import { useRef, type ReactNode } from 'react'
import { gsap, isCoarsePointer, prefersReducedMotion } from './gsap'

/**
 * Membuat isinya terasa seperti lempeng yang melayang: memiringkan diri
 * mengikuti posisi kursor, lalu kembali rata saat kursor pergi.
 *
 * `quickTo` dipakai alih-alih `gsap.to` biasa karena nilainya diperbarui tiap
 * gerakan pointer — `quickTo` menyiapkan satu tween yang bisa disetel ulang
 * tanpa mengalokasikan objek baru di setiap event, dan easing-nya membuat
 * kemiringan menyusul kursor sedikit terlambat, yang justru terbaca sebagai
 * bobot.
 *
 * Perspektif ditaruh di pembungkus luar, bukan di elemen yang berputar, supaya
 * titik hilangnya tetap di tengah kartu saat kartu miring.
 */
export function TiltCard({
  children,
  className = '',
  /** Kemiringan maksimum di tiap sumbu, dalam derajat. */
  max = 7,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const plate = useRef<HTMLDivElement>(null)
  const setters = useRef<{ rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null>(null)

  const ensureSetters = () => {
    if (!setters.current && plate.current) {
      const opts = { duration: 0.6, ease: 'power3.out' }
      setters.current = {
        rx: gsap.quickTo(plate.current, 'rotationX', opts),
        ry: gsap.quickTo(plate.current, 'rotationY', opts),
      }
    }
    return setters.current
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCoarsePointer() || prefersReducedMotion()) return

    const s = ensureSetters()
    if (!s) return

    const r = e.currentTarget.getBoundingClientRect()
    // Posisi pointer dinormalkan ke rentang -0.5..0.5 dari tengah kartu.
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5

    // Sumbu Y dibalik: kursor di atas harus memiringkan sisi atas menjauh.
    s.rx(-py * max * 2)
    s.ry(px * max * 2)
  }

  const onLeave = () => {
    const s = ensureSetters()
    s?.rx(0)
    s?.ry(0)
  }

  return (
    <div
      className={`ds-tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      // Efeknya murni dekoratif dan tidak menambah makna apa pun; isinya tetap
      // terbaca normal, jadi tidak ada peran ARIA yang perlu diumumkan.
    >
      <div ref={plate} className="ds-tilt-plate">
        {children}
      </div>
    </div>
  )
}
