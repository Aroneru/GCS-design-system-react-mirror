import type { ReactNode } from 'react'
// Footer tidak diimpor: DocsLayout sudah memasangnya untuk seluruh halaman.
import { Badge, Button, Card, Checkbox, Container, InputField, Toggle } from '../../lib'
import * as OutlineIcons from '../../lib/icons/outline'
import * as SolidIcons from '../../lib/icons/solid'
import { brandIcons } from '../../lib/brandIconRegistry'
import { sidebars } from '../navigation'
import { DocUsage } from '../DocUsage'
import { G, H } from '../pageKit'
import { useCopy } from '../useCopy'

const INSTALL = 'npm install @tpl/design-kit-react'

/**
 * Angka pada halaman ini diturunkan dari sumber aslinya — daftar navigasi dan
 * modul ikon — supaya tidak pernah basi saat halaman baru ditambahkan.
 */
const countLeaves = (key: string) =>
  sidebars[key].items
    .filter((i) => i.label !== 'Overview' && !i.soon)
    .reduce((n, i) => n + (i.children?.length ?? 1), 0)

/** Logo brand sudah termasuk di dalam set solid/outline, jadi tidak dijumlah lagi. */
const iconTotal = Object.keys(OutlineIcons).length + Object.keys(SolidIcons).length

const stats: [string, string, string][] = [
  [String(countLeaves('components')), 'Komponen', 'Siap pakai dari satu package'],
  [String(countLeaves('form')), 'Elemen form', 'Input, select, radio, toggle, checkbox'],
  [String(countLeaves('foundations')), 'Foundations', 'Warna, tipografi, spacing, dan lainnya'],
  [String(iconTotal), 'Ikon', `Set solid dan outline, plus ${brandIcons.length} logo brand`],
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

function CodeWindow() {
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

      <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-3 bg-gray-800/70 px-4 py-3">
          <WindowDots />
          <span className="ml-1 inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1">
            <span className="font-mono text-[11px] font-black text-yellow-300">TSX</span>
            <span className="text-xs font-bold text-gray-200">beranda.tsx</span>
          </span>
        </div>

        <pre className="ds-scroll-x overflow-x-auto p-5 font-mono text-xs leading-6 text-gray-300 sm:p-6">
          <code>
            <H>{'<h3>'}</H>
            Tulis sekali. Pakai di mana saja.
            <H>{'</h3>'}</H>
            {'\n'}
            <H>{'<p '}</H>
            <A>className</A>
            {'='}
            <G>{'"text-body-sm text-gray-500"'}</G>
            <H>{'>'}</H>
            {'\n  Token Foundations → Tailwind v4\n'}
            <H>{'</p>'}</H>
            {'\n\n'}
            <H>{'<Select'}</H>
            {'\n  '}
            <A>label</A>
            {'='}
            <G>{'"Pilih aplikasi"'}</G>
            {'\n  '}
            <A>options</A>
            {'={['}
            <G>{"'default'"}</G>
            {', '}
            <G>{"'simaya'"}</G>
            {']}\n'}
            <H>{'/>'}</H>
          </code>
        </pre>
      </div>
    </div>
  )
}

/* ---------- Bagian kecil ---------- */

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
  return (
    <div className={`mb-8 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className="ds-eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-heading-2 font-black tracking-tight text-gray-900">{title}</h2>
      {children && <p className="mt-3 text-body-sm leading-6 text-gray-500">{children}</p>}
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
    <a
      href={`#${route}`}
      className={`ds-card group flex flex-col gap-4 p-5 transition-shadow hover:shadow-md ${
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
    </a>
  )
}

export function HomePage() {
  const [copied, copy] = useCopy(INSTALL)

  return (
    <>
      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50 via-white to-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-14">
        {/* Dua bulatan kabur sebagai latar — dekoratif sepenuhnya. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-40 size-[28rem] rounded-full bg-purple-200/40 blur-3xl"
        />

        <Container padded={false} className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">React · Vite</Badge>
                <Badge variant="gray">Tailwind CSS v4</Badge>
                <Badge variant="success">v0.1.0</Badge>
              </div>

              <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-black tracking-tight text-gray-900">
                Menyatukan layanan digital lewat desain dan kode
              </h1>
              <p className="mt-5 max-w-xl text-body-lg text-gray-600">
                Satu sumber visual dan komponen yang konsisten untuk membangun layanan yang jelas,
                inklusif, dan mudah dikenali. Token, komponen, dan dokumentasinya tinggal dipakai — tidak
                perlu dirancang ulang tiap proyek.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button as="a" href="#/components" variant="filled">
                  Mulai pakai
                </Button>
                <Button as="a" href="#/foundations" variant="outline">
                  Lihat Foundations
                </Button>
              </div>

              {/* Perintah pasang dengan tombol salin */}
              <button
                type="button"
                onClick={copy}
                className="mt-4 inline-flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                aria-label={copied ? 'Perintah tersalin' : `Salin perintah: ${INSTALL}`}
              >
                <span className="text-gray-400">$</span>
                <span>{INSTALL}</span>
                <span className={`text-xs font-bold ${copied ? 'text-green-600' : 'text-gray-400'}`}>
                  {copied ? 'Tersalin!' : 'Salin'}
                </span>
              </button>
            </div>

            <CodeWindow />
          </div>
        </Container>
      </section>

      {/* ══ Angka ringkas ══ */}
      <section className="border-b border-border bg-surface">
        <Container className="py-8">
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map(([value, label, desc]) => (
              <div key={label}>
                <dd className="text-heading-2 font-black tracking-tight text-primary-700">{value}</dd>
                <dt className="mt-1 text-sm font-black text-gray-900">{label}</dt>
                <p className="mt-1 text-xs leading-5 text-gray-500">{desc}</p>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ══ Rancang sekali ══ */}
      <Container className="py-12 lg:py-16">
        <SectionTitle center eyebrow="Prinsip" title="Rancang sekali, pakai di mana saja">
          Empat keputusan yang membuat design kit ini tetap konsisten saat dipakai banyak tim sekaligus.
        </SectionTitle>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="ds-card p-6">
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
            </article>
          ))}
        </div>
      </Container>

      {/* ══ Komponen hidup ══ */}
      <section className="border-y border-border bg-surface-subtle">
        <Container className="py-12 lg:py-16">
          <SectionTitle eyebrow="Komponen" title="Semuanya sungguhan, bukan gambar">
            Yang tampil di bawah ini adalah komponen yang benar-benar dirender dari{' '}
            <code className="text-xs font-bold text-gray-700">@tpl/design-kit-react</code> — sama persis
            dengan yang akan kamu impor. Klik untuk membuka playground-nya.
          </SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </Container>
      </section>

      {/* ══ Mulai cepat ══ */}
      <Container className="py-12 lg:py-16">
        <SectionTitle eyebrow="Mulai cepat" title="Tiga baris untuk komponen pertama">
          Pasang package-nya, sambungkan stylesheet-nya sekali di proyek, lalu impor komponen yang
          dibutuhkan dan pakai seperti elemen React biasa. Tidak ada provider atau konfigurasi tambahan.
        </SectionTitle>

        <DocUsage flush label="Terminal" code={INSTALL} />

        <div className="mt-5">
          <DocUsage
            flush
            label="CSS"
            code={`/* Sekali saja, di stylesheet utama proyek */
@import '@tpl/design-kit-react/styles.css';

/* Tailwind v4 perlu memindai berkas package agar
   utility yang dipakai komponen ikut ter-generate */
@source '../node_modules/@tpl/design-kit-react/dist/**/*.js';`}
          />
        </div>

        <div className="mt-5">
          <DocUsage
            flush
            code={`import { Button, Badge, InputField } from '@tpl/design-kit-react'

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
      </Container>

      {/* ══ Jelajahi ══ */}
      <section className="border-t border-border bg-surface-subtle">
        <Container className="py-12 lg:py-16">
          <SectionTitle eyebrow="Jelajahi" title="Mulai dari mana?">
            Empat pintu masuk, tergantung yang sedang kamu kerjakan.
          </SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2">
            {sections.map((s) => (
              <a
                key={s.route}
                href={`#${s.route}`}
                className="ds-card group flex flex-col p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-heading-4 font-black text-gray-900">{s.name}</h3>
                  <Badge variant="gray">{s.badge}</Badge>
                </div>
                <p className="mt-2 flex-1 text-body-sm leading-6 text-gray-500">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Buka
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
