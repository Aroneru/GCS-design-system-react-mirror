import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { pintasanCari, rail, sidebars, type NavItem } from './navigation'

/** Satu halaman yang bisa dicari: label, rute, letaknya di navigasi, dan kata lainnya. */
type Halaman = { label: string; route: string; letak: string; kata: string }

/**
 * Seluruh halaman dokumentasi, urut seperti navigasi. Area tanpa panel
 * samping (Home, Example) masuk sebagai satu halaman; entri `soon` dilewati
 * seperti di panel samping.
 */
const semuaHalaman: Halaman[] = rail.flatMap((area) => {
  const panel = sidebars[area.key]
  if (!panel) return [{ label: area.label, route: area.route, letak: 'Area utama', kata: area.keywords ?? '' }]

  const isi: Halaman[] = []
  const tambah = (item: NavItem, induk?: string) => {
    if (item.soon) return
    isi.push({
      label: item.label,
      route: item.route,
      letak: induk ? `${panel.title} › ${induk}` : panel.title,
      kata: item.keywords ?? '',
    })
    item.children?.forEach((anak) => tambah(anak, item.label))
  }
  panel.items.forEach((item) => tambah(item))
  return isi
})

/** Huruf kecil tanpa tanda diakritik, supaya ketikan dan label dibandingkan setara. */
const rapikan = (teks: string) => teks.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Apakah salah satu kata di `teks` diawali `kunci`. */
const adaAwalKata = (teks: string, kunci: string) =>
  teks.split(/[\s/(),.›-]+/).some((kata) => kata.startsWith(kunci))

/**
 * Peringkat kecocokan, makin kecil makin atas: 0 label diawali ketikan, 1 tiap
 * kata ketikan mengawali kata di label, 2 cocok lewat letak atau kata lainnya
 * (mis. "tombol" untuk Button). `null` bila tidak cocok sama sekali.
 */
function peringkat(halaman: Halaman, kueri: string): number | null {
  const label = rapikan(halaman.label)
  if (label.startsWith(kueri)) return 0
  const kata = kueri.split(' ')
  if (kata.every((k) => adaAwalKata(label, k))) return 1
  const semua = rapikan(`${halaman.label} ${halaman.letak} ${halaman.kata}`)
  if (kata.every((k) => adaAwalKata(semua, k))) return 2
  return null
}

/** Fokus sedang di tempat mengetik? Di sana "/" harus tetap jadi huruf biasa. */
const sedangMengisi = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

/**
 * Pencarian halaman dokumentasi — jendela yang dibuka lewat tombol Cari,
 * Ctrl+K (⌘K di Mac), atau "/". Mengetik menyaring daftar halaman; panah
 * atas/bawah memindah pilihan, Enter membukanya, Esc atau klik di luar
 * menutupnya.
 *
 * Memakai `<dialog>` yang dibuka `showModal()`: ia naik ke top layer, fokus
 * terkunci di dalamnya, Esc ditangani peramban, dan fokus kembali ke tombol
 * pembukanya saat ditutup. `closedby="any"` menambahkan tutup lewat klik di
 * luar; peramban yang belum mendukungnya (Safari) memakai cadangan di
 * `klikLatar`.
 */
export function DocsSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [kueri, setKueri] = useState('')
  const [aktif, setAktif] = useState(0)

  const hasil = useMemo(() => {
    const k = rapikan(kueri).replace(/\s+/g, ' ').trim()
    if (!k) return semuaHalaman
    return semuaHalaman
      .map((halaman, urutan) => ({ halaman, urutan, nilai: peringkat(halaman, k) }))
      .filter((x): x is { halaman: Halaman; urutan: number; nilai: number } => x.nilai !== null)
      .sort((a, b) => a.nilai - b.nilai || a.urutan - b.urutan)
      .map((x) => x.halaman)
  }, [kueri])

  // Ctrl+K / ⌘K dari mana pun, dan "/" selama tidak sedang mengetik di isian.
  // Tombol yang sudah dipakai komponen — mis. "/" saat mengetik "25/12" di
  // Datepicker — sudah `defaultPrevented` begitu sampai di window, jadi dilewati.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.defaultPrevented) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      } else if (e.key === '/' && !open && !sedangMengisi(e.target)) {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  // Prop `open` yang memegang kendali; dialognya hanya mengikuti.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.setAttribute('closedby', 'any')
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Pilihan yang aktif selalu terlihat saat dipindah dengan panah.
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${aktif}`)?.scrollIntoView({ block: 'nearest' })
  }, [aktif, listId, open])

  const buka = (route: string) => {
    window.location.hash = route
    onOpenChange(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasil.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAktif((i) => (i + 1) % hasil.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAktif((i) => (i - 1 + hasil.length) % hasil.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      buka(hasil[aktif].route)
    }
  }

  // Cadangan tutup-lewat-klik-di-luar untuk peramban tanpa `closedby`: klik
  // pada latar mendarat di elemen <dialog> itu sendiri, di luar kotaknya.
  const klikLatar = (e: MouseEvent<HTMLDialogElement>) => {
    if ('closedBy' in HTMLDialogElement.prototype || e.target !== e.currentTarget) return
    const kotak = e.currentTarget.getBoundingClientRect()
    const diDalam =
      kotak.top <= e.clientY && e.clientY <= kotak.bottom && kotak.left <= e.clientX && e.clientX <= kotak.right
    if (!diDalam) onOpenChange(false)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Cari halaman"
      onClose={() => {
        onOpenChange(false)
        setKueri('')
        setAktif(0)
      }}
      onClick={klikLatar}
      className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-white p-0 shadow-xl backdrop:bg-gray-900/40"
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <svg
          className="size-4.5 shrink-0 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="m20 20-4.5-4.5M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={hasil.length ? `${listId}-${aktif}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          placeholder="Cari halaman… (mis. tombol, tanggal, dropdown)"
          value={kueri}
          onChange={(e) => {
            setKueri(e.target.value)
            setAktif(0)
          }}
          onKeyDown={onKeyDown}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-bold text-gray-500 max-sm:hidden">
          Esc
        </kbd>
      </div>

      {hasil.length ? (
        <ul id={listId} role="listbox" aria-label="Halaman" className="ds-scroll-y max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {hasil.map((halaman, i) => (
            <li key={halaman.route} id={`${listId}-${i}`} role="option" aria-selected={i === aktif}>
              <a
                href={`#${halaman.route}`}
                tabIndex={-1}
                onMouseMove={() => setAktif(i)}
                onClick={(e) => {
                  // Klik dengan tombol pengubah dibuka di tab baru; jendelanya tetap.
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) onOpenChange(false)
                }}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${
                  i === aktif ? 'bg-primary-50' : ''
                }`}
              >
                <span className="min-w-0">
                  <span
                    className={`block truncate text-sm font-bold ${i === aktif ? 'text-primary-700' : 'text-gray-900'}`}
                  >
                    {halaman.label}
                  </span>
                  <span className="block truncate text-xs text-gray-500">{halaman.letak}</span>
                </span>
                {i === aktif && (
                  <span aria-hidden="true" className="shrink-0 text-xs text-gray-400">
                    ↵
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-gray-500">
          Tidak ada halaman yang cocok dengan “{kueri.trim()}”.
        </p>
      )}

      {/* Petunjuk papan ketik — tidak berarti di layar sentuh, jadi disembunyikan di mobile. */}
      <div className="flex gap-4 border-t border-border bg-gray-50 px-4 py-2.5 text-[11px] text-gray-500 max-sm:hidden">
        <span>↑↓ pindah</span>
        <span>↵ buka</span>
        <span>Esc tutup</span>
        <span className="ml-auto">{pintasanCari} dari halaman mana pun</span>
      </div>
    </dialog>
  )
}
