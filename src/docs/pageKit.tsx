import type { ReactNode } from 'react'
import { DocHero } from './DocHero'
import { DocUsage } from './DocUsage'

/**
 * Elemen bersama seluruh halaman dokumentasi.
 *
 * Sebelumnya potongan-potongan ini digandakan di FoundationPages.tsx dan
 * ComponentPages.tsx; setelah tiap halaman dipecah jadi berkasnya sendiri,
 * semuanya dikumpulkan di sini agar hanya ada satu sumber kebenaran.
 */

/* ---------- Kerangka halaman ---------- */

/** Halaman Foundations: hero + kolom konten tanpa jarak antarblok bawaan. */
export function FoundationPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">{children}</div>
    </>
  )
}

/** Halaman Components: hero + kolom konten ber-`space-y-10` antar-<Section>. */
export function ComponentPage({
  title,
  description,
  children,
  eyebrow = 'Components',
}: {
  title: string
  description: string
  children: ReactNode
  eyebrow?: string
}) {
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl space-y-10 px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        {children}
      </div>
    </>
  )
}

/* ---------- Blok isi ---------- */

/** Judul section pada halaman Foundations (eyebrow + judul + deskripsi). */
export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-5">
      <p className="ds-eyebrow">{eyebrow}</p>
      <h3 className="mt-2 text-heading-3 font-black text-gray-900">{title}</h3>
      {children && <p className="mt-2 max-w-2xl text-body-sm text-gray-500">{children}</p>}
    </div>
  )
}

/** Judul section pada halaman Components. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-heading-3 font-black text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

/** Kartu contoh: label kecil di atas, lalu isi di dalam kotak berlatar netral. */
export function Demo({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div>
      {label && <p className="mb-2 text-sm font-black text-gray-900">{label}</p>}
      <div className="rounded-xl border border-border bg-surface-subtle p-5">{children}</div>
    </div>
  )
}

/** Daftar "Prinsip penggunaan" di bagian bawah halaman Foundations. */
export function Principles({ items }: { items: ReactNode[] }) {
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

/**
 * Blok kode section "Penggunaan" — memakai DocUsage yang sama dengan halaman
 * Foundations supaya header bar + tombol salinnya konsisten di seluruh docs.
 * `flush` dipakai karena jarak atas sudah diatur oleh <Section>.
 */
export function CodeBlock({ children }: { children: ReactNode }) {
  return <DocUsage code={children} flush />
}

/* ---------- Inline ---------- */

/** Potongan kode inline di dalam paragraf. */
export const C = ({ children }: { children: ReactNode }) => (
  <code className="text-xs font-bold text-gray-700">{children}</code>
)

/** Penyorot potongan kode, menggantikan <span class="text-primary-300"> di Blade. */
export const H = ({ children }: { children: ReactNode }) => (
  <span className="text-primary-300">{children}</span>
)

export const G = ({ children }: { children: ReactNode }) => (
  <span className="text-green-300">{children}</span>
)

/**
 * Nama variabel/prop yang sedang dikendalikan playground.
 *
 * Sama seperti <H> — hanya mewarnai teks, tanpa latar — tapi dipakai khusus
 * untuk menandai prop yang nilainya datang dari kontrol di atas blok kode.
 */
export const Mark = ({ children }: { children: ReactNode }) => (
  <span className="font-bold text-primary-300">{children}</span>
)

/* ---------- Kontrol playground ---------- */

/** Kelompok tombol pilihan (segmented control) — port dari kontrol Alpine. */
export function Segmented<T extends string | number | boolean>({
  label,
  value,
  onChange,
  options,
  itemClassName = 'px-3',
  wrap,
  disabled,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; icon?: string }[]
  itemClassName?: string
  wrap?: boolean
  /** Meredupkan sekaligus mematikan seluruh pilihan; nilai terpilih tetap terlihat. */
  disabled?: boolean
}) {
  return (
    <div
      className={`inline-flex rounded-lg border border-border bg-surface p-1 ${wrap ? 'flex-wrap' : ''} ${
        disabled ? 'opacity-50' : ''
      }`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          disabled={disabled}
          className={`inline-flex items-center gap-2 rounded-md py-1.5 text-sm font-bold transition-colors disabled:cursor-not-allowed ${itemClassName} ${
            value === o.value ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-pressed={value === o.value}
        >
          {o.icon && (
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={o.icon} />
            </svg>
          )}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export const ControlLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-xs font-black tracking-wide text-gray-500 uppercase">{children}</span>
)

/* ---------- Kartu Overview ---------- */

const ArrowRight = () => (
  <svg
    className="size-4 transition-transform group-hover:translate-x-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

/** Kartu tautan pada halaman Overview: preview di atas, judul + deskripsi di bawah. */
export function OverviewCard({
  route,
  name,
  desc,
  wide,
  children,
}: {
  route: string
  name: string
  desc: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <a
      href={`#${route}`}
      className={`ds-card group flex flex-col p-6 transition-shadow hover:shadow-md ${wide ? 'sm:col-span-2' : ''}`}
    >
      {children}
      <h2 className="mt-4 text-heading-4 font-black text-gray-900">{name}</h2>
      <p className="mt-1.5 text-body-sm text-gray-500">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
        Lihat detail
        <ArrowRight />
      </span>
    </a>
  )
}

/** Kerangka halaman Overview: hero + grid dua kolom berisi <OverviewCard>. */
export function OverviewPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <div className="grid gap-5 sm:grid-cols-2">{children}</div>
      </div>
    </>
  )
}
