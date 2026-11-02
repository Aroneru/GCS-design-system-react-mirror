import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type AriaAttributes,
  type HTMLAttributeAnchorTarget,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../utils/cn'

/** Warna semantik satu aksi. */
export type DropdownItemTone = 'default' | 'danger'
export type DropdownCloseOnSelect = boolean

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
  /** Target native untuk item tautan. Diabaikan pada aksi tombol dan item disabled. */
  target?: HTMLAttributeAnchorTarget
  /** Relasi native untuk item tautan. `_blank` memakai `noopener noreferrer` bila prop ini kosong. */
  rel?: string
  /** Dipanggil dengan event klik asli sebelum kebijakan penutupan dijalankan. */
  onClick?: (event: MouseEvent<HTMLElement>) => void
  tone?: DropdownItemTone
  disabled?: boolean
  /**
   * Menandai tujuan navigasi saat ini tanpa mengubah koleksi menjadi listbox.
   * `true` dipetakan ke `aria-current="page"`; token lain diteruskan apa adanya.
   */
  current?: AriaAttributes['aria-current']
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

/** Aksi lifecycle yang tersedia bagi konten Dropdown kustom. */
export interface DropdownRenderProps {
  /** Menutup panel bila sedang terbuka. Aman dipanggil berulang kali. */
  close: () => void
}

/** Handle lifecycle opsional untuk menutup Dropdown dari kondisi eksternal. */
export interface DropdownHandle {
  /** Menutup panel bila sedang terbuka. Aman dipanggil berulang kali. */
  close: () => void
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Batas tema eksplisit; `darkMode` bernilai true selalu lebih diutamakan. */
  'data-theme'?: 'light' | 'dark'
  /**
   * Elemen yang membuka panel — satu `<button>` milik Anda, biasanya `Button`.
   * Komponen ini menyalinnya untuk memasang atribut Popover. Komponen tombol
   * kustom harus merender `<button>` sebagai root DOM langsung dan meneruskan
   * atribut `<button>` native yang diterimanya.
   */
  trigger: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
  /** Daftar aksi tanpa pengelompokan. */
  items?: DropdownItem[]
  /** Aksi terkelompok, lengkap dengan label dan pemisah antar-kelompok. */
  groups?: DropdownGroup[]
  /**
   * Isi panel bila bukan daftar aksi — form kecil, daftar panjang yang
   * digulir, apa pun. Render function menerima `close` untuk dismissal
   * eksplisit. Diabaikan selama `items` atau `groups` masih terisi.
   */
  children?: ReactNode | ((actions: DropdownRenderProps) => ReactNode)
  /**
   * Nama panel bagi pembaca layar. Hanya terpasang pada bentuk daftar
   * pilihan, karena menu aksi sudah cukup dikenali lewat tombolnya.
   */
  contentLabel?: string
  /** Kelas untuk panelnya. `className` sendiri menuju pembungkus terluar. */
  contentClassName?: string
  /** Perataan horizontal panel terhadap trigger sebelum dibatasi ke viewport. */
  align?: 'start' | 'center' | 'end'
  /** Memaksa tema gelap lokal. Tanpa prop ini Dropdown mewarisi `data-theme` consumer. */
  darkMode?: boolean
  /** Handle opsional untuk dismissal dari kondisi eksternal tanpa mengekspos DOM Popover. */
  actionsRef?: Ref<DropdownHandle>
  /**
   * Kebijakan penutupan item generated. `true` menutup panel setelah item
   * enabled diaktifkan; `false` membiarkan panel terbuka.
   */
  closeOnSelect?: DropdownCloseOnSelect
}

const tones: Record<DropdownItemTone, string> = {
  default: 'text-dropdown-item-content hover:bg-dropdown-item-hover-surface',
  danger: 'text-feedback-error hover:bg-dropdown-item-danger-hover-surface',
}

/** Jarak panel dari tombol dan dari tepi layar, dalam piksel. */
const JARAK = 4

/** Jeda antar-ketikan yang masih dianggap satu kata kunci saat melompat ke baris. */
const JEDA_KETIK = 1000

/** Teks pencarian tanpa perbedaan kapital, tanda diakritik, atau spasi berlebih. */
const rapikan = (teks: string) =>
  teks.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').toLowerCase()

/** Mencocokkan kata kunci pada awal label atau awal salah satu katanya. */
const diAwalKata = (teks: string, kunci: string) => {
  for (let i = teks.indexOf(kunci); i !== -1; i = teks.indexOf(kunci, i + 1)) {
    if (i === 0 || /[\s/(),.-]/.test(teks[i - 1])) return true
  }
  return false
}

/** Label baris untuk typeahead; teks deskripsi tidak ikut dicocokkan. */
const namaBaris = (element: HTMLElement) => {
  const semua = element.textContent ?? ''
  const keterangan = element.querySelector('[data-keterangan]')?.textContent ?? ''
  return rapikan(semua.slice(0, semua.length - keterangan.length)).trim()
}

const TRIGGER_CONTRACT_ERROR =
  '[Dropdown] `trigger` must render a native <button> as its direct DOM root and forward standard button attributes. Use a native <button>, the shared <Button> in button mode, or a custom button component that forwards ButtonHTMLAttributes<HTMLButtonElement>. Anchors, div/span elements, Fragments, wrapped buttons, and components that swallow trigger props are not supported.'

/** `newState` belum ada di lib.dom semua versi TypeScript, jadi ditulis sendiri. */
type PeristiwaToggle = Event & { newState?: string }

function resolveAriaCurrent(current: DropdownItem['current']) {
  if (current === true || current === 'true') return 'page'
  if (current === false || current === 'false') return undefined
  return current
}

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
  {
    trigger,
    items,
    groups,
    children,
    darkMode = false,
    actionsRef,
    closeOnSelect = true,
    align = 'start',
    className,
    contentLabel,
    contentClassName,
    'data-theme': dataTheme,
    ...props
  },
  ref,
) {
  const contentId = useId()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const barisAktifRef = useRef<HTMLElement | null>(null)
  const pulihkanFokusRef = useRef(false)
  const framePosisiRef = useRef(0)
  const ketikan = useRef({ teks: '', waktu: 0 })
  const spasiDitahanRef = useRef(false)
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

  useImperativeHandle(actionsRef, () => ({ close: tutup }), [tutup])

  /** Panel top-layer diukur dari tombol dan selalu dijaga di dalam viewport. */
  const tempatkan = useCallback(() => {
    const panel = contentRef.current
    const tombol = pemicu()
    if (!panel || !tombol) return

    const kotak = tombol.getBoundingClientRect()
    const lebarAman = Math.max(0, window.innerWidth - JARAK * 2)
    const lebarMinimum = Math.min(kotak.width, lebarAman)
    const tulis = (property: 'left' | 'top' | 'minWidth' | 'maxWidth' | 'maxHeight', value: string) => {
      if (panel.style[property] !== value) panel.style[property] = value
    }

    tulis('minWidth', `${lebarMinimum}px`)
    tulis('maxWidth', `${lebarAman}px`)

    const lebar = panel.offsetWidth || kotak.width
    const kiriIdeal =
      align === 'center'
        ? kotak.left + kotak.width / 2 - lebar / 2
        : align === 'end'
          ? kotak.right - lebar
          : kotak.left
    tulis('left', `${Math.max(JARAK, Math.min(kiriIdeal, window.innerWidth - lebar - JARAK))}px`)

    const ruangBawah = Math.max(0, window.innerHeight - JARAK - (kotak.bottom + JARAK))
    const ruangAtas = Math.max(0, kotak.top - JARAK - JARAK)
    const tinggiAlami = Math.max(panel.scrollHeight, panel.offsetHeight)
    const keAtas = tinggiAlami > ruangBawah && ruangAtas > ruangBawah
    const ruangTerpilih = keAtas ? ruangAtas : ruangBawah

    tulis('maxHeight', `${ruangTerpilih}px`)
    const tinggiPanel = panel.offsetHeight
    tulis(
      'top',
      keAtas ? `${Math.max(JARAK, kotak.top - JARAK - tinggiPanel)}px` : `${kotak.bottom + JARAK}px`,
    )
  }, [align])

  const batalkanPenempatan = useCallback(() => {
    if (!framePosisiRef.current) return
    window.cancelAnimationFrame(framePosisiRef.current)
    framePosisiRef.current = 0
  }, [])

  const mintaPenempatan = useCallback(() => {
    if (framePosisiRef.current) return
    framePosisiRef.current = window.requestAnimationFrame(() => {
      framePosisiRef.current = 0
      tempatkan()
    })
  }, [tempatkan])

  if (!isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(trigger)) {
    throw new Error(TRIGGER_CONTRACT_ERROR)
  }

  const daftar: DropdownGroup[] = groups ?? (items ? [{ id: 'utama', items }] : [])
  const pakaiDaftar = daftar.length > 0
  const semuaItem = daftar.flatMap((group) => group.items)
  const pilihan = semuaItem.some((item) => item.selected !== undefined)

  if (
    pilihan &&
    semuaItem.some((item) => item.selected === undefined || item.href !== undefined)
  ) {
    throw new Error(
      '[Dropdown] Action and selection items cannot be mixed in the same collection. Items using `selected` are treated as listbox options. Button/link actions, including items with `href`, must be kept in a separate Dropdown.',
    )
  }

  /** Baris yang masih bisa dipilih, urut tampilan. */
  const barisHidup = () =>
    Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[data-baris]:not([aria-disabled="true"]):not(:disabled)',
      ) ?? [],
    )

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const panel = contentRef.current
    if (!wrap || !panel) return

    const tombol = wrap.querySelector<HTMLButtonElement>(':scope > button')
    const tombolAdalahRoot =
      tombol !== null &&
      wrap.firstElementChild === tombol &&
      tombol.nextElementSibling === panel &&
      panel.nextElementSibling === null
    const targetBenar = tombol?.getAttribute('popovertarget') === contentId
    const aksiBenar = tombol?.getAttribute('popovertargetaction') === 'toggle'

    if (!tombolAdalahRoot || !targetBenar || !aksiBenar) {
      throw new Error(TRIGGER_CONTRACT_ERROR)
    }
  }, [contentId, trigger])

  useEffect(() => {
    const panel = contentRef.current
    if (!panel) return

    // `beforetoggle` menempatkan panel sebelum ia tampil supaya tidak terlihat
    // melompat; `toggle` mengulanginya setelah tinggi aslinya terukur.
    const sebelum = (e: Event) => {
      const jadiBuka = (e as PeristiwaToggle).newState === 'open'
      setTerbuka(jadiBuka)
      if (jadiBuka) {
        // Panel tertutup belum selalu punya lebar terukur. Sembunyikan hanya
        // siklus buka baru ini sampai `toggle` dapat menempatkannya memakai
        // ukuran panel sebenarnya, terutama untuk perataan center dan end.
        panel.style.visibility = 'hidden'
        tempatkan()
      } else {
        pulihkanFokusRef.current = panel.contains(document.activeElement)
        panel.style.visibility = 'hidden'
        batalkanPenempatan()
      }
    }

    const sesudah = (e: Event) => {
      if ((e as PeristiwaToggle).newState === 'open') {
        tempatkan()
        panel.style.visibility = 'visible'
        // Pada daftar pilihan, fokus jatuh ke baris yang sedang aktif supaya
        // panah bergerak dari sana — seperti perilaku `<select>` bawaan.
        if (pilihan) {
          const aktif = panel.querySelector<HTMLElement>(
            '[data-baris][aria-selected="true"]:not([aria-disabled="true"])',
          )
          const tujuan = aktif ?? barisHidup()[0]
          if (tujuan) {
            tujuan.focus()
            barisAktifRef.current = tujuan
          } else {
            pemicu()?.focus()
          }
        }
      } else if (pulihkanFokusRef.current) {
        // Ditutup selagi fokus ada di dalamnya — Escape, klik di luar, atau
        // sebuah pilihan diambil — jadi fokus dikembalikan ke tombolnya.
        const tombol = pemicu()
        if (tombol?.isConnected && tombol.getClientRects().length > 0) tombol.focus()
      }
      if ((e as PeristiwaToggle).newState !== 'open') {
        barisAktifRef.current = null
        pulihkanFokusRef.current = false
      }
    }

    panel.addEventListener('beforetoggle', sebelum)
    panel.addEventListener('toggle', sesudah)
    return () => {
      panel.removeEventListener('beforetoggle', sebelum)
      panel.removeEventListener('toggle', sesudah)
    }
  }, [batalkanPenempatan, pilihan, tempatkan])

  useEffect(() => {
    if (!terbuka) return
    // Event scroll sudah dikirim selaras dengan pembaruan visual peramban.
    // Tempatkan langsung agar panel tidak tertinggal satu frame dari tombol.
    const ikutScroll = () => tempatkan()
    const ikutResize = () => mintaPenempatan()
    // `true` supaya guliran pada pembungkus mana pun ikut terdengar, bukan
    // hanya guliran halaman.
    window.addEventListener('scroll', ikutScroll, true)
    window.addEventListener('resize', ikutResize)
    return () => {
      window.removeEventListener('scroll', ikutScroll, true)
      window.removeEventListener('resize', ikutResize)
      batalkanPenempatan()
    }
  }, [batalkanPenempatan, mintaPenempatan, tempatkan, terbuka])

  useEffect(() => {
    if (!terbuka) return

    const tombol = pemicu()
    const panel = contentRef.current
    if (!tombol || !panel) return

    // ResizeObserver menangkap perubahan ukuran tombol tanpa menunggu resize
    // jendela. Perpindahan posisi tidak punya observer DOM khusus, jadi selama
    // panel terbuka koordinat tombol dibandingkan per frame dan panel hanya
    // dihitung ulang bila benar-benar bergerak.
    const ukuran = new ResizeObserver(mintaPenempatan)
    ukuran.observe(tombol)
    ukuran.observe(panel)

    let kotak = tombol.getBoundingClientRect()
    let frame = 0
    const ikutiGerak = () => {
      const berikut = tombol.getBoundingClientRect()
      if (berikut.left !== kotak.left || berikut.top !== kotak.top) {
        kotak = berikut
        // Pemeriksaan ini sendiri sudah berjalan di dalam RAF; menjadwalkan
        // RAF kedua membuat panel tertinggal satu frame saat layout bergerak.
        tempatkan()
      }
      frame = window.requestAnimationFrame(ikutiGerak)
    }
    frame = window.requestAnimationFrame(ikutiGerak)

    return () => {
      ukuran.disconnect()
      window.cancelAnimationFrame(frame)
      batalkanPenempatan()
    }
  }, [batalkanPenempatan, mintaPenempatan, tempatkan, terbuka])

  useEffect(() => {
    if (!terbuka) return

    const panel = contentRef.current
    const sebelumnya = barisAktifRef.current
    if (!panel || !sebelumnya) return

    if (!pilihan) {
      barisAktifRef.current = null
      pemicu()?.focus()
      return
    }

    const hidup = barisHidup()
    if (sebelumnya.isConnected && panel.contains(sebelumnya) && hidup.includes(sebelumnya)) return

    const terpilih = panel.querySelector<HTMLElement>(
      '[data-baris][aria-selected="true"]:not([aria-disabled="true"])',
    )
    const pengganti = terpilih ?? hidup[0]
    if (pengganti) {
      pengganti.focus()
      barisAktifRef.current = pengganti
    } else {
      barisAktifRef.current = null
      pemicu()?.focus()
    }
  })

  const sedangMengetik = () => ketikan.current.teks !== '' && Date.now() - ketikan.current.waktu < JEDA_KETIK

  const lompatKetik = (huruf: string) => {
    const baris = barisHidup()
    if (!baris.length) return
    const kini = baris.indexOf(document.activeElement as HTMLElement)
    const teks = rapikan((sedangMengetik() ? ketikan.current.teks : '') + huruf)
    ketikan.current = { teks, waktu: Date.now() }
    const ulang = [...teks].every((character) => character === teks[0])
    const kunci = ulang ? teks[0] : teks
    const mulai = ulang ? kini + 1 : Math.max(kini, 0)
    const urut = [...baris.slice(mulai), ...baris.slice(0, mulai)]
    const temu =
      urut.find((element) => namaBaris(element).startsWith(kunci)) ??
      urut.find((element) => diAwalKata(namaBaris(element), kunci))

    if (temu) {
      temu.focus()
      barisAktifRef.current = temu
    }
  }

  const tangkapKetikan = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return false
    if (e.key === ' ' && !sedangMengetik()) return false
    e.preventDefault()
    if (e.key === ' ') spasiDitahanRef.current = true
    lompatKetik(e.key)
    return true
  }

  const tahanSpasi = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== ' ' || !spasiDitahanRef.current) return
    e.preventDefault()
    spasiDitahanRef.current = false
  }

  const panelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const baris = barisHidup()
    if (!baris.length) return

    if (pilihan) {
      const kini = baris.indexOf(document.activeElement as HTMLElement)
      const ke = (i: number) => {
        e.preventDefault()
        baris[i]?.focus()
        barisAktifRef.current = baris[i] ?? null
        ketikan.current = { teks: '', waktu: 0 }
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
          if (e.key === ' ' && sedangMengetik()) break
          if (kini >= 0) {
            e.preventDefault()
            baris[kini].click()
          }
          return
        case 'Tab':
          return tutup()
      }
    }

    tangkapKetikan(e)
  }

  const pemicuKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    trigger.props.onKeyDown?.(e)
    if (!e.defaultPrevented && terbuka && !pilihan) tangkapKetikan(e)
  }

  const pemicuKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    trigger.props.onKeyUp?.(e)
    tahanSpasi(e)
  }

  const renderItem = (item: DropdownItem, key: Key) => {
    const tone = item.tone ?? 'default'
    const current = item.href ? resolveAriaCurrent(item.current) : undefined
    const jalankan = (event: MouseEvent<HTMLElement>) => {
      item.onClick?.(event)

      if (closeOnSelect === false) return
      tutup()
    }

    const isi = (
      <>
        {item.icon && (
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center [&_svg]:size-3.5',
              tone === 'default' && 'text-dropdown-item-icon',
              item.disabled && 'text-dropdown-item-support-disabled',
            )}
          >
            {item.icon}
          </span>
        )}

        {item.description ? (
          <span className="min-w-0 flex-1">
            <span className="block">{item.label}</span>
            <span
              data-keterangan=""
              className={cn(
                'mt-0.5 block text-xs font-normal',
                'text-dropdown-item-description',
                item.disabled && 'text-dropdown-item-support-disabled',
              )}
            >
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
          onClick={(event) => {
            if (!item.disabled) jalankan(event)
          }}
          className={cn(
            dasar,
            // `select-none` dan kursor panah menyamakan <div> ini dengan baris
            // menu yang berupa <button>: tombol memang tidak bisa diseret
            // teksnya dan tidak memunculkan kursor tangan.
            'outline-none select-none',
            item.disabled
              ? cn(
                  'cursor-not-allowed opacity-50',
                  tone === 'danger' ? 'text-feedback-error' : 'text-dropdown-item-disabled',
                )
              : cn(
                  'cursor-default',
                  tones[tone],
                  'focus:bg-dropdown-item-hover-surface',
                ),
          )}
        >
          {isi}
        </div>
      )
    }

    const kelas = cn(
      dasar,
      'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
      'focus-visible:outline-brand',
      'disabled:cursor-not-allowed disabled:opacity-50',
      current
        ? 'bg-dropdown-item-current-surface text-content'
        : tones[tone],
    )

    // Aksi yang berpindah halaman dirender sebagai tautan supaya bisa dibuka
    // di tab baru dan disalin alamatnya. Yang dimatikan tetap <button>: <a>
    // tanpa href tidak punya keadaan disabled yang berarti.
    if (item.href && !item.disabled) {
      const rel = item.target === '_blank' ? (item.rel ?? 'noopener noreferrer') : item.rel

      return (
        <a
          key={key}
          href={item.href}
          target={item.target}
          rel={rel}
          aria-current={current}
          data-baris=""
          className={kelas}
          onClick={jalankan}
        >
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
      data-theme={darkMode ? 'dark' : dataTheme}
      className={cn('inline-block', className)}
      {...props}
    >
      {cloneElement(trigger, {
        popoverTarget: contentId,
        popoverTargetAction: 'toggle',
        'aria-expanded': terbuka,
        ...(pilihan ? { 'aria-haspopup': 'listbox' as const, 'aria-controls': contentId } : null),
        onKeyDown: pemicuKeyDown,
        onKeyUp: pemicuKeyUp,
      })}

      <div
        ref={contentRef}
        id={contentId}
        popover="auto"
        role={pilihan ? 'listbox' : undefined}
        aria-label={pilihan ? contentLabel : undefined}
        onKeyDown={panelKeyDown}
        onKeyUp={tahanSpasi}
        onFocusCapture={(event) => {
          const target = event.target
          if (target instanceof HTMLElement && target.matches('[data-baris]')) {
            barisAktifRef.current = target
          }
        }}
        className={cn(
          'fixed inset-auto m-0 overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg shadow-dropdown [overflow-wrap:anywhere]',
          'bg-dropdown-surface text-dropdown-content',
          pakaiDaftar && 'py-1',
          contentClassName,
        )}
      >
        {!pakaiDaftar
          ? typeof children === 'function' ? children({ close: tutup }) : children
          : polos
            ? barisan(daftar[0])
            : daftar.map((group) => (
                <div
                  key={group.id}
                  role={pilihan ? 'group' : undefined}
                  aria-label={pilihan ? group.label : undefined}
                >
                  {group.separator && (
                    <hr
                      aria-hidden="true"
                      className="my-1 border-0 border-t border-border"
                    />
                  )}
                  {group.label && (
                    // Pada daftar pilihan kelompoknya sudah bernama lewat
                    // `aria-label`, jadi judul yang terlihat ini disembunyikan
                    // dari pembaca layar supaya tidak dibacakan dua kali.
                    <p
                      aria-hidden={pilihan || undefined}
                      className="px-4 pt-2 pb-1 text-caption font-bold tracking-wide text-dropdown-group-label uppercase"
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
