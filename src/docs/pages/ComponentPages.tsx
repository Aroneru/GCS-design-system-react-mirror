import { useState, type ReactNode } from 'react'
import { Badge, Button, Card, Footer } from '../../lib'
import { DocHero } from '../DocHero'
import { DocExample } from '../DocExample'
import { PropsTable, type PropRow } from '../PropsTable'
import { DocUsage } from '../DocUsage'
import { MessagesIcon } from '../rawIcons'
import { FacebookIcon, InstagramIcon, XIcon } from '../socialIcons'

/* ---------- Layout bantu halaman komponen ---------- */

/** Kerangka halaman komponen: hero + kolom konten ber-`space-y-10`. */
function Page({
  title,
  description,
  children,
  eyebrow = 'Components',
}: {
  title: string
  description: string
  children: ReactNode
  eyebrow?: string
}) {
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl space-y-10 px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        {children}
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-heading-3 font-black text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

/**
 * Blok kode section "Penggunaan" — memakai DocUsage yang sama dengan halaman
 * Foundations, supaya header bar + tombol salinnya konsisten di seluruh docs.
 * `flush` dipakai karena jarak atas sudah diatur oleh <Section>.
 */
function CodeBlock({ children }: { children: ReactNode }) {
  return <DocUsage code={children} flush />
}

/** Penyorot potongan kode, menggantikan <span class="text-primary-300"> di Blade. */
const H = ({ children }: { children: ReactNode }) => (
  <span className="text-primary-300">{children}</span>
)
const G = ({ children }: { children: ReactNode }) => (
  <span className="text-green-300">{children}</span>
)

/** Kelompok tombol pilihan (segmented control) — port dari kontrol Alpine. */
function Segmented<T extends string | number | boolean>({
  label,
  value,
  onChange,
  options,
  itemClassName = 'px-3',
  wrap,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; icon?: string }[]
  itemClassName?: string
  wrap?: boolean
}) {
  return (
    <div
      className={`inline-flex rounded-lg border border-border bg-surface p-1 ${wrap ? 'flex-wrap' : ''}`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-2 rounded-md py-1.5 text-sm font-bold transition-colors ${itemClassName} ${
            value === o.value ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-pressed={value === o.value}
        >
          {o.icon && (
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={o.icon} />
            </svg>
          )}
          {o.label}
        </button>
      ))}
    </div>
  )
}

const ControlLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-xs font-black tracking-wide text-gray-500 uppercase">{children}</span>
)

/* ---------- Overview ---------- */

const ArrowRight = () => (
  <svg
    className="size-4 transition-transform group-hover:translate-x-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

/** Kartu tautan pada halaman Overview: preview di atas, judul + deskripsi di bawah. */
function OverviewCard({
  route,
  name,
  desc,
  wide,
  children,
}: {
  route: string
  name: string
  desc: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <a
      href={`#${route}`}
      className={`ds-card group flex flex-col p-6 transition-shadow hover:shadow-md ${wide ? 'sm:col-span-2' : ''}`}
    >
      {children}
      <h2 className="mt-4 text-heading-4 font-black text-gray-900">{name}</h2>
      <p className="mt-1.5 text-body-sm text-gray-500">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
        Lihat detail
        <ArrowRight />
      </span>
    </a>
  )
}

export function ComponentsOverview() {
  return (
    <>
      <DocHero
        eyebrow="Components · Overview"
        title="Components"
        description="Komponen React siap pakai dari package @tpl/design-kit-react. Dipakai lewat import { Nama } from '@tpl/design-kit-react' setelah package terpasang."
      />

      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <div className="grid gap-5 sm:grid-cols-2">
          <OverviewCard
            route="/components/container"
            name="Container"
            desc="Pembungkus lebar konten: 380px di mobile (rounded), maksimum 1126px di desktop."
            wide
          >
            <div className="rounded-xl bg-surface-subtle p-5">
              <div className="mx-auto max-w-[220px] rounded-lg border-2 border-dashed border-primary-300 bg-white px-4 py-6 text-center">
                <span className="text-xs font-black text-primary-700">1126px · 380px</span>
              </div>
            </div>
          </OverviewCard>

          <OverviewCard
            route="/components/button"
            name="Button"
            desc="Aksi utama dengan empat variant: primary, secondary, danger, ghost."
          >
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle p-5">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
          </OverviewCard>

          <OverviewCard
            route="/components/badge"
            name="Badge"
            desc="Label status ringkas dengan lima variant warna semantik."
          >
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle p-5">
              <Badge variant="success">Aktif</Badge>
              <Badge variant="warning">Menunggu</Badge>
              <Badge variant="danger">Ditolak</Badge>
            </div>
          </OverviewCard>

          <OverviewCard
            route="/components/card"
            name="Card"
            desc="Wadah informasi dengan gambar, judul, deskripsi, dan aksi yang semuanya opsional."
          >
            <div className="rounded-xl bg-surface-subtle p-5">
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                <img src="/images/card-sample.svg" alt="" className="aspect-video w-full object-cover" />
                <div className="space-y-1.5 p-3">
                  <div className="h-2 w-24 rounded bg-gray-300" />
                  <div className="h-1.5 w-full rounded bg-gray-200" />
                  <div className="h-1.5 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </OverviewCard>

          <OverviewCard
            route="/components/footer"
            name="Footer"
            desc="Penutup halaman responsif dengan logo, menu, hak cipta, dan tautan media sosial."
            wide
          >
            <div className="overflow-hidden rounded-xl">
              <div className="flex items-center justify-between gap-4 bg-gray-800 px-5 py-4">
                <img src="/images/komdigi-logo.svg" alt="Komdigi" className="h-7 w-auto" />
                <div className="hidden gap-5 text-xs text-gray-300 sm:flex">
                  <span>Menu 1</span>
                  <span>Menu 2</span>
                  <span>Menu 3</span>
                  <span>Menu 4</span>
                </div>
              </div>
            </div>
          </OverviewCard>
        </div>
      </div>
    </>
  )
}

/* ---------- Button ---------- */

const buttonProps: PropRow[] = [
  ['variant', 'string', 'primary', 'primary · secondary · danger · ghost'],
  ['as', "'button' | 'a'", 'button', "Elemen yang dirender, mis. 'a' untuk link"],
]

export function ButtonPage() {
  return (
    <Page
      title="Button"
      description="Memicu aksi utama pada sebuah halaman atau form. Empat variant untuk tingkat penekanan yang berbeda."
    >
      <Section title="Variants">
        <DocExample
          code={
            <>
              {'<Button variant="'}
              <H>primary</H>
              {'">Simpan perubahan</Button>\n'}
              {'<Button variant="secondary">Batal</Button>\n'}
              {'<Button variant="danger">Hapus</Button>\n'}
              {'<Button variant="ghost">Lewati</Button>'}
            </>
          }
        >
          <Button variant="primary">Simpan perubahan</Button>
          <Button variant="secondary">Batal</Button>
          <Button variant="danger">Hapus</Button>
          <Button variant="ghost">Lewati</Button>
        </DocExample>
      </Section>

      <Section title="States">
        <DocExample
          code={
            <>
              {'<Button variant="primary" '}
              <H>disabled</H>
              {'>Nonaktif</Button>'}
            </>
          }
        >
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>
            Nonaktif
          </Button>
        </DocExample>
      </Section>

      <Section title="Sebagai link">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Gunakan prop <code className="text-xs font-bold text-gray-700">as="a"</code> agar dirender sebagai
          anchor tanpa kehilangan gaya tombol.
        </p>
        <DocExample
          code={
            <>
              {'<Button as="'}
              <H>a</H>
              {'" href="/foundations/colors" variant="secondary">\n'}
              {'    Buka Foundations\n'}
              {'</Button>'}
            </>
          }
        >
          <Button as="a" href="#/foundations/colors" variant="secondary">
            Buka Foundations
          </Button>
        </DocExample>
      </Section>

      <Section title="Properties">
        <PropsTable rows={buttonProps} minWidth="36rem" />
      </Section>
    </Page>
  )
}

/* ---------- Badge ---------- */

const badgeProps: PropRow[] = [
  ['variant', 'string', 'gray', 'gray · brand · danger · warning · success'],
]

export function BadgePage() {
  return (
    <Page
      title="Badge"
      description="Label status ringkas untuk menandai kondisi sebuah entitas. Lima variant warna dengan makna semantik."
    >
      <Section title="Variants">
        <DocExample
          code={
            <>
              {'<Badge variant="'}
              <G>success</G>
              {'">Aktif</Badge>\n'}
              {'<Badge variant="warning">Menunggu</Badge>\n'}
              {'<Badge variant="danger">Ditolak</Badge>'}
            </>
          }
        >
          <Badge variant="gray">Draft</Badge>
          <Badge variant="brand">Baru</Badge>
          <Badge variant="success">Aktif</Badge>
          <Badge variant="warning">Menunggu</Badge>
          <Badge variant="danger">Ditolak</Badge>
        </DocExample>
      </Section>

      <Section title="Dalam konteks">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Badge biasanya menyertai judul, baris tabel, atau kartu untuk menandai status tanpa memakan banyak
          ruang.
        </p>
        <DocExample>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
            Pengajuan izin <Badge variant="warning">Menunggu</Badge>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
            Verifikasi data <Badge variant="success">Selesai</Badge>
          </span>
        </DocExample>
      </Section>

      <Section title="Properties">
        <PropsTable rows={badgeProps} minWidth="36rem" />
      </Section>
    </Page>
  )
}

/* ---------- Card ---------- */

const cardTitle = 'Komdigi Card Desktop'
const cardDesc =
  'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'

type CardAction = 'two' | 'one' | 'link' | 'none'

const actionChoices: { value: CardAction; label: string }[] = [
  { value: 'two', label: 'Dua tombol' },
  { value: 'one', label: 'Satu tombol' },
  { value: 'link', label: 'Tautan' },
  { value: 'none', label: 'Tanpa aksi' },
]

const cardProps: PropRow[] = [
  ['image', 'string | undefined', 'undefined', 'URL gambar. Dikosongkan untuk varian tanpa gambar.'],
  ['imageAlt', 'string', "''", 'Teks alternatif gambar.'],
  ['title', 'ReactNode', 'undefined', 'Judul kartu.'],
  ['description', 'ReactNode', 'undefined', 'Deskripsi singkat.'],
  ['href', 'string | undefined', 'undefined', 'Mengaktifkan varian tautan bila diisi.'],
  ['linkLabel', 'string | undefined', 'Selengkapnya', 'Teks tautan, dipakai bersama href.'],
  ['actions', 'ReactNode', '—', 'Slot untuk satu atau beberapa tombol.'],
]

/** Tombol contoh pada kartu — meniru `<x-dk::button>Button text <x-dk::icon name="messages" />`. */
const SampleButton = ({ variant }: { variant: 'primary' | 'secondary' }) => (
  <Button variant={variant}>
    Button text <MessagesIcon />
  </Button>
)

function cardActions(action: CardAction): ReactNode {
  if (action === 'two')
    return (
      <>
        <SampleButton variant="secondary" />
        <SampleButton variant="primary" />
      </>
    )
  if (action === 'one') return <SampleButton variant="primary" />
  return undefined
}

export function CardPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')
  const [hasImage, setHasImage] = useState(true)
  const [action, setAction] = useState<CardAction>('two')

  return (
    <Page
      title="Card"
      description="Wadah ringkas untuk menampilkan satu unit informasi: gambar, judul, deskripsi, dan aksi. Setiap bagian bersifat opsional, sehingga seluruh varian pada desain terbentuk dari komponen yang sama."
    >
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="grid place-items-center rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div
            className={`w-full transition-[max-width] duration-300 ease-out ${
              view === 'mobile' ? 'max-w-[238px]' : 'max-w-[384px]'
            }`}
          >
            <Card
              image={hasImage ? '/images/card-sample.svg' : undefined}
              imageAlt="Suasana kerja tim"
              title={cardTitle}
              description={cardDesc}
              href={action === 'link' ? '#' : undefined}
              linkLabel={action === 'link' ? 'See our guideline' : undefined}
              actions={cardActions(action)}
            />
          </div>
        </div>

        {/* Kontrol */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <ControlLabel>Lebar</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih lebar kartu"
                value={view}
                onChange={setView}
                options={[
                  { value: 'mobile', label: 'Mobile' },
                  { value: 'desktop', label: 'Desktop' },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Gambar</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan gambar"
                value={hasImage}
                onChange={setHasImage}
                options={[
                  { value: true, label: 'Ada' },
                  { value: false, label: 'Tanpa' },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Aksi</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih jenis aksi"
                value={action}
                onChange={setAction}
                options={actionChoices}
                itemClassName="px-2.5"
                wrap
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Ukuran judul dan jarak dalam kartu memakai <em>container query</em>, sehingga menyesuaikan lebar kartu
          itu sendiri — bukan lebar layar. Kartu yang sama otomatis tampil ringkas di kolom sempit.
        </p>
      </section>

      <Section title="Varian">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Default</p>
            <Card
              image="/images/card-sample.svg"
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Tanpa gambar</p>
            <Card
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Tanpa tombol</p>
            <Card image="/images/card-sample.svg" imageAlt="" title={cardTitle} description={cardDesc} />
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Dengan tautan</p>
            <Card
              image="/images/card-sample.svg"
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              href="#"
              linkLabel="See our guideline"
            />
          </div>
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>
          {'{/* Default: gambar + judul + deskripsi + tombol */}\n'}
          {'<Card\n'}
          {'    image="/images/artikel.jpg"\n'}
          {'    imageAlt="Suasana kerja tim"\n'}
          {'    title="Komdigi Card Desktop"\n'}
          {'    description="Here are the biggest enterprise technology acquisitions of 2021."\n'}
          {'    '}
          <H>actions</H>
          {'={\n'}
          {'        <>\n'}
          {'            <Button variant="secondary">Button text</Button>\n'}
          {'            <Button variant="primary">Button text</Button>\n'}
          {'        </>\n'}
          {'    }\n'}
          {'/>\n\n'}
          {'{/* Tanpa gambar: cukup hilangkan image */}\n'}
          {'<Card title="..." description="..." />\n\n'}
          {'{/* Dengan tautan: isi href + linkLabel */}\n'}
          {'<Card\n'}
          {'    title="..."\n'}
          {'    description="..."\n'}
          {'    '}
          <H>href</H>
          {'="/panduan"\n'}
          {'    '}
          <H>linkLabel</H>
          {'="See our guideline"\n'}
          {'/>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={cardProps} />
      </Section>
    </Page>
  )
}

/* ---------- Container ---------- */

const containerProps: PropRow[] = [
  ['as', 'ElementType', 'div', 'Elemen HTML pembungkus (mis. div, section, main).'],
  ['className', 'string', '—', 'Kelas tambahan; override padding/max-width bila perlu.'],
  ['children', 'ReactNode', '—', 'Konten yang dibatasi lebarnya.'],
]

const containerSpecs: [string, string, string][] = [
  ['Mobile', '≤ 640px', 'max-w 380px · rounded-xl · padding 20px'],
  ['Tablet ke atas', '≥ 640px (sm)', 'max-w 1126px · tanpa radius · padding melebar'],
  ['Tinggi', 'Semua ukuran', 'auto — mengikuti tinggi konten'],
]

export function ContainerPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')

  return (
    <Page
      title="Container"
      description="Pembungkus yang menjaga lebar konten tetap konsisten di seluruh halaman: 380px di mobile (dengan sudut membulat) dan maksimum 1126px di desktop. Tingginya selalu mengikuti konten."
    >
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Preview</h2>

        {/* Area preview: kotak bergaris menandai batas container. */}
        <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-6">
          <div
            className={`mx-auto transition-[max-width] duration-300 ease-out ${
              view === 'mobile' ? 'max-w-[380px]' : 'max-w-[1126px]'
            }`}
          >
            <div
              className={`rounded-xl border-2 border-dashed border-primary-300 bg-surface px-5 py-8 text-center sm:px-8 ${
                view === 'mobile' ? 'rounded-xl' : 'sm:rounded-lg'
              }`}
            >
              <p className="text-sm font-black text-primary-700">Container</p>
              <p className="mt-1 text-xs text-gray-500">
                {view === 'mobile' ? 'max-w 380px · rounded-xl' : 'max-w 1126px'}
              </p>
            </div>
          </div>
        </div>

        {/* Kontrol lebar */}
        <div className="mt-4 flex items-center gap-3">
          <ControlLabel>Lebar</ControlLabel>
          <Segmented
            label="Pilih lebar container"
            value={view}
            onChange={setView}
            options={[
              { value: 'mobile', label: 'Mobile' },
              { value: 'desktop', label: 'Desktop' },
            ]}
          />
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Container hanya mengatur <em>lebar</em> dan <em>padding horizontal</em>. Jarak vertikal (mis.{' '}
          <code className="text-xs font-bold text-gray-700">py-12</code>) ditambahkan lewat kelas saat dipakai.
        </p>
      </section>

      <Section title="Spesifikasi">
        <div className="grid gap-4 sm:grid-cols-3">
          {containerSpecs.map(([title, range, detail]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1 text-xs font-bold text-primary-700">{range}</p>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">{detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>
          {'{/* Dasar: batasi lebar konten */}\n'}
          {'<Container>\n    ...\n</Container>\n\n'}
          {'{/* Tambah jarak vertikal lewat className */}\n'}
          {'<Container className="'}
          <H>py-12 lg:py-16</H>
          {'">\n    ...\n</Container>\n\n'}
          {'{/* Ganti elemen pembungkus & nol-kan padding\n'}
          {'    (mis. saat section sudah punya padding sendiri) */}\n'}
          {'<Container '}
          <H>as</H>
          {'="section" className="px-0 sm:px-0">\n    ...\n</Container>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={containerProps} />
      </Section>
    </Page>
  )
}

/* ---------- Footer ---------- */

const allMenus = [
  { label: 'Menu 1', url: '#' },
  { label: 'Menu 2', url: '#' },
  { label: 'Menu 3', url: '#' },
  { label: 'Menu 4', url: '#' },
  { label: 'Menu 5', url: '#' },
]

const footerSocials = [
  { label: 'Instagram', url: '#', icon: InstagramIcon },
  { label: 'X', url: '#', icon: XIcon },
  { label: 'Facebook', url: '#', icon: FacebookIcon },
]

const footerProps: PropRow[] = [
  ['logo', 'string | undefined', 'undefined', 'URL gambar logo. Kalau kosong, isi lewat logoContent.'],
  ['logoAlt', 'string', 'Logo', 'Teks alternatif untuk logo.'],
  ['logoContent', 'ReactNode', '—', 'Logo kustom; dipakai jika prop logo tidak diisi.'],
  ['menus', 'FooterMenu[]', '[]', "Daftar tautan: [{ label, url }, ..]"],
  ['copyright', 'ReactNode', 'undefined', 'Teks hak cipta di baris bawah.'],
  ['socials', 'FooterSocial[]', '[]', 'Ikon sosial: { label, url, icon }. icon = elemen <svg>.'],
]

const responsiveBehaviour: [string, string][] = [
  [
    'Sempit (< 768px)',
    'Logo, menu, hak cipta, dan ikon sosial tersusun bertumpuk. Menu membungkus ke baris berikutnya bila ruang kurang.',
  ],
  [
    'Lebar (≥ 768px)',
    'Logo di kiri dengan menu di tengah pada satu baris. Hak cipta di kiri, ikon sosial di kanan.',
  ],
]

export function FooterPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')
  const [menuCount, setMenuCount] = useState(4)

  return (
    <Page
      title="Footer"
      description="Penutup halaman berisi logo, navigasi ringkas, hak cipta, dan tautan media sosial. Tata letaknya mengikuti lebar footer itu sendiri, bukan lebar layar."
    >
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Preview</h2>

        {/* Area preview */}
        <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-6">
          <div
            className={`mx-auto overflow-hidden rounded-xl shadow-soft transition-[max-width] duration-300 ease-out ${
              view === 'mobile' ? 'max-w-[390px]' : 'max-w-full'
            }`}
          >
            <Footer
              logo="/images/komdigi-logo.svg"
              logoAlt="Komdigi — Kementerian Komunikasi dan Digital"
              menus={allMenus.slice(0, menuCount)}
              copyright="© 2025 Kementerian Komunikasi dan Digital"
              socials={footerSocials}
            />
          </div>
        </div>

        {/* Kontrol */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ControlLabel>Tampilan</ControlLabel>
            <Segmented
              label="Pilih lebar tampilan"
              value={view}
              onChange={setView}
              options={[
                { value: 'mobile', label: 'Mobile', icon: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h2' },
                { value: 'desktop', label: 'Desktop', icon: 'M3 5h18v11H3V5Zm6 15h6m-3-4v4' },
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <ControlLabel>Jumlah menu</ControlLabel>
            <Segmented
              label="Pilih jumlah menu"
              value={menuCount}
              onChange={setMenuCount}
              itemClassName="w-9 justify-center"
              options={[2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
            />
          </div>
        </div>

        <p className="mt-3 text-body-sm text-gray-500">
          Tata letak berubah otomatis: bertumpuk saat sempit, satu baris saat lebar. Karena komponen memakai{' '}
          <em>container query</em>, preview di atas benar-benar berganti susunan, bukan sekadar mengecil.
        </p>
      </section>

      <Section title="Perilaku responsif">
        <div className="grid gap-4 sm:grid-cols-2">
          {responsiveBehaviour.map(([title, desc]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">{desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { Instagram, X, Facebook } from './socialIcons'\n\n"}
          {'<Footer\n'}
          {'    logo="/images/komdigi-logo.svg"\n'}
          {'    logoAlt="Komdigi"\n'}
          {'    menus={[\n'}
          {"        { label: 'Menu 1', url: '/menu-1' },\n"}
          {"        { label: 'Menu 2', url: '/menu-2' },\n"}
          {'    ]}\n'}
          {'    copyright="© 2025 Kementerian Komunikasi dan Digital"\n'}
          {'    socials={[\n'}
          {"        { label: 'Instagram', url: 'https://instagram.com/komdigi', icon: "}
          <H>{'<Instagram />'}</H>
          {' },\n'}
          {"        { label: 'X',         url: 'https://x.com/komdigi',         icon: "}
          <H>{'<X />'}</H>
          {' },\n'}
          {"        { label: 'Facebook',  url: '#',                            icon: "}
          <H>{'<Facebook />'}</H>
          {' },\n'}
          {'    ]}\n'}
          {'/>'}
        </CodeBlock>
        <p className="mt-3 text-body-sm text-gray-500">
          Elemen <code className="text-xs font-bold text-gray-700">&lt;svg&gt;</code> disisipkan langsung,
          sehingga warnanya mengikuti{' '}
          <code className="text-xs font-bold text-gray-700">currentColor</code> dan bisa berubah saat hover.
        </p>
      </Section>

      <Section title="Properties">
        <PropsTable rows={footerProps} />
      </Section>
    </Page>
  )
}

/* ---------- Placeholder ---------- */

export function PlaceholderPage({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <Page
      eyebrow={eyebrow}
      title={title}
      description="Halaman ini menyusul — token dasarnya sudah tersedia di stylesheet."
    >
      <div className="ds-card grid place-items-center p-14 text-center">
        <p className="text-sm font-bold text-gray-500">Segera hadir</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
          Konten dokumentasi untuk “{title}” belum diporting. Token/utility-nya sudah bisa dipakai langsung.
        </p>
      </div>
    </Page>
  )
}
