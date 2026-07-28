import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export type BadgeVariant = 'gray' | 'brand' | 'danger' | 'warning' | 'success'

const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold'

const variants: Record<BadgeVariant, string> = {
  gray: 'bg-gray-100 text-gray-700',
  brand: 'bg-primary-50 text-primary-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-700',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'gray', className, children, ...props }, ref) => (
    <span ref={ref} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  ),
)
Badge.displayName = 'Badge'
