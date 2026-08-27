import { C } from '../../pageKit'
import {
  FlowSection,
  Lead,
  PrincipleList,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'

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

const toc: TocEntry[] = [
  { id: 'skala', label: 'Skala spacing' },
  { id: 'prefix', label: 'Padding, margin, gap' },
  { id: 'prinsip', label: 'Prinsip penggunaan' },
]

export function SpacingPage() {
  return (
    <UsulanPage
      eyebrow="Foundations · Spacing"
      title="Skala spacing basis 4px"
      description="Seluruh jarak — padding, margin, dan gap — mengikuti satu skala dengan basis 4px (0.25rem). Skala yang konsisten menjaga ritme visual dan alignment di seluruh produk."
      toc={toc}
    >
      <FlowSection id="skala" title="Skala spacing">
        <Lead>
          Setiap langkah adalah kelipatan 4px — nama token dikali 4 menghasilkan nilai pixel (mis.{' '}
          <C>4</C> = 16px). Berlaku untuk <C>p-*</C>, <C>m-*</C>, <C>gap-*</C>, <C>w-*</C>, dan <C>h-*</C>.
        </Lead>

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

        <SectionCode>{`{/* Padding: ruang di dalam elemen */}
<div className="p-6">Padding 24px di semua sisi</div>
<div className="px-4 py-2">Horizontal 16px, vertikal 8px</div>

{/* Skala yang sama dipakai untuk ukuran */}
<div className="size-10">40 × 40px</div>`}</SectionCode>
      </FlowSection>

      <FlowSection id="prefix" title="Padding, margin, dan gap">
        <Lead>
          Satu skala yang sama dipakai oleh ketiga jenis jarak — cukup ganti prefix utility-nya.
        </Lead>

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

        <SectionCode>{`{/* Gap — utamakan ini di flex/grid daripada margin */}
<div className="flex gap-3">...</div>
<div className="grid grid-cols-3 gap-6">...</div>

{/* Margin & space-y */}
<div className="mt-8">Margin atas 32px</div>
<div className="space-y-4">Setiap anak berjarak 16px</div>`}</SectionCode>
      </FlowSection>

      <FlowSection id="prinsip" title="Prinsip penggunaan">
        <PrincipleList
          items={[
            <>Selalu pakai langkah pada skala — hindari nilai arbitrer seperti <C>p-[13px]</C> agar ritme 4px terjaga.</>,
            <>Langkah kecil (<strong className="text-gray-900">1–4</strong>) untuk jarak dalam komponen, sedang (<strong className="text-gray-900">5–12</strong>) antarkomponen, besar (<strong className="text-gray-900">14+</strong>) antarseksi.</>,
            <>Pilih <C>gap-*</C> dibanding margin antaritem di flex/grid — lebih mudah dirawat dan tidak menimbulkan margin ganda.</>,
            <>Elemen dengan fungsi setara harus memakai jarak yang sama agar hierarki konsisten.</>,
          ]}
        />
      </FlowSection>
    </UsulanPage>
  )
}
