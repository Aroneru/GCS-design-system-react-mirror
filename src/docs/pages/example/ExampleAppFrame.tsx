import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft } from '../../../lib/icons/outline'
import { useHashRoute } from '../../useHashRoute'
import { Magnetic, gsap } from '../../motion'
import { DemoApp } from './DemoApp'
import { KELAS_PANEL, KELAS_TIRAI, bukaTirai, tandaiPulang, tutupKeAtas } from './transition'
import { JUDUL_HALAMAN, type HalamanDemo } from './data'

/**
 * Pembungkus aplikasi demo: tirai transisi dan jalan pulang ke dokumentasi.
 *
 * Semua yang bergantung pada GSAP dikumpulkan di sini, di luar `DemoApp`.
 * Batas itu disengaja: aplikasi demonya harus murni memakai
 * `@stasi/design-kit-react` supaya benar-benar menunjukkan kemampuan paket,
 * sementara transisi antar-rute adalah urusan situs dokumentasi.
 */

/** `/example/app/pengajuan` -> "pengajuan"; sisanya jatuh ke Dasbor. */
function halamanDari(path: string): HalamanDemo {
  const sisa = path.replace(/^\/example\/app\/?/, '')
  return sisa in JUDUL_HALAMAN ? (sisa as HalamanDemo) : 'dasbor'
}

export function ExampleAppFrame({ path }: { path: string }) {
  const [, navigate] = useHashRoute()
  const tirai = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const isi = useRef<HTMLDivElement>(null)

  // Tirai dibuka lewat useLayoutEffect, bukan useGsap: hook itu melewatkan
  // callback-nya sama sekali saat gerak diminta dikurangi, padahal tirainya
  // tetap wajib disingkirkan — kalau tidak, ia menutupi seluruh aplikasi.
  //
  // Daftar dependensinya kosong, jadi ini hanya berjalan sekali saat masuk.
  // Berpindah antar-halaman dalam demo tidak mengganti komponen ini, sehingga
  // tirainya tidak ikut berkedip di setiap klik menu.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => bukaTirai(tirai.current))
    return () => ctx.revert()
  }, [])

  return (
    <>
      <div ref={isi}>
        <DemoApp halaman={halamanDari(path)} />
      </div>

      <div className="fixed right-4 bottom-4 z-50">
        <Magnetic>
          <button
            type="button"
            onClick={() => {
              // Ditandai di handler, bukan di efek — lihat catatan pada
              // `pulangDariApp` di transition.ts.
              tandaiPulang()
              tutupKeAtas(panel.current, isi.current, () => navigate('/example'))
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-lg transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <ArrowLeft className="size-4" />
            Kembali ke dokumentasi
          </button>
        </Magnetic>
      </div>

      {/* Gelembung: paruh kedua transisi masuk. Panel: paruh pertama transisi pulang. */}
      <div ref={tirai} className={`${KELAS_TIRAI} scale-100`} aria-hidden="true" />
      <div ref={panel} className={`${KELAS_PANEL} translate-y-full`} aria-hidden="true" />
    </>
  )
}
