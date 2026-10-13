import { useState } from 'react'
import { Segmented } from '../../pageKit'
import {
  FlowSection,
  Lead,
  PrincipleList,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'

type FontKey = 'sans' | 'alt'

/** Font yang bisa dipratinjau. `cls` dipasang ke seluruh isi halaman. */
const fonts: Record<FontKey, { name: string; cls: string; role: string; description: string }> = {
  sans: {
    name: 'Lato',
    cls: 'font-sans',
    role: 'Primary typeface',
    description:
      'Lato dipilih karena terbuka, humanis, dan tetap terbaca baik pada layar kecil. Skala berikut menjaga hierarki tetap konsisten di seluruh produk.',
  },
  alt: {
    name: 'Inter',
    cls: 'font-alt',
    role: 'Alternate typeface',
    description:
      'Inter adalah font alternatif. Dirancang untuk layar, jelas di ukuran kecil, dan angkanya sama lebar. Skala dan token tetap sama dengan Lato.',
  },
}

/**
 * Pilihan font disimpan di query `?font=inter`, bukan di hash, karena hash
 * sudah dipakai router. Dengan begitu tautannya bisa dibagikan.
 */
function readFont(): FontKey {
  return new URLSearchParams(window.location.search).get('font') === 'inter' ? 'alt' : 'sans'
}

function writeFont(font: FontKey) {
  const url = new URL(window.location.href)
  if (font === 'alt') url.searchParams.set('font', 'inter')
  else url.searchParams.delete('font')
  window.history.replaceState(null, '', url)
}

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
  alt: `/* Ganti font alternatif di CSS project kamu.
   Muat file fontnya sendiri, misalnya lewat Google Fonts. */
:root {
  --font-alt: 'Plus Jakarta Sans', sans-serif;
}`,
  transform: `{/* Transform & decoration */}
<p className="uppercase">huruf kapital semua</p>
<p className="line-through">Teks dicoret</p>
<a href="#" className="underline">Tautan bergaris bawah</a>`,
}

/** Snippet token semantik; saat Inter dipilih, tampilkan cara memakai `font-alt`. */
const semanticUsage = (font: FontKey) =>
  (font === 'alt'
    ? `{/* Pasang font-alt di pembungkus, semua teks di dalamnya ikut Inter */}
<main className="font-alt">
  ...
</main>

`
    : '') + usage.semantic

/**
 * `id` di sini harus sama persis dengan `id` tiap <FlowSection> di bawah, dan
 * daftarnya wajib konstanta di level modul: `useActiveSection` memasang
 * IntersectionObserver dengan `toc` sebagai dependensi, jadi array yang dibuat
 * ulang tiap render akan memasang-lepas observernya tiap render juga.
 */
const toc: TocEntry[] = [
  { id: 'typeface', label: 'Typeface & skala' },
  { id: 'skala', label: 'Skala ukuran' },
  { id: 'weight', label: 'Font weight' },
  { id: 'leading', label: 'Line height' },
  { id: 'transform', label: 'Transform & decoration' },
  { id: 'font-alt', label: 'Mengganti font' },
  { id: 'prinsip', label: 'Prinsip penggunaan' },
]

export function TypographyPage() {
  const [fontKey, setFontKey] = useState<FontKey>(readFont)
  const font = fonts[fontKey]

  const changeFont = (next: FontKey) => {
    setFontKey(next)
    writeFont(next)
  }

  return (
    <UsulanPage
      eyebrow="Foundations · Typography"
      title={`${font.name} type system`}
      description={font.description}
      toc={toc}
      actions={
        <Segmented
          label="Pratinjau font"
          value={fontKey}
          onChange={changeFont}
          options={[
            { value: 'sans', label: 'Lato · utama' },
            { value: 'alt', label: 'Inter · alternatif' },
          ]}
        />
      }
    >
      {/* Seluruh isi ikut font terpilih supaya perbandingannya utuh. */}
      <div className={`${font.cls} space-y-16`}>
        <FlowSection id="typeface" title="Typeface & skala semantik">
          <Lead>
            Token semantik memegang hierarki utama halaman — Display sampai Caption. Pakai ini lebih
            dulu; skala Tailwind di bawahnya hanya untuk kebutuhan yang tidak tertampung di sini.
          </Lead>

          <article className="ds-card overflow-hidden">
            <div className="grid gap-8 border-b border-border bg-primary-900 p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-primary-300 uppercase">{font.role}</p>
                <p className="mt-3 text-[clamp(4.5rem,15vw,9rem)] leading-none font-black tracking-tight">{font.name}</p>
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

          <SectionCode>{semanticUsage(fontKey)}</SectionCode>
        </FlowSection>

        <FlowSection id="skala" title="Skala ukuran Tailwind">
          <Lead>
            Skala <code className="text-xs font-bold text-gray-700">text-xs</code> hingga{' '}
            <code className="text-xs font-bold text-gray-700">text-9xl</code> untuk kebutuhan di luar
            token semantik.
          </Lead>

          <article className="ds-card divide-y divide-border overflow-hidden">
            {tailwindScale.map(([cls, label]) => (
              <div key={cls} className="p-5 sm:p-6">
                <div className="flex items-baseline gap-2">
                  <code className="text-sm font-bold text-primary-700">.{cls}</code>
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
                <div className="ds-scroll-x mt-3 overflow-x-auto">
                  <p className={`${cls} font-normal whitespace-nowrap text-gray-900`}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>
            ))}
          </article>

          <SectionCode>{usage.scale}</SectionCode>
        </FlowSection>

        <FlowSection id="weight" title="Sembilan tingkat ketebalan">
          <Lead>
            Dari <code className="text-xs font-bold text-gray-700">.font-thin</code> (100) hingga{' '}
            <code className="text-xs font-bold text-gray-700">.font-black</code> (900).
          </Lead>

          <article className="ds-card divide-y divide-border overflow-hidden">
            {fontWeights.map(([cls, value]) => (
              <div key={cls} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <p className={`${cls} text-4xl text-gray-900`}>Ceplok Design System</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end">
                  <code className="text-sm font-bold text-primary-700">.{cls}</code>
                  <code className="text-xs text-gray-400">font-weight: {value}</code>
                </div>
              </div>
            ))}
          </article>

          <SectionCode>{usage.weight}</SectionCode>
        </FlowSection>

        <FlowSection id="leading" title="Leading (jarak antarbaris)">
          <Lead>Tiga langkah jarak antarbaris untuk kerapatan teks yang berbeda.</Lead>

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

          <SectionCode>{usage.leading}</SectionCode>
        </FlowSection>

        <FlowSection id="transform" title="Transform & decoration">
          <Lead>Kapitalisasi, garis bawah, dan coret — dipakai hemat, hanya saat maknanya jelas.</Lead>

          <article className="ds-card p-6">
            <div className="space-y-5">
              {textTransforms.map(([cls, desc]) => (
                <div key={cls} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-sm font-bold text-primary-700">.{cls}</code>
                    <code className="text-[11px] text-gray-400">{desc}</code>
                  </div>
                  <p className={`${cls} mt-2 text-lg text-gray-900`}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              ))}
            </div>
          </article>

          <SectionCode>{usage.transform}</SectionCode>
        </FlowSection>

        <FlowSection id="font-alt" title="Mengganti font">
          <Lead>
            Lato dipakai lewat <code className="text-xs font-bold text-gray-700">font-sans</code>,
            Inter lewat <code className="text-xs font-bold text-gray-700">font-alt</code>. Untuk
            memakai font lain, timpa variabel{' '}
            <code className="text-xs font-bold text-gray-700">--font-alt</code> di CSS project.
          </Lead>

          <SectionCode>{usage.alt}</SectionCode>
        </FlowSection>

        <FlowSection id="prinsip" title="Prinsip penggunaan">
          <PrincipleList
            items={[
              <>
                Gunakan <strong className="text-gray-900">Bold atau Black</strong> untuk heading dan
                angka penting.
              </>,
              <>
                Pertahankan body minimal <strong className="text-gray-900">16px</strong> untuk konten
                utama.
              </>,
              <>Hindari paragraf panjang dengan huruf kapital karena menurunkan keterbacaan.</>,
              <>
                Batasi panjang baris ideal antara{' '}
                <strong className="text-gray-900">45–75 karakter</strong>.
              </>,
            ]}
          />
        </FlowSection>
      </div>
    </UsulanPage>
  )
}
