import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { Check, Clipboard as ClipboardIcon } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

export type ClipboardVariant = 'default' | 'segmented'
export type ClipboardPlatform = 'default' | 'mobile'

interface ClipboardCommonProps {
  value: string
  /** Preset eksplisit; tidak mengikuti lebar viewport. */
  platform?: ClipboardPlatform
  /** @deprecated Gunakan scope ambient `data-theme="dark"`. */
  darkMode?: boolean
  helperText?: ReactNode
  disabled?: boolean
  className?: string
  onCopySuccess?: (value: string) => void
  onCopyError?: (error: unknown) => void
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

type ClipboardAccessibleNameProps =
  | {
      /** Label terlihat yang juga memberi nama aksesibel input. */
      label: ReactNode
      'aria-label'?: string
      'aria-labelledby'?: string
    }
  | {
      label?: ReactNode
      'aria-label': string
      'aria-labelledby'?: string
    }
  | {
      label?: ReactNode
      'aria-label'?: string
      'aria-labelledby': string
    }

export type ClipboardProps = ClipboardCommonProps & ClipboardAccessibleNameProps & (
  | { variant?: 'default'; prefix?: never }
  | { variant: 'segmented'; prefix?: ReactNode }
)

const FEEDBACK_DURATION = 1600
const platforms: Record<ClipboardPlatform, {
  text: string
  value: string
  caption: string
  label: string
  prefix: string
  action: string
  tooltip: string
  field: string
  actionSize: string
  padding: string
  feedback: string
}> = {
  default: {
    text: 'text-sm',
    value: 'text-sm leading-[1.25]',
    caption: 'text-sm leading-[1.25]',
    label: 'text-sm leading-[1.5] font-medium',
    prefix: 'text-sm leading-[1.5]',
    action: 'text-sm leading-[1.5]',
    tooltip: 'text-sm leading-[1.5] font-medium',
    field: 'h-10.5',
    actionSize: 'h-10.5 px-4',
    padding: 'px-3',
    feedback: 'min-h-5',
  },
  mobile: {
    text: 'text-xs',
    value: 'text-xs',
    caption: 'text-xs',
    label: 'text-xs font-medium',
    prefix: 'text-xs',
    action: 'text-xs',
    tooltip: 'text-xs',
    field: 'h-9.75',
    actionSize: 'h-8.5 px-3',
    padding: 'px-2.5',
    feedback: 'min-h-4',
  },
}
const SUCCESS = 'Copied to clipboard.'
const FAILURE = 'Could not copy. Select the text and copy it manually.'
const actionClasses = 'inline-flex shrink-0 items-center justify-center bg-primary-700 font-medium text-white transition-colors enabled:hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:opacity-50'
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** ReactNode yang tidak menghasilkan konten terlihat tidak membentuk bagian UI opsional. */
function hasContent(content: ReactNode | undefined): boolean {
  if (content === null || content === undefined || content === false) return false
  return typeof content !== 'string' || content.trim().length > 0
}

function hasAccessibleName(label: ReactNode | undefined, ariaLabel: string | undefined, labelledBy: string | undefined) {
  return hasContent(label) || Boolean(ariaLabel?.trim()) || Boolean(labelledBy?.trim())
}

/**
 * Callback consumer adalah notifikasi saja: kegagalan sinkron maupun Promise
 * rejection sengaja diabaikan agar hasil Clipboard dan event handler React
 * tidak berubah atau menghasilkan unhandled rejection.
 */
function notifyConsumer(callback: (() => unknown) | undefined) {
  if (!callback) return
  try {
    const result = callback()
    if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
      void Promise.resolve(result).catch(() => undefined)
    }
  } catch {
    // Callback tidak boleh mengubah status operasi Clipboard.
  }
}

/** Nilai hanya-baca dengan aksi salin; prefix hanya untuk tampilan. */
export const Clipboard = forwardRef<HTMLInputElement, ClipboardProps>(function Clipboard(
  { value, variant = 'default', platform = 'default', darkMode = false, prefix, label, helperText, disabled = false, className,
    onCopySuccess, onCopyError, id, 'aria-label': ariaLabel,
    'aria-labelledby': labelledBy, 'aria-describedby': describedBy },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`
  const [feedback, setFeedback] = useState({ value, message: '' })
  const [pending, setPending] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const writing = useRef(false)
  const disabledRef = useRef(disabled)
  const latestValueRef = useRef(value)
  disabledRef.current = disabled
  latestValueRef.current = value
  const generation = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])

  if (!hasAccessibleName(label, ariaLabel, labelledBy)) {
    throw new Error('[Clipboard] Provide a non-empty label, aria-label, or aria-labelledby.')
  }

  useClientLayoutEffect(() => {
    const current = ++generation.current
    clearTimeout(timer.current)
    setFeedback((previous) =>
      previous.value === value && !previous.message ? previous : { value, message: '' },
    )
    return () => {
      if (generation.current === current) generation.current++
      clearTimeout(timer.current)
    }
  }, [value, disabled])

  useClientLayoutEffect(() => {
    if (!disabled) return
    const input = inputRef.current
    input?.blur()
    input?.setSelectionRange(0, 0)
  }, [disabled])

  // Separate mount lifetime from value lifetime: an old write still owns the lock.
  const mounted = useRef(false)
  useClientLayoutEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  async function copy() {
    if (disabled || writing.current) return
    writing.current = true
    setPending(true)
    clearTimeout(timer.current)
    setFeedback({ value, message: '' })
    const requestGeneration = generation.current
    const copiedValue = value
    let failed = false
    let failure: unknown
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable.')
      }
      await navigator.clipboard.writeText(copiedValue)
    } catch (error) {
      failed = true
      failure = error
    } finally {
      writing.current = false
      if (mounted.current) setPending(false)
    }
    if (
      !mounted.current ||
      disabledRef.current ||
      latestValueRef.current !== copiedValue ||
      generation.current !== requestGeneration
    ) return
    if (!failed) setTooltipDismissed(true)
    setFeedback({ value, message: failed ? FAILURE : SUCCESS })
    if (!failed) {
      timer.current = setTimeout(() => setFeedback({ value, message: '' }), FEEDBACK_DURATION)
    }
    if (failed) notifyConsumer(() => onCopyError?.(failure))
    else notifyConsumer(() => onCopySuccess?.(copiedValue))
  }

  function requestCopy() {
    void copy().catch(() => undefined)
  }

  const segmented = variant === 'segmented'
  const size = platforms[platform]
  const hasPrefix = segmented && hasContent(prefix)
  const hasLabel = hasContent(label)
  const hasHelper = hasContent(helperText)
  const message = !disabled && feedback.value === value ? feedback.message : ''
  const tooltip = (hovered || focusVisible) && !tooltipDismissed && message !== SUCCESS && !disabled && segmented

  useEffect(() => {
    if (!tooltip) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTooltipDismissed(true)
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [tooltip])

  function preventDisabledPointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled) event.preventDefault()
  }

  function preventDisabledKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (disabled) event.preventDefault()
  }

  function preventDisabledClipboard(event: ReactClipboardEvent<HTMLDivElement>) {
    if (disabled) event.preventDefault()
  }

  function preventDisabledContextMenu(event: ReactMouseEvent<HTMLDivElement>) {
    if (disabled) event.preventDefault()
  }

  return (
    <div data-theme={darkMode ? 'dark' : undefined} className={cn('w-full', className)}>
      {hasLabel && <label htmlFor={fieldId} className={cn('mb-2 block text-clipboard-label', size.label)}>{label}</label>}
      <div
        className={cn(
          segmented ? 'flex items-stretch rounded-lg border border-clipboard-border bg-clipboard-field' : 'flex items-center gap-2',
          disabled && 'cursor-not-allowed',
        )}
        onPointerDownCapture={preventDisabledPointer}
        onKeyDownCapture={preventDisabledKeyboard}
        onCopyCapture={preventDisabledClipboard}
        onCutCapture={preventDisabledClipboard}
        onContextMenuCapture={preventDisabledContextMenu}
      >
        {hasPrefix && <span className={cn('flex shrink-0 items-center rounded-s-lg border-e border-clipboard-border bg-clipboard-prefix-surface px-3 text-clipboard-prefix', size.prefix)}>{prefix}</span>}
        <input
          ref={setInputRef}
          id={fieldId}
          type="text"
          readOnly
          disabled={disabled}
          value={value}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={[hasHelper ? helperId : undefined, describedBy].filter(Boolean).join(' ') || undefined}
          className={cn(
            'min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:select-none',
            'bg-clipboard-field',
            segmented ? 'text-clipboard-segmented-value' : 'text-clipboard-value',
            size.value,
            segmented ? cn('h-10 px-3', !hasPrefix && 'rounded-s-lg') : cn('rounded-lg border border-clipboard-border', size.field, size.padding),
          )}
        />
        {segmented ? (
          <div className="relative -me-px flex h-10 shrink-0" onMouseEnter={() => { setHovered(true); if (!focusVisible && message !== SUCCESS) setTooltipDismissed(false) }} onMouseLeave={() => setHovered(false)}>
            <button
              type="button"
              disabled={disabled}
              aria-disabled={pending || undefined}
              aria-label="Copy to clipboard"
              onClick={requestCopy}
              onPointerDown={() => setFocusVisible(false)}
              onFocus={(event) => {
                const isFocusVisible = event.currentTarget.matches(':focus-visible')
                setFocusVisible(isFocusVisible)
                if (isFocusVisible && message !== SUCCESS) setTooltipDismissed(false)
              }}
              onBlur={() => setFocusVisible(false)}
              className={cn(actionClasses, 'relative -top-px h-10.5 w-10.5 rounded-e-lg border-s border-clipboard-border')}
            >
              {message === SUCCESS ? <Check className="relative size-5" aria-hidden="true" /> : <ClipboardIcon className="relative size-5" aria-hidden="true" />}
            </button>
            {tooltip && (
              <span aria-hidden="true" className="absolute start-1/2 bottom-full z-50 -translate-x-1/2 pb-2">
                <span className={cn('relative block whitespace-nowrap rounded-md bg-clipboard-tooltip px-3 py-2 text-white shadow-sm', size.tooltip)}>
                  Copy to clipboard
                  <span className="absolute start-1/2 -bottom-1 size-2 -translate-x-1/2 rotate-45 bg-clipboard-tooltip" />
                </span>
              </span>
            )}
          </div>
        ) : (
          <button type="button" disabled={disabled} aria-disabled={pending || undefined} onClick={requestCopy} className={cn(actionClasses, 'rounded-lg', size.actionSize, size.action)}>
            Copy
          </button>
        )}
      </div>
      {hasHelper && <div id={helperId} className={cn('mt-2 font-medium text-clipboard-caption', size.caption)}>{helperText}</div>}
      <span role="status" className="sr-only">{message}</span>
      <p aria-hidden="true" className={cn('mt-2', size.text, size.feedback, message === FAILURE ? 'text-feedback-error' : 'text-clipboard-caption')}>{message}</p>
    </div>
  )
})
