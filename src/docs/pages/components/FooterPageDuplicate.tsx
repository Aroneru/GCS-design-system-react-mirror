import { useState } from 'react'
import { Footer } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { FacebookIcon, InstagramIcon, XIcon } from '../../socialIcons'
import { C, CodeBlock, ComponentPage, Mark, Section, Segmented } from '../../pageKit'
import { Control, Controls } from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'
import { asset } from "../../asset";

const allMenus = Array.from({ length: 8 }, (_, i) => ({ label: `Menu ${i + 1}`, url: '#' }))

const footerSocials = [
  { label: 'Instagram', url: 'https://www.instagram.com/kemkomdigi/', icon: InstagramIcon },
  { label: 'X', url: 'https://x.com/kemkomdigi', icon: XIcon },
  { label: 'Facebook', url: '', icon: FacebookIcon },
]

const footerProps: PropRow[] = [
  [
    'logo',
    'string',
    'undefined',
    'URL berkas gambar logo, dirender sebagai <img> setinggi 40px (44px saat footer ≥ 768px) dengan lebar mengikuti rasio aslinya. Bila diisi, logoContent diabaikan.',
  ],
  [
    'logoAlt',
    'string',
    "'Logo'",
    'Teks alternatif gambar logo; hanya berlaku bersama prop logo. Isi dengan nama instansinya, bukan kata "logo", agar wajar dibacakan pembaca layar.',
  ],
  [
    'logoContent',
    'ReactNode',
    'undefined',
    'Logo berupa elemen — misal logo teks atau <svg> inline. Dipakai hanya bila prop logo kosong, dan warnanya diatur sendiri supaya kontras di atas latar gelap.',
  ],
  [
    'menus',
    'FooterMenu[]',
    '[]',
    'Tautan navigasi: [{ label, url }, ..]. url boleh dikosongkan dan otomatis jadi "#". Saat footer ≥ 768px satu baris memuat maksimal 5 menu; sisanya turun ke baris berikutnya. Bila kosong, blok navigasi tidak dirender sama sekali.',
  ],
  [
    'copyright',
    'ReactNode',
    'undefined',
    'Isi baris bawah sisi kiri, umumnya teks hak cipta. Boleh berupa elemen, misal disisipi tautan kebijakan privasi. Bila kosong, barisnya tidak dirender.',
  ],
  [
    'socials',
    'FooterSocial[]',
    '[]',
    'Ikon media sosial: [{ label, url, icon }, ..]. icon berupa elemen <svg> yang mewarisi currentColor sehingga ikut berubah saat hover; label jadi aria-label; url selain "#" dibuka di tab baru dengan rel="noopener noreferrer".',
  ],
  [
    'className',
    'string',
    'undefined',
    'Kelas tambahan untuk elemen <footer> terluar — untuk mengganti warna latar atau menyetel jarak. Elemen ini sekaligus titik ukur @container, jadi hindari memberinya lebar tetap.',
  ],
]

const responsiveBehaviour: [string, string][] = [
  [
    'Sempit (< 576px)',
    'Semua bagian bertumpuk satu kolom: logo, menu, garis pemisah, hak cipta, lalu ikon sosial. Menu tetap mengalir menyamping dan membungkus ke baris berikutnya sesuai ruang. Padding kiri-kanan 24px.',
  ],
  [
    'Sedang (576–767px)',
    'Hak cipta dan ikon sosial naik jadi satu baris — hak cipta di kiri, ikon di kanan. Logo dan menu masih bertumpuk karena butuh ruang lebih lega sebelum bisa sebaris.',
  ],
  [
    'Lebar (≥ 768px)',
    'Logo di kiri, menu mengisi sisa ruang di tengah dan tersusun berkolom: maksimal 5 per baris, sisanya turun dan sejajar kolom di atasnya. Padding kiri-kanan melebar jadi 48px dan logo sedikit membesar.',
  ],
]

export function FooterPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')
  const [menuCount, setMenuCount] = useState(4)
  const [logoMode, setLogoMode] = useState<'image' | 'text'>('image')
  const [withSocials, setWithSocials] = useState(true)

  // Turunan untuk cuplikan kode di bawah playground — satu sumber dengan preview.
  const ind = view === 'mobile' ? '    ' : ''
  const summary = [
    view === 'mobile' ? 'Mobile · dibatasi 390px' : 'Desktop · lebar penuh',
    `${menuCount} menu`,
    logoMode === 'image' ? 'logo gambar' : 'logo teks',
    withSocials ? 'dengan ikon sosial' : 'tanpa ikon sosial',
  ].join(' · ')
  const menuLines = allMenus
    .slice(0, menuCount)
    .map((m, i) => `{ label: '${m.label}', url: '/menu-${i + 1}' },`)

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
              logo={logoMode === 'image' ? asset('/images/komdigi-logo.svg') : undefined}
              logoAlt="Komdigi — Ministerium Fur Staatssicherheit"
              logoContent={
                logoMode === 'text' ? (
                  <span className="text-xl font-black text-white">Komdigi</span>
                ) : undefined
              }
              menus={allMenus.slice(0, menuCount)}
              copyright="© 2025 Ministerium Fur Staatssicherheit"
              socials={withSocials ? footerSocials : []}
            />
          </div>
        </div>

        {/* Kontrol — susunannya mengikuti Playground halaman usulan (Controls/Control). */}
        <Controls>
          <Control label="Tampilan">
            <Segmented
              label="Pilih lebar tampilan"
              value={view}
              onChange={setView}
              options={[
                { value: 'mobile', label: 'Mobile', icon: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h2' },
                { value: 'desktop', label: 'Desktop', icon: 'M3 5h18v11H3V5Zm6 15h6m-3-4v4' },
              ]}
            />
          </Control>

          <Control label="Jumlah menu">
            <Segmented
              label="Pilih jumlah menu"
              value={menuCount}
              onChange={setMenuCount}
              itemClassName="w-9 justify-center"
              options={[2, 4, 5, 6, 8].map((n) => ({ value: n, label: String(n) }))}
            />
          </Control>

          <Control label="Logo">
            <Segmented
              label="Pilih jenis logo"
              value={logoMode}
              onChange={setLogoMode}
              options={[
                { value: 'image', label: 'Gambar' },
                { value: 'text', label: 'Teks' },
              ]}
            />
          </Control>

          <Control label="Ikon sosial">
            <Segmented
              label="Tampilkan ikon sosial"
              value={withSocials}
              onChange={setWithSocials}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Tata letak berubah otomatis: bertumpuk saat sempit, satu baris saat lebar. Deretan menu dibatasi 5
          per baris — pilih 6 atau 8 menu untuk melihat sisanya turun ke baris berikutnya. Karena komponen
          memakai <em>container query</em>, preview di atas benar-benar berganti susunan, bukan sekadar
          mengecil.
        </p>

        <p className="mt-6 mb-3 text-body-sm text-gray-500">
          Kode di bawah mengikuti keempat kontrol di atas — baris impor, logo, jumlah menu, ikon sosial, dan
          pembungkusnya ikut berubah. Nama prop yang sedang dikendalikan kontrol di atas ditandai dengan warna
          biru. Tombol <em>Salin</em> selalu menyalin persis yang sedang tampil.
        </p>

        <CodeBlock>
          {"import { Footer } from '@stasi/design-kit-react'\n"}
          {withSocials && "import { Instagram, X, Facebook } from './socialIcons'\n"}
          {'\n'}
          {`{/* ${summary} */}\n`}
          {view === 'mobile' && (
            <>
              {'{/* Footer tidak perlu tahu ini mobile — susunannya mengikuti\n'}
              {'    lebar pembungkusnya sendiri lewat container query. */}\n'}
              {'<div className="'}
              <Mark>max-w-[390px]</Mark>
              {'">\n'}
            </>
          )}
          {`${ind}<Footer\n`}
          {logoMode === 'image' && (
            <>
              {`${ind}    `}
              <Mark>logo</Mark>
              {'="/images/komdigi-logo.svg"\n'}
              {`${ind}    `}
              <Mark>logoAlt</Mark>
              {'="Komdigi"\n'}
            </>
          )}
          {logoMode === 'text' && (
            <>
              {`${ind}    `}
              <Mark>logoContent</Mark>
              {'={<span className="text-xl font-black text-white">Komdigi</span>}\n'}
            </>
          )}
          {`${ind}    `}
          <Mark>menus</Mark>
          {'={[\n'}
          {menuLines.map((line) => `${ind}        ${line}\n`).join('')}
          {`${ind}    ]}\n`}
          {`${ind}    copyright="© 2025 Ministerium Fur Staatssicherheit"\n`}
          {withSocials && (
            <>
              {`${ind}    `}
              <Mark>socials</Mark>
              {'={[\n'}
              {`${ind}        { label: 'Instagram', url: 'https://instagram.com/komdigi', icon: <Instagram /> },\n`}
              {`${ind}        { label: 'X',         url: 'https://x.com/komdigi',         icon: <X /> },\n`}
              {`${ind}        { label: 'Facebook',  url: '#',                            icon: <Facebook /> },\n`}
              {`${ind}    ]}\n`}
            </>
          )}
          {`${ind}/>`}
          {view === 'mobile' && '\n</div>'}
        </CodeBlock>

        <p className="mt-3 text-body-sm text-gray-500">
          Elemen <code className="text-xs font-bold text-gray-700">&lt;svg&gt;</code> disisipkan langsung,
          sehingga warnanya mengikuti{' '}
          <code className="text-xs font-bold text-gray-700">currentColor</code> dan bisa berubah saat hover.
        </p>
      </section>

      <Section title="Perilaku responsif">
        <p className="mb-4 max-w-5xl text-body-sm leading-6 text-gray-500">
          Ambang di bawah ini diukur dari <strong className="text-gray-900">lebar footer itu sendiri</strong>,
          bukan lebar layar — elemen <C>{'<footer>'}</C> dipasangi <C>@container</C>. Jadi footer yang ditaruh
          di kolom sempit pada layar desktop tetap tampil bertumpuk seperti di ponsel, dan sebaliknya. Cara
          mengeceknya: ganti kontrol <em>Tampilan</em> di Preview, atau perkecil jendela.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {responsiveBehaviour.map(([title, desc]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">{desc}</p>
            </article>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-body-sm leading-6 text-gray-500">
          Yang tidak berubah di ukuran mana pun: latar <C>bg-gray-800</C>, jarak atas-bawah 64px, lebar isi
          dibatasi <C>max-w-7xl</C> lalu dipusatkan, dan garis pemisah tipis di atas baris hak cipta.
        </p>
      </Section>

      <Section title="Properties">
        <p className="mb-4  text-body-sm leading-6 text-gray-500">
          Semua prop opsional — <C>{'<Footer />'}</C> tanpa prop tetap merender kerangkanya. Dua tipe
          pendukungnya: <C>FooterMenu</C> = <C>{'{ label: string; url?: string }'}</C> dan{' '}
          <C>FooterSocial</C> = <C>{'{ label?: string; url?: string; icon: ReactNode }'}</C>. Atribut HTML di
          luar daftar ini tidak diteruskan ke elemen <C>{'<footer>'}</C>.
        </p>
        <PropsTable rows={footerProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
