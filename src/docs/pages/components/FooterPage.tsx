import { useState, type ReactNode } from 'react'
import { Footer } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { FacebookIcon, InstagramIcon, XIcon } from '../../socialIcons'
import { C, Mark, Segmented } from '../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'
import { asset } from "../../asset";

/**
 * Susunan halaman: tampilan dasar dulu, lalu beberapa bagian properti, lalu
 * perilaku responsif, playground, dan tabel lengkap — dengan daftar isi
 * menempel di kanan.
 *
 * Yang diberi bagian sendiri hanya properti yang keputusannya ada di tangan
 * pemakai dan tidak selesai dijelaskan satu baris di tabel, dikelompokkan
 * menurut bagian footer yang diaturnya (logo, menu, baris bawah, lebar isi).
 * `className` cukup ada di tabel Properties; menaikkan tiap prop jadi bagian
 * membuat daftar isi kehilangan gunanya sebagai peta halaman.
 */

const allMenus = Array.from({ length: 8 }, (_, i) => ({ label: `Menu ${i + 1}`, url: '#' }))

const footerSocials = [
  { label: 'Instagram', url: 'https://www.instagram.com/stasi/', icon: InstagramIcon },
  { label: 'X', url: 'https://x.com/stasi', icon: XIcon },
  { label: 'Facebook', url: '#', icon: FacebookIcon },
]

const copyrightText = '© 2025 Ministerium Fur Staatssicherheit'

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
    'fluid',
    'boolean',
    'false',
    'Bila true, isi footer melebar penuh mengikuti lebar footer — batas 1280px (max-w-7xl) dan pemusatannya dilepas, menyisakan padding kiri-kanan saja. Dipakai untuk footer situs yang menempel di tepi layar.',
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

const toc: TocEntry[] = [
  { id: 'dasar', label: 'Tampilan dasar' },
  { id: 'logo', label: 'logo · logoAlt · logoContent' },
  { id: 'menus', label: 'menus' },
  { id: 'baris-bawah', label: 'copyright · socials' },
  { id: 'fluid', label: 'fluid' },
  { id: 'responsif', label: 'Perilaku responsif' },
  // Playground di urutan belakang: tiap prop dan penjelasannya dibaca dulu,
  // baru pembaca menggabungkannya sendiri.
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

/**
 * Bingkai pratinjau: Footer selalu selebar wadahnya, jadi sudutnya dirapikan.
 * `label` dipakai saat satu bagian memuat lebih dari satu pratinjau.
 */
function Preview({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div>
      {label && <p className="mb-2 text-sm font-black text-gray-900">{label}</p>}
      <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5">
        <div className="overflow-hidden rounded-xl shadow-soft">{children}</div>
      </div>
    </div>
  )
}

const TextLogo = () => <span className="text-xl font-black text-white">STASI</span>

export function FooterPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')
  const [menuCount, setMenuCount] = useState(4)
  const [logoMode, setLogoMode] = useState<'image' | 'text'>('image')
  const [withSocials, setWithSocials] = useState(true)

  // Turunan untuk cuplikan kode di bagian Penggunaan — satu sumber dengan Playground.
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
    <UsulanPage
      eyebrow="Components"
      title="Footer"
      description="Penutup halaman berisi logo, navigasi ringkas, hak cipta, dan tautan media sosial. Tata letaknya mengikuti lebar footer itu sendiri, bukan lebar layar."
      toc={toc}
    >
      <FlowSection id="dasar" title="Tampilan dasar">
        <Lead>
          Satu blok utuh berlatar <C>gray-800</C>: baris atas berisi logo dan menu, lalu garis tipis,
          lalu baris bawah berisi hak cipta dan ikon sosial. Semua bagiannya opsional — yang tidak
          diisi tidak dirender, bukan disembunyikan lewat CSS.
        </Lead>

        <Preview>
          <Footer
            logo={asset("/images/stasi-logo.svg")}
            logoAlt="STASI — Ministerium Fur Staatssicherheit"
            menus={allMenus.slice(0, 4)}
            copyright={copyrightText}
            socials={footerSocials}
          />
        </Preview>

        <SectionCode>
          {"import { Footer } from '@stasi/design-kit-react'\n\n"}
          {'<Footer\n'}
          {'    logo="/images/stasi-logo.svg"\n'}
          {'    logoAlt="STASI — Ministerium Fur Staatssicherheit"\n'}
          {"    menus={[{ label: 'Menu 1', url: '/menu-1' }, …]}\n"}
          {`    copyright="${copyrightText}"\n`}
          {'    socials={socials}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="logo" title="logo · logoAlt · logoContent">
        <Lead>
          <C>logo</C> menerima URL berkas gambar dan dirender sebagai <C>{'<img>'}</C> setinggi 40px —
          44px saat footer selebar ≥ 768px — dengan lebar mengikuti rasio aslinya. <C>logoAlt</C> jadi
          teks alternatifnya; isi dengan nama instansi, bukan kata "logo", supaya wajar dibacakan
          pembaca layar.
        </Lead>
        <Lead>
          Bila logonya bukan berkas gambar — logo teks, <C>{'<svg>'}</C> inline, atau gabungan keduanya
          — pakai <C>logoContent</C>. Prop itu hanya berlaku saat <C>logo</C> kosong: kalau dua-duanya
          diisi, <C>logo</C> yang menang. Karena latarnya gelap, warnanya harus ditentukan sendiri.
        </Lead>

        <div className="space-y-6">
          <Preview label="logo — berkas gambar">
            <Footer
              logo={asset("/images/stasi-logo.svg")}
              logoAlt="STASI — Ministerium Fur Staatssicherheit"
              menus={allMenus.slice(0, 4)}
              copyright={copyrightText}
            />
          </Preview>

          <Preview label="logoContent — logo teks">
            <Footer logoContent={<TextLogo />} menus={allMenus.slice(0, 4)} copyright={copyrightText} />
          </Preview>
        </div>

        <SectionCode>
          {'<Footer\n'}
          {'    '}
          <Mark>logo</Mark>
          {'="/images/stasi-logo.svg"\n'}
          {'    '}
          <Mark>logoAlt</Mark>
          {'="STASI — Ministerium Fur Staatssicherheit"\n'}
          {'/>\n\n'}
          {'{/* Bukan berkas gambar — hanya dipakai bila logo kosong */}\n'}
          {'<Footer '}
          <Mark>logoContent</Mark>
          {'={<span className="text-xl font-black text-white">STASI</span>} … />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="menus" title="menus">
        <Lead>
          Daftar tautan navigasi. <C>url</C> boleh dikosongkan dan otomatis jadi <C>"#"</C>. Saat footer
          selebar ≥ 768px satu baris memuat paling banyak lima menu; menu keenam dan seterusnya turun ke
          baris berikutnya dan tetap sejajar kolom di atasnya. Bila <C>menus</C> kosong, blok navigasinya
          tidak dirender sama sekali.
        </Lead>

        <div className="space-y-6">
          <Preview label="Lima menu — masih satu baris">
            <Footer
              logo={asset("/images/stasi-logo.svg")}
              logoAlt="STASI"
              menus={allMenus.slice(0, 5)}
              copyright={copyrightText}
            />
          </Preview>

          <Preview label="Delapan menu — tiga sisanya turun">
            <Footer
              logo={asset("/images/stasi-logo.svg")}
              logoAlt="STASI"
              menus={allMenus}
              copyright={copyrightText}
            />
          </Preview>
        </div>

        <SectionCode>
          {'{/* Lima menu pertama satu baris, sisanya turun sendiri */}\n'}
          {'<Footer\n'}
          {'    '}
          <Mark>menus</Mark>
          {'={[\n'}
          {allMenus.map((m, i) => `        { label: '${m.label}', url: '/menu-${i + 1}' },\n`).join('')}
          {'    ]}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="baris-bawah" title="copyright · socials">
        <Lead>
          Keduanya mengisi baris bawah — <C>copyright</C> di kiri, <C>socials</C> di ujung kanan.{' '}
          <C>copyright</C> bertipe <C>ReactNode</C>, jadi tidak harus teks: boleh disisipi tautan
          kebijakan privasi atau nomor versi. Bila kosong, barisnya tidak dirender dan ikon sosial
          bergeser ke kiri.
        </Lead>
        <Lead>
          Pada <C>socials</C>, <C>icon</C> disisipkan sebagai elemen <C>{'<svg>'}</C> apa adanya —
          warnanya mengikuti <C>currentColor</C> sehingga ikut berubah saat hover. <C>label</C> menjadi{' '}
          <C>aria-label</C> tautannya, dan url selain <C>"#"</C> dibuka di tab baru dengan{' '}
          <C>rel="noopener noreferrer"</C>.
        </Lead>

        <Preview>
          <Footer
            logo={asset("/images/stasi-logo.svg")}
            logoAlt="STASI"
            menus={allMenus.slice(0, 4)}
            copyright={
              <>
                {copyrightText} ·{' '}
                <a href="#" className="underline underline-offset-2 hover:text-white">
                  Kebijakan privasi
                </a>
              </>
            }
            socials={footerSocials}
          />
        </Preview>

        <SectionCode>
          {"import { Instagram, X, Facebook } from './socialIcons'\n\n"}
          {'<Footer\n'}
          {'    '}
          <Mark>copyright</Mark>
          {'={\n'}
          {'        <>\n'}
          {'            © 2025 Ministerium Fur Staatssicherheit ·{" "}\n'}
          {'            <a href="/privasi">Kebijakan privasi</a>\n'}
          {'        </>\n'}
          {'    }\n'}
          {'    '}
          <Mark>socials</Mark>
          {'={[\n'}
          {"        { label: 'Instagram', url: 'https://instagram.com/stasi', icon: <Instagram /> },\n"}
          {"        { label: 'X',         url: 'https://x.com/stasi',         icon: <X /> },\n"}
          {"        { label: 'Facebook',  url: '#',                            icon: <Facebook /> },\n"}
          {'    ]}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="fluid" title="fluid">
        <Lead>
          Bawaannya isi footer dibatasi <C>max-w-7xl</C> (1280px) lalu dipusatkan, jadi di layar lebar
          logo dan menu berhenti sebelum tepi. <C>fluid</C> melepas batas itu: isinya melebar penuh
          mengikuti lebar footer, menyisakan padding kiri-kanan saja. Latar dan tinggi footernya sendiri
          tidak berubah — yang bergeser hanya letak isinya.
        </Lead>

        <Preview label="fluid — isi menempel ke tepi footer">
          <Footer
            fluid
            logo={asset("/images/stasi-logo.svg")}
            logoAlt="STASI"
            menus={allMenus.slice(0, 4)}
            copyright={copyrightText}
            socials={footerSocials}
          />
        </Preview>

        <SectionCode>
          {'<Footer '}
          <Mark>fluid</Mark>
          {' … />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="responsif" title="Perilaku responsif">
        <Lead>
          Ambang di bawah ini diukur dari{' '}
          <strong className="text-gray-900">lebar footer itu sendiri</strong>, bukan lebar layar —
          elemen <C>{'<footer>'}</C> dipasangi <C>@container</C>. Jadi footer yang ditaruh di kolom
          sempit pada layar desktop tetap tampil bertumpuk seperti di ponsel, dan sebaliknya. Cara
          mengeceknya: ganti kontrol <em>Tampilan</em> di Playground, atau perkecil jendela.
        </Lead>

        <div className="grid gap-4 sm:grid-cols-3">
          {responsiveBehaviour.map(([title, desc]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">{desc}</p>
            </article>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-body-sm leading-6 text-gray-500">
          Yang tidak berubah di ukuran mana pun: latar <C>bg-gray-800</C>, jarak atas-bawah 64px, lebar
          isi dibatasi <C>max-w-7xl</C> lalu dipusatkan — kecuali bila <C>fluid</C> diisi — dan garis
          pemisah tipis di atas baris hak cipta.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Keempat kontrol di bawah panggung menggabungkan prop-prop di atas dalam satu tampilan, dan
          bagian Penggunaan menuliskan kodenya. Deretan menu dibatasi lima per baris — pilih 6 atau 8
          menu untuk melihat sisanya turun ke baris berikutnya.
        </Lead>

        <Stage maxWidth={view === 'mobile' ? 'max-w-[390px]' : 'max-w-full'}>
          <div className="overflow-hidden rounded-xl shadow-soft">
            <Footer
              logo={logoMode === 'image' ? asset('/images/stasi-logo.svg') : undefined}
              logoAlt="STASI — Ministerium Fur Staatssicherheit"
              logoContent={logoMode === 'text' ? <TextLogo /> : undefined}
              menus={allMenus.slice(0, menuCount)}
              copyright={copyrightText}
              socials={withSocials ? footerSocials : []}
            />
          </div>
        </Stage>

        <Controls>
          <Control label="Tampilan">
            <Segmented
              label="Pilih lebar tampilan"
              value={view}
              onChange={setView}
              options={[
                {
                  value: 'mobile',
                  label: 'Mobile',
                  icon: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h2',
                },
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
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Mengikuti keempat kontrol di Playground — baris impor, logo, jumlah menu, ikon sosial, dan
          pembungkusnya ikut berubah. Nama prop yang sedang dikendalikan kontrol ditandai dengan warna
          biru, dan tombol <em>Salin</em> selalu menyalin persis yang sedang tampil.
        </Lead>
        <SectionCode flush>
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
              {'="/images/stasi-logo.svg"\n'}
              {`${ind}    `}
              <Mark>logoAlt</Mark>
              {'="STASI"\n'}
            </>
          )}
          {logoMode === 'text' && (
            <>
              {`${ind}    `}
              <Mark>logoContent</Mark>
              {'={<span className="text-xl font-black text-white">STASI</span>}\n'}
            </>
          )}
          {`${ind}    `}
          <Mark>menus</Mark>
          {'={[\n'}
          {menuLines.map((line) => `${ind}        ${line}\n`).join('')}
          {`${ind}    ]}\n`}
          {`${ind}    copyright="${copyrightText}"\n`}
          {withSocials && (
            <>
              {`${ind}    `}
              <Mark>socials</Mark>
              {'={[\n'}
              {`${ind}        { label: 'Instagram', url: 'https://instagram.com/stasi', icon: <Instagram /> },\n`}
              {`${ind}        { label: 'X',         url: 'https://x.com/stasi',         icon: <X /> },\n`}
              {`${ind}        { label: 'Facebook',  url: '#',                            icon: <Facebook /> },\n`}
              {`${ind}    ]}\n`}
            </>
          )}
          {`${ind}/>`}
          {view === 'mobile' && '\n</div>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Rangkuman seluruh prop, termasuk yang tidak diberi bagian sendiri di atas. Semuanya opsional —{' '}
          <C>{'<Footer />'}</C> tanpa prop tetap merender kerangkanya. Dua tipe pendukungnya:{' '}
          <C>FooterMenu</C> = <C>{'{ label: string; url?: string }'}</C> dan <C>FooterSocial</C> ={' '}
          <C>{'{ label?: string; url?: string; icon: ReactNode }'}</C>. Atribut HTML di luar daftar ini
          tidak diteruskan ke elemen <C>{'<footer>'}</C>.
        </Lead>
        <PropsTable rows={footerProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
