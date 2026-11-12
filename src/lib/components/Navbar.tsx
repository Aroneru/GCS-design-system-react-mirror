import {
  useContext,
  useEffect,
  useId,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributeAnchorTarget,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEventHandler,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from 'react'
import { ArrowRightToBracket, Bars, Edit } from 'flowbite-react-icons/outline'
import { Bell } from 'flowbite-react-icons/solid'
import { cn } from '../utils/cn'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Drawer, type DrawerMenuItem } from './Drawer'
import { Dropdown, type DropdownItem } from './Dropdown'
import {
  DropdownDismissalContext,
  type DropdownDismissalScopeValue,
} from './dropdown/DropdownDismissalContext'
import { Sidebar, type SidebarItem } from './sidebar/Sidebar'
import { BarsFromLeft } from '../icons/outline'

export type NavbarPlatform = 'front-office' | 'back-office'

type DesktopSpacingMode = 'viewport' | 'container'

const desktopItemPadding: Record<DesktopSpacingMode, string> = {
  viewport: 'px-[clamp(6px,calc(1.07692px+0.480769vw),8px)]',
  container: 'px-[clamp(6px,calc(2.495192px+0.480769cqw),8px)]',
}

const desktopNavigationGap: Record<DesktopSpacingMode, string> = {
  viewport: 'gap-[clamp(4px,calc(-5.84615px+0.961538vw),8px)]',
  container: 'gap-[clamp(4px,calc(-3.009615px+0.961538cqw),8px)]',
}

export interface NavbarBrand {
  content: ReactNode
  href: string
  ariaLabel: string
}

interface NavbarItemBase {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export interface NavbarDestination extends NavbarItemBase {
  type: 'destination'
  href: string
  target?: HTMLAttributeAnchorTarget
  rel?: string
  current?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export interface NavbarDisclosure extends NavbarItemBase {
  type: 'disclosure'
  children: NavbarDestination[]
}

export type NavbarPrimaryItem = NavbarDestination | NavbarDisclosure

export interface NavbarAccountDestination extends NavbarDestination {
  tone?: 'default' | 'danger'
}

export interface NavbarAccountAction extends NavbarItemBase {
  type: 'action'
  tone?: 'default' | 'danger'
  onClick: MouseEventHandler<HTMLButtonElement>
}

export type NavbarAccountItem = NavbarAccountDestination | NavbarAccountAction

export interface NavbarAccount {
  name: string
  description?: string
  avatarSrc?: string
  initials?: ReactNode
  items: NavbarAccountItem[]
}

export interface NavbarGuestLink {
  label: string
  href: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export interface NavbarGuestActions {
  signIn: NavbarGuestLink
  signUp?: NavbarGuestLink
}

export interface NavbarNotificationTrigger extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  ariaLabel: string
  badge?: ReactNode
}

interface NavbarBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavbarBrand
  items?: NavbarPrimaryItem[]
  search?: ReactNode
  mobileNavigationOpen?: boolean
  onMobileNavigationOpenChange?: (open: boolean) => void
}

type FrontOfficeIdentity =
  | {
      account: NavbarAccount
      guestActions?: never
      notificationTrigger?: NavbarNotificationTrigger
    }
  | {
      account?: undefined
      guestActions?: NavbarGuestActions
      notificationTrigger?: never
    }

export type NavbarFrontOfficeProps = NavbarBaseProps &
  FrontOfficeIdentity & {
    platform: 'front-office'
    sidebarItems?: never
  }

export interface NavbarBackOfficeProps extends NavbarBaseProps {
  platform: 'back-office'
  account?: NavbarAccount
  /** Konfigurasi trigger notifikasi, independen dari account karena identitas BO dapat berada di Sidebar. */
  notificationTrigger?: NavbarNotificationTrigger
  /** Sumber navigasi Sidebar aplikasi yang digunakan Navbar pada komposisi mobile. */
  sidebarItems?: SidebarItem[]
  guestActions?: never
}

export type NavbarProps = NavbarFrontOfficeProps | NavbarBackOfficeProps

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function Brand({ brand }: { brand: NavbarBrand }) {
  return (
    <a
      href={brand.href}
      aria-label={brand.ariaLabel}
      className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      {brand.content}
    </a>
  )
}

const navbarLabelBaseClass = 'font-sans text-base leading-[1.5] font-semibold'
const primaryNavbarLabelClass = cn(navbarLabelBaseClass, 'block shrink-0 whitespace-nowrap')
const overflowNavbarLabelClass = cn(navbarLabelBaseClass, 'min-w-0 max-w-[304px] line-clamp-2 break-words')

function useTruncatedNavbarLabels<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  attribute: 'data-navbar-primary-label' | 'data-navbar-overflow-label',
  contentKey: string,
) {
  const [truncatedLabels, setTruncatedLabels] = useState<Set<string>>(() => new Set())
  const measureTruncation = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const next = new Set<string>()
    for (const label of container.querySelectorAll<HTMLElement>(`[${attribute}]`)) {
      const key = label.getAttribute(attribute)
      if (
        key &&
        label.clientWidth > 0 &&
        label.clientHeight > 0 &&
        (label.scrollHeight > label.clientHeight + 0.5 || label.scrollWidth > label.clientWidth + 0.5)
      ) next.add(key)
    }

    setTruncatedLabels((current) => {
      if (current.size === next.size && Array.from(current).every((key) => next.has(key))) return current
      return next
    })
  }, [attribute, containerRef])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const labels = Array.from(container.querySelectorAll<HTMLElement>(`[${attribute}]`))
    const observer = new ResizeObserver(measureTruncation)
    for (const label of labels) observer.observe(label)
    measureTruncation()

    let active = true
    void document.fonts.ready.then(() => {
      if (active) measureTruncation()
    })

    return () => {
      active = false
      observer.disconnect()
    }
  }, [attribute, containerRef, contentKey, measureTruncation])

  return truncatedLabels
}

function NavbarLabel({
  label,
  measurementKey,
  scope,
  truncated,
  className,
}: {
  label: string
  measurementKey: string
  scope: 'primary' | 'overflow' | 'menu'
  truncated: boolean
  className?: string
}) {
  return (
    <span
      data-navbar-primary-label={scope === 'primary' ? measurementKey : undefined}
      data-navbar-overflow-label={scope === 'overflow' ? measurementKey : undefined}
      className={cn(scope === 'primary' ? primaryNavbarLabelClass : overflowNavbarLabelClass, className)}
      title={truncated ? label : undefined}
    >
      {label}
    </span>
  )
}

function Destination({ item, spacingMode, truncated }: { item: NavbarDestination; spacingMode: DesktopSpacingMode; truncated: boolean }) {
  const rel = item.target === '_blank' ? (item.rel ?? 'noopener noreferrer') : item.rel
  const measurementKey = `primary:destination:${item.id}`

  return (
    <a
      href={item.disabled ? undefined : item.href}
      target={item.disabled ? undefined : item.target}
      rel={item.disabled ? undefined : rel}
      aria-current={item.current ? 'page' : undefined}
      aria-disabled={item.disabled || undefined}
      onClick={item.disabled ? undefined : item.onClick}
      className={cn(
        'inline-flex items-center rounded py-1.5 text-left text-content transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        desktopItemPadding[spacingMode],
        item.disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-brand-hover',
      )}
    >
      <NavbarLabel label={item.label} measurementKey={measurementKey} scope="primary" truncated={truncated} />
    </a>
  )
}

const overflowRowClass =
  'flex min-w-0 items-center rounded-md py-2 text-content transition-colors'
const overflowInteractiveClass =
  'hover:bg-dropdown-item-hover-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand'

function OverflowLabel({
  label,
  measurementKey,
  measurement,
  truncated,
}: {
  label: string
  measurementKey: string
  measurement: boolean
  truncated: boolean
}) {
  if (measurement) return <span className={cn(overflowNavbarLabelClass, 'flex-1')}>{label}</span>
  return (
    <NavbarLabel
      label={label}
      measurementKey={measurementKey}
      scope="overflow"
      truncated={truncated}
      className="flex-1"
    />
  )
}

function OverflowItemBlock({
  item,
  index,
  panelId,
  expanded,
  measurement,
  truncatedLabels,
  close,
  onToggle,
}: {
  item: NavbarPrimaryItem
  index: number
  panelId: string
  expanded: boolean
  measurement: boolean
  truncatedLabels: Set<string>
  close?: () => void
  onToggle?: (id: string) => void
}) {
  const destination = (destinationItem: NavbarDestination, measurementKey: string, nested = false) => {
    const rel = destinationItem.target === '_blank' ? (destinationItem.rel ?? 'noopener noreferrer') : destinationItem.rel
    const className = cn(
      overflowRowClass,
      nested ? 'pr-3 pl-7' : 'px-3',
      !measurement && overflowInteractiveClass,
      destinationItem.disabled && 'cursor-not-allowed opacity-50',
    )
    const content = (
      <OverflowLabel
        label={destinationItem.label}
        measurementKey={measurementKey}
        measurement={measurement}
        truncated={truncatedLabels.has(measurementKey)}
      />
    )

    if (measurement) return <div className={className}>{content}</div>
    if (destinationItem.disabled) {
      return <span aria-disabled="true" aria-label={destinationItem.label} className={className}>{content}</span>
    }

    return (
      <a
        href={destinationItem.href}
        target={destinationItem.target}
        rel={rel}
        aria-current={destinationItem.current ? 'page' : undefined}
        aria-label={destinationItem.label}
        data-baris=""
        className={className}
        onClick={(event) => {
          destinationItem.onClick?.(event)
          if (ordinaryActivation(event)) close?.()
        }}
      >
        {content}
      </a>
    )
  }

  if (item.type === 'destination') {
    return (
      <div data-navbar-overflow-item-index={index}>
        {destination(item, `destination:${item.id}`)}
      </div>
    )
  }

  const groupId = `${panelId}-group-${index}`
  return (
    <div data-navbar-overflow-item-index={index} className="min-w-0">
      {measurement ? (
        <div
          className={cn(
            'flex w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-content transition-colors',
            item.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <OverflowLabel
            label={item.label}
            measurementKey={`disclosure:${item.id}`}
            measurement
            truncated={false}
          />
          <span className={cn('shrink-0 transition-transform', expanded && 'rotate-180')}><ChevronDownIcon /></span>
        </div>
      ) : (
        <button
          type="button"
          disabled={item.disabled}
          aria-expanded={expanded}
          aria-controls={groupId}
          aria-label={item.label}
          data-baris=""
          onClick={() => onToggle?.(item.id)}
          className={cn(
            'flex w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-content transition-colors',
            overflowInteractiveClass,
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <OverflowLabel
            label={item.label}
            measurementKey={`disclosure:${item.id}`}
            measurement={false}
            truncated={truncatedLabels.has(`disclosure:${item.id}`)}
          />
          <span className={cn('shrink-0 transition-transform', expanded && 'rotate-180')}><ChevronDownIcon /></span>
        </button>
      )}
      {expanded && !item.disabled && (
        <div id={measurement ? undefined : groupId} className="grid min-w-0 border-l border-border-subtle">
          {item.children.map((child) => (
            <div key={child.id}>
              {destination(child, `child:${item.id}:${child.id}`, true)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const loadMoreClass = cn(
  'mt-1 flex w-full min-w-0 items-center justify-center rounded-md px-3 py-2 text-center text-content transition-colors',
  'hover:bg-dropdown-item-hover-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand',
)

const LOAD_MORE_BATCH_HEIGHT = 160

interface OverflowMeasurementMetrics {
  width: number
  availableHeight: number
}

function OverflowPanel({
  items,
  triggerRef,
  spacingMode,
}: {
  items: NavbarPrimaryItem[]
  triggerRef: RefObject<HTMLButtonElement | null>
  spacingMode: DesktopSpacingMode
}) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const measurementFrameRef = useRef(0)
  const focusFrameRef = useRef(0)
  const restoreFocusRef = useRef(false)
  const typeaheadRef = useRef({ text: '', time: 0 })
  const heldSpaceRef = useRef(false)
  const pendingScrollRef = useRef<{ scrollTop: number } | null>(null)
  const dismissalScope = useContext(DropdownDismissalContext)
  const [parentOpen, setParentOpen] = useState(false)
  const [visibleItemCount, setVisibleItemCount] = useState(() => Math.min(1, items.length))
  const [capacityReady, setCapacityReady] = useState(false)
  const [focusTransferIndex, setFocusTransferIndex] = useState<number | null>(null)
  const [measurementMetrics, setMeasurementMetrics] = useState<OverflowMeasurementMetrics | null>(null)
  const [fontMeasurementRevision, setFontMeasurementRevision] = useState(0)
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(items.flatMap((item) => item.type === 'disclosure' && item.children.some((child) => child.current) ? [item.id] : [])),
  )
  const labelKey = items.map((item) => item.type === 'destination'
    ? `destination:${item.id}:${item.label}`
    : `disclosure:${item.id}:${item.label}:${item.children.map((child) => `${child.id}:${child.label}`).join(',')}`
  ).join('|')
  const expandedKey = Array.from(expanded).sort().join('|')
  const currentVisibleCount = Math.min(visibleItemCount, items.length)
  const truncatedLabels = useTruncatedNavbarLabels(contentRef, 'data-navbar-overflow-label', `${labelKey}|${expandedKey}|${currentVisibleCount}`)

  const positionPanel = useCallback(() => {
    const panel = panelRef.current
    const trigger = triggerRef.current
    const content = contentRef.current
    if (!panel || !trigger?.isConnected || !content) return

    const gutter = 4
    const gap = 4
    const triggerRect = trigger.getBoundingClientRect()
    const safeWidth = Math.max(0, window.innerWidth - gutter * 2)
    panel.style.maxWidth = `${safeWidth}px`

    const panelWidth = panel.offsetWidth || Math.min(304, safeWidth)
    panel.style.left = `${Math.max(gutter, Math.min(triggerRect.right - panelWidth, window.innerWidth - panelWidth - gutter))}px`

    const spaceBelow = Math.max(0, window.innerHeight - gutter - (triggerRect.bottom + gap))
    const spaceAbove = Math.max(0, triggerRect.top - gutter - gap)
    const naturalHeight = Math.max(panel.scrollHeight, panel.offsetHeight)
    const opensAbove = naturalHeight > spaceBelow && spaceAbove > spaceBelow
    const selectedSpace = opensAbove ? spaceAbove : spaceBelow
    panel.style.maxHeight = `${selectedSpace}px`
    const panelHeight = panel.offsetHeight
    panel.style.top = opensAbove
      ? `${Math.max(gutter, triggerRect.top - gap - panelHeight)}px`
      : `${triggerRect.bottom + gap}px`

    const panelStyle = window.getComputedStyle(panel)
    const padding = Number.parseFloat(panelStyle.paddingTop) + Number.parseFloat(panelStyle.paddingBottom)
    const next = {
      width: content.clientWidth,
      availableHeight: Math.max(0, selectedSpace - padding),
    }
    if (next.width <= 0 || next.availableHeight <= 0) return
    setMeasurementMetrics((current) => (
      current && Math.abs(current.width - next.width) < 0.5 && Math.abs(current.availableHeight - next.availableHeight) < 0.5
        ? current
        : next
    ))
  }, [triggerRef])

  const scheduleMeasurement = useCallback(() => {
    if (measurementFrameRef.current) return
    measurementFrameRef.current = window.requestAnimationFrame(() => {
      measurementFrameRef.current = 0
      positionPanel()
    })
  }, [positionPanel])

  const close = useCallback(() => {
    const panel = panelRef.current
    if (panel?.isConnected && panel.matches(':popover-open')) panel.hidePopover()
  }, [])

  useEffect(() => dismissalScope?.register(close), [close, dismissalScope])

  const handleTypeahead = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
    const typing = typeaheadRef.current.text !== '' && Date.now() - typeaheadRef.current.time < 1000
    if (event.key === ' ' && !typing) return

    event.preventDefault()
    if (event.key === ' ') heldSpaceRef.current = true
    const normalized = (typing ? typeaheadRef.current.text : '') + event.key
    const query = normalized
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()
    typeaheadRef.current = { text: query, time: Date.now() }

    const rows = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[data-baris]:not([aria-disabled="true"]):not(:disabled)',
      ) ?? [],
    )
    const current = rows.indexOf(document.activeElement as HTMLElement)
    const repeated = [...query].every((character) => character === query[0])
    const needle = repeated ? query[0] : query
    const start = repeated ? current + 1 : Math.max(current, 0)
    const ordered = [...rows.slice(start), ...rows.slice(0, start)]
    const match = ordered.find((row) => {
      const label = (row.textContent ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
      return label.startsWith(needle) || label.split(/[\s/(),.-]/).some((word) => word.startsWith(needle))
    })
    match?.focus()
  }

  const releaseHeldSpace = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' || !heldSpaceRef.current) return
    event.preventDefault()
    heldSpaceRef.current = false
  }

  const measuredHeights = useCallback(() => {
    const measurement = measurementRef.current
    if (!measurement) return null
    const rows = Array.from(measurement.querySelectorAll<HTMLElement>('[data-navbar-overflow-measure-item]'))
    const button = measurement.querySelector<HTMLElement>('[data-navbar-overflow-measure-more]')
    if (rows.length !== items.length || !button) return null
    const outerHeight = (element: HTMLElement) => {
      const style = window.getComputedStyle(element)
      return element.getBoundingClientRect().height
        + Number.parseFloat(style.marginTop || '0')
        + Number.parseFloat(style.marginBottom || '0')
    }
    return {
      rows: rows.map(outerHeight),
      button: outerHeight(button),
    }
  }, [items.length])

  const initialVisibleCount = useCallback((availableHeight: number) => {
    const heights = measuredHeights()
    if (!heights || items.length === 0) return 0
    let targetHeight = 0
    let targetCount = 0
    while (targetCount < heights.rows.length) {
      targetHeight += heights.rows[targetCount]
      targetCount += 1
      if (targetHeight >= LOAD_MORE_BATCH_HEIGHT - 0.5) break
    }
    if (targetCount === heights.rows.length && targetHeight <= availableHeight + 0.5) return targetCount

    const budget = Math.max(0, availableHeight - heights.button)
    let used = 0
    let count = 0
    while (count < heights.rows.length) {
      const nextHeight = heights.rows[count]
      if (count > 0 && used + nextHeight > budget + 0.5) break
      used += nextHeight
      count += 1
      if (used >= LOAD_MORE_BATCH_HEIGHT - 0.5) break
    }
    return Math.max(1, count)
  }, [items.length, measuredHeights])

  const nextVisibleCount = useCallback((current: number) => {
    const heights = measuredHeights()
    if (!heights || current >= items.length) return current

    let used = 0
    let next = current
    while (next < heights.rows.length) {
      used += heights.rows[next]
      next += 1
      if (used >= LOAD_MORE_BATCH_HEIGHT - 0.5) break
    }
    return Math.max(current + 1, next)
  }, [items.length, measuredHeights])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const handleBeforeToggle = (event: Event) => {
      const newState = (event as Event & { newState?: string }).newState
      if (newState === 'open') {
        panel.style.visibility = 'hidden'
        positionPanel()
      } else if (newState === 'closed') {
        restoreFocusRef.current = panel.contains(document.activeElement)
      }
    }

    const handleParentToggle = (event: Event) => {
      const newState = (event as Event & { newState?: string }).newState
      if (newState === 'open') {
        setParentOpen(true)
        setCapacityReady(false)
        positionPanel()
        return
      }
      if (newState !== 'closed') return

      setParentOpen(false)
      setCapacityReady(false)
      setMeasurementMetrics(null)
      setVisibleItemCount(Math.min(1, items.length))
      setFocusTransferIndex(null)
      setExpanded((current) => current.size === 0 ? current : new Set())
      typeaheadRef.current = { text: '', time: 0 }
      heldSpaceRef.current = false
      pendingScrollRef.current = null
      if (measurementFrameRef.current) {
        window.cancelAnimationFrame(measurementFrameRef.current)
        measurementFrameRef.current = 0
      }
      if (focusFrameRef.current) {
        window.cancelAnimationFrame(focusFrameRef.current)
        focusFrameRef.current = 0
      }
      if (
        restoreFocusRef.current &&
        triggerRef.current?.isConnected &&
        triggerRef.current.getClientRects().length > 0
      ) {
        restoreFocusRef.current = false
        triggerRef.current.focus({ preventScroll: true })
      }
      restoreFocusRef.current = false
    }

    panel.addEventListener('beforetoggle', handleBeforeToggle)
    panel.addEventListener('toggle', handleParentToggle)
    return () => {
      panel.removeEventListener('beforetoggle', handleBeforeToggle)
      panel.removeEventListener('toggle', handleParentToggle)
      if (measurementFrameRef.current) {
        window.cancelAnimationFrame(measurementFrameRef.current)
        measurementFrameRef.current = 0
      }
      if (focusFrameRef.current) {
        window.cancelAnimationFrame(focusFrameRef.current)
        focusFrameRef.current = 0
      }
    }
  }, [items.length, positionPanel, triggerRef])

  useEffect(() => {
    if (!parentOpen) return
    const panel = panelRef.current
    if (!panel) return

    const observer = new ResizeObserver(scheduleMeasurement)
    observer.observe(panel)
    if (triggerRef.current) observer.observe(triggerRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    const handleScroll = () => positionPanel()
    window.addEventListener('resize', scheduleMeasurement)
    window.addEventListener('scroll', handleScroll, true)
    let active = true
    void document.fonts.ready.then(() => {
      if (!active) return
      setFontMeasurementRevision((revision) => revision + 1)
      scheduleMeasurement()
    })

    return () => {
      active = false
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasurement)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [parentOpen, positionPanel, scheduleMeasurement, triggerRef])

  useEffect(() => {
    if (!parentOpen || !measurementMetrics) return
    const frame = window.requestAnimationFrame(() => {
      const calculated = initialVisibleCount(measurementMetrics.availableHeight)
      setVisibleItemCount((current) => Math.min(items.length, Math.max(current, calculated)))
      setCapacityReady(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [expandedKey, fontMeasurementRevision, initialVisibleCount, items.length, labelKey, measurementMetrics, parentOpen])

  useLayoutEffect(() => {
    if (!parentOpen || !capacityReady) return
    const panel = panelRef.current
    if (panel) panel.style.visibility = 'visible'
  }, [capacityReady, parentOpen])

  useLayoutEffect(() => {
    const pending = pendingScrollRef.current
    if (!pending) return
    pendingScrollRef.current = null
    const panel = panelRef.current
    if (!panel) return
    panel.scrollTop = pending.scrollTop
  }, [visibleItemCount])

  useEffect(() => {
    if (focusTransferIndex === null || visibleItemCount < items.length) return
    const panel = panelRef.current
    if (!panel) return
    const scrollTop = panel.scrollTop
    focusFrameRef.current = window.requestAnimationFrame(() => {
      setFocusTransferIndex(null)
      focusFrameRef.current = window.requestAnimationFrame(() => {
        focusFrameRef.current = window.requestAnimationFrame(() => {
          focusFrameRef.current = 0
          const firstNewItem = Array.from(
            contentRef.current?.querySelectorAll<HTMLElement>('[data-navbar-overflow-item-index] [data-baris]') ?? [],
          ).find((candidate) => {
            const item = candidate.closest<HTMLElement>('[data-navbar-overflow-item-index]')
            return Number(item?.dataset.navbarOverflowItemIndex) >= focusTransferIndex && !candidate.matches(':disabled, [aria-disabled="true"]')
          })
          const focusTarget = firstNewItem ?? triggerRef.current
          focusTarget?.focus({ preventScroll: true })
          panel.scrollTop = scrollTop
        })
      })
    })
  }, [focusTransferIndex, items.length, triggerRef, visibleItemCount])

  const toggleDisclosure = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const loadMore = (event: MouseEvent<HTMLButtonElement>) => {
    const panel = panelRef.current
    if (!panel) return
    const currentVisibleCount = Math.min(visibleItemCount, items.length)
    const next = Math.min(items.length, nextVisibleCount(currentVisibleCount))
    if (next <= currentVisibleCount) return

    pendingScrollRef.current = {
      scrollTop: panel.scrollTop,
    }
    if (document.activeElement === event.currentTarget && next >= items.length) {
      setFocusTransferIndex(currentVisibleCount)
    }
    setVisibleItemCount(next)
  }

  const visibleItems = items.slice(0, currentVisibleCount)
  const hasMoreItems = currentVisibleCount < items.length

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={panelId}
        popoverTargetAction="toggle"
        aria-controls={panelId}
        aria-expanded={parentOpen}
        onKeyDown={(event) => {
          if (parentOpen) handleTypeahead(event)
        }}
        onKeyUp={releaseHeldSpace}
        className={cn(
          'inline-flex items-center gap-1 whitespace-nowrap rounded py-1.5 font-sans text-base leading-[1.5] font-semibold text-content transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          desktopItemPadding[spacingMode],
        )}
      >
        Lainnya
        <ChevronDownIcon />
      </button>
      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        aria-label="Navigasi lainnya"
        onKeyDown={handleTypeahead}
        onKeyUp={releaseHeldSpace}
        className="fixed inset-auto m-0 w-[min(clamp(240px,21vw,304px),calc(100vw-48px))] overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg bg-dropdown-surface p-2 text-dropdown-content shadow-dropdown [overflow-wrap:anywhere]"
      >
        <div
          ref={contentRef}
          role="region"
          className={cn('w-full min-w-0', !capacityReady && 'invisible')}
        >
          {visibleItems.map((item, index) => (
            <OverflowItemBlock
              key={item.id}
              item={item}
              index={index}
              panelId={panelId}
              expanded={item.type === 'disclosure' && expanded.has(item.id)}
              measurement={false}
              truncatedLabels={truncatedLabels}
              close={close}
              onToggle={toggleDisclosure}
            />
          ))}
          {(hasMoreItems || focusTransferIndex !== null) && (
            <button
              type="button"
              className={loadMoreClass}
              disabled={!hasMoreItems}
              onClick={loadMore}
            >
              <span className={overflowNavbarLabelClass}>Muat lebih banyak</span>
            </button>
          )}
        </div>
      </div>
      {measurementMetrics && (
        <div
          ref={measurementRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 invisible min-w-0"
          style={{ width: `${measurementMetrics.width}px` }}
        >
          {items.map((item, index) => (
            <div key={item.id} data-navbar-overflow-measure-item="">
              <OverflowItemBlock
                item={item}
                index={index}
                panelId={`${panelId}-measurement`}
                expanded={index < currentVisibleCount && item.type === 'disclosure' && expanded.has(item.id)}
                measurement
                truncatedLabels={new Set()}
              />
            </div>
          ))}
          <div data-navbar-overflow-measure-more="" className={loadMoreClass}>
            <span className={overflowNavbarLabelClass}>Muat lebih banyak</span>
          </div>
        </div>
      )}
    </>
  )
}

function MeasurementItem({
  item,
  spacingMode,
}: {
  item: NavbarPrimaryItem
  spacingMode: DesktopSpacingMode
}) {
  const padding = desktopItemPadding[spacingMode]

  if (item.type === 'destination') {
    return (
      <span className={cn('inline-flex items-center py-1.5', padding)}>
        <span className={primaryNavbarLabelClass}>{item.label}</span>
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 py-1.5', padding)}>
      <span className={primaryNavbarLabelClass}>{item.label}</span>
      <ChevronDownIcon />
    </span>
  )
}

interface NavigationAllocation {
  key: string
  visibleCount: number
  impossible: boolean
  ready: boolean
  measurementFailed: boolean
}

function CapacityAwareDesktopNavigation({
  items,
  row,
  platform,
  compositionKey,
}: {
  items: NavbarPrimaryItem[]
  row: HTMLDivElement | null
  platform: NavbarPlatform
  compositionKey: string
}) {
  const measurementRef = useRef<HTMLUListElement>(null)
  const navigationRef = useRef<HTMLElement>(null)
  const overflowTriggerRef = useRef<HTMLButtonElement>(null)
  const focusAfterAllocationRef = useRef<{ type: 'overflow' | 'item'; index?: number } | null>(null)
  const spacingMode: DesktopSpacingMode = platform === 'front-office' ? 'viewport' : 'container'
  const allocationKey = `${platform}|${compositionKey}|${items.map((item) => `${item.id}:${item.type}:${item.label}`).join('|')}`
  const [allocation, setAllocation] = useState<NavigationAllocation>({
    key: allocationKey,
    visibleCount: items.length,
    impossible: false,
    ready: false,
    measurementFailed: false,
  })
  const validAllocation = allocation.key === allocationKey && allocation.ready
  const visibleCount = validAllocation ? Math.min(allocation.visibleCount, items.length) : items.length
  const overflowedItems = items.slice(visibleCount)
  const primaryLabelKey = items.slice(0, visibleCount).map((item) => item.type === 'destination'
    ? `${item.id}:${item.label}`
    : `${item.id}:${item.label}:${item.children.map((child) => `${child.id}:${child.label}`).join(',')}`
  ).join('|')
  const truncatedLabels = useTruncatedNavbarLabels(navigationRef, 'data-navbar-primary-label', primaryLabelKey)

  useLayoutEffect(() => {
    const measurement = measurementRef.current
    if (!row || !measurement) return

    let frame = 0
    const measure = () => {
      const header = row.closest('header')
      const brand = row.querySelector<HTMLElement>(':scope > a')
      const search = row.querySelector<HTMLElement>(':scope > [data-navbar-search]')
      const identity = row.querySelector<HTMLElement>(':scope > [data-navbar-identity]')
      const measuredItems = Array.from(measurement.querySelectorAll<HTMLElement>(':scope > li[data-navbar-measure-item]'))
      const trigger = measurement.querySelector<HTMLElement>(':scope > li[data-navbar-measure-overflow]')
      if (
        !header ||
        (platform === 'front-office' && !brand) ||
        measuredItems.length !== items.length ||
        !trigger
      ) {
        setAllocation((current) => current.key === allocationKey && current.measurementFailed
          ? current
          : {
              key: allocationKey,
              visibleCount: items.length,
              impossible: false,
              ready: false,
              measurementFailed: true,
            })
        return
      }

      const computedRow = window.getComputedStyle(row)
      const computedList = window.getComputedStyle(measurement)
      const rowRect = row.getBoundingClientRect()
      const parsedMaximum = Number.parseFloat(computedRow.maxWidth)
      const maximumRowWidth = platform === 'front-office'
        ? window.matchMedia('(min-width: 1280px)').matches && Number.isFinite(parsedMaximum)
          ? Math.max(rowRect.width, Math.min(parsedMaximum, header.clientWidth))
          : rowRect.width
        : Math.max(
            0,
            rowRect.width
              - (Number.parseFloat(computedRow.paddingLeft) || 0)
              - (Number.parseFloat(computedRow.paddingRight) || 0),
          )
      const majorGap = Number.parseFloat(computedRow.columnGap) || 0
      const navigationGap = Number.parseFloat(computedList.columnGap) || 0
      const fixedGroupCount = 1 + (brand ? 1 : 0) + (search ? 1 : 0) + (identity ? 1 : 0)
      const fixedWidth = (brand?.getBoundingClientRect().width ?? 0)
        + (search?.getBoundingClientRect().width ?? 0)
        + (identity?.getBoundingClientRect().width ?? 0)
        + majorGap * Math.max(0, fixedGroupCount - 1)
      const navigationBudget = Math.max(0, maximumRowWidth - fixedWidth)
      const itemWidths = measuredItems.map((element) => element.getBoundingClientRect().width)
      const triggerWidth = trigger.getBoundingClientRect().width
      const allItemsWidth = itemWidths.reduce((total, width) => total + width, 0)
        + navigationGap * Math.max(0, itemWidths.length - 1)

      let nextVisibleCount = items.length
      const impossible = navigationBudget + 0.5 < triggerWidth
      if (allItemsWidth > navigationBudget + 0.5) {
        nextVisibleCount = 0
        let occupied = triggerWidth
        for (const itemWidth of itemWidths) {
          const nextOccupied = occupied + navigationGap + itemWidth
          if (nextOccupied > navigationBudget + 0.5) break
          occupied = nextOccupied
          nextVisibleCount += 1
        }
      }

      if (validAllocation && nextVisibleCount !== visibleCount) {
        const activeElement = document.activeElement
        const focusedItem = activeElement instanceof Element
          ? activeElement.closest<HTMLElement>('[data-navbar-visible-index], [data-navbar-overflow]')
          : null
        const focusedIndex = Number(focusedItem?.dataset.navbarVisibleIndex)
        if (focusedItem?.dataset.navbarOverflow !== undefined) {
          focusAfterAllocationRef.current = nextVisibleCount < items.length
            ? { type: 'overflow' }
            : { type: 'item', index: visibleCount }
        } else if (Number.isFinite(focusedIndex) && focusedIndex >= nextVisibleCount) {
          focusAfterAllocationRef.current = { type: 'overflow' }
        }
      }

      setAllocation((current) => {
        if (
          current.key === allocationKey &&
          current.ready &&
          current.visibleCount === nextVisibleCount &&
          current.impossible === impossible &&
          !current.measurementFailed
        ) return current
        return {
          key: allocationKey,
          visibleCount: nextVisibleCount,
          impossible,
          ready: true,
          measurementFailed: false,
        }
      })
    }
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }

    measure()
    const observer = new ResizeObserver(schedule)
    observer.observe(row)
    observer.observe(measurement)
    for (const child of Array.from(row.children)) observer.observe(child)
    for (const item of Array.from(measurement.children)) observer.observe(item)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [allocationKey, items.length, platform, row, validAllocation, visibleCount])

  useEffect(() => {
    const request = focusAfterAllocationRef.current
    if (!request || !validAllocation) return
    if (request.type === 'overflow') {
      overflowTriggerRef.current?.focus({ preventScroll: true })
    } else {
      const item = row?.querySelector<HTMLElement>(`[data-navbar-visible-index="${request.index}"] a, [data-navbar-visible-index="${request.index}"] button`)
      item?.focus({ preventScroll: true })
    }
    focusAfterAllocationRef.current = null
  }, [row, validAllocation, visibleCount])

  if (!items.length) return null

  return (
    <nav
      ref={navigationRef}
      aria-label="Navigasi utama"
      data-navbar-capacity={validAllocation
        ? allocation.impossible ? 'impossible' : 'ready'
        : allocation.key === allocationKey && allocation.measurementFailed
          ? 'measurement-error'
          : 'measuring'}
      className={cn('relative ml-auto min-w-max flex-none', !validAllocation && 'invisible')}
    >
      <ul
        className={cn('flex items-center justify-end', desktopNavigationGap[spacingMode])}
      >
        {items.slice(0, visibleCount).map((item, index) => {
          return (
            <li key={item.id} data-navbar-visible-index={index}>
              {item.type === 'destination' ? (
                <Destination item={item} spacingMode={spacingMode} truncated={truncatedLabels.has(`primary:destination:${item.id}`)} />
              ) : (
                <Dropdown
                  align="center"
                  closeOnSelect
                  contentClassName="w-max max-w-[min(304px,calc(100vw-48px))]!"
                  trigger={
                    <button
                      type="button"
                      disabled={item.disabled}
                      className={cn(
                        'inline-flex items-center gap-1 rounded py-1.5 text-left text-content transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50',
                        desktopItemPadding[spacingMode],
                      )}
                    >
                      <NavbarLabel label={item.label} measurementKey={`primary:disclosure:${item.id}`} scope="primary" truncated={truncatedLabels.has(`primary:disclosure:${item.id}`)} />
                      <ChevronDownIcon />
                    </button>
                  }
                  items={item.children.map((child) => {
                    const measurementKey = `primary:child:${item.id}:${child.id}`
                    return toDropdownDestination(child, <NavbarLabel label={child.label} measurementKey={measurementKey} scope="menu" truncated={truncatedLabels.has(measurementKey)} />)
                  })}
                />
              )}
            </li>
          )
        })}
        {validAllocation && overflowedItems.length > 0 && (
          <li data-navbar-overflow=""><OverflowPanel items={overflowedItems} triggerRef={overflowTriggerRef} spacingMode={spacingMode} /></li>
        )}
      </ul>
      <ul
        ref={measurementRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none invisible absolute top-0 left-0 flex w-max items-center',
          desktopNavigationGap[spacingMode],
        )}
      >
        {items.map((item) => <li key={item.id} data-navbar-measure-item=""><MeasurementItem item={item} spacingMode={spacingMode} /></li>)}
        <li data-navbar-measure-overflow=""><MeasurementItem item={{ id: 'navbar-overflow-measure', type: 'disclosure', label: 'Lainnya', children: [] }} spacingMode={spacingMode} /></li>
      </ul>
      {validAllocation && allocation.impossible && (
        <span role="status" className="sr-only">Kapasitas Navbar tidak cukup untuk menampilkan pemicu navigasi lainnya tanpa tumpang tindih.</span>
      )}
    </nav>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="size-3.5 shrink-0 self-center text-[light-dark(currentColor,var(--color-gray-200))]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
    </svg>
  )
}

function toDropdownDestination(item: NavbarDestination, label: ReactNode = item.label): DropdownItem {
  return {
    id: item.id,
    label,
    icon: item.icon,
    href: item.href,
    target: item.target,
    rel: item.rel,
    current: item.current,
    disabled: item.disabled,
    onClick: item.onClick
      ? (event) => item.onClick?.(event as Parameters<NonNullable<typeof item.onClick>>[0])
      : undefined,
  }
}

function AccountIdentity({
  account,
  decorative = false,
  constrainName = false,
}: {
  account: NavbarAccount
  decorative?: boolean
  constrainName?: boolean
}) {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <Avatar
        src={account.avatarSrc}
        alt={decorative ? '' : account.name}
        initials={account.initials}
        size="default"
      />
      <span className={cn('hidden min-w-0 xl:block', constrainName && 'xl:max-w-[160px]')}>
        <span className="block truncate font-sans text-sm leading-[1.5] font-medium text-[light-dark(var(--color-content),var(--color-gray-200))]">{account.name}</span>
        {account.description && (
          <span className="block truncate text-xs text-content-subtle">{account.description}</span>
        )}
      </span>
    </span>
  )
}

function toDropdownAccountItem(item: NavbarAccountItem): DropdownItem {
  if (item.type === 'destination') {
    return {
      ...toDropdownDestination(item),
      tone: item.tone,
    }
  }

  return {
    id: item.id,
    label: item.label,
    icon: item.icon,
    tone: item.tone,
    disabled: item.disabled,
    onClick: (event) =>
      item.onClick(event as Parameters<NavbarAccountAction['onClick']>[0]),
  }
}

function AccountMenu({ account, constrainName = false }: { account: NavbarAccount; constrainName?: boolean }) {
  if (!account.items.length) return <AccountIdentity account={account} constrainName={constrainName} />

  return (
    <Dropdown
      align="end"
      closeOnSelect
      trigger={
        <button
          type="button"
          aria-label={`Buka menu akun ${account.name}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg p-1 text-left hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <AccountIdentity account={account} decorative constrainName={constrainName} />
          <ChevronDownIcon />
        </button>
      }
      items={account.items.map(toDropdownAccountItem)}
    />
  )
}

function NotificationTrigger({ ariaLabel, badge, className, type = 'button', ...buttonProps }: NavbarNotificationTrigger) {
  return (
    <button
      {...buttonProps}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        'relative grid size-10 shrink-0 place-items-center rounded-lg text-gray-800 transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand in-data-[theme=dark]:text-gray-400',
        className,
      )}
    >
      <Bell className="size-6" aria-hidden="true" />
      {badge != null && (
        <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-feedback-error px-1 text-center text-[10px] leading-4 text-white">
          {badge}
        </span>
      )}
    </button>
  )
}

function ordinaryActivation(event: MouseEvent<HTMLElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  )
}

function toSidebarItem(item: NavbarPrimaryItem, close: () => void): SidebarItem {
  if (item.type === 'destination') {
    return {
      id: item.id,
      label: item.label,
      href: item.href,
      external: !item.disabled && item.target === '_blank',
      icon: item.icon,
      active: item.current,
      disabled: item.disabled,
      onClick: (event) => {
        item.onClick?.(event)
        if (ordinaryActivation(event)) close()
      },
    }
  }

  return {
    id: item.id,
    label: item.label,
    icon: item.icon,
    active: item.children.some((child) => child.current === true),
    disabled: item.disabled,
    defaultOpen: item.children.some((child) => child.current),
    children: item.children.map((child) => ({
      id: child.id,
      label: child.label,
      href: child.href,
      external: !child.disabled && child.target === '_blank',
      icon: child.icon,
      active: child.current,
      disabled: child.disabled,
      onClick: (event) => {
        child.onClick?.(event)
        if (ordinaryActivation(event)) close()
      },
    })),
  }
}

function toMobileSidebarItem(item: SidebarItem, close: () => void): SidebarItem {
  return {
    ...item,
    onClick: (event) => {
      item.onClick?.(event)
      if (ordinaryActivation(event)) close()
    },
    children: item.children?.map((child) => ({
      ...child,
      onClick: (event) => {
        child.onClick?.(event)
        if (ordinaryActivation(event)) close()
      },
    })),
  }
}

function callAnchorClick(
  handler: MouseEventHandler<HTMLAnchorElement> | undefined,
  event: MouseEvent<HTMLElement>,
) {
  if (!(event.currentTarget instanceof HTMLAnchorElement)) return
  handler?.(event as MouseEvent<HTMLAnchorElement>)
}

function toMobileDrawerItem(item: NavbarPrimaryItem, close: () => void): DrawerMenuItem {
  if (item.type === 'destination') {
    return {
      id: item.id,
      label: item.label,
      icon: item.icon,
      href: item.disabled ? undefined : item.href,
      target: item.disabled ? undefined : item.target,
      rel: item.disabled ? undefined : (item.target === '_blank' ? (item.rel ?? 'noopener noreferrer') : item.rel),
      active: item.current,
      disabled: item.disabled,
      onClick: (event) => {
        callAnchorClick(item.onClick, event)
        if (ordinaryActivation(event)) close()
      },
    }
  }

  return {
    id: item.id,
    label: item.label,
    icon: item.icon,
    active: item.children.some((child) => child.current),
    disabled: item.disabled,
    defaultExpanded: item.children.some((child) => child.current),
    children: item.children.map((child) => ({
      id: child.id,
      label: child.label,
      href: child.disabled ? undefined : child.href,
      target: child.disabled ? undefined : child.target,
      rel: child.disabled ? undefined : (child.target === '_blank' ? (child.rel ?? 'noopener noreferrer') : child.rel),
      active: child.current,
      disabled: child.disabled,
      onClick: (event) => {
        callAnchorClick(child.onClick, event)
        if (ordinaryActivation(event)) close()
      },
    })),
  }
}

function MobileIdentity({
  platform,
  account,
  guestActions,
  close,
}: Pick<NavbarProps, 'platform' | 'account' | 'guestActions'> & { close: () => void }) {
  if (account) {
    return (
      <div className="space-y-1 p-3">
        <div className="flex items-center gap-2 px-3 py-2">
          <Avatar src={account.avatarSrc} alt="" initials={account.initials} size="default" />
          <span className="min-w-0">
            <span className="block truncate font-sans text-sm leading-[1.5] font-medium text-content">{account.name}</span>
            {account.description && (
              <span className="block truncate text-xs text-content-subtle">{account.description}</span>
            )}
          </span>
        </div>
        {account.items.map((item) =>
          item.type === 'destination' ? (
            <a
              key={item.id}
              href={item.disabled ? undefined : item.href}
              target={item.disabled ? undefined : item.target}
              rel={item.disabled ? undefined : item.target === '_blank' ? (item.rel ?? 'noopener noreferrer') : item.rel}
              aria-current={item.current ? 'page' : undefined}
              aria-disabled={item.disabled || undefined}
              onClick={
                item.disabled
                  ? undefined
                  : (event) => {
                      item.onClick?.(event)
                      if (ordinaryActivation(event)) close()
                    }
              }
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-content hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-brand',
                item.tone === 'danger' &&
                  'text-feedback-error hover:text-feedback-error focus-visible:bg-surface-subtle active:bg-surface-subtle',
                item.disabled && 'pointer-events-none opacity-50',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ) : (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={(event) => {
                item.onClick(event)
                close()
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-content hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50',
                item.tone === 'danger' &&
                  'text-feedback-error hover:text-feedback-error focus-visible:bg-surface-subtle active:bg-surface-subtle',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ),
        )}
      </div>
    )
  }

  if (platform !== 'front-office' || !guestActions) return null

  return (
    <div className="grid gap-2 p-4">
      <Button
        as="anchor"
        href={guestActions.signIn.href}
        onClick={(event) => {
          guestActions.signIn.onClick?.(event)
          if (ordinaryActivation(event)) close()
        }}
        variant="outline"
        className="in-data-[theme=dark]:[--color-primary-700:var(--color-gray-200)] in-data-[theme=dark]:[--color-primary-50:var(--color-gray-600)]"
        leftIcon={<ArrowRightToBracket aria-hidden="true" />}
      >
        {guestActions.signIn.label}
      </Button>
      {guestActions.signUp && (
        <Button
          as="anchor"
          href={guestActions.signUp.href}
          onClick={(event) => {
            guestActions.signUp?.onClick?.(event)
            if (ordinaryActivation(event)) close()
          }}
          leftIcon={<Edit aria-hidden="true" />}
        >
          {guestActions.signUp.label}
        </Button>
      )}
    </div>
  )
}

function DesktopIdentity({
  platform,
  account,
  notificationTrigger,
  guestActions,
}: Pick<NavbarProps, 'platform' | 'account' | 'notificationTrigger' | 'guestActions'>) {
  if (account || notificationTrigger) {
    return (
      <div data-navbar-identity="" className="flex shrink-0 items-center gap-3">
        {notificationTrigger && <NotificationTrigger {...notificationTrigger} />}
        {account && <AccountMenu account={account} constrainName />}
      </div>
    )
  }

  if (platform !== 'front-office' || !guestActions) return null

  return (
    <div data-navbar-identity="" className="flex shrink-0 items-center gap-[clamp(8px,calc(-51.0769px+5.76923vw),32px)]">
      <Button
        as="anchor"
        href={guestActions.signIn.href}
        onClick={guestActions.signIn.onClick}
        variant="outline"
        className="in-data-[theme=dark]:[--color-primary-700:var(--color-gray-200)] in-data-[theme=dark]:[--color-primary-50:var(--color-gray-600)]"
        size="base"
        leftIcon={<ArrowRightToBracket aria-hidden="true" />}
      >
        {guestActions.signIn.label}
      </Button>
      {guestActions.signUp && (
        <Button
          as="anchor"
          href={guestActions.signUp.href}
          onClick={guestActions.signUp.onClick}
          size="base"
          leftIcon={<Edit aria-hidden="true" />}
        >
          {guestActions.signUp.label}
        </Button>
      )}
    </div>
  )
}

export function Navbar(props: NavbarProps) {
  const {
    brand,
    items = [],
    search,
    mobileNavigationOpen,
    onMobileNavigationOpenChange,
    className,
    style,
    platform,
    account,
    guestActions,
    notificationTrigger,
    sidebarItems,
    ...headerProps
  } = props
  const dialogId = useId()
  const internalDrawerId = useId()
  const [desktopRow, setDesktopRow] = useState<HTMLDivElement | null>(null)
  const desktopRowRef = useCallback((node: HTMLDivElement | null) => {
    setDesktopRow(node)
  }, [])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dropdownClosersRef = useRef(new Set<() => void>())
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileCloseRef = useRef<HTMLButtonElement>(null)
  const wasMobileOpenRef = useRef(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false)
  const mobileOpen = mobileNavigationOpen ?? internalMobileOpen
  const drawerOpen = internalDrawerOpen
  const drawerId = internalDrawerId
  const dropdownDismissalScope = useMemo<DropdownDismissalScopeValue>(
    () => ({
      register: (close) => {
        dropdownClosersRef.current.add(close)
        return () => dropdownClosersRef.current.delete(close)
      },
    }),
    [],
  )
  const closeNavbarDropdowns = useCallback(() => {
    for (const close of dropdownClosersRef.current) close()
  }, [])
  const requestMobileOpen = useCallback(
    (open: boolean) => {
      if (mobileNavigationOpen === undefined) setInternalMobileOpen(open)
      onMobileNavigationOpenChange?.(open)
    },
    [mobileNavigationOpen, onMobileNavigationOpenChange],
  )
  const requestMobileNavigationOpen = useCallback(
    (open: boolean) => {
      if (open && drawerOpen) setInternalDrawerOpen(false)
      requestMobileOpen(open)
    },
    [drawerOpen, requestMobileOpen],
  )
  const requestDrawerOpen = useCallback(
    (open: boolean) => setInternalDrawerOpen(open),
    [],
  )
  const mobileNavigationItems = platform === 'back-office' ? (sidebarItems ?? []) : items
  const hasMobileNavigation = mobileNavigationItems.length > 0 || Boolean(account) || Boolean(guestActions)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (mobileOpen && !dialog.open) {
      dialog.showModal()
      mobileCloseRef.current?.focus({ preventScroll: true })
      wasMobileOpenRef.current = true
      return
    }

    if (!mobileOpen && dialog.open) dialog.close()
    if (!mobileOpen && wasMobileOpenRef.current) {
      wasMobileOpenRef.current = false
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        mobileTriggerRef.current?.focus({ preventScroll: true })
      }
    }
  }, [mobileOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const synchronize = () => {
      closeNavbarDropdowns()
      if (!desktop.matches) return
      if (mobileOpen) requestMobileOpen(false)
      if (drawerOpen) requestDrawerOpen(false)
    }

    synchronize()
    desktop.addEventListener('change', synchronize)
    return () => desktop.removeEventListener('change', synchronize)
  }, [closeNavbarDropdowns, drawerOpen, mobileOpen, requestDrawerOpen, requestMobileOpen])

  const closeMobileNavigation = useCallback(
    () => requestMobileOpen(false),
    [requestMobileOpen],
  )
  const mobileItems = useMemo(
    () =>
      platform === 'back-office'
        ? (sidebarItems ?? []).map((item) => toMobileSidebarItem(item, closeMobileNavigation))
        : items.map((item) => toSidebarItem(item, closeMobileNavigation)),
    [closeMobileNavigation, items, platform, sidebarItems],
  )
  const mobileDrawerItems = useMemo(
    () => items.map((item) => toMobileDrawerItem(item, () => requestDrawerOpen(false))),
    [items, requestDrawerOpen],
  )
  const handleDialogCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    closeMobileNavigation()
  }
  const handleDialogBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeMobileNavigation()
  }

  return (
    <DropdownDismissalContext.Provider value={dropdownDismissalScope}>
    <header
      className={cn('border-b border-border bg-surface text-content', className)}
      style={platform === 'back-office' ? { ...style, containerType: 'inline-size' } : style}
      {...headerProps}
    >
      <div
        ref={desktopRowRef}
        className={cn(
          'hidden min-h-[93px] items-center lg:flex',
          platform === 'back-office'
            ? 'w-full gap-[clamp(12px,calc(-23.03846px+4.807692cqw),32px)] lg:px-8'
            : 'mx-auto gap-[clamp(12px,calc(-37.2308px+4.80769vw),32px)] lg:w-[calc(100%-clamp(40px,calc(-19.07692px+5.76924vw),64px))] lg:max-w-[1280px] xl:w-max xl:min-w-[min(1280px,calc(100%-clamp(40px,calc(-19.07692px+5.76924vw),64px)))] xl:max-w-[min(1320px,calc(100%-clamp(40px,calc(-19.07692px+5.76924vw),64px)))]',
        )}
      >
        {platform === 'front-office' && <Brand brand={brand} />}
        {search && (
          <div
            data-navbar-search=""
            className={cn(
              'in-data-[theme=dark]:[--color-field-border:var(--color-gray-600)]',
              platform === 'back-office'
                ? 'min-w-[360px] w-[420px] max-w-[480px] flex-[0_1_420px]'
                : 'min-w-[180px] w-[348px] max-w-[348px] flex-[0_1_348px]',
            )}
          >
            {search}
          </div>
        )}
        <CapacityAwareDesktopNavigation
          items={items}
          row={desktopRow}
          platform={platform}
          compositionKey={[
            search ? 'search' : 'no-search',
            account ? 'account' : platform === 'front-office' && guestActions ? 'guest' : 'no-identity',
            notificationTrigger ? 'notification' : 'no-notification',
          ].join('|')}
        />
        <DesktopIdentity
          platform={platform}
          account={account}
          guestActions={guestActions}
          notificationTrigger={notificationTrigger}
        />
      </div>

      <div
        className="w-full px-4 py-4 sm:px-5 lg:hidden in-data-[theme=dark]:[--color-field-border:var(--color-gray-600)]"
      >
        {platform === 'front-office' ? (
          <>
            <div className="flex min-h-10 items-center gap-3">
              <Brand brand={brand} />
              <div className="ml-auto flex items-center gap-3">
                {notificationTrigger && <NotificationTrigger {...notificationTrigger} />}
                {account && (
                  <Avatar
                    src={account.avatarSrc}
                    alt={account.name}
                    initials={account.initials}
                    size="small"
                  />
                )}
                {hasMobileNavigation && (
                  <button
                    ref={mobileTriggerRef}
                    type="button"
                    aria-label={mobileOpen ? 'Tutup navigasi utama' : 'Buka navigasi utama'}
                    aria-expanded={mobileOpen}
                    aria-controls={dialogId}
                    onClick={() => requestMobileNavigationOpen(!mobileOpen)}
                    className="grid size-9 place-items-center rounded-lg text-content-subtle transition-colors hover:bg-surface-subtle hover:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand in-data-[theme=dark]:text-gray-400 [&>svg]:size-5"
                  >
                    <MenuIcon />
                  </button>
                )}
              </div>
            </div>
            {search && <div className="mt-3 min-w-0">{search}</div>}
          </>
        ) : (
          <div
            className={cn(
              'grid min-h-10 grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-x-3 gap-y-3 min-[576px]:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto]',
              search && 'grid-rows-[minmax(40px,auto)_auto] min-[576px]:grid-rows-none',
            )}
          >
            {hasMobileNavigation && (
              <button
                ref={mobileTriggerRef}
                type="button"
                aria-label={mobileOpen ? 'Tutup navigasi utama' : 'Buka navigasi utama'}
                aria-expanded={mobileOpen}
                aria-controls={dialogId}
                onClick={() => requestMobileNavigationOpen(!mobileOpen)}
                className="grid size-9 shrink-0 place-items-center rounded-lg text-content-subtle transition-colors hover:bg-surface-subtle hover:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand in-data-[theme=dark]:text-gray-400 [&>svg]:size-5"
              >
                <Bars className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
            <div className="col-start-2 min-w-0">
              <Brand brand={brand} />
            </div>
            {search && (
              <div className="col-span-5 row-start-2 min-w-0 min-[576px]:col-span-1 min-[576px]:col-start-3 min-[576px]:row-start-1">
                {search}
              </div>
            )}
            {account && (
              <div className={cn(
                'row-start-1',
                notificationTrigger
                  ? 'col-start-4 min-[576px]:col-start-5'
                  : 'col-start-3 min-[576px]:col-start-4',
              )}>
                <Avatar
                  src={account.avatarSrc}
                  alt={account.name}
                  initials={account.initials}
                  size="small"
                />
              </div>
            )}
            {notificationTrigger && (
              <div className="col-start-3 row-start-1 min-[576px]:col-start-4">
                <NotificationTrigger {...notificationTrigger} />
              </div>
            )}
            {items.length > 0 && (
              <div className={cn(
                'row-start-1',
                account && notificationTrigger
                  ? 'col-start-5 min-[576px]:col-start-6'
                  : account || notificationTrigger
                    ? 'col-start-4 min-[576px]:col-start-5'
                    : 'col-start-3 min-[576px]:col-start-4',
              )}>
                <Drawer.Trigger
                  aria-label="Buka navigasi Navbar"
                  aria-controls={drawerId}
                  aria-expanded={drawerOpen}
                  className="size-9 in-data-[theme=dark]:text-gray-400 in-data-[theme=dark]:hover:bg-gray-700 in-data-[theme=dark]:hover:text-white"
                  icon={
                    <BarsFromLeft
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  }
                  onClick={() => {
                    if (drawerOpen) {
                      requestDrawerOpen(false)
                      return
                    }
                    if (mobileOpen) requestMobileOpen(false)
                    requestDrawerOpen(true)
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Navigasi utama"
        className="fixed inset-y-0 left-0 right-auto m-0 h-full max-h-full w-[280px] max-w-[calc(100vw-2rem)] overflow-visible border-0 bg-transparent p-0 shadow-none backdrop:bg-gray-900/50 lg:hidden"
        onCancel={handleDialogCancel}
        onClick={handleDialogBackdrop}
        onClose={() => {
          if (mobileOpen) requestMobileOpen(false)
        }}
      >
        <div className="relative h-full">
          <Sidebar
            className="h-full !min-h-0 shadow-soft"
            logo={<Brand brand={brand} />}
            items={mobileItems}
            footer={
              <MobileIdentity
                platform={platform}
                account={account}
                guestActions={guestActions}
                close={() => closeMobileNavigation()}
              />
            }
          />
          <button
            ref={mobileCloseRef}
            type="button"
            aria-label="Tutup navigasi utama"
            onClick={() => closeMobileNavigation()}
            className="absolute top-5 right-4 z-10 grid size-8 place-items-center rounded-lg text-content-subtle hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&>svg]:size-5"
          >
            <CloseIcon />
          </button>
        </div>
      </dialog>

      {platform === 'back-office' && items.length > 0 && (
        <Drawer
          id={drawerId}
          open={drawerOpen}
          onClose={() => requestDrawerOpen(false)}
          position="right"
          size="s"
          eyebrow="Navigasi Navbar"
          header={<Drawer.Title>Menu aplikasi</Drawer.Title>}
          items={mobileDrawerItems}
          className="lg:hidden"
        />
      )}
    </header>
    </DropdownDismissalContext.Provider>
  )
}
