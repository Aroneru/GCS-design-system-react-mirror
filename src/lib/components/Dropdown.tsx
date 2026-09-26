import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

export interface DropdownProps {
  children: ReactNode
  /** Kelas untuk pembungkus terluar. */
  className?: string
}

type OwnedTriggerAttributes =
  | 'aria-controls'
  | 'aria-expanded'
  | 'popoverTarget'
  | 'popoverTargetAction'

export type DropdownTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  OwnedTriggerAttributes
>

export type DropdownContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'popover'>

export type DropdownItemTone = 'default' | 'danger'

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: DropdownItemTone
}

export type DropdownSeparatorProps = HTMLAttributes<HTMLHRElement>

interface DropdownContextValue {
  contentId: string
  hideContent: () => void
  setContentElement: (element: HTMLDivElement | null) => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext(component: string) {
  const context = useContext(DropdownContext)

  if (!context) {
    throw new Error(`${component} harus digunakan di dalam Dropdown.`)
  }

  return context
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

/** Dropdown nonmodal berbasis HTML Popover API dengan visibilitas native. */
export function Dropdown({ children, className }: DropdownProps) {
  const contentId = useId()
  const contentRef = useRef<HTMLDivElement | null>(null)

  const setContentElement = useCallback((element: HTMLDivElement | null) => {
    contentRef.current = element
  }, [])

  const hideContent = useCallback(() => {
    const content = contentRef.current
    if (content?.isConnected && content.matches(':popover-open')) {
      content.hidePopover()
    }
  }, [])

  const context = useMemo<DropdownContextValue>(
    () => ({ contentId, hideContent, setContentElement }),
    [contentId, hideContent, setContentElement],
  )

  return (
    <DropdownContext.Provider value={context}>
      <div className={cn('relative inline-block', className)}>{children}</div>
    </DropdownContext.Provider>
  )
}

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  function DropdownTrigger({ type = 'button', className, children, ...props }, forwardedRef) {
    const { contentId } = useDropdownContext('DropdownTrigger')

    return (
      <button
        {...props}
        ref={forwardedRef}
        type={type}
        popoverTarget={contentId}
        popoverTargetAction="toggle"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium leading-normal text-content transition-colors',
          'hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        {children}
      </button>
    )
  },
)

DropdownTrigger.displayName = 'DropdownTrigger'

export const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  function DropdownContent({ className, children, ...props }, forwardedRef) {
    const { contentId, setContentElement } = useDropdownContext('DropdownContent')

    const setRef = useCallback(
      (element: HTMLDivElement | null) => {
        setContentElement(element)
        assignRef(forwardedRef, element)
      },
      [forwardedRef, setContentElement],
    )

    return (
      <div
        {...props}
        ref={setRef}
        id={contentId}
        popover="auto"
        className={cn(
          'fixed inset-auto mt-2 mr-0 mb-0 ml-0 w-56 max-w-[calc(100vw-1rem)] [position-area:bottom_center] rounded-lg bg-surface text-content shadow-md',
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

DropdownContent.displayName = 'DropdownContent'

const itemTones: Record<DropdownItemTone, string> = {
  default: 'text-gray-700 hover:bg-gray-100',
  danger: 'text-red-600 hover:bg-red-50',
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(function DropdownItem(
  { type = 'button', tone = 'default', className, onClick, children, ...props },
  ref,
) {
  const { hideContent } = useDropdownContext('DropdownItem')

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    hideContent()
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm font-medium leading-normal transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        itemTones[tone],
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})

DropdownItem.displayName = 'DropdownItem'

export const DropdownSeparator = forwardRef<HTMLHRElement, DropdownSeparatorProps>(
  function DropdownSeparator({ className, ...props }, ref) {
    return <hr ref={ref} className={cn('my-1 border-0 border-t border-border', className)} {...props} />
  },
)

DropdownSeparator.displayName = 'DropdownSeparator'
