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

/** `soft` memakai latar bertinta; `outline` memakai latar putih + garis. */
export type AlertSurface = 'soft' | 'outline'

/**
 * Tiap variant punya satu warna "ink" yang dipakai konsisten untuk ikon,
 * heading, dan tombol tutup — hanya body text yang sedikit lebih muda,
 * mengikuti pola dua-tingkat kontras pada desain.
 */
const variants: Record<
  AlertVariant,
  { bg: string; border: string; ink: string; body: string; icon: ComponentType<{ className?: string }> }
> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    ink: 'text-green-800',
    body: 'text-green-700',
    icon: CheckCircle,
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    ink: 'text-red-800',
    body: 'text-red-700',
    icon: CloseCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    ink: 'text-yellow-800',
    body: 'text-yellow-700',
    icon: ExclamationCircle,
  },
  info: {
    bg: 'bg-primary-50',
    border: 'border-primary-300',
    ink: 'text-primary-800',
    body: 'text-primary-700',
    icon: InfoCircle,
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    ink: 'text-purple-800',
    body: 'text-purple-700',
    icon: InfoCircle,
  },
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  surface?: AlertSurface
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
}

/**
 * Alert — pesan status di dalam alur halaman.
 *
 * Berbeda dari Toast yang melayang di atas konten, Alert menempati ruangnya
 * sendiri. Heading, ikon, tombol aksi, dan tombol tutup semuanya opsional;
 * yang tersisa cukup satu baris teks.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    surface = 'soft',
    heading,
    icon,
    dismissible = true,
    onDismiss,
    open,
    actions,
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
      className={cn(
        'rounded-lg p-4 transition-opacity duration-200 sm:p-5',
        visible ? 'opacity-100' : 'opacity-0',
        surface === 'outline' ? cn('border bg-surface shadow-soft', v.border) : v.bg,
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={cn('mt-0.5 shrink-0', v.ink)}>{icon ?? <DefaultIcon />}</Icon>
        )}

        <div className="min-w-0 flex-1">
          {heading && <p className={cn('text-sm font-bold', v.ink)}>{heading}</p>}

          {children && (
            <div className={cn('text-sm leading-6', heading && 'mt-1', v.body)}>{children}</div>
          )}

          {actions && <div className="mt-3 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
              v.ink,
            )}
            aria-label="Tutup peringatan"
          >
            <Close className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
})
