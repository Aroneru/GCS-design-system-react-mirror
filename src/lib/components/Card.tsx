import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  image?: string
  imageAlt?: string
  title?: ReactNode
  description?: ReactNode
  href?: string
  linkLabel?: string
  /** Deretan tombol/aksi di bagian bawah kartu. */
  actions?: ReactNode
}

/**
 * Card — semua varian (dengan/tanpa gambar, tombol, tautan) terbentuk dari
 * bagian yang sama; cukup hilangkan bagian yang tidak dipakai.
 * @container: ukuran teks & jarak mengikuti lebar kartu, bukan lebar layar.
 */
export function Card({
  image,
  imageAlt = '',
  title,
  description,
  href,
  linkLabel,
  actions,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        '@container flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-soft',
        className,
      )}
      {...props}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="aspect-[5/4] w-full object-cover @xs:aspect-video"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-4 @xs:p-6">
        {title && (
          <h3 className="text-base leading-snug font-bold text-content @xs:text-xl">{title}</h3>
        )}

        {description && <p className="text-sm leading-6 text-content-subtle">{description}</p>}

        {href && (
          <a
            href={href}
            className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-bold text-brand transition-colors hover:text-brand-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {linkLabel ?? 'Selengkapnya'}
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 4h6v6m0-6-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
              />
            </svg>
          </a>
        )}

        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}

        {children}
      </div>
    </article>
  )
}
