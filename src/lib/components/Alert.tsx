import { forwardRef, type ComponentType, type HTMLAttributes, type ReactNode } from 'react'
import {
  CheckCircle,
  Close,
  CloseCircle,
  ExclamationCircle,
  InfoCircle,
} from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { useDismissible } from '../utils/useDismissible'
import { Icon } from './Icon'

/** Lima warna semantik, sama maknanya dengan Badge dan token warna lain. */
export type AlertVariant = 'success' | 'danger' | 'warning' | 'info' | 'purple'

/**
 * Warna tiap variant dari token `alert-*` di tokens.css — latar, ikon, heading,
 * isi pesan, dan tombol tutup — jadi tema gelap cukup mengganti nilai token
 * lewat `data-theme`.
 *
 * Terang: satu warna "ink" -800 untuk ikon, heading, dan tombol tutup, isi
 * pesan sedikit lebih muda (-700), mengikuti pola dua-tingkat kontras pada
 * desain. Gelap: latar -900 milik variant itu sendiri, ikon -500, heading dan
 * isi pesan sama-sama -50; warna tombol tutupnya tidak berpola di desain.
 */
const variants: Record<
  AlertVariant,
  {
    bg: string
    iconColor: string
    heading: string
    body: string
    close: string
    icon: ComponentType<{ className?: string }>
  }
> = {
  success: {
    bg: 'bg-alert-success-surface',
    iconColor: 'text-alert-success-icon',
    heading: 'text-alert-success-heading',
    body: 'text-alert-success-body',
    close: 'text-alert-success-close',
    icon: CheckCircle,
  },
  danger: {
    bg: 'bg-alert-danger-surface',
    iconColor: 'text-alert-danger-icon',
    heading: 'text-alert-danger-heading',
    body: 'text-alert-danger-body',
    close: 'text-alert-danger-close',
    icon: CloseCircle,
  },
  warning: {
    bg: 'bg-alert-warning-surface',
    iconColor: 'text-alert-warning-icon',
    heading: 'text-alert-warning-heading',
    body: 'text-alert-warning-body',
    close: 'text-alert-warning-close',
    icon: ExclamationCircle,
  },
  info: {
    bg: 'bg-alert-info-surface',
    iconColor: 'text-alert-info-icon',
    heading: 'text-alert-info-heading',
    body: 'text-alert-info-body',
    close: 'text-alert-info-close',
    icon: InfoCircle,
  },
  purple: {
    bg: 'bg-alert-purple-surface',
    iconColor: 'text-alert-purple-icon',
    heading: 'text-alert-purple-heading',
    body: 'text-alert-purple-body',
    close: 'text-alert-purple-close',
    icon: InfoCircle,
  },
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  /** Judul singkat di baris pertama. */
  heading?: ReactNode
  /** Ikon kiri kustom. `false` menyembunyikannya, kosong memakai bawaan variant. */
  icon?: ReactNode | false
  /** Menampilkan tombol tutup (×) di kanan atas. */
  dismissible?: boolean
  /** Dipanggil saat tombol tutup diklik. */
  onDismiss?: () => void
  /** Kendalikan tampil/sembunyi dari luar; tanpa ini Alert mengurusnya sendiri. */
  open?: boolean
  /** Baris tombol tindak lanjut di bawah isi. */
  actions?: ReactNode
  /**
   * Memaksa alert ini bertema gelap: latar -900 variant, ikon -500, heading dan
   * isi pesan -50. Tanpa prop ini ia ikut tema elemen pembungkusnya, mis.
   * `<section data-theme="dark">`.
   */
  darkMode?: boolean
}

/**
 * Alert — pesan status di dalam alur halaman.
 *
 * Berbeda dari Toast yang melayang di atas konten, Alert menempati ruangnya
 * sendiri. Heading, ikon, tombol aksi, dan tombol tutup semuanya opsional;
 * yang tersisa cukup satu baris teks.
 *
 * `darkMode` sekadar memasang `data-theme="dark"` di kotaknya. Isi `actions`
 * tetap milik pemakai — pilih warna tombol yang kontras di atas latar -900
 * variant-nya.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    heading,
    icon,
    dismissible = true,
    onDismiss,
    open,
    actions,
    darkMode = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const { mounted, visible, close } = useDismissible(open)
  const v = variants[variant]
  const DefaultIcon = v.icon
  const showIcon = icon !== false

  if (!mounted) return null

  const handleClose = () => {
    close()
    onDismiss?.()
  }

  return (
    <div
      ref={ref}
      role="alert"
      data-theme={darkMode ? 'dark' : undefined}
      className={cn(
        'rounded-lg p-4 transition-opacity duration-200 sm:p-5',
        visible ? 'opacity-100' : 'opacity-0',
        v.bg,
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={cn('mt-0.5 shrink-0', v.iconColor)}>{icon ?? <DefaultIcon />}</Icon>
        )}

        <div className="min-w-0 flex-1">
          {heading && <p className={cn('text-sm font-bold', v.heading)}>{heading}</p>}

          {children && (
            <div className={cn('text-sm leading-6', heading && 'mt-1', v.body)}>{children}</div>
          )}

          {actions && <div className="mt-3 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>

        {/*
         * Cincin fokus ikut warna heading, bukan warna ×: di tampilan gelap
         * × success, danger, dan warning nyaris sewarna latarnya.
         */}
        {dismissible && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
              v.heading,
            )}
            aria-label="Tutup peringatan"
          >
            <Close className={cn('size-3.5', v.close)} />
          </button>
        )}
      </div>
    </div>
  )
})
