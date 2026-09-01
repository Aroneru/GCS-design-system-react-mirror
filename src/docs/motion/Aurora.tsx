import { gsap } from './gsap'
import { useGsap } from './useGsap'

/**
 * Latar hero berlapis: kisi halus, tiga gumpalan cahaya, dan sapuan sinar.
 *
 * Kedalaman dinyatakan lewat `data-depth` dan dipakai dua kali. Saat halaman
 * digulir, tiap lapis bergeser sebanding dengan kedalamannya — yang jauh
 * bergerak paling sedikit, sehingga tepi layar terbaca sebagai ruang, bukan
 * gambar datar. Di luar itu tiap gumpalan punya siklus napasnya sendiri dengan
 * durasi yang tidak habis membagi satu sama lain, supaya polanya tidak pernah
 * terlihat berulang.
 *
 * Seluruhnya dekoratif — `aria-hidden` dan `pointer-events-none` di akar,
 * jadi tidak ada satu pun lapisan yang bisa menghalangi klik atau terbaca
 * pembaca layar.
 */
export function Aurora() {
  const ref = useGsap<HTMLDivElement>(({ scope, q }) => {
    // ── Parallax: satu timeline yang di-scrub mengikuti posisi gulir ──
    const layers = q('[data-depth]')

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth ?? 0)

      gsap.to(layer, {
        // Lapis 0 nyaris diam (6% tinggi layar), lapis 5 bergerak paling jauh.
        yPercent: 6 + depth * 7,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom top',
          // Angka, bukan `true`: gerakannya menyusul gulir dengan jeda ~0.6
          // detik sehingga terasa punya inersia, bukan terkunci kaku.
          scrub: 0.6,
        },
      })
    })

    // ── Napas: gumpalan cahaya yang tidak pernah benar-benar diam ──
    q('[data-blob]').forEach((blob, i) => {
      gsap.to(blob, {
        xPercent: i % 2 === 0 ? 8 : -8,
        yPercent: i % 2 === 0 ? -6 : 7,
        scale: 1.12,
        duration: 11 + i * 3.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* DEPTH 0 — kisi latar, paling jauh dan paling diam */}
      <div data-depth="0" className="ds-grid absolute inset-[-20%]" />

      {/*
        DEPTH 1 — gumpalan cahaya atmosferik.

        Satu rona saja, diambil dari tangga primary. Mencampur biru dengan ungu
        menghasilkan pelangi latar yang tidak dimiliki merek ini dan menarik
        perhatian ke tempat yang tidak ada isinya; menahannya di satu keluarga
        warna membuat latar terbaca sebagai cahaya, bukan sebagai hiasan.
      */}
      <div data-depth="1" className="absolute inset-[-30%]">
        <div
          data-blob
          className="absolute top-[6%] left-[2%] size-[34rem] rounded-full bg-primary-200/40 blur-[110px]"
        />
        <div
          data-blob
          className="absolute right-[4%] bottom-[2%] size-[30rem] rounded-full bg-primary-100/50 blur-[120px]"
        />
        <div
          data-blob
          className="absolute top-[38%] left-[46%] size-[22rem] rounded-full bg-primary-50/60 blur-[90px]"
        />
      </div>

      {/* DEPTH 2 — sapuan sinar diagonal yang memberi arah pada cahaya */}
      <div data-depth="2" className="ds-beam absolute inset-0" />

      {/*
        Peredam di tepi bawah: menyatukan hero dengan section putih di bawahnya
        supaya batasnya tidak terlihat sebagai garis potong yang tegas.
      */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  )
}
