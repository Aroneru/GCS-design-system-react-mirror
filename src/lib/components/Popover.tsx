import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'

export interface PopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'popover' | 'onBeforeToggle'> {
  /** Satu elemen button-like yang meneruskan prop native ke elemen DOM fokusabel. */
  trigger: ReactElement
  /** Judul pada area header Popover. */
  title: ReactNode
  /** Preferensi posisi panel terhadap trigger. Dapat berbalik agar tetap aman di viewport. */
  side?: PopoverSide
  /** Menggunakan tampilan gelap pada panel Popover. */
  darkMode?: boolean
  /** Visibilitas terkontrol. */
  open?: boolean
  /** Visibilitas awal saat tidak dikontrol. */
  defaultOpen?: boolean
  /** Dipanggil ketika interaksi meminta perubahan visibilitas. */
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

type TriggerProps = {
  id?: string
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLElement>) => void
  'aria-controls'?: string
  'aria-disabled'?: boolean | 'true' | 'false'
  'aria-expanded'?: boolean
}

type Placement = {
  side: PopoverSide
  arrowOffset: number
  arrowSurface: 'header' | 'body'
}

type ToggleEvent = Event & { newState?: 'open' | 'closed' }

const PANEL_GAP = 8
const VIEWPORT_GUTTER = 8
const ARROW_WRAPPER_HALF = 8
const ARROW_VISUAL_HALF = (10 * Math.SQRT2) / 2
const ARROW_DIVIDER_GAP = 1
const DEFAULT_PANEL_WIDTH = 255

const oppositeSide: Record<PopoverSide, PopoverSide> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

/** Arrow berada pada tepi panel yang menghadap trigger. */
const arrowClasses: Record<PopoverSide, string> = {
  top: 'bottom-[-8px] rotate-180',
  right: 'left-[-8px] -rotate-90',
  bottom: 'top-[-8px]',
  left: 'right-[-8px] rotate-90',
}

const lightArrowSurfaceClasses: Record<Placement['arrowSurface'], string> = {
  header: 'bg-gray-50',
  body: 'bg-surface',
}

const darkArrowSurfaceClasses: Record<Placement['arrowSurface'], string> = {
  header: 'bg-gray-700',
  body: 'bg-gray-800',
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

const isDisabledTrigger = (element: HTMLElement) =>
  element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'

const isFocusableTrigger = (element: HTMLElement) =>
  !isDisabledTrigger(element) &&
  element.matches(
    'button, a[href], input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
  )

/**
 * Popover informasi non-modal yang ditambatkan pada satu trigger button-like.
 * Browser mengurus top layer, Escape, dan light dismiss melalui HTML Popover API.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    trigger,
    title,
    side = 'right',
    darkMode = false,
    open,
    defaultOpen = false,
    onOpenChange,
    className,
    children,
    id,
    ...props
  },
  forwardedRef,
) {
  const generatedPanelId = useId()
  const generatedTriggerId = useId()
  const panelId = id ?? generatedPanelId
  const triggerElement = isValidElement(trigger) ? (trigger as ReactElement<TriggerProps>) : null
  const suppliedTriggerId = triggerElement?.props.id?.trim()
  const triggerId = suppliedTriggerId || generatedTriggerId
  const controlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const desiredOpen = controlled ? open : uncontrolledOpen
  const [nativeOpen, setNativeOpen] = useState(false)
  const [positionReady, setPositionReady] = useState(false)
  const [placement, setPlacement] = useState<Placement>({
    side,
    arrowOffset: DEFAULT_PANEL_WIDTH / 2,
    arrowSurface: side === 'bottom' ? 'header' : 'body',
  })

  const panelRef = useRef<HTMLDivElement | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef(0)
  const expectedToggleRef = useRef<boolean | null>(null)
  const anchorOutsideRef = useRef(false)
  const requestOpenRef = useRef<(next: boolean) => void>(() => undefined)
  const restoreFocusRef = useRef(false)
  const desiredOpenRef = useRef(desiredOpen)
  const controlledRef = useRef(controlled)
  const onOpenChangeRef = useRef(onOpenChange)
  desiredOpenRef.current = desiredOpen
  controlledRef.current = controlled
  onOpenChangeRef.current = onOpenChange

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef],
  )

  const resolveAnchor = useCallback(() => {
    const cached = anchorRef.current
    if (cached?.isConnected) return cached
    const resolved = document.getElementById(triggerId)
    anchorRef.current = resolved
    return resolved
  }, [triggerId])

  const positionPanel = useCallback(() => {
    const panel = panelRef.current
    const anchor = resolveAnchor()
    if (!panel || !anchor?.isConnected) return

    const anchorRect = anchor.getBoundingClientRect()
    const anchorOutsideViewport =
      anchorRect.bottom <= 0 ||
      anchorRect.top >= window.innerHeight ||
      anchorRect.right <= 0 ||
      anchorRect.left >= window.innerWidth

    if (anchorOutsideViewport) {
      setPositionReady(false)
      if (!anchorOutsideRef.current) {
        anchorOutsideRef.current = true
        requestOpenRef.current(false)
      }
      return
    }

    anchorOutsideRef.current = false
    const panelWidth = panel.offsetWidth || DEFAULT_PANEL_WIDTH
    const panelHeight = panel.offsetHeight || panel.scrollHeight
    const spaces: Record<PopoverSide, number> = {
      top: anchorRect.top - VIEWPORT_GUTTER,
      right: window.innerWidth - anchorRect.right - VIEWPORT_GUTTER,
      bottom: window.innerHeight - anchorRect.bottom - VIEWPORT_GUTTER,
      left: anchorRect.left - VIEWPORT_GUTTER,
    }
    const needed = side === 'left' || side === 'right' ? panelWidth + PANEL_GAP : panelHeight + PANEL_GAP
    const opposite = oppositeSide[side]
    const resolvedSide = spaces[side] < needed && spaces[opposite] > spaces[side] ? opposite : side

    let left = anchorRect.left + (anchorRect.width - panelWidth) / 2
    let top = anchorRect.top + (anchorRect.height - panelHeight) / 2

    if (resolvedSide === 'top') top = anchorRect.top - panelHeight - PANEL_GAP
    if (resolvedSide === 'right') left = anchorRect.right + PANEL_GAP
    if (resolvedSide === 'bottom') top = anchorRect.bottom + PANEL_GAP
    if (resolvedSide === 'left') left = anchorRect.left - panelWidth - PANEL_GAP

    left = clamp(left, VIEWPORT_GUTTER, window.innerWidth - panelWidth - VIEWPORT_GUTTER)
    top = clamp(top, VIEWPORT_GUTTER, window.innerHeight - panelHeight - VIEWPORT_GUTTER)

    const horizontal = resolvedSide === 'top' || resolvedSide === 'bottom'
    const panelSurface = panel.lastElementChild as HTMLElement | null
    const headerHeight = (panelSurface?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0
    const dividerSafeOffset = headerHeight + ARROW_VISUAL_HALF + ARROW_DIVIDER_GAP
    const overlapsDividerAt = (offset: number) =>
      !horizontal &&
      headerHeight > 0 &&
      offset + ARROW_VISUAL_HALF + ARROW_DIVIDER_GAP >= headerHeight &&
      offset - ARROW_VISUAL_HALF - ARROW_DIVIDER_GAP <= headerHeight

    if (!horizontal) {
      const triggerCenter = anchorRect.top + anchorRect.height / 2
      const centeredArrowOffset = triggerCenter - top

      if (overlapsDividerAt(centeredArrowOffset)) {
        top = clamp(
          triggerCenter - dividerSafeOffset,
          VIEWPORT_GUTTER,
          window.innerHeight - panelHeight - VIEWPORT_GUTTER,
        )
      }
    }

    panel.style.left = `${left}px`
    panel.style.top = `${top}px`

    const rawArrowOffset = horizontal
      ? anchorRect.left + anchorRect.width / 2 - left
      : anchorRect.top + anchorRect.height / 2 - top
    const panelCrossSize = horizontal ? panelWidth : panelHeight
    const adjustedArrowOffset = overlapsDividerAt(rawArrowOffset)
      ? Math.max(rawArrowOffset, dividerSafeOffset)
      : rawArrowOffset
    const arrowOffset = clamp(adjustedArrowOffset, 16, panelCrossSize - 16)
    const arrowSurface =
      resolvedSide === 'bottom' ||
      (!horizontal && arrowOffset + ARROW_VISUAL_HALF <= headerHeight)
        ? 'header'
        : 'body'

    setPlacement((current) =>
      current.side === resolvedSide &&
      current.arrowOffset === arrowOffset &&
      current.arrowSurface === arrowSurface
        ? current
        : { side: resolvedSide, arrowOffset, arrowSurface },
    )
    setPositionReady(true)
  }, [resolveAnchor, side])

  const schedulePosition = useCallback(() => {
    if (frameRef.current) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      positionPanel()
    })
  }, [positionPanel])

  const requestOpen = useCallback(
    (next: boolean) => {
      if (next === desiredOpenRef.current) return
      if (next) {
        anchorOutsideRef.current = false
        setPositionReady(false)
      }
      onOpenChangeRef.current?.(next)
      if (!controlledRef.current) setUncontrolledOpen(next)
    },
    [],
  )
  requestOpenRef.current = requestOpen

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const toggle = (event: Event) => {
      const actualOpen = (event as ToggleEvent).newState === 'open'
      setNativeOpen(actualOpen)
      if (!actualOpen) setPositionReady(false)

      if (expectedToggleRef.current === actualOpen) {
        expectedToggleRef.current = null
      } else if (actualOpen !== desiredOpenRef.current) {
        onOpenChangeRef.current?.(actualOpen)
        if (!controlledRef.current) setUncontrolledOpen(actualOpen)
      }

      if (actualOpen) {
        positionPanel()
      }
    }
    const markEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && panel.contains(document.activeElement)) {
        restoreFocusRef.current = true
      }
    }

    panel.addEventListener('toggle', toggle)
    document.addEventListener('keydown', markEscape, true)
    return () => {
      panel.removeEventListener('toggle', toggle)
      document.removeEventListener('keydown', markEscape, true)
    }
  }, [positionPanel, resolveAnchor])

  useEffect(() => {
    const panel = panelRef.current
    const anchor = resolveAnchor()
    if (!panel || !anchor?.isConnected) return

    const actuallyOpen = panel.matches(':popover-open')
    if (desiredOpen && !actuallyOpen) {
      anchorOutsideRef.current = false
      expectedToggleRef.current = true
      panel.showPopover({ source: anchor })
      positionPanel()
    } else if (!desiredOpen && actuallyOpen) {
      if (panel.contains(document.activeElement)) restoreFocusRef.current = true
      expectedToggleRef.current = false
      panel.hidePopover()
    }
  }, [desiredOpen, nativeOpen, positionPanel, resolveAnchor])

  useEffect(() => {
    if (desiredOpen || nativeOpen || !restoreFocusRef.current) return
    const anchor = resolveAnchor()
    if (!anchor?.isConnected || !isFocusableTrigger(anchor)) {
      restoreFocusRef.current = false
      return
    }

    const frame = window.requestAnimationFrame(() => {
      restoreFocusRef.current = false
      if (anchor.isConnected && !panelRef.current?.matches(':popover-open')) {
        anchor.focus({ preventScroll: true })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [desiredOpen, nativeOpen, resolveAnchor])

  useEffect(() => {
    if (!nativeOpen) return
    const panel = panelRef.current
    const anchor = resolveAnchor()
    if (!panel || !anchor?.isConnected) return

    const update = () => schedulePosition()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)

    const observer = new ResizeObserver(update)
    observer.observe(anchor)
    observer.observe(panel)

    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      observer.disconnect()
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
  }, [nativeOpen, resolveAnchor, schedulePosition])

  useEffect(() => {
    if (nativeOpen) schedulePosition()
  }, [nativeOpen, schedulePosition, side, children, title])

  if (!triggerElement) return null

  const triggerControls = Array.from(
    new Set([...(triggerElement.props['aria-controls']?.split(/\s+/) ?? []), panelId]),
  )
    .filter(Boolean)
    .join(' ')
  const clonedTrigger = cloneElement(triggerElement, {
    id: triggerId,
    'aria-controls': triggerControls,
    'aria-expanded': desiredOpen,
    onClick: (event: MouseEvent<HTMLElement>) => {
      triggerElement.props.onClick?.(event)
      if (event.defaultPrevented || isDisabledTrigger(event.currentTarget)) return
      anchorRef.current = event.currentTarget
      requestOpen(!desiredOpenRef.current)
    },
  })

  const arrowSurfaceClasses = darkMode ? darkArrowSurfaceClasses : lightArrowSurfaceClasses
  const horizontalArrow = placement.side === 'top' || placement.side === 'bottom'
  const arrowStyle = horizontalArrow
    ? { left: placement.arrowOffset - ARROW_WRAPPER_HALF }
    : { top: placement.arrowOffset - ARROW_WRAPPER_HALF }

  return (
    <>
      {clonedTrigger}

      <div
        ref={setPanelRef}
        id={panelId}
        className={cn(
          'fixed inset-auto m-0 w-[255px] shrink-0 overflow-visible border-0 bg-transparent p-0 [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.08))]',
          positionReady ? 'visible' : 'invisible',
          className,
        )}
        {...props}
        popover="auto"
        onBeforeToggle={undefined}
      >
        <span
          aria-hidden="true"
          style={arrowStyle}
          className={cn(
            'pointer-events-none absolute z-30 size-4',
            arrowClasses[placement.side],
          )}
        >
          <span
            className={cn(
              'absolute top-[3.25px] left-[3px] size-2.5 rotate-45 border-t border-l',
              darkMode ? 'border-gray-800' : 'border-border',
              arrowSurfaceClasses[placement.arrowSurface],
            )}
          />
        </span>

        <div
          className={cn(
            'relative z-10 overflow-hidden rounded-md',
            darkMode ? 'bg-gray-800' : 'bg-surface',
          )}
        >
          <div
            className={cn(
              'border-b px-3 py-1.5 text-sm leading-[1.5] font-semibold [overflow-wrap:anywhere]',
              darkMode
                ? 'border-gray-800 bg-gray-700 text-gray-50'
                : 'border-border bg-gray-50 text-gray-900',
            )}
          >
            {title}
          </div>
          <div
            className={cn(
              'px-3 py-2 text-sm leading-[1.5] font-medium [overflow-wrap:anywhere]',
              darkMode ? 'bg-gray-800 text-gray-400' : 'bg-surface text-gray-500',
            )}
          >
            {children}
          </div>
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 z-20 rounded-md border',
              darkMode ? 'border-gray-800' : 'border-border',
            )}
          />
        </div>
      </div>
    </>
  )
})

Popover.displayName = 'Popover'
