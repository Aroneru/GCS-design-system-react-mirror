import { useState } from 'react'
import { Footer } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { FacebookIcon, InstagramIcon, XIcon } from '../../socialIcons'
import { CodeBlock, ComponentPage, ControlLabel, H, Section, Segmented } from '../../pageKit'

const allMenus = [
  { label: 'Menu 1', url: '#' },
  { label: 'Menu 2', url: '#' },
  { label: 'Menu 3', url: '#' },
  { label: 'Menu 4', url: '#' },
  { label: 'Menu 5', url: '#' },
]

const footerSocials = [
  { label: 'Instagram', url: '#', icon: InstagramIcon },
  { label: 'X', url: '#', icon: XIcon },
  { label: 'Facebook', url: '#', icon: FacebookIcon },
]

const footerProps: PropRow[] = [
  ['logo', 'string | undefined', 'undefined', 'URL gambar logo. Kalau kosong, isi lewat logoContent.'],
  ['logoAlt', 'string', 'Logo', 'Teks alternatif untuk logo.'],
  ['logoContent', 'ReactNode', '—', 'Logo kustom; dipakai jika prop logo tidak diisi.'],
  ['menus', 'FooterMenu[]', '[]', "Daftar tautan: [{ label, url }, ..]"],
  ['copyright', 'ReactNode', 'undefined', 'Teks hak cipta di baris bawah.'],
  ['socials', 'FooterSocial[]', '[]', 'Ikon sosial: { label, url, icon }. icon = elemen <svg>.'],
]

const responsiveBehaviour: [string, string][] = [
  [
    'Sempit (< 768px)',
    'Logo, menu, hak cipta, dan ikon sosial tersusun bertumpuk. Menu membungkus ke baris berikutnya bila ruang kurang.',
  ],
  [
    'Lebar (≥ 768px)',
    'Logo di kiri dengan menu di tengah pada satu baris. Hak cipta di kiri, ikon sosial di kanan.',
  ],
]

export function FooterPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')
  const [menuCount, setMenuCount] = useState(4)

  return (
    <ComponentPage
      title="Footer"
      description="Penutup halaman berisi logo, navigasi ringkas, hak cipta, dan tautan media sosial. Tata letaknya mengikuti lebar footer itu sendiri, bukan lebar layar."
    >
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Preview</h2>

        {/* Area preview */}
        <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-6">
          <div
            className={`mx-auto overflow-hidden rounded-xl shadow-soft transition-[max-width] duration-300 ease-out ${
              view === 'mobile' ? 'max-w-[390px]' : 'max-w-full'
            }`}
          >
            <Footer
              logo="/images/komdigi-logo.svg"
              logoAlt="Komdigi — Kementerian Komunikasi dan Digital"
              menus={allMenus.slice(0, menuCount)}
              copyright="© 2025 Kementerian Komunikasi dan Digital"
              socials={footerSocials}
            />
          </div>
        </div>

        {/* Kontrol */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ControlLabel>Tampilan</ControlLabel>
            <Segmented
              label="Pilih lebar tampilan"
              value={view}
              onChange={setView}
              options={[
                { value: 'mobile', label: 'Mobile', icon: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h2' },
                { value: 'desktop', label: 'Desktop', icon: 'M3 5h18v11H3V5Zm6 15h6m-3-4v4' },
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <ControlLabel>Jumlah menu</ControlLabel>
            <Segmented
              label="Pilih jumlah menu"
              value={menuCount}
              onChange={setMenuCount}
              itemClassName="w-9 justify-center"
              options={[2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
            />
          </div>
        </div>

        <p className="mt-3 text-body-sm text-gray-500">
          Tata letak berubah otomatis: bertumpuk saat sempit, satu baris saat lebar. Karena komponen memakai{' '}
          <em>container query</em>, preview di atas benar-benar berganti susunan, bukan sekadar mengecil.
        </p>
      </section>

      <Section title="Perilaku responsif">
        <div className="grid gap-4 sm:grid-cols-2">
          {responsiveBehaviour.map(([title, desc]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">{desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { Instagram, X, Facebook } from './socialIcons'\n\n"}
          {'<Footer\n'}
          {'    logo="/images/komdigi-logo.svg"\n'}
          {'    logoAlt="Komdigi"\n'}
          {'    menus={[\n'}
          {"        { label: 'Menu 1', url: '/menu-1' },\n"}
          {"        { label: 'Menu 2', url: '/menu-2' },\n"}
          {'    ]}\n'}
          {'    copyright="© 2025 Kementerian Komunikasi dan Digital"\n'}
          {'    socials={[\n'}
          {"        { label: 'Instagram', url: 'https://instagram.com/komdigi', icon: "}
          <H>{'<Instagram />'}</H>
          {' },\n'}
          {"        { label: 'X',         url: 'https://x.com/komdigi',         icon: "}
          <H>{'<X />'}</H>
          {' },\n'}
          {"        { label: 'Facebook',  url: '#',                            icon: "}
          <H>{'<Facebook />'}</H>
          {' },\n'}
          {'    ]}\n'}
          {'/>'}
        </CodeBlock>
        <p className="mt-3 text-body-sm text-gray-500">
          Elemen <code className="text-xs font-bold text-gray-700">&lt;svg&gt;</code> disisipkan langsung,
          sehingga warnanya mengikuti{' '}
          <code className="text-xs font-bold text-gray-700">currentColor</code> dan bisa berubah saat hover.
        </p>
      </Section>

      <Section title="Properties">
        <PropsTable rows={footerProps} />
      </Section>
    </ComponentPage>
  )
}
