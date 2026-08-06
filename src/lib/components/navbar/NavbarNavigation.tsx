import type { NavbarItem, NavbarProps } from '../Navbar'
import { cn } from '../../utils/cn'

type NavbarLinkItem = Extract<NavbarItem, { href: string }>

interface NavbarNavigationProps {
  items: NavbarItem[]
  activeHref?: string
  ariaLabel: string
  onNavigate?: NavbarProps['onNavigate']
}

function isLinkItem(item: NavbarItem): item is NavbarLinkItem {
  return typeof item.href === 'string'
}

export function NavbarNavigation({
  items,
  activeHref,
  ariaLabel,
  onNavigate,
}: NavbarNavigationProps) {
  const linkItems = items.filter(isLinkItem)

  if (linkItems.length === 0) return null

  return (
    <nav className="hidden min-w-0 flex-1 lg:block" aria-label={ariaLabel}>
      <ul className="flex min-w-0 items-center justify-end gap-2">
        {linkItems.map((item) => {
          const active = item.active ?? item.href === activeHref

          return (
            <li key={item.id} className="min-w-0">
              <a
                href={item.href}
                className={cn(
                  'block max-w-xs truncate rounded-md px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
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
        })}
      </ul>
    </nav>
  )
}
