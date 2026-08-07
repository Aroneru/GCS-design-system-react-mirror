import { DocHero } from '../../DocHero'
import { DocUsage } from '../../DocUsage'

const typeScale = [
  { name: 'Display', cls: 'text-display font-bold', spec: '48 / 55 · Bold', sample: 'Layanan digital untuk semua' },
  { name: 'Heading 1', cls: 'text-heading-1 font-bold', spec: '36 / 43 · Bold', sample: 'Transformasi digital Indonesia' },
  { name: 'Heading 2', cls: 'text-heading-2 font-bold', spec: '30 / 38 · Bold', sample: 'Informasi dan layanan publik' },
  { name: 'Heading 3', cls: 'text-heading-3 font-bold', spec: '24 / 31 · Bold', sample: 'Akses mudah dan terpercaya' },
  { name: 'Heading 4', cls: 'text-heading-4 font-bold', spec: '20 / 28 · Bold', sample: 'Pelayanan dalam satu tempat' },
  { name: 'Body Large', cls: 'text-body-lg font-normal', spec: '18 / 29 · Regular', sample: 'Kami menghadirkan layanan digital yang inklusif, aman, dan mudah digunakan.' },
  { name: 'Body', cls: 'text-body font-normal', spec: '16 / 24 · Regular', sample: 'Gunakan bahasa yang ringkas agar informasi dapat dipahami oleh seluruh masyarakat.' },
  { name: 'Body Small', cls: 'text-body-sm font-normal', spec: '14 / 20 · Regular', sample: 'Informasi pendukung, deskripsi singkat, dan label komponen.' },
  { name: 'Caption', cls: 'text-caption font-bold tracking-wide uppercase', spec: '12 / 17 · Bold', sample: 'Terakhir diperbarui 18 Juli 2026' },
]

const tailwindScale = [
  ['text-xs', '12px'], ['text-sm', '14px'], ['text-base', '16px'], ['text-lg', '18px'],
  ['text-xl', '20px'], ['text-2xl', '24px'], ['text-3xl', '30px'], ['text-4xl', '36px'],
  ['text-5xl', '48px'], ['text-6xl', '60px'], ['text-7xl', '72px'], ['text-8xl', '96px'], ['text-9xl', '128px'],
]

const fontWeights = [
  ['font-thin', 100], ['font-extralight', 200], ['font-light', 300], ['font-normal', 400],
  ['font-medium', 500], ['font-semibold', 600], ['font-bold', 700], ['font-extrabold', 800], ['font-black', 900],
] as [string, number][]

const lineHeights = [
  ['leading-none', '100%'], ['leading-normal', '150%'], ['leading-loose', '200%'],
]

const textTransforms = [
  ['uppercase', 'text-transform: uppercase'],
  ['line-through', 'text-decoration: line-through'],
  ['underline', 'text-decoration: underline'],
]

const usage = {
  semantic: `{/* Token semantik — hierarki utama halaman */}
<h1 className="text-display font-bold">Judul besar</h1>
<h2 className="text-heading-1 font-bold">Judul halaman</h2>
<p className="text-body text-gray-500">Paragraf isi konten.</p>
<span className="text-caption font-bold uppercase">Label kecil</span>`,
  scale: `{/* Skala Tailwind — untuk kebutuhan di luar token semantik */}
<p className="text-xs">Teks 12px</p>
<p className="text-base">Teks 16px</p>
<p className="text-2xl">Teks 24px</p>
<p className="text-5xl">Teks 48px</p>`,
  weight: `{/* Sembilan tingkat ketebalan */}
<p className="font-thin">Thin 100</p>
<p className="font-normal">Regular 400</p>
<p className="font-semibold">Semi Bold 600</p>
<p className="font-black">Black 900</p>`,
  leading: `{/* Jarak antarbaris */}
<p className="leading-none">Rapat — 100%</p>
<p className="leading-normal">Standar — 150%</p>
<p className="leading-loose">Renggang — 200%</p>`,
  transform: `{/* Transform & decoration */}
<p className="uppercase">huruf kapital semua</p>
<p className="line-through">Teks dicoret</p>
<a href="#" className="underline">Tautan bergaris bawah</a>`,
}

export function TypographyPage() {
  return (
    <>
      <DocHero
        eyebrow="Foundations · Typography"
        title="Lato type system"
        description="Lato dipilih karena terbuka, humanis, dan tetap terbaca baik pada layar kecil. Skala berikut menjaga hierarki tetap konsisten di seluruh produk."
      />

      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <article className="ds-card overflow-hidden">
          <div className="grid gap-8 border-b border-border bg-primary-900 p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-primary-300 uppercase">Primary typeface</p>
              <p className="mt-3 text-[clamp(4.5rem,15vw,9rem)] leading-none font-black tracking-tight">Lato</p>
            </div>
            <div className="max-w-sm lg:text-right">
              <p className="text-heading-4 font-bold">Aa Bb Cc 123</p>
              <p className="mt-2 text-sm leading-6 text-primary-200">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789 !@#$%&amp;*
              </p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {typeScale.map((t) => (
              <div key={t.name} className="grid gap-4 p-5 sm:p-7 lg:grid-cols-[180px_1fr] lg:items-baseline">
                <div>
                  <p className="text-sm font-black text-gray-900">{t.name}</p>
                  <p className="mt-1 text-xs text-gray-400">{t.spec}</p>
                </div>
                <p className={`${t.cls} text-gray-900`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </article>

        <DocUsage code={usage.semantic} />

        <div className="mt-8">
          <div className="mb-5">
            <p className="ds-eyebrow">Type scale</p>
            <h3 className="mt-2 text-heading-3 font-black text-gray-900">Skala ukuran Tailwind</h3>
            <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
              Skala <code className="text-xs font-bold text-gray-700">text-xs</code> hingga{' '}
              <code className="text-xs font-bold text-gray-700">text-9xl</code> untuk kebutuhan di luar token semantik.
            </p>
          </div>
          <article className="ds-card divide-y divide-border overflow-hidden">
            {tailwindScale.map(([cls, label]) => (
              <div key={cls} className="p-5 sm:p-6">
                <div className="flex items-baseline gap-2">
                  <code className="text-sm font-bold text-primary-700">.{cls}</code>
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
                <div className="ds-scroll-x mt-3 overflow-x-auto">
                  <p className={`${cls} font-normal whitespace-nowrap text-gray-900`}>The quick brown fox jumps over the lazy dog.</p>
                </div>
              </div>
            ))}
          </article>
        </div>

        <DocUsage code={usage.scale} />

        <div className="mt-8">
          <div className="mb-5">
            <p className="ds-eyebrow">Font weights</p>
            <h3 className="mt-2 text-heading-3 font-black text-gray-900">Sembilan tingkat ketebalan</h3>
            <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
              Dari <code className="text-xs font-bold text-gray-700">.font-thin</code> (100) hingga{' '}
              <code className="text-xs font-bold text-gray-700">.font-black</code> (900).
            </p>
          </div>
          <article className="ds-card divide-y divide-border overflow-hidden">
            {fontWeights.map(([cls, value]) => (
              <div key={cls} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <p className={`${cls} text-4xl text-gray-900`}>State Security Service</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end">
                  <code className="text-sm font-bold text-primary-700">.{cls}</code>
                  <code className="text-xs text-gray-400">font-weight: {value}</code>
                </div>
              </div>
            ))}
          </article>
        </div>

        <DocUsage code={usage.weight} />

        <div className="mt-8">
          <div className="mb-5">
            <p className="ds-eyebrow">Line height</p>
            <h3 className="mt-2 text-heading-3 font-black text-gray-900">Leading (jarak antarbaris)</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lineHeights.map(([cls, value]) => (
              <article key={cls} className="ds-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-bold text-primary-700">.{cls}</code>
                  <code className="text-xs text-gray-400">{value}</code>
                </div>
                <p className={`${cls} mt-3 text-sm text-gray-900`}>
                  Layanan digital untuk semua masyarakat Indonesia yang inklusif dan mudah diakses.
                </p>
              </article>
            ))}
          </div>
        </div>

        <DocUsage code={usage.leading} />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="ds-card p-6">
            <p className="ds-eyebrow">Transform & decoration</p>
            <div className="mt-5 space-y-5">
              {textTransforms.map(([cls, desc]) => (
                <div key={cls} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-sm font-bold text-primary-700">.{cls}</code>
                    <code className="text-[11px] text-gray-400">{desc}</code>
                  </div>
                  <p className={`${cls} mt-2 text-lg text-gray-900`}>The quick brown fox jumps over the lazy dog.</p>
                </div>
              ))}
            </div>
          </article>

          <article className="ds-card p-6">
            <p className="ds-eyebrow">Prinsip penggunaan</p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
              {[
                <>Gunakan <strong className="text-gray-900">Bold atau Black</strong> untuk heading dan angka penting.</>,
                <>Pertahankan body minimal <strong className="text-gray-900">16px</strong> untuk konten utama.</>,
                <>Hindari paragraf panjang dengan huruf kapital karena menurunkan keterbacaan.</>,
                <>Batasi panjang baris ideal antara <strong className="text-gray-900">45–75 karakter</strong>.</>,
              ].map((li, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <DocUsage code={usage.transform} />
      </div>
    </>
  )
}
