import { type ElementType, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Tag HTML yang dirender (default: div). */
  as?: ElementType
  /**
   * Padding horizontal bawaan (20px → 56px mengikuti lebar).
   * Matikan bila elemen induk sudah punya padding sendiri.
   */
  padded?: boolean
}

/**
 * Container: pembungkus lebar konten yang konsisten.
 * Spec Figma — desktop max 1126px terpusat; mobile max 380px + rounded-xl.
 *
 * Memakai `@container` seperti Footer: ambang 640/1024/1280px diukur dari lebar
 * ruang yang tersedia, bukan lebar viewport. Efeknya sama di pemakaian normal,
 * tapi Container jadi bisa dipratinjau di kotak sempit — dan tetap benar saat
 * dipakai di dalam kolom, sidebar, atau split view.
 *
 * Elemen luar hanya menjadi titik ukur (dan pemegang `className` milik pemakai);
 * lebar, pemusatan, dan padding hidup di elemen dalam karena sebuah elemen
 * tidak bisa mengueri container-nya sendiri.
 */
export function Container({
  as: Tag = 'div',
  className,
  padded = true,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn('@container', className)} {...props}>
      <div
        className={cn(
          'mx-auto w-full max-w-[380px] rounded-xl @[640px]:max-w-[1126px] @[640px]:rounded-none',
          padded && 'px-5 @[640px]:px-8 @[1024px]:px-12 @[1280px]:px-14',
        )}
      >
        {children}
      </div>
    </Tag>
  )
}
