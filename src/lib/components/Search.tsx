import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Search as SearchIcon } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { Dropdown, type DropdownItem } from './Dropdown'

/** Ukuran kotak: `default` 54px (desktop), `mobile` 50px, `compact` 37px (navbar). */
export type SearchPlatform = 'default' | 'mobile' | 'compact'

/** Warna aksen per aplikasi — dipakai tombol cari dan garis saat field difokus. */
export type SearchApplication = 'default' | 'purple' | 'simaya'

/** Satu pilihan pada dropdown kategori. */
export interface SearchCategory {
  value: string
  label: string
  disabled?: boolean
}

/**
 * Tinggi kotak, ukuran ikon, ukuran teks, dan ukuran tombol per platform.
 *
 * Tinggi dan ukuran teks tombolnya kebetulan sama dengan size `xs` dan `s`
 * milik Button, tapi Button tidak dipakai di sini: aksen simaya milik Button
 * purple-700 sedangkan tombol cari purple-500, dan jarak sampingnya `px-4`
 * sedangkan di sini 13px. Menimpa keduanya lewat `className` tidak bisa
 * diandalkan — `cn()` di sini clsx biasa, jadi kelas yang bertabrakan
 * diputuskan oleh urutan CSS, bukan urutan penulisan.
 */
const platforms: Record<
  SearchPlatform,
  { field: string; icon: string; text: string; button: string }
> = {
  default: {
    field: 'h-13.5',
    icon: 'size-4.5',
    text: 'text-base',
    button: 'h-[38px] px-[13px] text-sm',
  },
  mobile: {
    field: 'h-12.5',
    icon: 'size-3.5',
    text: 'text-sm',
    button: 'h-[34px] px-[13px] text-xs',
  },
  compact: {
    field: 'h-[37px]',
    icon: 'size-3.5',
    text: 'text-sm',
    button: 'h-[25px] px-[10px] text-xs',
  },
}

/**
 * Aksen per aplikasi. `focus` dipakai varian polos yang garisnya ada di
 * pembungkus, `groupFocus` dipakai varian kategori yang garisnya tersebar di
 * dua anak — keduanya ditulis utuh karena Tailwind memindai kelas secara
 * harfiah, jadi varian yang dirangkai dari potongan string tidak akan terbit.
 */
const accents: Record<
  SearchApplication,
  { solid: string; focus: string; groupFocus: string }
> = {
  default: {
    solid: 'bg-primary-700 hover:bg-primary-800 focus-visible:outline-primary-700',
    focus: 'focus-within:border-primary-500',
    groupFocus: 'group-focus-within:border-primary-500',
  },
  purple: {
    solid: 'bg-purple-500 hover:bg-purple-600 focus-visible:outline-purple-500',
    focus: 'focus-within:border-purple-500',
    groupFocus: 'group-focus-within:border-purple-500',
  },
  simaya: {
    solid: 'bg-purple-500 hover:bg-purple-600 focus-visible:outline-purple-500',
    focus: 'focus-within:border-purple-500',
    groupFocus: 'group-focus-within:border-purple-500',
  },
}

/** Panah dropdown kategori — bentuknya sama persis dengan panah di Select. */
const ChevronIcon = () => (
  <svg
    className="size-3"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 4.5 6 8.5l4-4" />
  </svg>
)

export interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onSubmit'> {
  /** Teks label di atas field. */
  label?: ReactNode
  /** Caption/pesan bantuan di bawah field. */
  helperText?: ReactNode
  /** Label tombol cari. Pada varian kategori ia jadi label aksesibilitas tombol ikon. */
  buttonLabel?: string
  /** Dipanggil saat tombol ditekan, Enter di dalam field, atau otomatis saat mengetik (bila trigger='change' / 'auto'). */
  onSearch?: (value: string, category: string) => void
  /**
   * Pemicu pemanggilan onSearch:
   * - `'enter'`: dipanggil saat tombol Cari diklik atau tombol Enter ditekan.
   * - `'change'` | `'auto'`: dipanggil otomatis setiap kali isian berubah (dengan jeda debounce).
   */
  trigger?: 'enter' | 'change' | 'auto'
  /** Jeda debounce (ms) untuk pemanggilan onSearch saat trigger='change' / 'auto'. Bawaannya 300ms. */
  debounce?: number
  /**
   * Menampilkan tombol cari di kanan.
   * Bawaannya `false` pada platform `compact` (untuk navbar), dan `true` pada platform lainnya.
   */
  showButton?: boolean
  /**
   * Hanya berlaku pada varian polos. Varian kategori tingginya tetap 39px di
   * lebar berapa pun — yang memanjang hanya isian di tengahnya.
   */
  platform?: SearchPlatform
  application?: SearchApplication
  /**
   * Daftar kategori. Begitu diisi, komponen berpindah ke varian "with category":
   * dropdown di kiri, field di tengah, tombol ikon di kanan. Dibuat implisit
   * karena varian kategori tanpa daftar kategori tidak punya arti — memisahnya
   * jadi prop `type` sendiri hanya akan membuka keadaan yang mustahil dipakai.
   */
  categories?: SearchCategory[]
  /** Teks dropdown saat kategori belum dipilih. */
  categoryPlaceholder?: string
  category?: string
  defaultCategory?: string
  onCategoryChange?: (value: string) => void
  /** Kelas untuk pembungkus terluar (label + field + caption). */
  className?: string
  /**
   * Memaksa field ini bertema gelap: field gray-700 dengan teks dan ikon yang
   * disesuaikan. Tanpa prop ini ia ikut tema elemen pembungkusnya, mis.
   * `<section data-theme="dark">`.
   */
  darkMode?: boolean
}

/**
 * Search Form — kolom pencarian dengan tombol cari.
 *
 * Punya dua bentuk. Tanpa prop `categories` ia jadi satu kotak berisi ikon
 * kaca pembesar, isian, dan tombol berlabel. Dengan `categories` ia jadi tiga
 * ruas menyatu: dropdown kategori, isian, lalu tombol ikon. Daftar kategorinya
 * panel Dropdown, sama dengan daftar pilihan Select.
 *
 * Pembungkusnya `<div role="search">`, bukan `<form>`. Kolom pencarian sering
 * dipasang di dalam formulir lain — halaman pengajuan, misalnya — dan `<form>`
 * bersarang tidak sah, browser akan membuang yang di dalam. Konsekuensinya
 * tidak ada implicit submission, jadi tombol Enter ditangani sendiri.
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    label,
    helperText,
    buttonLabel = 'Cari',
    onSearch,
    trigger = 'enter',
    debounce = 300,
    showButton,
    platform = 'default',
    application = 'default',
    categories,
    categoryPlaceholder = 'Kategori',
    category,
    defaultCategory,
    onCategoryChange,
    className,
    id,
    disabled,
    onKeyDown,
    onChange,
    darkMode = false,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  const inputRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const size = platforms[platform]
  const accent = accents[application]
  const withCategory = Boolean(categories?.length)
  const hasButton = showButton ?? (platform !== 'compact')
  const isLive = trigger === 'change' || trigger === 'auto'

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  // Tombol kategori perlu tahu kategori mana yang sedang aktif untuk menulis
  // labelnya; pada dropdown tak terkendali itu tidak ada di prop, jadi
  // dicatat sendiri persis seperti yang dilakukan Select.
  const [kategoriDipilih, setKategoriDipilih] = useState(() => String(defaultCategory ?? ""))
  const kategoriKini = category !== undefined ? String(category) : kategoriDipilih

  const [internalValue, setInternalValue] = useState(() => String(props.defaultValue ?? props.value ?? ""))
  const currentInputValue = props.value !== undefined ? String(props.value) : internalValue

  // Placeholder ikut jadi baris pilihan biasa, sama seperti ia jadi
  // <option value=""> pertama di <select>.
  const opsiKategori = [{ value: "", label: categoryPlaceholder }, ...(categories ?? [])]
  const labelKategori =
    opsiKategori.find((option) => option.value === kategoriKini)?.label ?? categoryPlaceholder

  // Ref internal dipakai untuk membaca isi field saat pencarian dijalankan;
  // ref dari luar tetap diteruskan supaya pemakai masih bisa memfokuskan field.
  const attachInput = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const submit = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    onSearch?.(inputRef.current?.value ?? currentInputValue, categoryRef.current?.value ?? '')
  }

  // <select> di belakang tombol kategori dikendalikan state ini, jadi memilih
  // cukup memperbarui state: nilai yang dibaca `onSearch` lewat `categoryRef`
  // ikut tersetel oleh React. Bandingkan dengan Select, yang harus menyetel
  // <select>-nya sendiri karena `onChange` di sana menjanjikan sebuah
  // ChangeEvent, dan itu hanya bisa datang dari elemennya.
  const pilihKategori = (nilai: string) => {
    setKategoriDipilih(nilai)
    onCategoryChange?.(nilai)
    if (isLive) {
      onSearch?.(currentInputValue, nilai)
    }
  }

  // `selected` inilah yang membuat panel Dropdown berpindah peran jadi
  // daftar pilihan; penempatan, papan ketik, dan penutupannya sudah jadi
  // urusan Dropdown, jadi tidak ada panel kedua di kit ini.
  const itemKategori: DropdownItem[] = opsiKategori.map((option) => ({
    id: `kategori-${option.value}`,
    label: option.label,
    disabled: option.disabled,
    selected: option.value === kategoriKini,
    onClick: () => pilihKategori(option.value),
  }))

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value)
    onChange?.(event)
    if (isLive) {
      const val = event.target.value
      const cat = categoryRef.current?.value ?? ''
      if (debounce > 0) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
          onSearch?.(val, cat)
        }, debounce)
      } else {
        onSearch?.(val, cat)
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.key === 'Enter' && !event.defaultPrevented) {
      event.preventDefault()
      submit()
    }
  }

  const input = (
    <input
      ref={attachInput}
      id={fieldId}
      type="search"
      disabled={disabled}
      aria-describedby={helperText ? helperId : undefined}
      onKeyDown={handleKeyDown}
      onChange={handleInputChange}
      className={cn(
        'min-w-0 flex-1 bg-transparent outline-none',
        'text-content placeholder:text-content-muted',
        'disabled:cursor-not-allowed disabled:text-content-disabled',
        // Safari dan Chrome menambahkan tombol silang sendiri pada type="search";
        // ia bukan bagian dari rancangan ini dan tidak bisa diberi gaya, jadi dimatikan.
        '[&::-webkit-search-cancel-button]:appearance-none',
      )}
      {...props}
    />
  )

  return (
    <div
      data-theme={darkMode ? 'dark' : undefined}
      className={cn(!className?.includes('w-') && 'w-full', className)}
    >
      {label && (
        <label htmlFor={fieldId} className="mb-2 block text-sm font-bold text-content">
          {label}
        </label>
      )}

      {withCategory ? (
        // Tinggi 39px persis, bukan dibulatkan ke 40. Pada tiga ruas yang
        // bersebelahan selisih 1px langsung terbaca sebagai garis yang tidak
        // sejajar dengan isian di sekitarnya.
        <div role="search" className="group flex h-[39px] items-stretch">
          <div
            className={cn(
              'relative flex shrink-0 items-center rounded-l-lg border transition-colors',
              'border-field-border bg-search-category-surface',
              !disabled && accent.groupFocus,
            )}
          >
            <select
              ref={categoryRef}
              value={kategoriKini}
              disabled={disabled}
              aria-hidden="true"
              tabIndex={-1}
              onChange={(event) => pilihKategori(event.target.value)}
              // Pembawa nilai saja, tapi tetap di alur: lebar ruas kategori
              // ditentukan pilihan terpanjangnya, bukan yang sedang aktif —
              // kalau ia dicabut, kotaknya melebar-menyempit tiap kali memilih.
              // Karena itu kelas ukurannya dipertahankan, sementara ia sendiri
              // tak terlihat dan tak bisa disentuh.
              className="pointer-events-none h-full appearance-none pr-10 pl-5 text-sm opacity-0"
            >
              <option value="">{categoryPlaceholder}</option>
              {categories?.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>

            <Dropdown
              attached
              contentLabel={categoryPlaceholder}
              items={itemKategori}
              darkMode={darkMode}
              trigger={
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={categoryPlaceholder}
                  className={cn(
                    'absolute inset-0 flex items-center pr-10 pl-5 text-left text-sm outline-none',
                    'disabled:cursor-not-allowed',
                    'text-content disabled:text-content-disabled',
                  )}
                >
                  <span className="truncate">{labelKategori}</span>
                </button>
              }
            />

            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute right-5 flex items-center',
                disabled ? 'text-content-disabled' : 'text-content',
              )}
            >
              <ChevronIcon />
            </span>
          </div>

          <div
            className={cn(
              'flex min-w-0 flex-1 items-center border-y px-2.5 text-sm transition-colors',
              'border-field-border bg-search-field-surface',
              !disabled && accent.groupFocus,
              !hasButton && 'rounded-r-lg border-r',
            )}
          >
            {input}
          </div>

          {hasButton && (
            <button
              type="button"
              onClick={submit}
              disabled={disabled}
              aria-label={buttonLabel}
              className={cn(
                'flex w-11 shrink-0 items-center justify-center rounded-r-lg text-white transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                accent.solid,
              )}
            >
              <SearchIcon className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          role="search"
          className={cn(
            'flex items-center gap-2 rounded-lg border px-2.5 transition-colors',
            disabled ? 'border-field-border bg-field-disabled' : 'border-field-border bg-search-field-surface',
            size.field,
            size.text,
            !disabled && accent.focus,
          )}
        >
          <span
            className={cn(
              'flex shrink-0 items-center',
              disabled ? 'text-content-disabled' : 'text-content-muted',
            )}
          >
            <SearchIcon className={size.icon} />
          </span>

          {input}

          {hasButton && (
            <button
              type="button"
              onClick={submit}
              disabled={disabled}
              className={cn(
                'shrink-0 rounded-lg font-medium text-white transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                size.button,
                accent.solid,
              )}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      )}

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', disabled ? 'text-content-disabled' : 'text-content-muted')}>
          {helperText}
        </p>
      )}
    </div>
  )
})
