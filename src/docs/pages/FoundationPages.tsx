import { useState, type ComponentType, type ReactNode } from 'react'
import * as OutlineIcons from 'flowbite-react-icons/outline'
import * as SolidIcons from 'flowbite-react-icons/solid'
import { brandIcons } from '../../lib/brandIconRegistry'
import { DocHero } from '../DocHero'
import { DocUsage } from '../DocUsage'
import { DocSnippet } from '../DocSnippet'
import { RawIcon } from '../rawIcons'
import { brandSvgs, brandNames } from '../svgAssets'

/* ---------- Layout bantu ---------- */

function Page({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">{children}</div>
    </>
  )
}

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-5">
      <p className="ds-eyebrow">{eyebrow}</p>
      <h3 className="mt-2 text-heading-3 font-black text-gray-900">{title}</h3>
      {children && <p className="mt-2 max-w-2xl text-body-sm text-gray-500">{children}</p>}
    </div>
  )
}

function Principles({ items }: { items: ReactNode[] }) {
  return (
    <div className="mt-8">
      <article className="ds-card p-6">
        <p className="ds-eyebrow">Prinsip penggunaan</p>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}

const C = ({ children }: { children: ReactNode }) => <code className="text-xs font-bold text-gray-700">{children}</code>

/* ============ SPACING ============ */

const spacingScale: [string, string, string, string][] = [
  ['0', '0px', '0px', 'w-0'], ['px', '1px', '1px', 'w-px'], ['0.5', '0.125rem', '2px', 'w-0.5'],
  ['1', '0.25rem', '4px', 'w-1'], ['1.5', '0.375rem', '6px', 'w-1.5'], ['2', '0.5rem', '8px', 'w-2'],
  ['2.5', '0.625rem', '10px', 'w-2.5'], ['3', '0.75rem', '12px', 'w-3'], ['3.5', '0.875rem', '14px', 'w-3.5'],
  ['4', '1rem', '16px', 'w-4'], ['5', '1.25rem', '20px', 'w-5'], ['6', '1.5rem', '24px', 'w-6'],
  ['7', '1.75rem', '28px', 'w-7'], ['8', '2rem', '32px', 'w-8'], ['9', '2.25rem', '36px', 'w-9'],
  ['10', '2.5rem', '40px', 'w-10'], ['11', '2.75rem', '44px', 'w-11'], ['12', '3rem', '48px', 'w-12'],
  ['14', '3.5rem', '56px', 'w-14'], ['16', '4rem', '64px', 'w-16'], ['20', '5rem', '80px', 'w-20'],
  ['24', '6rem', '96px', 'w-24'], ['28', '7rem', '112px', 'w-28'], ['32', '8rem', '128px', 'w-32'],
  ['36', '9rem', '144px', 'w-36'], ['40', '10rem', '160px', 'w-40'], ['44', '11rem', '176px', 'w-44'],
  ['48', '12rem', '192px', 'w-48'], ['52', '13rem', '208px', 'w-52'], ['56', '14rem', '224px', 'w-56'],
  ['60', '15rem', '240px', 'w-60'], ['64', '16rem', '256px', 'w-64'], ['72', '18rem', '288px', 'w-72'],
  ['80', '20rem', '320px', 'w-80'], ['96', '24rem', '384px', 'w-96'],
]

const prefixes: [string, string, string][] = [
  ['Padding', 'p-* · px-* · py-* · pt-* pr-* pb-* pl-*', 'Ruang di dalam elemen, antara border dan konten.'],
  ['Margin', 'm-* · mx-* · my-* · mt-* mr-* mb-* ml-*', 'Ruang di luar elemen, memisahkan dari elemen lain.'],
  ['Gap', 'gap-* · gap-x-* · gap-y-*', 'Jarak antaritem di dalam flex dan grid container.'],
]

export function SpacingPage() {
  return (
    <Page
      eyebrow="Foundations · Spacing"
      title="Skala spacing basis 4px"
      description="Seluruh jarak — padding, margin, dan gap — mengikuti satu skala dengan basis 4px (0.25rem). Skala yang konsisten menjaga ritme visual dan alignment di seluruh produk."
    >
      <SectionHead eyebrow="Scale" title="Skala spacing">
        Setiap langkah adalah kelipatan 4px — nama token dikali 4 menghasilkan nilai pixel (mis. <C>4</C> = 16px). Berlaku untuk <C>p-*</C>, <C>m-*</C>, <C>gap-*</C>, <C>w-*</C>, dan <C>h-*</C>.
      </SectionHead>

      <article className="ds-card overflow-hidden">
        <div className="ds-scroll-x overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[90px_110px_90px_1fr] gap-4 border-b border-border px-5 py-3.5 sm:px-7">
              <p className="text-xs font-black text-gray-900">Name</p>
              <p className="text-xs font-black text-gray-900">Size</p>
              <p className="text-xs font-black text-gray-900">Pixels</p>
              <p aria-hidden="true" />
            </div>
            <div className="divide-y divide-gray-100">
              {spacingScale.map(([name, size, px, bar]) => (
                <div key={name} className="grid grid-cols-[90px_110px_90px_1fr] items-center gap-4 px-5 py-3 sm:px-7">
                  <code className="text-sm font-bold text-gray-900">{name}</code>
                  <code className="text-sm text-gray-500">{size}</code>
                  <code className="text-sm text-gray-500">{px}</code>
                  <div><div className={`${bar} h-4 rounded-xs bg-primary-600`} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <DocUsage code={`{/* Padding: ruang di dalam elemen */}
<div className="p-6">Padding 24px di semua sisi</div>
<div className="px-4 py-2">Horizontal 16px, vertikal 8px</div>

{/* Skala yang sama dipakai untuk ukuran */}
<div className="size-10">40 × 40px</div>`} />

      <div className="mt-8">
        <SectionHead eyebrow="Usage" title="Padding, margin, dan gap">
          Satu skala yang sama dipakai oleh ketiga jenis jarak — cukup ganti prefix utility-nya.
        </SectionHead>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prefixes.map(([label, code, desc]) => (
            <article key={label} className="ds-card p-5">
              <p className="text-sm font-black text-gray-900">{label}</p>
              <code className="mt-1 block text-xs font-bold text-primary-700">{code}</code>
              <p className="mt-3 text-sm leading-6 text-gray-600">{desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="ds-card p-5">
            <code className="text-sm font-bold text-primary-700">.p-4</code>
            <div className="mt-3 rounded-lg bg-primary-100">
              <div className="p-4">
                <div className="rounded-md bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-sm">Konten</div>
              </div>
            </div>
          </article>
          <article className="ds-card p-5">
            <code className="text-sm font-bold text-primary-700">.mt-4</code>
            <div className="mt-3 rounded-lg border border-dashed border-primary-300 p-2">
              <div className="rounded-md bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500">Elemen pertama</div>
              <div className="mt-4 rounded-md bg-primary-100 px-3 py-2 text-xs font-bold text-primary-800">Elemen kedua</div>
            </div>
          </article>
          <article className="ds-card p-5">
            <code className="text-sm font-bold text-primary-700">.gap-4</code>
            <div className="mt-3 flex gap-4 rounded-lg border border-dashed border-primary-300 p-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex-1 rounded-md bg-primary-100 px-3 py-2 text-center text-xs font-bold text-primary-800">{n}</div>
              ))}
            </div>
          </article>
        </div>
      </div>

      <DocUsage code={`{/* Gap — utamakan ini di flex/grid daripada margin */}
<div className="flex gap-3">...</div>
<div className="grid grid-cols-3 gap-6">...</div>

{/* Margin & space-y */}
<div className="mt-8">Margin atas 32px</div>
<div className="space-y-4">Setiap anak berjarak 16px</div>`} />

      <Principles items={[
        <>Selalu pakai langkah pada skala — hindari nilai arbitrer seperti <C>p-[13px]</C> agar ritme 4px terjaga.</>,
        <>Langkah kecil (<strong className="text-gray-900">1–4</strong>) untuk jarak dalam komponen, sedang (<strong className="text-gray-900">5–12</strong>) antarkomponen, besar (<strong className="text-gray-900">14+</strong>) antarseksi.</>,
        <>Pilih <C>gap-*</C> dibanding margin antaritem di flex/grid — lebih mudah dirawat dan tidak menimbulkan margin ganda.</>,
        <>Elemen dengan fungsi setara harus memakai jarak yang sama agar hierarki konsisten.</>,
      ]} />
    </Page>
  )
}

/* ============ BORDER ============ */

const radiusScale: [string, string][] = [
  ['rounded-sm', '2px'], ['rounded', '4px'], ['rounded-md', '6px'], ['rounded-lg', '8px'],
  ['rounded-xl', '12px'], ['rounded-2xl', '16px'], ['rounded-3xl', '24px'], ['rounded-full', '9999px'],
]

const borderWidths: [string, string, string][] = [
  ['border-0', '0px', 'outline outline-dashed outline-gray-300'],
  ['border', '1px', ''], ['border-2', '2px', ''], ['border-4', '4px', ''], ['border-8', '8px', ''],
]

export function BorderPage() {
  return (
    <Page
      eyebrow="Foundations · Border"
      title="Radius, ketebalan, dan gaya garis"
      description="Border membentuk kontur komponen — radius menentukan karakter sudut, ketebalan memberi penekanan, dan gaya garis membedakan status."
    >
      <SectionHead eyebrow="Border radius" title="Skala radius sudut">
        Dari <C>rounded-sm</C> (2px) hingga <C>rounded-full</C> (pill/lingkaran). Gunakan <C>rounded</C> sebagai default.
      </SectionHead>
      <article className="ds-card p-5 sm:p-7">
        <div className="ds-scroll-x flex items-center gap-4 overflow-x-auto pb-2">
          {radiusScale.map(([cls, value]) => (
            <div key={cls} className={`${cls} ${cls === 'rounded-full' ? 'size-40' : 'aspect-6/7 w-40'} flex shrink-0 flex-col items-center justify-center gap-1 bg-primary-600 text-center`}>
              <code className="text-sm font-bold text-white">.{cls}</code>
              <code className="text-xs text-primary-200">{value}</code>
            </div>
          ))}
        </div>
      </article>

      <DocUsage code={`{/* Radius sesuai jenis komponen */}
<button className="rounded-lg border border-border px-4 py-2">Tombol</button>
<div className="rounded-2xl border border-border p-6">Kartu</div>
<span className="rounded-full bg-primary-50 px-2.5 py-1">Badge</span>`} />

      <div className="mt-8">
        <SectionHead eyebrow="Border width" title="Ketebalan garis">
          Lima tingkat dari <C>border-0</C> hingga <C>border-8</C>. Default <C>border</C> (1px) cukup untuk mayoritas kebutuhan.
        </SectionHead>
        <article className="ds-card p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {borderWidths.map(([cls, value, extra]) => (
              <div key={cls} className={`${cls} ${extra} flex aspect-6/7 flex-col items-center justify-center gap-1 rounded-lg border-primary-300 bg-white text-center`}>
                <code className="text-sm font-bold break-all text-primary-700">.{cls}</code>
                <code className="text-xs text-gray-400">{value}</code>
              </div>
            ))}
          </div>
        </article>
      </div>

      <DocUsage code={`{/* Ketebalan — di atas 1px hanya untuk penekanan */}
<div className="border border-border">Default 1px</div>
<div className="border-2 border-primary-600">Sedang terpilih</div>
<div className="border-b border-border">Garis bawah saja</div>`} />

      <div className="mt-8">
        <SectionHead eyebrow="Border style" title="Gaya garis">
          Gaya standar adalah <C>border-solid</C> — dipakai untuk seluruh kontur komponen.
        </SectionHead>
        <article className="ds-card p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="flex aspect-6/7 flex-col items-center justify-center gap-1 rounded-lg border-2 border-solid border-white bg-primary-500 text-center ring-1 ring-gray-200">
              <code className="text-sm font-bold break-all text-white">.border-solid</code>
              <code className="text-xs text-primary-100">solid</code>
            </div>
          </div>
        </article>
      </div>

      <DocUsage code={`{/* Gaya garis */}
<div className="border border-solid border-border">Solid — default</div>
<div className="border border-dashed border-gray-300">Putus-putus</div>`} />

      <Principles items={[
        <>Kontrol interaktif memakai <C>rounded-lg</C>, kartu <C>rounded-2xl</C>, badge/avatar <C>rounded-full</C>.</>,
        <>Gunakan token <C>border-border</C> (gray-200) untuk garis pemisah dan kontur netral.</>,
        <>Ketebalan di atas 1px hanya untuk penekanan — fokus, seleksi aktif, atau validasi.</>,
        <>Jangan mencampur radius berbeda pada elemen bertumpuk; sudut dalam sebaiknya lebih kecil dari sudut luar.</>,
      ]} />
    </Page>
  )
}

/* ============ ELEVATION ============ */

const shadowScale = ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl']

const shadowColors: [string, string][] = [
  ['shadow-blue-600/50', 'bg-primary-600 shadow-lg shadow-primary-600/50'],
  ['shadow-blue-portal-600/50', 'bg-blue-portal-600 shadow-lg shadow-blue-portal-600/50'],
  ['shadow-green-500/50', 'bg-green-500 shadow-lg shadow-green-500/50'],
  ['shadow-red-500/50', 'bg-red-500 shadow-lg shadow-red-500/50'],
  ['shadow-orange-500/50', 'bg-orange-500 shadow-lg shadow-orange-500/50'],
  ['shadow-purple-500/50', 'bg-purple-500 shadow-lg shadow-purple-500/50'],
]

export function ElevationPage() {
  return (
    <Page
      eyebrow="Foundations · Elevation"
      title="Bayangan dan kedalaman"
      description="Elevation memberi hierarki kedalaman antarpermukaan — semakin tinggi elemen melayang, semakin lembut dan panjang bayangannya."
    >
      <SectionHead eyebrow="Box shadow" title="Skala bayangan">
        Enam tingkat dari <C>shadow-sm</C> hingga <C>shadow-2xl</C>. Gunakan <C>shadow</C> sebagai default untuk elemen melayang standar.
      </SectionHead>
      <article className="ds-card p-5 sm:p-7">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {shadowScale.map((cls) => (
            <div key={cls} className={`${cls} flex aspect-6/7 items-center justify-center rounded-lg bg-white text-center`}>
              <code className="text-sm font-bold text-primary-700">.{cls}</code>
            </div>
          ))}
        </div>
      </article>

      <DocUsage code={`{/* Semakin tinggi melayang, semakin besar bayangannya */}
<div className="rounded-lg bg-white shadow-sm">Kartu diam</div>
<div className="rounded-lg bg-white shadow-lg">Dropdown / popover</div>
<div className="rounded-xl bg-white shadow-2xl">Modal</div>

{/* Transisi bayangan saat hover */}
<div className="rounded-lg bg-white shadow transition-shadow hover:shadow-md">
  Kartu yang bisa diklik
</div>`} />

      <div className="mt-8">
        <SectionHead eyebrow="Box shadow color" title="Bayangan berwarna">
          Kombinasikan skala bayangan dengan warna token, mis. <C>shadow-lg shadow-primary-600/50</C>. Efektif untuk glow pada tombol CTA.
        </SectionHead>
        <article className="ds-card p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {shadowColors.map(([label, tile]) => (
              <div key={label} className={`${tile} flex h-32 items-center justify-center rounded-lg text-center`}>
                <code className="px-3 text-sm font-bold text-white">.{label}</code>
              </div>
            ))}
          </div>
        </article>
      </div>

      <DocUsage code={`{/* Bayangan berwarna — khusus penekanan seperti CTA */}
<button className="rounded-lg bg-primary-600 px-4 py-2 text-white shadow-lg shadow-primary-600/50">
  Aksi utama
</button>
<div className="rounded-lg bg-green-500 p-4 shadow-lg shadow-green-500/50">Berhasil</div>`} />

      <Principles items={[
        <>Kartu memakai <C>shadow-sm</C>/<C>shadow</C>, dropdown/popover <C>shadow-lg</C>, modal <C>shadow-xl</C> ke atas.</>,
        <>Batasi maksimal <strong className="text-gray-900">dua tingkat elevation</strong> dalam satu tampilan agar hierarki jelas.</>,
        <>Bayangan berwarna hanya untuk penekanan khusus (CTA, kartu promosi) — bukan konten reguler.</>,
        <>Bayangan bukan pengganti kontras — elemen interaktif tetap butuh batas/warna yang aksesibel.</>,
      ]} />
    </Page>
  )
}


/* ============ ICONS ============ */

// Ikon dari package npm resmi flowbite-react-icons — outline & solid.
type IconCmp = ComponentType<{ className?: string }>
const outlineEntries = Object.entries(OutlineIcons) as [string, IconCmp][]
const solidEntries = Object.entries(SolidIcons) as [string, IconCmp][]

// Logo brand/sosial — flowbite-react-icons hanya punya outline & solid, jadi
// logo brand di-generate sebagai komponen React milik design kit sendiri.

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
    <Page
      eyebrow="Foundations · Icons"
      title="Flowbite Icons"
      description="Set ikon resmi dari package npm flowbite-react-icons — gaya solid untuk status & penekanan, outline untuk aksi & navigasi, plus logo brand untuk tautan sosial. Ikon mewarisi warna teks (currentColor)."
    >
      <div className="mb-8">
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

      <SectionHead eyebrow="Solid" title={`Ikon solid · ${solidEntries.length}`}>
        Untuk status aktif, indikator, dan momen yang butuh bobot visual lebih. Arahkan kursor untuk melihat nama komponennya.
      </SectionHead>
      <article className="ds-card p-5 sm:p-7">
        <FlowbiteGrid entries={solidEntries} q={q} />
      </article>

      <DocUsage code={`import { Bell } from 'flowbite-react-icons/solid'

<Bell className="size-5 text-primary-600" />`} />

      <div className="mt-8">
        <SectionHead eyebrow="Outline" title={`Ikon outline · ${outlineEntries.length}`}>
          Gaya default untuk aksi, navigasi, dan elemen antarmuka umum.
        </SectionHead>
        <article className="ds-card p-5 sm:p-7">
          <FlowbiteGrid entries={outlineEntries} q={q} />
        </article>
      </div>

      <DocUsage code={`import { Home, Search } from 'flowbite-react-icons/outline'

<Home className="size-5 text-gray-700" />
<Search className="size-4 text-gray-500" />`} />

      <div className="mt-8">
        <SectionHead eyebrow="Social icons" title={`Logo brand · ${brandIcons.length}`}>
          Logo sosial dan teknologi untuk footer, tautan berbagi, dan halaman login. Diekspor langsung dari design kit — bukan dari <C>flowbite-react-icons</C> yang hanya memuat outline &amp; solid.
        </SectionHead>
        <article className="ds-card p-5 sm:p-7">
          <BrandGrid q={q} />
        </article>
      </div>

      <DocUsage code={`import { Github, Instagram, ReactLogo } from '@tpl/design-kit-react'

<Github className="size-5" />
<Instagram className="size-5 text-purple-600" />
<ReactLogo className="size-5" />`} />

      <Principles items={[
        <>Konsisten dalam satu konteks — jangan mencampur outline dan solid pada kelompok aksi yang sama.</>,
        <>Selaraskan ukuran ikon dengan teks: <C>size-4</C> untuk body small, <C>size-5</C> untuk body, <C>size-6</C> untuk heading.</>,
        <>Ikon dekoratif wajib <C>aria-hidden="true"</C>; ikon berdiri sendiri butuh label (mis. <C>sr-only</C>).</>,
        <>Jangan mengubah warna ikon terpisah dari teks pendampingnya — keduanya memakai token warna yang sama.</>,
      ]} />
    </Page>
  )
}
