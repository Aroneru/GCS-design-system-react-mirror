import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

/** Platform mengikuti varian Figma: Default = desktop (52px), Mobile = 40px. */
export type InputFieldPlatform = 'default' | 'mobile'

/** State mengikuti varian Figma. `typing` = tampilan saat field difokus. */
export type InputFieldState = 'default' | 'typing' | 'inactive' | 'failed'

/** Warna aksen per aplikasi — dipakai untuk garis saat field aktif. */
export type InputFieldApplication = 'default' | 'portal' | 'simaya'

const platforms: Record<InputFieldPlatform, string> = {
  default: 'h-13',
  mobile: 'h-10',
}

/** Garis aksen per aplikasi: dipakai state `typing` dan saat field benar-benar difokus. */
const accents: Record<InputFieldApplication, { border: string; focus: string }> = {
  default: { border: 'border-primary-500', focus: 'focus-within:border-primary-500' },
  portal: { border: 'border-blue-portal-500', focus: 'focus-within:border-blue-portal-500' },
  simaya: { border: 'border-purple-500', focus: 'focus-within:border-purple-500' },
}

const surfaces: Record<InputFieldState, string> = {
  default: 'border-gray-300 bg-gray-50',
  typing: 'bg-gray-50',
  inactive: 'border-gray-400 bg-gray-50',
  failed: 'border-red-600 bg-red-100',
}

/** Warna teks per state — label, isi field, ikon, dan caption punya tingkat kontras berbeda. */
const inks: Record<InputFieldState, { label: string; field: string; helper: string; icon: string }> = {
  default: {
    label: 'text-gray-900',
    field: 'text-gray-900 placeholder:text-gray-500',
    helper: 'text-gray-500',
    icon: 'text-gray-500',
  },
  typing: {
    label: 'text-gray-900',
    field: 'text-gray-900 placeholder:text-gray-500',
    helper: 'text-gray-500',
    icon: 'text-gray-500',
  },
  inactive: {
    label: 'text-gray-400',
    field: 'text-gray-400 placeholder:text-gray-400',
    helper: 'text-gray-400',
    icon: 'text-gray-400',
  },
  failed: {
    label: 'text-gray-900',
    field: 'text-red-700 placeholder:text-red-600',
    helper: 'text-red-600',
    icon: 'text-red-600',
  },
}

const ClearIcon = () => (
  <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" d="M1 1l10 10M11 1L1 11" />
  </svg>
)

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Teks label di atas field. */
  label?: ReactNode
  /** Caption/pesan bantuan di bawah field. Saat state `failed`, ini jadi pesan error. */
  helperText?: ReactNode
  /** Ikon di sisi kiri field, mis. <User className="size-4" />. */
  icon?: ReactNode
  platform?: InputFieldPlatform
  state?: InputFieldState
  application?: InputFieldApplication
  /** Bila diisi, tombol hapus (×) muncul di sisi kanan field. */
  onClear?: () => void
  /** Kelas untuk pembungkus terluar (label + field + caption). */
  className?: string
}

/**
 * Input Field — satu baris isian teks dengan label dan caption opsional.
 *
 * State `inactive` otomatis menonaktifkan input dan `failed` menandainya
 * `aria-invalid`, sehingga tampilan visual dan makna aksesibilitasnya selalu
 * sejalan. Garis aksen saat difokus mengikuti prop `application`.
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
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
    disabled,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  const ink = inks[state]
  const accent = accents[application]
  const isDisabled = disabled || state === 'inactive'

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={fieldId} className={cn('mb-2 block text-sm font-bold', ink.label)}>
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border px-4 transition-colors',
          platforms[platform],
          surfaces[state],
          // `typing` mengunci garis aksen; state lain tetap berubah saat difokus,
          // kecuali failed yang mempertahankan garis merahnya.
          state === 'typing' && accent.border,
          state === 'default' && accent.focus,
        )}
      >
        {icon && <span className={cn('flex shrink-0 items-center', ink.icon)}>{icon}</span>}

        <input
          ref={ref}
          id={fieldId}
          disabled={isDisabled}
          aria-invalid={state === 'failed' || undefined}
          aria-describedby={helperText ? helperId : undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed',
            ink.field,
          )}
          {...props}
        />

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={isDisabled}
            aria-label="Kosongkan isian"
            className={cn(
              'shrink-0 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed',
              ink.icon,
            )}
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', ink.helper)}>
          {helperText}
        </p>
      )}
    </div>
  )
})
