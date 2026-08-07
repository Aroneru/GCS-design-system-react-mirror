import { useEffect, useRef } from 'react'
import type { NavbarItem, NavbarProps, NavbarSubItem } from '../Navbar'
import { Icon } from '../Icon'
import { cn } from '../../utils/cn'

type NavbarLinkItem = Extract<NavbarItem, { href: string }>
type NavbarSubmenuItem = Extract<NavbarItem, { children: NavbarSubItem[] }>

interface NavbarNavigationProps {
  items: NavbarItem[]
  activeHref?: string
  ariaLabel: string
  idPrefix: string
  openMenuId: string | null
  onOpenMenuChange: (itemId: string | null) => void
  onNavigate?: NavbarProps['onNavigate']
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

export function NavbarNavigation({
  items,
  activeHref,
  ariaLabel,
  idPrefix,
  openMenuId,
  onOpenMenuChange,
  onNavigate,
}: NavbarNavigationProps) {
  const navigationRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>())
  const navigationItems = items.filter(
    (item) => isLinkItem(item) || (isSubmenuItem(item) && item.children.length > 0),
  )

  useEffect(() => {
    if (
      openMenuId !== null &&
      !navigationItems.some((item) => isSubmenuItem(item) && item.id === openMenuId)
    ) {
      onOpenMenuChange(null)
    }
  }, [navigationItems, onOpenMenuChange, openMenuId])

  useEffect(() => {
    if (openMenuId === null) return

    const closeFromOutside = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) onOpenMenuChange(null)
    }

    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      const trigger = triggerRefs.current.get(openMenuId)
      onOpenMenuChange(null)
      trigger?.focus()
    }

    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeFromEscape)

    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeFromEscape)
    }
  }, [onOpenMenuChange, openMenuId])

  if (navigationItems.length === 0) return null

  return (
    <nav ref={navigationRef} className="hidden w-fit shrink-0 lg:block" aria-label={ariaLabel}>
      <ul className="flex w-max items-center gap-2 xl:gap-4">
        {navigationItems.map((item) => {
          if (isLinkItem(item)) {
            const active = isActive(item, activeHref)

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={cn(
                    'block max-w-xs truncate rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
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
                  }}
                  {...(item.external
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  {item.label}
                </a>
              </li>
            )
          }

          if (!isSubmenuItem(item)) return null

          const childActive = item.children.some(
            (child) => !child.disabled && isActive(child, activeHref),
          )
          const parentActive = item.active ?? childActive
          const expanded = openMenuId === item.id
          const submenuId = `${idPrefix}-${encodeURIComponent(item.id)}-submenu`

          return (
            <li key={item.id} className="relative">
              <button
                ref={(node) => {
                  if (node) triggerRefs.current.set(item.id, node)
                  else triggerRefs.current.delete(item.id)
                }}
                type="button"
                className={cn(
                  'flex max-w-xs items-center gap-1.5 truncate rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                  item.disabled
                    ? 'cursor-not-allowed text-content-subtle opacity-50'
                    : parentActive
                      ? 'bg-primary-50 text-brand'
                      : 'text-content hover:bg-surface-subtle hover:text-brand',
                )}
                disabled={item.disabled}
                aria-expanded={expanded}
                aria-controls={submenuId}
                onClick={() => onOpenMenuChange(expanded ? null : item.id)}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" />
                  </svg>
                </Icon>
              </button>

              <ul
                id={submenuId}
                hidden={!expanded}
                className="absolute top-full right-0 z-20 mt-2 w-64 rounded-lg border border-border bg-surface p-2 shadow-soft"
              >
                {item.children.map((child) => {
                  const active = isActive(child, activeHref)

                  return (
                    <li key={child.id}>
                      <a
                        href={child.href}
                        className={cn(
                          'block truncate rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                          child.disabled
                            ? 'cursor-not-allowed text-content-subtle opacity-50'
                            : active
                              ? 'bg-primary-50 text-brand'
                              : 'text-content hover:bg-surface-subtle hover:text-brand',
                        )}
                        aria-current={!child.disabled && active ? 'page' : undefined}
                        aria-disabled={child.disabled || undefined}
                        tabIndex={child.disabled ? -1 : undefined}
                        onClick={(event) => {
                          if (child.disabled) {
                            event.preventDefault()
                            return
                          }

                          onNavigate?.(child, event)
                          onOpenMenuChange(null)
                        }}
                        {...(child.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {child.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
