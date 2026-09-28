import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { Close, ChevronDown, ChevronUp } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

export type DrawerPosition = 'right' | 'left' | 'top' | 'bottom'
export type DrawerSize = 's' | 'm' | 'l' | 'xl' | 'full'
export type DrawerNavItemTheme = 'primary' | 'purple' | 'blue' | 'gray'

export interface DrawerProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel'> {
  open: boolean
  onClose: () => void
  position?: DrawerPosition
  size?: DrawerSize
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  children: ReactNode
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  closeLabel?: string
  showCloseButton?: boolean
  onClose?: () => void
}

export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>
export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>

export interface DrawerNavItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  label: ReactNode
  active?: boolean
  expanded?: boolean
  collapsible?: boolean
  theme?: DrawerNavItemTheme
  href?: string
  badge?: ReactNode
  onClick?: (e: MouseEvent<HTMLElement>) => void
  children?: ReactNode
}

export interface DrawerSubItemProps extends HTMLAttributes<HTMLAnchorElement> {
  label: ReactNode
  active?: boolean
  theme?: DrawerNavItemTheme
  href?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

interface DrawerContextValue {
  onClose: () => void
  titleId: string
  descriptionId: string
  registerTitle: (id: string, isMounted: boolean) => void
  registerDescription: (id: string, isMounted: boolean) => void
}

const DrawerContext = createContext<DrawerContextValue | null>(null)

const sideSizes: Record<DrawerSize, string> = {
  s: 'w-[320px] max-w-[calc(100vw-2rem)]',
  m: 'w-[440px] max-w-[calc(100vw-2rem)]',
  l: 'w-[600px] max-w-[calc(100vw-2rem)]',
  xl: 'w-[800px] max-w-[calc(100vw-2rem)]',
  full: 'w-screen max-w-full',
}

const verticalSizes: Record<DrawerSize, string> = {
  s: 'h-[260px] max-h-[calc(100vh-2rem)]',
  m: 'h-[380px] max-h-[calc(100vh-2rem)]',
  l: 'h-[540px] max-h-[calc(100vh-2rem)]',
  xl: 'h-[720px] max-h-[calc(100vh-2rem)]',
  full: 'h-screen max-h-full',
}

const positionClasses: Record<DrawerPosition, (size: DrawerSize) => string> = {
  right: (size) =>
    cn(
      'fixed inset-y-0 right-0 left-auto h-full max-h-full border-l border-border rounded-none',
      sideSizes[size],
    ),
  left: (size) =>
    cn(
      'fixed inset-y-0 left-0 right-auto h-full max-h-full border-r border-border rounded-none',
      sideSizes[size],
    ),
  top: (size) =>
    cn(
      'fixed inset-x-0 top-0 bottom-auto w-full max-w-full border-b border-border rounded-none',
      verticalSizes[size],
    ),
  bottom: (size) =>
    cn(
      'fixed inset-x-0 bottom-0 top-auto w-full max-w-full border-t border-border rounded-none',
      verticalSizes[size],
    ),
}

const activeThemeClasses: Record<DrawerNavItemTheme, string> = {
  primary: 'bg-blue-50 text-blue-600 font-medium',
  purple: 'bg-purple-100/70 text-purple-700 font-medium',
  blue: 'bg-blue-50 text-blue-600 font-medium',
  gray: 'bg-gray-100 text-gray-900 font-medium',
}

const activeIconClasses: Record<DrawerNavItemTheme, string> = {
  primary: 'text-blue-600',
  purple: 'text-purple-600',
  blue: 'text-blue-600',
  gray: 'text-gray-700',
}

const hoverThemeClasses: Record<DrawerNavItemTheme, string> = {
  primary: 'hover:bg-blue-50 hover:text-blue-600',
  purple: 'hover:bg-purple-100/70 hover:text-purple-700',
  blue: 'hover:bg-blue-50 hover:text-blue-600',
  gray: 'hover:bg-gray-100/70 hover:text-gray-900',
}

const hoverIconClasses: Record<DrawerNavItemTheme, string> = {
  primary: 'group-hover:text-blue-600',
  purple: 'group-hover:text-purple-700',
  blue: 'group-hover:text-blue-600',
  gray: 'group-hover:text-gray-900',
}

const subItemHoverClasses: Record<DrawerNavItemTheme, string> = {
  primary: 'hover:bg-blue-50 hover:text-blue-600',
  purple: 'hover:bg-purple-100/70 hover:text-purple-700',
  blue: 'hover:bg-blue-50 hover:text-blue-600',
  gray: 'hover:bg-gray-100/70 hover:text-gray-900',
}

/**
 * Drawer interaktif berbasis elemen <dialog> native (Side Sheet / Off-canvas panel).
 */
const DrawerRoot = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer(
  {
    open,
    onClose,
    position = 'right',
    size = 'm',
    closeOnOverlayClick = true,
    closeOnEsc = true,
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    onClick,
    ...props
  },
  forwardedRef,
) {
  const internalRef = useRef<HTMLDialogElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const mountedTitleIdRef = useRef<string | undefined>(undefined)
  const mountedDescIdRef = useRef<string | undefined>(undefined)
  const [registeredTitleId, setRegisteredTitleId] = useState<string>()
  const [registeredDescId, setRegisteredDescId] = useState<string>()

  const registerTitle = useCallback((id: string, isMounted: boolean) => {
    if (isMounted) {
      mountedTitleIdRef.current = id
      setRegisteredTitleId((current) => (current === id ? current : id))
    } else {
      if (mountedTitleIdRef.current === id) {
        mountedTitleIdRef.current = undefined
        setRegisteredTitleId((current) => (current === id ? undefined : current))
      }
    }
  }, [])

  const registerDescription = useCallback((id: string, isMounted: boolean) => {
    if (isMounted) {
      mountedDescIdRef.current = id
      setRegisteredDescId((current) => (current === id ? current : id))
    } else {
      if (mountedDescIdRef.current === id) {
        mountedDescIdRef.current = undefined
        setRegisteredDescId((current) => (current === id ? undefined : current))
      }
    }
  }, [])

  const setRef = useCallback(
    (node: HTMLDialogElement | null) => {
      internalRef.current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [forwardedRef],
  )

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (!closeOnEsc) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    onClose()
  }

  const handleNativeClose = () => {
    if (open) onClose()
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    if (!closeOnOverlayClick || event.defaultPrevented || event.target !== event.currentTarget) return

    const rect = event.currentTarget.getBoundingClientRect()
    const outsidePanel =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom

    if (outsidePanel) onClose()
  }

  const explicitAriaLabelledBy = ariaLabelledBy?.trim() || undefined
  const explicitAriaLabel = ariaLabel?.trim() ? ariaLabel : undefined
  const resolvedAriaLabelledBy =
    explicitAriaLabelledBy ?? (explicitAriaLabel ? undefined : registeredTitleId)
  const resolvedAriaDescribedBy = ariaDescribedBy?.trim() || registeredDescId

  const usesExplicitAccessibleName = Boolean(explicitAriaLabelledBy || explicitAriaLabel)

  useEffect(() => {
    const dialog = internalRef.current
    if (!dialog) return

    if (!open && dialog.open) {
      dialog.close()
      return
    }

    if (!open || dialog.open) return

    const mountedTitleId = mountedTitleIdRef.current
    const waitingForAutomaticTitle =
      !usesExplicitAccessibleName &&
      mountedTitleId !== undefined &&
      registeredTitleId !== mountedTitleId

    if (!waitingForAutomaticTitle) dialog.showModal()
  }, [open, registeredTitleId, usesExplicitAccessibleName])

  return (
    <DrawerContext.Provider
      value={{ onClose, titleId, descriptionId, registerTitle, registerDescription }}
    >
      <dialog
        ref={setRef}
        aria-label={explicitAriaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={resolvedAriaDescribedBy}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onClick={handleClick}
        className={cn(
          'm-0 p-0 text-left text-content shadow-2xl bg-surface backdrop:bg-gray-900/50 backdrop:backdrop-blur-xs open:flex open:flex-col overflow-hidden',
          positionClasses[position](size),
          className,
        )}
        {...props}
      >
        {children}
      </dialog>
    </DrawerContext.Provider>
  )
})

DrawerRoot.displayName = 'Drawer'

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader(
  { eyebrow, children, closeLabel = 'Tutup drawer', showCloseButton = true, onClose: explicitOnClose, className, ...props },
  ref,
) {
  const context = useContext(DrawerContext)
  const handleClose = explicitOnClose ?? context?.onClose

  const hasContent = Boolean(children)

  return (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 items-center justify-between gap-4 px-5 pt-4 pb-2',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1 space-y-1">
        {eyebrow && (
          <span className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {eyebrow}
          </span>
        )}
        {hasContent && children}
      </div>

      {showCloseButton && (
        <button
          type="button"
          onClick={handleClose}
          aria-label={closeLabel}
          className="-mr-2 ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <Close className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
})

DrawerHeader.displayName = 'DrawerHeader'

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(function DrawerTitle(
  { className, children, id: explicitId, ...props },
  forwardedRef,
) {
  const context = useContext(DrawerContext)
  const id = explicitId ?? context?.titleId

  useEffect(() => {
    if (!context || !context.titleId) return
    const currentTitleId = context.titleId
    context.registerTitle(currentTitleId, true)
    return () => {
      context.registerTitle(currentTitleId, false)
    }
  }, [context])

  return (
    <h2
      ref={forwardedRef}
      id={id}
      className={cn('text-base font-bold text-gray-900', className)}
      {...props}
    >
      {children}
    </h2>
  )
})

DrawerTitle.displayName = 'DrawerTitle'

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  function DrawerDescription({ className, children, id: explicitId, ...props }, forwardedRef) {
    const context = useContext(DrawerContext)
    const id = explicitId ?? context?.descriptionId

    useEffect(() => {
      if (!context || !context.descriptionId) return
      const currentDescId = context.descriptionId
      context.registerDescription(currentDescId, true)
      return () => {
        context.registerDescription(currentDescId, false)
      }
    }, [context])

    return (
      <p ref={forwardedRef} id={id} className={cn('text-xs text-gray-500', className)} {...props}>
        {children}
      </p>
    )
  },
)

DrawerDescription.displayName = 'DrawerDescription'

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function DrawerBody(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-5 text-xs text-gray-600',
        className,
      )}
      {...props}
    />
  )
})

DrawerBody.displayName = 'DrawerBody'

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3', className)}
      {...props}
    />
  )
})

DrawerFooter.displayName = 'DrawerFooter'

/**
 * Subkomponen item navigasi menu di dalam Drawer (seperti pada contoh desain wireframe).
 */
export const DrawerNavItem = forwardRef<HTMLDivElement, DrawerNavItemProps>(function DrawerNavItem(
  {
    icon,
    label,
    active = false,
    expanded = false,
    collapsible = false,
    theme = 'primary',
    href,
    badge,
    onClick,
    className,
    children,
    ...props
  },
  ref,
) {
  const isExpandable = collapsible || Boolean(children)
  const Component = href ? 'a' : 'button'

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      <Component
        href={href}
        onClick={onClick}
        type={href ? undefined : 'button'}
        className={cn(
          'group flex w-full items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-xs transition-all text-left font-medium',
          active
            ? activeThemeClasses[theme]
            : cn('text-slate-800', hoverThemeClasses[theme]),
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {icon && (
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center transition-colors',
                active ? activeIconClasses[theme] : cn('text-slate-500', hoverIconClasses[theme]),
              )}
            >
              {icon}
            </span>
          )}
          <span className="truncate">{label}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {isExpandable && (
            <span
              className={cn(
                'size-3.5 transition-all',
                active ? activeIconClasses[theme] : cn('text-slate-500', hoverIconClasses[theme]),
              )}
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </span>
          )}
        </div>
      </Component>

      {expanded && children && (
        <div className="mt-0.5 space-y-0.5">
          {Children.map(children, (child) => {
            if (isValidElement<DrawerSubItemProps>(child)) {
              return cloneElement(child, { theme: child.props.theme ?? theme })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
})

DrawerNavItem.displayName = 'DrawerNavItem'

/**
 * Subkomponen sub-menu ter-indentasi di bawah DrawerNavItem yang expanded.
 */
export const DrawerSubItem = forwardRef<HTMLElement, DrawerSubItemProps>(function DrawerSubItem(
  { label, active = false, theme = 'primary', href, onClick, className, ...props },
  ref,
) {
  const Component = (href ? 'a' : 'button') as any
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (!href) {
      e.preventDefault()
    }
    onClick?.(e)
  }

  return (
    <Component
      ref={ref}
      href={href}
      type={href ? undefined : 'button'}
      onClick={handleClick}
      className={cn(
        'block w-full text-left rounded-lg pl-10 pr-3 py-1.5 text-xs transition-colors font-medium text-slate-800',
        subItemHoverClasses[theme],
        active
          ? theme === 'purple'
            ? 'font-medium text-purple-700 bg-purple-50/70'
            : 'font-medium text-blue-600 bg-blue-50/70'
          : 'text-slate-800',
        className,
      )}
      {...props}
    >
      {label}
    </Component>
  )
})

DrawerSubItem.displayName = 'DrawerSubItem'

export type DrawerComponentType = typeof DrawerRoot & {
  Header: typeof DrawerHeader
  Title: typeof DrawerTitle
  Description: typeof DrawerDescription
  Body: typeof DrawerBody
  Footer: typeof DrawerFooter
  NavItem: typeof DrawerNavItem
  SubItem: typeof DrawerSubItem
}

export const Drawer: DrawerComponentType = Object.assign(DrawerRoot, {
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  NavItem: DrawerNavItem,
  SubItem: DrawerSubItem,
})
