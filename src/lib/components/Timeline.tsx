import { type HTMLAttributeAnchorTarget, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Avatar } from './Avatar'
import { Badge, type BadgeProps } from './Badge'

/**
 * Ukuran Timeline. `large`: teks 14px, avatar 44px, padding kartu 20px, dan
 * jarak antar-item 24px. `small`: teks 12px, avatar 36px, padding 16px, dan
 * jarak 18px.
 */
export type TimelineSize = 'large' | 'small'

/**
 * Susunan Timeline. `desktop`: garis di tengah, kartu berselang-seling kiri
 * dan kanan. `mobile`: garis di kiri, semua kartu di kanannya. Susunannya
 * tidak berganti sendiri mengikuti lebar layar; pilih `mobile` untuk layar
 * atau kolom yang sempit.
 */
export type TimelinePlatform = 'desktop' | 'mobile'

/**
 * Satu berkas di bagian Attachments. Timeline tidak menyimpan berkasnya: ia
 * hanya menampilkan nama dan menautkan alamatnya, entah dari server atau dari
 * `URL.createObjectURL()` untuk berkas yang baru dipilih pengguna.
 */
export interface TimelineAttachment {
  /** Nama berkas yang tampil, mis. `surat-permohonan.pdf`. */
  name: ReactNode
  /** Alamat berkasnya. Tanpa ini namanya tampil sebagai teks biasa. */
  href?: string
  /** Tempat tautannya dibuka, mis. `_blank` untuk tab baru. */
  target?: HTMLAttributeAnchorTarget
  /**
   * Mengunduh berkas alih-alih membukanya. `true` memakai nama dari alamatnya,
   * teks menjadi nama berkas hasil unduhan. Browser hanya menurutinya untuk
   * alamat di domain yang sama, `blob:`, dan `data:`; alamat dari domain lain
   * tetap dibuka seperti tautan biasa.
   */
  download?: boolean | string
}

/**
 * Status di pojok kanan atas kartu, dirender sebagai Badge kit. Semua prop
 * Badge berlaku (`variant`, `icon`, `dismissible`, `onDismiss`, `open`, …),
 * dan `label` menjadi isinya. Bawaannya mengikuti desain: variant `success`
 * ukuran `sm`, serta `darkMode` milik Timeline.
 */
export interface TimelineStatus extends Omit<BadgeProps, 'children'> {
  /** Teks Badge, mis. `Disetujui`. */
  label: ReactNode
}

/** Satu kejadian di Timeline. Selain `name`, semua bagian boleh dikosongkan. */
export interface TimelineItem {
  /** Kunci unik item. Bawaannya urutan item di dalam `items`. */
  id?: string | number
  /** Nama pelaku, ditulis paling atas dengan warna aksen. */
  name: ReactNode
  /** Jabatan atau unit kerja, di bawah nama. */
  role?: ReactNode
  /** Waktu kejadian, mis. `01 Jan 2026 · 09:00`. */
  time?: ReactNode
  /** Lama prosesnya, mis. `5 minutes`. Ditulis setelah `labels.elapsed`. */
  elapsed?: ReactNode
  /** Keterangan utama kejadiannya. */
  description?: ReactNode
  /** Isi bagian Details. */
  details?: ReactNode
  /** Daftar berkas bagian Attachments. */
  attachments?: TimelineAttachment[]
  /** Badge status di pojok kanan atas kartu; lihat `TimelineStatus`. */
  status?: TimelineStatus
  /**
   * Alamat foto pelaku, diteruskan ke Avatar. Bila kosong atau gagal dimuat,
   * yang tampil `initials`, lalu siluet bawaan. Fotonya dekoratif karena
   * namanya sudah tertulis di kartu.
   */
  avatar?: string
  /** Inisial di Avatar saat tidak ada foto, mis. `RW`. */
  initials?: ReactNode
}

/** Label tetap di dalam kartu. Bawaannya mengikuti teks desain. */
export interface TimelineLabels {
  elapsed: ReactNode
  details: ReactNode
  attachments: ReactNode
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  /** Kejadian berurutan dari atas ke bawah. */
  items: TimelineItem[]
  size?: TimelineSize
  platform?: TimelinePlatform
  /** Mengganti sebagian label, mis. untuk aplikasi berbahasa Indonesia. */
  labels?: Partial<TimelineLabels>
  /**
   * Memaksa Timeline bertema gelap. Tanpa prop ini ia ikut tema elemen
   * pembungkusnya, mis. `<section data-theme="dark">`.
   */
  darkMode?: boolean
}

const defaultLabels: TimelineLabels = {
  elapsed: 'Elapsed time:',
  details: 'Details',
  attachments: 'Attachments',
}

/**
 * Ukuran per bagian. `line` menaruh garis mobile tepat di tengah avatar:
 * setengah lebar avatar dikurangi setengah tebal garis (2px).
 *
 * Padding kartu di desain (20px dan 16px) diukur dari tepi luar, termasuk
 * garis tepi 1px, jadi padding CSS-nya 1px lebih kecil.
 *
 * Avatar belum punya ukuran 44px dan 36px seperti desain Timeline, jadi
 * ukurannya ditimpa dengan modifier `!`: `cn` tidak menggabungkan class yang
 * bentrok, sehingga tanpa `!` yang menang `size-8` bawaan Avatar.
 */
const sizes: Record<
  TimelineSize,
  { text: string; gap: string; card: string; avatar: string; line: string }
> = {
  large: {
    text: 'text-body-sm',
    gap: 'gap-6',
    card: 'p-4.75',
    avatar: 'size-11!',
    line: 'before:left-5.25',
  },
  small: {
    text: 'text-caption',
    gap: 'gap-4.5',
    card: 'p-3.75',
    avatar: 'size-9!',
    line: 'before:left-4.25',
  },
}

/**
 * Siluet bawaan avatar dari desain: kepala dan bahu yang terpotong lingkaran
 * Avatar. Ukurannya sama dengan Avatar-nya supaya memenuhi lingkaran, dan
 * warnanya mengikuti warna teks Avatar.
 */
function Silhouette({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 44 44" className={cn('fill-current', className)} aria-hidden="true">
      <circle cx="22" cy="14.08" r="6.16" />
      <ellipse cx="22" cy="34.32" rx="15.84" ry="10.56" />
    </svg>
  )
}

/**
 * Lancip 7×12px di sisi kartu yang menghadap garis. Alasnya menimpa tepi
 * kartu, jadi kartu dan lancipnya terbaca sebagai satu balon; garis tepinya
 * hanya digambar di dua sisi miringnya.
 *
 * Posisinya dihitung dari tepi dalam border kartu (patokan elemen absolute):
 * 22px dari atas sama dengan 23px dari tepi luar seperti di desain, dan
 * geser 7px membuat ujungnya keluar 6px dari kartu.
 */
function Notch({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 7 12"
      aria-hidden="true"
      className={cn(
        'absolute top-5.5 h-3 w-1.75 overflow-visible',
        side === 'right' ? '-right-1.75' : '-left-1.75 -scale-x-100',
      )}
    >
      <path d="M0 0 7 6 0 12Z" className="fill-timeline-surface" />
      <path d="M0 0 7 6 0 12" fill="none" className="stroke-border" />
    </svg>
  )
}

/**
 * Badge status kartu. Badge belum berbasis token, jadi warna gelapnya hanya
 * menyala lewat `darkMode` milik Timeline (atau milik status itu sendiri),
 * tidak lewat `data-theme` pembungkus.
 */
function TimelineBadge({ status, darkMode }: { status: TimelineStatus; darkMode: boolean }) {
  const { label, className, ...badge } = status

  return (
    <Badge variant="success" darkMode={darkMode} className={cn('shrink-0', className)} {...badge}>
      {label}
    </Badge>
  )
}

function TimelineCard({
  item,
  side,
  labels,
  size,
  darkMode,
}: {
  item: TimelineItem
  side: 'left' | 'right'
  labels: TimelineLabels
  size: TimelineSize
  darkMode: boolean
}) {
  const s = sizes[size]
  const attachments = item.attachments ?? []
  const hasMain = Boolean(item.time || item.elapsed || item.description)
  const hasBody = hasMain || Boolean(item.details) || attachments.length > 0

  return (
    <div className={cn('relative border border-border bg-timeline-surface shadow-sm', s.card)}>
      <Notch side={side} />

      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 text-brand">
          <p>{item.name}</p>
          {item.role && <p>{item.role}</p>}
        </div>
        {item.status && <TimelineBadge status={item.status} darkMode={darkMode} />}
      </div>

      {/*
        Antar-kelompok diberi satu baris kosong seperti di desain: 1.5em sama
        dengan tinggi satu baris, jadi berlaku di kedua ukuran.
      */}
      {hasBody && (
        <div className="mt-1 space-y-[1.5em] text-timeline-content">
          {hasMain && (
            <div>
              {item.time && <p>{item.time}</p>}
              {item.elapsed && (
                <p>
                  {labels.elapsed} {item.elapsed}
                </p>
              )}
              {item.description && <p>{item.description}</p>}
            </div>
          )}

          {item.details && (
            <div>
              <p>{labels.details}</p>
              <div>{item.details}</div>
            </div>
          )}

          {attachments.length > 0 && (
            <div>
              <p>{labels.attachments}</p>
              <ul>
                {attachments.map((file, i) => (
                  <li key={i}>
                    {file.href ? (
                      <a
                        href={file.href}
                        target={file.target}
                        // Sama seperti TableFile: tab baru tidak menerima referrer halaman ini.
                        rel={file.target === '_blank' ? 'noreferrer' : undefined}
                        download={file.download}
                        className="rounded-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {file.name}
                      </a>
                    ) : (
                      file.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Timeline — riwayat kejadian berurutan: siapa, kapan, dan apa yang terjadi,
 * dengan avatar di sepanjang satu garis.
 *
 * Desainnya belum final, jadi nama prop dan ukurannya masih bisa berubah.
 *
 * Avatar dan status memakai komponen Avatar dan Badge kit. Warnanya dari token
 * semantik `border` dan `brand` serta token `--color-timeline-*`, jadi tema
 * gelap cukup mengganti nilai token lewat `data-theme`. `darkMode` memasang
 * `data-theme="dark"` di daftarnya, dan diteruskan ke Badge.
 */
export function Timeline({
  items,
  size = 'large',
  platform = 'desktop',
  labels,
  darkMode = false,
  className,
  ...props
}: TimelineProps) {
  const s = sizes[size]
  const label = { ...defaultLabels, ...labels }
  const desktop = platform === 'desktop'

  return (
    <ol
      data-theme={darkMode ? 'dark' : undefined}
      className={cn(
        'relative flex flex-col leading-normal before:absolute before:inset-y-0 before:w-0.5 before:bg-border',
        desktop ? 'before:left-1/2 before:-translate-x-1/2' : s.line,
        s.text,
        s.gap,
        className,
      )}
      {...props}
    >
      {items.map((item, i) => {
        // Desktop: item ke-1, ke-3, dan seterusnya di kiri garis. Mobile:
        // semua kartu di kanan, jadi lancipnya selalu menunjuk ke kiri.
        const left = desktop && i % 2 === 0

        return (
          <li
            key={item.id ?? i}
            className={cn(
              'grid items-start',
              desktop
                ? 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-6'
                : 'grid-cols-[auto_minmax(0,1fr)] gap-x-3.5',
            )}
          >
            {/*
              Warna Avatar ikut ditimpa ke token desain Timeline. Warna gelap
              bawaan Avatar hanya menyala lewat prop `darkMode`, sedangkan
              token ini juga ikut `data-theme` pembungkusnya. `relative`
              membuat avatar tergambar di atas garis.
            */}
            <Avatar
              src={item.avatar}
              alt=""
              initials={item.initials ?? <Silhouette className={s.avatar} />}
              className={cn(
                'relative row-start-1 mt-3 bg-border! text-timeline-avatar!',
                s.avatar,
                desktop ? 'col-start-2' : 'col-start-1',
              )}
            />
            <div
              className={cn(
                'row-start-1 min-w-0',
                desktop ? (left ? 'col-start-1' : 'col-start-3') : 'col-start-2',
              )}
            >
              <TimelineCard
                item={item}
                side={left ? 'right' : 'left'}
                labels={label}
                size={size}
                darkMode={darkMode}
              />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
