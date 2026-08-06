import { useState } from 'react'
import type { NavbarUser } from '../Navbar'

interface NavbarUserMenuProps {
  user: NavbarUser
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

export function NavbarUserMenu({ user }: NavbarUserMenuProps) {
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null)
  const displayName = user.name.trim() || 'Pengguna'
  const initials = getInitials(user)
  const showImage = Boolean(user.avatarSrc && failedAvatarSrc !== user.avatarSrc)

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
    <div className="ml-auto min-w-0 shrink-0">
      <div className="lg:hidden">
        {avatar(true)}
        {!showImage && <span className="sr-only">{displayName}</span>}
      </div>

      <div className="hidden min-w-0 items-center gap-3 lg:flex">
        {avatar(false)}
        <span className="max-w-40 truncate text-sm font-bold text-content" title={displayName}>
          {displayName}
        </span>
      </div>
    </div>
  )
}
