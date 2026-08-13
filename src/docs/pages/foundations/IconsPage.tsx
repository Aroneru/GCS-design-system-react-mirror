import { useState, type ComponentType } from 'react'
// Diimpor lewat modul milik library sendiri (bukan langsung dari
// flowbite-react-icons) supaya dokumentasi memakai jalur yang sama dengan
// yang dianjurkan ke consumer: @tpl/design-kit-react/icons/*.
import * as OutlineIcons from '../../../lib/icons/outline'
import * as SolidIcons from '../../../lib/icons/solid'
import { brandIcons } from '../../../lib/brandIconRegistry'
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

const toc: TocEntry[] = [
  { id: 'solid', label: 'Ikon solid' },
  { id: 'outline', label: 'Ikon outline' },
  { id: 'brand', label: 'Logo brand' },
  { id: 'impor', label: 'Jalur impor' },
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
      description="Seluruh ikon diekspor ulang oleh design kit — solid untuk status & penekanan, outline untuk aksi & navigasi, plus logo brand untuk tautan sosial. Impor selalu lewat @tpl/design-kit-react agar sumber ikon terkendali di satu tempat. Ikon mewarisi warna teks (currentColor)."
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

        <SectionCode>{`import { Bell } from '@tpl/design-kit-react/icons/solid'

<Bell className="size-5 text-primary-600" />`}</SectionCode>
      </FlowSection>

      <FlowSection id="outline" title={`Ikon outline · ${outlineEntries.length}`}>
        <Lead>Gaya default untuk aksi, navigasi, dan elemen antarmuka umum.</Lead>

        <article className="ds-card p-5 sm:p-7">
          <FlowbiteGrid entries={outlineEntries} q={q} />
        </article>

        <SectionCode>{`import { Home, Search } from '@tpl/design-kit-react/icons/outline'

<Home className="size-5 text-gray-700" />
<Search className="size-4 text-gray-500" />`}</SectionCode>
      </FlowSection>

      <FlowSection id="brand" title={`Logo brand · ${brandIcons.length}`}>
        <Lead>
          Logo sosial dan teknologi untuk footer, tautan berbagi, dan halaman login — satu-satunya tempat
          logo brand ditampilkan. Berbeda dari solid &amp; outline, logo brand ada di barrel utama{' '}
          <C>@tpl/design-kit-react</C> karena namanya tidak bertabrakan.
        </Lead>

        <article className="ds-card p-5 sm:p-7">
          <BrandGrid q={q} />
        </article>

        <SectionCode>{`import { Github, Instagram, ReactLogo } from '@tpl/design-kit-react'

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
                  ['Solid', '@tpl/design-kit-react/icons/solid'],
                  ['Outline', '@tpl/design-kit-react/icons/outline'],
                  ['Logo brand', '@tpl/design-kit-react'],
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
