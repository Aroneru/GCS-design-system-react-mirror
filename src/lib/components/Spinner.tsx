import { forwardRef, type SVGProps } from 'react'
import { cn } from '../utils/cn'

export type SpinnerSize = 'default' | 'large'

export interface SpinnerProps
  extends Omit<
    SVGProps<SVGSVGElement>,
    'width' | 'height' | 'viewBox' | 'fill' | 'children' | 'dangerouslySetInnerHTML'
  > {
  size?: SpinnerSize
}

const sizes: Record<SpinnerSize, string> = {
  default: 'size-[50px]',
  large: 'size-[100px]',
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  {
    size = 'default',
    className,
    role,
    'aria-hidden': ariaHidden,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const isHidden = ariaHidden === true || ariaHidden === 'true'

  return (
    <svg
      ref={ref}
      viewBox="0 0 50 50"
      fill="none"
      className={cn('shrink-0 animate-spin motion-reduce:animate-none', sizes[size], className)}
      role={isHidden ? undefined : (role ?? 'status')}
      aria-hidden={ariaHidden}
      aria-label={isHidden ? undefined : (ariaLabel ?? 'Loading')}
      {...props}
    >
      <circle cx="25" cy="25" r="20" className="stroke-gray-200" strokeWidth="4" />
      <circle
        cx="25"
        cy="25"
        r="20"
        className="stroke-primary-600"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="25 75"
      />
    </svg>
  )
})

Spinner.displayName = 'Spinner'
