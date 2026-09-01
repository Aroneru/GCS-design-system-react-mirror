import { useCallback, useRef, type ElementType, type ReactNode } from 'react'
import { isCoarsePointer } from './gsap'

/**
 * Kartu dengan sorotan lembut yang mengikuti kursor, plus tepi yang ikut
 * menyala di sisi terdekat pointer.
 *
 * Tidak memakai GSAP: yang berubah hanya dua custom property (`--mx`, `--my`)
 * yang dibaca oleh gradien di `motion.css`. Menulis custom property jauh lebih
 * murah daripada menjalankan tween per-frame, dan efeknya toh harus mengikuti
 * pointer secara langsung — bukan bergerak dengan easing sendiri.
 *
 * Pembaruan dijepit ke satu frame lewat rAF supaya rentetan `pointermove` dari
 * mouse ber-polling tinggi tidak memaksa gaya dihitung ulang berkali-kali dalam
 * satu frame.
 */
export function SpotlightCard({
  children,
  className = '',
  as: Tag = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: ElementType
} & Record<string, unknown>) {
  const frame = useRef(0)

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (isCoarsePointer()) return

    const el = e.currentTarget
    const { clientX, clientY } = e

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - r.left}px`)
      el.style.setProperty('--my', `${clientY - r.top}px`)
    })
  }, [])

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    cancelAnimationFrame(frame.current)
    // Sorotan tidak dihapus melainkan dipudarkan lewat opacity di CSS; posisinya
    // dibiarkan di tempat terakhir supaya tidak terlihat "melompat" ke sudut
    // kiri atas saat kursor kembali masuk.
    e.currentTarget.style.removeProperty('--spot-opacity')
  }, [])

  return (
    <Tag
      className={`ds-spotlight ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
}
