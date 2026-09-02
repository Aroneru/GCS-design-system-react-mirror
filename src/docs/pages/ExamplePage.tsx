import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from '../../lib/icons/outline'
import { useHashRoute } from '../useHashRoute'
import { Aurora, Magnetic, SplitWords, gsap, useGsap } from '../motion'
import {
  KELAS_PANEL,
  KELAS_TIRAI,
  ambilAsal,
  bukaKeAtas,
  lupakanAsal,
  tandaiAsal,
  titikTengah,
  tutupLalu,
} from './example/transition'

/**
 * Pintu masuk ke contoh aplikasi.
 *
 * Halaman ini sengaja hampir kosong: satu tombol di tengah. Isi demonstrasinya
 * ada di `/example/app`, yang dirender penuh layar tanpa kerangka dokumentasi
 * supaya terlihat seperti aplikasi sungguhan, bukan preview di dalam docs.
 */
export function ExamplePage() {
  const [, navigate] = useHashRoute()
  const tirai = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const konten = useRef<HTMLDivElement>(null)

  // Dibaca saat render lewat lazy initializer, bukan di dalam efek: keadaan
  // awal panel harus sudah benar pada cat pertama, kalau tidak isi halaman
  // sempat berkedip sebelum sapuannya jalan. Initializer-nya murni, jadi aman
  // meski StrictMode menjalankannya dua kali.
  const [pulang] = useState(() => ambilAsal() === 'app')

  useLayoutEffect(() => {
    if (!pulang) return
    // Dibersihkan di sini, setelah nilainya aman tersimpan di state: tanpa ini,
    // pergi lalu kembali ke /example dalam satu sesi akan memutar ulang
    // sapuannya padahal tidak ada tombol yang ditekan.
    lupakanAsal()
    const ctx = gsap.context(() => bukaKeAtas(panel.current))
    return () => ctx.revert()
  }, [pulang])

  const scope = useGsap<HTMLDivElement>(({ q }) => {
    gsap.from(q('[data-intro]'), {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.15,
    })
  }, [])

  return (
    // Fragment, bukan satu div: tirai HARUS berada di luar elemen ber-`isolate`
    // di bawah ini. `isolate` membuat stacking context, dan z-[100] milik tirai
    // akan terkurung di dalamnya — rail `z-30` DocsLayout tetap tampak
    // menembusnya, persis yang terjadi sebelum ini.
    <>
      <div
        ref={scope}
        className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6"
      >
        <Aurora />

        <div ref={konten} className="relative z-10 max-w-2xl text-center">
          <p data-intro className="ds-eyebrow">
            Example
          </p>

          <SplitWords
            as="h1"
            text="Lihat kit ini bekerja sebagai aplikasi utuh"
            className="mt-4 text-heading-1 font-black text-gray-900"
            delay={0.25}
          />

          <p data-intro className="mx-auto mt-5 max-w-xl text-body text-gray-600">
            Satu portal layanan lengkap — navigasi, formulir, tabel, dialog, dan notifikasi — dirakit
            hanya dari komponen <code className="font-mono text-sm">@stasi/design-kit-react</code>.
          </p>

          <div data-intro className="mt-10 flex justify-center">
            {/*
              Tombol ini <button>, bukan <a href="#/example/app">: navigasinya
              harus menunggu tirai selesai menutup. Kalau berupa tautan, hash-nya
              berubah seketika dan animasinya terpotong di tengah.
            */}
            <Magnetic strength={22}>
              <button
                type="button"
                onClick={(e) => {
                  tandaiAsal('docs')
                  tutupLalu(tirai.current, konten.current, titikTengah(e.currentTarget), () =>
                    navigate('/example/app'),
                  )
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-primary-700 px-8 py-4 text-base font-black text-white shadow-lg transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              >
                Buka contoh aplikasi
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </div>

        </div>
      </div>

      {/* Gelembung: paruh pertama transisi masuk. Panel: paruh kedua transisi pulang. */}
      <div ref={tirai} className={`${KELAS_TIRAI} scale-0`} aria-hidden="true" />
      <div
        ref={panel}
        className={`${KELAS_PANEL} ${pulang ? 'translate-y-0' : 'translate-y-full'}`}
        aria-hidden="true"
      />
    </>
  )
}
