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
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Segmented } from '../../pageKit'
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
    ['expanded', 'boolean', 'false', 'Menentukan apakah sub-menu sedang terbuka (menampilkan chevron atas/bawah).'],
    ['collapsible', 'boolean', 'false', 'Menampilkan ikon chevron tanda dropdown jika tidak memiliki anak.'],
    ['theme', "'simaya' | 'primary' | 'blue' | 'gray'", "'primary'", 'Skema warna sorotan saat item status active.'],
    ['children', 'ReactNode', 'optional', 'Daftar DrawerSubItem ter-indentasi di bawah item.'],
]

const triggerProps: PropRow[] = [
    ['icon', 'ReactNode', '<BarsFromLeft />', 'Ikon kustom untuk tombol trigger (default icon hamburger 27x16px gray-500).'],
    ['onClick', '() => void', 'optional', 'Fungsi callback saat tombol pemicu diklik untuk membuka Drawer.'],
]

const toc: TocEntry[] = [
    { id: 'variants', label: 'Variants' },
    { id: 'menu', label: 'Menu' },
    { id: 'playground', label: 'Playground' },
    { id: 'penggunaan', label: 'Penggunaan' },
    { id: 'properties', label: 'Properties' },
]

function DummyPageContent() {
    return (
        <div className="flex-1 min-w-0 bg-white p-6 overflow-y-auto space-y-6">
            <div className="space-y-3">
                <div className="h-4 w-1/3 rounded-full bg-gray-200" />
                <div className="h-3.5 w-full rounded-full bg-gray-100" />
                <div className="h-3.5 w-11/12 rounded-full bg-gray-100" />
                <div className="h-3.5 w-4/5 rounded-full bg-gray-100" />
                <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
            </div>

            <div className="flex h-44 w-full shrink-0 items-center justify-center rounded-xl bg-gray-100/80 text-gray-300">
                <svg
                    className="size-12 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.811a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            <div className="space-y-3">
                <div className="h-3.5 w-full rounded-full bg-gray-100" />
                <div className="h-3.5 w-11/12 rounded-full bg-gray-100" />
                <div className="h-3.5 w-full rounded-full bg-gray-100" />
                <div className="h-3.5 w-4/5 rounded-full bg-gray-100" />
                <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
                <div className="h-3.5 w-5/6 rounded-full bg-gray-100" />
            </div>

            <div className="space-y-3">
                <div className="h-4 w-1/4 rounded-full bg-gray-200" />
                <div className="h-3.5 w-full rounded-full bg-gray-100" />
                <div className="h-3.5 w-10/12 rounded-full bg-gray-100" />
                <div className="h-3.5 w-4/5 rounded-full bg-gray-100" />
                <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="h-20 rounded-lg bg-gray-100" />
                <div className="h-20 rounded-lg bg-gray-100" />
            </div>

            <div className="space-y-3">
                <div className="h-3.5 w-full rounded-full bg-gray-100" />
                <div className="h-3.5 w-11/12 rounded-full bg-gray-100" />
                <div className="h-3.5 w-4/5 rounded-full bg-gray-100" />
                <div className="h-3.5 w-2/3 rounded-full bg-gray-100" />
            </div>
        </div>
    )
}

function VariantPreview({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
            </div>
            <div className="flex h-[500px] w-full items-center justify-center bg-gray-50/80 py-4">
                <div className="relative flex h-full w-[420px] max-w-full flex-col overflow-hidden rounded-none border-x border-gray-200 bg-white shadow-md">
                    {children}
                </div>
            </div>
        </article>
    )
}

function DrawerExampleCode({
    theme,
    showIcons = true,
}: {
    theme: DrawerNavItemTheme
    showIcons?: boolean
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
    const [expandedMenu2, setExpandedMenu2] = useState(false)
    const [expandedMenu3, setExpandedMenu3] = useState(true)
    const [expandedMenu5, setExpandedMenu5] = useState(false)
    const [activeSubMenu, setActiveSubMenu] = useState('sub1')

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
            active: true,
            children: [
                { label: 'sub menu 1', active: true },
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
                                        active={activeSubMenu === 'sub1'}
                                        onClick={() => setActiveSubMenu('sub1')}
                                    />
                                    <DrawerSubItem
                                        label="sub menu 2"
                                        active={activeSubMenu === 'sub2'}
                                        onClick={() => setActiveSubMenu('sub2')}
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

            {/* SECTION 2: MENU NAVIGASI */}
            <FlowSection id="menu" title="Menu">
                <Lead>
                    Menu pada Drawer dapat dikonfigurasi melalui prop <code>items</code> (Data-driven array) atau disusun manual menggunakan <code>DrawerNavItem</code> dan <code>DrawerSubItem</code>.
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

                <div className="flex h-[580px] w-full items-center justify-center py-4 overflow-hidden rounded-2xl border border-border bg-gray-50/80">
                    {/* Mobile Screen Canvas */}
                    <div className="relative flex h-full w-[420px] max-w-full flex-col overflow-hidden rounded-none border-x border-gray-200 bg-white shadow-md">
                        {/* Topbar Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                                    C
                                </div>
                                <span className="text-base font-bold tracking-tight text-gray-900">CEPLOK</span>
                            </div>
                            <DrawerTrigger onClick={() => setOpenPlayground(!openPlayground)} />
                        </div>

                        {/* Mobile Page Content */}
                        <DummyPageContent />

                        {/* Mobile Drawer Overlay & Panel */}
                        {openPlayground && (
                            <>
                                <div
                                    className="absolute inset-0 z-10 bg-gray-900/20 transition-opacity"
                                    onClick={() => setOpenPlayground(false)}
                                />
                                <div className="absolute right-0 top-0 bottom-0 z-20 flex h-full w-[260px] flex-col border-l border-gray-200 bg-white shadow-2xl rounded-none">
                                    <DrawerHeader eyebrow="MENU" onClose={() => setOpenPlayground(false)} />
                                    <div className="flex-1 space-y-1 overflow-y-auto p-3">
                                        {playgroundItems.map((item, index) => (
                                            <DrawerNavItem
                                                key={index}
                                                icon={showIcons ? item.icon : undefined}
                                                label={item.label}
                                                active={item.active}
                                                expanded={index === 1 ? expandedMenu2 : index === 2 ? expandedMenu3 : index === 4 ? expandedMenu5 : false}
                                                theme={playgroundTheme}
                                                onClick={() => {
                                                    if (index === 1) setExpandedMenu2(!expandedMenu2)
                                                    if (index === 2) setExpandedMenu3(!expandedMenu3)
                                                    if (index === 4) setExpandedMenu5(!expandedMenu5)
                                                }}
                                            >
                                                {item.children?.map((sub, sIdx) => (
                                                    <DrawerSubItem
                                                        key={sIdx}
                                                        label={sub.label}
                                                        active={sub.active}
                                                        theme={playgroundTheme}
                                                    />
                                                ))}
                                            </DrawerNavItem>
                                        ))}
                                    </div>
                                </div>
                            </>
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
                </Controls>
            </FlowSection>

            {/* SECTION 4: PENGGUNAAN */}
            <FlowSection id="penggunaan" title="Penggunaan">
                <Lead>Praktik terbaik dan panduan integrasi Drawer dalam aplikasi React.</Lead>

                <SectionCode>
                    <DrawerExampleCode theme={playgroundTheme} showIcons={showIcons} />
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
                        <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DrawerTrigger Props</h3>
                        <PropsTable rows={triggerProps} />
                    </div>
                </div>
            </FlowSection>
        </UsulanPage>
    )
}
