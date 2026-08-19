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
  top: 'top-[-6px] left-1/2 -translate-x-1/2 border-t border-l bg-gray-50',
  right: 'top-1/2 right-[-6px] -translate-y-1/2 border-t border-r bg-surface',
  bottom: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-r border-b bg-surface',
  left: 'top-1/2 left-[-6px] -translate-y-1/2 border-b border-l bg-surface',
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
    <div ref={ref} className={cn('relative w-[255px]', className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          'absolute z-30 size-3 rotate-45 border-border',
          arrowClasses[side],
        )}
      />

      <div className="relative z-10 overflow-hidden rounded-md bg-surface shadow-sm">
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
