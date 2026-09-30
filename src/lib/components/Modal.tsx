import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { Close } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

export type ModalSize = 's' | 'm'
export type ModalVariant = 'default' | 'popup'

interface ModalCommonProps
  extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    'open' | 'onClose' | 'onCancel' | 'title'
  > {
  /** Tombol milik consumer yang membuka Modal. */
  trigger: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
  /** Nama aksesibel tombol tutup. */
  closeLabel?: string
  /** Isi modal. */
  children?: ReactNode
  /** Area aksi, atau render function yang menerima fungsi penutup Modal. */
  footer?: ReactNode | ((actions: { close: () => void }) => ReactNode)
}

interface ModalDefaultProps extends ModalCommonProps {
  variant?: 'default'
  size?: ModalSize
  /**
   * Judul di header. Sekaligus jadi nama aksesibilitas dialognya, kecuali
   * `aria-label` atau `aria-labelledby` diisi sendiri.
   */
  title?: ReactNode
}

interface ModalPopupProps extends ModalCommonProps {
  variant: 'popup'
  size?: never
  title?: never
}

export type ModalProps = ModalDefaultProps | ModalPopupProps

const sizes: Record<ModalSize, string> = {
  s: 'max-w-[416px]',
  m: 'max-w-[640px]',
}

/**
 * Modal — dialog di atas halaman, berbasis elemen `<dialog>` bawaan.
 *
 * Pada variant default, `title` mengisi header, `children` mengisi badan, dan
 * `footer` mengisi kakinya. Variant popup memakai `children` untuk konten
 * ringkas dan menampilkan footer tanpa divider.
 *
 * Modal mengurus visibilitas internal dan `trigger` membukanya. Peramban tetap
 * mengurus top layer, latar yang ikut mati, dan jebakan fokus.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    trigger,
    variant = 'default',
    size,
    title,
    closeLabel = 'Tutup modal',
    footer,
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
  const isPopup = variant === 'popup'
  const [internalOpen, setInternalOpen] = useState(false)
  const requestOpen = useCallback(() => {
    setInternalOpen(true)
  }, [])

  const requestClose = useCallback(() => {
    setInternalOpen(false)
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

  // Escape memicu `cancel`; dicegah supaya penutupan tetap lewat satu jalan
  // dan state internal selalu sinkron dengan elemen dialog native.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    requestClose()
  }

  const handleNativeClose = () => {
    if (internalOpen) requestClose()
  }

  // Klik di luar panel. `<dialog>` membentang selebar viewport sementara
  // panelnya hanya kotak di tengah, jadi yang dibandingkan koordinat klik
  // terhadap kotak itu — bukan sekadar `event.target`.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.target !== event.currentTarget) return

    const rect = event.currentTarget.getBoundingClientRect()
    const diLuarPanel =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom

    if (diLuarPanel) requestClose()
  }

  const labelSendiri = ariaLabel?.trim() ? ariaLabel : undefined
  const labelledBySendiri = ariaLabelledBy?.trim() || undefined
  const adaJudul = !isPopup && title !== undefined && title !== null && title !== false
  const namaOtomatis = adaJudul && !labelSendiri ? titleId : undefined

  useEffect(() => {
    const dialog = internalRef.current
    if (!dialog) return

    if (internalOpen && !dialog.open) dialog.showModal()
    else if (!internalOpen && dialog.open) dialog.close()
  }, [internalOpen])

  if (!isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(trigger)) {
    throw new Error('Modal memerlukan satu elemen <button> yang valid pada prop `trigger`.')
  }

  const renderedTrigger = cloneElement(trigger, {
    'aria-haspopup': 'dialog',
    'aria-expanded': internalOpen,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      trigger.props.onClick?.(event)
      if (event.defaultPrevented || trigger.props.disabled) return
      requestOpen()
    },
  })
  const renderedFooter = typeof footer === 'function' ? footer({ close: requestClose }) : footer

  return (
    <>
      {renderedTrigger}
      <dialog
        ref={setRef}
        aria-label={labelSendiri}
        aria-labelledby={labelledBySendiri ?? namaOtomatis}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onClick={handleClick}
        className={cn(
          'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-lg border border-border bg-surface p-0 text-left text-content shadow-xl',
          'backdrop:bg-gray-900/50 open:flex open:flex-col',
          isPopup ? 'max-w-[416px]' : sizes[size ?? 's'],
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'flex shrink-0 items-start justify-between gap-4',
            isPopup
              ? 'relative h-7 px-5'
              : cn('px-6', adaJudul ? 'border-b border-border py-5' : 'pt-4'),
          )}
        >
          {adaJudul && (
            <h2 id={titleId} className="min-w-0 flex-1 text-heading-4 font-bold text-gray-900">
              {title}
            </h2>
          )}

          <button
            type="button"
            onClick={requestClose}
            aria-label={closeLabel}
            className={cn(
              'ml-auto inline-flex shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
              isPopup ? 'absolute right-0.5 top-0.5 size-10' : '-my-2 -mr-2 size-10',
            )}
          >
            <Close className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto overscroll-y-contain text-body-sm text-gray-500',
            isPopup ? 'px-5 pb-4 pt-5' : 'px-5 py-6',
          )}
        >
          {children}
        </div>

        {renderedFooter && (
          <div
            className={cn(
              'flex shrink-0 flex-wrap items-center gap-3',
              isPopup ? 'px-5 pb-5' : 'border-t border-border px-6 py-4',
            )}
          >
            {renderedFooter}
          </div>
        )}
      </dialog>
    </>
  )
})

Modal.displayName = 'Modal'
