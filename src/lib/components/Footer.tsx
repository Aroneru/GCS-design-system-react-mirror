import { type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Icon } from './Icon'

export interface FooterMenu {
  label: string
  url?: string
}

export interface FooterSocial {
  label?: string
  url?: string
  /** Elemen <svg> ikon (currentColor). */
  icon: ReactNode
}

export interface FooterProps {
  logo?: string
  logoAlt?: string
  /** Dipakai jika `logo` tidak diisi. */
  logoContent?: ReactNode
  menus?: FooterMenu[]
  copyright?: ReactNode
  socials?: FooterSocial[]
  className?: string
}

/** Footer — @container: tata letak mengikuti lebar footer, bukan viewport. */
export function Footer({
  logo,
  logoAlt = 'Logo',
  logoContent,
  menus = [],
  copyright,
  socials = [],
  className,
}: FooterProps) {
  return (
    <footer className={cn('@container bg-gray-800 text-gray-300', className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 @3xl:px-12">
        <div className="flex flex-col gap-7 @3xl:flex-row @3xl:items-center @3xl:gap-12">
          <div className="shrink-0">
            {logo ? (
              <img src={logo} alt={logoAlt} className="h-10 w-auto @3xl:h-11" />
            ) : (
              logoContent
            )}
          </div>

          {menus.length > 0 && (
            <nav className="@3xl:flex @3xl:flex-1 @3xl:justify-center" aria-label="Navigasi footer">
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                {menus.map((menu, i) => (
                  <li key={i}>
                    <a
                      href={menu.url ?? '#'}
                      className="rounded transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {menu.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <hr className="border-white/15" />

        <div className="flex flex-col gap-6 @xl:flex-row @xl:items-center @xl:justify-between">
          {copyright && <p className="text-sm">{copyright}</p>}

          {socials.length > 0 && (
            <ul className="flex items-center gap-5">
              {socials.map((social, i) => {
                const url = social.url ?? '#'
                const external = url !== '#'
                return (
                  <li key={i}>
                    <a
                      href={url}
                      className="block rounded text-gray-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      aria-label={social.label ?? 'Media sosial'}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <Icon className="size-5.5">{social.icon}</Icon>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
