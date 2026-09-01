import type { ReactNode } from 'react'
// Footer tidak diimpor: DocsLayout sudah memasangnya untuk seluruh halaman.
import { Badge, Button, Card, Checkbox, Container, InputField, Toggle } from '../../lib'
import * as OutlineIcons from '../../lib/icons/outline'
import * as SolidIcons from '../../lib/icons/solid'
import { brandIcons } from '../../lib/brandIconRegistry'
import { sidebars } from '../navigation'
import { asset } from '../asset'
import { DocUsage } from '../DocUsage'
import { G, H } from '../pageKit'
import { useCopy } from '../useCopy'
import {
  Aurora,
  CountUp,
  gsap,
  Magnetic,
  Reveal,
  ScrollProgress,
  SplitWords,
  SpotlightCard,
  TiltCard,
  useGsap,
} from '../motion'

const INSTALL = 'npm install @stasi/design-kit-react'

/**
 * Angka pada halaman ini diturunkan dari sumber aslinya — daftar navigasi dan
 * modul ikon — supaya tidak pernah basi saat halaman baru ditambahkan.
 */
const countLeaves = (key: string) =>
  sidebars[key].items
    .filter((i) => i.label !== 'Overview' && !i.soon && !i.alt)
    .reduce((n, i) => n + (i.children?.length ?? 1), 0)

/** Logo brand sudah termasuk di dalam set solid/outline, jadi tidak dijumlah lagi. */
const iconTotal = Object.keys(OutlineIcons).length + Object.keys(SolidIcons).length

/** Nilainya angka, bukan string, karena `CountUp` menghitung naik ke sana. */
const stats: { value: number; label: string; desc: string }[] = [
  { value: countLeaves('components'), label: 'Komponen', desc: 'Siap pakai dari satu package' },
  {
    value: countLeaves('form'),
    label: 'Elemen form',
    desc: 'Input, select, radio, toggle, checkbox',
  },
  {
    value: countLeaves('foundations'),
    label: 'Foundations',
    desc: 'Warna, tipografi, spacing, dan lainnya',
  },
  {
    value: iconTotal,
    label: 'Ikon',
    desc: `Set solid dan outline, plus ${brandIcons.length} logo brand`,
  },
]

/* ---------- Kenapa memakai design kit ini ---------- */

type Feature = { icon: string; title: string; desc: string }

const features: Feature[] = [
  {
    icon: 'M12 3.5c3.8 3.2 6.5 6 6.5 9.5a6.5 6.5 0 1 1-13 0c0-3.5 2.7-6.3 6.5-9.5Z',
    title: 'Satu sumber token',
    desc: 'Warna, jarak, radius, dan bayangan hidup di Foundations. Komponen tidak pernah memakai nilai lepas, jadi perubahan token langsung terasa di seluruh produk.',
  },
  {
    icon: 'M4 5.5h16v13H4v-13Zm5 0v13M4 10h5',
    title: 'Menyesuaikan ruangnya',
    desc: 'Card, Footer, dan Container memakai container query — tata letaknya mengikuti lebar kolom tempatnya berada, bukan lebar layar.',
  },
  {
    icon: 'M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm-3 7.5 2 2 4-4',
    title: 'Aksesibilitas bawaan',
    desc: 'Dibangun di atas elemen HTML asli, lengkap dengan label, aria-invalid, dan fokus yang terlihat — tanpa perlu ditambahkan ulang di setiap halaman.',
  },
  {
    icon: 'M4 7h16M4 12h16M4 17h10',
    title: 'Sejalan dengan Figma',
    desc: 'Setiap halaman menyebut angka aslinya — 52px, 380px, 1126px — sehingga desainer dan developer membaca spesifikasi yang sama.',
  },
]

/* ---------- Bagian yang bisa dijelajahi ---------- */

const sections: { route: string; name: string; desc: string; badge: string }[] = [
  {
    route: '/foundations',
    name: 'Foundations',
    desc: 'Warna, tipografi, spacing, border, elevation, dan ikon — dasar visual seluruh produk.',
    badge: `${countLeaves('foundations')} halaman`,
  },
  {
    route: '/components',
    name: 'Components',
    desc: 'Container, Button, Badge, Alert, Toast, Card, Navbar, dan Footer beserta playground-nya.',
    badge: `${countLeaves('components')} komponen`,
  },
  {
    route: '/form',
    name: 'Form',
    desc: 'Input field, select, radio, toggle, dan checkbox dengan state serta varian aplikasi.',
    badge: `${countLeaves('form')} elemen`,
  },
  {
    route: '/example',
    name: 'Example',
    desc: 'Satu halaman layanan utuh yang dirakit hanya dari komponen di design kit ini.',
    badge: 'Halaman utuh',
  },
]

/* ---------- Jendela kode di hero ---------- */

/**
 * Warna nama prop di dalam jendela kode. H (biru) dan G (hijau) diambil dari
 * pageKit; yang kurang hanya satu warna lagi untuk memisahkan nama prop dari
 * nilainya.
 */
const A = ({ children }: { children: ReactNode }) => (
  <span className="text-purple-300">{children}</span>
)

/** Titik-titik ala jendela macOS. */
const WindowDots = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    <span className="size-3 rounded-full bg-red-500" />
    <span className="size-3 rounded-full bg-yellow-300" />
    <span className="size-3 rounded-full bg-green-500" />
  </span>
)

/**
 * Jendela kode yang barisnya muncul berurutan dari bawah, seperti sedang
 * diketik — lalu diam. Tiap `<span data-line>` adalah satu baris logis; itulah
 * satuan yang di-stagger.
 */
function CodeWindow() {
  const ref = useGsap<HTMLDivElement>(({ q }) => {
    gsap.from(q('[data-line]'), {
      opacity: 0,
      y: 12,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.09,
      delay: 0.45,
    })

    // Kursor berkedip baru dinyalakan setelah baris terakhir mendarat, supaya
    // tidak terlihat berkedip di ruang kosong lebih dulu.
    gsap.fromTo(
      q('[data-caret]'),
      { opacity: 0 },
      { opacity: 1, duration: 0.45, repeat: -1, yoyo: true, delay: 1.5, ease: 'steps(1)' },
    )
  }, [])

  return (
    <div className="relative">
      {/*
        Cahaya ungu di belakang jendela. Ditaruh sebelum jendelanya di DOM,
        bukan dengan z-index negatif: keduanya sama-sama diposisikan, jadi
        urutan DOM yang menentukan mana yang di bawah — sedangkan z negatif
        justru akan menenggelamkannya di balik latar section.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary-400/50 via-purple-500/60 to-purple-700/70 blur-3xl sm:-inset-10"
      />

      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-white/10"
      >
        <div className="flex items-center gap-3 bg-gray-800/70 px-4 py-3">
          <WindowDots />
          <span className="ml-1 inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1">
            <span className="font-mono text-[11px] font-black text-yellow-300">TSX</span>
            <span className="text-xs font-bold text-gray-200">beranda.tsx</span>
          </span>
        </div>

        <pre className="ds-scroll-x overflow-x-auto p-5 font-mono text-xs leading-6 text-gray-300 sm:p-6">
          <code>
            <span data-line className="inline-block">
              <H>{'<h3>'}</H>
              Tulis sekali. Pakai di mana saja.
              <H>{'</h3>'}</H>
            </span>
            {'\n'}
            <span data-line className="inline-block">
              <H>{'<p '}</H>
              <A>className</A>
              {'='}
              <G>{'"text-body-sm text-gray-500"'}</G>
              <H>{'>'}</H>
            </span>
            {'\n'}
            <span data-line className="inline-block">
              {'  Token Foundations → Tailwind v4'}
            </span>
            {'\n'}
            <span data-line className="inline-block">
              <H>{'</p>'}</H>
            </span>
            {'\n\n'}
            <span data-line className="inline-block">
              <H>{'<Select'}</H>
            </span>
            {'\n'}
            <span data-line className="inline-block">
              {'  '}
              <A>label</A>
              {'='}
              <G>{'"Pilih aplikasi"'}</G>
            </span>
            {'\n'}
            <span data-line className="inline-block">
              {'  '}
              <A>options</A>
              {'={['}
              <G>{"'default'"}</G>
              {', '}
              <G>{"'simaya'"}</G>
              {']}'}
            </span>
            {'\n'}
            <span data-line className="inline-block">
              <H>{'/>'}</H>
              <span
                data-caret
                aria-hidden="true"
                className="ml-1 inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] bg-primary-300"
              />
            </span>
          </code>
        </pre>
      </div>
    </div>
  )
}

/* ---------- Bagian kecil ---------- */

/**
 * Judul section dengan kalimat pengantar yang menyala kata demi kata seiring
 * section-nya digulir melewati layar.
 *
 * Efeknya di-scrub, bukan dijalankan sekali: pembaca yang menggulir pelan
 * melihat kalimatnya terang perlahan, dan yang menggulir balik melihatnya
 * meredup lagi — gerakannya terikat pada posisi gulir, bukan pada waktu.
 *
 * Kata yang belum menyala TIDAK dibuat pucat. Versi umum efek ini berangkat
 * dari abu-abu muda seperti gray-300 (rasio ~1.6:1 di atas putih) — dan karena
 * scrub menahan kata di keadaan itu selama section masih di layar, teksnya
 * benar-benar dibaca orang dalam kondisi gagal kontras. Jadi kedua ujungnya
 * dibuat lolos WCAG AA: gray-500 (4.8:1) menyala menjadi gray-800. Yang
 * dianimasikan penekanan, bukan keterbacaan.
 */
function SectionTitle({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  center?: boolean
}) {
  const ref = useGsap<HTMLDivElement>(({ scope, q }) => {
    const words = q('[data-lit]')
    if (words.length === 0) return

    gsap.fromTo(
      words,
      { color: 'var(--color-gray-500)' },
      {
        color: 'var(--color-gray-800)',
        ease: 'none',
        stagger: 0.4,
        scrollTrigger: { trigger: scope, start: 'top 82%', end: 'bottom 55%', scrub: true },
      },
    )
  }, [children])

  return (
    <div ref={ref} className={`mb-8 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <Reveal stagger>
        <p className="ds-eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-heading-2 font-black tracking-tight text-gray-900">{title}</h2>
      </Reveal>
      {children && (
        <p className="mt-3 text-body-sm leading-6 text-gray-500">
          {/*
            Hanya string biasa yang dipecah per kata. Kalimat pengantar yang
            mengandung elemen (misalnya <code>) dibiarkan utuh — memecahnya akan
            merusak markup di dalamnya, dan tanpa `data-lit` efeknya tinggal
            dilewati begitu saja oleh setup di atas.
          */}
          {typeof children === 'string'
            ? children.split(' ').map((w, i) => (
                <span data-lit key={`${w}-${i}`}>
                  {w}{' '}
                </span>
              ))
            : children}
        </p>
      )}
    </div>
  )
}

/** Kotak demo kecil: satu komponen hidup + tautan ke halaman detailnya. */
function ShowcaseTile({
  name,
  route,
  span,
  children,
}: {
  name: string
  route: string
  span?: boolean
  children: ReactNode
}) {
  return (
    <SpotlightCard
      as="a"
      href={`#${route}`}
      className={`ds-card group flex flex-col gap-4 p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg ${
        span ? 'sm:col-span-2' : ''
      }`}
    >
      <div className="flex min-h-[92px] flex-wrap items-center gap-3 rounded-xl bg-surface-subtle p-4">
        {children}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-gray-900">{name}</span>
        <span className="text-xs font-bold text-primary-700 transition-transform group-hover:translate-x-0.5">
          Lihat →
        </span>
      </div>
    </SpotlightCard>
  )
}

/* ---------- Angka ringkas ---------- */

/**
 * Baris angka yang tiap kolomnya naik berurutan lalu berhitung dari nol.
 * Dipisah jadi komponen sendiri karena butuh scope GSAP-nya sendiri untuk
 * meng-stagger kolom-kolomnya.
 */
function StatsRow() {
  const ref = useGsap<HTMLDListElement>(({ scope, q }) => {
    gsap.from(q('[data-stat]'), {
      opacity: 0,
      y: 28,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: scope, start: 'top 88%', once: true },
    })
  }, [])

  return (
    <dl ref={ref} className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} data-stat className="group relative">
          <dd className="text-heading-2 font-black tracking-tight text-primary-700">
            <CountUp value={s.value} />
          </dd>
          <dt className="mt-1 text-sm font-black text-gray-900">{s.label}</dt>
          <p className="mt-1 text-xs leading-5 text-gray-500">{s.desc}</p>
          {/* Garis yang memanjang saat kolomnya disentuh — penanda hover yang
              tidak menggeser apa pun di sekitarnya. */}
          <span
            aria-hidden="true"
            className="mt-3 block h-0.5 w-8 origin-left scale-x-100 rounded-full bg-primary-200 transition-transform duration-500 group-hover:scale-x-[3]"
          />
        </div>
      ))}
    </dl>
  )
}

export function HomePage() {
  const [copied, copy] = useCopy(INSTALL)

  return (
    <>
      <ScrollProgress />

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50 via-white to-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-14">
        <Aurora />

        {/*
          Lencana STASI sebagai cap air di tepi kanan hero. Dekoratif penuh dan
          sengaja sangat samar — kehadirannya membangun kedalaman, bukan menuntut
          dibaca. Hanya muncul dari lebar xl ke atas, di bawah itu ia bertabrakan
          dengan jendela kode.
        */}
        <img
          src={asset('/stasi.svg')}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-40 hidden w-[38rem] opacity-[0.03] xl:block"
        />

        <Container padded={false} className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
            <div>
              <Reveal stagger className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">React · Vite</Badge>
                <Badge variant="gray">Tailwind CSS v4</Badge>
                <Badge variant="success">v0.1.0</Badge>
              </Reveal>

              <SplitWords
                as="h1"
                delay={0.15}
                text="Menyatukan layanan digital lewat desain dan kode"
                className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-black tracking-tight text-gray-900"
              />

              <Reveal delay={0.5}>
                <p className="mt-5 max-w-xl text-body-lg text-gray-600">
                  Satu sumber visual dan komponen yang konsisten untuk membangun layanan yang jelas,
                  inklusif, dan mudah dikenali. Token, komponen, dan dokumentasinya tinggal dipakai —
                  tidak perlu dirancang ulang tiap proyek.
                </p>
              </Reveal>

              <Reveal delay={0.65} className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button as="a" href="#/components" variant="filled">
                    Mulai pakai
                  </Button>
                </Magnetic>
                <Magnetic strength={12}>
                  <Button as="a" href="#/foundations" variant="outline">
                    Lihat Foundations
                  </Button>
                </Magnetic>
              </Reveal>

              {/* Perintah pasang dengan tombol salin */}
              <Reveal delay={0.75}>
                <button
                  type="button"
                  onClick={copy}
                  className="mt-4 inline-flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  aria-label={copied ? 'Perintah tersalin' : `Salin perintah: ${INSTALL}`}
                >
                  <span className="text-gray-400">$</span>
                  <span>{INSTALL}</span>
                  <span
                    className={`text-xs font-bold ${copied ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {copied ? 'Tersalin!' : 'Salin'}
                  </span>
                </button>
              </Reveal>
            </div>

            <TiltCard>
              <CodeWindow />
            </TiltCard>
          </div>
        </Container>
      </section>

      {/* ══ Angka ringkas ══ */}
      <section className="border-b border-border bg-surface">
        <Container className="py-10">
          <StatsRow />
        </Container>
      </section>

      {/* ══ Rancang sekali ══ */}
      <Container className="py-12 lg:py-16">
        <SectionTitle center eyebrow="Prinsip" title="Rancang sekali, pakai di mana saja">
          Empat keputusan yang membuat design kit ini tetap konsisten saat dipakai banyak tim
          sekaligus.
        </SectionTitle>

        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <SpotlightCard
              key={f.title}
              as="article"
              className="ds-card p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </span>
              <h3 className="mt-4 text-heading-4 font-black text-gray-900">{f.title}</h3>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">{f.desc}</p>
            </SpotlightCard>
          ))}
        </Reveal>
      </Container>

      {/* ══ Komponen hidup ══ */}
      <section className="border-y border-border bg-surface-subtle">
        <Container className="py-12 lg:py-16">
          <SectionTitle eyebrow="Komponen" title="Semuanya sungguhan, bukan gambar">
            Yang tampil di bawah ini adalah komponen yang benar-benar dirender dari{' '}
            <code className="text-xs font-bold text-gray-700">@stasi/design-kit-react</code> — sama
            persis dengan yang akan kamu impor. Klik untuk membuka playground-nya.
          </SectionTitle>

          <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ShowcaseTile name="Button" route="/components/button">
              <Button variant="filled" size="s">
                Simpan
              </Button>
              <Button variant="outline" size="s">
                Batal
              </Button>
            </ShowcaseTile>

            <ShowcaseTile name="Badge" route="/components/badge">
              <Badge variant="success">Aktif</Badge>
              <Badge variant="warning">Menunggu</Badge>
              <Badge variant="danger">Ditolak</Badge>
              <Badge variant="gray">Draf</Badge>
            </ShowcaseTile>

            <ShowcaseTile name="Checkbox & Toggle" route="/form/checkbox">
              <div className="space-y-3">
                <Checkbox label="Kirim salinan ke email" defaultChecked />
                <Toggle label="Notifikasi permohonan" defaultChecked />
              </div>
            </ShowcaseTile>

            <ShowcaseTile name="Input Field" route="/form/input-field/input" span>
              <div className="w-full max-w-sm">
                <InputField
                  label="Nama lengkap"
                  placeholder="Masukkan nama lengkap"
                  helperText="Sesuai yang tertera pada KTP."
                />
              </div>
            </ShowcaseTile>

            <ShowcaseTile name="Card" route="/components/card">
              <div className="w-full">
                <Card
                  title="Kartu ringkas"
                  description="Judul, deskripsi, dan aksi yang semuanya opsional."
                />
              </div>
            </ShowcaseTile>
          </Reveal>
        </Container>
      </section>

      {/* ══ Mulai cepat ══ */}
      <Container className="py-12 lg:py-16">
        <SectionTitle eyebrow="Mulai cepat" title="Tiga baris untuk komponen pertama">
          Pasang package-nya, sambungkan stylesheet-nya sekali di proyek, lalu impor komponen yang
          dibutuhkan dan pakai seperti elemen React biasa. Tidak ada provider atau konfigurasi
          tambahan.
        </SectionTitle>

        <Reveal>
          <DocUsage flush label="Terminal" code={INSTALL} />
        </Reveal>

        <Reveal>
          <div className="mt-5">
            <DocUsage
              flush
              label="CSS"
              code={`/* Sekali saja, di stylesheet utama proyek */
@import '@stasi/design-kit-react/styles.css';

/* Tailwind v4 perlu memindai berkas package agar
   utility yang dipakai komponen ikut ter-generate */
@source '../node_modules/@stasi/design-kit-react/dist/**/*.js';`}
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-5">
            <DocUsage
              flush
              code={`import { Button, Badge, InputField } from '@stasi/design-kit-react'

export function FormPermohonan() {
  return (
    <form className="space-y-4">
      <InputField label="Nama lengkap" placeholder="Masukkan nama lengkap" />
      <div className="flex items-center gap-3">
        <Button variant="filled">Simpan</Button>
        <Badge variant="success">Draf tersimpan</Badge>
      </div>
    </form>
  )
}`}
            />
          </div>
        </Reveal>
      </Container>

      {/* ══ Jelajahi ══ */}
      <section className="border-t border-border bg-surface-subtle">
        <Container className="py-12 lg:py-16">
          <SectionTitle eyebrow="Jelajahi" title="Mulai dari mana?">
            Empat pintu masuk, tergantung yang sedang kamu kerjakan.
          </SectionTitle>

          <Reveal stagger className="grid gap-5 sm:grid-cols-2">
            {sections.map((s) => (
              <SpotlightCard
                key={s.route}
                as="a"
                href={`#${s.route}`}
                className="ds-card group flex flex-col p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-heading-4 font-black text-gray-900">{s.name}</h3>
                  <Badge variant="gray">{s.badge}</Badge>
                </div>
                <p className="mt-2 flex-1 text-body-sm leading-6 text-gray-500">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Buka
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </SpotlightCard>
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  )
}
