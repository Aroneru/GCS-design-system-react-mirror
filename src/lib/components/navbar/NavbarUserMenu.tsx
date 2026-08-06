import { useEffect, useRef, useState } from 'react'
import type { NavbarProps, NavbarSubItem, NavbarUser } from '../Navbar'
import { Icon } from '../Icon'
import { cn } from '../../utils/cn'

interface NavbarUserMenuProps {
  user: NavbarUser
  activeHref?: string
  menuId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate?: NavbarProps['onNavigate']
}

function getInitials(user: NavbarUser) {
  const explicitInitials = user.initials?.trim()

  if (explicitInitials) return Array.from(explicitInitials).slice(0, 2).join('').toUpperCase()

  const nameParts = user.name.trim().split(/\s+/).filter(Boolean)

  if (nameParts.length === 0) return '?'

  const firstInitial = Array.from(nameParts[0])[0] ?? ''
  const lastInitial = Array.from(nameParts.at(-1) ?? '')[0] ?? ''

  return (nameParts.length === 1 ? firstInitial : `${firstInitial}${lastInitial}`).toUpperCase()
}

function isActive(item: NavbarSubItem, activeHref?: string) {
  return item.active ?? item.href === activeHref
}

export function NavbarUserMenu({
  user,
  activeHref,
  menuId,
  open,
  onOpenChange,
  onNavigate,
}: NavbarUserMenuProps) {
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const displayName = user.name.trim() || 'Pengguna'
  const initials = getInitials(user)
  const showImage = Boolean(user.avatarSrc && failedAvatarSrc !== user.avatarSrc)
  const accountItems = user.items?.filter((item) => typeof item.href === 'string') ?? []
  const hasMenu = accountItems.length > 0

  useEffect(() => {
    if (!hasMenu && open) onOpenChange(false)
  }, [hasMenu, onOpenChange, open])

  useEffect(() => {
    if (!open || !hasMenu) return

    const closeFromOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false)
    }

    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      onOpenChange(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeFromEscape)

    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeFromEscape)
    }
  }, [hasMenu, onOpenChange, open])

  const avatar = (compact: boolean) => (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-subtle text-sm font-bold text-content">
      {showImage ? (
        <img
          src={user.avatarSrc}
          alt={compact ? (user.avatarAlt?.trim() || displayName) : ''}
          className="size-full object-cover"
          onError={() => setFailedAvatarSrc(user.avatarSrc ?? null)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  )

  return (
    <div ref={rootRef} className="relative ml-auto min-w-0 shrink-0">
      <div className="lg:hidden">
        {avatar(true)}
        {!showImage && <span className="sr-only">{displayName}</span>}
      </div>

      {!hasMenu ? (
        <div className="hidden min-w-0 items-center gap-3 lg:flex">
          {avatar(false)}
          <span className="max-w-40 truncate text-sm font-bold text-content" title={displayName}>
            {displayName}
          </span>
        </div>
      ) : (
        <>
          <button
            ref={triggerRef}
            type="button"
            className="hidden min-w-0 items-center gap-2 rounded-lg p-1.5 text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:flex"
            aria-label={`${open ? 'Tutup' : 'Buka'} menu akun ${displayName}`}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => onOpenChange(!open)}
          >
            {avatar(false)}
            <span className="max-w-40 truncate text-sm font-bold" title={displayName}>
              {displayName}
            </span>
            <Icon
              className={cn(
                'size-4 shrink-0 transition-transform motion-reduce:transition-none',
                open && 'rotate-180',
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
            id={menuId}
            hidden={!open}
            className="absolute top-full right-0 z-20 mt-2 hidden w-64 rounded-lg border border-border bg-surface p-2 shadow-soft lg:block"
          >
            {accountItems.map((item) => {
              const active = isActive(item, activeHref)

              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={cn(
                      'block truncate rounded-md px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
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
                      onOpenChange(false)
                    }}
                    {...(item.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
