import { gsap } from './gsap'
import { useGsap } from './useGsap'

/**
 * Angka yang berhitung naik dari nol saat pertama kali terlihat.
 *
 * Nilai akhirnya sudah tertulis sebagai teks anak di markup, jadi tanpa
 * JavaScript — atau saat gerak dikurangi — pembaca tetap melihat angka yang
 * benar, bukan nol. Animasinya hanya menimpa `textContent` sementara, lalu
 * berhenti tepat di angka aslinya.
 *
 * `aria-hidden` tidak dipakai: nilainya berubah terlalu cepat untuk mengganggu,
 * dan elemen ini biasanya berada di dalam `<dd>` yang perlu terbaca.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useGsap<HTMLSpanElement>(({ scope }) => {
    const counter = { n: 0 }

    gsap.to(counter, {
      n: value,
      duration: 1.6,
      ease: 'power2.out',
      // Angka pecahan dibulatkan tiap frame supaya yang terbaca selalu bilangan
      // bulat, bukan 12.7431.
      onUpdate: () => {
        scope.textContent = String(Math.round(counter.n))
      },
      scrollTrigger: { trigger: scope, start: 'top 90%', once: true },
    })
  }, [value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
