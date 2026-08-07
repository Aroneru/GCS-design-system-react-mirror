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

export type NavbarMenuPosition = 'left' | 'right'

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
  menuPosition?: NavbarMenuPosition
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
  const icon =
    variant === 'secondary' ? (
      <Icon className="size-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
        </svg>
      </Icon>
    ) : (
      <Icon className="size-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.5l4 4L8 20H4v-4L13.5 6.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 4.5 4 4" />
        </svg>
      </Icon>
    )

  if (action.href !== undefined) {
    return (
      <Button
        as="a"
        href={action.href}
        variant={variant}
        onClick={onAction}
        {...(action.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {icon}
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
      {icon}
      {action.label}
    </Button>
  )
}

// Boundary internal: ganti dengan primitive Search resmi tanpa mengubah NavbarSearchConfig.
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
        placeholder={search.placeholder ?? 'Search Civitas, Organisasi ...'}
        autoComplete={search.autoComplete ?? 'off'}
        disabled={search.disabled}
        className="box-border h-[37px] w-full rounded-lg border border-gray-300 bg-surface-subtle py-0 pr-3 pl-9 text-sm leading-[21px] font-medium text-content placeholder:text-content-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
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
  menuPosition = 'right',
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
  const [previousUserPresent, setPreviousUserPresent] = useState(user !== undefined)
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(defaultMobileOpen)
  const [openMobileSubmenuId, setOpenMobileSubmenuId] = useState<string | null>(null)
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(
    () => search?.defaultValue ?? '',
  )
  const searchValue = search?.value ?? uncontrolledSearchValue
  const isMobileControlled = mobileOpen !== undefined
  const isMobileOpen = isMobileControlled ? mobileOpen : uncontrolledMobileOpen
  const showGuestActions = !user && Boolean(guestActions?.login || guestActions?.register)

  if (previousUserPresent !== (user !== undefined)) {
    setPreviousUserPresent(user !== undefined)
    if (userMenuOpen) setUserMenuOpen(false)
  }

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
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="flex w-full min-w-0 items-center py-3 lg:h-[93px] lg:gap-4 lg:py-0 2xl:gap-6">
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
              className="hidden w-[348px] shrink-0 lg:block"
              onSubmit={handleSearchSubmit}
              onValueChange={handleSearchValueChange}
            />
          )}
          {menuPosition === 'right' && <div className="hidden min-w-0 flex-1 lg:block" aria-hidden="true" />}
          <NavbarNavigation
            items={items}
            activeHref={activeHref}
            ariaLabel={ariaLabel}
            idPrefix={navigationId}
            openMenuId={openMenuId}
            onOpenMenuChange={handleNavigationMenuChange}
            onNavigate={onNavigate}
          />
          {menuPosition === 'left' && <div className="hidden min-w-0 flex-1 lg:block" aria-hidden="true" />}
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
            <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 lg:ml-0">
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
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-lg text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:hidden',
              user ? 'ml-2' : 'ml-auto',
            )}
            aria-label={isMobileOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={isMobileOpen}
            aria-controls={mobilePanelId}
            onClick={() => handleMobileOpenChange(!isMobileOpen)}
          >
            <Icon className="size-4">
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

        {search && (
          <div className="pb-4 lg:hidden">
            <NavbarSearchForm
              search={search}
              inputId={mobileSearchInputId}
              value={searchValue}
              className="mx-auto w-full max-w-[348px]"
              onSubmit={handleSearchSubmit}
              onValueChange={handleSearchValueChange}
            />
          </div>
        )}

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
