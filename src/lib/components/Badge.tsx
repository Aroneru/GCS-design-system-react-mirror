import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Close } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { useDismissible } from '../utils/useDismissible'

export type BadgeVariant = 'gray' | 'brand' | 'danger' | 'warning' | 'success'
export type BadgeSize = 'sm' | 'lg'

/**
 * Ikon dan teks memakai satu warna (currentColor). Tombol tutup ikut warna itu,
 * kecuali variant gray yang tombolnya lebih pucat, sesuai desain.
 *
 * Tampilan gelap membalik pasangannya: latar -900 (gray-700) dan teks -300,
 * keduanya di atas 4,5:1.
 */
const variants: Record<BadgeVariant, { light: string; dark: string; close?: string; closeDark?: string }> = {
  gray: {
    light: 'bg-gray-100 text-gray-900',
    dark: 'bg-gray-700 text-gray-300',
    close: 'text-gray-500',
    closeDark: 'text-gray-400',
  },
  brand: { light: 'bg-primary-100 text-primary-800', dark: 'bg-primary-900 text-primary-300' },
  danger: { light: 'bg-red-100 text-red-800', dark: 'bg-red-900 text-red-300' },
  warning: { light: 'bg-yellow-100 text-yellow-900', dark: 'bg-yellow-900 text-yellow-300' },
  success: { light: 'bg-green-100 text-green-900', dark: 'bg-green-900 text-green-300' },
}

/**
 * Tinggi dikunci (24px / 28px, sama dengan sebelumnya) karena teksnya dipangkas
 * ke tinggi huruf kapital (lihat `label` di bawah), jadi tinggi badge tidak lagi
 * datang dari line-height. Jarak ikon–teks 6px / 8px; 4px terlalu rapat.
 */
const sizes: Record<BadgeSize, { root: string; icon: string; close: string }> = {
  sm: { root: 'h-6 gap-1.5 text-sm', icon: 'size-3.5', close: 'size-3.5' },
  lg: { root: 'h-7 gap-2 text-base', icon: 'size-5', close: 'size-4' },
}

/**
 * Pembungkus teks. `text-box: trim-both cap alphabetic` memangkas ruang
 * ascender/descender sehingga yang ditengahkan `items-center` adalah huruf
 * kapitalnya, bukan kotak barisnya. Tanpa ini teks Lato tampak lebih rendah
 * dari ikon dan tombol ×, karena ascender Lato jauh lebih besar dari
 * descender-nya. Peramban yang belum mendukung `text-box` (Firefox) tetap
 * memakai perataan biasa.
 */
const label = 'leading-none [text-box:trim-both_cap_alphabetic]'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** `sm` (default) atau `lg`. */
  size?: BadgeSize
  /** Ikon di kiri label. Pakai SVG dengan currentColor. */
  icon?: ReactNode
  /** Menampilkan tombol tutup (×) di kanan label. */
  dismissible?: boolean
  /** Dipanggil saat tombol tutup diklik. */
  onDismiss?: () => void
  /** Kendalikan tampil/sembunyi dari luar; tanpa ini Badge mengurusnya sendiri. */
  open?: boolean
  /** Tampilan gelap: latar -900 dengan teks -300. */
  darkMode?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'gray',
    size = 'sm',
    icon,
    dismissible = false,
    onDismiss,
    open,
    darkMode = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const { mounted, visible, close } = useDismissible(open)
  const v = variants[variant]
  const s = sizes[size]

  if (!mounted) return null

  const handleClose = () => {
    close()
    onDismiss?.()
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md px-3',
        s.root,
        darkMode ? v.dark : v.light,
        dismissible && 'transition-opacity duration-200',
        dismissible && (visible ? 'opacity-100' : 'opacity-0'),
        className,
      )}
      {...props}
    >
      {/*
        Bukan <Icon>: Icon membawa `size-5` bawaan, dan tanpa tailwind-merge
        `size-5` mengalahkan `size-3.5`, sehingga ikon di badge kecil jadi
        20px — lebih besar dari teksnya dan membuat badge terlihat berat.
      */}
      {icon && (
        <span
          aria-hidden="true"
          className={cn('inline-flex shrink-0 items-center justify-center [&>svg]:size-full', s.icon)}
        >
          {icon}
        </span>
      )}
      {children !== undefined && children !== null && <span className={label}>{children}</span>}
      {dismissible && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            '-mr-0.5 inline-flex shrink-0 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
            darkMode ? v.closeDark : v.close,
          )}
          aria-label="Hapus"
        >
          <Close className={s.close} />
        </button>
      )}
    </span>
  )
})
