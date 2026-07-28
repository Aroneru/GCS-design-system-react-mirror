import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Elemen <svg> yang dirender. Pakai fill/stroke="currentColor" agar ikut warna teks. */
  children: ReactNode
}

/**
 * Pembungkus ikon: menyeragamkan ukuran (default size-5) dan aksesibilitas.
 * Di Blade, Icon meng-inline berkas SVG dan mengganti warna jadi currentColor.
 * Di React, consumer mengimpor SVG-nya sendiri (mis. via SVGR) dan menaruhnya
 * sebagai children — pastikan SVG memakai currentColor.
 */
export function Icon({ className, children, ...props }: IconProps) {
  return (
    <span
      className={cn('inline-flex size-5 items-center justify-center [&>svg]:size-full', className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  )
}
