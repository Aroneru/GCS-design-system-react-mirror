import { useState } from 'react'
import { Breadcrumb, Container, Hero, Navbar, Sidebar } from '../../../lib'
import {
  ChartMixed,
  Cog,
  Envelope,
  FileLines,
  GridPlus,
  Home,
  Palette,
  UsersGroup,
} from '../../../lib/icons/outline'
import { asset } from '../../asset'
import { DemoFooter } from './DemoFooter'
import { JUDUL_HALAMAN, type HalamanDemo } from './data'
import { Dasbor } from './pages/Dasbor'
import { Layanan } from './pages/Layanan'
import { Modifikasi } from './pages/Modifikasi'
import { Pemohon } from './pages/Pemohon'
import { Pengajuan } from './pages/Pengajuan'
import { Pengaturan } from './pages/Pengaturan'
import { Simaya } from './pages/Simaya'

/**
 * Kerangka aplikasi demo.
 *
 * PENTING — berkas ini dan seluruh isi `example/pages/` sengaja hanya mengimpor
 * dari `../../../lib`. Tidak ada GSAP, tidak ada primitif gerak dari
 * `docs/motion`, tidak ada pustaka pihak ketiga apa pun. Contoh ini gunanya
 * menunjukkan apa yang benar-benar didapat konsumen dari
 * `@stasi/design-kit-react`; begitu ia dibumbui pustaka lain, ia berhenti
 * menjadi bukti dan berubah jadi iklan. Transisi masuk/keluar yang memakai GSAP
 * hidup di `ExampleAppFrame.tsx`, di luar batas ini.
 *
 * Satu-satunya impor non-lib adalah `asset()`, yaitu helper path berkas milik
 * situs dokumentasi — bukan pustaka, dan tidak memengaruhi tampilan.
 */

const RUTE: { halaman: HalamanDemo; ikon: React.ReactNode; badge?: string }[] = [
  { halaman: 'dasbor', ikon: <ChartMixed className="size-5" /> },
  { halaman: 'pengajuan', ikon: <FileLines className="size-5" />, badge: '10' },
  { halaman: 'pemohon', ikon: <UsersGroup className="size-5" /> },
  { halaman: 'layanan', ikon: <GridPlus className="size-5" /> },
  { halaman: 'simaya', ikon: <Envelope className="size-5" /> },
  { halaman: 'modifikasi', ikon: <Palette className="size-5" /> },
  { halaman: 'pengaturan', ikon: <Cog className="size-5" /> },
]

/** Sub-rute nyata, bukan state palsu — jadi Sidebar dan Navbar bekerja sebagai tautan. */
const href = (h: HalamanDemo) => (h === 'dasbor' ? '#/example/app' : `#/example/app/${h}`)

const DESKRIPSI: Record<HalamanDemo, string> = {
  dasbor: 'Ringkasan pengajuan, capaian bulan ini, dan aktivitas terbaru.',
  pengajuan: 'Seluruh pengajuan yang masuk, lengkap dengan saringan dan pencarian.',
  pemohon: 'Daftar akun pemohon terdaftar beserta status keaktifannya.',
  layanan: 'Layanan yang dibuka untuk umum, beserta estimasi dan biayanya.',
  simaya: 'Persuratan internal dengan aksen Simaya — prop application pada tujuh komponen form.',
  modifikasi: 'Tiga tingkat penyesuaian komponen: varian bawaan, slot, lalu className.',
  pengaturan: 'Data profil dan preferensi pemberitahuan akun Anda.',
}

function Isi({ halaman }: { halaman: HalamanDemo }) {
  switch (halaman) {
    case 'pengajuan':
      return <Pengajuan />
    case 'pemohon':
      return <Pemohon />
    case 'layanan':
      return <Layanan />
    case 'simaya':
      return <Simaya />
    case 'modifikasi':
      return <Modifikasi />
    case 'pengaturan':
      return <Pengaturan />
    default:
      return <Dasbor />
  }
}

export function DemoApp({ halaman }: { halaman: HalamanDemo }) {
  const [ringkas, setRingkas] = useState(false)

  const menu = RUTE.map(({ halaman: h, ikon, badge }) => ({
    id: h,
    label: JUDUL_HALAMAN[h],
    href: href(h),
    icon: ikon,
    badge,
    active: h === halaman,
  }))

  return (
    // Kolom, bukan baris: Sidebar dan konten berdampingan di dalam satu baris,
    // lalu footer jadi saudara baris itu — supaya latarnya melebar penuh
    // selebar layar, ikut menutupi kolom di bawah Sidebar.
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <div className="flex flex-1">
        {/* Disembunyikan di bawah lg: di layar sempit Navbar sudah menyediakan
            panel navigasinya sendiri, jadi dua navigasi akan bertumpuk. */}
        <div className="hidden lg:block">
          <Sidebar
            logo={
              <img src={asset('/images/stasi-logo.svg')} alt="STASI" className="h-8 w-auto" />
            }
            /*
             * Logo ringkas memakai `stasi.svg` — mark 350×335 yang sama dengan
             * rail situs dokumentasi. Sebelumnya `images/s.svg`, dan itu gambar
             * 1440×810: dipaksa masuk kotak 32×32 ia gepeng, bukan mengecil.
             */
            collapsedLogo={<img src={asset('/stasi.svg')} alt="STASI" className="size-8" />}
            items={menu}
            user={{ name: 'Yermi Rachman', profileLabel: 'Administrator' }}
            collapsed={ringkas}
            onCollapse={() => setRingkas((v) => !v)}
            /*
             * Catatan status di kaki Sidebar. Ditaruh di dalam navigasinya, bukan
             * di halaman pintu masuk, supaya ia terbaca justru saat orang sedang
             * menatap menu yang dimaksud — termasuk yang membuka rute ini langsung
             * lewat URL tanpa lewat halaman Example.
             *
             * Saat ringkas, kalimatnya diganti satu kata: 72px tidak cukup untuk
             * teks sepanjang itu, dan memaksanya masuk cuma menghasilkan tumpukan
             * baris satu-dua huruf. Keterangan penuhnya tetap ada di `title`.
             */
            footer={
              <p
                title="Tampilan menu di sidebar ini masih tentatif dan bisa berubah."
                className="px-4 py-3 text-center text-[11px] leading-4 text-gray-500"
              >
                {ringkas ? (
                  <span className="font-bold text-yellow-600">TBD</span>
                ) : (
                  <>
                    <span className="font-bold text-yellow-600">Catatan:</span> susunan menu di
                    sidebar ini masih tentatif dan bisa berubah.
                  </>
                )}
              </p>
            }
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            brand={<span className="text-sm font-black text-content">STASI</span>}
            brandLabel="STASI — Dasbor"
            items={RUTE.map(({ halaman: h }) => ({
              id: h,
              label: JUDUL_HALAMAN[h],
              href: href(h),
              active: h === halaman,
            }))}
            search={{ onSubmit: () => undefined, placeholder: 'Cari pengajuan, pemohon ...' }}
            user={{ name: 'Yermi Rachman', initials: 'YR' }}
            notification={{ unread: 3, onClick: () => undefined }}
          />

          <main className="flex-1">
            <div className="border-b border-border bg-white">
              <Container>
                <div className="py-6">
                  <Breadcrumb
                    items={[
                      { label: 'Beranda', href: href('dasbor'), icon: <Home className="size-4" /> },
                      { label: JUDUL_HALAMAN[halaman] },
                    ]}
                  />
                </div>
              </Container>

              {/* Hero hanya di Dasbor: di halaman kerja ia hanya akan mendorong
                  isi yang penting ke bawah lipatan. */}
              {halaman === 'dasbor' ? (
                <Hero
                  heading="Portal Layanan Terpadu"
                  subHeading="Satu pintu untuk seluruh layanan"
                  description="Ajukan, pantau, dan selesaikan permohonan tanpa perlu datang ke kantor. Seluruh antarmuka di halaman ini dirakit dari komponen @stasi/design-kit-react."
                  buttonLabel="Lihat pengajuan"
                  buttonHref={href('pengajuan')}
                  image={asset('/images/hero-sample.svg')}
                  imageAlt=""
                />
              ) : (
                <Container>
                  <div className="pb-8">
                    <h1 className="text-heading-2 font-black text-gray-900">
                      {JUDUL_HALAMAN[halaman]}
                    </h1>
                    <p className="mt-2 max-w-2xl text-body-sm text-gray-500">{DESKRIPSI[halaman]}</p>
                  </div>
                </Container>
              )}
            </div>

            <Container>
              <div className="py-10">
                <Isi halaman={halaman} />
              </div>
            </Container>
          </main>
        </div>
      </div>

      <DemoFooter />
    </div>
  )
}
