import {
  forwardRef,
  useId,
  useRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Search as SearchIcon } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

/** Ukuran kotak: `default` 54px (desktop), `mobile` 50px. */
export type SearchPlatform = 'default' | 'mobile'

/** Warna aksen per aplikasi — dipakai tombol cari dan garis saat field difokus. */
export type SearchApplication = 'default' | 'simaya'

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
  /** Dipanggil saat tombol ditekan atau Enter di dalam field. */
  onSearch?: (value: string, category: string) => void
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
}

/**
 * Search Form — kolom pencarian dengan tombol cari.
 *
 * Punya dua bentuk. Tanpa prop `categories` ia jadi satu kotak berisi ikon
 * kaca pembesar, isian, dan tombol berlabel. Dengan `categories` ia jadi tiga
 * ruas menyatu: dropdown kategori, isian, lalu tombol ikon.
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
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  const inputRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)

  const size = platforms[platform]
  const accent = accents[application]
  const withCategory = Boolean(categories?.length)

  // Ref internal dipakai untuk membaca isi field saat pencarian dijalankan;
  // ref dari luar tetap diteruskan supaya pemakai masih bisa memfokuskan field.
  const attachInput = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const submit = () => onSearch?.(inputRef.current?.value ?? '', categoryRef.current?.value ?? '')

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
      className={cn(
        'min-w-0 flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-500',
        'disabled:cursor-not-allowed disabled:text-gray-400',
        // Safari dan Chrome menambahkan tombol silang sendiri pada type="search";
        // ia bukan bagian dari rancangan ini dan tidak bisa diberi gaya, jadi dimatikan.
        '[&::-webkit-search-cancel-button]:appearance-none',
      )}
      {...props}
    />
  )

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={fieldId} className="mb-2 block text-sm font-bold text-gray-900">
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
              'relative flex shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 transition-colors',
              !disabled && accent.groupFocus,
            )}
          >
            <select
              ref={categoryRef}
              value={category}
              defaultValue={defaultCategory}
              disabled={disabled}
              aria-label={categoryPlaceholder}
              onChange={(event) => onCategoryChange?.(event.target.value)}
              className={cn(
                'h-full appearance-none bg-transparent pr-10 pl-5 text-sm outline-none',
                'disabled:cursor-not-allowed disabled:text-gray-400',
                'text-gray-900',
              )}
            >
              <option value="">{categoryPlaceholder}</option>
              {categories?.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>

            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute right-5 flex items-center',
                disabled ? 'text-gray-400' : 'text-gray-900',
              )}
            >
              <ChevronIcon />
            </span>
          </div>

          <div
            className={cn(
              'flex min-w-0 flex-1 items-center border-y border-gray-300 bg-gray-50 px-2.5 text-sm transition-colors',
              !disabled && accent.groupFocus,
            )}
          >
            {input}
          </div>

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
        </div>
      ) : (
        <div
          role="search"
          className={cn(
            'flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-2.5 transition-colors',
            size.field,
            size.text,
            !disabled && accent.focus,
          )}
        >
          <span
            className={cn(
              'flex shrink-0 items-center',
              disabled ? 'text-gray-400' : 'text-gray-500',
            )}
          >
            <SearchIcon className={size.icon} />
          </span>

          {input}

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
        </div>
      )}

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', disabled ? 'text-gray-400' : 'text-gray-500')}>
          {helperText}
        </p>
      )}
    </div>
  )
})
