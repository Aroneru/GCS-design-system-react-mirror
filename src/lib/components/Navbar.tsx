import {
  useEffect,
  useId,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributeAnchorTarget,
  type HTMLAttributes,
  type MouseEventHandler,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from 'react'
import { ArrowRightToBracket, Bars, Edit } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Drawer } from './Drawer'
import { Dropdown, type DropdownItem } from './Dropdown'
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

export interface NavbarMobileDrawer {
  open: boolean
  onOpenChange: (open: boolean) => void
  controls: string
  ariaLabel?: string
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
      notificationTrigger?: ReactNode
    }
  | {
      account?: undefined
      guestActions?: NavbarGuestActions
      notificationTrigger?: never
    }

export type NavbarFrontOfficeProps = NavbarBaseProps &
  FrontOfficeIdentity & {
    platform: 'front-office'
    mobileDrawer?: never
  }

export interface NavbarBackOfficeProps extends NavbarBaseProps {
  platform: 'back-office'
  account?: NavbarAccount
  notificationTrigger?: never
  mobileDrawer?: NavbarMobileDrawer
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

function Destination({ item, spacingMode }: { item: NavbarDestination; spacingMode: DesktopSpacingMode }) {
  const rel = item.target === '_blank' ? (item.rel ?? 'noopener noreferrer') : item.rel

  return (
    <a
      href={item.disabled ? undefined : item.href}
      target={item.disabled ? undefined : item.target}
      rel={item.disabled ? undefined : rel}
      aria-current={item.current ? 'page' : undefined}
      aria-disabled={item.disabled || undefined}
      onClick={item.disabled ? undefined : item.onClick}
      className={cn(
        'whitespace-nowrap rounded py-1.5 font-sans text-base leading-[1.5] font-semibold text-content transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        desktopItemPadding[spacingMode],
        item.disabled && 'pointer-events-none opacity-50',
      )}
    >
      {item.label}
    </a>
  )
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
  const contentRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(items.flatMap((item) => item.type === 'disclosure' && item.children.some((child) => child.current) ? [item.id] : [])),
  )
  const [truncatedLabels, setTruncatedLabels] = useState<Set<string>>(() => new Set())
  const labelKey = items.map((item) => item.type === 'destination'
    ? `destination:${item.id}:${item.label}`
    : `disclosure:${item.id}:${item.label}:${item.children.map((child) => `${child.id}:${child.label}`).join(',')}`
  ).join('|')

  const measureTruncation = useCallback(() => {
    const content = contentRef.current
    if (!content) return

    const next = new Set<string>()
    for (const label of content.querySelectorAll<HTMLElement>('[data-navbar-overflow-label]')) {
      const key = label.dataset.navbarOverflowLabel
      if (key && label.clientWidth > 0 && label.scrollWidth > label.clientWidth + 0.5) next.add(key)
    }

    setTruncatedLabels((current) => {
      if (current.size === next.size && Array.from(current).every((key) => next.has(key))) return current
      return next
    })
  }, [])

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return

    const labels = Array.from(content.querySelectorAll<HTMLElement>('[data-navbar-overflow-label]'))
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
  }, [expanded, labelKey, measureTruncation])

  const toggleDisclosure = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const destination = (item: NavbarDestination, close: () => void, measurementKey: string, nested = false) => {
    const rel = item.target === '_blank' ? (item.rel ?? 'noopener noreferrer') : item.rel
    const className = cn(
      'flex min-w-0 items-center rounded-md py-2 text-sm font-medium text-content transition-colors',
      nested ? 'pr-3 pl-7' : 'px-3',
      'hover:bg-dropdown-item-hover-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand',
      item.disabled && 'cursor-not-allowed opacity-50',
    )
    const content = (
      <span
        data-navbar-overflow-label={measurementKey}
        className="min-w-0 flex-1 truncate"
        title={truncatedLabels.has(measurementKey) ? item.label : undefined}
      >
        {item.label}
      </span>
    )

    if (item.disabled) {
      return <span key={item.id} aria-disabled="true" aria-label={item.label} className={className}>{content}</span>
    }

    return (
      <a
        key={item.id}
        href={item.href}
        target={item.target}
        rel={rel}
        aria-current={item.current ? 'page' : undefined}
        aria-label={item.label}
        data-baris=""
        className={className}
        onClick={(event) => {
          item.onClick?.(event)
          if (ordinaryActivation(event)) close()
        }}
      >
        {content}
      </a>
    )
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          ref={triggerRef}
          type="button"
          aria-controls={panelId}
          className={cn(
            'inline-flex items-center gap-1 whitespace-nowrap rounded py-1.5 font-sans text-base leading-[1.5] font-semibold text-content transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            desktopItemPadding[spacingMode],
          )}
        >
          Lainnya
          <ChevronDownIcon />
        </button>
      }
      contentClassName="w-fit p-2"
    >
      {({ close }) => (
        <div
          ref={contentRef}
          id={panelId}
          role="region"
          aria-label="Navigasi lainnya"
          className="w-max min-w-0 max-w-[min(304px,calc(100vw-24px))]"
        >
          {items.map((item, index) => {
            if (item.type === 'destination') return destination(item, close, `destination:${item.id}`)

            const isExpanded = expanded.has(item.id)
            const groupId = `${panelId}-group-${index}`
            return (
              <div key={item.id} className="min-w-0">
                <button
                  type="button"
                  disabled={item.disabled}
                  aria-expanded={isExpanded}
                  aria-controls={groupId}
                  aria-label={item.label}
                  data-baris=""
                  onClick={() => toggleDisclosure(item.id)}
                  className={cn(
                    'flex w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-content transition-colors hover:bg-dropdown-item-hover-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  <span
                    data-navbar-overflow-label={`disclosure:${item.id}`}
                    className="min-w-0 flex-1 truncate"
                    title={truncatedLabels.has(`disclosure:${item.id}`) ? item.label : undefined}
                  >
                    {item.label}
                  </span>
                  <span className={cn('shrink-0 transition-transform', isExpanded && 'rotate-180')}><ChevronDownIcon /></span>
                </button>
                {isExpanded && !item.disabled && (
                  <div id={groupId} className="grid min-w-0 border-l border-border-subtle">
                    {item.children.map((child) => destination(child, close, `child:${item.id}:${child.id}`, true))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Dropdown>
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
      <span className={cn('block whitespace-nowrap py-1.5 font-sans text-base leading-[1.5] font-semibold', padding)}>
        {item.label}
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap py-1.5 font-sans text-base leading-[1.5] font-semibold', padding)}>
      {item.label}
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
}: {
  items: NavbarPrimaryItem[]
  row: HTMLDivElement | null
  platform: NavbarPlatform
}) {
  const measurementRef = useRef<HTMLUListElement>(null)
  const overflowTriggerRef = useRef<HTMLButtonElement>(null)
  const focusAfterAllocationRef = useRef<{ type: 'overflow' | 'item'; index?: number } | null>(null)
  const spacingMode: DesktopSpacingMode = platform === 'front-office' ? 'viewport' : 'container'
  const allocationKey = `${platform}|${items.map((item) => `${item.id}:${item.type}:${item.label}`).join('|')}`
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
        + (search ? 180 : 0)
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
                <Destination item={item} spacingMode={spacingMode} />
              ) : (
                <Dropdown
                  align="center"
                  closeOnSelect
                  trigger={
                    <button
                      type="button"
                      disabled={item.disabled}
                      className={cn(
                        'inline-flex items-center gap-1 whitespace-nowrap rounded py-1.5 font-sans text-base leading-[1.5] font-semibold text-content transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50',
                        desktopItemPadding[spacingMode],
                      )}
                    >
                      {item.label}
                      <ChevronDownIcon />
                    </button>
                  }
                  items={item.children.map(toDropdownDestination)}
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

function toDropdownDestination(item: NavbarDestination): DropdownItem {
  return {
    id: item.id,
    label: item.label,
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
  if (account) {
    return (
      <div data-navbar-identity="" className="flex shrink-0 items-center gap-3">
        {notificationTrigger}
        <AccountMenu account={account} constrainName />
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
    mobileDrawer,
    ...headerProps
  } = props
  const dialogId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const [desktopRow, setDesktopRow] = useState<HTMLDivElement | null>(null)
  const desktopRowRef = useCallback((node: HTMLDivElement | null) => {
    setDesktopRow(node)
  }, [])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileCloseRef = useRef<HTMLButtonElement>(null)
  const wasMobileOpenRef = useRef(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const mobileOpen = mobileNavigationOpen ?? internalMobileOpen
  const requestMobileOpen = useCallback(
    (open: boolean) => {
      if (mobileNavigationOpen === undefined) setInternalMobileOpen(open)
      onMobileNavigationOpenChange?.(open)
    },
    [mobileNavigationOpen, onMobileNavigationOpenChange],
  )
  const requestMobileNavigationOpen = useCallback(
    (open: boolean) => {
      if (open && mobileDrawer?.open) mobileDrawer.onOpenChange(false)
      requestMobileOpen(open)
    },
    [mobileDrawer, requestMobileOpen],
  )
  const hasMobileNavigation = items.length > 0 || Boolean(account) || Boolean(guestActions)

  useEffect(() => {
    if (mobileOpen && mobileDrawer?.open) mobileDrawer.onOpenChange(false)
  }, [mobileDrawer, mobileOpen])

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
      headerRef.current
        ?.querySelectorAll<HTMLElement>('[popover]:popover-open')
        .forEach((panel) => panel.hidePopover())
      if (!desktop.matches) return
      if (mobileOpen) requestMobileOpen(false)
      if (mobileDrawer?.open) mobileDrawer.onOpenChange(false)
    }

    synchronize()
    desktop.addEventListener('change', synchronize)
    return () => desktop.removeEventListener('change', synchronize)
  }, [mobileDrawer, mobileOpen, requestMobileOpen])

  const closeMobileNavigation = useCallback(
    () => requestMobileOpen(false),
    [requestMobileOpen],
  )
  const mobileItems = useMemo(
    () => items.map((item) => toSidebarItem(item, () => closeMobileNavigation())),
    [closeMobileNavigation, items],
  )
  const handleDialogCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    closeMobileNavigation()
  }
  const handleDialogBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeMobileNavigation()
  }

  return (
    <header
      ref={headerRef}
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
            className="min-w-[180px] w-[348px] max-w-[348px] flex-[0_1_348px] in-data-[theme=dark]:[--color-field-border:var(--color-gray-600)]"
          >
            {search}
          </div>
        )}
        <CapacityAwareDesktopNavigation items={items} row={desktopRow} platform={platform} />
        <DesktopIdentity
          platform={platform}
          account={account}
          guestActions={guestActions}
          notificationTrigger={notificationTrigger}
        />
      </div>

      <div
        className={cn(
          'w-full px-4 sm:px-5 lg:hidden in-data-[theme=dark]:[--color-field-border:var(--color-gray-600)]',
          platform === 'front-office' ? 'py-4' : 'py-[19px]',
        )}
      >
        {platform === 'front-office' ? (
          <>
            <div className="flex min-h-10 items-center gap-3">
              <Brand brand={brand} />
              <div className="ml-auto flex items-center gap-3">
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
          <div className="grid min-h-10 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-3 min-[440px]:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto]">
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
              <div className="col-span-4 row-start-2 min-w-0 min-[440px]:col-span-1 min-[440px]:col-start-3 min-[440px]:row-start-1">
                {search}
              </div>
            )}
            {account && (
              <div className="col-start-3 row-start-1 min-[440px]:col-start-4">
                <Avatar
                  src={account.avatarSrc}
                  alt={account.name}
                  initials={account.initials}
                  size="small"
                />
              </div>
            )}
            {mobileDrawer && (
              <div className="col-start-4 row-start-1 min-[440px]:col-start-5">
                <Drawer.Trigger
                  aria-label={mobileDrawer.ariaLabel ?? 'Buka navigasi kontekstual'}
                  aria-controls={mobileDrawer.controls}
                  aria-expanded={mobileDrawer.open}
                  className="size-9 in-data-[theme=dark]:text-gray-400 in-data-[theme=dark]:hover:bg-gray-700 in-data-[theme=dark]:hover:text-white"
                  icon={
                    <BarsFromLeft
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  }
                  onClick={() => {
                    if (mobileDrawer.open) {
                      mobileDrawer.onOpenChange(false)
                      return
                    }
                    if (mobileOpen) requestMobileOpen(false)
                    mobileDrawer.onOpenChange(true)
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
    </header>
  )
}
