import {
  type HTMLAttributes,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactNode,
  useId,
  useState,
} from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { cn } from '../utils/cn'
import { NavbarNavigation } from './navbar/NavbarNavigation'

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(
    () => search?.defaultValue ?? '',
  )
  const searchValue = search?.value ?? uncontrolledSearchValue
  const showGuestActions = !user && Boolean(guestActions?.login || guestActions?.register)

  // Public contract disiapkan sekarang; rendering fitur-fitur ini ditambahkan bertahap.
  void notification
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
            onOpenMenuChange={setOpenMenuId}
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
        </div>
      </div>
    </header>
  )
}
