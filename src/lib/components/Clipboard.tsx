import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Clipboard as ClipboardIcon } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'

export type ClipboardVariant = 'default' | 'segmented'
export type ClipboardPlatform = 'default' | 'mobile'

interface ClipboardCommonProps {
  value: string
  /** Preset eksplisit; tidak mengikuti lebar viewport. */
  platform?: ClipboardPlatform
  /** Tampilan gelap sesuai token Clipboard. */
  darkMode?: boolean
  label?: ReactNode
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

export type ClipboardProps = ClipboardCommonProps & (
  | { variant?: 'default'; prefix?: never }
  | { variant: 'segmented'; prefix?: ReactNode }
)

const FEEDBACK_DURATION = 1600
const platforms: Record<ClipboardPlatform, { text: string; field: string; action: string; padding: string; feedback: string }> = {
  default: { text: 'text-sm', field: 'h-10.5', action: 'h-10.5 px-4', padding: 'px-3', feedback: 'min-h-5' },
  mobile: { text: 'text-xs', field: 'h-9.75', action: 'h-8.5 px-3', padding: 'px-2.5', feedback: 'min-h-4' },
}
const SUCCESS = 'Copied to clipboard.'
const FAILURE = 'Could not copy. Select the text and copy it manually.'
const actionClasses = 'inline-flex shrink-0 items-center justify-center bg-primary-700 font-medium text-white transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:opacity-50'
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const themes = {
  light: {
    label: 'text-content',
    surface: 'bg-surface-subtle',
    border: 'border-gray-300',
    prefixSurface: 'bg-gray-100',
    prefixText: 'text-content',
    value: 'text-content',
    helper: 'text-content-subtle',
    feedback: 'text-content-subtle',
    tooltip: 'bg-gray-900',
  },
  dark: {
    label: 'text-gray-300',
    surface: 'bg-gray-800',
    border: 'border-gray-800',
    prefixSurface: 'bg-gray-800',
    prefixText: 'text-gray-300',
    value: 'text-gray-400',
    helper: 'text-gray-500',
    feedback: 'text-gray-500',
    tooltip: 'bg-gray-800',
  },
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
  const [focused, setFocused] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const writing = useRef(false)
  const generation = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Reset feedback synchronously when `value` changes so stale copy status
  // is never rendered for a different value.
  if (feedback.value !== value) setFeedback({ value, message: '' })

  useClientLayoutEffect(() => {
    const current = ++generation.current
    return () => {
      if (generation.current === current) generation.current++
      clearTimeout(timer.current)
    }
  }, [value])

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
    let failed = false
    let failure: unknown
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable.')
      }
      await navigator.clipboard.writeText(value)
    } catch (error) {
      failed = true
      failure = error
    } finally {
      writing.current = false
      if (mounted.current) setPending(false)
    }
    if (!mounted.current || generation.current !== requestGeneration) return
    setFeedback({ value, message: failed ? FAILURE : SUCCESS })
    if (!failed) {
      timer.current = setTimeout(() => setFeedback({ value, message: '' }), FEEDBACK_DURATION)
    }
    // Consumer callback errors are not clipboard failures.
    if (failed) onCopyError?.(failure)
    else onCopySuccess?.(value)
  }

  const segmented = variant === 'segmented'
  const size = platforms[platform]
  const theme = darkMode ? themes.dark : themes.light
  const hasPrefix = segmented && prefix != null && prefix !== false
  const hasLabel = label != null && label !== false
  const hasHelper = helperText != null && helperText !== false
  const message = feedback.value === value ? feedback.message : ''
  const tooltip = (hovered || focused) && !tooltipDismissed && !disabled && segmented

  useEffect(() => {
    if (!tooltip) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTooltipDismissed(true)
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [tooltip])

  return (
    <div className={cn('w-full', className)}>
      {hasLabel && <label htmlFor={fieldId} className={cn('mb-2 block font-medium', theme.label, size.text)}>{label}</label>}
      <div className={segmented ? cn('flex items-stretch rounded-lg border', theme.border, theme.surface) : 'flex items-center gap-2'}>
        {hasPrefix && <span className={cn('flex shrink-0 items-center rounded-s-lg border-e px-3', theme.border, theme.prefixSurface, theme.prefixText, size.text)}>{prefix}</span>}
        <input
          ref={ref}
          id={fieldId}
          type="text"
          readOnly
          value={value}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={[hasHelper ? helperId : undefined, describedBy].filter(Boolean).join(' ') || undefined}
          className={cn(
            'min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
            theme.surface,
            theme.value,
            size.text,
            segmented ? cn('h-10 px-3', !hasPrefix && 'rounded-s-lg') : cn('rounded-lg border', theme.border, size.field, size.padding),
          )}
        />
        {segmented ? (
          <div className="relative flex h-10 shrink-0" onMouseEnter={() => { setHovered(true); setTooltipDismissed(false) }} onMouseLeave={() => setHovered(false)}>
            <button
              type="button"
              disabled={disabled}
              aria-disabled={pending || undefined}
              aria-label="Copy to clipboard"
              onClick={() => { void copy() }}
              onFocus={() => { setFocused(true); setTooltipDismissed(false) }}
              onBlur={() => setFocused(false)}
              className={cn(actionClasses, 'relative -top-px h-10.5 w-10.5 rounded-e-lg border-s', theme.border)}
            >
              {message === SUCCESS ? <Check className="relative size-4" aria-hidden="true" /> : <ClipboardIcon className="relative size-4" aria-hidden="true" />}
            </button>
            {tooltip && (
              <span aria-hidden="true" className="absolute end-0 bottom-full z-50 pb-2">
                <span className={cn('relative block whitespace-nowrap rounded-md px-3 py-2 text-xs text-white shadow-sm', theme.tooltip)}>
                  Copy to clipboard
                  <span className={cn('absolute end-4 -bottom-1 size-2 rotate-45', theme.tooltip)} />
                </span>
              </span>
            )}
          </div>
        ) : (
          <button type="button" disabled={disabled} aria-disabled={pending || undefined} onClick={() => { void copy() }} className={cn(actionClasses, 'rounded-lg', size.action, size.text)}>
            Copy
          </button>
        )}
      </div>
      {hasHelper && <div id={helperId} className={cn('mt-2 font-medium', theme.helper, size.text)}>{helperText}</div>}
      <span role="status" className="sr-only">{message}</span>
      <p aria-hidden="true" className={cn('mt-2', size.text, size.feedback, message === FAILURE ? 'text-feedback-error' : theme.feedback)}>{message}</p>
    </div>
  )
})
