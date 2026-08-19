import { type ElementType, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

/**
 * Varian lebar. Semuanya berperilaku sama — hanya batas maksimumnya berbeda,
 * jadi memilih varian = memilih seberapa lebar konten boleh melar.
 */
export type ContainerSize = 'prose' | 'default' | 'wide' | 'full'

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Tag HTML yang dirender (default: div). */
  as?: ElementType
  /**
   * Batas lebar konten (default: `default` — 1126px, spec Figma).
   * `prose` 720px untuk teks panjang & formulir, `wide` 1440px untuk tabel
   * atau dasbor, `full` tanpa batas (hanya padding).
   */
  size?: ContainerSize
  /**
   * Padding horizontal bawaan (20px → 56px mengikuti lebar).
   * Matikan bila elemen induk sudah punya padding sendiri.
   */
  padded?: boolean
}

/**
 * Kelas untuk elemen dalam. Di ruang sempit semua varian sama — 380px +
 * rounded-xl mengikuti spec mobile; yang membedakan hanya batas di ≥ 640px.
 * `full` tidak ikut dijepit 380px karena tujuannya justru mengisi penuh.
 */
const sizeClasses: Record<ContainerSize, string> = {
  prose: 'max-w-[380px] rounded-xl @[640px]:max-w-[720px] @[640px]:rounded-none',
  default: 'max-w-[380px] rounded-xl @[640px]:max-w-[1126px] @[640px]:rounded-none',
  wide: 'max-w-[380px] rounded-xl @[640px]:max-w-[1440px] @[640px]:rounded-none',
  full: 'max-w-none',
}

/**
 * Container: pembungkus lebar konten yang konsisten.
 * Spec Figma — desktop max 1126px terpusat; mobile max 380px + rounded-xl.
 * `size` menggeser batas desktop itu saja (720/1126/1440/tanpa batas); sisanya
 * — pemusatan, padding, ambang — persis sama di semua varian.
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
  size = 'default',
  className,
  padded = true,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn('@container', className)} {...props}>
      <div
        className={cn(
          'mx-auto w-full',
          sizeClasses[size],
          padded && 'px-5 @[640px]:px-8 @[1024px]:px-12 @[1280px]:px-14',
        )}
      >
        {children}
      </div>
    </Tag>
  )
}
