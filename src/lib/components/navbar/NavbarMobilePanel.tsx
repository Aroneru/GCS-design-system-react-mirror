import { useEffect, type ReactNode } from 'react'
import type { NavbarItem, NavbarProps, NavbarSubItem, NavbarUser } from '../Navbar'
import { Icon } from '../Icon'
import { cn } from '../../utils/cn'

type NavbarLinkItem = Extract<NavbarItem, { href: string }>
type NavbarSubmenuItem = Extract<NavbarItem, { children: NavbarSubItem[] }>

interface NavbarMobilePanelProps {
  id: string
  open: boolean
  items: NavbarItem[]
  activeHref?: string
  ariaLabel: string
  openSubmenuId: string | null
  onOpenSubmenuChange: (itemId: string | null) => void
  onNavigate?: NavbarProps['onNavigate']
  onClose: () => void
  searchContent?: ReactNode
  guestActionsContent?: ReactNode
  notificationContent?: ReactNode
  user?: NavbarUser
}

function isLinkItem(item: NavbarItem): item is NavbarLinkItem {
  return typeof item.href === 'string'
}

function isSubmenuItem(item: NavbarItem): item is NavbarSubmenuItem {
  return Array.isArray(item.children)
}

function isActive(item: NavbarLinkItem | NavbarSubItem, activeHref?: string) {
  return item.active ?? item.href === activeHref
}

function MobileLink({
  item,
  activeHref,
  onNavigate,
  onClose,
}: {
  item: NavbarLinkItem | NavbarSubItem
  activeHref?: string
  onNavigate?: NavbarProps['onNavigate']
  onClose: () => void
}) {
  const active = isActive(item, activeHref)

  return (
    <a
      href={item.href}
      className={cn(
        'block truncate rounded-md px-3 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
        item.disabled
          ? 'cursor-not-allowed text-content-subtle opacity-50'
          : active
            ? 'bg-primary-50 text-brand'
            : 'text-content hover:bg-surface-subtle hover:text-brand',
      )}
      aria-current={!item.disabled && active ? 'page' : undefined}
      aria-disabled={item.disabled || undefined}
      tabIndex={item.disabled ? -1 : undefined}
      onClick={(event) => {
        if (item.disabled) {
          event.preventDefault()
          return
        }

        onNavigate?.(item, event)
        onClose()
      }}
      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {item.label}
    </a>
  )
}

export function NavbarMobilePanel({
  id,
  open,
  items,
  activeHref,
  ariaLabel,
  openSubmenuId,
  onOpenSubmenuChange,
  onNavigate,
  onClose,
  searchContent,
  guestActionsContent,
  notificationContent,
  user,
}: NavbarMobilePanelProps) {
  const navigationItems = items.filter(
    (item) => isLinkItem(item) || (isSubmenuItem(item) && item.children.length > 0),
  )
  const accountItems = user?.items?.filter((item) => typeof item.href === 'string') ?? []

  useEffect(() => {
    if (!open && openSubmenuId !== null) onOpenSubmenuChange(null)
  }, [onOpenSubmenuChange, open, openSubmenuId])

  return (
    <div id={id} hidden={!open} className="border-t border-border bg-surface lg:hidden">
      <div className="space-y-5 px-4 py-4">
        {searchContent}

        {navigationItems.length > 0 && (
          <nav aria-label={ariaLabel}>
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                if (isLinkItem(item)) {
                  return (
                    <li key={item.id}>
                      <MobileLink
                        item={item}
                        activeHref={activeHref}
                        onNavigate={onNavigate}
                        onClose={onClose}
                      />
                    </li>
                  )
                }

                if (!isSubmenuItem(item)) return null

                const expanded = openSubmenuId === item.id
                const childActive = item.children.some(
                  (child) => !child.disabled && isActive(child, activeHref),
                )
                const parentActive = item.active ?? childActive
                const submenuId = `${id}-${encodeURIComponent(item.id)}-submenu`

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                        item.disabled
                          ? 'cursor-not-allowed text-content-subtle opacity-50'
                          : parentActive
                            ? 'bg-primary-50 text-brand'
                            : 'text-content hover:bg-surface-subtle hover:text-brand',
                      )}
                      disabled={item.disabled}
                      aria-expanded={expanded}
                      aria-controls={submenuId}
                      onClick={() => onOpenSubmenuChange(expanded ? null : item.id)}
                    >
                      <span className="truncate">{item.label}</span>
                      <Icon
                        className={cn(
                          'size-4 shrink-0 transition-transform motion-reduce:transition-none',
                          expanded && 'rotate-180',
                        )}
                      >
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
                            d="m7 10 5 5 5-5"
                          />
                        </svg>
                      </Icon>
                    </button>

                    <ul id={submenuId} hidden={!expanded} className="mt-1 space-y-1 pl-4">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <MobileLink
                            item={child}
                            activeHref={activeHref}
                            onNavigate={onNavigate}
                            onClose={onClose}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        {guestActionsContent}

        {user && (
          <section className="space-y-3 border-t border-border pt-4" aria-label="Akun pengguna">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <p className="truncate text-sm font-bold text-content" title={user.name}>
                {user.name.trim() || 'Pengguna'}
              </p>
              {notificationContent}
            </div>

            {accountItems.length > 0 && (
              <ul className="space-y-1">
                {accountItems.map((item) => (
                  <li key={item.id}>
                    <MobileLink
                      item={item}
                      activeHref={activeHref}
                      onNavigate={onNavigate}
                      onClose={onClose}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
