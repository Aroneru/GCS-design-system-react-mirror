import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

/** Platform mengikuti varian desain: Default = desktop (58px), Mobile = 50px. */
export type FloatingLabelPlatform = 'default' | 'mobile'

/** State mengikuti varian desain: Default, Active, dan Error. */
export type FloatingLabelState = 'default' | 'active' | 'error'

/** Warna aksen per aplikasi — dipakai garis dan label saat field aktif. */
export type FloatingLabelApplication = 'default' | 'simaya'

/**
 * Tinggi kotak dan ukuran teks isian per platform. Label yang sudah naik
 * selalu 12px di kedua platform, jadi hanya teks di dalam field yang berubah.
 */
const platforms: Record<FloatingLabelPlatform, { box: string; text: string }> = {
  default: { box: 'h-14.5', text: 'text-sm' },
  mobile: { box: 'h-12.5', text: 'text-xs' },
}

/**
 * Garisnya sama di kedua tampilan; label yang naik satu tingkat lebih terang
 * pada tampilan gelap (desain: primary-500 di atas gray-800).
 */
const accents: Record<FloatingLabelApplication, { border: string; label: string; labelDark: string }> = {
  default: { border: 'border-primary-600', label: 'text-primary-600', labelDark: 'text-primary-500' },
  simaya: { border: 'border-purple-500', label: 'text-purple-500', labelDark: 'text-purple-400' },
}

/** Warna tiap bagian untuk tampilan terang dan gelap. */
const themes = {
  light: {
    // Latar label harus sama dengan latar kotak, karena ia menutup garis atas.
    surface: 'bg-surface',
    border: 'border-gray-300',
    icon: 'text-gray-800',
    iconError: 'text-red-600',
    field: 'text-gray-800 placeholder:text-gray-500 disabled:text-gray-400',
    clear: 'text-gray-500',
    clearError: 'text-red-600',
    label: 'text-gray-500',
    labelError: 'text-red-600',
    labelDisabled: 'text-gray-400',
    helper: 'text-gray-500',
    helperError: 'text-red-600',
  },
  // Desain gelap: pada error hanya garis dan label yang merah; ikon tetap abu-abu.
  dark: {
    surface: 'bg-gray-800',
    border: 'border-gray-800',
    icon: 'text-gray-400',
    iconError: 'text-gray-400',
    field: 'text-gray-400 placeholder:text-gray-500 disabled:text-gray-500',
    clear: 'text-gray-400',
    clearError: 'text-gray-400',
    label: 'text-gray-400',
    labelError: 'text-red-500',
    labelDisabled: 'text-gray-500',
    helper: 'text-gray-400',
    helperError: 'text-red-500',
  },
}

const ClearIcon = () => (
  <svg
    className="size-2.5"
    viewBox="0 0 10 10"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    aria-hidden="true"
  >
    <path strokeLinecap="round" d="M1 1l8 8M9 1L1 9" />
  </svg>
)

export interface FloatingLabelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Teks label. Saat field kosong ia duduk di dalam field; saat diisi ia naik ke garis atas. */
  label: ReactNode
  /** Caption di bawah field. Saat state `error`, ini jadi pesan kesalahan. */
  helperText?: ReactNode
  /** Ikon di sisi kiri field, mis. <User className="size-4" />. */
  icon?: ReactNode
  platform?: FloatingLabelPlatform
  state?: FloatingLabelState
  application?: FloatingLabelApplication
  /** Bila diisi, tombol hapus (×) muncul di sisi kanan field. */
  onClear?: () => void
  /** Tampilan gelap: kotak gray-800 dengan teks dan ikon abu-abu. */
  darkMode?: boolean
  /** Kelas untuk pembungkus terluar (field + caption). */
  className?: string
}

/**
 * Floating Label — isian teks yang labelnya naik ke garis atas begitu field
 * difokus atau berisi.
 *
 * Label naik sendiri saat field difokus/berisi, jadi prop `state` hanya perlu
 * diisi untuk mengunci tampilan (`active` di dokumentasi) atau menandai
 * kesalahan (`error`, yang sekaligus memasang `aria-invalid`). `darkMode`
 * mengganti warnanya ke tampilan gelap.
 */
export const FloatingLabel = forwardRef<HTMLInputElement, FloatingLabelProps>(function FloatingLabel(
  {
    label,
    helperText,
    icon,
    platform = 'default',
    state = 'default',
    application = 'default',
    onClear,
    darkMode = false,
    className,
    id,
    value,
    defaultValue,
    placeholder,
    disabled,
    onChange,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  const [focused, setFocused] = useState(false)
  // Field tak terkendali tidak punya `value`, jadi keterisiannya dicatat sendiri
  // agar label tetap tahu kapan harus naik.
  const [filled, setFilled] = useState(() => String(defaultValue ?? '').length > 0)

  const hasValue = value !== undefined ? String(value).length > 0 : filled
  const isError = state === 'error'
  // `active` dan `error` mengunci label di atas; selebihnya label naik sendiri.
  const floated = state !== 'default' || focused || hasValue
  const accented = focused || state === 'active'

  const accent = accents[application]
  const t = darkMode ? themes.dark : themes.light
  const { box, text } = platforms[platform]

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilled(event.target.value.length > 0)
    onChange?.(event)
  }

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    onBlur?.(event)
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg border px-4 transition-colors',
            t.surface,
            box,
            isError ? 'border-red-600' : accented ? accent.border : t.border,
          )}
        >
          {icon && (
            <span className={cn('flex shrink-0 items-center', isError ? t.iconError : t.icon)}>{icon}</span>
          )}

          <input
            ref={ref}
            id={fieldId}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            // Placeholder baru muncul setelah label naik, supaya keduanya tak bertumpuk.
            placeholder={floated ? placeholder : undefined}
            aria-invalid={isError || undefined}
            aria-describedby={helperText ? helperId : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
              t.field,
              text,
            )}
            {...props}
          />

          {onClear && (
            <button
              type="button"
              onClick={() => {
                setFilled(false)
                onClear()
              }}
              disabled={disabled}
              aria-label="Kosongkan isian"
              className={cn(
                'shrink-0 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed',
                isError ? t.clearError : t.clear,
              )}
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/*
          Label menumpang di atas kotak: saat turun ia sejajar dengan teks isian
          (bergeser bila ada ikon), saat naik ia selalu di x=12 menimpa garis atas.
          Latarnya sama dengan latar kotak, jadi garis di belakangnya tertutup —
          itulah yang bikin label seolah menempel.
        */}
        <label
          htmlFor={fieldId}
          className={cn(
            'pointer-events-none absolute -translate-y-1/2 px-1 transition-all duration-150 ease-out',
            t.surface,
            floated ? 'top-0 left-3 text-xs' : cn('top-1/2', text, icon ? 'left-10' : 'left-3'),
            // Satu warna saja yang dipasang: dua kelas warna sekaligus akan
            // diputuskan oleh urutan CSS Tailwind, bukan oleh urutan di sini.
            isError
              ? t.labelError
              : accented
                ? darkMode
                  ? accent.labelDark
                  : accent.label
                : disabled
                  ? t.labelDisabled
                  : t.label,
          )}
        >
          {label}
        </label>
      </div>

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', isError ? t.helperError : t.helper)}>
          {helperText}
        </p>
      )}
    </div>
  )
})
