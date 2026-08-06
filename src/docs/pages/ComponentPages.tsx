import { useState, type ReactNode } from 'react'
import { Badge, Button, Card, Container, Navbar, type NavbarItem } from '../../lib'
import { DocHero } from '../DocHero'
import { DocUsage } from '../DocUsage'

/* ---------- Overview ---------- */

const overviewItems = [
  { name: 'Container', route: '/components/container', desc: 'Pembungkus lebar konten yang konsisten.' },
  { name: 'Button', route: '/components/button', desc: 'Aksi dengan empat varian.' },
  { name: 'Badge', route: '/components/badge', desc: 'Label status ringkas.' },
  { name: 'Card', route: '/components/card', desc: 'Kartu konten fleksibel.' },
  { name: 'Navbar', route: '/components/navbar', desc: 'Navigasi responsif untuk guest dan pengguna terautentikasi.' },
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

function Preview({ children }: { children: ReactNode }) {
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
  children: ReactNode
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

/* ---------- Navbar ---------- */

const twoMenuItems: NavbarItem[] = [
  { id: 'home', label: 'Beranda', href: '#/' },
  { id: 'components', label: 'Komponen', href: '#/components' },
]

const fiveMenuItems: NavbarItem[] = [
  ...twoMenuItems,
  { id: 'colors', label: 'Warna', href: '#/foundations/colors' },
  { id: 'typography', label: 'Tipografi', href: '#/foundations/typography' },
  { id: 'icons', label: 'Ikon', href: '#/foundations/icons' },
]

const submenuItems: NavbarItem[] = [
  { id: 'home', label: 'Beranda', href: '#/' },
  {
    id: 'foundations',
    label: 'Foundations',
    children: [
      { id: 'colors', label: 'Warna', href: '#/foundations/colors' },
      { id: 'typography', label: 'Tipografi', href: '#/foundations/typography' },
    ],
  },
]

const accountItems = [
  { id: 'profile', label: 'Profil', href: '#/profile' },
  { id: 'settings', label: 'Pengaturan', href: '#/settings' },
]

function DemoBrand() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-8 grid-cols-2 gap-0.5 rounded-md bg-primary-700 p-1.5">
        <span className="rounded-sm bg-white" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-white" />
      </span>
      <span className="text-sm font-black tracking-tight text-content">KOMDIGI</span>
    </span>
  )
}

function NavbarShowcase({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <div>
        <h2 className="text-heading-4 font-black text-content">{title}</h2>
        {note && <p className="mt-1 text-body-sm text-content-subtle">{note}</p>}
      </div>
      <div className="overflow-visible rounded-lg border border-border bg-gray-900 p-2">{children}</div>
    </section>
  )
}

export function NavbarPage() {
  const [searchValue, setSearchValue] = useState('')
  const [lastQuery, setLastQuery] = useState('Belum ada pencarian')
  const [mobileGuestOpen, setMobileGuestOpen] = useState(false)
  const [mobileUserOpen, setMobileUserOpen] = useState(false)

  const brand = <DemoBrand />
  const guestActions = {
    login: { label: 'Masuk', href: '#/login' },
    register: { label: 'Daftar', href: '#/register' },
  }

  return (
    <Page
      eyebrow="Components · Navbar"
      title="Navbar"
      description="Navigasi responsif dengan search, submenu satu tingkat, guest actions, notification, dan account menu."
    >
      <div className="space-y-10">
        <NavbarShowcase title="Desktop Guest" note={`Controlled search · ${lastQuery}`}>
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={fiveMenuItems}
            activeHref="#/components"
            search={{
              value: searchValue,
              onValueChange: setSearchValue,
              onSubmit: (query) => setLastQuery(`Query terakhir: ${query}`),
              label: 'Cari civitas atau organisasi',
              placeholder: 'Cari Civitas, Organisasi ...',
            }}
            guestActions={guestActions}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Desktop Authenticated">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={fiveMenuItems}
            user={{ name: 'User Komdigi', initials: 'UK', items: accountItems }}
            notification={{ unread: true, href: '#/notifications' }}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Mobile Guest" note="Gunakan viewport di bawah 1024 px. Contoh memakai controlled mobile state.">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={submenuItems}
            search={{ defaultValue: '', onSubmit: () => undefined, placeholder: 'Cari ...' }}
            guestActions={guestActions}
            mobileOpen={mobileGuestOpen}
            onMobileOpenChange={setMobileGuestOpen}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Mobile Authenticated" note="Avatar, notification, dan account items tersedia pada composition mobile.">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={submenuItems}
            user={{ name: 'User Mobile', initials: 'UM', items: accountItems }}
            notification={{ unread: 8, href: '#/notifications' }}
            mobileOpen={mobileUserOpen}
            onMobileOpenChange={setMobileUserOpen}
          />
        </NavbarShowcase>

        <NavbarShowcase title="2 Menu">
          <Navbar brand={brand} brandLabel="KOMDIGI — Beranda" items={twoMenuItems} />
        </NavbarShowcase>

        <NavbarShowcase title="5 Menu">
          <Navbar brand={brand} brandLabel="KOMDIGI — Beranda" items={fiveMenuItems} />
        </NavbarShowcase>

        <NavbarShowcase title="Submenu">
          <Navbar brand={brand} brandLabel="KOMDIGI — Beranda" items={submenuItems} />
        </NavbarShowcase>

        <NavbarShowcase title="Active dan Disabled Item">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={[
              { id: 'active', label: 'Aktif eksplisit', href: '#/active', active: true },
              { id: 'disabled', label: 'Tidak tersedia', href: '#/disabled', disabled: true },
            ]}
            activeHref="#/disabled"
          />
        </NavbarShowcase>

        <NavbarShowcase title="Without Search">
          <Navbar brand={brand} brandLabel="KOMDIGI — Beranda" items={twoMenuItems} guestActions={guestActions} />
        </NavbarShowcase>

        <NavbarShowcase title="Without Guest Actions">
          <Navbar brand={brand} brandLabel="KOMDIGI — Beranda" items={fiveMenuItems} />
        </NavbarShowcase>

        <NavbarShowcase title="Notification — Boolean Unread">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={twoMenuItems}
            user={{ name: 'Boolean User', initials: 'BU' }}
            notification={{ unread: true, onClick: () => undefined }}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Notification — Numeric Count">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={twoMenuItems}
            user={{ name: 'Count User', initials: 'CU' }}
            notification={{ unread: 125, href: '#/notifications' }}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Avatar Fallback">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={twoMenuItems}
            user={{ name: 'Nama Pengguna', items: accountItems }}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Long Menu Label">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={[
              { id: 'long', label: 'Menu dengan label sangat panjang untuk menguji batas layout', href: '#/long' },
              { id: 'short', label: 'Menu ringkas', href: '#/short' },
            ]}
          />
        </NavbarShowcase>

        <NavbarShowcase title="Long Username">
          <Navbar
            brand={brand}
            brandLabel="KOMDIGI — Beranda"
            items={twoMenuItems}
            user={{ name: 'Nama Pengguna Sangat Panjang untuk Pengujian Layout Navbar', items: accountItems }}
          />
        </NavbarShowcase>

        <section className="space-y-3">
          <h2 className="text-heading-4 font-black text-content">Props utama</h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-subtle text-content">
                <tr><th className="p-3">Prop</th><th className="p-3">Keterangan</th></tr>
              </thead>
              <tbody className="divide-y divide-border text-content-subtle">
                <tr><td className="p-3 font-bold text-content">brand, brandLabel</td><td className="p-3">Konten brand dan accessible name.</td></tr>
                <tr><td className="p-3 font-bold text-content">items</td><td className="p-3">Link atau submenu maksimal satu tingkat.</td></tr>
                <tr><td className="p-3 font-bold text-content">search</td><td className="p-3">Search submit biasa, controlled atau uncontrolled.</td></tr>
                <tr><td className="p-3 font-bold text-content">guestActions</td><td className="p-3">Action login dan register.</td></tr>
                <tr><td className="p-3 font-bold text-content">user, notification</td><td className="p-3">Authenticated composition dan unread state.</td></tr>
                <tr><td className="p-3 font-bold text-content">mobileOpen</td><td className="p-3">Controlled mobile panel; gunakan defaultMobileOpen untuk uncontrolled.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="ds-card space-y-3 p-5 text-sm leading-6 text-content-subtle">
          <h2 className="text-heading-4 font-black text-content">Accessibility dan responsive</h2>
          <p>Navbar memakai landmark header/nav/search, aria-current untuk link aktif, serta aria-expanded dan aria-controls untuk disclosure.</p>
          <p>Desktop dimulai pada breakpoint lg. Di bawah lg, hamburger membuka panel vertikal inline yang bukan modal, tanpa backdrop, scroll lock, atau focus trap.</p>
          <p>Avatar, Dropdown, Search Form, dan notification control saat ini masih berupa implementasi internal sementara dan bukan public API package.</p>
        </section>

        <DocUsage
          code={`<Navbar
  brand={<Logo />}
  brandLabel="KOMDIGI — Beranda"
  items={[
    { id: 'home', label: 'Beranda', href: '/' },
    { id: 'about', label: 'Tentang', href: '/tentang' },
  ]}
  search={{ onSubmit: (query) => console.log(query) }}
  guestActions={{
    login: { label: 'Masuk', href: '/login' },
    register: { label: 'Daftar', href: '/register' },
  }}
/>`}
        />
      </div>
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
