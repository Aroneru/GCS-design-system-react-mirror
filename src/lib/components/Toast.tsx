import { forwardRef, type ComponentType, type HTMLAttributes, type ReactNode } from 'react'
import { Check, Close, ExclamationCircle, InfoCircle } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { useDismissible } from '../utils/useDismissible'
import { Icon } from './Icon'

/** Lima warna semantik, sama daftarnya dengan Alert. */
export type ToastVariant = 'success' | 'danger' | 'warning' | 'info' | 'purple'

/**
 * Beda dari Alert: kartu Toast selalu netral (putih + bayangan), hanya badge
 * ikon yang membawa warna variant. Menjaga notifikasi tetap ringan saat
 * beberapa toast menumpuk di layar sekaligus.
 *
 * Nilai success, danger, dan info diambil persis dari Figma — termasuk dua
 * ketidakseragamannya: danger memakai latar -50 (bukan -100 seperti dua
 * lainnya) dan info memakai ikon -600 (bukan -500). warning dan purple belum
 * ada di Figma, jadi keduanya mengikuti pola mayoritas: latar -100, ikon -500.
 */
const variants: Record<
  ToastVariant,
  { badge: string; icon: ComponentType<{ className?: string }> }
> = {
  success: { badge: 'bg-green-100 text-green-500', icon: Check },
  danger: { badge: 'bg-red-50 text-red-500', icon: Close },
  warning: { badge: 'bg-yellow-100 text-yellow-500', icon: ExclamationCircle },
  info: { badge: 'bg-primary-100 text-primary-600', icon: InfoCircle },
  purple: { badge: 'bg-purple-100 text-purple-500', icon: InfoCircle },
}

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant
  /** Judul singkat; bila diisi, isi tampil sebagai teks sekunder di bawahnya. */
  heading?: ReactNode
  /** Ikon kustom. `false` menyembunyikan badge ikon, kosong memakai bawaan variant. */
  icon?: ReactNode | false
  /** Menampilkan tombol tutup (×) di kanan atas. */
  dismissible?: boolean
  /** Dipanggil saat tombol tutup diklik. */
  onDismiss?: () => void
  /** Kendalikan tampil/sembunyi dari luar; tanpa ini Toast mengurusnya sendiri. */
  open?: boolean
  /** Tombol tindak lanjut di bawah isi — umumnya dibuat `w-full`. */
  actions?: ReactNode
}

/**
 * Toast — notifikasi sekilas yang melayang di atas konten halaman.
 *
 * Ukurannya mengikuti Figma: kartu 320px beradius 8px, padding 16px, badge
 * ikon 32px berisi ikon 20px, dan tombol tutup 12px yang tepat 16px dari tepi
 * kanan kartu.
 *
 * Komponennya sendiri tidak memposisikan apa pun: bungkus dengan wadah
 * `fixed` (mis. `fixed bottom-4 left-4 z-50 space-y-3`) supaya bisa ditumpuk
 * di sudut mana pun tanpa mengunci satu posisi ke dalam komponen.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    variant = 'info',
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

  // Baris rata tengah untuk pesan satu baris; rata atas begitu ada heading atau
  // tombol aksi supaya badge ikon tetap sejajar dengan baris pertama.
  const multiline = Boolean(heading || actions)

  if (!mounted) return null

  const handleClose = () => {
    close()
    onDismiss?.()
  }

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(
        // `shadow` (bukan shadow-sm) — nilainya persis dua lapis dari Figma;
        // --shadow-sm di tokens.css sudah dipakai untuk nilai lain.
        'relative w-full max-w-80 rounded-lg bg-surface p-4 shadow',
        'transition ease-out',
        visible ? 'translate-y-0 opacity-100 duration-300' : 'translate-y-2 opacity-0 duration-200',
        className,
      )}
      {...props}
    >
      <div className={cn('flex gap-3', multiline ? 'items-start' : 'items-center')}>
        {showIcon && (
          <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', v.badge)}>
            <Icon className="size-5">{icon ?? <DefaultIcon />}</Icon>
          </span>
        )}

        {/*
          Kolom isi memenuhi sisa lebar kartu — tombol aksi ikut selebar itu,
          sesuai Figma. Tombol tutup melayang di atasnya, jadi teksnya yang
          diberi ruang kanan supaya tidak tertimpa.
        */}
        <div className="min-w-0 flex-1">
          {heading && (
            <p
              className={cn('text-sm leading-normal font-bold text-gray-900', dismissible && 'pr-6')}
            >
              {heading}
            </p>
          )}

          {children && (
            <div
              className={cn(
                'text-sm leading-normal',
                // Figma: pesan tunggal gray-500, teks pendukung di bawah heading gray-600.
                heading ? 'text-gray-600' : 'text-gray-500',
                dismissible && 'pr-6',
              )}
            >
              {children}
            </div>
          )}

          {actions && <div className="mt-3">{actions}</div>}
        </div>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            // right-3 + p-1 menaruh ikon 12px tepat 16px dari tepi kartu,
            // sambil menyisakan area klik 20px.
            'absolute right-3 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 focus-visible:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
            multiline ? 'top-3' : 'top-1/2 -translate-y-1/2',
          )}
          aria-label="Tutup notifikasi"
        >
          <Close className="size-3" />
        </button>
      )}
    </div>
  )
})
