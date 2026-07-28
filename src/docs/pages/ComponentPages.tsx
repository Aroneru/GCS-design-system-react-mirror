import { Badge, Button, Card, Container } from '../../lib'
import { DocHero } from '../DocHero'
import { DocUsage } from '../DocUsage'

/* ---------- Overview ---------- */

const overviewItems = [
  { name: 'Container', route: '/components/container', desc: 'Pembungkus lebar konten yang konsisten.' },
  { name: 'Button', route: '/components/button', desc: 'Aksi dengan empat varian.' },
  { name: 'Badge', route: '/components/badge', desc: 'Label status ringkas.' },
  { name: 'Card', route: '/components/card', desc: 'Kartu konten fleksibel.' },
  { name: 'Footer', route: '/components/footer', desc: 'Footer dengan menu & media sosial.' },
]

export function ComponentsOverview() {
  return (
    <>
      <DocHero
        eyebrow="Components · Overview"
        title="Components"
        description="Komponen React siap pakai dari @tpl/design-kit-react — props sepadan dengan versi Blade."
      />
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {overviewItems.map((c) => (
            <Card key={c.name} title={c.name} description={c.desc} href={`#${c.route}`} linkLabel="Buka" className="transition-shadow hover:shadow-md" />
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------- Layout bantu halaman komponen ---------- */

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-card flex flex-wrap items-center gap-4 p-8">{children}</div>
  )
}

function Page({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">{children}</div>
    </>
  )
}

/* ---------- Button ---------- */

export function ButtonPage() {
  return (
    <Page eyebrow="Components · Button" title="Button" description="Empat varian: primary, secondary, danger, ghost. Bisa dirender sebagai <button> atau <a> lewat prop as.">
      <Preview>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </Preview>
      <DocUsage
        code={`<Button variant="primary">Simpan</Button>
<Button variant="secondary">Batal</Button>
<Button variant="danger">Hapus</Button>
<Button as="a" href="/docs">Pelajari</Button>`}
      />
    </Page>
  )
}

/* ---------- Badge ---------- */

export function BadgePage() {
  return (
    <Page eyebrow="Components · Badge" title="Badge" description="Label status ringkas dengan lima varian warna.">
      <Preview>
        <Badge variant="gray">Gray</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="success">Success</Badge>
      </Preview>
      <DocUsage
        code={`<Badge variant="success">Aktif</Badge>
<Badge variant="warning">Menunggu</Badge>
<Badge variant="danger">Ditolak</Badge>`}
      />
    </Page>
  )
}

/* ---------- Card ---------- */

export function CardPage() {
  return (
    <Page eyebrow="Components · Card" title="Card" description="Kartu fleksibel — gabungkan gambar, judul, deskripsi, tautan, atau tombol aksi.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Dengan tautan" description="Varian dasar dengan judul, deskripsi, dan tautan aksi." href="#" linkLabel="Selengkapnya" />
        <Card
          title="Dengan aksi"
          description="Bagian actions menerima elemen apa pun, mis. tombol."
          actions={
            <>
              <Button variant="primary">Setuju</Button>
              <Button variant="ghost">Nanti</Button>
            </>
          }
        />
        <Card title="Dengan konten bebas" description="Card bisa memuat children apa pun.">
          <div className="flex gap-2">
            <Badge variant="brand">Baru</Badge>
            <Badge variant="warning">Beta</Badge>
          </div>
        </Card>
      </div>
      <DocUsage
        code={`<Card
  title="Judul kartu"
  description="Deskripsi singkat kartu."
  href="/detail"
  linkLabel="Selengkapnya"
/>

<Card title="Konfirmasi" description="..." actions={
  <Button variant="primary">Setuju</Button>
} />`}
      />
    </Page>
  )
}

/* ---------- Container ---------- */

export function ContainerPage() {
  return (
    <Page eyebrow="Components · Container" title="Container" description="Pembungkus lebar konten yang konsisten: max 1126px di desktop, 380px + rounded di mobile.">
      <div className="ds-card overflow-hidden p-4">
        <Container className="rounded-lg border border-dashed border-primary-300 bg-primary-50 py-8 text-center">
          <p className="text-sm font-bold text-primary-700">Konten di dalam Container</p>
          <p className="mt-1 text-xs text-gray-500">Lebar & padding mengikuti breakpoint.</p>
        </Container>
      </div>
      <DocUsage
        code={`<Container>
  <h1>Judul halaman</h1>
  <p>Konten utama...</p>
</Container>

{/* Render sebagai elemen lain */}
<Container as="section">...</Container>`}
      />
    </Page>
  )
}

/* ---------- Footer ---------- */

export function FooterPage() {
  return (
    <Page eyebrow="Components · Footer" title="Footer" description="Footer dengan logo, menu navigasi, hak cipta, dan ikon media sosial. Lihat contoh live di bagian bawah halaman Home.">
      <DocUsage
        code={`<Footer
  logo="/logo.svg"
  menus={[
    { label: 'Foundations', url: '/foundations' },
    { label: 'Components', url: '/components' },
  ]}
  copyright="© 2025 Kementerian Komunikasi dan Digital"
  socials={[
    { label: 'Instagram', url: '#', icon: <InstagramIcon /> },
    { label: 'X', url: '#', icon: <XIcon /> },
  ]}
/>`}
      />
    </Page>
  )
}

/* ---------- Placeholder foundation pages ---------- */

export function PlaceholderPage({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <Page eyebrow={eyebrow} title={title} description="Halaman ini menyusul — token dasarnya sudah tersedia di stylesheet.">
      <div className="ds-card grid place-items-center p-14 text-center">
        <p className="text-sm font-bold text-gray-500">Segera hadir</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
          Konten dokumentasi untuk “{title}” belum diporting. Token/utility-nya sudah bisa dipakai langsung.
        </p>
      </div>
    </Page>
  )
}
