import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import { ChevronRight, Close } from '../../icons/outline'
import { cn } from '../../utils/cn'
import type { NavbarItem, NavbarProps, NavbarSubItem, NavbarUser } from '../Navbar'
import { Icon } from '../Icon'

type NavbarLinkItem = Extract<NavbarItem, { href: string }>
type NavbarSectionItem = Extract<NavbarItem, { children: NavbarSubItem[] }>
type NavbarNestedItem = Extract<NavbarItem, { href?: never; children: NavbarSubItem[] }>
type NavbarContextItem = Extract<NavbarItem, { href: string; children: NavbarSubItem[] }>

interface NavbarMobilePanelProps {
  sidebarId: string
  drawerId: string
  sidebarOpen: boolean
  drawerItem?: NavbarContextItem
  sidebarCloseRef: RefObject<HTMLButtonElement | null>
  drawerCloseRef: RefObject<HTMLButtonElement | null>
  items: NavbarItem[]
  activeHref?: string
  ariaLabel: string
  onDrawerClose: () => void
  onNavigate?: NavbarProps['onNavigate']
  onSidebarClose: () => void
  guestActionsContent?: ReactNode
  user?: NavbarUser
}

function isLinkItem(item: NavbarItem): item is NavbarLinkItem {
  return typeof item.href === 'string'
}

function isSectionItem(item: NavbarItem): item is NavbarSectionItem {
  return Array.isArray(item.children) && item.children.length > 0
}

function isNestedItem(item: NavbarItem): item is NavbarNestedItem {
  return !isLinkItem(item) && isSectionItem(item)
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
        'block truncate rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
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
  sidebarId,
  drawerId,
  sidebarOpen,
  drawerItem,
  sidebarCloseRef,
  drawerCloseRef,
  items,
  activeHref,
  ariaLabel,
  onDrawerClose,
  onNavigate,
  onSidebarClose,
  guestActionsContent,
  user,
}: NavbarMobilePanelProps) {
  const [openNestedItemId, setOpenNestedItemId] = useState<string | null>(null)
  const navigationItems = items.filter((item) => isLinkItem(item) || isSectionItem(item))
  const accountItems = user?.items?.filter((item) => typeof item.href === 'string') ?? []
  const drawerOpen = drawerItem !== undefined
  const surfaceOpen = sidebarOpen || drawerOpen
  const drawerHeadingId = `${drawerId}-heading`

  useEffect(() => {
    if (sidebarOpen) return

    const resetTimer = window.setTimeout(() => setOpenNestedItemId(null), 0)
    return () => window.clearTimeout(resetTimer)
  }, [sidebarOpen])

  return (
    <div className="lg:hidden">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-gray-900/50 transition-opacity duration-200 motion-reduce:transition-none',
          surfaceOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={drawerOpen ? onDrawerClose : onSidebarClose}
      />

      <aside
        id={sidebarId}
        data-navbar-mobile-sidebar
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-[360px] flex-col overflow-y-auto border-r border-border bg-surface shadow-soft transition-[transform,visibility] duration-200 motion-reduce:transition-none',
          sidebarOpen && !drawerOpen
            ? 'visible translate-x-0'
            : 'invisible -translate-x-full pointer-events-none',
        )}
        aria-label="Navigasi utama"
        aria-hidden={!sidebarOpen || drawerOpen}
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || openNestedItemId === null) return

          event.preventDefault()
          event.stopPropagation()
          const triggerId = openNestedItemId
          const sidebar = event.currentTarget
          setOpenNestedItemId(null)
          window.setTimeout(() => {
            const trigger = sidebar.querySelector<HTMLButtonElement>(
              `[data-navbar-mobile-section-id="${CSS.escape(triggerId)}"]`,
            )
            trigger?.focus()
          }, 0)
        }}
      >
        {sidebarOpen && (
          <>
            <div className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="truncate text-base font-bold text-content">Navigasi</h2>
              <button
                ref={sidebarCloseRef}
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-lg text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                aria-label="Tutup navigasi utama"
                onClick={onSidebarClose}
              >
                <Icon className="size-5">
                  <Close aria-hidden="true" focusable="false" />
                </Icon>
              </button>
            </div>

            <div className="space-y-5 px-4 py-5">
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
                          onClose={onSidebarClose}
                        />
                      </li>
                    )
                  }

                  if (!isNestedItem(item)) return null

                  const childActive = item.children.some(
                    (child) => !child.disabled && isActive(child, activeHref),
                  )
                  const parentActive = item.active ?? childActive
                  const expanded = openNestedItemId === item.id
                  const submenuId = `${sidebarId}-${encodeURIComponent(item.id)}-submenu`

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-navbar-mobile-section-id={item.id}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                          item.disabled
                            ? 'cursor-not-allowed text-content-subtle opacity-50'
                            : parentActive
                              ? 'bg-primary-50 text-brand'
                              : 'text-content hover:bg-surface-subtle hover:text-brand',
                        )}
                        disabled={item.disabled}
                        aria-expanded={expanded}
                        aria-controls={submenuId}
                        onClick={() => setOpenNestedItemId(expanded ? null : item.id)}
                      >
                        <span className="truncate">{item.label}</span>
                        <Icon className="size-4 shrink-0">
                          <ChevronRight aria-hidden="true" focusable="false" />
                        </Icon>
                      </button>

                      <ul id={submenuId} hidden={!expanded} className="mt-1 space-y-1 pl-4">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <MobileLink
                              item={child}
                              activeHref={activeHref}
                              onNavigate={onNavigate}
                              onClose={onSidebarClose}
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
              <p className="truncate text-sm font-bold text-content" title={user.name}>
                {user.name.trim() || 'Pengguna'}
              </p>

              {accountItems.length > 0 && (
                <ul className="space-y-1">
                  {accountItems.map((item) => (
                    <li key={item.id}>
                      <MobileLink
                        item={item}
                        activeHref={activeHref}
                        onNavigate={onNavigate}
                        onClose={onSidebarClose}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
            </div>
          </>
        )}
      </aside>

      <aside
        id={drawerId}
        data-navbar-mobile-drawer
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[88vw] max-w-[360px] flex-col overflow-y-auto border-l border-border bg-surface shadow-soft transition-[transform,visibility] duration-200 motion-reduce:transition-none',
          drawerOpen
            ? 'visible translate-x-0'
            : 'invisible translate-x-full pointer-events-none',
        )}
        aria-labelledby={drawerItem ? drawerHeadingId : undefined}
        aria-hidden={!drawerOpen}
      >
        {drawerItem && (
          <>
            <div className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 id={drawerHeadingId} className="truncate text-base font-bold text-content">
                {drawerItem.label}
              </h2>
              <button
                ref={drawerCloseRef}
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-lg text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                aria-label={`Tutup navigasi sekunder ${drawerItem.label}`}
                onClick={onDrawerClose}
              >
                <Icon className="size-5">
                  <Close aria-hidden="true" focusable="false" />
                </Icon>
              </button>
            </div>

            <nav className="px-4 py-5" aria-label={`Navigasi sekunder ${drawerItem.label}`}>
              <ul className="space-y-1">
                {drawerItem.children.map((child) => (
                  <li key={child.id}>
                    <MobileLink
                      item={child}
                      activeHref={activeHref}
                      onNavigate={onNavigate}
                      onClose={() => {
                        onDrawerClose()
                        if (sidebarOpen) onSidebarClose()
                      }}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </aside>
    </div>
  )
}
