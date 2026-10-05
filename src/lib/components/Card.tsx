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
  /** Tampilan gelap: kartu gray-800, judul putih, deskripsi gray-400, tautan primary-500. */
  darkMode?: boolean
}

/** Warna kartu, teks, dan tautan untuk tampilan terang dan gelap. */
const themes = {
  light: {
    card: 'border-border bg-surface',
    image: '',
    title: 'text-content',
    description: 'text-content-subtle',
    link: 'text-brand hover:text-brand-hover focus-visible:outline-primary-600',
  },
  dark: {
    card: 'border-gray-800 bg-gray-800',
    // Gambar sedikit diredupkan supaya tidak menyilaukan di atas kartu gelap.
    image: 'brightness-90',
    title: 'text-white',
    description: 'text-gray-400',
    // Mengikuti desain: primary-500 (~4,1:1 di atas gray-800). primary-700 bawaan
    // terang hanya ~2,3:1, jadi tidak terbaca di kartu gelap.
    link: 'text-primary-500 hover:text-primary-400 focus-visible:outline-primary-400',
  },
}

/**
 * Card — semua varian (dengan/tanpa gambar, tombol, tautan) terbentuk dari
 * bagian yang sama; cukup hilangkan bagian yang tidak dipakai.
 * @container: ukuran teks & jarak mengikuti lebar kartu, bukan lebar layar.
 *
 * `darkMode` mengganti kartu, teks, dan tautan ke tampilan gelap. Tombol di
 * `actions` tidak ikut diubah — warnanya tetap urusan halaman pemakai.
 */
export function Card({
  image,
  imageAlt = '',
  title,
  description,
  href,
  linkLabel,
  actions,
  darkMode = false,
  className,
  children,
  ...props
}: CardProps) {
  const theme = darkMode ? themes.dark : themes.light

  return (
    <article
      className={cn(
        '@container flex flex-col overflow-hidden rounded-lg border shadow-soft',
        theme.card,
        className,
      )}
      {...props}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className={cn('aspect-[5/4] w-full object-cover @xs:aspect-video', theme.image)}
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-4 @xs:p-6">
        {title && (
          <h3 className={cn('text-base leading-snug font-bold @xs:text-xl', theme.title)}>
            {title}
          </h3>
        )}

        {description && <p className={cn('text-sm leading-6', theme.description)}>{description}</p>}

        {href && (
          <a
            href={href}
            className={cn(
              'inline-flex w-fit items-center gap-1.5 rounded text-sm font-bold transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2',
              theme.link,
            )}
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
