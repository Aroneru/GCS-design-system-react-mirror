import { useState, type ReactNode } from 'react'
import { BarsFromLeft } from '../../../lib/icons/outline'
import {
    Cart,
    ChartPie,
    FileLines,
    Inbox,
    Lock,
} from 'flowbite-react-icons/solid'
import {
    Drawer,
    DrawerHeader,
    DrawerNavItem,
    DrawerSubItem,
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
    { value: 'purple', label: 'Purple' },
]

const drawerProps: PropRow[] = [
    ['open', 'boolean', 'required', 'Menentukan apakah Drawer sedang terbuka.'],
    ['onClose', '() => void', 'required', 'Fungsi callback saat Drawer diminta untuk ditutup.'],
    ['position', "'right' | 'left' | 'top' | 'bottom'", "'right'", 'Arah kemunculan panel Drawer pada layar.'],
    ['size', "'s' | 'm' | 'l' | 'xl' | 'full'", "'m'", 'Ukuran lebar (atau tinggi pada top/bottom) dari panel Drawer.'],
    ['closeOnOverlayClick', 'boolean', 'true', 'Jika true, mengklik backdrop akan memicu onClose.'],
    ['closeOnEsc', 'boolean', 'true', 'Jika true, menekan tombol ESC akan memicu onClose.'],
    ['children', 'ReactNode', 'required', 'Komponen anak berupa DrawerHeader, DrawerBody, dan DrawerFooter.'],
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
    ['theme', "'purple' | 'primary' | 'blue' | 'gray'", "'primary'", 'Skema warna sorotan saat item status active.'],
    ['children', 'ReactNode', 'optional', 'Daftar DrawerSubItem ter-indentasi di bawah item.'],
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
        <div className="flex-1 min-w-0 bg-white p-6 overflow-y-auto space-y-5">
            <div className="space-y-2.5">
                <div className="h-3.5 w-1/3 rounded-full bg-gray-100" />
                <div className="h-2.5 w-full rounded-full bg-gray-100" />
                <div className="h-2.5 w-11/12 rounded-full bg-gray-100" />
                <div className="h-2.5 w-4/5 rounded-full bg-gray-100" />
                <div className="h-2.5 w-3/4 rounded-full bg-gray-100" />
            </div>

            <div className="flex h-44 w-full items-center justify-center rounded-xl bg-gray-100/80 text-gray-300">
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

            <div className="space-y-2.5">
                <div className="h-2.5 w-full rounded-full bg-gray-100" />
                <div className="h-2.5 w-11/12 rounded-full bg-gray-100" />
                <div className="h-2.5 w-full rounded-full bg-gray-100" />
                <div className="h-2.5 w-4/5 rounded-full bg-gray-100" />
                <div className="h-2.5 w-3/4 rounded-full bg-gray-100" />
                <div className="h-2.5 w-5/6 rounded-full bg-gray-100" />
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
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
            </div>
            <div className="h-[460px] w-full overflow-hidden bg-white flex flex-col relative">
                {children}
            </div>
        </article>
    )
}

function DrawerExampleCode({
    theme,
}: {
    theme: DrawerNavItemTheme
}) {
    return (
        <>
            {`import { Drawer } from '@ceplok-ui/design-kit-react'\n`}
            {`import { ChartPie, FileLines, Cart, Inbox, Lock } from '@ceplok-ui/design-kit-react/icons/solid'\n\n`}
            {'const [open, setOpen] = useState(true)\n'}
            {'const [expandedMenu2, setExpandedMenu2] = useState(false)\n'}
            {'const [expandedMenu3, setExpandedMenu3] = useState(true)\n'}
            {'const [expandedMenu5, setExpandedMenu5] = useState(false)\n\n'}
            {'<Drawer open={open} onClose={() => setOpen(false)} position="right" size="s">\n'}
            {'  <Drawer.Header eyebrow="MENU" />\n'}
            {'  <Drawer.Body className="p-4 space-y-1">\n'}
            {'    <Drawer.NavItem icon={<ChartPie />} label="Menu 1" />\n'}
            {'    <Drawer.NavItem\n'}
            {'      icon={<FileLines />}\n'}
            {'      label="Menu 2"\n'}
            {'      expanded={expandedMenu2}\n'}
            {'      onClick={() => setExpandedMenu2(!expandedMenu2)}\n'}
            {'    >\n'}
            {'      <Drawer.SubItem label="sub menu 1" />\n'}
            {'      <Drawer.SubItem label="sub menu 2" />\n'}
            {'    </Drawer.NavItem>\n'}
            {'    <Drawer.NavItem\n'}
            {'      icon={<Cart />}\n'}
            {'      label="Menu 3"\n'}
            {'      active\n'}
            {'      expanded={expandedMenu3}\n'}
            {'      theme='}
            <H>{`"${theme}"`}</H>
            {'\n      onClick={() => setExpandedMenu3(!expandedMenu3)}\n'}
            {'    >\n'}
            {'      <Drawer.SubItem label="sub menu 1" active />\n'}
            {'      <Drawer.SubItem label="sub menu 2" />\n'}
            {'      <Drawer.SubItem label="sub menu 3" />\n'}
            {'    </Drawer.NavItem>\n'}
            {'    <Drawer.NavItem icon={<Inbox />} label="Menu 4" />\n'}
            {'    <Drawer.NavItem\n'}
            {'      icon={<Lock />}\n'}
            {'      label="Menu 5"\n'}
            {'      expanded={expandedMenu5}\n'}
            {'      onClick={() => setExpandedMenu5(!expandedMenu5)}\n'}
            {'    >\n'}
            {'      <Drawer.SubItem label="sub menu 1" />\n'}
            {'      <Drawer.SubItem label="sub menu 2" />\n'}
            {'    </Drawer.NavItem>\n'}
            {'  </Drawer.Body>\n'}
            {'</Drawer>'}
        </>
    )
}

export function DrawerPage() {
    const [openPlayground, setOpenPlayground] = useState(true)
    const [playgroundTheme, setPlaygroundTheme] = useState<DrawerNavItemTheme>('primary')
    const [expandedMenu2, setExpandedMenu2] = useState(false)
    const [expandedMenu3, setExpandedMenu3] = useState(true)
    const [expandedMenu5, setExpandedMenu5] = useState(false)
    const [activeSubMenu, setActiveSubMenu] = useState('sub1')

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
                        <DummyPageContent />
                        <div className="absolute inset-0 bg-gray-900/20 z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-[250px] h-full border-l border-gray-200 bg-white flex flex-col rounded-none z-20 shadow-2xl">
                            <DrawerHeader eyebrow="MENU" showCloseButton={false} />
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
                            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-white shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-6 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-[10px]">
                                        C
                                    </div>
                                    <span className="text-xs font-bold text-gray-900 tracking-tight">Ceplok UI</span>
                                </div>
                                <button
                                    type="button"
                                    className="p-1 rounded-lg text-slate-700 hover:bg-gray-100 transition-colors focus:outline-none shrink-0"
                                    aria-label="Hamburger menu"
                                >
                                    <BarsFromLeft className="size-5 text-slate-700" />
                                </button>
                            </div>
                            <DummyPageContent />
                        </div>
                    </VariantPreview>
                </div>
            </FlowSection>

            {/* SECTION 2: MENU NAVIGASI */}
            <FlowSection id="menu" title="Menu">
                <Lead>
                    Menu pada Drawer disusun menggunakan <code>DrawerNavItem</code> dan <code>DrawerSubItem</code>. Anda dapat membuat item menu biasa maupun item menu dengan submenu bertingkat.
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

                <div className="flex h-[520px] justify-center overflow-hidden rounded-2xl border border-border bg-surface-subtle">
                    {/* Mobile Screen Canvas - Full height setinggi Stage container */}
                    <div className="relative flex h-full w-[340px] flex-col overflow-hidden rounded-none border-x border-gray-200 bg-white shadow-md">
                        {/* Topbar Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-lg bg-primary-600 text-[10px] font-bold text-white">
                                    C
                                </div>
                                <span className="text-xs font-bold tracking-tight text-gray-900">Ceplok UI</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpenPlayground(!openPlayground)}
                                className="shrink-0 rounded-lg p-1 text-slate-700 transition-colors hover:bg-gray-100 focus:outline-none"
                                aria-label="Toggle drawer"
                            >
                                <BarsFromLeft className="size-5 text-slate-700" />
                            </button>
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
                                        <DrawerNavItem
                                            icon={<ChartPie className="size-5" />}
                                            label="Menu 1"
                                            theme={playgroundTheme}
                                        />
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
                                            <DrawerSubItem
                                                label="sub menu 3"
                                                active={activeSubMenu === 'sub3'}
                                                onClick={() => setActiveSubMenu('sub3')}
                                            />
                                        </DrawerNavItem>
                                        <DrawerNavItem
                                            icon={<Inbox className="size-5" />}
                                            label="Menu 4"
                                            theme={playgroundTheme}
                                        />
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
                </Controls>
            </FlowSection>

            {/* SECTION 4: PENGGUNAAN */}
            <FlowSection id="penggunaan" title="Penggunaan">
                <Lead>Praktik terbaik dan panduan integrasi Drawer dalam aplikasi React.</Lead>

                <SectionCode>
                    <DrawerExampleCode theme={playgroundTheme} />
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
                </div>
            </FlowSection>
        </UsulanPage>
    )
}
