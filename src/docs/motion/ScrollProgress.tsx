import { gsap } from './gsap'
import { useGsap } from './useGsap'

/**
 * Garis tipis di puncak halaman yang memanjang seiring kemajuan gulir.
 *
 * Yang dianimasikan `scaleX`, bukan `width`: skala ditangani compositor tanpa
 * menghitung ulang tata letak, sedangkan mengubah lebar memaksa layout di
 * setiap frame gulir.
 */
export function ScrollProgress() {
  const ref = useGsap<HTMLDivElement>(({ scope }) => {
    gsap.to(scope, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
      },
    })
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <div
        ref={ref}
        // Warna rata, bukan gradien: garisnya cuma 3px, jadi gradien apa pun
        // tidak akan terbaca sebagai gradien — yang tersisa hanya rona yang
        // berubah-ubah tanpa alasan.
        className="ds-progress h-full bg-primary-600"
      />
    </div>
  )
}
