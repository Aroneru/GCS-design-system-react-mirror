import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

/** Platform mengikuti varian desain: Default = 40×20px, Mobile = 36×18px. */
export type TogglePlatform = 'default' | 'mobile'

/** State mengikuti varian desain. `inactive` sekaligus menonaktifkan kontrol. */
export type ToggleState = 'default' | 'inactive'

/** Warna aksen per aplikasi — dipakai jalur sakelar saat menyala. */
export type ToggleApplication = 'default' | 'simaya'

/**
 * Ukuran jalur, bulatan, dan jarak gesernya per platform. Bulatan selalu
 * menyisakan 2px di kiri/kanan, jadi jaraknya = lebar jalur − 4 − lebar bulatan.
 */
const platforms: Record<TogglePlatform, { track: string; knob: string; shift: string; label: string }> = {
  default: { track: 'h-5 w-10', knob: 'size-4', shift: 'peer-checked:translate-x-5', label: 'text-sm' },
  mobile: { track: 'h-4.5 w-9', knob: 'size-3.5', shift: 'peer-checked:translate-x-4.5', label: 'text-xs' },
}

/** Warna jalur yang menyala sama di tampilan terang dan gelap. */
const accents: Record<ToggleApplication, string> = {
  default: 'peer-checked:bg-primary-700 peer-focus-visible:outline-primary-700',
  simaya: 'peer-checked:bg-purple-500 peer-focus-visible:outline-purple-500',
}

/**
 * Warna jalur yang mati, bulatan, dan teks per tampilan. Saat inactive warna
 * jalurnya tetap, menyala maupun mati — posisi bulatan yang membedakannya.
 */
const themes = {
  light: {
    track: 'bg-gray-200',
    trackInactive: 'bg-gray-300',
    knob: 'bg-white',
    knobInactive: 'bg-white',
    label: 'text-gray-900',
    labelInactive: 'text-gray-400',
    helper: 'text-gray-500',
    helperInactive: 'text-gray-400',
  },
  /**
   * Dari desain gelap: jalur gray-600 dengan bulatan gray-400 yang berubah putih
   * saat menyala. Inactive hanya meredupkan label ke gray-500 — jalur, bulatan,
   * dan captionnya sama dengan saat mati. Inactive yang menyala tidak digambar
   * desain; jalur dan bulatannya tetap seperti saat mati, hanya bulatannya bergeser.
   */
  dark: {
    track: 'bg-gray-600',
    trackInactive: 'bg-gray-600',
    knob: 'bg-gray-400 peer-checked:bg-white',
    knobInactive: 'bg-gray-400',
    label: 'text-white',
    labelInactive: 'text-gray-500',
    helper: 'text-gray-400',
    helperInactive: 'text-gray-400',
  },
}

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Teks di samping sakelar. */
  label?: ReactNode
  /** Caption 12px di bawah label. */
  helperText?: ReactNode
  platform?: TogglePlatform
  state?: ToggleState
  application?: ToggleApplication
  /** Tampilan gelap: jalur gray-600 dengan bulatan gray-400, label putih, caption gray-400. */
  darkMode?: boolean
  /** Kelas untuk pembungkus terluar (sakelar + label + caption). */
  className?: string
}

/**
 * Toggle Button — sakelar untuk menyalakan atau mematikan satu pengaturan.
 *
 * Di dalamnya tetap `<input type="checkbox">` dengan `role="switch"`: ia
 * menutupi seluruh sakelar sehingga area kliknya penuh, sementara jalur dan
 * bulatannya digambar oleh dua elemen di belakangnya lewat varian `peer`.
 * State Off/Active di desain sama dengan `checked`, jadi ia dikendalikan lewat
 * `checked`/`defaultChecked` biasa, bukan prop tersendiri. `darkMode` mengganti
 * warnanya ke tampilan gelap.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
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
  const { track, knob, shift, label: labelText } = platforms[platform]
  const t = darkMode ? themes.dark : themes.light

  const control = (
    <span className={cn('relative inline-flex shrink-0', track)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        id={fieldId}
        disabled={isInactive}
        aria-describedby={helperText ? helperId : undefined}
        className={cn(
          'peer absolute inset-0 z-10 m-0 size-full appearance-none rounded-full',
          isInactive ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        {...props}
      />

      {/* Jalur: warnanya ikut `peer` di atas, jadi tak perlu state di React. */}
      <span
        aria-hidden="true"
        className={cn(
          'block size-full rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
          isInactive ? t.trackInactive : cn(t.track, accents[application]),
        )}
      />

      {/* `transition`, bukan `transition-transform`: di tampilan gelap warna bulatannya ikut berganti. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-0.5 left-0.5 rounded-full transition',
          knob,
          shift,
          isInactive ? t.knobInactive : t.knob,
        )}
      />
    </span>
  )

  if (!label && !helperText) {
    return <span className={cn('inline-flex', className)}>{control}</span>
  }

  return (
    <div className={cn('flex items-start gap-2', className)}>
      {control}

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
