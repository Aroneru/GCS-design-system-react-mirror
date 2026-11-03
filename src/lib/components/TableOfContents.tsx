import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { Bars, ChevronDown } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { Drawer, DrawerBody, DrawerHeader, DrawerTitle } from './Drawer'

/** Satu entri daftar isi. `id` sama dengan `id` bagian yang dituju di halaman. */
export interface TableOfContentsItem {
  id: string
  label: ReactNode
  /** Alamat tautan. Bawaannya hasil `getHref`, atau `#id`. */
  href?: string
}

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Daftar bagian. Scroll-spy hanya dipasang ulang bila urutan `id` berubah,
   * jadi array baru tiap render tidak masalah.
   */
  items: TableOfContentsItem[]
  /** Judul di atas daftar. Bawaan: "On this page". Isi `null` untuk menyembunyikan. */
  title?: ReactNode
  /**
   * Mode terkontrol: entri yang disorot. Tanpa prop ini, entri disorot otomatis
   * sesuai bagian yang sedang dibaca (scroll-spy).
   */
  activeId?: string
  /** Dipanggil saat scroll-spy memindahkan sorotan. */
  onActiveChange?: (id: string) => void
  /** Matikan scroll-spy bawaan. Bawaan: true. */
  scrollSpy?: boolean
  /**
   * Jarak dari tepi atas layar (px) tempat bagian dianggap mulai dibaca,
   * mis. tinggi navbar yang menempel. Bawaan: 96.
   */
  offset?: number
  /**
   * Membentuk alamat tiap entri. Berguna untuk router hash, mis.
   * `(id) => \`#/halaman#${id}\``. Bawaan: `#id`.
   */
  getHref?: (id: string) => string
  /** Dipanggil saat entri diklik, sebelum tautan berjalan. */
  onItemClick?: (item: TableOfContentsItem, event: MouseEvent<TableOfContentsItemElement>) => void
  /**
   * Entri berupa tautan `<a href>` yang melompat ke bagiannya, dengan
   * scroll-spy. Bawaan: true. `false` menjadikan entri `<button>` biasa:
   * klik hanya memindahkan sorotan, tanpa berpindah atau menggulir, dan
   * scroll-spy tidak dipasang. Pakai `onItemClick` atau `onActiveChange`
   * untuk menanggapi pilihannya sendiri.
   */
  anchor?: boolean
  /** Sama dengan memasang `data-theme="dark"`. Tanpa prop ini komponen ikut tema pembungkusnya. */
  darkMode?: boolean
  /**
   * Tinggi maksimum daftar, mis. `320` atau `'calc(100vh - 8rem)'`. Bila
   * entrinya lebih panjang, daftar bisa digulir sendiri dan entri aktif selalu
   * digulirkan ke dalam pandangan.
   */
  maxHeight?: CSSProperties['maxHeight']
  /**
   * Wadah yang menggulir isi halaman, bila bukan window, mis. panel dengan
   * `overflow-y-auto`. Scroll-spy membaca posisi di dalam wadah ini, dan klik
   * entri menggulir wadahnya tanpa mengubah alamat halaman.
   */
  scrollContainer?: RefObject<HTMLElement | null>
  /**
   * Bentuk tampilan.
   * - `auto` (bawaan): di bawah breakpoint `lg` (1024px) jadi tombol yang
   *   membuka Drawer dari kanan dengan teks 14px; mulai `lg` daftar biasa 12px.
   * - `list`: selalu daftar biasa.
   * - `drawer`: selalu tombol + Drawer.
   */
  layout?: TableOfContentsLayout
  /**
   * Drawer muncul di dalam pembungkus terdekat yang `relative`, bukan menutupi
   * seluruh layar. Untuk pratinjau di dalam bingkai, mis. playground atau
   * mockup ponsel. Panel ini tidak modal: halaman di luar bingkai tetap aktif.
   */
  drawerContained?: boolean
}

export type TableOfContentsLayout = 'auto' | 'list' | 'drawer'

/** Elemen entri: `<a>` saat `anchor` (bawaan), `<button>` saat `anchor={false}`. */
export type TableOfContentsItemElement = HTMLAnchorElement | HTMLButtonElement

/** Menyorot bagian yang paling atas di pita sempit di bawah tepi atas layar atau wadah. */
function useScrollSpy(
  ids: string[],
  offset: number,
  enabled: boolean,
  container?: RefObject<HTMLElement | null>,
) {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return
    const root = container?.current ?? null
    const observer = new IntersectionObserver(
      (entries) => {
        // Saat menggulir cepat bisa ada beberapa judul yang masuk sekaligus;
        // yang paling atas di layar itulah yang sedang dibaca.
        const masuk = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (masuk.length) setActive(masuk[0].target.id)
      },
      { root, rootMargin: `-${offset}px 0px -72% 0px` },
    )
    const idList = key.split('|').filter(Boolean)
    idList.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // Di ujung bawah wadah, bagian terakhir yang pendek tidak pernah sampai ke
    // pita atas; sorot bagian terakhir begitu wadahnya mentok. Event scroll bisa
    // datang berkali-kali per frame dan pengecekannya membaca layout, jadi
    // dijalankan paling banyak sekali per frame.
    const last = idList[idList.length - 1]
    const target: HTMLElement | Window = root ?? window
    let frame = 0
    const check = () => {
      frame = 0
      const el = root ?? document.documentElement
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 2) setActive(last)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    if (last) target.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      target.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [key, offset, enabled, container])

  return active
}

/**
 * Garis brand 2px di rel kiri yang meluncur ke entri aktif.
 *
 * Diukur dari tautan ber-`aria-current` di daftar, jadi tetap pas walau label
 * memanjang dua baris. ResizeObserver mengukur ulang saat daftar berubah
 * ukuran, termasuk saat baru terlihat (Drawer terbuka, breakpoint berganti).
 * Ukuran pertama dipasang tanpa transisi supaya garisnya tidak meluncur dari
 * atas daftar saat halaman dimuat.
 */
function ActiveIndicator({
  listRef,
  active,
  remeasureKey,
}: {
  listRef: RefObject<HTMLUListElement | null>
  active: string
  remeasureKey?: unknown
}) {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)
  const [animate, setAnimate] = useState(false)
  const frame = useRef(0)

  // Satu fungsi ukur untuk dua pemicu di bawah. State hanya diganti bila
  // nilainya benar-benar berubah, supaya ResizeObserver yang sering menembak
  // tidak memicu render kosong.
  const measure = useCallback(() => {
    const link = listRef.current?.querySelector<HTMLElement>('[aria-current]')
    if (!link || !link.offsetHeight) {
      setBox(null)
      setAnimate(false)
      return
    }
    const top = link.offsetTop
    const height = link.offsetHeight
    setBox((prev) => (prev && prev.top === top && prev.height === height ? prev : { top, height }))
    // Transisi baru dinyalakan sekali, setelah posisi pertama terpasang.
    if (!animate && !frame.current) {
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        setAnimate(true)
      })
    }
  }, [listRef, animate])

  // Entri aktif berganti: ukur sebelum dilukis supaya garisnya tidak berkedip.
  // `active` dan `remeasureKey` sengaja jadi dependensi: keduanya mengubah DOM
  // yang diukur walau tidak dibaca langsung di sini.
  useLayoutEffect(() => measure(), [measure, active, remeasureKey])

  // Ukuran daftar berubah (breakpoint, font termuat, Drawer terbuka). Observer
  // tidak dipasang ulang tiap kali entri aktif berganti; hanya sekali lagi saat
  // `animate` menyala, karena `measure` ikut berganti.
  useEffect(() => {
    const list = listRef.current
    if (!list || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [listRef, measure])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  if (!box) return null
  return (
    <li
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-0 -left-px w-0.5 rounded-full bg-brand',
        animate &&
          'transition-[transform,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      )}
      style={{ height: box.height, transform: `translateY(${box.top}px)` }}
    />
  )
}

/**
 * TableOfContents — daftar isi "On this page" untuk halaman panjang.
 *
 * Lebar 208px, latar `toc-surface` (gray-50, gray-800 di tema gelap), garis
 * rel di kiri, dan entri aktif ditandai garis brand 2px. Warnanya dari token,
 * jadi tema gelap cukup lewat `data-theme="dark"` atau prop `darkMode`.
 *
 * Komponen ini tidak menempel sendiri; bungkus dengan `sticky top-*` bila
 * perlu. Bagian yang dituju sebaiknya diberi `scroll-mt-*` supaya judulnya
 * tidak tertutup navbar.
 */
export function TableOfContents({
  items,
  title = 'On this page',
  activeId,
  onActiveChange,
  scrollSpy = true,
  offset = 96,
  getHref,
  onItemClick,
  darkMode,
  maxHeight,
  scrollContainer,
  layout = 'auto',
  drawerContained = false,
  anchor = true,
  className,
  'aria-label': ariaLabel = 'Daftar isi halaman',
  ...props
}: TableOfContentsProps) {
  const controlled = activeId !== undefined
  // Tanpa anchor tidak ada bagian yang dituju, jadi scroll-spy tidak dipasang;
  // sorotan cukup mengikuti entri yang terakhir diklik.
  const spied = useScrollSpy(
    items.map((i) => i.id),
    offset,
    anchor && scrollSpy && !controlled,
    scrollContainer,
  )
  const [selected, setSelected] = useState(items[0]?.id ?? '')
  const internal = anchor ? spied : selected
  const active = controlled ? activeId : internal
  const listRef = useRef<HTMLUListElement>(null)

  // Daftar yang bisa digulir mengikuti entri aktif. scrollTop diatur langsung,
  // bukan scrollIntoView, supaya halamannya sendiri tidak ikut tergulir.
  useEffect(() => {
    const list = listRef.current
    if (!list || list.scrollHeight <= list.clientHeight) return
    const link = list.querySelector<HTMLElement>('[aria-current]')
    if (!link) return
    const top = link.offsetTop - list.offsetTop
    if (top < list.scrollTop) list.scrollTop = top
    else if (top + link.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = top + link.offsetHeight - list.clientHeight
  }, [active])

  /** Menggulir wadah `scrollContainer` sampai bagiannya tepat di bawah `offset`. */
  const scrollContainerTo = (root: HTMLElement, el: HTMLElement) => {
    root.scrollTo({
      top: el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - offset + 1,
      behavior: 'smooth',
    })
  }

  const handleClick = (item: TableOfContentsItem, event: MouseEvent<TableOfContentsItemElement>) => {
    onItemClick?.(item, event)
    if (!anchor) {
      if (!event.defaultPrevented) setSelected(item.id)
      return
    }
    const root = scrollContainer?.current
    if (event.defaultPrevented || !root) return
    const el = document.getElementById(item.id)
    if (!el) return
    event.preventDefault()
    scrollContainerTo(root, el)
  }

  useEffect(() => {
    if (!controlled && internal) onActiveChange?.(internal)
    // onActiveChange sengaja tidak masuk dependensi supaya fungsi inline
    // tidak memicu panggilan ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internal, controlled])

  const [drawerOpen, setDrawerOpen] = useState(false)
  // Daftar di Drawer baru dirender setelah Drawer pertama kali dibuka. Dengan
  // layout auto di desktop, Drawer tidak pernah dibuka, jadi tidak ada daftar
  // kembar tersembunyi beserta observer-nya. Setelah sekali dibuka daftarnya
  // dibiarkan, supaya animasi tutupnya tetap berisi.
  const [drawerUsed, setDrawerUsed] = useState(false)
  const openDrawer = () => {
    setDrawerUsed(true)
    setDrawerOpen(true)
  }
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const drawerListRef = useRef<HTMLUListElement>(null)
  const drawerTitleId = useId()

  const closeDrawer = () => setDrawerOpen(false)

  // Panel di dalam bingkai: fokus pindah ke panel begitu terbuka, dan kembali
  // ke tombol pembukanya saat tertutup. Drawer asli mengurus ini sendiri lewat
  // <dialog>. `drawerUsed` mencegah tombolnya difokus saat pertama dimuat.
  useEffect(() => {
    if (!drawerContained || !drawerUsed) return
    if (drawerOpen) panelRef.current?.focus()
    else triggerRef.current?.focus()
  }, [drawerContained, drawerOpen, drawerUsed])
  const hrefOf = (item: TableOfContentsItem) => item.href ?? getHref?.(item.id) ?? `#${item.id}`
  const activeItem = items.find((i) => i.id === active)

  /** Berpindah ke bagian setelah Drawer tertutup; lihat handleDrawerClick. */
  const goTo = (item: TableOfContentsItem) => {
    const root = scrollContainer?.current
    const el = document.getElementById(item.id)
    const href = hrefOf(item)
    if (root && el) {
      scrollContainerTo(root, el)
    } else if (!href.startsWith('#') || window.location.hash !== href) {
      // Untuk alamat `#…` ini navigasi di halaman yang sama dan memicu hashchange.
      window.location.assign(href)
    } else {
      // Alamat yang sama tidak memicu hashchange, jadi gulir langsung.
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  /**
   * Tautan di Drawer tidak dibiarkan berjalan sendiri: selama dialog modal
   * terbuka, halaman di belakangnya tidak bisa digulir. Drawer ditutup dulu,
   * baru berpindah ke bagiannya.
   */
  const handleDrawerClick = (item: TableOfContentsItem, event: MouseEvent<TableOfContentsItemElement>) => {
    onItemClick?.(item, event)
    const handled = event.defaultPrevented
    event.preventDefault()
    closeDrawer()
    if (handled) return
    if (anchor) setTimeout(() => goTo(item), 0)
    else setSelected(item.id)
  }

  const renderList = (variant: 'inline' | 'drawer') => (
    <ul
      ref={variant === 'inline' ? listRef : drawerListRef}
      style={variant === 'inline' && maxHeight !== undefined ? { maxHeight } : undefined}
      className={cn(
        'relative border-l border-border',
        variant === 'inline' && maxHeight !== undefined && 'overflow-y-auto overscroll-contain',
        variant === 'inline' && title !== null && 'mt-3',
      )}
    >
      {items.map((item) => {
        const isActive = item.id === active
        const onClick = (event: MouseEvent<TableOfContentsItemElement>) =>
          variant === 'inline' ? handleClick(item, event) : handleDrawerClick(item, event)
        const itemClass = cn(
          '-ml-px block w-full border-l-2 pl-3.5 text-left transition-colors',
          // Desktop 12px; di Drawer 14px dengan baris 40px supaya mudah disentuh.
          variant === 'inline' ? 'py-1.5 text-xs leading-5' : 'py-2.5 text-sm leading-5',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand',
          // Garis brand entri aktif digambar ActiveIndicator supaya bisa
          // meluncur; garisnya sendiri cukup untuk hover.
          isActive
            ? 'border-transparent text-brand'
            : 'border-transparent text-content-subtle hover:border-border-strong hover:text-content',
        )
        return (
          <li key={item.id}>
            {anchor ? (
              <a
                href={hrefOf(item)}
                onClick={onClick}
                aria-current={isActive ? 'location' : undefined}
                className={itemClass}
              >
                {item.label}
              </a>
            ) : (
              // Tanpa anchor entri tidak menuju ke mana pun, jadi tombol, bukan
              // tautan: tidak ada alamat palsu yang bisa disalin atau dibuka.
              <button
                type="button"
                onClick={onClick}
                aria-current={isActive ? 'true' : undefined}
                className={itemClass}
              >
                {item.label}
              </button>
            )}
          </li>
        )
      })}
      <ActiveIndicator
        listRef={variant === 'inline' ? listRef : drawerListRef}
        active={active}
        // Daftar di Drawer baru punya ukuran setelah panelnya terbuka.
        remeasureKey={variant === 'drawer' ? drawerOpen : undefined}
      />
    </ul>
  )

  return (
    <nav
      data-theme={darkMode ? 'dark' : undefined}
      aria-label={ariaLabel}
      className={cn(
        'bg-toc-surface transition-colors duration-300',
        layout === 'auto' && 'w-full lg:w-52',
        layout === 'list' && 'w-52',
        layout === 'drawer' && 'w-full',
        className,
      )}
      {...props}
    >
      {layout !== 'list' && (
        <>
          <button
            ref={triggerRef}
            type="button"
            onClick={openDrawer}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-left text-sm text-content transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              layout === 'auto' && 'lg:hidden',
            )}
          >
            <Bars className="size-4 shrink-0 text-content-muted" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">
              {title !== null && <span className="sr-only">{title}: </span>}
              {activeItem?.label ?? title}
            </span>
            <ChevronDown className="size-4 shrink-0 text-content-muted" aria-hidden="true" />
          </button>

          {drawerContained ? (
            /*
              Drawer asli memakai <dialog> + showModal(), yang selalu naik ke top
              layer dan menutupi seluruh layar. Versi ini panel biasa yang
              menempel di pembungkus `relative` terdekat; isinya tetap memakai
              DrawerHeader dan DrawerBody supaya tampilannya sama.
            */
            <div
              className={cn(
                'absolute inset-0 z-20 overflow-hidden rounded-[inherit] transition-[visibility] duration-300',
                drawerOpen ? 'visible' : 'invisible',
                layout === 'auto' && 'lg:hidden',
              )}
              inert={!drawerOpen}
            >
              <div
                aria-hidden="true"
                onClick={closeDrawer}
                className={cn(
                  'absolute inset-0 bg-gray-900/50 transition-opacity duration-300',
                  drawerOpen ? 'opacity-100' : 'opacity-0',
                )}
              />
              <div
                ref={panelRef}
                role="dialog"
                aria-labelledby={drawerTitleId}
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation()
                    closeDrawer()
                  }
                }}
                className={cn(
                  'absolute inset-y-0 right-0 flex w-64 max-w-[85%] flex-col bg-surface text-content shadow-2xl outline-none transition-transform duration-300 ease-out in-data-[theme=dark]:bg-gray-800',
                  drawerOpen ? 'translate-x-0' : 'translate-x-full',
                )}
              >
                <DrawerHeader onClose={closeDrawer}>
                  <p
                    id={drawerTitleId}
                    className="text-xs font-bold tracking-[0.14em] text-content-disabled uppercase"
                  >
                    {title ?? ariaLabel}
                  </p>
                </DrawerHeader>
                <DrawerBody className="overflow-y-auto px-5 pb-6">{drawerUsed && renderList('drawer')}</DrawerBody>
              </div>
            </div>
          ) : (
            <Drawer
              open={drawerOpen}
              onClose={closeDrawer}
              position="right"
              size="s"
              darkMode={darkMode}
              className={layout === 'auto' ? 'lg:hidden' : undefined}
            >
              <DrawerHeader>
                <DrawerTitle className="text-xs font-bold tracking-[0.14em] text-content-disabled uppercase">
                  {title ?? ariaLabel}
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="px-5 pb-6">{drawerUsed && renderList('drawer')}</DrawerBody>
            </Drawer>
          )}
        </>
      )}

      {layout !== 'drawer' && (
        <div className={layout === 'auto' ? 'hidden lg:block' : undefined}>
          {title !== null && (
            <p className="text-[11px] leading-4 font-bold tracking-[0.14em] text-content-disabled uppercase">
              {title}
            </p>
          )}
          {renderList('inline')}
        </div>
      )}
    </nav>
  )
}
