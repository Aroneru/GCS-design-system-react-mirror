import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeSlash } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

/** Platform mengikuti varian desain: Default = desktop (52px), Mobile = 40px. */
export type InputFieldPlatform = 'default' | 'mobile'

/** State mengikuti varian desain. `typing` = tampilan saat field difokus. */
export type InputFieldState = 'default' | 'typing' | 'inactive' | 'failed'

/** Warna aksen per aplikasi — dipakai untuk garis saat field aktif. */
export type InputFieldApplication = 'default' | 'purple'

const platforms: Record<InputFieldPlatform, string> = {
  default: 'h-13',
  mobile: 'h-10',
}

/** Garis aksen per aplikasi: dipakai state `typing` dan saat field benar-benar difokus. */
const accents: Record<InputFieldApplication, { border: string; focus: string }> = {
  default: { border: 'border-primary-500', focus: 'focus-within:border-primary-500' },
  purple: { border: 'border-purple-500', focus: 'focus-within:border-purple-500' },
}

/**
 * Latar dan garis per state. Semua warnanya token, jadi tema gelap cukup
 * mengganti nilai token lewat `data-theme`. Desain gelap: latar gray-700 dan
 * garis default yang menyatu dengannya; inactive bergaris gray-800, sedikit
 * lebih gelap dari latarnya; typing dan failed memakai garis berwarna.
 */
const surfaces: Record<InputFieldState, string> = {
  default: 'border-field-border bg-field',
  typing: 'bg-field',
  inactive: 'border-input-field-border-inactive bg-field',
  failed: 'border-feedback-error bg-input-field-surface-failed',
}

interface Ink {
  label: string
  field: string
  helper: string
  icon: string
  /**
   * Tombol hapus (×): gray-500 di tampilan terang, gray-400 di tampilan gelap,
   * sama dengan × pada Floating Label. Desain gelapnya gray-600 (gray-500 saat
   * typing), terlalu samar di latar gray-700.
   */
  clear: string
  /**
   * Tombol mata pada `type="password"`. Tidak ikut memerah saat failed: gray-500
   * di tampilan terang, gray-400 di tampilan gelap. Desain gelapnya gray-600,
   * tetapi warna itu nyaris tak terlihat di latar gray-700. Saat inactive
   * tetap gray-400 terang dan gray-600 gelap.
   */
  reveal: string
}

/**
 * Warna teks per state — label, isi field, ikon, dan caption punya tingkat
 * kontras berbeda. Kelas yang memakai palet langsung (gray-500, gray-400,
 * red-600) adalah warna yang sama di tampilan terang dan gelap.
 *
 * Desain gelap hanya menggambar placeholder, jadi teks yang diketik mengikuti
 * label (putih) — sama seperti Datepicker gelap — dan pada failed satu tingkat
 * lebih terang dari placeholder-nya (red-500), kebalikan dari tampilan terang
 * yang satu tingkat lebih gelap (red-700).
 */
const inks: Record<InputFieldState, Ink> = {
  default: {
    label: 'text-content',
    field: 'text-content placeholder:text-content-muted',
    helper: 'text-content-muted',
    icon: 'text-content-muted',
    clear: 'text-content-muted',
    reveal: 'text-content-muted',
  },
  typing: {
    label: 'text-content',
    field: 'text-content placeholder:text-gray-500',
    helper: 'text-content-muted',
    icon: 'text-gray-500',
    clear: 'text-content-muted',
    reveal: 'text-content-muted',
  },
  inactive: {
    label: 'text-input-field-label-inactive',
    field: 'text-content-disabled placeholder:text-content-disabled',
    helper: 'text-content-disabled',
    icon: 'text-content-disabled',
    clear: 'text-gray-400',
    reveal: 'text-input-field-action-inactive',
  },
  failed: {
    label: 'text-content',
    field: 'text-input-field-content-failed placeholder:text-red-600',
    helper: 'text-red-600',
    icon: 'text-red-600',
    clear: 'text-red-600',
    reveal: 'text-content-muted',
  },
}

/**
 * Desain password gelap saat failed memakai red-500 untuk ikon, placeholder, dan
 * caption, sedangkan desain type teks memakai red-600 untuk ketiganya. Token
 * `feedback-error` memberi keduanya: red-600 terang, red-500 gelap.
 */
const passwordFailed: Pick<Ink, 'field' | 'helper' | 'icon'> = {
  field: 'text-input-field-content-failed placeholder:text-feedback-error',
  helper: 'text-feedback-error',
  icon: 'text-feedback-error',
}

const ClearIcon = () => (
  <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" d="M1 1l10 10M11 1L1 11" />
  </svg>
)

/** Gembok bawaan `type="password"`, disalin dari desain: 16px dengan garis 2px. */
const LockIcon = () => (
  <svg
    className="size-4"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4.6667 7.3332V4.6664C4.6667 3.7822 5.0179 2.9343 5.643 2.3092C6.2681 1.684 7.1159 1.3328 8 1.3328C8.8841 1.3328 9.7319 1.684 10.357 2.3092C10.9821 2.9343 11.3333 3.7822 11.3333 4.6664V7.3332M3.3333 7.3332H12.6667C13.403 7.3332 14 7.9302 14 8.6667V13.3337C14 14.0702 13.403 14.6672 12.6667 14.6672H3.3333C2.597 14.6672 2 14.0702 2 13.3337V8.6667C2 7.9302 2.597 7.3332 3.3333 7.3332Z" />
  </svg>
)

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Teks label di atas field. */
  label?: ReactNode
  /** Caption/pesan bantuan di bawah field. Saat state `failed`, ini jadi pesan error. */
  helperText?: ReactNode
  /**
   * Ikon di sisi kiri field, mis. <User className="size-4" />. Pada
   * `type="password"` bawaannya gembok; isi `null` untuk menghilangkannya.
   */
  icon?: ReactNode
  platform?: InputFieldPlatform
  state?: InputFieldState
  application?: InputFieldApplication
  /** Bila diisi, tombol hapus (×) muncul di sisi kanan field. */
  onClear?: () => void
  /**
   * Memaksa field ini bertema gelap: field gray-700 dengan label putih dan teks
   * abu-abu. Tanpa prop ini ia ikut tema elemen pembungkusnya, mis.
   * `<section data-theme="dark">`.
   */
  darkMode?: boolean
  /** Kelas untuk pembungkus terluar (label + field + caption). */
  className?: string
}

/**
 * Input Field — satu baris isian teks dengan label dan caption opsional.
 *
 * State `inactive` otomatis menonaktifkan input dan `failed` menandainya
 * `aria-invalid`, sehingga tampilan visual dan makna aksesibilitasnya selalu
 * sejalan. Garis aksen saat difokus mengikuti prop `application`, juga pada
 * tampilan gelap (`darkMode`).
 *
 * `type="password"` menyamarkan isian, memasang ikon gembok, dan menambahkan
 * tombol mata untuk menampilkan atau menyembunyikan kata sandinya.
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
    darkMode = false,
    className,
    id,
    type,
    disabled,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`
  const [revealed, setRevealed] = useState(false)

  const isPassword = type === 'password'
  const ink = isPassword && state === 'failed' ? { ...inks.failed, ...passwordFailed } : inks[state]
  const accent = accents[application]
  const isDisabled = disabled || state === 'inactive'
  // Desain password mobile memakai teks 12px; type teks tetap 14px di kedua platform.
  const textSize = isPassword && platform === 'mobile' ? 'text-xs' : 'text-sm'
  const leadingIcon = isPassword && icon === undefined ? <LockIcon /> : icon

  return (
    <div data-theme={darkMode ? 'dark' : undefined} className={cn('w-full', className)}>
      {label && (
        <label htmlFor={fieldId} className={cn('mb-2 block font-bold', textSize, ink.label)}>
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
        {leadingIcon && <span className={cn('flex shrink-0 items-center', ink.icon)}>{leadingIcon}</span>}

        <input
          ref={ref}
          id={fieldId}
          type={isPassword && revealed ? 'text' : type}
          disabled={isDisabled}
          aria-invalid={state === 'failed' || undefined}
          aria-describedby={helperText ? helperId : undefined}
          // Kata sandi yang sedang tampil jangan sampai dikoreksi atau dikirim ke pemeriksa ejaan.
          {...(isPassword && { spellCheck: false, autoCapitalize: 'off', autoCorrect: 'off' })}
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
            textSize,
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
              ink.clear,
            )}
          >
            <ClearIcon />
          </button>
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((shown) => !shown)}
            disabled={isDisabled}
            aria-label="Tampilkan kata sandi"
            aria-pressed={revealed}
            aria-controls={fieldId}
            className={cn(
              // Ikon mata Flowbite 16px, sebesar gembok di kiri; `after` memperluas
              // area tekannya jadi 24px tanpa menggeser ikon dari posisinya.
              'relative shrink-0 rounded-sm transition-opacity after:absolute after:-inset-1 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed',
              ink.reveal,
            )}
          >
            {revealed ? (
              <EyeSlash className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {helperText && (
        <p id={helperId} className={cn('mt-2', textSize, ink.helper)}>
          {helperText}
        </p>
      )}
    </div>
  )
})
