import { useEffect, useState, type ReactNode } from 'react'

type Section = 'home' | 'components' | 'form' | 'foundations' | 'example'

const rail: { key: Section; label: string; route: string; icon: string }[] = [
  { key: 'home', label: 'Home', route: '/', icon: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-6h5v6' },
  { key: 'components', label: 'Components', route: '/components', icon: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z' },
  { key: 'form', label: 'Form', route: '/form', icon: 'M4 6h16M4 12h10M4 18h13M17.5 10.5l3 3-4.5 4.5H13v-3l4.5-4.5Z' },
  { key: 'foundations', label: 'Foundations', route: '/foundations', icon: 'M12 3.5c3.8 3.2 6.5 6 6.5 9.5a6.5 6.5 0 1 1-13 0c0-3.5 2.7-6.3 6.5-9.5Z' },
  { key: 'example', label: 'Example', route: '/example', icon: 'M4 5.5h16v13H4v-13Zm0 4h16M7.5 13h5m-5 2.5h8' },
]

/** Entri panel samping; `children` dipakai halaman yang punya sub-halaman. */
type NavItem = { label: string; route: string; children?: NavItem[] }

const sidebars: Record<string, { title: string; items: NavItem[] }> = {
  foundations: {
    title: 'Foundations',
    items: [
      { label: 'Overview', route: '/foundations' },
      { label: 'Colors', route: '/foundations/colors' },
      { label: 'Typography', route: '/foundations/typography' },
      { label: 'Spacing', route: '/foundations/spacing' },
      { label: 'Border', route: '/foundations/border' },
      { label: 'Elevation', route: '/foundations/elevation' },
      { label: 'Icons', route: '/foundations/icons' },
    ],
  },
  form: {
    title: 'Form',
    items: [
      { label: 'Overview', route: '/form' },
      {
        label: 'Input Field Form',
        route: '/form/input-field',
        children: [
          { label: 'Input Field', route: '/form/input-field/input' },
          { label: 'Floating Label', route: '/form/input-field/floating-label' },
          { label: 'Text Area', route: '/form/input-field/text-area' },
        ],
      },
      { label: 'Regular Select Form', route: '/form/select' },
      { label: 'Search Form', route: '/form/search' },
      { label: 'Upload Form', route: '/form/upload' },
      { label: 'Radio Button', route: '/form/radio' },
      { label: 'Toggle Button', route: '/form/toggle' },
      { label: 'Checkbox', route: '/form/checkbox' },
    ],
  },
  components: {
    title: 'Components',
    items: [
      { label: 'Overview', route: '/components' },
      { label: 'Container', route: '/components/container' },
      { label: 'Button', route: '/components/button' },
      { label: 'Badge', route: '/components/badge' },
      { label: 'Card', route: '/components/card' },
      { label: 'Footer', route: '/components/footer' },
    ],
  },
}

function sectionOf(path: string): Section {
  if (path.startsWith('/foundations')) return 'foundations'
  if (path.startsWith('/components')) return 'components'
  if (path.startsWith('/form')) return 'form'
  if (path.startsWith('/example')) return 'example'
  return 'home'
}

/** Daftar tautan panel samping — sub-halaman ditarik masuk di bawah induknya. */
function NavLinks({ items, path }: { items: NavItem[]; path: string }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.route} className="mt-1">
          <a
            href={`#${item.route}`}
            className={`ds-nav-link w-full ${path === item.route ? 'is-active' : ''}`}
            aria-current={path === item.route ? 'page' : undefined}
          >
            {item.label}
          </a>
          {item.children && (
            <div className="mt-1 ml-5 border-l border-border pl-2">
              {item.children.map((child) => (
                <a
                  key={child.route}
                  href={`#${child.route}`}
                  className={`ds-nav-link w-full py-2 text-[13px] ${path === child.route ? 'is-active' : ''}`}
                  aria-current={path === child.route ? 'page' : undefined}
                >
                  {child.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}

function Logo({ small }: { small?: boolean }) {
  return (
    <span className={`grid ${small ? 'size-8 p-1.5' : 'size-9 p-2'} grid-cols-2 gap-0.5 rounded-lg bg-primary-700 shadow-sm`}>
      <span className="rounded-[3px] bg-white" />
      <span className="rounded-[3px] bg-primary-300" />
      <span className="rounded-[3px] bg-primary-300" />
      <span className="rounded-[3px] bg-white" />
    </span>
  )
}

export function DocsLayout({ path, children }: { path: string; children: ReactNode }) {
  const section = sectionOf(path)
  const sidebar = sidebars[section] ?? null
  const [drawer, setDrawer] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', drawer)
    return () => document.body.classList.remove('overflow-hidden')
  }, [drawer])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ══ Top bar — mobile ══ */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <a href="#/" className="flex items-center gap-2.5" aria-label="Beranda">
          <Logo small />
          <span className="text-sm font-black tracking-tight text-gray-900">Design System</span>
        </a>
        <button onClick={() => setDrawer(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Buka navigasi">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* ══ Drawer — mobile ══ */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigasi">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-sm font-black tracking-tight text-gray-900">Navigasi</span>
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Tutup navigasi">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav className="px-4 py-5" onClick={(e) => (e.target as HTMLElement).closest('a') && setDrawer(false)}>
              <p className="mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">Area</p>
              {rail.map((item) => (
                <a key={item.key} href={`#${item.route}`} className={`ds-nav-link mt-1 w-full ${section === item.key ? 'is-active' : ''}`}>
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </a>
              ))}
              {sidebar && (
                <>
                  <p className="mt-6 mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">{sidebar.title}</p>
                  <NavLinks items={sidebar.items} path={path} />
                </>
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* ══ Icon rail — desktop ══ */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col items-center border-r border-border bg-white py-5 lg:flex">
        <a href="#/" aria-label="Beranda">
          <Logo />
        </a>
        <nav className="mt-8 flex flex-col gap-2" aria-label="Area utama">
          {rail.map((item) => (
            <a
              key={item.key}
              href={`#${item.route}`}
              className={`flex w-14 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-colors ${
                section === item.key ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
              aria-current={section === item.key ? 'page' : undefined}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </a>
          ))}
        </nav>
        {sidebar && (
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="mt-auto grid size-10 place-items-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? 'Sembunyikan panel' : 'Tampilkan panel'}
          >
            <svg className={`size-5 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5Zm5.5 0v14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 9.5 13.5 12l2.5 2.5" />
            </svg>
          </button>
        )}
      </aside>

      {/* ══ Sidebar drawer — desktop ══ */}
      {sidebar && (
        <aside
          className={`fixed inset-y-0 left-[76px] z-20 hidden w-[248px] overflow-y-auto border-r border-border bg-white transition-transform duration-300 ease-out lg:block ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-hidden={!sidebarOpen}
        >
          <div className="flex h-full flex-col px-5 py-7">
            <p className="px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">{sidebar.title}</p>
            <nav className="mt-2" aria-label={sidebar.title}>
              <NavLinks items={sidebar.items} path={path} />
            </nav>
            <div className="mt-auto rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-900">Foundation v1.0</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                React · Vite
                <br />
                Tailwind CSS v4
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* ══ Konten ══ */}
      <div
        className={`transition-[padding] duration-300 ease-out ${
          !sidebar ? 'lg:pl-[76px]' : sidebarOpen ? 'lg:pl-[324px]' : 'lg:pl-[76px]'
        }`}
      >
        <main>{children}</main>
      </div>
    </div>
  )
}
