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

/** Platform mengikuti varian Figma: Default = desktop (58px), Mobile = 50px. */
export type FloatingLabelPlatform = 'default' | 'mobile'

/** State mengikuti varian Figma: Default, Active, dan Error. */
export type FloatingLabelState = 'default' | 'active' | 'error'

/** Warna aksen per aplikasi — dipakai garis dan label saat field aktif. */
export type FloatingLabelApplication = 'default' | 'portal' | 'simaya'

/**
 * Tinggi kotak dan ukuran teks isian per platform. Label yang sudah naik
 * selalu 12px di kedua platform, jadi hanya teks di dalam field yang berubah.
 */
const platforms: Record<FloatingLabelPlatform, { box: string; text: string }> = {
  default: { box: 'h-14.5', text: 'text-sm' },
  mobile: { box: 'h-12.5', text: 'text-xs' },
}

const accents: Record<FloatingLabelApplication, { border: string; label: string }> = {
  default: { border: 'border-primary-600', label: 'text-primary-600' },
  portal: { border: 'border-blue-portal-500', label: 'text-blue-portal-500' },
  simaya: { border: 'border-purple-500', label: 'text-purple-500' },
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
  /** Kelas untuk pembungkus terluar (field + caption). */
  className?: string
}

/**
 * Floating Label — isian teks yang labelnya naik ke garis atas begitu field
 * difokus atau berisi.
 *
 * Label naik sendiri saat field difokus/berisi, jadi prop `state` hanya perlu
 * diisi untuk mengunci tampilan (`active` di dokumentasi) atau menandai
 * kesalahan (`error`, yang sekaligus memasang `aria-invalid`).
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
            'flex items-center gap-3 rounded-lg border bg-surface px-4 transition-colors',
            box,
            isError ? 'border-red-600' : accented ? accent.border : 'border-gray-300',
          )}
        >
          {icon && (
            <span className={cn('flex shrink-0 items-center', isError ? 'text-red-600' : 'text-gray-800')}>
              {icon}
            </span>
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
              'min-w-0 flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:text-gray-400',
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
                isError ? 'text-red-600' : 'text-gray-500',
              )}
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/*
          Label menumpang di atas kotak: saat turun ia sejajar dengan teks isian
          (bergeser bila ada ikon), saat naik ia selalu di x=12 menimpa garis atas.
          `bg-surface` yang menutup garis itulah yang bikin label seolah menempel.
        */}
        <label
          htmlFor={fieldId}
          className={cn(
            'pointer-events-none absolute -translate-y-1/2 bg-surface px-1 transition-all duration-150 ease-out',
            floated ? 'top-0 left-3 text-xs' : cn('top-1/2', text, icon ? 'left-10' : 'left-3'),
            isError ? 'text-red-600' : accented ? accent.label : 'text-gray-500',
            disabled && 'text-gray-400',
          )}
        >
          {label}
        </label>
      </div>

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', isError ? 'text-red-600' : 'text-gray-500')}>
          {helperText}
        </p>
      )}
    </div>
  )
})
