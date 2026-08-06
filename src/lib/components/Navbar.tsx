import {
  type HTMLAttributes,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
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
  // Public contract disiapkan sekarang; rendering fitur-fitur ini ditambahkan bertahap.
  void search
  void guestActions
  void user
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
          <NavbarNavigation
            items={items}
            activeHref={activeHref}
            ariaLabel={ariaLabel}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </header>
  )
}
