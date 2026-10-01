import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

/** Warna semantik satu aksi. */
export type DropdownItemTone = 'default' | 'danger'

/** Satu aksi di dalam panel. */
export interface DropdownItem {
  id?: string
  label: ReactNode
  /** Baris kedua di bawah label, untuk aksi yang perlu penjelasan singkat. */
  description?: ReactNode
  /** Ikon kecil di kiri label. Ukurannya diatur komponen. */
  icon?: ReactNode
  /** Bila diisi, aksinya dirender sebagai tautan. */
  href?: string
  onClick?: () => void
  tone?: DropdownItemTone
  disabled?: boolean
  /**
   * Menandai baris ini sebagai pilihan yang sedang aktif. Begitu ada satu
   * baris yang memakainya, panel berpindah peran: dari menu aksi menjadi
   * daftar pilihan (`listbox`), dan barisnya jadi `option` yang ditelusuri
   * dengan panah alih-alih Tab. Bentuk inilah yang dipakai Select dan Search
   * untuk daftar pilihannya.
   *
   * Rupanya tidak berubah sama sekali — tidak ada warna baru untuk baris
   * terpilih. Yang aktif dikenali pembaca layar lewat `aria-selected`, dan
   * terlihat karena panel membuka dengan fokus sudah berada di sana.
   */
  selected?: boolean
}

/** Kelompok aksi; `separator` menambahkan pemisah sebelum kelompok ini. */
export interface DropdownGroup {
  id: string
  label?: string
  separator?: boolean
  items: DropdownItem[]
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Elemen yang membuka panel — satu `<button>` milik Anda, biasanya `Button`.
   * Komponen ini menyalinnya untuk memasang atribut Popover, jadi yang dikirim
   * harus satu elemen tunggal, bukan teks atau pecahan.
   */
  trigger: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
  /** Daftar aksi tanpa pengelompokan. */
  items?: DropdownItem[]
  /** Aksi terkelompok, lengkap dengan label dan pemisah antar-kelompok. */
  groups?: DropdownGroup[]
  /**
   * Isi panel bila bukan daftar aksi — form kecil, daftar panjang yang
   * digulir, apa pun. Diabaikan selama `items` atau `groups` masih terisi.
   */
  children?: ReactNode
  /**
   * Menempelkan panel pada tombolnya: lebarnya mengikuti lebar tombol,
   * posisinya diukur dari kotak tombol, dan dihitung ulang saat halaman
   * digulir atau jendela diubah ukurannya. Pembungkusnya pun tidak lagi
   * membentuk kotak sendiri, jadi tombolnya bisa ditata bebas oleh induknya.
   *
   * Dipakai bila panel harus terbaca sebagai bagian dari field di atasnya —
   * begitulah Select dan Search memasang daftar pilihannya. Tanpa prop ini
   * panel memakai lebar tetap dan menempel di bawah tombol seperti biasa.
   */
  attached?: boolean
  /**
   * Nama panel bagi pembaca layar. Hanya terpasang pada bentuk daftar
   * pilihan, karena menu aksi sudah cukup dikenali lewat tombolnya.
   */
  contentLabel?: string
  /** Kelas untuk panelnya. `className` sendiri menuju pembungkus terluar. */
  contentClassName?: string
}

const tones: Record<DropdownItemTone, string> = {
  default: 'text-gray-700 hover:bg-gray-100',
  danger: 'text-red-600 hover:bg-red-50',
}

/** Jarak panel dari tombol dan dari tepi layar, dalam piksel. */
const JARAK = 4

/** Jeda antar-ketikan yang masih dianggap satu kata saat melompat ke baris. */
const JEDA_KETIK = 500

/** `newState` belum ada di lib.dom semua versi TypeScript, jadi ditulis sendiri. */
type PeristiwaToggle = Event & { newState?: string }

/**
 * Dropdown — panel yang dibuka dari sebuah tombol.
 *
 * Isinya ditentukan prop, bukan subkomponen: `trigger` untuk tombolnya,
 * `items` atau `groups` untuk daftar barisnya. Itu mengikuti komponen lain di
 * kit ini — Sidebar memakai `items` + `groups` dengan `separator` yang sama
 * persis artinya, Select memakai `options` — sehingga tidak ada satu komponen
 * pun yang dipakai dengan cara yang berbeda dari tetangganya.
 *
 * Punya dua peran. Bawaannya menu aksi: tiap baris sebuah tombol atau tautan,
 * ditelusuri dengan Tab. Begitu ada baris yang memakai `selected`, ia jadi
 * daftar pilihan — `listbox` berisi `option` yang ditelusuri dengan panah,
 * Home/End, atau dengan mengetik huruf awalnya. Peran kedua itulah yang
 * dipakai Select dan Search, jadi panel di seluruh kit hanya ada satu.
 *
 * Visibilitasnya diurus HTML Popover API: peramban yang menutup panel saat
 * pengguna menekan di luar atau menekan Escape, mengangkatnya ke top layer,
 * dan menjaga urutan fokus. Keadaan buka/tutup di sini hanya cerminan —
 * dibaca dari event `toggle` peramban untuk mengisi `aria-expanded` — jadi
 * tidak ada yang bisa melenceng dari keadaan sebenarnya.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  { trigger, items, groups, children, attached, className, contentLabel, contentClassName, ...props },
  ref,
) {
  const contentId = useId()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const ketikan = useRef({ teks: '', waktu: 0 })
  const [terbuka, setTerbuka] = useState(false)

  const pasangWrap = (node: HTMLDivElement | null) => {
    wrapRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  // Tombol pemicu selalu anak langsung pembungkus — ia disalin ke sana oleh
  // komponen ini — jadi tidak perlu ref sendiri yang bisa bentrok dengan ref
  // milik pemakainya.
  const pemicu = () => wrapRef.current?.querySelector<HTMLElement>(':scope > button') ?? null

  // Menutup panel setelah sebuah aksi dijalankan. Dicek dulu apakah ia memang
  // sedang terbuka: `hidePopover()` pada panel yang tertutup melempar.
  const tutup = useCallback(() => {
    const panel = contentRef.current
    if (panel?.isConnected && panel.matches(':popover-open')) panel.hidePopover()
  }, [])

  /**
   * Panel berada di top layer, jadi posisinya tidak bisa diwariskan dari
   * induknya. Dalam bentuk `attached` ia diukur sendiri dari kotak tombol,
   * dan diukur ulang selama terbuka karena elemen `fixed` tidak ikut bergerak
   * saat halaman digulir.
   */
  const tempatkan = useCallback(() => {
    const panel = contentRef.current
    const tombol = pemicu()
    if (!panel || !tombol) return

    const kotak = tombol.getBoundingClientRect()
    panel.style.minWidth = `${kotak.width}px`

    const lebar = panel.offsetWidth || kotak.width
    panel.style.left = `${Math.max(JARAK, Math.min(kotak.left, window.innerWidth - lebar - JARAK))}px`

    // Dibalik ke atas hanya bila memang tidak muat di bawah sekaligus lebih
    // lapang di atas; kalau dua-duanya sempit, tetap di bawah supaya arah
    // bukanya tidak berubah-ubah.
    const tinggi = panel.offsetHeight
    const ruangBawah = window.innerHeight - kotak.bottom - JARAK
    panel.style.top =
      tinggi > ruangBawah && kotak.top - JARAK > ruangBawah
        ? `${Math.max(JARAK, kotak.top - tinggi - JARAK)}px`
        : `${kotak.bottom + JARAK}px`
  }, [])

  if (!isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(trigger)) {
    throw new Error('Dropdown memerlukan satu elemen <button> yang valid pada prop `trigger`.')
  }

  const daftar: DropdownGroup[] = groups ?? (items ? [{ id: 'utama', items }] : [])
  const pakaiDaftar = daftar.length > 0
  const pilihan = daftar.some((group) => group.items.some((item) => item.selected !== undefined))

  /** Baris yang masih bisa dipilih, urut tampilan. */
  const barisHidup = () =>
    Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[data-baris]:not([aria-disabled="true"]):not(:disabled)',
      ) ?? [],
    )

  useEffect(() => {
    const panel = contentRef.current
    if (!panel) return

    // `beforetoggle` menempatkan panel sebelum ia tampil supaya tidak terlihat
    // melompat; `toggle` mengulanginya setelah tinggi aslinya terukur.
    const sebelum = (e: Event) => {
      const jadiBuka = (e as PeristiwaToggle).newState === 'open'
      setTerbuka(jadiBuka)
      if (jadiBuka && attached) tempatkan()
    }

    const sesudah = (e: Event) => {
      if ((e as PeristiwaToggle).newState === 'open') {
        if (attached) tempatkan()
        // Pada daftar pilihan, fokus jatuh ke baris yang sedang aktif supaya
        // panah bergerak dari sana — seperti perilaku `<select>` bawaan.
        if (pilihan) {
          const aktif = panel.querySelector<HTMLElement>('[data-baris][aria-selected="true"]')
          ;(aktif ?? barisHidup()[0])?.focus()
        }
      } else if (pilihan && panel.contains(document.activeElement)) {
        // Ditutup selagi fokus ada di dalamnya — Escape, klik di luar, atau
        // sebuah pilihan diambil — jadi fokus dikembalikan ke tombolnya.
        pemicu()?.focus()
      }
    }

    panel.addEventListener('beforetoggle', sebelum)
    panel.addEventListener('toggle', sesudah)
    return () => {
      panel.removeEventListener('beforetoggle', sebelum)
      panel.removeEventListener('toggle', sesudah)
    }
  }, [attached, pilihan, tempatkan])

  useEffect(() => {
    if (!attached || !terbuka) return
    const ikut = () => tempatkan()
    // `true` supaya guliran pada pembungkus mana pun ikut terdengar, bukan
    // hanya guliran halaman.
    window.addEventListener('scroll', ikut, true)
    window.addEventListener('resize', ikut)
    return () => {
      window.removeEventListener('scroll', ikut, true)
      window.removeEventListener('resize', ikut)
    }
  }, [attached, terbuka, tempatkan])

  const panelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Panel berisi konten bebas boleh memakai papan ketiknya sendiri; yang
    // diatur di sini hanya panel yang isinya daftar.
    if (!pakaiDaftar) return

    const baris = barisHidup()
    if (!baris.length) return
    const kini = baris.indexOf(document.activeElement as HTMLElement)
    const ke = (i: number) => {
      e.preventDefault()
      baris[i]?.focus()
    }

    switch (e.key) {
      case 'ArrowDown':
        return ke(kini < 0 ? 0 : (kini + 1) % baris.length)
      case 'ArrowUp':
        return ke(kini < 0 ? baris.length - 1 : (kini - 1 + baris.length) % baris.length)
      case 'Home':
        return ke(0)
      case 'End':
        return ke(baris.length - 1)
      case 'Enter':
      case ' ':
        // Baris menu sudah berupa tombol, jadi peramban yang menanganinya.
        // Yang perlu dibantu hanya `option`, yang bukan elemen interaktif.
        if (pilihan && kini >= 0) {
          e.preventDefault()
          baris[kini].click()
        }
        return
      case 'Tab':
        return tutup()
    }

    // Mengetik huruf melompat ke baris yang diawali huruf itu. Ketikan yang
    // berdekatan digabung, jadi "ja" membedakan Jawa Barat dari Jakarta.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const sekarang = Date.now()
      const lanjutan = sekarang - ketikan.current.waktu < JEDA_KETIK
      const teks = (lanjutan ? ketikan.current.teks : '') + e.key.toLowerCase()
      ketikan.current = { teks, waktu: sekarang }

      const temu = baris.find((el) => (el.textContent ?? '').trim().toLowerCase().startsWith(teks))
      if (temu) {
        e.preventDefault()
        temu.focus()
      }
    }
  }

  const renderItem = (item: DropdownItem, key: Key) => {
    const tone = item.tone ?? 'default'
    const jalankan = () => {
      item.onClick?.()
      tutup()
    }

    const isi = (
      <>
        {item.icon && (
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center [&_svg]:size-3.5',
              tone === 'default' && 'text-gray-500',
            )}
          >
            {item.icon}
          </span>
        )}

        {item.description ? (
          <span className="min-w-0 flex-1">
            <span className="block">{item.label}</span>
            <span className="mt-0.5 block text-xs font-normal text-gray-500">
              {item.description}
            </span>
          </span>
        ) : (
          item.label
        )}
      </>
    )

    const dasar =
      'flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm leading-normal font-medium transition-colors'

    // Baris daftar pilihan adalah `option`, bukan tombol: pembaca layar
    // menyebutkannya sebagai pilihan, dan fokusnya berpindah dengan panah.
    // Rupanya sengaja tidak dibedakan sedikit pun dari baris menu — yang
    // sedang terpilih ditandai `aria-selected` dan diberi fokus saat panel
    // dibuka, jadi latar abu-abunya itu keadaan fokus yang sudah ada, bukan
    // warna baru.
    if (pilihan) {
      return (
        <div
          key={key}
          role="option"
          tabIndex={-1}
          data-baris=""
          aria-selected={Boolean(item.selected)}
          aria-disabled={item.disabled || undefined}
          onClick={() => {
            if (!item.disabled) jalankan()
          }}
          className={cn(
            dasar,
            // `select-none` dan kursor panah menyamakan <div> ini dengan baris
            // menu yang berupa <button>: tombol memang tidak bisa diseret
            // teksnya dan tidak memunculkan kursor tangan.
            'outline-none select-none',
            item.disabled
              ? cn('cursor-not-allowed opacity-50', tone === 'danger' ? 'text-red-600' : 'text-gray-700')
              : cn('cursor-default', tones[tone], 'focus:bg-gray-100'),
          )}
        >
          {isi}
        </div>
      )
    }

    const kelas = cn(
      dasar,
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
      'disabled:cursor-not-allowed disabled:opacity-50',
      tones[tone],
    )

    // Aksi yang berpindah halaman dirender sebagai tautan supaya bisa dibuka
    // di tab baru dan disalin alamatnya. Yang dimatikan tetap <button>: <a>
    // tanpa href tidak punya keadaan disabled yang berarti.
    if (item.href && !item.disabled) {
      return (
        <a key={key} href={item.href} data-baris="" className={kelas} onClick={jalankan}>
          {isi}
        </a>
      )
    }

    return (
      <button
        key={key}
        type="button"
        data-baris=""
        disabled={item.disabled}
        className={kelas}
        onClick={jalankan}
      >
        {isi}
      </button>
    )
  }

  const barisan = (group: DropdownGroup) =>
    group.items.map((item, i) => renderItem(item, item.id ?? i))

  // Satu kelompok tanpa label dan tanpa pemisah tidak perlu pembungkus
  // sendiri. Pada daftar pilihan itu bukan sekadar rapi: `option` harus jadi
  // anak langsung `listbox`, bukan cucunya.
  const polos = daftar.length === 1 && !daftar[0].label && !daftar[0].separator

  return (
    <div
      ref={pasangWrap}
      // Dalam bentuk `attached` pembungkusnya sengaja tidak membentuk kotak:
      // penempatan panel sudah dihitung sendiri, jadi induknya bebas menata
      // tombolnya — sebagai isian yang memanjang, atau sebagai lapisan di atas
      // field yang sudah ada.
      className={cn(attached ? 'contents' : 'relative inline-block', className)}
      {...props}
    >
      {cloneElement(trigger, {
        popoverTarget: contentId,
        popoverTargetAction: 'toggle',
        'aria-expanded': terbuka,
        ...(pilihan ? { 'aria-haspopup': 'listbox' as const, 'aria-controls': contentId } : null),
      })}

      <div
        ref={contentRef}
        id={contentId}
        popover="auto"
        role={pilihan ? 'listbox' : undefined}
        aria-label={pilihan ? contentLabel : undefined}
        onKeyDown={panelKeyDown}
        className={cn(
          'fixed inset-auto max-w-[calc(100vw-1rem)] rounded-lg bg-surface text-content shadow-md',
          attached
            ? 'm-0 max-h-72 overflow-y-auto overscroll-contain'
            : 'mt-2 mr-0 mb-0 ml-0 w-56 [position-area:bottom_center]',
          pakaiDaftar && 'py-1',
          contentClassName,
        )}
      >
        {!pakaiDaftar
          ? children
          : polos
            ? barisan(daftar[0])
            : daftar.map((group) => (
                <div
                  key={group.id}
                  role={pilihan ? 'group' : undefined}
                  aria-label={pilihan ? group.label : undefined}
                >
                  {group.separator && (
                    <hr aria-hidden="true" className="my-1 border-0 border-t border-border" />
                  )}
                  {group.label && (
                    // Pada daftar pilihan kelompoknya sudah bernama lewat
                    // `aria-label`, jadi judul yang terlihat ini disembunyikan
                    // dari pembaca layar supaya tidak dibacakan dua kali.
                    <p
                      aria-hidden={pilihan || undefined}
                      className="px-4 pt-2 pb-1 text-caption font-bold tracking-wide text-gray-400 uppercase"
                    >
                      {group.label}
                    </p>
                  )}
                  {barisan(group)}
                </div>
              ))}
      </div>
    </div>
  )
})

Dropdown.displayName = 'Dropdown'
