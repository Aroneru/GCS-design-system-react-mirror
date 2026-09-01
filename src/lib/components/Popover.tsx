import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Judul pada area header Popover. */
  title: ReactNode
  /** Posisi arrow terhadap panel. */
  side?: PopoverSide
  children: ReactNode
}

const arrowClasses: Record<PopoverSide, string> = {
  top: 'top-[-8px] left-[calc(50%-8px)]',
  right: 'top-[calc(50%-8px)] right-[-8px] rotate-90',
  bottom: 'bottom-[-8px] left-[calc(50%-8px)] rotate-180',
  left: 'top-[calc(50%-8px)] left-[-8px] -rotate-90',
}

const arrowSurfaceClasses: Record<PopoverSide, string> = {
  top: 'bg-gray-50',
  right: 'bg-surface',
  bottom: 'bg-surface',
  left: 'bg-surface',
}

/**
 * Popover visual dengan header, body, dan arrow pada salah satu dari empat sisi.
 * Komponen ini tidak mengatur trigger, posisi viewport, atau open state.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { title, side = 'right', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative w-[255px] shrink-0 [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.08))]',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn('pointer-events-none absolute z-30 size-4', arrowClasses[side])}
      >
        <span
          className={cn(
            'absolute top-[3.25px] left-[3px] size-2.5 rotate-45 border-t border-l border-border',
            arrowSurfaceClasses[side],
          )}
        />
      </span>

      <div className="relative z-10 overflow-hidden rounded-md bg-surface">
        <div className="border-b border-border bg-gray-50 px-3 py-1.5 text-sm leading-[1.5] font-semibold text-gray-900">
          {title}
        </div>
        <div className="bg-surface px-3 py-2 text-sm leading-[1.5] font-medium text-gray-500">
          {children}
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-md border border-border"
        />
      </div>
    </div>
  )
})

Popover.displayName = 'Popover'
