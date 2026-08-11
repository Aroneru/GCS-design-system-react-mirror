import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { InfoCircle } from 'flowbite-react-icons/solid'
import { cn } from '../utils/cn'

/** Warna aksen per aplikasi — dipakai ikon info dan garis saat field difokus. */
export type SelectApplication = 'default' | 'simaya'

/** State mengikuti varian Figma. `inactive` sekaligus menonaktifkan kontrol. */
export type SelectState = 'default' | 'inactive'

/** Satu pilihan pada dropdown. */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const accents: Record<SelectApplication, { icon: string; focus: string }> = {
  default: { icon: 'text-primary-500', focus: 'focus-within:border-primary-500' },
  simaya: { icon: 'text-purple-500', focus: 'focus-within:border-purple-500' },
}

/**
 * Panah dropdown 8×4 di dalam kotak ikon 12px, digambar sendiri supaya
 * ukurannya persis seperti Figma — ikon panah dari pustaka jauh lebih kecil.
 */
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

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Teks label di atas field. */
  label?: ReactNode
  /** Keterangan singkat pada ikon info di samping label. Ikon muncul bila prop ini diisi. */
  info?: string
  /** Caption/pesan bantuan di bawah field. */
  helperText?: ReactNode
  /** Teks saat belum ada pilihan, mis. "Pilih Apapun Itu". */
  placeholder?: string
  /** Daftar pilihan. Bila kosong, `children` (<option> sendiri) yang dipakai. */
  options?: SelectOption[]
  application?: SelectApplication
  state?: SelectState
  /** Kelas untuk pembungkus terluar (label + field + caption). */
  className?: string
}

/**
 * Regular Select Form — dropdown satu pilihan.
 *
 * Memakai elemen `<select>` bawaan supaya keyboard, pembaca layar, dan daftar
 * pilihan bawaan sistem tetap berfungsi; hanya panahnya yang digambar sendiri.
 * State `inactive` menonaktifkan kontrol sekaligus meredupkan tampilannya, dan
 * warna ikon info serta garis saat difokus mengikuti prop `application`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    info,
    helperText,
    placeholder,
    options,
    application = 'default',
    state = 'default',
    className,
    id,
    value,
    defaultValue,
    disabled,
    onChange,
    children,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  // Field tak terkendali tidak punya `value`, jadi pilihannya dicatat sendiri
  // agar teks placeholder tetap bisa dibedakan warnanya dari pilihan sungguhan.
  const [chosen, setChosen] = useState(() => String(defaultValue ?? ''))
  const current = value !== undefined ? String(value) : chosen

  const isInactive = disabled || state === 'inactive'
  const isPlaceholder = current === ''
  const accent = accents[application]

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setChosen(event.target.value)
    onChange?.(event)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center gap-2">
          <label htmlFor={fieldId} className="text-sm font-bold text-gray-900">
            {label}
          </label>
          {info && (
            <span
              title={info}
              aria-label={info}
              className={cn('flex shrink-0 items-center', isInactive ? 'text-gray-400' : accent.icon)}
            >
              <InfoCircle className="size-3" />
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative flex items-center rounded-lg border border-gray-300 transition-colors',
          isInactive ? 'bg-gray-100' : cn('bg-gray-50', accent.focus),
        )}
      >
        <select
          ref={ref}
          id={fieldId}
          value={value}
          defaultValue={defaultValue}
          disabled={isInactive}
          aria-describedby={helperText ? helperId : undefined}
          onChange={handleChange}
          className={cn(
            // Tinggi 37px mengikuti Figma; panah bawaan browser dimatikan dan
            // diganti ikon sendiri, jadi sisi kanan diberi ruang lebih.
            'h-9.25 w-full appearance-none bg-transparent pr-8 pl-2.5 text-sm outline-none disabled:cursor-not-allowed',
            isInactive ? 'text-gray-300' : isPlaceholder ? 'text-gray-500' : 'text-gray-900',
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : children}
        </select>

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute right-2.5 flex items-center',
            isInactive ? 'text-gray-300' : 'text-gray-500',
          )}
        >
          <ChevronIcon />
        </span>
      </div>

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', isInactive ? 'text-gray-400' : 'text-gray-500')}>
          {helperText}
        </p>
      )}
    </div>
  )
})
