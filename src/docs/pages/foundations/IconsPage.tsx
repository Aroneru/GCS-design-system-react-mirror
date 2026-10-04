import { useState, type ComponentType, type ReactNode } from 'react'
// Diimpor lewat modul milik library sendiri (bukan langsung dari
// flowbite-react-icons) supaya dokumentasi memakai jalur yang sama dengan
// yang dianjurkan ke consumer: @ceplok-ui/design-kit-react/icons/*.
import * as OutlineIcons from '../../../lib/icons/outline'
import * as SolidIcons from '../../../lib/icons/solid'
import { brandIcons } from '../../../lib/brandIconRegistry'
import { Github, Icon, Linkedin, Whatsapp, Youtube } from '../../../lib'
import { DocSnippet } from '../../DocSnippet'
import { C } from '../../pageKit'
import {
  FlowSection,
  Lead,
  PrincipleList,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'

type IconCmp = ComponentType<{ className?: string }>

/**
 * Set solid bawaan Flowbite ikut memuat 30 logo brand (Github, Facebook, X, …)
 * dan set outline memuat AppleFull. Logo-logo itu sudah punya galerinya sendiri
 * di bagian "Logo brand", jadi di sini dikeluarkan supaya tiap ikon hanya
 * muncul di satu tempat.
 */
const normalize = (name: string) => name.toLowerCase().replace(/[-_]/g, '')
const brandNames = new Set(brandIcons.map(([slug]) => normalize(slug)))

// AppleFull tidak ada di registry kita, tapi tetap logo Apple (varian penuh).
const extraBrandNames = new Set(['applefull'])

const isBrandLogo = (name: string) => {
  const key = normalize(name)
  return brandNames.has(key) || extraBrandNames.has(key)
}

const withoutBrands = (mod: object) =>
  (Object.entries(mod) as [string, IconCmp][]).filter(([name]) => !isBrandLogo(name))

const outlineEntries = withoutBrands(OutlineIcons)
const solidEntries = withoutBrands(SolidIcons)

/** Cuplikan per baris pada bagian "Cara pakai" — kode, contoh render, dan penjelasannya. */
const snippets = {
  component: '<Home className="size-5" />',
  color: '<Bell className="size-5 text-primary-600" />',
  // Nama yang sama di kedua set tidak bisa diimpor dua kali apa adanya,
  // jadi salah satunya diberi alias.
  alias: `import { Bell } from '@ceplok-ui/design-kit-react/icons/outline'
import { Bell as BellSolid } from '@ceplok-ui/design-kit-react/icons/solid'

<Bell className="size-5 text-gray-500" />
<BellSolid className="size-5 text-primary-600" />`,
  brand: '<Github className="size-5" />',
  // Warna resmi masing-masing perusahaan, bukan token kit. Ditulis utuh
  // karena Tailwind memindai kelas secara harfiah.
  brandColor: [
    '<Youtube className="size-5 text-[#FF0000]" />',
    '<Whatsapp className="size-5 text-[#25D366]" />',
    '<Linkedin className="size-5 text-[#0A66C2]" />',
  ].join('\n'),
  wrapper: '<Icon className="text-gray-500">\n  <Search />\n</Icon>',
}

/**
 * Contoh aksesibilitas. Ikon solid dan outline tidak membawa `aria-hidden`
 * sendiri, jadi atribut itu memang harus ditulis — beda dengan logo brand dan
 * pembungkus `Icon`, yang sudah memasangnya.
 */
const a11yCode = `{/* Ikon dekoratif — sembunyikan dari pembaca layar */}
<Home className="size-4" aria-hidden="true" />

{/* Ikon tanpa teks pendamping — wajib diberi label */}
<button type="button">
    <Search className="size-5" />
    <span className="sr-only">Cari</span>
</button>`

const toc: TocEntry[] = [
  { id: 'solid', label: 'Ikon solid' },
  { id: 'outline', label: 'Ikon outline' },
  { id: 'brand', label: 'Logo brand' },
  { id: 'impor', label: 'Jalur impor' },
  { id: 'cara-pakai', label: 'Cara pakai' },
  { id: 'prinsip', label: 'Prinsip penggunaan' },
]

function FlowbiteGrid({ entries, q }: { entries: [string, IconCmp][]; q: string }) {
  const needle = q.toLowerCase().replace(/[\s-]/g, '')
  const filtered = q === '' ? entries : entries.filter(([n]) => n.toLowerCase().includes(needle))
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1">
      {filtered.map(([name, Cmp]) => (
        <div
          key={name}
          title={`<${name} />`}
          className="flex aspect-square items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
        >
          <Cmp className="size-5" />
        </div>
      ))}
    </div>
  )
}

/**
 * Petak pratinjau di bagian "Cara pakai" — disorot seperti petak galeri di
 * atas, lengkap dengan nama komponen saat kursor berhenti. Bedanya, hanya
 * latarnya yang berubah: warna ikon di bagian itu justru yang sedang
 * diperagakan, jadi tidak boleh ikut berganti saat disorot.
 */
function Petak({ name, children }: { name: string; children: ReactNode }) {
  return (
    <span
      title={name}
      className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-primary-50"
    >
      {children}
    </span>
  )
}

function BrandGrid({ q }: { q: string }) {
  const needle = q.toLowerCase().replace(/[\s-]/g, '')
  const filtered = q === '' ? brandIcons : brandIcons.filter(([n]) => n.replace(/-/g, '').includes(needle))
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1">
      {filtered.map(([name, Cmp]) => (
        <div
          key={name}
          title={name}
          className="flex aspect-square items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
        >
          <Cmp className="size-5" />
        </div>
      ))}
    </div>
  )
}

export function IconsPage() {
  const [q, setQ] = useState('')

  return (
    <UsulanPage
      eyebrow="Foundations · Icons"
      title="Icons"
      description="Seluruh ikon diekspor ulang oleh design kit — solid untuk status & penekanan, outline untuk aksi & navigasi, plus logo brand untuk tautan sosial. Impor selalu lewat @ceplok-ui/design-kit-react agar sumber ikon terkendali di satu tempat. Ikon mewarisi warna teks (currentColor)."
      toc={toc}
    >
      {/*
        Pencarian menyaring ketiga galeri sekaligus, jadi letaknya di atas
        seluruh bagian dan bukan di dalam salah satunya.
      */}
      <div>
        <label className="sr-only" htmlFor="icon-search">Cari ikon</label>
        <div className="relative max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <OutlineIcons.Search className="size-4" />
          </span>
          <input
            id="icon-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari ikon… (mis. arrow, user, chart)"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pr-4 pl-9 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          />
        </div>
      </div>

      <FlowSection id="solid" title={`Ikon solid · ${solidEntries.length}`}>
        <Lead>
          Untuk status aktif, indikator, dan momen yang butuh bobot visual lebih. Arahkan kursor untuk
          melihat nama komponennya. Logo brand tidak ikut di sini — lihat bagian <C>Logo brand</C> di bawah.
        </Lead>

        <article className="ds-card p-5 sm:p-7">
          <FlowbiteGrid entries={solidEntries} q={q} />
        </article>

        <SectionCode>{`import { Bell } from '@ceplok-ui/design-kit-react/icons/solid'

<Bell className="size-5 text-primary-600" />`}</SectionCode>
      </FlowSection>

      <FlowSection id="outline" title={`Ikon outline · ${outlineEntries.length}`}>
        <Lead>Gaya default untuk aksi, navigasi, dan elemen antarmuka umum.</Lead>

        <article className="ds-card p-5 sm:p-7">
          <FlowbiteGrid entries={outlineEntries} q={q} />
        </article>

        <SectionCode>{`import { Home, Search } from '@ceplok-ui/design-kit-react/icons/outline'

<Home className="size-5 text-gray-700" />
<Search className="size-4 text-gray-500" />`}</SectionCode>
      </FlowSection>

      <FlowSection id="brand" title={`Logo brand · ${brandIcons.length}`}>
        <Lead>
          Logo sosial dan teknologi untuk footer, tautan berbagi, dan halaman login — satu-satunya tempat
          logo brand ditampilkan. Berbeda dari solid &amp; outline, logo brand ada di barrel utama{' '}
          <C>@ceplok-ui/design-kit-react</C> karena namanya tidak bertabrakan.
        </Lead>

        <article className="ds-card p-5 sm:p-7">
          <BrandGrid q={q} />
        </article>

        <SectionCode>{`import { Github, Instagram, ReactLogo } from '@ceplok-ui/design-kit-react'

<Github className="size-5" />
<Instagram className="size-5 text-purple-600" />
<ReactLogo className="size-5" />`}</SectionCode>
      </FlowSection>

      <FlowSection id="impor" title="Jalur impor">
        <Lead>
          Solid dan outline dipisah ke subpath masing-masing karena banyak nama ikon yang sama persis di
          kedua set (mis. <C>Home</C>, <C>Bell</C>) — memisahkannya juga menjaga <em>tree-shaking</em> tetap
          bekerja.
        </Lead>

        <article className="ds-card overflow-hidden">
          <div className="ds-scroll-x overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="border-b border-border bg-surface-subtle text-xs font-black tracking-wide text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3">Set</th>
                  <th className="px-5 py-3">Import path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Solid', '@ceplok-ui/design-kit-react/icons/solid'],
                  ['Outline', '@ceplok-ui/design-kit-react/icons/outline'],
                  ['Logo brand', '@ceplok-ui/design-kit-react'],
                ].map(([set, path]) => (
                  <tr key={set}>
                    <td className="px-5 py-3 font-bold text-gray-900">{set}</td>
                    <td className="px-5 py-3"><code className="text-xs font-bold text-primary-700">{path}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </FlowSection>

      <FlowSection id="cara-pakai" title="Cara pakai">
        <Lead>
          Setiap ikon adalah komponen React biasa — ukuran dan warnanya diatur lewat <C>className</C>.
          Nama yang ada di kedua set, seperti <C>Home</C> atau <C>Bell</C>, dibedakan lewat alias saat
          keduanya dipakai bersamaan: <C>{"import { Bell as BellSolid }"}</C>.
        </Lead>

        <div className="space-y-4">
          <DocSnippet
            code={snippets.component}
            description={<>Komponen React — ukuran diatur lewat class <C>size-*</C>.</>}
            preview={
              <Petak name="<Home />">
                <OutlineIcons.Home className="size-6 text-gray-700" />
              </Petak>
            }
          />
          <DocSnippet
            code={snippets.color}
            description={
              <>
                Warna mengikuti <C>currentColor</C> — atur lewat class <C>text-*</C>.
              </>
            }
            preview={
              <Petak name="<Bell />">
                <SolidIcons.Bell className="size-6 text-primary-600" />
              </Petak>
            }
          />
          <DocSnippet
            code={snippets.alias}
            description={
              <>
                Bila kedua set dipakai di berkas yang sama, beri alias pada salah satunya. Pola yang
                sering muncul: outline untuk keadaan biasa, solid untuk keadaan aktif — misalnya lonceng
                notifikasi yang berubah padat saat ada pesan baru.
              </>
            }
            preview={
              <div className="flex items-center">
                <Petak name="<Bell />">
                  <OutlineIcons.Bell className="size-6 text-gray-500" />
                </Petak>
                <Petak name="<BellSolid />">
                  <SolidIcons.Bell className="size-6 text-primary-600" />
                </Petak>
              </div>
            }
          />
          <DocSnippet
            code={snippets.brand}
            description="Logo brand dalam warna netral — ikut warna teks di sekitarnya, cocok untuk deretan tautan sosial yang tidak ingin mencolok."
            preview={
              <Petak name="<Github />">
                <Github className="size-6 text-gray-700" />
              </Petak>
            }
          />
          <DocSnippet
            code={snippets.brandColor}
            description={
              <>
                Logo brand dalam warna resmi perusahaannya, ditulis sebagai nilai arbitrer — kit tidak
                menyediakan token untuk warna pihak lain. Jangan pakai <C>text-brand</C>: itu warna utama
                kit ini, bukan warna logonya.
              </>
            }
            preview={
              // Tiga petak 36px butuh 108px, sedangkan sel pratinjau hanya
              // menyisakan 79px setelah padding dan garisnya. `-mx-4` meminjam
              // 16px dari padding di tiap sisi; margin negatif yang simetris
              // menjaga barisnya tetap di tengah.
              <div className="-mx-4 flex items-center">
                <Petak name="<Youtube />">
                  <Youtube className="size-6 text-[#FF0000]" />
                </Petak>
                <Petak name="<Whatsapp />">
                  <Whatsapp className="size-6 text-[#25D366]" />
                </Petak>
                <Petak name="<Linkedin />">
                  <Linkedin className="size-6 text-[#0A66C2]" />
                </Petak>
              </div>
            }
          />
          <DocSnippet
            code={snippets.wrapper}
            description={
              <>
                Alternatif lewat pembungkus <C>Icon</C> — ukurannya seragam (bawaan <C>size-5</C>),
                otomatis <C>aria-hidden</C>, dan bisa membungkus SVG milik Anda sendiri.
              </>
            }
            preview={
              <Petak name="<Icon><Search /></Icon>">
                <Icon className="text-gray-500">
                  <OutlineIcons.Search />
                </Icon>
              </Petak>
            }
          />
        </div>

        <SectionCode>{a11yCode}</SectionCode>
      </FlowSection>

      <FlowSection id="prinsip" title="Prinsip penggunaan">
        <PrincipleList
          items={[
            <>Konsisten dalam satu konteks — jangan mencampur outline dan solid pada kelompok aksi yang sama.</>,
            <>Selaraskan ukuran ikon dengan teks: <C>size-4</C> untuk body small, <C>size-5</C> untuk body, <C>size-6</C> untuk heading.</>,
            <>Ikon dekoratif wajib <C>aria-hidden="true"</C>; ikon berdiri sendiri butuh label (mis. <C>sr-only</C>).</>,
            <>Jangan mengubah warna ikon terpisah dari teks pendampingnya — keduanya memakai token warna yang sama.</>,
          ]}
        />
      </FlowSection>
    </UsulanPage>
  )
}
