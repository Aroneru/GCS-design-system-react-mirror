import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { Home, InfoCircle } from 'flowbite-react-icons/outline'
import { Navbar, Search, type NavbarAccountItem, type NavbarPrimaryItem, type NavbarProps, type SidebarItem } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { nodeText } from '../../nodeText'
import { H, Segmented } from '../../pageKit'
import { Control, Controls, FlowSection, Lead, SectionCode, UsulanPage, type TocEntry } from '../../usulanKit'
import { fontClass, fontScopeStyle, readPlaygroundFont, usePlaygroundFont } from '../../usulanOptions'

type Identity = 'guest' | 'authenticated' | 'none'
type Theme = 'light' | 'dark'
type RegressionFixture = 'default' | 'disclosure-first-current' | 'disclosure-second-current' | 'account-current' | 'account-disabled' | 'account-actions' | 'overflow-disclosure'
interface Config { platform: 'front-office' | 'back-office'; identity: Identity; menuCount: 2|3|4|5|6|7|8|9|10; disclosure: boolean; search: boolean; disabled: boolean; icons: boolean; notification: boolean; theme: Theme; fixture: RegressionFixture }

const toc: TocEntry[] = [
  { id: 'navbar', label: 'Navbar' }, { id: 'front-office', label: 'Platform' }, { id: 'back-office', label: 'Identity & Account' }, { id: 'navigation', label: 'Navigation & Disclosure' }, { id: 'slots', label: 'Search & consumer slots' }, { id: 'responsive', label: 'Responsive behavior' }, { id: 'dark-mode', label: 'Dark mode' }, { id: 'playground', label: 'Playground' }, { id: 'penggunaan', label: 'Penggunaan' }, { id: 'properties', label: 'Properties' },
]
const bool = [{ value: true, label: 'Ada' }, { value: false, label: 'Tidak Ada' }]
const widths = [375, 412, 440, 768, 1024, 1280, 1440] as const
const navbarCodeHighlights = [
  'Navbar', 'Search', 'NavbarAccount', 'NavbarPrimaryItem', 'NavbarNotificationTrigger', 'SidebarItem',
  'platform', 'brand', 'items', 'navbarItems', 'sidebarItems', 'search', 'searchCategories', 'guestActions', 'account', 'notificationTrigger',
  'type', 'children', 'id', 'label', 'href', 'current', 'disabled', 'icon', 'tone',
  'data-theme', 'open', 'onOpenChange', 'controls', 'ariaLabel', 'trigger', 'showButton', 'categories', 'categoryPlaceholder', 'onClose', 'position', 'size',
]

function highlightNavbarCode(code: ReactNode, highlights: readonly string[] = navbarCodeHighlights): ReactNode {
  const source = nodeText(code)
  const tokens = [...highlights].sort((left, right) => right.length - left.length)
  if (tokens.length === 0) return source
  const tokenSet = new Set(tokens)
  const identifierCharacter = '[A-Za-z0-9_$]'
  const pattern = new RegExp(
    `(?<!${identifierCharacter})(${tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?!${identifierCharacter})`,
    'g',
  )

  return source
    .split(pattern)
    .map((part, index) => tokenSet.has(part) ? <H key={`${part}-${index}`}>{part}</H> : part)
}

const navbarProps: PropRow[] = [
  ['platform', "'front-office' | 'back-office'", 'required', 'Menentukan kontrak platform, bukan deteksi viewport.'],
  ['brand', 'NavbarBrand', 'required', 'Brand consumer. Pada BO desktop, Sidebar aplikasi yang merendernya.'],
  ['items', 'NavbarPrimaryItem[]', '[]', 'Navigasi Navbar desktop. Pada BO, Navbar otomatis menyajikannya di Drawer mobile.'],
  ['sidebarItems', 'SidebarItem[]', 'undefined', 'Khusus BO: navigasi Sidebar aplikasi yang dipakai Navbar pada mobile. Sidebar desktop tetap dirender consumer.'],
  ['search', 'ReactNode', 'undefined', 'Slot Search milik consumer. Pada BO gunakan varian kategori dengan pilihan yang diturunkan dari sidebarItems.'],
  ['guestActions', 'NavbarGuestActions', 'undefined', 'Hanya FO guest; tidak dapat dikombinasikan dengan account atau notificationTrigger.'],
  ['account', 'NavbarAccount', 'undefined', 'FO authenticated atau BO. Pada FO, tidak dapat dikombinasikan dengan guestActions.'],
  ['notificationTrigger', 'NavbarNotificationTrigger', 'undefined', 'Konfigurasi tombol notifikasi bawaan. FO authenticated atau BO; pada BO independen dari account.'],
  ['mobileNavigationOpen', 'boolean', 'undefined', 'State terkontrol navigasi mobile. Jika tidak diisi, Navbar mengelola state internal.'],
  ['onMobileNavigationOpenChange', '(open: boolean) => void', 'undefined', 'Callback perubahan navigasi mobile.'],
  ['className / HTML attributes', 'HTMLAttributes<HTMLElement>', 'undefined', 'Atribut header standar, selain children.'],
]
const supportingTypes: PropRow[] = [
  ['NavbarBrand', '{ content; href; ariaLabel }', '—', 'Brand wajib: ReactNode, tujuan link, dan nama aksesibel.'],
  ['NavbarDestination', "{ type: 'destination'; id; label; href; … }", '—', 'Item anchor; mendukung icon, current untuk aria-current, disabled, target, rel, dan onClick.'],
  ['NavbarDisclosure', "{ type: 'disclosure'; id; label; children; … }", '—', 'Grup satu tingkat dengan children: NavbarDestination[].'],
  ['NavbarAccount', '{ name; items; description?; avatarSrc?; initials? }', '—', 'Identitas dan menu account.'],
  ['NavbarAccountItem', "NavbarAccountDestination | NavbarAccountAction", '—', 'Destination atau action; keduanya mendukung tone default atau danger.'],
  ['NavbarGuestActions', '{ signIn; signUp? }', '—', 'Aksi guest; setiap link berisi label, href, dan onClick opsional.'],
  ['NavbarNotificationTrigger', '{ ariaLabel; onClick?; badge?; …buttonProps }', '—', 'Konfigurasi tombol Bell bawaan; consumer mengelola interaksi dan state panel.'],
  ['SidebarItem', '{ id?; label; href?; children?; active?; disabled?; … }', '—', 'Data navigasi Sidebar BO yang dimiliki layout consumer dan dipakai Navbar pada mobile.'],
]

function normalized(c: Config): Config { return c.platform === 'back-office' ? { ...c, identity: c.identity === 'guest' ? 'none' : c.identity } : c }
/** Direct-preview-only consumer data used by regression acceptance; never passed to Navbar. */
function readFixture(value: string | null): RegressionFixture {
  switch (value) {
    case 'disclosure-first-current': case 'disclosure-second-current': case 'account-current': case 'account-disabled': case 'account-actions': case 'overflow-disclosure': return value
    default: return 'default'
  }
}
function Brand({ compact = false }: { compact?: boolean }) {
  if (compact) return <img src="/images/ceplok.svg" alt="" className="size-7 shrink-0 object-contain lg:size-9" />
  return <span className="flex h-9 w-[114px] items-center gap-2 text-sm font-black tracking-wide text-content lg:h-[46px] lg:w-36 lg:text-base"><img src="/images/ceplok.svg" alt="" className="size-7 shrink-0 object-contain lg:size-9" /><span>CEPLOK</span></span>
}
const navigationData = [
  { id: 'home', type: 'destination', label: 'Beranda', href: '/beranda' },
  { id: 'digital-services', type: 'disclosure', label: 'Layanan Digital', children: [
    { id: 'service-catalog', label: 'Katalog Layanan Digital', href: '/layanan/katalog' },
    { id: 'service-status', label: 'Status Permohonan Layanan', href: '/layanan/status' },
    { id: 'service-guide', label: 'Panduan Penggunaan Aplikasi', href: '/layanan/panduan' },
    { id: 'service-requirements', label: 'Persyaratan Pelayanan Online', href: '/layanan/persyaratan' },
  ] },
  { id: 'institution-profile', type: 'destination', label: 'Profil Instansi', href: '/profil-instansi' },
  { id: 'public-information', type: 'destination', label: 'Informasi Publik', href: '/informasi-publik' },
  { id: 'regulations', type: 'disclosure', label: 'Regulasi dan Kebijakan', children: [
    { id: 'local-regulations', label: 'Peraturan Daerah', href: '/regulasi/peraturan-daerah' },
    { id: 'regional-head-regulations', label: 'Peraturan Kepala Daerah', href: '/regulasi/peraturan-kepala-daerah' },
    { id: 'circulars', label: 'Keputusan dan Surat Edaran', href: '/regulasi/keputusan-surat-edaran' },
    { id: 'public-policy', label: 'Dokumen Kebijakan Publik', href: '/regulasi/kebijakan-publik' },
  ] },
  { id: 'public-complaints', type: 'destination', label: 'Pengaduan Masyarakat', href: '/pengaduan-masyarakat' },
  { id: 'transparency', type: 'destination', label: 'Transparansi dan Akuntabilitas Penyelenggaraan Pemerintahan', href: '/transparansi-akuntabilitas' },
  { id: 'help-center', type: 'disclosure', label: 'Pusat Bantuan', children: [
    { id: 'frequently-asked-questions', label: 'Pertanyaan yang Sering Diajukan', href: '/bantuan/pertanyaan' },
    { id: 'user-guide', label: 'Panduan Pengguna', href: '/bantuan/panduan' },
    { id: 'contact-officer', label: 'Hubungi Petugas Layanan', href: '/bantuan/hubungi' },
  ] },
  { id: 'service-statistics', type: 'destination', label: 'Statistik dan Data Pelayanan Publik Daerah', href: '/statistik-pelayanan' },
  { id: 'national-public-service-information', type: 'destination', label: 'Informasi dan Dokumentasi Pelayanan Publik Terpadu Nasional', href: '/informasi-pelayanan-nasional' },
] as const

function selectedNavigationData(count: number) { return navigationData.slice(0, count) }
function disabledNavigationIndex(count: number, disclosure: boolean) {
  let index = -1
  selectedNavigationData(count).forEach((item, itemIndex) => {
    if (!disclosure || item.type === 'destination') index = itemIndex
  })
  return index
}

function items(count: number, c: Config): NavbarPrimaryItem[] {
  const disabledIndex = disabledNavigationIndex(count, c.disclosure)
  return selectedNavigationData(count).map((item, i) => {
    const icon = c.icons ? (i % 2 ? <InfoCircle key={i} /> : <Home key={i} />) : undefined
    if (c.disclosure && item.type === 'disclosure') return { id: item.id, type: 'disclosure', label: item.label, icon, children: item.children.map((child, childIndex) => ({ ...child, type: 'destination' as const, current: item.id === 'digital-services' && ((childIndex === 0 && c.fixture === 'disclosure-first-current') || (childIndex === 1 && c.fixture === 'disclosure-second-current')) })) }
    return { id: item.id, type: 'destination', label: item.label, href: item.type === 'destination' ? item.href : `/${item.id}`, icon, disabled: c.disabled && i === disabledIndex }
  })
}

const backOfficeSidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dasbor', href: '/admin', icon: <Home /> },
  { id: 'submissions', label: 'Pengajuan', href: '/admin/pengajuan', icon: <InfoCircle /> },
  { id: 'applicants', label: 'Pemohon', href: '/admin/pemohon', icon: <Home /> },
  { id: 'settings', label: 'Pengaturan', href: '/admin/pengaturan', icon: <InfoCircle /> },
]

function Preview({ config }: { config: Config }) {
  const [feedback, setFeedback] = useState('')
  const navItems = useMemo(() => items(config.menuCount, config), [config])
  const accountItems = useMemo<NavbarAccountItem[]>(() => [
    { id: 'profile', type: 'destination', label: 'Profil', href: '/profil', current: config.fixture === 'account-current', disabled: config.fixture === 'account-disabled' },
    ...(config.fixture === 'account-actions' ? [{ id: 'settings', type: 'action' as const, label: 'Pengaturan', onClick: () => setFeedback('Aksi demo: Pengaturan') }] : []),
    { id: 'logout', type: 'action', label: 'Logout', tone: 'danger', onClick: () => setFeedback('Aksi demo: Logout') },
  ], [config.fixture])
  const brand = { content: <Brand compact={config.platform === 'back-office'} />, href: '/', ariaLabel: 'CEPLOK — Beranda' }
  const searchCategories = backOfficeSidebarItems.map(({ id, label }) => ({ value: id ?? label, label }))
  const search = config.search ? <Search platform="compact" showButton={config.platform === 'back-office'} trigger="enter" aria-label="Cari dokumentasi" placeholder="Cari dokumentasi ..." categories={config.platform === 'back-office' ? searchCategories : undefined} categoryPlaceholder="Kategori" onSearch={(value, category) => setFeedback(`Pencarian demo: ${value}${category ? ` (${category})` : ''}`)} /> : undefined
  const common = { brand, items: navItems, search }
  const intercept = (e: MouseEvent<HTMLDivElement>) => { const a = e.target instanceof Element ? e.target.closest('a') : null; if (!a || a.getAttribute('aria-disabled') === 'true') return; e.preventDefault(); setFeedback(`Navigasi demo: ${a.getAttribute('aria-label') || a.textContent?.trim() || 'Tautan'}`) }
  return <div data-theme={config.theme} data-navbar-platform={config.platform} className="overflow-hidden bg-surface text-content" onClick={intercept}>
    {config.platform === 'front-office' ? (config.identity === 'authenticated' ? <Navbar platform="front-office" {...common} notificationTrigger={config.notification ? { ariaLabel: 'Buka pengaturan notifikasi', onClick: () => setFeedback('Aksi demo: Notifikasi') } : undefined} account={{ name: 'User CEPLOK', initials: 'US', items: accountItems }} /> : <Navbar platform="front-office" {...common} guestActions={config.identity === 'guest' ? { signIn: { label: 'Masuk', href: '/masuk' }, signUp: { label: 'Daftar', href: '/daftar' } } : undefined} />) : <Navbar platform="back-office" {...common} sidebarItems={backOfficeSidebarItems} notificationTrigger={config.notification ? { ariaLabel: 'Buka pengaturan notifikasi', onClick: () => setFeedback('Aksi demo: Notifikasi') } : undefined} account={config.identity === 'authenticated' ? { name: 'Admin CEPLOK', initials: 'AC', items: accountItems } : undefined} />}
    {feedback && <p role="status" aria-live="polite" className="border-t border-border bg-surface-subtle px-4 py-2 text-body-sm text-content-subtle">{feedback}</p>}
  </div>
}

const base = (platform: NavbarProps['platform'], identity: Identity, menuCount: Config['menuCount']): Config => normalized({ platform, identity, menuCount, disclosure: true, search: true, disabled: false, icons: true, notification: identity === 'authenticated', theme: 'light', fixture: 'default' })
export function NavbarDesktopPreview({ variant, menuCount, platform = 'front-office' }: { variant: 'guest'|'no-button'|'authenticated'; menuCount: 2|3|4|5; platform?: NavbarProps['platform'] }) { return <Preview config={base(platform, variant === 'authenticated' ? 'authenticated' : variant === 'guest' ? 'guest' : 'none', menuCount)} /> }
export function NavbarMobilePreview({ variant, platform = 'front-office' }: { variant: 'guest'|'authenticated'; platform?: NavbarProps['platform'] }) { return <Preview config={base(platform, variant, 4)} /> }

function readConfig(): Config {
  const p = new URLSearchParams(window.location.hash.split('?')[1] ?? ''); const n = Number(p.get('items')); const fixture = readFixture(p.get('fixture'))
  const accountFixture = fixture === 'account-current' || fixture === 'account-disabled' || fixture === 'account-actions'
  return normalized({ platform: p.get('platform') === 'back-office' ? 'back-office' : 'front-office', identity: accountFixture ? 'authenticated' : p.get('identity') === 'authenticated' ? 'authenticated' : p.get('identity') === 'none' ? 'none' : 'guest', menuCount: fixture === 'overflow-disclosure' ? 10 : n >= 2 && n <= 10 ? n as Config['menuCount'] : 4, disclosure: fixture === 'overflow-disclosure' || p.get('disclosure') !== 'false', search: p.get('search') !== 'false', disabled: p.get('disabled') === 'true', icons: p.get('icons') !== 'false', notification: p.get('notification') !== 'false', theme: p.get('theme') === 'dark' ? 'dark' : 'light', fixture })
}
/** Current-source production fixture; static preview routes depend on this export. */
export function NavbarPlaygroundPreview() {
  // Font pilihan kontrol Typography dikirim lewat URL, karena iframe tidak ikut mewarisi font halaman docs.
  const font = readPlaygroundFont(new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('font'))
  const preview = <Preview config={readConfig()} />
  return font ? <div className={fontClass[font]} style={fontScopeStyle(font)}>{preview}</div> : preview
}

/** Docs-only fit presentation. The iframe itself retains the requested real viewport. */
function PreviewFrame({ title, src, width, height = 220, stageHeight, showTitle = true, loading = 'eager', dark = false, interactive = true, centered = false }: { title: string; src: string; width: number; height?: number; stageHeight?: number; showTitle?: boolean; loading?: 'eager' | 'lazy'; dark?: boolean; interactive?: boolean; centered?: boolean }) {
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
  const usesSharedStage = stageHeight !== undefined
  const font = usePlaygroundFont()
  const frameSrc = font ? `${src}&font=${font}` : src
  return <div className="space-y-2">{showTitle && <p className="text-sm font-semibold text-content">{title}</p>}<div className={`max-w-full overflow-hidden rounded-xl border p-3 ${dark ? 'border-gray-800 bg-gray-900' : 'border-border bg-surface-subtle'}`}><div ref={contentRef}><div className={usesSharedStage ? 'relative' : centered ? 'flex justify-center' : undefined} style={{ height: usesSharedStage ? stageHeight : height * scale }}><iframe title={title} src={frameSrc} loading={loading} tabIndex={interactive ? 0 : -1} className={interactive ? 'block shrink-0 border-0 bg-transparent' : 'pointer-events-none block shrink-0 border-0 bg-transparent'} style={usesSharedStage ? { position: 'absolute', top: '50%', left: 0, width, height, transform: `translateY(-50%) scale(${scale})`, transformOrigin: 'left center' } : { width, height, transform: `scale(${scale})`, transformOrigin: centered ? 'top center' : 'top left' }} /></div></div></div></div>
}
function usageItemsCode(config: Config) {
  const disabledIndex = disabledNavigationIndex(config.menuCount, config.disclosure)
  return selectedNavigationData(config.menuCount).map((item, index) => {
    const icon = config.icons ? (index % 2 ? ' icon: <InfoCircle />,' : ' icon: <Home />,') : ''
    if (config.disclosure && item.type === 'disclosure') {
      const children = item.children.map((child) => `      { id: '${child.id}', type: 'destination', label: '${child.label}', href: '${child.href}' },`).join('\n')
      return `  { id: '${item.id}', type: 'disclosure', label: '${item.label}',${icon}\n    children: [\n${children}\n    ],\n  },`
    }
    const href = item.type === 'destination' ? item.href : `/${item.id}`
    return `  { id: '${item.id}', type: 'destination', label: '${item.label}', href: '${href}',${icon}${config.disabled && index === disabledIndex ? ' disabled: true,' : ''} },`
  }).join('\n')
}

function usageAccountCode(config: Config) {
  const profileState = config.fixture === 'account-current'
    ? ', current: true'
    : config.fixture === 'account-disabled'
      ? ', disabled: true'
      : ''
  return `const account = {
  name: '${config.platform === 'back-office' ? 'Admin CEPLOK' : 'User CEPLOK'}',
  initials: '${config.platform === 'back-office' ? 'AC' : 'US'}',
  items: [
    { id: 'profile', type: 'destination', label: 'Profil', href: '/profil'${profileState} },
    { id: 'settings', type: 'destination', label: 'Pengaturan akun', href: '/pengaturan-akun' },
    { id: 'logout', type: 'action', label: 'Logout', tone: 'danger', onClick: () => {} },
  ],
} satisfies NavbarAccount

`
}

function PlaygroundUsageCode({ config }: { config: Config }) {
  if (config.platform === 'back-office') {
    const hasAccount = config.identity === 'authenticated'
    const imports = ['Navbar', ...(config.search ? ['Search'] : []), ...(hasAccount ? ['type NavbarAccount'] : []), 'type NavbarPrimaryItem', 'type SidebarItem'].join(', ')
    const searchCode = config.search
      ? 'const searchCategories = sidebarItems.map(({ id, label }) => ({ value: id ?? label, label }))\n\n'
      : ''
    const code = `import { ${imports} } from '@ceplok-ui/design-kit-react'
import { Home, InfoCircle } from 'flowbite-react-icons/outline'

const brand = {
  content: <span>CEPLOK</span>,
  href: '/',
  ariaLabel: 'CEPLOK — Beranda',
}

const navbarItems = [
${usageItemsCode(config)}
] satisfies NavbarPrimaryItem[]

const sidebarItems = [
  { id: 'dashboard', label: 'Dasbor', href: '/admin', icon: <Home /> },
  { id: 'submissions', label: 'Pengajuan', href: '/admin/pengajuan', icon: <InfoCircle /> },
  { id: 'applicants', label: 'Pemohon', href: '/admin/pemohon', icon: <Home /> },
  { id: 'settings', label: 'Pengaturan', href: '/admin/pengaturan', icon: <InfoCircle /> },
] satisfies SidebarItem[]

${searchCode}${hasAccount ? usageAccountCode(config) : ''}${config.notification ? "const notificationTrigger = { ariaLabel: 'Buka notifikasi', onClick: () => {} }\n" : ''}

export function BackOfficeNavbar() {
  return (
    <Navbar
      platform="back-office"
      brand={brand}
      items={navbarItems}
      sidebarItems={sidebarItems}
${config.search ? '      search={<Search platform="compact" showButton categories={searchCategories} categoryPlaceholder="Kategori" />}\n' : ''}${config.notification ? '      notificationTrigger={notificationTrigger}\n' : ''}${hasAccount ? '      account={account}\n' : ''}    />
  )
}`
    return <SectionCode flush>{highlightNavbarCode(code)}</SectionCode>
  }

  const hasSearch = config.search
  const hasAccount = config.identity === 'authenticated'
  const hasGuestActions = config.platform === 'front-office' && config.identity === 'guest'
  const hasNotification = config.platform === 'front-office' && hasAccount && config.notification
  const hasIcons = config.icons
  const darkWrapper = config.theme === 'dark'
  const itemCode = usageItemsCode(config)
  const imports = ['Navbar', ...(hasSearch ? ['Search'] : []), ...(hasAccount ? ['type NavbarAccount'] : []), 'type NavbarPrimaryItem'].join(', ')
  const searchCode = hasSearch ? 'const search = (\n  <Search platform="compact" showButton={false} trigger="enter" aria-label="Cari dokumentasi" />\n)\n\n' : ''
  const guestCode = hasGuestActions ? "const guestActions = {\n  signIn: { label: 'Masuk', href: '/masuk' },\n  signUp: { label: 'Daftar', href: '/daftar' },\n}\n\n" : ''
  const accountCode = hasAccount ? usageAccountCode(config) : ''
  const notificationCode = hasNotification ? "const notificationTrigger = { ariaLabel: 'Buka notifikasi', onClick: () => {} }\n\n" : ''
  const propsCode = [
    '        platform="front-office"',
    '        brand={brand}',
    '        items={items}',
    ...(hasSearch ? ['        search={search}'] : []),
    ...(hasGuestActions ? ['        guestActions={guestActions}'] : []),
    ...(hasAccount ? ['        account={account}'] : []),
    ...(hasNotification ? ['        notificationTrigger={notificationTrigger}'] : []),
  ].join('\n')
  const navbarCode = `      <Navbar\n${propsCode}\n      />`
  const code = `import { ${imports} } from '@ceplok-ui/design-kit-react'\n${hasIcons ? "import { Home, InfoCircle } from 'flowbite-react-icons/outline'\n" : ''}\nconst brand = {\n  content: <span>CEPLOK</span>,\n  href: '/',\n  ariaLabel: 'CEPLOK — Beranda',\n}\n\nconst items = [\n${itemCode}\n] satisfies NavbarPrimaryItem[]\n\n${searchCode}${guestCode}${accountCode}${notificationCode}export function NavbarExample() {\n  return (\n${darkWrapper ? `    <div data-theme="dark">\n${navbarCode}\n    </div>` : navbarCode}\n  )\n}`
  return <SectionCode flush>{highlightNavbarCode(code)}</SectionCode>
}

function fixtureSrc(config: Config) { return `#/preview/navbar/playground?${new URLSearchParams({ platform: config.platform, identity: config.identity, items: String(config.menuCount), disclosure: String(config.disclosure), search: String(config.search), disabled: String(config.disabled), icons: String(config.icons), notification: String(config.notification), theme: config.theme, fixture: config.fixture })}` }
const staticExampleHighlights: Record<string, readonly string[]> = {
  'Front Office': ['platform'],
  'Back Office': ['platform'],
  'FO guest': ['guestActions'],
  'FO authenticated': ['account'],
  'Back Office account': ['account'],
  Destination: ['type'],
  Disclosure: ['type', 'children'],
  Disabled: ['disabled'],
  'Front Office Search & notification': ['search', 'notificationTrigger'],
  'Back Office categorized Search & automatic navigation Drawer': ['Search', 'categories', 'categoryPlaceholder', 'sidebarItems', 'search'],
  'FO desktop Dark': ['data-theme'],
  'BO desktop Dark': ['data-theme'],
}

function StaticExample({ title, config, width, height, stageHeight, highlights, children, loading = 'lazy' }: { title: string; config: Config; width: number; height: number; stageHeight?: number; highlights?: readonly string[]; children: ReactNode; loading?: 'eager' | 'lazy' }) {
  const relevantHighlights = highlights ?? staticExampleHighlights[title] ?? []
  return <section><p className="mb-2 text-sm font-black text-gray-900">{title}</p><PreviewFrame title={title} src={fixtureSrc(config)} width={width} height={height} stageHeight={stageHeight} showTitle={false} loading={loading} dark={config.theme === 'dark'} interactive={false} /><div className="mt-4"><SectionCode>{highlightNavbarCode(children, relevantHighlights)}</SectionCode></div></section>
}

export function NavbarPage() {
  const [config, setConfig] = useState<Config>(() => base('front-office', 'guest', 4)); const [width, setWidth] = useState(1440); const [customWidth, setCustomWidth] = useState('1440'); const [height, setHeight] = useState(220); const [customHeight, setCustomHeight] = useState('220')
  const update = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((c) => normalized({ ...c, [key]: value }))
  const src = useMemo(() => `#/preview/navbar/playground?${new URLSearchParams({ platform: config.platform, identity: config.identity, items: String(config.menuCount), disclosure: String(config.disclosure), search: String(config.search), disabled: String(config.disabled), icons: String(config.icons), notification: String(config.notification), theme: config.theme, fixture: config.fixture })}`, [config])
  const validWidth = /^\d+$/.test(customWidth) && Number(customWidth) >= 320 && Number(customWidth) <= 2560
  const validHeight = /^\d+$/.test(customHeight) && Number(customHeight) >= 94 && Number(customHeight) <= 1200
  return <UsulanPage eyebrow="Components · Navbar" title="Navbar" description="Header navigasi global yang menyatukan brand, navigasi utama, pencarian, notifikasi, dan akses akun dalam komposisi Front Office atau Back Office yang responsif." toc={toc}>
    <FlowSection id="navbar" title="Navbar"><Lead>Navbar adalah header navigasi global aplikasi. Komponen menyusun brand, navigasi utama, Search, tombol notifikasi, dan identitas atau aksi pengguna, lalu otomatis mengganti komposisi desktop dan mobile. Navbar tidak menangani routing, hasil pencarian, data notifikasi, atau isi panel custom: consumer memasok datanya, memperbarui current route, dan mengelola interaksinya.</Lead><StaticExample title="Front Office" config={base('front-office', 'guest', 4)} width={1440} height={94} loading="eager">{'<Navbar\n  '}<H>platform</H>{'="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  guestActions={guestActions}\n/>'}</StaticExample></FlowSection>
    <FlowSection id="front-office" title="Platform"><Lead>Front Office dan Back Office memiliki kontrak komposisi berbeda. Pada BO, items adalah navigasi Navbar desktop sekaligus Drawer navigasi mobile, sedangkan sidebarItems berasal dari Sidebar aplikasi yang dirender consumer pada desktop dan dipakai Navbar pada mobile.</Lead><div className="space-y-8"><StaticExample title="Front Office" config={base('front-office', 'guest', 4)} width={1440} height={94}>{'<Navbar\n  '}<H>platform</H>{'="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  guestActions={guestActions}\n/>'}</StaticExample><StaticExample title="Back Office" config={base('back-office', 'authenticated', 4)} width={1184} height={94}>{'<Navbar\n  '}<H>platform</H>{'="back-office"\n  brand={brand}\n  items={navbarItems}\n  sidebarItems={sidebarItems}\n  search={search}\n  notificationTrigger={notificationTrigger}\n  account={account}\n/>'}</StaticExample></div></FlowSection>
    <FlowSection id="back-office" title="Identity & Account"><Lead>FO guest memakai guestActions, sedangkan FO authenticated dan BO dapat memakai account. Identitas BO juga dapat ditempatkan pada Sidebar aplikasi.</Lead><div className="space-y-8"><StaticExample title="FO guest" config={base('front-office', 'guest', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  '}<H>guestActions</H>{'={guestActions}\n/>'}</StaticExample><StaticExample title="FO authenticated" config={base('front-office', 'authenticated', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  '}<H>account</H>{'={account}\n/>'}</StaticExample><StaticExample title="Back Office account" config={normalized({ ...base('back-office', 'authenticated', 4), notification: false })} width={1184} height={94}>{'<Navbar platform="back-office" account={account} />'}</StaticExample></div></FlowSection>
    <FlowSection id="navigation" title="Navigation & Disclosure"><Lead>Destination memakai anchor native; Disclosure, Lainnya, dan trigger mobile memakai button native. Pada destination utama, current diteruskan sebagai aria-current; Breadcrumb menyediakan konteks halaman secara visual. Dropdown tetap menangani tampilan current untuk baris menu sesuai kontraknya. Item yang tidak muat berpindah ke Lainnya tanpa dibuang. Disclosure dan panel yang dibuka dari trigger mendukung Escape serta mengembalikan fokus ke trigger yang masih terlihat; consumer tetap menangani route transition dan current state.</Lead><div className="space-y-8"><StaticExample title="Destination" config={normalized({ ...base('front-office', 'authenticated', 4), disclosure: false })} width={1440} height={94}>{"const items = [{ id: 'home', "}<H>type</H>{": 'destination', label: 'Beranda', href: '/beranda' }]"}</StaticExample><StaticExample title="Disclosure" config={base('front-office', 'authenticated', 4)} width={1440} height={94}>{"const items = [{ id: 'digital-services', "}<H>type</H>{": 'disclosure', label: 'Layanan Digital', "}<H>children</H>{": destinations }]"}</StaticExample><StaticExample title="Disabled" config={normalized({ ...base('front-office', 'authenticated', 4), disclosure: false, disabled: true })} width={1440} height={94}>{"const items = [{ id: 'public-information', type: 'destination', label: 'Informasi Publik', href: '/informasi-publik', "}<H>disabled</H>{': true }]'} </StaticExample></div><p className="mt-4 text-body-sm text-content-muted">Pada BO, items yang sama mempertahankan href, target, rel, disabled, dan current ketika dirender melalui Drawer mobile. Jangan gunakan role menu/menuitem tanpa model keyboard menu lengkap.</p></FlowSection>
    <FlowSection id="slots" title="Search & consumer slots"><Lead>Search adalah slot consumer, sedangkan notificationTrigger mengonfigurasi tombol Bell bawaan Navbar. Pada BO, gunakan Search berkategori dan turunkan urutan kategori dari sidebarItems agar Sidebar desktop, dialog Sidebar mobile, dan filter pencarian memakai satu sumber navigasi. Drawer navigasi BO bukan slot atau prop: Navbar otomatis membentuk trigger dan isinya dari items.</Lead><div className="space-y-8"><StaticExample title="Front Office Search & notification" config={base('front-office', 'authenticated', 4)} width={1440} height={94}>{'<Navbar\n  platform="front-office"\n  brand={brand}\n  items={items}\n  '}<H>search</H>{'={search}\n  '}<H>account</H>{'={account}\n  '}<H>notificationTrigger</H>{'={notificationTrigger}\n/>'}</StaticExample><StaticExample title="Back Office categorized Search & automatic navigation Drawer" config={base('back-office', 'authenticated', 4)} width={1184} height={94}>{"const searchCategories = sidebarItems.map(({ id, label }) => ({ value: id ?? label, label }))\n\n<Search categories={searchCategories} categoryPlaceholder=\"Kategori\" />\n\n<Navbar\n  platform=\"back-office\"\n  brand={brand}\n  items={navbarItems}\n  sidebarItems={sidebarItems}\n  search={searchWithSidebarCategories}\n  account={account}\n/>"}</StaticExample></div><p className="mt-4 text-body-sm text-content-muted">Consumer boleh memetakan label, value, menonaktifkan, atau menyaring kategori sesuai kebutuhan pencarian, tetapi sumber dasarnya tetap sidebarItems—bukan array navigasi kedua yang di-hardcode. Untuk filter, detail, atau panel kontekstual lain, render Drawer di luar Navbar.</p></FlowSection>
    <FlowSection id="responsive" title="Responsive behavior"><Lead>Viewport berasal dari environment consumer, bukan prop Navbar. Pada BO desktop, consumer merender Sidebar aplikasi di luar Navbar dan Navbar merender items di baris atas. Pada mobile, Navbar merender sidebarItems di dialog Sidebar dan otomatis menyajikan items melalui Drawer navigasi. Search kategori BO tetap di baris kedua di bawah 576px; mulai 576px Search kembali ke baris utama agar ruang horizontal dipakai lebih efisien.</Lead><div className="grid gap-5 lg:grid-cols-2"><StaticExample title="FO mobile · 412px" config={base('front-office', 'authenticated', 4)} width={412} height={140} stageHeight={140}>{'<Navbar\n  '}<H>platform</H>{'="front-office"\n  brand={brand}\n  items={items}\n  search={search}\n  account={account}\n/>'}</StaticExample><StaticExample title="BO mobile · 458px" config={base('back-office', 'authenticated', 4)} width={458} height={140} stageHeight={140}>{'<Navbar\n  '}<H>platform</H>{'="back-office"\n  brand={brand}\n  items={navbarItems}\n  sidebarItems={sidebarItems}\n  search={searchWithSidebarCategories}\n  account={account}\n/>'}</StaticExample></div></FlowSection>
    <FlowSection id="dark-mode" title="Dark mode"><Lead>Contoh ini memakai production Navbar di dalam boundary consumer <H>data-theme</H>{'="dark"'}. Fixture mewarisi token tema untuk surface, teks, border, Search, Button, dan Dropdown; bingkai preview juga memakai surface gelap agar seluruh konteks komponen terbaca tanpa menggelapkan halaman Docs.</Lead><div className="space-y-8"><StaticExample title="FO desktop Dark" config={{ ...base('front-office', 'guest', 4), theme: 'dark' }} width={1440} height={94}>{'<div '}<H>data-theme</H>{'="dark">\n  <Navbar platform="front-office" brand={brand} items={items} guestActions={guestActions} />\n</div>'}</StaticExample><StaticExample title="BO desktop Dark" config={{ ...base('back-office', 'authenticated', 4), theme: 'dark' }} width={1184} height={94}>{'<div '}<H>data-theme</H>{'="dark">\n  <Navbar platform="back-office" brand={brand} items={items} account={account} />\n</div>'}</StaticExample><div className="grid gap-5 lg:grid-cols-2"><PreviewFrame title="FO mobile Dark" src={fixtureSrc({ ...base('front-office', 'authenticated', 4), theme: 'dark' })} width={412} height={140} stageHeight={140} loading="lazy" dark interactive={false} /><PreviewFrame title="BO mobile Dark" src={fixtureSrc({ ...base('back-office', 'authenticated', 4), theme: 'dark' })} width={458} height={140} stageHeight={140} loading="lazy" dark interactive={false} /></div></div></FlowSection>
    <FlowSection id="playground" title="Playground">
      <Lead>Playground merender Navbar produksi melalui iframe hash-route. Controls hanya mengubah consumer fixture dan viewport; tidak ada allocator dokumentasi atau prop produksi tambahan.</Lead>
      <PreviewFrame title="Navbar Playground" src={src} width={width} height={height} dark={config.theme === 'dark'} centered />
      <Controls>
        <Control label="Theme"><Segmented label="Theme" value={config.theme} onChange={(v) => update('theme', v)} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} /></Control>
        <Control label="Platform"><Segmented label="Platform" value={config.platform} onChange={(v) => update('platform', v)} options={[{ value: 'front-office', label: 'Front Office' }, { value: 'back-office', label: 'Back Office' }]} /></Control>
        <Control label="Identity"><Segmented label="Identity" value={config.identity} onChange={(v) => update('identity', v)} options={config.platform === 'front-office' ? [{ value: 'guest', label: 'Guest' }, { value: 'authenticated', label: 'Authenticated' }, { value: 'none', label: 'No actions' }] : [{ value: 'authenticated', label: 'Authenticated' }, { value: 'none', label: 'No account' }]} /></Control>
        <Control label="Viewport"><div className="space-y-3"><Segmented label="Viewport width" value={width} onChange={(v) => { setWidth(v); setCustomWidth(String(v)) }} wrap options={widths.map((v) => ({ value: v, label: `${v}px` }))} /><div className="flex flex-wrap gap-3"><label className="grid w-40 gap-1 text-sm font-medium text-content">Custom width<input type="number" min="320" max="2560" value={customWidth} onChange={(e) => { setCustomWidth(e.target.value); if (/^\d+$/.test(e.target.value) && Number(e.target.value) >= 320 && Number(e.target.value) <= 2560) setWidth(Number(e.target.value)) }} className="h-9 rounded-lg border border-border bg-surface px-3 text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" aria-invalid={!validWidth} /></label><label className="grid w-40 gap-1 text-sm font-medium text-content">Custom height<input type="number" min="94" max="1200" value={customHeight} onChange={(e) => { setCustomHeight(e.target.value); if (/^\d+$/.test(e.target.value) && Number(e.target.value) >= 94 && Number(e.target.value) <= 1200) setHeight(Number(e.target.value)) }} className="h-9 rounded-lg border border-border bg-surface px-3 text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" aria-invalid={!validHeight} /></label></div>{!validWidth && <p role="status" className="text-xs text-feedback-error">Masukkan lebar 320–2560px.</p>}{!validHeight && <p role="status" className="text-xs text-feedback-error">Masukkan tinggi 94–1200px.</p>}</div></Control>
        <Control label="Navigation count"><Segmented label="Navigation count" value={config.menuCount} onChange={(v) => update('menuCount', v)} wrap options={[2,3,4,5,6,7,8,9,10].map((v) => ({ value: v as Config['menuCount'], label: `${v} items` }))} /></Control>
        <Control label="Disclosure"><Segmented label="Disclosure" value={config.disclosure} onChange={(v) => update('disclosure', v)} options={bool} /></Control>
        <Control label="Search"><Segmented label="Search" value={config.search} onChange={(v) => update('search', v)} options={bool} /></Control>
        <Control label="Disabled item"><Segmented label="Disabled item" value={config.disabled} onChange={(v) => update('disabled', v)} options={bool} /></Control>
        {((config.platform === 'front-office' && config.identity === 'authenticated') || config.platform === 'back-office') && <Control label="Notification"><Segmented label="Notification" value={config.notification} onChange={(v) => update('notification', v)} options={bool} /></Control>}
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
        <p className="text-body-sm leading-6 text-content-muted">Front Office memakai mode guest atau authenticated. Pada Back Office, items dan sidebarItems sengaja berbeda: items untuk baris Navbar desktop/Drawer navigasi mobile, sidebarItems untuk Sidebar aplikasi desktop/mobile. notificationTrigger dapat digunakan dengan atau tanpa account. Sidebar desktop tetap dimiliki consumer; Drawer navigasi dirender Navbar.</p>
        <div><h3 className="mb-3 text-heading-4 font-bold text-content">Supporting types</h3><PropsTable rows={supportingTypes} minWidth="54rem" /></div>
        <p className="text-body-sm leading-6 text-content-muted">NavbarPrimaryItem adalah NavbarDestination atau NavbarDisclosure. Untuk struktur field lengkap dan signature callback, gunakan tipe publik yang diekspor dari package.</p>
      </div>
    </FlowSection>
  </UsulanPage>
}
