import {
  createContext,
  forwardRef,
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
import { Close } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

export type ModalSize = 's' | 'm'

export interface ModalProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel'> {
  open: boolean
  onClose: () => void
  size?: ModalSize
  children: ReactNode
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Nama aksesibel tombol tutup. */
  closeLabel?: string
}

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>

interface ModalContextValue {
  onClose: () => void
  titleId: string
  registerTitle: (id: string, node: HTMLHeadingElement | null) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

const sizes: Record<ModalSize, string> = {
  s: 'max-w-[416px]',
  m: 'max-w-[640px]',
}

function useModalContext(component: string) {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error(`${component} harus digunakan di dalam Modal.`)
  }

  return context
}

/**
 * Modal interaktif berbasis elemen <dialog> native.
 *
 * Prop `open` tetap menjadi sumber kebenaran. Browser menangani top layer,
 * inert background, dan fokus modal; event cancel hanya meminta consumer
 * memperbarui `open` melalui `onClose`.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    size = 's',
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    onClick,
    ...props
  },
  forwardedRef,
) {
  const internalRef = useRef<HTMLDialogElement | null>(null)
  const titleId = useId()
  const mountedTitleIdRef = useRef<string | undefined>(undefined)
  const [registeredTitleId, setRegisteredTitleId] = useState<string>()

  const registerTitle = useCallback((id: string, node: HTMLHeadingElement | null) => {
    if (node) {
      mountedTitleIdRef.current = id
      setRegisteredTitleId((current) => (current === id ? current : id))
      return
    }

    if (mountedTitleIdRef.current !== id) return

    mountedTitleIdRef.current = undefined
    setRegisteredTitleId((current) => (current === id ? undefined : current))
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
    event.preventDefault()
    onClose()
  }

  const handleNativeClose = () => {
    if (open) onClose()
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.target !== event.currentTarget) return

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
    <ModalContext.Provider value={{ onClose, titleId, registerTitle }}>
      <dialog
        ref={setRef}
        aria-label={explicitAriaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onClick={handleClick}
        className={cn(
          'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-lg border border-border bg-surface p-0 text-left text-content shadow-xl',
          'backdrop:bg-gray-900/50 open:flex open:flex-col',
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </dialog>
    </ModalContext.Provider>
  )
})

Modal.displayName = 'Modal'

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
  { children, closeLabel = 'Tutup modal', className, ...props },
  ref,
) {
  const { onClose, titleId, registerTitle } = useModalContext('ModalHeader')
  const hasTitle = children !== undefined && children !== null && children !== false
  const titleRef = useCallback(
    (node: HTMLHeadingElement | null) => registerTitle(titleId, node),
    [registerTitle, titleId],
  )

  return (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 items-start justify-between gap-4 px-6',
        hasTitle ? 'border-b border-border py-5' : 'pt-4',
        className,
      )}
      {...props}
    >
      {hasTitle && (
        <h2
          ref={titleRef}
          id={titleId}
          className="min-w-0 flex-1 text-heading-4 font-bold text-gray-900"
        >
          {children}
        </h2>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="-my-2 -mr-2 ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <Close className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
})

ModalHeader.displayName = 'ModalHeader'

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-6 text-body-sm text-gray-500',
        className,
      )}
      {...props}
    />
  )
})

ModalBody.displayName = 'ModalBody'

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('flex shrink-0 flex-wrap items-center gap-3 border-t border-border px-6 py-4', className)}
      {...props}
    />
  )
})

ModalFooter.displayName = 'ModalFooter'
