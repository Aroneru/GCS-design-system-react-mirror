/**
 * Struktur navigasi dokumentasi — satu sumber untuk icon rail, panel samping,
 * dan angka ringkas di halaman Home. Dipisah dari DocsLayout supaya berkas
 * komponen hanya mengekspor komponen (syarat react-refresh).
 */

export type Section = 'home' | 'components' | 'form' | 'foundations' | 'example'

export const rail: { key: Section; label: string; route: string; icon: string }[] = [
  { key: 'home', label: 'Home', route: '/', icon: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-6h5v6' },
  { key: 'components', label: 'Components', route: '/components', icon: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z' },
  { key: 'form', label: 'Form', route: '/form', icon: 'M4 6h16M4 12h10M4 18h13M17.5 10.5l3 3-4.5 4.5H13v-3l4.5-4.5Z' },
  { key: 'foundations', label: 'Foundations', route: '/foundations', icon: 'M12 3.5c3.8 3.2 6.5 6 6.5 9.5a6.5 6.5 0 1 1-13 0c0-3.5 2.7-6.3 6.5-9.5Z' },
  { key: 'example', label: 'Example', route: '/example', icon: 'M4 5.5h16v13H4v-13Zm0 4h16M7.5 13h5m-5 2.5h8' },
]

/**
 * Entri panel samping; `children` dipakai halaman yang punya sub-halaman.
 * `soon` menandai halaman yang komponennya belum ada (masih PlaceholderPage)
 * supaya tidak ikut terhitung sebagai elemen yang tersedia.
 */
export type NavItem = {
  label: string
  route: string
  children?: NavItem[]
  soon?: boolean
  /**
   * Menandai halaman yang mendokumentasikan komponen yang sama dengan entri
   * lain — misal susunan "usulan" — supaya tidak ikut terhitung dua kali pada
   * angka ringkas di halaman Home.
   */
  alt?: boolean
}

export const sidebars: Record<string, { title: string; items: NavItem[] }> = {
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
          { label: 'Input Field · Usulan', route: '/form/input-field/input-usulan', alt: true },
          { label: 'Floating Label', route: '/form/input-field/floating-label' },
          {
            label: 'Floating Label · Usulan',
            route: '/form/input-field/floating-label-usulan',
            alt: true,
          },
          { label: 'Text Area', route: '/form/input-field/text-area' },
          { label: 'Text Area · Usulan', route: '/form/input-field/text-area-usulan', alt: true },
        ],
      },
      { label: 'Regular Select Form', route: '/form/select' },
      { label: 'Regular Select Form · Usulan', route: '/form/select-usulan', alt: true },
      { label: 'Search Form', route: '/form/search', soon: true },
      { label: 'Upload Form', route: '/form/upload', soon: true },
      { label: 'Radio Button', route: '/form/radio' },
      { label: 'Radio Button · Usulan', route: '/form/radio-usulan', alt: true },
      { label: 'Toggle Button', route: '/form/toggle' },
      { label: 'Toggle Button · Usulan', route: '/form/toggle-usulan', alt: true },
      { label: 'Checkbox', route: '/form/checkbox' },
      { label: 'Checkbox · Usulan', route: '/form/checkbox-usulan', alt: true },
    ],
  },
  components: {
    title: 'Components',
    items: [
      { label: 'Overview', route: '/components' },
      { label: 'Container', route: '/components/container' },
      { label: 'Container · Usulan', route: '/components/container-usulan', alt: true },
      { label: 'Button', route: '/components/button' },
      { label: 'Badge', route: '/components/badge' },
      { label: 'Card', route: '/components/card' },
      { label: 'Card · Usulan', route: '/components/card-usulan', alt: true },
      { label: 'Navbar', route: '/components/navbar' },
      { label: 'Footer', route: '/components/footer' },
      { label: 'Footer · Usulan', route: '/components/footer-usulan', alt: true },
    ],
  },
}
