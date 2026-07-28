import { type ElementType, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Tag HTML yang dirender (default: div). */
  as?: ElementType
}

/**
 * Container: pembungkus lebar konten yang konsisten.
 * Spec Figma — desktop max 1126px terpusat; mobile max 380px + rounded-xl.
 */
export function Container({ as: Tag = 'div', className, children, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[380px] rounded-xl px-5 sm:max-w-[1126px] sm:rounded-none sm:px-8 lg:px-12 xl:px-14',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
