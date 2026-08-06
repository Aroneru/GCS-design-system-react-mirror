import {
  type HTMLAttributes,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { cn } from '../utils/cn'
import { NavbarNavigation } from './navbar/NavbarNavigation'
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

function GuestAction({ action, variant }: { action: NavbarAction; variant: 'primary' | 'secondary' }) {
  if (action.href !== undefined) {
    return (
      <Button
        as="a"
        href={action.href}
        variant={variant}
        {...(action.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {action.label}
      </Button>
    )
  }

  return (
    <Button variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  )
}

function NotificationControl({ notification }: { notification: NavbarNotification }) {
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
  const classes =
    'relative hidden size-11 shrink-0 place-items-center rounded-full text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:grid'

  if (notification.href !== undefined) {
    return (
      <a
        href={notification.href}
        className={classes}
        aria-label={accessibleLabel}
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
      onClick={notification.onClick}
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
  const navigationId = useId()
  const userMenuId = useId()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(
    () => search?.defaultValue ?? '',
  )
  const searchValue = search?.value ?? uncontrolledSearchValue
  const showGuestActions = !user && Boolean(guestActions?.login || guestActions?.register)
  const handleNavigationMenuChange = useCallback((itemId: string | null) => {
    setOpenMenuId(itemId)
    if (itemId !== null) setUserMenuOpen(false)
  }, [])
  const handleUserMenuChange = useCallback((open: boolean) => {
    setUserMenuOpen(open)
    if (open) setOpenMenuId(null)
  }, [])

  // Public contract disiapkan sekarang; rendering fitur-fitur ini ditambahkan bertahap.
  void mobileOpen
  void defaultMobileOpen
  void onMobileOpenChange

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
            <form
              role="search"
              className="relative hidden w-64 shrink-0 lg:block"
              onSubmit={(event) => {
                event.preventDefault()
                const query = searchValue.trim()

                if (search.disabled || query.length === 0) return
                search.onSubmit(query, event)
              }}
            >
              <label htmlFor={searchInputId} className="sr-only">
                {search.label ?? 'Cari'}
              </label>
              <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-subtle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="m16 16 4 4" />
                </svg>
              </Icon>
              <input
                id={searchInputId}
                type="search"
                name={search.name ?? 'search'}
                value={searchValue}
                placeholder={search.placeholder ?? 'Cari'}
                autoComplete={search.autoComplete ?? 'off'}
                disabled={search.disabled}
                className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-content placeholder:text-content-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-50"
                onChange={(event) => {
                  const value = event.currentTarget.value

                  if (search.value === undefined) setUncontrolledSearchValue(value)
                  search.onValueChange?.(value)
                }}
              />
            </form>
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
              {notification && <NotificationControl notification={notification} />}
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
        </div>
      </div>
    </header>
  )
}
