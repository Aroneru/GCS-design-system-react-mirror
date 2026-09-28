import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type DialogHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { Close } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

export type ModalSize = 's' | 'm'

export interface ModalProps
  extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    'open' | 'onClose' | 'onCancel' | 'title'
  > {
  /** Sumber kebenaran buka/tutup. Modal ini terkendali sepenuhnya. */
  open: boolean
  /**
   * Dipanggil setiap kali modal minta ditutup — tombol tutup, Escape, atau
   * klik di luar panel. Consumer yang memutuskan apakah `open` ikut berubah.
   */
  onClose: () => void
  size?: ModalSize
  /**
   * Judul di header. Sekaligus jadi nama aksesibilitas dialognya, kecuali
   * `aria-label` atau `aria-labelledby` diisi sendiri.
   */
  title?: ReactNode
  /**
   * Tombol tutup di kanan header. Matikan bila modalnya harus diselesaikan
   * lewat tombol di footer — misalnya konfirmasi yang tak boleh dilewati.
   */
  dismissible?: boolean
  /** Nama aksesibel tombol tutup. */
  closeLabel?: string
  /** Baris tombol di kaki modal. */
  footer?: ReactNode
  /** Isi modal. */
  children?: ReactNode
}

const sizes: Record<ModalSize, string> = {
  s: 'max-w-[416px]',
  m: 'max-w-[640px]',
}

/**
 * Modal — dialog di atas halaman, berbasis elemen `<dialog>` bawaan.
 *
 * Susunannya ditentukan prop, bukan subkomponen: `title` mengisi header,
 * `children` mengisi badan, `footer` mengisi kakinya. Itu mengikuti komponen
 * lain di kit ini — Alert punya `heading` + `actions`, Card punya `title` +
 * `description` + `actions` — sehingga tidak ada satu komponen pun yang
 * dipakai dengan cara yang berbeda dari tetangganya.
 *
 * `open` tetap sumber kebenaran. Peramban yang mengurus top layer, latar yang
 * ikut mati, dan jebakan fokus; `onClose` hanya MEMINTA consumer memperbarui
 * `open` — Escape maupun klik di luar panel tidak menutupnya sendiri.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    size = 's',
    title,
    dismissible = true,
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

  // Escape memicu `cancel`; dicegah supaya penutupan tetap lewat satu jalan —
  // `onClose`. Kalau dibiarkan, dialognya tertutup sendiri sementara `open`
  // masih true, dan keduanya jadi tidak sinkron.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  const handleNativeClose = () => {
    if (open) onClose()
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

    if (diLuarPanel) onClose()
  }

  const labelSendiri = ariaLabel?.trim() ? ariaLabel : undefined
  const labelledBySendiri = ariaLabelledBy?.trim() || undefined
  const adaJudul = title !== undefined && title !== null && title !== false
  const namaOtomatis = adaJudul && !labelSendiri ? titleId : undefined

  useEffect(() => {
    const dialog = internalRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  const adaHeader = adaJudul || dismissible

  return (
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
        sizes[size],
        className,
      )}
      {...props}
    >
      {adaHeader && (
        <div
          className={cn(
            'flex shrink-0 items-start justify-between gap-4 px-6',
            adaJudul ? 'border-b border-border py-5' : 'pt-4',
          )}
        >
          {adaJudul && (
            <h2 id={titleId} className="min-w-0 flex-1 text-heading-4 font-bold text-gray-900">
              {title}
            </h2>
          )}

          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-my-2 -mr-2 ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <Close className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-6 text-body-sm text-gray-500">
        {children}
      </div>

      {footer && (
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  )
})

Modal.displayName = 'Modal'
