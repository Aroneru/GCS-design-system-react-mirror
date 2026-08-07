import { useEffect, useRef, useState, type ReactNode } from 'react'
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

function createFigmaItems(count: number): NavbarItem[] {
  return Array.from({ length: count }, (_, index) => {
  const menuNumber = index + 1

  return {
    id: `menu-${menuNumber}`,
    label: `Menu ${menuNumber}`,
    children: [
      {
        id: `menu-${menuNumber}-overview`,
        label: `Ringkasan Menu ${menuNumber}`,
        href: `#/menu-${menuNumber}`,
      },
    ],
  }
  })
}

const figmaMenuItems = {
  2: [
    {
      id: 'menu-1',
      label: 'Menu 1',
      children: [{ id: 'menu-1-child', label: 'Submenu Menu 1', href: '#/menu-1' }],
    },
    {
      id: 'menu-2',
      label: 'Menu 2',
      children: [{ id: 'menu-2-child', label: 'Submenu Menu 2', href: '#/menu-2' }],
    },
  ] satisfies NavbarItem[],
  3: createFigmaItems(3),
  4: createFigmaItems(4),
  5: createFigmaItems(5),
}

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
      <div className="overflow-visible rounded-lg border border-border bg-surface-subtle p-2 shadow-sm">{children}</div>
    </section>
  )
}

function NavbarDesktopShowcase({ title, src }: { title: string; src: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const previewWidth = 1440
  const previewHeight = 220

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const updateScale = () => setScale(Math.min(1, wrapper.clientWidth / previewWidth))
    const observer = new ResizeObserver(updateScale)

    updateScale()
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="min-w-0 space-y-2">
      <h2 className="text-heading-4 font-black text-content">{title}</h2>
      <div
        ref={wrapperRef}
        className="relative w-full rounded-lg border border-border bg-surface shadow-sm"
        style={{ height: previewHeight * scale }}
      >
        <iframe
          title={`Preview ${title}`}
          src={src}
          className="absolute top-0 left-0 block border-0 bg-surface"
          style={{
            width: previewWidth,
            height: previewHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </section>
  )
}

function ShowcaseGroupTitle({ children }: { children: ReactNode }) {
  return <h2 className="border-b border-border pb-3 text-heading-3 font-black text-content">{children}</h2>
}

const demoGuestActions = {
  login: { label: 'Masuk', onClick: () => undefined },
  register: { label: 'Daftar', onClick: () => undefined },
}

function NavbarPreviewSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-surface"
      onClickCapture={(event) => {
        const target = event.target

        if (target instanceof Element && target.closest('a')) {
          event.preventDefault()
        }
      }}
    >
      {children}
    </div>
  )
}

function NavbarMobileShowcase({
  title,
  src,
  initialHeight,
}: {
  title: string
  src: string
  initialHeight: number
}) {
  const observerRef = useRef<ResizeObserver | null>(null)
  const [height, setHeight] = useState(initialHeight)

  useEffect(() => () => observerRef.current?.disconnect(), [])

  return (
    <NavbarShowcase
      title={title}
      note="Iframe memakai viewport mobile nyata; search tetap terlihat di luar panel."
    >
      <div className="mx-auto w-full max-w-[412px]">
        <iframe
          title={`Preview ${title}`}
          src={src}
          className="block w-full rounded-lg border-0 bg-surface"
          style={{ height }}
          onLoad={(event) => {
            observerRef.current?.disconnect()

            const navbar = event.currentTarget.contentDocument?.querySelector('header')
            if (!navbar) return

            const updateHeight = () => setHeight(Math.ceil(navbar.getBoundingClientRect().height))
            observerRef.current = new ResizeObserver(updateHeight)
            observerRef.current.observe(navbar)
            updateHeight()
          }}
        />
      </div>
    </NavbarShowcase>
  )
}

export function NavbarDesktopPreview({
  variant,
  menuCount,
}: {
  variant: 'guest' | 'no-button' | 'authenticated'
  menuCount: 2 | 3 | 4 | 5
}) {
  const [query, setQuery] = useState('')
  const authenticated = variant === 'authenticated'
  const menuPosition =
    variant === 'guest' &&
    menuCount === 2 &&
    new URLSearchParams(window.location.search).get('navbarMenuPosition') === 'left'
      ? 'left'
      : 'right'

  return (
    <NavbarPreviewSurface>
      <Navbar
        brand={<DemoBrand />}
        brandLabel="KOMDIGI — Beranda"
        items={figmaMenuItems[menuCount]}
        search={{
          value: query,
          onValueChange: setQuery,
          onSubmit: () => undefined,
          placeholder: 'Search Civitas, Organisasi ...',
        }}
        guestActions={variant === 'guest' ? demoGuestActions : undefined}
        user={authenticated ? { name: 'User Komdigi', initials: 'UK', items: accountItems } : undefined}
        notification={authenticated ? { unread: true, onClick: () => undefined } : undefined}
        menuPosition={menuPosition}
      />
    </NavbarPreviewSurface>
  )
}

export function NavbarMobilePreview({
  variant,
  open: initialOpen,
}: {
  variant: 'guest' | 'authenticated'
  open: boolean
}) {
  const [open, setOpen] = useState(initialOpen)
  const [query, setQuery] = useState('')
  const authenticated = variant === 'authenticated'

  return (
    <NavbarPreviewSurface>
      <Navbar
        brand={<DemoBrand />}
        brandLabel="KOMDIGI — Beranda"
        items={figmaMenuItems[3]}
        search={{
          value: query,
          onValueChange: setQuery,
          onSubmit: () => undefined,
          placeholder: 'Search Civitas, Organisasi ...',
        }}
        guestActions={authenticated ? undefined : demoGuestActions}
        user={authenticated ? { name: 'User Komdigi', initials: 'UK', items: accountItems } : undefined}
        notification={authenticated ? { unread: true, onClick: () => undefined } : undefined}
        onNavigate={(_, event) => event.preventDefault()}
        mobileOpen={open}
        onMobileOpenChange={setOpen}
      />
    </NavbarPreviewSurface>
  )
}

export function NavbarPage() {
  return (
    <Page
      eyebrow="Components · Navbar"
      title="Navbar"
      description="Navigasi responsif dengan search, submenu satu tingkat, guest actions, notification, dan account menu."
    >
      <div className="space-y-10">
        <ShowcaseGroupTitle>Desktop Guest</ShowcaseGroupTitle>

        <p className="text-body-sm text-content-subtle">
          Brand pada showcase masih berupa placeholder karena aset logo KOMDIGI resmi belum tersedia di repository.
        </p>

        {([5, 4, 3] as const).map((count) => (
          <NavbarDesktopShowcase
            key={`guest-${count}-button`}
            title={`${count} Menu + Button`}
            src={`#/preview/navbar/desktop-guest-${count}`}
          />
        ))}

        <NavbarDesktopShowcase
          title="2 Menu + Button — Menu Position Left"
          src="?navbarMenuPosition=left#/preview/navbar/desktop-guest-2"
        />
        <NavbarDesktopShowcase
          title="2 Menu + Button — Menu Position Right"
          src="#/preview/navbar/desktop-guest-2"
        />

        {([5, 4, 3] as const).map((count) => (
          <NavbarDesktopShowcase
            key={`guest-${count}`}
            title={`${count} Menu tanpa Button`}
            src={`#/preview/navbar/desktop-no-button-${count}`}
          />
        ))}

        <ShowcaseGroupTitle>Desktop Authenticated</ShowcaseGroupTitle>

        {([5, 4, 3] as const).map((count) => (
          <NavbarDesktopShowcase
            key={`authenticated-${count}`}
            title={`${count} Menu + User`}
            src={`#/preview/navbar/desktop-authenticated-${count}`}
          />
        ))}

        <ShowcaseGroupTitle>Mobile</ShowcaseGroupTitle>

        {(
          [
            ['Mobile Guest — Collapsed', '#/preview/navbar/mobile-guest-collapsed', 120],
            ['Mobile Guest — Panel Open', '#/preview/navbar/mobile-guest-open', 408],
            [
              'Mobile Authenticated — Collapsed',
              '#/preview/navbar/mobile-authenticated-collapsed',
              120,
            ],
            [
              'Mobile Authenticated — Panel Open',
              '#/preview/navbar/mobile-authenticated-open',
              444,
            ],
          ] satisfies Array<[string, string, number]>
        ).map(([title, src, initialHeight]) => (
          <NavbarMobileShowcase
            key={src}
            title={title}
            src={src}
            initialHeight={initialHeight}
          />
        ))}

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
                <tr><td className="p-3 font-bold text-content">menuPosition</td><td className="p-3"><code>'left' | 'right'</code>; default <code>'right'</code> dan hanya memengaruhi desktop.</td></tr>
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
          <p>Desktop dimulai pada breakpoint lg. Di bawah lg, search selalu terlihat pada baris kedua dan hamburger membuka panel vertikal inline yang bukan modal.</p>
          <p>Avatar, Dropdown, Search Form, dan notification control saat ini masih berupa implementasi internal sementara dan bukan public API package.</p>
        </section>

        <DocUsage
          code={`<Navbar
  brand={<Logo />}
  brandLabel="KOMDIGI — Beranda"
  items={[
    { id: 'menu-1', label: 'Menu 1', children: [{ id: 'overview', label: 'Ringkasan', href: '/menu-1' }] },
  ]}
  search={{ placeholder: 'Search Civitas, Organisasi ...', onSubmit: (query) => console.log(query) }}
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
