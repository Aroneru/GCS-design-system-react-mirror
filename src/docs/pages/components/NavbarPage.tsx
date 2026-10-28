import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { Bell } from 'flowbite-react-icons/solid'
import { Home, InfoCircle } from 'flowbite-react-icons/outline'
import { Drawer, Navbar, Search, type NavbarAccountItem, type NavbarPrimaryItem, type NavbarProps } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Segmented } from '../../pageKit'
import { Control, Controls, FlowSection, Lead, SectionCode, UsulanPage, type TocEntry } from '../../usulanKit'

type Identity = 'guest' | 'authenticated' | 'none'
type Theme = 'light' | 'dark'
type LabelFixture = 'normal' | 'long' | 'unbroken'
type RegressionFixture = 'default' | 'disclosure-first-current' | 'disclosure-second-current' | 'account-current' | 'account-disabled' | 'account-actions' | 'overflow-disclosure'
interface Config { platform: 'front-office' | 'back-office'; identity: Identity; menuCount: 2|3|4|5|6|7|8|9|10; disclosure: boolean; search: boolean; disabled: boolean; icons: boolean; notification: boolean; drawer: boolean; theme: Theme; labels: LabelFixture; wideBrand: boolean; fixture: RegressionFixture }

const toc: TocEntry[] = [
  { id: 'navbar', label: 'Navbar' }, { id: 'front-office', label: 'Platform' }, { id: 'back-office', label: 'Identity & Account' }, { id: 'navigation', label: 'Navigation & Disclosure' }, { id: 'slots', label: 'Search & consumer slots' }, { id: 'responsive', label: 'Responsive behavior' }, { id: 'dark-mode', label: 'Dark mode' }, { id: 'playground', label: 'Playground' }, { id: 'penggunaan', label: 'Penggunaan' }, { id: 'properties', label: 'Properties' },
]
const bool = [{ value: true, label: 'Ada' }, { value: false, label: 'Tidak Ada' }]
const widths = [375, 412, 440, 768, 1024, 1280, 1440] as const

const navbarProps: PropRow[] = [
  ['platform', "'front-office' | 'back-office'", 'required', 'Menentukan kontrak platform, bukan deteksi viewport.'],
  ['brand', 'NavbarBrand', 'required', 'Brand consumer. Pada BO desktop, Sidebar aplikasi yang merendernya.'],
  ['items', 'NavbarPrimaryItem[]', '[]', 'Destination atau disclosure satu tingkat.'],
  ['search', 'ReactNode', 'undefined', 'Slot Search milik consumer.'],
  ['guestActions', 'NavbarGuestActions', 'undefined', 'Hanya FO guest; tidak dapat dikombinasikan dengan account atau notificationTrigger.'],
  ['account', 'NavbarAccount', 'undefined', 'FO authenticated atau BO. Pada FO, tidak dapat dikombinasikan dengan guestActions.'],
  ['notificationTrigger', 'ReactNode', 'undefined', 'Hanya FO authenticated bersama account.'],
  ['mobileNavigationOpen', 'boolean', 'undefined', 'State terkontrol navigasi mobile. Jika tidak diisi, Navbar mengelola state internal.'],
  ['onMobileNavigationOpenChange', '(open: boolean) => void', 'undefined', 'Callback perubahan navigasi mobile.'],
  ['mobileDrawer', 'NavbarMobileDrawer', 'undefined', 'Hanya BO: kontrol Drawer kontekstual consumer pada mobile.'],
  ['className / HTML attributes', 'HTMLAttributes<HTMLElement>', 'undefined', 'Atribut header standar, selain children.'],
]
const supportingTypes: PropRow[] = [
  ['NavbarBrand', '{ content; href; ariaLabel }', '—', 'Brand wajib: ReactNode, tujuan link, dan nama aksesibel.'],
  ['NavbarDestination', "{ type: 'destination'; id; label; href; … }", '—', 'Item anchor; mendukung icon, current untuk aria-current, disabled, target, rel, dan onClick.'],
  ['NavbarDisclosure', "{ type: 'disclosure'; id; label; children; … }", '—', 'Grup satu tingkat dengan children: NavbarDestination[].'],
  ['NavbarAccount', '{ name; items; description?; avatarSrc?; initials? }', '—', 'Identitas dan menu account.'],
  ['NavbarAccountItem', "NavbarAccountDestination | NavbarAccountAction", '—', 'Destination atau action; keduanya mendukung tone default atau danger.'],
  ['NavbarGuestActions', '{ signIn; signUp? }', '—', 'Aksi guest; setiap link berisi label, href, dan onClick opsional.'],
  ['NavbarMobileDrawer', '{ open; onOpenChange; controls; ariaLabel? }', '—', 'Kontrak state dan aksesibilitas Drawer kontekstual BO.'],
]

function normalized(c: Config): Config { return c.platform === 'back-office' ? { ...c, identity: c.identity === 'guest' ? 'none' : c.identity, notification: false } : c }
/** Direct-preview-only consumer data used by regression acceptance; never passed to Navbar. */
function readFixture(value: string | null): RegressionFixture {
  switch (value) {
    case 'disclosure-first-current': case 'disclosure-second-current': case 'account-current': case 'account-disabled': case 'account-actions': case 'overflow-disclosure': return value
    default: return 'default'
  }
}
function Brand({ compact = false, wide = false }: { compact?: boolean; wide?: boolean }) {
  if (compact) return <img src="/images/ceplok.svg" alt="" className="size-7 shrink-0 object-contain lg:size-9" />
  return <span className={`flex h-9 ${wide ? 'w-[196px] lg:w-[240px]' : 'w-[114px] lg:w-36'} items-center gap-2 text-sm font-black tracking-wide text-content lg:h-[46px] lg:text-base`}><img src="/images/ceplok.svg" alt="" className="size-7 shrink-0 object-contain lg:size-9" /><span>{wide ? 'CEPLOK DESIGN SYSTEM' : 'CEPLOK'}</span></span>
}
function Notification() { return <a href="/notifikasi" aria-label="Buka pengaturan notifikasi" className="grid size-9 shrink-0 place-items-center rounded-lg text-content-muted transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"><Bell className="size-5" aria-hidden="true" /></a> }
function items(count: number, c: Config): NavbarPrimaryItem[] {
  const normal = ['Beranda', 'Layanan', 'Informasi', 'Bantuan', 'Kontak']
  const long = ['Beranda layanan terpadu', 'Layanan administrasi digital', 'Informasi publik dan kebijakan', 'Bantuan pengguna sistem', 'Kontak institusi']
  const unbroken = ['BerandaSangatPanjangTanpaSpasi', 'LayananAdministrasiDigitalTerpadu', 'InformasiPublikDanKebijakan', 'BantuanPenggunaSistem', 'KontakInstitusiNasional']
  const names = c.labels === 'long' ? long : c.labels === 'unbroken' ? unbroken : normal
  const disclosureIndex = c.fixture === 'overflow-disclosure' ? 7 : 1
  return Array.from({ length: count }, (_, i) => {
    const label = names[i % names.length] + (i >= names.length ? ` ${i + 1}` : '')
    const icon = c.icons ? (i % 2 ? <InfoCircle key={i} /> : <Home key={i} />) : undefined
    if (c.disclosure && i === disclosureIndex) return { id: `menu-${i}`, type: 'disclosure', label, icon, children: [{ id: 'service-summary', type: 'destination', label: 'Ringkasan layanan', href: '/layanan/ringkasan', current: c.fixture === 'disclosure-first-current' }, { id: 'service-help', type: 'destination', label: 'Bantuan layanan', href: '/layanan/bantuan', current: c.fixture === 'disclosure-second-current' }] }
    return { id: `menu-${i}`, type: 'destination', label, href: `/${i}`, icon, disabled: c.disabled && i === count - 1 }
  })
}

function Preview({ config }: { config: Config }) {
  const [feedback, setFeedback] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navItems = useMemo(() => items(config.menuCount, config), [config])
  const accountItems = useMemo<NavbarAccountItem[]>(() => [
    { id: 'profile', type: 'destination', label: 'Profil', href: '/profil', current: config.fixture === 'account-current', disabled: config.fixture === 'account-disabled' },
    ...(config.fixture === 'account-actions' ? [{ id: 'settings', type: 'action' as const, label: 'Pengaturan', onClick: () => setFeedback('Aksi demo: Pengaturan') }] : []),
    { id: 'logout', type: 'action', label: 'Logout', tone: 'danger', onClick: () => setFeedback('Aksi demo: Logout') },
  ], [config.fixture])
  const brand = { content: <Brand compact={config.platform === 'back-office'} wide={config.wideBrand} />, href: '/', ariaLabel: 'CEPLOK — Beranda' }
  const search = config.search ? <Search platform="compact" showButton={false} trigger="enter" aria-label="Cari dokumentasi" placeholder="Cari dokumentasi ..." onSearch={(v) => setFeedback(`Pencarian demo: ${v}`)} /> : undefined
  const common = { brand, items: navItems, search }
  const intercept = (e: MouseEvent<HTMLDivElement>) => { const a = e.target instanceof Element ? e.target.closest('a') : null; if (!a || a.getAttribute('aria-disabled') === 'true') return; e.preventDefault(); setFeedback(`Navigasi demo: ${a.getAttribute('aria-label') || a.textContent?.trim() || 'Tautan'}`) }
  return <div data-theme={config.theme} data-navbar-platform={config.platform} className="overflow-hidden bg-surface text-content" onClick={intercept}>
    {config.platform === 'front-office' ? (config.identity === 'authenticated' ? <Navbar platform="front-office" {...common} notificationTrigger={config.notification ? <Notification /> : undefined} account={{ name: 'User CEPLOK', initials: 'US', items: accountItems }} /> : <Navbar platform="front-office" {...common} guestActions={config.identity === 'guest' ? { signIn: { label: 'Masuk', href: '/masuk' }, signUp: { label: 'Daftar', href: '/daftar' } } : undefined} />) : <><Navbar platform="back-office" {...common} account={config.identity === 'authenticated' ? { name: 'Admin CEPLOK', initials: 'AC', items: accountItems } : undefined} mobileDrawer={config.drawer ? { open: drawerOpen, onOpenChange: setDrawerOpen, controls: 'navbar-preview-contextual-drawer', ariaLabel: 'Buka navigasi kontekstual' } : undefined} />{config.drawer && <Drawer id="navbar-preview-contextual-drawer" open={drawerOpen} onClose={() => setDrawerOpen(false)} position="right" size="s" darkMode={config.theme === 'dark'} eyebrow="Navigasi kontekstual" header={<Drawer.Title>Layanan aktif</Drawer.Title>} items={[{ id: 'overview', label: 'Ringkasan', href: '/ringkasan', onClick: () => setDrawerOpen(false) }, { id: 'settings', label: 'Pengaturan', href: '/pengaturan', onClick: () => setDrawerOpen(false) }]} />}</>}
    {feedback && <p role="status" aria-live="polite" className="border-t border-border bg-surface-subtle px-4 py-2 text-body-sm text-content-subtle">{feedback}</p>}
  </div>
}

const base = (platform: NavbarProps['platform'], identity: Identity, menuCount: Config['menuCount']): Config => normalized({ platform, identity, menuCount, disclosure: true, search: true, disabled: false, icons: true, notification: identity === 'authenticated', drawer: platform === 'back-office', theme: 'light', labels: 'normal', wideBrand: false, fixture: 'default' })
export function NavbarDesktopPreview({ variant, menuCount, platform = 'front-office' }: { variant: 'guest'|'no-button'|'authenticated'; menuCount: 2|3|4|5; platform?: NavbarProps['platform'] }) { return <Preview config={base(platform, variant === 'authenticated' ? 'authenticated' : variant === 'guest' ? 'guest' : 'none', menuCount)} /> }
export function NavbarMobilePreview({ variant, platform = 'front-office' }: { variant: 'guest'|'authenticated'; platform?: NavbarProps['platform'] }) { return <Preview config={base(platform, variant, 4)} /> }

function readConfig(): Config {
  const p = new URLSearchParams(window.location.hash.split('?')[1] ?? ''); const n = Number(p.get('items')); const fixture = readFixture(p.get('fixture'))
  const accountFixture = fixture === 'account-current' || fixture === 'account-disabled' || fixture === 'account-actions'
  return normalized({ platform: p.get('platform') === 'back-office' ? 'back-office' : 'front-office', identity: accountFixture ? 'authenticated' : p.get('identity') === 'authenticated' ? 'authenticated' : p.get('identity') === 'none' ? 'none' : 'guest', menuCount: fixture === 'overflow-disclosure' ? 10 : n >= 2 && n <= 10 ? n as Config['menuCount'] : 4, disclosure: fixture === 'overflow-disclosure' || p.get('disclosure') !== 'false', search: p.get('search') !== 'false', disabled: p.get('disabled') === 'true', icons: p.get('icons') !== 'false', notification: p.get('notification') !== 'false', drawer: p.get('drawer') !== 'false', theme: p.get('theme') === 'dark' ? 'dark' : 'light', labels: p.get('navigationLabel') === 'long' ? 'long' : p.get('navigationLabel') === 'unbroken' ? 'unbroken' : 'normal', wideBrand: p.get('brandFixture') === 'wide', fixture })
}
/** Current-source production fixture; static preview routes depend on this export. */
export function NavbarPlaygroundPreview() { return <Preview config={readConfig()} /> }

/** Docs-only fit presentation. The iframe itself retains the requested real viewport. */
function PreviewFrame({ title, src, width, height = 220, showTitle = true, loading = 'eager', dark = false, interactive = true }: { title: string; src: string; width: number; height?: number; showTitle?: boolean; loading?: 'eager' | 'lazy'; dark?: boolean; interactive?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    const update = () => setScale(Math.min(1, Math.max(0.1, content.clientWidth / width)))
    const observer = new ResizeObserver(update)
    update()
    observer.observe(content)
    return () => observer.disconnect()
  }, [width])
  return <div className="space-y-2">{showTitle && <p className="text-sm font-semibold text-content">{title}</p>}<div className={`max-w-full overflow-hidden rounded-xl border p-3 ${dark ? 'border-gray-800 bg-gray-950' : 'border-border bg-surface-subtle'}`}><div ref={contentRef}><div style={{ height: height * scale }}><iframe title={title} src={src} loading={loading} tabIndex={interactive ? 0 : -1} className={interactive ? 'block origin-top-left border-0 bg-transparent' : 'pointer-events-none block origin-top-left border-0 bg-transparent'} style={{ width, height, transform: `scale(${scale})` }} /></div></div></div></div>
}
function usageLabels(config: Config) {
  const labels = config.labels === 'long'
    ? ['Beranda layanan terpadu', 'Layanan administrasi digital', 'Informasi publik dan kebijakan', 'Bantuan pengguna sistem', 'Kontak institusi']
    : config.labels === 'unbroken'
      ? ['BerandaSangatPanjangTanpaSpasi', 'LayananAdministrasiDigitalTerpadu', 'InformasiPublikDanKebijakan', 'BantuanPenggunaSistem', 'KontakInstitusiNasional']
      : ['Beranda', 'Layanan', 'Informasi', 'Bantuan', 'Kontak']
  return Array.from({ length: config.menuCount }, (_, index) => labels[index % labels.length] + (index >= labels.length ? ` ${index + 1}` : ''))
}

function usageItemsCode(config: Config) {
  const labels = usageLabels(config)
  return labels.map((label, index) => {
    const icon = config.icons ? (index % 2 ? ' icon: <InfoCircle />,' : ' icon: <Home />,') : ''
    if (config.disclosure && index === 1) return `  { id: 'menu-${index}', type: 'disclosure', label: ${JSON.stringify(label)},${icon}\n    children: [\n      { id: 'service-summary', type: 'destination', label: 'Ringkasan layanan', href: '/layanan/ringkasan' },\n      { id: 'service-help', type: 'destination', label: 'Bantuan layanan', href: '/layanan/bantuan' },\n    ],\n  },`
    return `  { id: 'menu-${index}', type: 'destination', label: ${JSON.stringify(label)}, href: '/${index}',${icon}${config.disabled && index === config.menuCount - 1 ? ' disabled: true,' : ''} },`
  }).join('\n')
}

function PlaygroundUsageCode({ config }: { config: Config }) {
  const hasSearch = config.search
  const hasAccount = config.identity === 'authenticated'
  const hasGuestActions = config.platform === 'front-office' && config.identity === 'guest'
  const hasNotification = config.platform === 'front-office' && hasAccount && config.notification
  const hasDrawer = config.platform === 'back-office' && config.drawer
  const hasIcons = config.icons
  const darkWrapper = config.theme === 'dark'
  const itemCode = usageItemsCode(config)
  const brandLabel = config.wideBrand ? 'CEPLOK DESIGN SYSTEM' : 'CEPLOK'
  return <SectionCode flush>{hasDrawer ? "import { useState } from 'react'\n" : ''}{"import { "}{hasDrawer ? 'Drawer, ' : ''}{'Navbar'}{hasSearch ? ', Search' : ''}{', type NavbarPrimaryItem }'}{" from '@ceplok-ui/design-kit-react'\n"}{hasIcons ? "import { Home, InfoCircle } from 'flowbite-react-icons/outline'\n" : ''}{'\n'}{'const brand = {\n'}{`  content: <span>${brandLabel}</span>,\n  href: '/',\n  ariaLabel: '${brandLabel} — Beranda',\n}\n\n`}{'const items: NavbarPrimaryItem[] = [\n'}{itemCode}{'\n]\n\n'}{hasSearch ? <>{'const search = (\n  <Search platform="compact" showButton={false} trigger="enter" aria-label="Cari dokumentasi" />\n)\n\n'}</> : null}{hasGuestActions ? <>{"const guestActions = {\n  signIn: { label: 'Masuk', href: '/masuk' },\n  signUp: { label: 'Daftar', href: '/daftar' },\n}\n\n"}</> : null}{hasAccount ? <>{`const account = {\n  name: '${config.platform === 'front-office' ? 'User CEPLOK' : 'Admin CEPLOK'}',\n  initials: '${config.platform === 'front-office' ? 'US' : 'AC'}',\n  items: [\n    { id: 'profile', type: 'destination' as const, label: 'Profil', href: '/profil' },\n    { id: 'logout', type: 'destination' as const, label: 'Logout', href: '/logout', tone: 'danger' as const },\n  ],\n}\n\n`}</> : null}{hasNotification ? <>{"const notificationTrigger = <a href=\"/notifikasi\">Notifikasi</a>\n\n"}</> : null}{'export function NavbarExample() {\n'}{hasDrawer ? <>{'  const [drawerOpen, setDrawerOpen] = useState(false)\n  const contextualDrawer = {\n    open: drawerOpen,\n    onOpenChange: setDrawerOpen,\n    controls: \'reports-drawer\',\n    ariaLabel: \'Buka navigasi kontekstual\',\n  }\n\n'}</> : null}{'  return (\n'}{darkWrapper ? <>{'    <div '}<H>data-theme</H>{'="dark">\n'}</> : null}{hasDrawer ? '      <>\n' : ''}{'      <Navbar\n        '}<H>platform</H>{`="${config.platform}"\n        `}<H>brand</H>{'={brand}\n        '}<H>items</H>{'={items}\n'}{hasSearch ? <>{'        '}<H>search</H>{'={search}\n'}</> : null}{hasGuestActions ? <>{'        '}<H>guestActions</H>{'={guestActions}\n'}</> : null}{hasAccount ? <>{'        '}<H>account</H>{'={account}\n'}</> : null}{hasNotification ? <>{'        '}<H>notificationTrigger</H>{'={notificationTrigger}\n'}</> : null}{hasDrawer ? <>{'        '}<H>mobileDrawer</H>{'={contextualDrawer}\n'}</> : null}{'      />\n'}{hasDrawer ? <>{'      <Drawer\n        id="reports-drawer"\n        open={drawerOpen}\n        onClose={() => setDrawerOpen(false)}\n        position="right"\n        size="s"\n      />\n      </>\n'}</> : null}{darkWrapper ? '    </div>\n' : ''}{'  )\n}'}</SectionCode>
}

function fixtureSrc(config: Config) { return `#/preview/navbar/playground?${new URLSearchParams({ platform: config.platform, identity: config.identity, items: String(config.menuCount), disclosure: String(config.disclosure), search: String(config.search), disabled: String(config.disabled), icons: String(config.icons), notification: String(config.notification), drawer: String(config.drawer), theme: config.theme, navigationLabel: config.labels, brandFixture: config.wideBrand ? 'wide' : 'ceplok', fixture: config.fixture })}` }
function StaticExample({ title, config, width, height, children, loading = 'lazy' }: { title: string; config: Config; width: number; height: number; children: ReactNode; loading?: 'eager' | 'lazy' }) { return <section><p className="mb-2 text-sm font-black text-gray-900">{title}</p><PreviewFrame title={title} src={fixtureSrc(config)} width={width} height={height} showTitle={false} loading={loading} dark={config.theme === 'dark'} interactive={false} /><div className="mt-4"><SectionCode>{children}</SectionCode></div></section> }

export function NavbarPage() {
  const [config, setConfig] = useState<Config>(() => base('front-office', 'guest', 4)); const [width, setWidth] = useState(1440); const [customWidth, setCustomWidth] = useState('1440')
  const update = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((c) => normalized({ ...c, [key]: value }))
  const src = useMemo(() => `#/preview/navbar/playground?${new URLSearchParams({ platform: config.platform, identity: config.identity, items: String(config.menuCount), disclosure: String(config.disclosure), search: String(config.search), disabled: String(config.disabled), icons: String(config.icons), notification: String(config.notification), drawer: String(config.drawer), theme: config.theme, navigationLabel: config.labels, brandFixture: config.wideBrand ? 'wide' : 'ceplok', fixture: config.fixture })}`, [config])
  const validWidth = /^\d+$/.test(customWidth) && Number(customWidth) >= 320 && Number(customWidth) <= 2560
  // Mobile navigation uses a native dialog sized to its document viewport. Keep
  // the interactive Playground viewport usable for the Sidebar and its scroll
  // region; the compact 122px/79px static reference previews stay unchanged.
  const height = width < 1024 ? 640 : 220
  return <UsulanPage eyebrow="Components · Navbar" title="Navbar" description="Header responsif untuk Front Office dan Back Office, dibangun dari foundation Search, Button, Avatar, Dropdown, Sidebar, dan Drawer." toc={toc}>
    <FlowSection id="navbar" title="Navbar"><Lead>Navbar mengatur komposisi navigasi responsif. Consumer tetap memiliki Brand, route state, Search behavior, notification destination, dan konten Drawer.</Lead><StaticExample title="Front Office" config={base('front-office', 'guest', 4)} width={1440} height={94} loading="eager">{'<Navbar\n  '}<H>platform</H>{'="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  guestActions={guestActions}\n/>'}</StaticExample></FlowSection>
    <FlowSection id="front-office" title="Platform"><Lead>Komposisi Front Office dan Back Office memakai kontrak prop yang berbeda; keduanya dirender sebagai Navbar produksi pada viewport referensi.</Lead><div className="space-y-8"><StaticExample title="Front Office" config={base('front-office', 'guest', 4)} width={1440} height={94}>{'<Navbar\n  '}<H>platform</H>{'="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  guestActions={guestActions}\n/>'}</StaticExample><StaticExample title="Back Office" config={base('back-office', 'authenticated', 4)} width={1184} height={94}>{'<Navbar\n  '}<H>platform</H>{'="back-office"\n  brand={brand}\n  items={items}\n  search={search}\n  account={account}\n  mobileDrawer={contextualDrawer}\n/>'}</StaticExample></div></FlowSection>
    <FlowSection id="back-office" title="Identity & Account"><Lead>State identitas Front Office adalah konfigurasi consumer yang berbeda, bukan toggle dokumentasi.</Lead><div className="space-y-8"><StaticExample title="Guest" config={base('front-office', 'guest', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  '}<H>guestActions</H>{'={guestActions}\n/>'}</StaticExample><StaticExample title="Authenticated" config={base('front-office', 'authenticated', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  '}<H>account</H>{'={account}\n  '}<H>notificationTrigger</H>{'={notificationLink}\n/>'}</StaticExample><StaticExample title="No actions" config={base('front-office', 'none', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n/>'}</StaticExample></div></FlowSection>
    <FlowSection id="navigation" title="Navigation & Disclosure"><Lead>Destination memakai anchor native; Disclosure, Lainnya, dan trigger mobile memakai button native. Pada destination utama, current diteruskan sebagai aria-current; Breadcrumb menyediakan konteks halaman secara visual. Dropdown tetap menangani tampilan current untuk baris menu sesuai kontraknya. Item yang tidak muat berpindah ke Lainnya tanpa dibuang. Disclosure dan panel yang dibuka dari trigger mendukung Escape serta mengembalikan fokus ke trigger yang masih terlihat; consumer tetap menangani route transition dan current state.</Lead><div className="space-y-8"><StaticExample title="Destination" config={normalized({ ...base('front-office', 'authenticated', 4), disclosure: false })} width={1440} height={94}>{"const items = [{ id: 'beranda', "}<H>type</H>{": 'destination', label: 'Beranda', href: '/beranda' }]"}</StaticExample><StaticExample title="Disclosure" config={base('front-office', 'authenticated', 4)} width={1440} height={94}>{"const items = [{ id: 'layanan', "}<H>type</H>{": 'disclosure', label: 'Layanan', "}<H>children</H>{": destinations }]"}</StaticExample><StaticExample title="Disabled" config={normalized({ ...base('front-office', 'authenticated', 4), disclosure: false, disabled: true })} width={1440} height={94}>{"const items = [{ id: 'bantuan', type: 'destination', label: 'Bantuan', href: '/bantuan', "}<H>disabled</H>{': true }]'} </StaticExample></div><p className="mt-4 text-body-sm text-content-muted">Gunakan ariaLabel yang bermakna untuk Brand dan trigger contextual Drawer. Jangan gunakan role menu/menuitem tanpa model keyboard menu lengkap.</p></FlowSection>
    <FlowSection id="slots" title="Search & consumer slots"><Lead>Search, notification, dan BO contextual Drawer adalah komposisi consumer. Contoh desktop ditumpuk agar Navbar tetap terbaca pada viewport referensinya.</Lead><div className="space-y-8"><StaticExample title="Front Office Search & notification" config={base('front-office', 'authenticated', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  '}<H>search</H>{'={search}\n  '}<H>account</H>{'={account}\n  '}<H>notificationTrigger</H>{'={notificationLink}\n/>'}</StaticExample><StaticExample title="Back Office Search & contextual Drawer" config={base('back-office', 'authenticated', 4)} width={1184} height={94}>{'<Navbar\n  platform="back-office"\n  brand={brand}\n  items={items}\n  '}<H>search</H>{'={search}\n  '}<H>account</H>{'={account}\n  '}<H>mobileDrawer</H>{'={contextualDrawer}\n/>'}</StaticExample></div></FlowSection>
    <FlowSection id="responsive" title="Responsive behavior"><Lead>Viewport berasal dari environment consumer, bukan prop Navbar. FO mobile memakai dua baris; BO menggunakan layout produksi pada 458px. Navbar memiliki Sidebar mobile, sedangkan consumer memiliki konten dan state contextual Drawer Back Office melalui mobileDrawer.</Lead><div className="grid gap-5 lg:grid-cols-2"><StaticExample title="FO mobile · 412px" config={base('front-office', 'authenticated', 4)} width={412} height={122}>{'<Navbar\n  '}<H>platform</H>{'="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  account={account}\n/>'}</StaticExample><StaticExample title="BO mobile · 458px" config={base('back-office', 'authenticated', 4)} width={458} height={79}>{'<Navbar\n  '}<H>platform</H>{'="back-office"\n  brand={brand}\n  items={items}\n  search={search}\n  account={account}\n  '}<H>mobileDrawer</H>{'={contextualDrawer}\n/>'}</StaticExample></div></FlowSection>
    <FlowSection id="dark-mode" title="Dark mode"><Lead>Contoh ini memakai production Navbar di dalam boundary consumer <H>data-theme</H>{'="dark"'}. Fixture mewarisi token tema untuk surface, teks, border, Search, Button, dan Dropdown; bingkai preview juga memakai surface gelap agar seluruh konteks komponen terbaca tanpa menggelapkan halaman Docs.</Lead><div className="space-y-8"><StaticExample title="FO desktop Dark" config={{ ...base('front-office', 'guest', 4), theme: 'dark' }} width={1440} height={94}>{'<div '}<H>data-theme</H>{'="dark">\n  <Navbar platform="front-office" brand={brand} items={items} guestActions={guestActions} />\n</div>'}</StaticExample><StaticExample title="BO desktop Dark" config={{ ...base('back-office', 'authenticated', 4), theme: 'dark' }} width={1184} height={94}>{'<div '}<H>data-theme</H>{'="dark">\n  <Navbar platform="back-office" brand={brand} items={items} account={account} />\n</div>'}</StaticExample><div className="grid gap-5 lg:grid-cols-2"><PreviewFrame title="FO mobile Dark" src={fixtureSrc({ ...base('front-office', 'authenticated', 4), theme: 'dark' })} width={412} height={122} loading="lazy" dark interactive={false} /><PreviewFrame title="BO mobile Dark" src={fixtureSrc({ ...base('back-office', 'authenticated', 4), theme: 'dark' })} width={458} height={79} loading="lazy" dark interactive={false} /></div></div></FlowSection>
    <FlowSection id="playground" title="Playground">
      <Lead>Playground merender Navbar produksi melalui iframe hash-route. Controls hanya mengubah consumer fixture dan viewport; tidak ada allocator dokumentasi atau prop produksi tambahan.</Lead>
      <PreviewFrame title="Navbar Playground" src={src} width={width} height={height} dark={config.theme === 'dark'} />
      <Controls>
        <Control label="Theme"><Segmented label="Theme" value={config.theme} onChange={(v) => update('theme', v)} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} /></Control>
        <Control label="Platform"><Segmented label="Platform" value={config.platform} onChange={(v) => update('platform', v)} options={[{ value: 'front-office', label: 'Front Office' }, { value: 'back-office', label: 'Back Office' }]} /></Control>
        <Control label="Identity"><Segmented label="Identity" value={config.identity} onChange={(v) => update('identity', v)} options={config.platform === 'front-office' ? [{ value: 'guest', label: 'Guest' }, { value: 'authenticated', label: 'Authenticated' }, { value: 'none', label: 'No actions' }] : [{ value: 'authenticated', label: 'Authenticated' }, { value: 'none', label: 'No account' }]} /></Control>
        <Control label="Viewport"><div className="space-y-3"><Segmented label="Viewport width" value={width} onChange={(v) => { setWidth(v); setCustomWidth(String(v)) }} wrap options={widths.map((v) => ({ value: v, label: `${v}px` }))} /><label className="grid w-40 gap-1 text-sm font-medium text-content">Custom width<input type="number" min="320" max="2560" value={customWidth} onChange={(e) => { setCustomWidth(e.target.value); if (/^\d+$/.test(e.target.value) && Number(e.target.value) >= 320 && Number(e.target.value) <= 2560) setWidth(Number(e.target.value)) }} className="h-9 rounded-lg border border-border bg-surface px-3 text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" aria-invalid={!validWidth} /></label>{!validWidth && <p role="status" className="text-xs text-feedback-error">Masukkan lebar 320–2560px.</p>}</div></Control>
        <Control label="Navigation count"><Segmented label="Navigation count" value={config.menuCount} onChange={(v) => update('menuCount', v)} wrap options={[2,3,4,5,6,7,8,9,10].map((v) => ({ value: v as Config['menuCount'], label: `${v} items` }))} /></Control>
        <Control label="Label fixture"><Segmented label="Label fixture" value={config.labels} onChange={(v) => update('labels', v)} options={[{ value: 'normal', label: 'Normal' }, { value: 'long', label: 'Long' }, { value: 'unbroken', label: 'Unbroken' }]} /></Control>
        <Control label="Brand fixture"><Segmented label="Brand fixture" value={config.wideBrand} onChange={(v) => update('wideBrand', v)} options={[{ value: false, label: 'CEPLOK' }, { value: true, label: 'Wide' }]} /></Control>
        <Control label="Disclosure"><Segmented label="Disclosure" value={config.disclosure} onChange={(v) => update('disclosure', v)} options={bool} /></Control>
        <Control label="Search"><Segmented label="Search" value={config.search} onChange={(v) => update('search', v)} options={bool} /></Control>
        <Control label="Disabled item"><Segmented label="Disabled item" value={config.disabled} onChange={(v) => update('disabled', v)} options={bool} /></Control>
        {config.platform === 'front-office' && config.identity === 'authenticated' && <Control label="Notification"><Segmented label="Notification" value={config.notification} onChange={(v) => update('notification', v)} options={bool} /></Control>}
        {config.platform === 'back-office' && <Control label="Contextual Drawer"><Segmented label="Contextual Drawer" value={config.drawer} onChange={(v) => update('drawer', v)} options={bool} /></Control>}
      </Controls>
    </FlowSection>
    <FlowSection id="penggunaan" title="Penggunaan">
      <Lead>Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang nilainya masih bawaan sengaja tidak ditulis.</Lead>
      <PlaygroundUsageCode config={config} />
    </FlowSection>
    <FlowSection id="properties" title="Properties">
      <Lead>NavbarProps adalah discriminated union berdasarkan platform. Tabel pertama mencakup prop publik Navbar; tabel kedua merangkum bentuk data yang dipasok consumer.</Lead>
      <div className="space-y-8">
        <div><h3 className="mb-3 text-heading-4 font-bold text-content">NavbarProps</h3><PropsTable rows={navbarProps} minWidth="54rem" /></div>
        <p className="text-body-sm leading-6 text-content-muted">Front Office memakai mode guest atau authenticated: guestActions hanya untuk guest, sedangkan account dan notificationTrigger hanya untuk authenticated. Back Office memakai kontrak sendiri: account dan mobileDrawer tersedia, sementara guestActions dan notificationTrigger tidak tersedia.</p>
        <div><h3 className="mb-3 text-heading-4 font-bold text-content">Supporting types</h3><PropsTable rows={supportingTypes} minWidth="54rem" /></div>
        <p className="text-body-sm leading-6 text-content-muted">NavbarPrimaryItem adalah NavbarDestination atau NavbarDisclosure. Untuk struktur field lengkap dan signature callback, gunakan tipe publik yang diekspor dari package.</p>
      </div>
    </FlowSection>
  </UsulanPage>
}
