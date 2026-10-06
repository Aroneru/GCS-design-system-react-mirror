import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

/** Platform mengikuti varian desain: Default = 16px, Mobile = 14px. */
export type RadioPlatform = 'default' | 'mobile'

/** State mengikuti varian desain. `inactive` sekaligus menonaktifkan kontrol. */
export type RadioState = 'default' | 'inactive'

/** Warna aksen per aplikasi — dipakai cincin saat pilihan dipilih. */
export type RadioApplication = 'default' | 'simaya'

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
 * garis setebal itu menyisakan lingkaran kecil berwarna latar di tengah —
 * 9px di desktop dan 7px di mobile, persis seperti desain. Warna cincinnya sama
 * di tampilan terang dan gelap.
 */
const accents: Record<RadioApplication, string> = {
  default: 'checked:border-primary-700 focus-visible:outline-primary-700',
  simaya: 'checked:border-purple-500 focus-visible:outline-purple-500',
}

/** Warna lingkaran dan teks per tampilan, untuk state aktif dan `inactive`. */
const themes = {
  light: {
    control: 'border-gray-300 bg-gray-50',
    controlInactive: 'border-gray-300 bg-gray-100 checked:border-gray-400',
    label: 'text-gray-900',
    labelInactive: 'text-gray-400',
    helper: 'text-gray-500',
    helperInactive: 'text-gray-400',
  },
  /**
   * Dari desain gelap: lingkaran gray-300 bergaris gray-400, dan inactive
   * gray-800 dengan teks gray-600. Cincin pilihan yang nonaktif tidak digambar
   * desain; gray-600 menyamai teksnya, seperti gray-400 pada tampilan terang.
   */
  dark: {
    control: 'border-gray-400 bg-gray-300',
    controlInactive: 'border-gray-800 bg-gray-800 checked:border-gray-600',
    label: 'text-gray-50',
    labelInactive: 'text-gray-600',
    helper: 'text-gray-400',
    helperInactive: 'text-gray-600',
  },
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Teks di samping lingkaran. */
  label?: ReactNode
  /** Caption 12px di bawah label. */
  helperText?: ReactNode
  platform?: RadioPlatform
  state?: RadioState
  application?: RadioApplication
  /** Tampilan gelap: lingkaran gray-300, label terang, caption gray-400. */
  darkMode?: boolean
  /** Kelas untuk pembungkus terluar (lingkaran + label + caption). */
  className?: string
}

/**
 * Radio Button — satu pilihan dari beberapa opsi yang saling meniadakan.
 *
 * Memakai `<input type="radio">` bawaan supaya panah keyboard, atribut `name`,
 * dan pembaca layar tetap berfungsi; hanya tampilannya yang digambar ulang.
 * State aktif di desain sama dengan `checked`, jadi ia dikendalikan lewat
 * `checked`/`defaultChecked` biasa, bukan prop tersendiri. `darkMode` mengganti
 * warnanya ke tampilan gelap.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    helperText,
    platform = 'default',
    state = 'default',
    application = 'default',
    darkMode = false,
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
  const t = darkMode ? themes.dark : themes.light

  const input = (
    <input
      ref={ref}
      type="radio"
      id={fieldId}
      disabled={isInactive}
      aria-describedby={helperText ? helperId : undefined}
      className={cn(
        'shrink-0 appearance-none rounded-full border transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed',
        control,
        // Kedua cabang tak pernah aktif bersamaan, jadi tak ada kelas yang saling menimpa.
        isInactive
          ? cn('checked:border-[3.5px]', t.controlInactive)
          : cn('cursor-pointer checked:border-[3.5px]', t.control, accents[application]),
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
              isInactive ? cn('cursor-not-allowed', t.labelInactive) : cn('cursor-pointer', t.label),
            )}
          >
            {label}
          </label>
        )}

        {helperText && (
          <p id={helperId} className={cn('mt-0.5 text-xs', isInactive ? t.helperInactive : t.helper)}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  )
})
