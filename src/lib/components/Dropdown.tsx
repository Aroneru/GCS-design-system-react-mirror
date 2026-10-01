import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

/** Warna semantik satu aksi. */
export type DropdownItemTone = 'default' | 'danger'

/** Satu aksi di dalam panel. */
export interface DropdownItem {
  id?: string
  label: ReactNode
  /** Baris kedua di bawah label, untuk aksi yang perlu penjelasan singkat. */
  description?: ReactNode
  /** Ikon kecil di kiri label. Ukurannya diatur komponen. */
  icon?: ReactNode
  /** Bila diisi, aksinya dirender sebagai tautan. */
  href?: string
  onClick?: () => void
  tone?: DropdownItemTone
  disabled?: boolean
}

/** Kelompok aksi; `separator` menambahkan pemisah sebelum kelompok ini. */
export interface DropdownGroup {
  id: string
  label?: string
  separator?: boolean
  items: DropdownItem[]
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Elemen yang membuka panel — satu `<button>` milik Anda, biasanya `Button`.
   * Komponen ini menyalinnya untuk memasang atribut Popover, jadi yang dikirim
   * harus satu elemen tunggal, bukan teks atau pecahan.
   */
  trigger: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
  /** Daftar aksi tanpa pengelompokan. */
  items?: DropdownItem[]
  /** Aksi terkelompok, lengkap dengan label dan pemisah antar-kelompok. */
  groups?: DropdownGroup[]
  /**
   * Isi panel bila bukan daftar aksi — form kecil, daftar panjang yang
   * digulir, apa pun. Diabaikan selama `items` atau `groups` masih terisi.
   */
  children?: ReactNode
  /** Kelas untuk panelnya. `className` sendiri menuju pembungkus terluar. */
  contentClassName?: string
}

const tones: Record<DropdownItemTone, string> = {
  default: 'text-gray-700 hover:bg-gray-100',
  danger: 'text-red-600 hover:bg-red-50',
}

/**
 * Dropdown — panel aksi yang dibuka dari sebuah tombol.
 *
 * Isinya ditentukan prop, bukan subkomponen: `trigger` untuk tombolnya,
 * `items` atau `groups` untuk daftar aksinya. Itu mengikuti komponen lain di
 * kit ini — Sidebar memakai `items` + `groups` dengan `separator` yang sama
 * persis artinya, Select memakai `options` — sehingga tidak ada satu komponen
 * pun yang dipakai dengan cara yang berbeda dari tetangganya.
 *
 * Visibilitasnya diurus HTML Popover API: peramban yang menutup panel saat
 * pengguna menekan di luar atau menekan Escape, mengangkatnya ke top layer,
 * dan menjaga urutan fokus. Tidak ada state buka/tutup di sini, jadi tidak ada
 * pula yang bisa melenceng dari keadaan sebenarnya.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  { trigger, items, groups, children, className, contentClassName, ...props },
  ref,
) {
  const contentId = useId()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Menutup panel setelah sebuah aksi dijalankan. Dicek dulu apakah ia memang
  // sedang terbuka: `hidePopover()` pada panel yang tertutup melempar.
  const tutup = useCallback((pulihkanFokus = false) => {
    const panel = contentRef.current
    if (!panel?.isConnected || !panel.matches(':popover-open')) return

    const fokusMasihDiPanel = pulihkanFokus && panel.contains(document.activeElement)
    const pemicu = triggerRef.current

    panel.hidePopover()

    if (fokusMasihDiPanel && pemicu instanceof HTMLButtonElement && pemicu.isConnected) {
      pemicu.focus()
    }
  }, [])

  if (!isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(trigger)) {
    throw new Error('Dropdown memerlukan satu elemen <button> yang valid pada prop `trigger`.')
  }

  const daftar: DropdownGroup[] = groups ?? (items ? [{ id: 'utama', items }] : [])
  const pakaiDaftar = daftar.length > 0

  const renderItem = (item: DropdownItem) => {
    const tone = item.tone ?? 'default'
    const isi = (
      <>
        {item.icon && (
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center [&_svg]:size-3.5',
              tone === 'default' && 'text-gray-500',
            )}
          >
            {item.icon}
          </span>
        )}

        {item.description ? (
          <span className="min-w-0 flex-1 break-words">
            <span className="block">{item.label}</span>
            <span className="mt-0.5 block text-xs font-normal text-gray-500">
              {item.description}
            </span>
          </span>
        ) : (
          <span className="min-w-0 flex-1 break-words">{item.label}</span>
        )}
      </>
    )

    const kelas = cn(
      'flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm leading-normal font-medium transition-colors',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
      'disabled:cursor-not-allowed disabled:opacity-50',
      tones[tone],
    )

    // Aksi yang berpindah halaman dirender sebagai tautan supaya bisa dibuka
    // di tab baru dan disalin alamatnya. Yang dimatikan tetap <button>: <a>
    // tanpa href tidak punya keadaan disabled yang berarti.
    if (item.href && !item.disabled) {
      return (
        <a href={item.href} className={kelas} onClick={() => { item.onClick?.(); tutup() }}>
          {isi}
        </a>
      )
    }

    return (
      <button
        type="button"
        disabled={item.disabled}
        className={kelas}
        onClick={() => { item.onClick?.(); tutup(true) }}
      >
        {isi}
      </button>
    )
  }

  return (
    <div ref={ref} className={cn('relative inline-block', className)} {...props}>
      {cloneElement(trigger, {
        popoverTarget: contentId,
        popoverTargetAction: 'toggle',
        onClick: (event) => {
          triggerRef.current = event.currentTarget
          trigger.props.onClick?.(event)
        },
      })}

      <div
        ref={contentRef}
        id={contentId}
        popover="auto"
        className={cn(
          'fixed inset-auto mt-2 mr-0 mb-0 ml-0 [width:min(anchor-size(width),calc(100vw-1rem))] max-w-[calc(100vw-1rem)] [position-area:bottom_center] rounded-lg bg-surface text-content shadow-md',
          pakaiDaftar && 'py-1',
          contentClassName,
        )}
      >
        {pakaiDaftar
          ? daftar.map((group) => (
              <div key={group.id}>
                {group.separator && (
                  <hr aria-hidden="true" className="my-1 border-0 border-t border-border" />
                )}
                {group.label && (
                  <p className="px-4 pt-2 pb-1 text-caption font-bold tracking-wide text-gray-400 uppercase">
                    {group.label}
                  </p>
                )}
                {group.items.map((item, i) => (
                  <div key={item.id ?? i}>{renderItem(item)}</div>
                ))}
              </div>
            ))
          : children}
      </div>
    </div>
  )
})

Dropdown.displayName = 'Dropdown'
