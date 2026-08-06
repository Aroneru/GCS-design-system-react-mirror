import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

/** Platform mengikuti varian Figma: Default = 16px, Mobile = 14px. */
export type RadioPlatform = 'default' | 'mobile'

/** State mengikuti varian Figma. `inactive` sekaligus menonaktifkan kontrol. */
export type RadioState = 'default' | 'inactive'

/** Warna aksen per aplikasi — dipakai cincin saat pilihan dipilih. */
export type RadioApplication = 'default' | 'portal' | 'simaya'

/**
 * Ukuran kontrol, jarak turun agar sejajar tengah baris label, dan ukuran teks
 * label per platform. Caption tetap 12px di kedua platform.
 */
const platforms: Record<RadioPlatform, { control: string; offset: string; label: string }> = {
  default: { control: 'size-4', offset: 'mt-0.5', label: 'text-sm' },
  mobile: { control: 'size-3.5', offset: 'mt-px', label: 'text-xs' },
}

/**
 * Cincin 3.5px inilah yang menandai pilihan aktif: karena `box-sizing:border-box`,
 * garis setebal itu menyisakan lingkaran kecil berlatar gray-50 di tengah —
 * 9px di desktop dan 7px di mobile, persis seperti Figma.
 */
const accents: Record<RadioApplication, string> = {
  default: 'checked:border-primary-700 focus-visible:outline-primary-700',
  portal: 'checked:border-blue-portal-500 focus-visible:outline-blue-portal-500',
  simaya: 'checked:border-purple-500 focus-visible:outline-purple-500',
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Teks di samping lingkaran. */
  label?: ReactNode
  /** Caption 12px di bawah label. */
  helperText?: ReactNode
  platform?: RadioPlatform
  state?: RadioState
  application?: RadioApplication
  /** Kelas untuk pembungkus terluar (lingkaran + label + caption). */
  className?: string
}

/**
 * Radio Button — satu pilihan dari beberapa opsi yang saling meniadakan.
 *
 * Memakai `<input type="radio">` bawaan supaya panah keyboard, atribut `name`,
 * dan pembaca layar tetap berfungsi; hanya tampilannya yang digambar ulang.
 * State aktif di Figma sama dengan `checked`, jadi ia dikendalikan lewat
 * `checked`/`defaultChecked` biasa, bukan prop tersendiri.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    helperText,
    platform = 'default',
    state = 'default',
    application = 'default',
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

  const isInactive = disabled || state === 'inactive'
  const { control, offset, label: labelText } = platforms[platform]

  const input = (
    <input
      ref={ref}
      type="radio"
      id={fieldId}
      disabled={isInactive}
      aria-describedby={helperText ? helperId : undefined}
      className={cn(
        'shrink-0 appearance-none rounded-full border border-gray-300 transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed',
        control,
        // Kedua cabang tak pernah aktif bersamaan, jadi tak ada kelas yang saling menimpa.
        isInactive
          ? 'bg-gray-100 checked:border-[3.5px] checked:border-gray-400'
          : cn('cursor-pointer bg-gray-50 checked:border-[3.5px]', accents[application]),
        label || helperText ? offset : undefined,
      )}
      {...props}
    />
  )

  if (!label && !helperText) {
    return <span className={cn('inline-flex', className)}>{input}</span>
  }

  return (
    <div className={cn('flex items-start gap-2', className)}>
      {input}

      <div className="min-w-0">
        {label && (
          <label
            htmlFor={fieldId}
            className={cn(
              'block font-bold',
              labelText,
              isInactive ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-900',
            )}
          >
            {label}
          </label>
        )}

        {helperText && (
          <p id={helperId} className={cn('mt-0.5 text-xs', isInactive ? 'text-gray-400' : 'text-gray-500')}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  )
})
