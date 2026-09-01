import { useRef, type ReactNode } from 'react'
import { gsap, isCoarsePointer, prefersReducedMotion } from './gsap'

/**
 * Menarik satu elemen sedikit ke arah kursor saat kursor mendekat, lalu
 * melepaskannya kembali ke tempat semula.
 *
 * Yang bergeser adalah pembungkus di dalamnya, bukan area tangkap pointer di
 * luar. Kalau tombolnya sendiri yang bergerak, ia akan menjauh dari kursor,
 * memicu `pointerleave`, kembali ke tempatnya, lalu tertangkap lagi — berkedip
 * tanpa henti. Area tangkap yang diam memutus lingkaran itu.
 *
 * Jangkauannya sengaja kecil (default 18px): cukup untuk terasa hidup saat
 * kursor lewat, tidak cukup untuk membuat sasaran klik meleset.
 */
export function Magnetic({
  children,
  className = '',
  /** Pergeseran maksimum dari titik diam, dalam piksel. */
  strength = 18,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const inner = useRef<HTMLSpanElement>(null)
  const setters = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null)

  const ensureSetters = () => {
    if (!setters.current && inner.current) {
      const opts = { duration: 0.5, ease: 'power3.out' }
      setters.current = {
        x: gsap.quickTo(inner.current, 'x', opts),
        y: gsap.quickTo(inner.current, 'y', opts),
      }
    }
    return setters.current
  }

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (isCoarsePointer() || prefersReducedMotion()) return

    const s = ensureSetters()
    if (!s) return

    const r = e.currentTarget.getBoundingClientRect()
    s.x(((e.clientX - r.left) / r.width - 0.5) * strength * 2)
    s.y(((e.clientY - r.top) / r.height - 0.5) * strength * 2)
  }

  const onLeave = () => {
    const s = ensureSetters()
    s?.x(0)
    s?.y(0)
  }

  return (
    <span
      className={`inline-flex ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span ref={inner} className="inline-flex">
        {children}
      </span>
    </span>
  )
}
