import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { CodeBlock, ControlLabel } from './pageKit'

/**
 * Kerangka halaman dokumentasi: judul ber-anchor, blok kode menempel di tiap
 * bagian, dan daftar isi "On this page" yang menempel di kanan.
 *
 * Namanya masih "usulan" karena dulu memang diusulkan sebagai pengganti
 * ComponentPage; sekarang hampir seluruh halaman memakainya, jadi berkas ini
 * boleh diganti nama begitu ComponentPage benar-benar tidak dipakai lagi.
 *
 * Dikumpulkan di satu berkas karena belasan halaman memakainya; kalau disalin
 * per halaman, hook scroll-spy dan perhitungan lebarnya ikut tergandakan.
 */

/** Satu entri daftar isi. `id` harus sama dengan `id` pada <FlowSection>. */
export type TocEntry = { id: string; label: string }

/**
 * Router aplikasi ini memakai hash (`#/form/...`), jadi `<a href="#editor">`
 * biasa akan dibaca sebagai perpindahan halaman dan melempar kita ke Home.
 * Solusinya: tautan bagian ditulis lengkap — `#<rute>#<id>` — dan useHashRoute
 * yang memotong penanda bagian dari rutenya lalu menggulir ke sana.
 *
 * Bentuknya tetap <a>, bukan <button>, supaya alamatnya bisa disalin, dibuka di
 * tab baru, dan tetap benar setelah halaman dimuat ulang.
 */
function sectionHref(id: string) {
  const route = window.location.hash.replace(/^#/, '').split('#')[0] || '/'
  return `#${route}#${id}`
}

/**
 * Menekan tautan yang alamatnya sama persis dengan hash sekarang tidak memicu
 * `hashchange`, jadi klik kedua ke bagian yang sama akan terasa mati. Di kasus
 * itu saja gulirannya dijalankan langsung.
 */
function handleSectionClick(id: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.hash !== sectionHref(id)) return
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * Menyorot entri daftar isi sesuai bagian yang sedang dibaca.
 *
 * `toc` wajib berupa konstanta di level modul halaman pemanggil — kalau dibuat
 * ulang tiap render, observernya ikut dipasang ulang tiap render.
 */
function useActiveSection(toc: TocEntry[]) {
  const [active, setActive] = useState(toc[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Bisa ada beberapa judul yang masuk sekaligus saat menggulir cepat;
        // yang paling atas di layar itulah yang sedang dibaca.
        const masuk = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (masuk.length) setActive(masuk[0].target.id)
      },
      // Pita sempit di bawah tepi atas layar, bukan seluruh viewport.
      { rootMargin: '-96px 0px -72% 0px' },
    )

    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [toc])

  return active
}

/** Pola satu bagian: judul ber-anchor, lalu isi. */
export function FlowSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="group flex items-baseline gap-2 text-heading-3 font-black text-gray-900">
        {title}
        <a
          href={sectionHref(id)}
          onClick={handleSectionClick(id)}
          title="Tautan ke bagian ini"
          aria-label={`Tautan ke bagian ${title}`}
          className="rounded text-primary-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary-600 focus-visible:opacity-100"
        >
          #
        </a>
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** Paragraf pengantar tiap bagian. */
export function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-4 max-w-2xl text-body-sm text-gray-500">{children}</p>
}

/** Blok kode di bawah pratinjau — jaraknya seragam di semua bagian. */
export function SectionCode({ children, flush }: { children: ReactNode; flush?: boolean }) {
  return (
    <div className={flush ? undefined : 'mt-4'}>
      <CodeBlock>{children}</CodeBlock>
    </div>
  )
}

/**
 * Daftar "Prinsip penggunaan" tanpa kartu pembungkus.
 *
 * Versi di pageKit membawa kartu + eyebrow-nya sendiri; di sini judulnya sudah
 * dipegang <FlowSection>, jadi memakai yang itu akan menggandakan judul.
 */
export function PrincipleList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-4 text-sm leading-6 text-gray-600">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Panggung Playground: kartu berlatar netral, lebarnya bisa dianimasikan. */
export function Stage({ maxWidth, children }: { maxWidth: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
      <div className={`mx-auto transition-[max-width] duration-300 ease-out ${maxWidth}`}>
        {children}
      </div>
    </div>
  )
}

/**
 * Deretan kontrol Playground — tiga per baris mulai xl.
 *
 * Baru di xl karena kolom Application berisi beberapa tombol; di lebar lg tiap
 * kolom belum cukup, dan kolom grid `1fr` tidak menyusut di bawah isinya —
 * yang melebar justru gridnya.
 */
export function Controls({ children }: { children: ReactNode }) {
  return <div className="mt-4 grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
}

/** Satu kelompok kontrol: label kecil di atas, segmented di bawah. */
export function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <ControlLabel>{label}</ControlLabel>
      <div className="mt-2">{children}</div>
    </div>
  )
}

/**
 * Kerangka halaman: hero + kolom isi + daftar isi yang menempel di kanan.
 *
 * Lebar wadah = 57rem (kolom isi, sama persis dengan halaman ComponentPage
 * biasa) + 2.5rem jarak + 190px daftar isi + padding kiri-kanan. Dengan begitu
 * kolom isinya tidak menyempit gara-gara daftar isi; daftar isinya yang
 * bergeser ke ruang sisa di kanan.
 *
 * Hero ditulis di sini, bukan memakai <DocHero>, karena DocHero memusatkan
 * isinya di max-w-5xl — kalau lebarnya berbeda, judul dan isi tidak rata kiri.
 */
export function UsulanPage({
  eyebrow,
  title,
  description,
  toc,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  toc: TocEntry[]
  children: ReactNode
}) {
  const active = useActiveSection(toc)

  return (
    <>
      <header className="border-b border-border bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <div className="mx-auto max-w-[78.5rem]">
          <p className="ds-eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-heading-1 font-black tracking-tight text-gray-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-body text-gray-500">{description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-[78.5rem] px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <div className="grid gap-10 2xl:grid-cols-[minmax(0,57rem)_190px]">
          <div className="min-w-0 max-w-[57rem] space-y-16">{children}</div>

          <aside className="hidden 2xl:block">
            <div className="sticky top-10">
              <p className="text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">
                On this page
              </p>
              <nav className="mt-3 border-l border-border" aria-label="Daftar isi halaman">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={sectionHref(t.id)}
                    onClick={handleSectionClick(t.id)}
                    aria-current={active === t.id ? 'true' : undefined}
                    className={`-ml-px block w-full border-l-2 py-1.5 pl-3 text-left text-[13px] transition-colors ${
                      active === t.id
                        ? 'border-primary-600 font-bold text-primary-700'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800'
                    }`}
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
