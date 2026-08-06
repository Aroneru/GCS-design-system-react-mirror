import {
  type HTMLAttributes,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { cn } from '../utils/cn'
import { NavbarNavigation } from './navbar/NavbarNavigation'
import { NavbarMobilePanel } from './navbar/NavbarMobilePanel'
import { NavbarUserMenu } from './navbar/NavbarUserMenu'

interface NavbarItemBase {
  id: string
  label: string
  active?: boolean
  disabled?: boolean
}

export interface NavbarSubItem extends NavbarItemBase {
  href: string
  external?: boolean
}

export type NavbarItem =
  | (NavbarItemBase & {
      href: string
      external?: boolean
      children?: never
    })
  | (NavbarItemBase & {
      href?: never
      external?: never
      children: NavbarSubItem[]
    })

interface NavbarSearchBase {
  onSubmit: (query: string, event: FormEvent<HTMLFormElement>) => void
  onValueChange?: (value: string) => void
  label?: string
  placeholder?: string
  name?: string
  disabled?: boolean
  autoComplete?: string
}

export type NavbarSearchConfig = NavbarSearchBase &
  (
    | {
        value: string
        defaultValue?: never
      }
    | {
        value?: never
        defaultValue?: string
      }
  )

interface NavbarActionBase {
  label: string
}

export type NavbarAction =
  | (NavbarActionBase & {
      href: string
      external?: boolean
      onClick?: never
    })
  | (NavbarActionBase & {
      href?: never
      external?: never
      onClick: MouseEventHandler<HTMLButtonElement>
    })

export interface NavbarGuestActions {
  login?: NavbarAction
  register?: NavbarAction
}

export interface NavbarUser {
  name: string
  avatarSrc?: string
  avatarAlt?: string
  initials?: string
  items?: NavbarSubItem[]
}

interface NavbarNotificationBase {
  unread: boolean | number
  label?: string
}

export type NavbarNotification =
  | (NavbarNotificationBase & {
      href: string
      external?: boolean
      onClick?: never
    })
  | (NavbarNotificationBase & {
      href?: never
      external?: never
      onClick: MouseEventHandler<HTMLButtonElement>
    })

interface NavbarPropsBase extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  brand: ReactNode
  brandLabel: string
  brandHref?: string
  items: NavbarItem[]
  activeHref?: string
  search?: NavbarSearchConfig
  guestActions?: NavbarGuestActions
  user?: NavbarUser
  notification?: NavbarNotification
  ariaLabel?: string
  onNavigate?: (
    item: NavbarItem | NavbarSubItem,
    event: ReactMouseEvent<HTMLAnchorElement>,
  ) => void
  onMobileOpenChange?: (open: boolean) => void
}

export type NavbarProps = NavbarPropsBase &
  (
    | {
        mobileOpen: boolean
        defaultMobileOpen?: never
      }
    | {
        mobileOpen?: never
        defaultMobileOpen?: boolean
      }
  )

function GuestAction({
  action,
  variant,
  onAction,
}: {
  action: NavbarAction
  variant: 'primary' | 'secondary'
  onAction?: () => void
}) {
  if (action.href !== undefined) {
    return (
      <Button
        as="a"
        href={action.href}
        variant={variant}
        onClick={onAction}
        {...(action.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {action.label}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      onClick={(event) => {
        action.onClick(event)
        onAction?.()
      }}
    >
      {action.label}
    </Button>
  )
}

function NavbarSearchForm({
  search,
  inputId,
  value,
  className,
  onSubmit,
  onValueChange,
}: {
  search: NavbarSearchConfig
  inputId: string
  value: string
  className?: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onValueChange: (value: string) => void
}) {
  return (
    <form role="search" className={cn('relative', className)} onSubmit={onSubmit}>
      <label htmlFor={inputId} className="sr-only">
        {search.label ?? 'Cari'}
      </label>
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-subtle">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m16 16 4 4" />
        </svg>
      </Icon>
      <input
        id={inputId}
        type="search"
        name={search.name ?? 'search'}
        value={value}
        placeholder={search.placeholder ?? 'Cari'}
        autoComplete={search.autoComplete ?? 'off'}
        disabled={search.disabled}
        className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-content placeholder:text-content-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-50"
        onChange={(event) => onValueChange(event.currentTarget.value)}
      />
    </form>
  )
}

function NotificationControl({
  notification,
  className,
  onAction,
}: {
  notification: NavbarNotification
  className?: string
  onAction?: () => void
}) {
  const numericCount =
    typeof notification.unread === 'number' && Number.isFinite(notification.unread)
      ? Math.max(0, Math.floor(notification.unread))
      : 0
  const hasUnreadDot = notification.unread === true
  const hasUnreadCount = numericCount > 0
  const visualCount = numericCount > 99 ? '99+' : String(numericCount)
  const baseLabel = notification.label?.trim() || 'Notifikasi'
  const accessibleLabel = hasUnreadCount
    ? `${baseLabel}, ${numericCount} notifikasi belum dibaca`
    : hasUnreadDot
      ? `${baseLabel}, ada notifikasi belum dibaca`
      : baseLabel
  const content = (
    <>
      <Icon className="size-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"
          />
        </svg>
      </Icon>
      {hasUnreadDot && (
        <span
          className="absolute top-1 right-1 size-2 rounded-full bg-feedback-error"
          aria-hidden="true"
        />
      )}
      {hasUnreadCount && (
        <span
          className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-feedback-error px-1 text-caption leading-none font-bold text-white"
          aria-hidden="true"
        >
          {visualCount}
        </span>
      )}
    </>
  )
  const classes = cn(
    'relative grid size-11 shrink-0 place-items-center rounded-full text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
    className,
  )

  if (notification.href !== undefined) {
    return (
      <a
        href={notification.href}
        className={classes}
        aria-label={accessibleLabel}
        onClick={onAction}
        {...(notification.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      aria-label={accessibleLabel}
      onClick={(event) => {
        notification.onClick(event)
        onAction?.()
      }}
    >
      {content}
    </button>
  )
}

/** Navbar utama dengan root full-width dan wrapper layout internal. */
export function Navbar({
  brand,
  brandLabel,
  brandHref = '/',
  items,
  activeHref,
  search,
  guestActions,
  user,
  notification,
  ariaLabel = 'Navigasi utama',
  onNavigate,
  mobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className,
  ...props
}: NavbarProps) {
  const searchInputId = useId()
  const mobileSearchInputId = useId()
  const navigationId = useId()
  const userMenuId = useId()
  const mobilePanelId = useId()
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(defaultMobileOpen)
  const [openMobileSubmenuId, setOpenMobileSubmenuId] = useState<string | null>(null)
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(
    () => search?.defaultValue ?? '',
  )
  const searchValue = search?.value ?? uncontrolledSearchValue
  const isMobileControlled = mobileOpen !== undefined
  const isMobileOpen = isMobileControlled ? mobileOpen : uncontrolledMobileOpen
  const showGuestActions = !user && Boolean(guestActions?.login || guestActions?.register)
  const handleNavigationMenuChange = useCallback((itemId: string | null) => {
    setOpenMenuId(itemId)
    if (itemId !== null) setUserMenuOpen(false)
  }, [])
  const handleUserMenuChange = useCallback((open: boolean) => {
    setUserMenuOpen(open)
    if (open) setOpenMenuId(null)
  }, [])
  const handleMobileOpenChange = useCallback(
    (open: boolean) => {
      if (open === isMobileOpen) return

      if (!isMobileControlled) setUncontrolledMobileOpen(open)
      onMobileOpenChange?.(open)

      if (open) {
        setOpenMenuId(null)
        setUserMenuOpen(false)
      } else {
        setOpenMobileSubmenuId(null)
      }
    },
    [isMobileControlled, isMobileOpen, onMobileOpenChange],
  )
  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const query = searchValue.trim()

      if (!search || search.disabled || query.length === 0) return
      search.onSubmit(query, event)
    },
    [search, searchValue],
  )
  const handleSearchValueChange = useCallback(
    (value: string) => {
      if (!search) return

      if (search.value === undefined) setUncontrolledSearchValue(value)
      search.onValueChange?.(value)
    },
    [search],
  )

  useEffect(() => {
    if (!isMobileOpen) return

    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      handleMobileOpenChange(false)
      hamburgerRef.current?.focus()
    }

    document.addEventListener('keydown', closeFromEscape)
    return () => document.removeEventListener('keydown', closeFromEscape)
  }, [handleMobileOpenChange, isMobileOpen])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    const synchronizeDesktop = () => {
      if (!desktopQuery.matches) return

      if (isMobileOpen) handleMobileOpenChange(false)
      setOpenMobileSubmenuId(null)
      setOpenMenuId(null)
      setUserMenuOpen(false)
    }

    synchronizeDesktop()
    desktopQuery.addEventListener('change', synchronizeDesktop)
    return () => desktopQuery.removeEventListener('change', synchronizeDesktop)
  }, [handleMobileOpenChange, isMobileOpen])

  return (
    <header
      className={cn('w-full border-b border-border bg-surface text-content', className)}
      {...props}
    >
      <div className="mx-auto w-full px-4 lg:px-6">
        <div className="flex items-center py-4 lg:gap-6 lg:py-5">
          <a
            href={brandHref}
            className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            aria-label={brandLabel}
          >
            {brand}
          </a>
          {search && (
            <NavbarSearchForm
              search={search}
              inputId={searchInputId}
              value={searchValue}
              className="hidden w-64 shrink-0 lg:block"
              onSubmit={handleSearchSubmit}
              onValueChange={handleSearchValueChange}
            />
          )}
          <NavbarNavigation
            items={items}
            activeHref={activeHref}
            ariaLabel={ariaLabel}
            idPrefix={navigationId}
            openMenuId={openMenuId}
            onOpenMenuChange={handleNavigationMenuChange}
            onNavigate={onNavigate}
          />
          {showGuestActions && guestActions && (
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              {guestActions.login && (
                <GuestAction action={guestActions.login} variant="secondary" />
              )}
              {guestActions.register && (
                <GuestAction action={guestActions.register} variant="primary" />
              )}
            </div>
          )}
          {user && (
            <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
              {notification && (
                <NotificationControl notification={notification} className="hidden lg:grid" />
              )}
              <NavbarUserMenu
                user={user}
                activeHref={activeHref}
                menuId={userMenuId}
                open={userMenuOpen}
                onOpenChange={handleUserMenuChange}
                onNavigate={onNavigate}
              />
            </div>
          )}
          <button
            ref={hamburgerRef}
            type="button"
            className="ml-auto grid size-11 shrink-0 place-items-center rounded-lg text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:hidden"
            aria-label={isMobileOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={isMobileOpen}
            aria-controls={mobilePanelId}
            onClick={() => handleMobileOpenChange(!isMobileOpen)}
          >
            <Icon className="size-5">
              {isMobileOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </Icon>
          </button>
        </div>

        <NavbarMobilePanel
          id={mobilePanelId}
          open={isMobileOpen}
          items={items}
          activeHref={activeHref}
          ariaLabel={ariaLabel}
          openSubmenuId={openMobileSubmenuId}
          onOpenSubmenuChange={setOpenMobileSubmenuId}
          onNavigate={onNavigate}
          onClose={() => handleMobileOpenChange(false)}
          searchContent={
            search ? (
              <NavbarSearchForm
                search={search}
                inputId={mobileSearchInputId}
                value={searchValue}
                onSubmit={handleSearchSubmit}
                onValueChange={handleSearchValueChange}
              />
            ) : undefined
          }
          guestActionsContent={
            showGuestActions && guestActions ? (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                {guestActions.login && (
                  <GuestAction
                    action={guestActions.login}
                    variant="secondary"
                    onAction={() => handleMobileOpenChange(false)}
                  />
                )}
                {guestActions.register && (
                  <GuestAction
                    action={guestActions.register}
                    variant="primary"
                    onAction={() => handleMobileOpenChange(false)}
                  />
                )}
              </div>
            ) : undefined
          }
          notificationContent={
            user && notification ? (
              <NotificationControl
                notification={notification}
                onAction={() => handleMobileOpenChange(false)}
              />
            ) : undefined
          }
          user={user}
        />
      </div>
    </header>
  )
}
