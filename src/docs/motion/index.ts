/**
 * Primitif gerak untuk situs dokumentasi.
 *
 * Sengaja terpisah dari `src/lib`: semua ini bergantung pada GSAP yang hanya
 * devDependency, dan tidak satu pun ikut diekspor ke `@stasi/design-kit-react`.
 * Kalau suatu saat salah satunya dibutuhkan konsumen paket, ia harus ditulis
 * ulang tanpa GSAP, bukan dipindahkan begitu saja.
 */
export { Aurora } from './Aurora'
export { CountUp } from './CountUp'
export { Drawer } from './Drawer'
export { Magnetic } from './Magnetic'
export { Reveal, SplitWords } from './Reveal'
export { ScrollProgress } from './ScrollProgress'
export { SlideIn } from './SlideIn'
export { SpotlightCard } from './SpotlightCard'
export { TiltCard } from './TiltCard'
export { useGsap } from './useGsap'
export { gsap, isCoarsePointer, prefersReducedMotion, ScrollTrigger } from './gsap'
