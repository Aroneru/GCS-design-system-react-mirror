import { useState, type ReactNode } from 'react'
import {
    Cart,
    ChartPie,
    FileLines,
    Inbox,
    Lock,
} from 'flowbite-react-icons/solid'
import {
    DrawerHeader,
    DrawerNavItem,
    DrawerSubItem,
    DrawerTrigger,
    type DrawerMenuItem,
    type DrawerNavItemTheme,
} from '../../../lib'
import { DrawerContext } from '../../../lib/components/Drawer'

const drawerContextDummy = {
    onClose: () => { },
    titleId: '',
    descriptionId: '',
    registerTitle: () => { },
    registerDescription: () => { },
}
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Hl, Segmented } from '../../pageKit'
import {
    Control,
    Controls,
    FlowSection,
    Lead,
    SectionCode,
    UsulanPage,
    type TocEntry,
} from '../../usulanKit'

const menuThemes: { value: DrawerNavItemTheme; label: string }[] = [
    { value: 'primary', label: 'Primary' },
    { value: 'simaya', label: 'Simaya' },
]

const iconOptions = [
    { value: 'true', label: 'Ada' },
    { value: 'false', label: 'Tidak Ada' },
]

const drawerProps: PropRow[] = [
    ['open', 'boolean', 'required', 'Menentukan apakah Drawer sedang terbuka.'],
    ['onClose', '() => void', 'required', 'Fungsi callback saat Drawer diminta untuk ditutup.'],
    ['position', "'right' | 'left' | 'top' | 'bottom'", "'right'", 'Arah kemunculan panel Drawer pada layar.'],
    ['size', "'s' | 'm' | 'l' | 'xl' | 'full'", "'m'", 'Ukuran lebar (atau tinggi pada top/bottom) dari panel Drawer.'],
    ['closeOnOverlayClick', 'boolean', 'true', 'Jika true, mengklik backdrop akan memicu onClose.'],
    ['closeOnEsc', 'boolean', 'true', 'Jika true, menekan tombol ESC akan memicu onClose.'],
    ['eyebrow', 'string', 'optional', 'Label kapital bagian atas header (mis. "MENU").'],
    ['header', 'ReactNode', 'optional', 'Elemen kustom untuk konten header.'],
    ['items', 'DrawerMenuItem[]', 'optional', 'Daftar konfigurasi menu item (otomatis merender DrawerHeader & DrawerNavItem jika tidak menggunakan children JSX).'],
    ['theme', "'simaya' | 'primary' | 'blue' | 'gray'", "'primary'", 'Skema warna item yang aktif.'],
    ['darkMode', 'boolean', 'false', 'Mengaktifkan tema gelap (latar gray-800, teks gray-50).'],
    ['children', 'ReactNode', 'optional', 'Komponen anak opsional (DrawerHeader, DrawerBody, dll) untuk layout kustom.'],
]

const headerProps: PropRow[] = [
    ['eyebrow', 'string', 'optional', 'Teks label atas header bergaya kapital (mis. "MENU").'],
    ['children', 'ReactNode', 'optional', 'Konten judul & deskripsi header opsional.'],
    ['closeLabel', 'string', "'Tutup drawer'", 'Aria-label untuk tombol tutup.'],
    ['showCloseButton', 'boolean', 'true', 'Menampilkan atau menyembunyikan tombol ikon X.'],
]

const navItemProps: PropRow[] = [
    ['icon', 'ReactNode', 'optional', 'Ikon di sisi kiri label menu.'],
    ['label', 'ReactNode', 'required', 'Judul / teks item menu.'],
    ['active', 'boolean', 'false', 'Menandai status aktif dengan latar pill berwarna.'],
    ['expanded', 'boolean', 'false', 'Menentukan apakah sub-menu sedang terbuka (menampilkan chevron).'],
    ['collapsible', 'boolean', 'false', 'Menampilkan ikon chevron tanda dropdown jika tidak memiliki anak.'],
    ['theme', "'simaya' | 'primary' | 'blue' | 'gray'", "'primary'", 'Skema warna sorotan saat item status active.'],
    ['href', 'string', 'optional', 'Link tujuan navigasi (mengubah elemen menjadi tag a).'],
    ['badge', 'ReactNode', 'optional', 'Elemen badge di sisi kanan label.'],
    ['onClick', '(e: MouseEvent) => void', 'optional', 'Handler saat menu item diklik.'],
    ['children', 'ReactNode', 'optional', 'Daftar DrawerSubItem ter-indentasi di bawah item.'],
]

const subItemProps: PropRow[] = [
    ['label', 'ReactNode', 'required', 'Judul / teks sub-item menu.'],
    ['active', 'boolean', 'false', 'Menandai status aktif.'],
    ['theme', "'simaya' | 'primary' | 'blue' | 'gray'", "'primary'", 'Skema warna teks saat aktif.'],
    ['href', 'string', 'optional', 'Link tujuan navigasi.'],
    ['onClick', '(e: MouseEvent) => void', 'optional', 'Handler saat sub-item diklik.'],
]

const triggerProps: PropRow[] = [
    ['icon', 'ReactNode', '<BarsFromLeft />', 'Ikon kustom untuk tombol trigger (default icon hamburger 27x16px gray-500).'],
    ['onClick', '() => void', 'optional', 'Fungsi callback saat tombol pemicu diklik untuk membuka Drawer.'],
]

const toc: TocEntry[] = [
    { id: 'variants', label: 'Variants' },
    { id: 'dark-mode', label: 'Dark Mode' },
    { id: 'menu', label: 'Menu' },
    { id: 'playground', label: 'Playground' },
    { id: 'penggunaan', label: 'Penggunaan' },
    { id: 'properties', label: 'Properties' },
]

function DummyPageContent({ darkMode = false, activeTitle = "Halaman Beranda" }: { darkMode?: boolean, activeTitle?: string }) {
    return (
        <div className={`flex-1 min-w-0 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-xl font-bold tracking-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activeTitle}</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Anda sedang berada di halaman utama {activeTitle}.
            </p>
        </div>
    )
}

function VariantPreview({
    title,
    description,
    children,
    darkMode = false,
}: {
    title: string
    description: string
    children: ReactNode
    darkMode?: boolean
}) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
            </div>
            <div className={`flex h-[500px] w-full items-center justify-center py-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50/80'}`}>
                <div className={`relative flex h-full w-[420px] max-w-full flex-col overflow-hidden rounded-none border-x shadow-md ${darkMode ? 'bg-gray-800 border-white/10 shadow-2xl' : 'bg-white border-gray-200'}`}>
                    {children}
                </div>
            </div>
        </article>
    )
}

function DrawerExampleCode({
    theme,
    showIcons = true,
    darkMode = false,
}: {
    theme: DrawerNavItemTheme
    showIcons?: boolean
    darkMode?: boolean
}) {
    return (
        <>
            {`import { Drawer } from '@ceplok-ui/design-kit-react'\n`}
            {showIcons && `import { ChartPie, FileLines, Cart, Inbox, Lock } from '@ceplok-ui/design-kit-react/icons/solid'\n`}
            {`\nconst [open, setOpen] = useState(true)\n\n`}
            {'<Drawer\n'}
            {'  open={open}\n'}
            {'  onClose={() => setOpen(false)}\n'}
            {'  position="right"\n'}
            {'  size="s"\n'}
            {'  eyebrow="MENU"\n'}
            {darkMode && <><H>{'  darkMode'}</H>{'\n'}</>}
            {'  theme='}
            <H>{`"${theme}"`}</H>
            {'\n  items={[\n'}
            {showIcons ? (
                <>
                    {'    { '}
                    <H>{'icon: <ChartPie />'}</H>
                    {', label: "Menu 1" },\n'}
                    {'    {\n'}
                    {'      '}
                    <H>{'icon: <FileLines />'}</H>
                    {',\n'}
                    {'      label: "Menu 2",\n'}
                    {'      children: [{ label: "sub menu 1" }, { label: "sub menu 2" }],\n'}
                    {'    },\n'}
                    {'    {\n'}
                    {'      '}
                    <H>{'icon: <Cart />'}</H>
                    {',\n'}
                    {'      label: "Menu 3",\n'}
                    {'      active: true,\n'}
                    {'      children: [\n'}
                    {'        { label: "sub menu 1", active: true },\n'}
                    {'        { label: "sub menu 2" },\n'}
                    {'        { label: "sub menu 3" },\n'}
                    {'      ],\n'}
                    {'    },\n'}
                    {'    { '}
                    <H>{'icon: <Inbox />'}</H>
                    {', label: "Menu 4" },\n'}
                    {'    {\n'}
                    {'      '}
                    <H>{'icon: <Lock />'}</H>
                    {',\n'}
                    {'      label: "Menu 5",\n'}
                    {'      children: [{ label: "sub menu 1" }, { label: "sub menu 2" }],\n'}
                    {'    },\n'}
                </>
            ) : (
                <>
                    {'    { label: "Menu 1" },\n'}
                    {'    {\n'}
                    {'      label: "Menu 2",\n'}
                    {'      children: [{ label: "sub menu 1" }, { label: "sub menu 2" }],\n'}
                    {'    },\n'}
                    {'    {\n'}
                    {'      label: "Menu 3",\n'}
                    {'      active: true,\n'}
                    {'      children: [\n'}
                    {'        { label: "sub menu 1", active: true },\n'}
                    {'        { label: "sub menu 2" },\n'}
                    {'        { label: "sub menu 3" },\n'}
                    {'      ],\n'}
                    {'    },\n'}
                    {'    { label: "Menu 4" },\n'}
                    {'    {\n'}
                    {'      label: "Menu 5",\n'}
                    {'      children: [{ label: "sub menu 1" }, { label: "sub menu 2" }],\n'}
                    {'    },\n'}
                </>
            )}
            {'  ]}\n'}
            {'/>'}
        </>
    )
}

export function DrawerPage() {
    const [openPlayground, setOpenPlayground] = useState(true)
    const [playgroundTheme, setPlaygroundTheme] = useState<DrawerNavItemTheme>('primary')
    const [showIcons, setShowIcons] = useState<boolean>(true)
    const [playgroundDarkMode, setPlaygroundDarkMode] = useState<boolean>(false)
    const [expandedMenu2, setExpandedMenu2] = useState(false)
    const [expandedMenu3, setExpandedMenu3] = useState(true)
    const [expandedMenu5, setExpandedMenu5] = useState(false)
    const [activeMenu, setActiveMenu] = useState('Menu 3 - sub menu 1')

    const playgroundItems: DrawerMenuItem[] = [
        { icon: <ChartPie className="size-5" />, label: 'Menu 1' },
        {
            icon: <FileLines className="size-5" />,
            label: 'Menu 2',
            children: [{ label: 'sub menu 1' }, { label: 'sub menu 2' }],
        },
        {
            icon: <Cart className="size-5" />,
            label: 'Menu 3',
            children: [
                { label: 'sub menu 1' },
                { label: 'sub menu 2' },
                { label: 'sub menu 3' },
            ],
        },
        { icon: <Inbox className="size-5" />, label: 'Menu 4' },
        {
            icon: <Lock className="size-5" />,
            label: 'Menu 5',
            children: [{ label: 'sub menu 1' }, { label: 'sub menu 2' }],
        },
    ]

    return (
        <UsulanPage
            eyebrow="Components · Drawer"
            title="Drawer"
            toc={toc}
            description="Drawer adalah panel navigasi off-canvas di tepi layar yang slide-in untuk menampilkan menu navigasi dan submenu tanpa meninggalkan konteks utama halaman."
        >
            {/* SECTION 1: VARIANTS (Terbuka & Tertutup) */}
            <FlowSection id="variants" title="Variants">
                <Lead>
                    Drawer dapat berada dalam kondisi <strong>Terbuka (Open Drawer)</strong> saat dipanggil oleh pengguna, maupun <strong>Tertutup (Closed Drawer)</strong> dengan pemicu tombol hamburger menu pada header halaman.
                </Lead>

                <div className="grid gap-6 lg:grid-cols-2">
                    <VariantPreview
                        title="1. Drawer Terbuka (Open Drawer)"
                        description="Drawer muncul dari sisi kanan secara mengambang (overlay) di atas tampilan layar mobile."
                    >
                        <div className="flex flex-col w-full h-full">
                            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                                        C
                                    </div>
                                    <span className="text-base font-bold tracking-tight text-gray-900">CEPLOK</span>
                                </div>
                                <DrawerTrigger />
                            </div>
                            <DummyPageContent />
                        </div>
                        <div className="absolute inset-0 bg-gray-900/20 z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-[250px] h-full border-l border-gray-200 bg-white flex flex-col rounded-none z-20 shadow-2xl">
                            <DrawerHeader eyebrow="MENU" />
                            <div className="p-3 space-y-1 flex-1 overflow-y-auto">
                                <DrawerNavItem icon={<ChartPie className="size-5" />} label="Menu 1" theme={playgroundTheme} />
                                <DrawerNavItem
                                    icon={<FileLines className="size-5" />}
                                    label="Menu 2"
                                    expanded={expandedMenu2}
                                    theme={playgroundTheme}
                                    onClick={() => setExpandedMenu2(!expandedMenu2)}
                                >
                                    <DrawerSubItem label="sub menu 1" />
                                    <DrawerSubItem label="sub menu 2" />
                                </DrawerNavItem>
                                <DrawerNavItem
                                    icon={<Cart className="size-5" />}
                                    label="Menu 3"
                                    active
                                    expanded={expandedMenu3}
                                    theme={playgroundTheme}
                                    onClick={() => setExpandedMenu3(!expandedMenu3)}
                                >
                                    <DrawerSubItem
                                        label="sub menu 1"
                                        active={activeMenu === 'Menu 3 - sub menu 1'}
                                        onClick={() => setActiveMenu('Menu 3 - sub menu 1')}
                                    />
                                    <DrawerSubItem
                                        label="sub menu 2"
                                        active={activeMenu === 'Menu 3 - sub menu 2'}
                                        onClick={() => setActiveMenu('Menu 3 - sub menu 2')}
                                    />
                                </DrawerNavItem>
                                <DrawerNavItem icon={<Inbox className="size-5" />} label="Menu 4" theme={playgroundTheme} />
                                <DrawerNavItem
                                    icon={<Lock className="size-5" />}
                                    label="Menu 5"
                                    expanded={expandedMenu5}
                                    theme={playgroundTheme}
                                    onClick={() => setExpandedMenu5(!expandedMenu5)}
                                >
                                    <DrawerSubItem label="sub menu 1" />
                                    <DrawerSubItem label="sub menu 2" />
                                </DrawerNavItem>
                            </div>
                        </div>
                    </VariantPreview>

                    <VariantPreview
                        title="2. Drawer Tertutup (Closed State / Page View)"
                        description="Tampilan utama layar mobile dengan topbar header dan icon hamburger drawer di bagian kanan."
                    >
                        <div className="flex flex-col w-full h-full">
                            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                                        C
                                    </div>
                                    <span className="text-base font-bold tracking-tight text-gray-900">CEPLOK</span>
                                </div>
                                <DrawerTrigger />
                            </div>
                            <DummyPageContent />
                        </div>
                    </VariantPreview>
                </div>
            </FlowSection>

            <FlowSection id="dark-mode" title="Dark Mode">
                <Lead>
                    Tampilan Drawer dalam mode gelap (<Hl>darkMode={"{true}"}</Hl>), menyesuaikan warna latar belakang, teks, dan status aktif.
                </Lead>

                <div className="grid gap-6 lg:grid-cols-2">
                    <VariantPreview
                        title="1. Drawer Terbuka (Open Drawer)"
                        description="Drawer muncul dari sisi kanan secara mengambang (overlay) di atas tampilan layar mobile."
                        darkMode
                    >
                        <div className="flex flex-col w-full h-full">
                            <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                                        C
                                    </div>
                                    <span className="text-base font-bold tracking-tight text-white">CEPLOK</span>
                                </div>
                                <DrawerTrigger darkMode />
                            </div>
                            <DummyPageContent darkMode />
                        </div>
                        <div className="absolute inset-0 bg-gray-900/40 z-10 pointer-events-none" />
                        <DrawerContext.Provider value={{ ...drawerContextDummy, darkMode: true }}>
                            <div className="absolute right-0 top-0 bottom-0 w-[250px] h-full border-l border-gray-700 bg-gray-800 flex flex-col rounded-none z-20 shadow-2xl">
                                <DrawerHeader eyebrow="MENU" />
                                <div className="p-3 space-y-1 flex-1 overflow-y-auto">
                                    <DrawerNavItem icon={<ChartPie className="size-5" />} label="Menu 1" theme={playgroundTheme} />
                                    <DrawerNavItem
                                        icon={<FileLines className="size-5" />}
                                        label="Menu 2"
                                        expanded={expandedMenu2}
                                        theme={playgroundTheme}
                                        onClick={() => setExpandedMenu2(!expandedMenu2)}
                                    >
                                        <DrawerSubItem label="sub menu 1" />
                                        <DrawerSubItem label="sub menu 2" />
                                    </DrawerNavItem>
                                    <DrawerNavItem
                                        icon={<Cart className="size-5" />}
                                        label="Menu 3"
                                        active
                                        expanded={expandedMenu3}
                                        theme={playgroundTheme}
                                        onClick={() => setExpandedMenu3(!expandedMenu3)}
                                    >
                                        <DrawerSubItem
                                            label="sub menu 1"
                                            active={activeMenu === 'Menu 3 - sub menu 1'}
                                            onClick={() => setActiveMenu('Menu 3 - sub menu 1')}
                                        />
                                        <DrawerSubItem
                                            label="sub menu 2"
                                            active={activeMenu === 'Menu 3 - sub menu 2'}
                                            onClick={() => setActiveMenu('Menu 3 - sub menu 2')}
                                        />
                                    </DrawerNavItem>
                                    <DrawerNavItem icon={<Inbox className="size-5" />} label="Menu 4" theme={playgroundTheme} />
                                    <DrawerNavItem
                                        icon={<Lock className="size-5" />}
                                        label="Menu 5"
                                        expanded={expandedMenu5}
                                        theme={playgroundTheme}
                                        onClick={() => setExpandedMenu5(!expandedMenu5)}
                                    >
                                        <DrawerSubItem label="sub menu 1" />
                                        <DrawerSubItem label="sub menu 2" />
                                    </DrawerNavItem>
                                </div>
                            </div>
                        </DrawerContext.Provider>
                    </VariantPreview>

                    <VariantPreview
                        title="2. Drawer Tertutup (Closed State / Page View)"
                        description="Tampilan utama layar mobile dengan topbar header dan icon hamburger drawer di bagian kanan."
                        darkMode
                    >
                        <div className="flex flex-col w-full h-full">
                            <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                                        C
                                    </div>
                                    <span className="text-base font-bold tracking-tight text-white">CEPLOK</span>
                                </div>
                                <DrawerTrigger darkMode />
                            </div>
                            <DummyPageContent darkMode />
                        </div>
                    </VariantPreview>
                </div>
            </FlowSection>

            {/* SECTION 2: MENU NAVIGASI */}
            <FlowSection id="menu" title="Menu">
                <Lead>
                    Menu pada Drawer dapat dikonfigurasi melalui prop <Hl>items</Hl> (Data-driven array) atau disusun manual menggunakan <Hl>DrawerNavItem</Hl> dan <Hl>DrawerSubItem</Hl>.
                </Lead>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="min-w-0">
                        <h3 className="mb-3 text-sm font-bold text-gray-900">Menu</h3>
                        <div className="mb-4 max-w-[300px] overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-xs space-y-1">
                            <DrawerNavItem icon={<ChartPie className="size-5" />} label="Menu 1" />
                            <DrawerNavItem icon={<FileLines className="size-5" />} label="Menu 2" />
                            <DrawerNavItem icon={<Inbox className="size-5" />} label="Menu 3" />
                        </div>

                        <SectionCode>
                            {"<DrawerNavItem\n"}
                            {"  icon={<ChartPie />}\n"}
                            {"  "}
                            <H>label=&quot;Menu 1&quot;</H>
                            {"\n/>\n"}
                            {"<DrawerNavItem\n"}
                            {"  icon={<FileLines />}\n"}
                            {"  "}
                            <H>label=&quot;Menu 2&quot;</H>
                            {"\n/>"}
                        </SectionCode>
                    </div>

                    <div className="min-w-0">
                        <h3 className="mb-3 text-sm font-bold text-gray-900">Sub Menu</h3>
                        <div className="mb-4 max-w-[300px] overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-xs">
                            <DrawerNavItem
                                icon={<Cart className="size-5" />}
                                label="Menu 3"
                                expanded
                                theme={playgroundTheme}
                            >
                                <DrawerSubItem label="sub menu 1" />
                                <DrawerSubItem label="sub menu 2" />
                            </DrawerNavItem>
                        </div>

                        <SectionCode>
                            {"<DrawerNavItem\n"}
                            {"  icon={<Cart />}\n"}
                            {"  "}
                            <H>label=&quot;Menu 3&quot;</H>
                            {"\n  "}
                            <H>expanded</H>
                            {"\n>\n"}
                            {"  <DrawerSubItem "}
                            <H>label=&quot;sub menu 1&quot; </H>
                            {" />\n"}
                            {"  <DrawerSubItem "}
                            <H>label=&quot;sub menu 2&quot; </H>
                            {" />\n"}
                            {"</DrawerNavItem>"}
                        </SectionCode>
                    </div>
                </div>
            </FlowSection>

            {/* SECTION 3: PLAYGROUND INTERAKTIF */}
            <FlowSection id="playground" title="Playground">
                <Lead>Uji coba perilaku dan variasi konfigurasi Drawer secara langsung pada tampilan mobile.</Lead>

                <div className={`flex h-[580px] w-full items-center justify-center py-4 overflow-hidden rounded-2xl border border-border ${playgroundDarkMode ? 'bg-gray-900' : 'bg-gray-50/80'}`}>
                    {/* Mobile Screen Canvas */}
                    <div className={`relative flex h-full w-[420px] max-w-full flex-col overflow-hidden rounded-none border-x shadow-md ${playgroundDarkMode ? 'border-white/10 bg-gray-800 shadow-2xl' : 'border-gray-200 bg-white'}`}>
                        {/* Topbar Header */}
                        <div className={`flex shrink-0 items-center justify-between border-b px-4 py-3.5 ${playgroundDarkMode ? 'border-white/10 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                                    C
                                </div>
                                <span className={`text-base font-bold tracking-tight ${playgroundDarkMode ? 'text-white' : 'text-gray-900'}`}>CEPLOK</span>
                            </div>
                            <DrawerTrigger darkMode={playgroundDarkMode} onClick={() => setOpenPlayground(!openPlayground)} />
                        </div>

                        {/* Mobile Page Content */}
                        <DummyPageContent darkMode={playgroundDarkMode} activeTitle={activeMenu} />

                        {/* Mobile Drawer Overlay & Panel */}
                        {openPlayground && (
                            <DrawerContext.Provider value={{ ...drawerContextDummy, darkMode: playgroundDarkMode }}>
                                <div
                                    className="absolute inset-0 z-10 bg-gray-900/20 transition-opacity"
                                    onClick={() => setOpenPlayground(false)}
                                />
                                <div className={`absolute right-0 top-0 bottom-0 z-20 flex h-full w-[260px] flex-col border-l shadow-2xl rounded-none ${playgroundDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <DrawerHeader eyebrow="MENU" onClose={() => setOpenPlayground(false)} />
                                    <div className="flex-1 space-y-1 overflow-y-auto p-3">
                                        {playgroundItems.map((item, index) => (
                                            <DrawerNavItem
                                                key={index}
                                                icon={showIcons ? item.icon : undefined}
                                                label={item.label}
                                                active={activeMenu === item.label || (item.children && item.children.some(sub => activeMenu === `${item.label} - ${sub.label}`))}
                                                expanded={index === 1 ? expandedMenu2 : index === 2 ? expandedMenu3 : index === 4 ? expandedMenu5 : false}
                                                theme={playgroundTheme}
                                                onClick={() => {
                                                    if (item.children) {
                                                        if (index === 1) setExpandedMenu2(!expandedMenu2)
                                                        if (index === 2) setExpandedMenu3(!expandedMenu3)
                                                        if (index === 4) setExpandedMenu5(!expandedMenu5)
                                                    } else {
                                                        setActiveMenu(String(item.label))
                                                        setOpenPlayground(false)
                                                    }
                                                }}
                                            >
                                                {item.children?.map((sub, sIdx) => (
                                                    <DrawerSubItem
                                                        key={sIdx}
                                                        label={sub.label}
                                                        active={activeMenu === `${item.label} - ${sub.label}`}
                                                        onClick={() => {
                                                            setActiveMenu(`${item.label} - ${sub.label}`)
                                                            setOpenPlayground(false)
                                                        }}
                                                        theme={playgroundTheme}
                                                    />
                                                ))}
                                            </DrawerNavItem>
                                        ))}
                                    </div>
                                </div>
                            </DrawerContext.Provider>
                        )}
                    </div>
                </div>

                <Controls>
                    <Control label="theme">
                        <Segmented
                            label="theme"
                            value={playgroundTheme}
                            onChange={(val) => setPlaygroundTheme(val as DrawerNavItemTheme)}
                            options={menuThemes}
                        />
                    </Control>
                    <Control label="icons">
                        <Segmented
                            label="icons"
                            value={showIcons ? 'true' : 'false'}
                            onChange={(val) => setShowIcons(val === 'true')}
                            options={iconOptions}
                        />
                    </Control>
                    <Control label="Mode">
                        <Segmented
                            label="Pilih mode"
                            value={playgroundDarkMode ? 'dark' : 'light'}
                            onChange={(val) => setPlaygroundDarkMode(val === 'dark')}
                            options={[
                                { value: 'light', label: 'Light' },
                                { value: 'dark', label: 'Dark' },
                            ]}
                        />
                    </Control>
                </Controls>
            </FlowSection>

            {/* SECTION 4: PENGGUNAAN */}
            <FlowSection id="penggunaan" title="Penggunaan">
                <Lead>Praktik terbaik dan panduan integrasi Drawer dalam aplikasi React.</Lead>

                <SectionCode>
                    <DrawerExampleCode theme={playgroundTheme} showIcons={showIcons} darkMode={playgroundDarkMode} />
                </SectionCode>
            </FlowSection>

            {/* SECTION 5: PROPERTIES */}
            <FlowSection id="properties" title="Properties">
                <Lead>Daftar lengkap props untuk komponen Drawer dan subkomponen pendukungnya.</Lead>
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Drawer Props</h3>
                        <PropsTable rows={drawerProps} />
                    </div>

                    <div>
                        <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DrawerHeader Props</h3>
                        <PropsTable rows={headerProps} />
                    </div>

                    <div>
                        <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DrawerNavItem Props</h3>
                        <PropsTable rows={navItemProps} />
                    </div>

                    <div>
                        <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DrawerSubItem Props</h3>
                        <PropsTable rows={subItemProps} />
                    </div>

                    <div>
                        <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DrawerTrigger Props</h3>
                        <PropsTable rows={triggerProps} />
                    </div>
                </div>
            </FlowSection>
        </UsulanPage>
    )
}
