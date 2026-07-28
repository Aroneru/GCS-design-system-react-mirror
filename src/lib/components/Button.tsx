import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover focus-visible:outline-primary-600',
  secondary: 'bg-surface text-content border border-border hover:bg-surface-subtle',
  danger: 'bg-feedback-error text-white hover:bg-red-700',
  ghost: 'text-content hover:bg-surface-subtle',
}

interface CommonProps {
  variant?: ButtonVariant
  className?: string
  children?: ReactNode
}

type AsButton = CommonProps & { as?: 'button' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>
type AsAnchor = CommonProps & { as: 'a' } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>

export type ButtonProps = AsButton | AsAnchor

/** Button — bisa dirender sebagai <button> (default) atau <a> lewat prop `as`. */
export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className)

  if (props.as === 'a') {
    const { as: _as, ...rest } = props
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    )
  }

  const { as: _as, type = 'button', ...rest } = props as AsButton
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
