import { Children, type ElementType, type ReactNode } from 'react'
import { gsap } from './gsap'
import { useGsap } from './useGsap'

type RevealProps = {
  children: ReactNode
  /** Elemen yang dirender. Default `div`; pakai `section`/`ul` bila lebih tepat secara semantik. */
  as?: ElementType
  className?: string
  /** Jarak naik saat masuk, dalam piksel. */
  y?: number
  /** Jeda sebelum animasi mulai, dalam detik. */
  delay?: number
  /**
   * Bila true, tiap anak langsung dianimasikan sendiri-sendiri secara berurutan
   * alih-alih seluruh blok bergerak sebagai satu kesatuan.
   */
  stagger?: boolean
}

/**
 * Blok yang naik dan memudar masuk begitu tepi atasnya melewati 85% tinggi
 * layar — cukup dini untuk terasa menyambut, cukup telat untuk tidak terlanjur
 * selesai sebelum terlihat.
 *
 * Animasinya `from`, jadi keadaan akhir adalah keadaan yang tertulis di markup:
 * tanpa JavaScript atau dengan `prefers-reduced-motion`, isinya tetap tampil.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  y = 24,
  delay = 0,
  stagger = false,
}: RevealProps) {
  const ref = useGsap<HTMLDivElement>(({ scope }) => {
    const targets = stagger ? Array.from(scope.children) : scope

    gsap.from(targets, {
      opacity: 0,
      y,
      duration: 0.7,
      delay,
      ease: 'power3.out',
      stagger: stagger ? 0.08 : 0,
      scrollTrigger: { trigger: scope, start: 'top 85%', once: true },
      // `will-change` hanya dipasang selama animasi berjalan; membiarkannya
      // menempel memaksa browser menahan layer komposit untuk elemen yang sudah
      // diam.
      willChange: 'transform, opacity',
      // `transform` ikut dibersihkan, bukan hanya `willChange`. GSAP menulis
      // transform sebagai inline style, dan inline style mengalahkan kelas —
      // sisa `translate(0px, 0px)` yang menempel akan mematikan efek hover
      // berbasis kelas (mis. `hover:-translate-y-1`) pada elemen yang sama, dan
      // menahan pembulatan sub-piksel dari akhir tween.
      clearProps: 'willChange,transform',
    })
  }, [stagger, y, delay, Children.count(children)])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Judul yang tersusun kata demi kata: tiap kata terangkat dari balik garis
 * dasarnya sendiri, seperti tirai kecil yang dibuka berurutan.
 *
 * Pemenggalan dilakukan saat render (bukan dengan menulis ulang innerHTML
 * setelahnya) supaya pembaca layar tetap membaca kalimat utuh — tiap kata ikut
 * membawa spasi di belakangnya, dan pembungkusnya diberi `aria-label` berisi
 * teks aslinya.
 */
export function SplitWords({
  text,
  className,
  as: Tag = 'h1',
  delay = 0,
}: {
  text: string
  className?: string
  as?: ElementType
  delay?: number
}) {
  const ref = useGsap<HTMLHeadingElement>(({ q }) => {
    gsap.from(q('[data-word]'), {
      yPercent: 115,
      opacity: 0,
      duration: 0.9,
      delay,
      ease: 'power4.out',
      stagger: 0.045,
      willChange: 'transform, opacity',
      clearProps: 'willChange',
    })
  }, [text, delay])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        // `overflow-hidden` pada pembungkus luar itu yang memotong kata saat
        // masih di bawah garis dasar. `pb-[0.12em]` memberi ruang bagi ekor
        // huruf seperti g dan y supaya tidak ikut terpotong saat diam.
        //
        // Jarak antarkata dibuat lewat margin, bukan spasi teks: `inline-flex`
        // menciutkan spasi di ujung isinya, dan memakai nbsp justru mematikan
        // titik putus baris — judul panjang jadi tidak bisa membungkus.
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="mr-[0.26em] inline-flex overflow-hidden pb-[0.12em] align-bottom last:mr-0"
        >
          <span data-word className="inline-block">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}
