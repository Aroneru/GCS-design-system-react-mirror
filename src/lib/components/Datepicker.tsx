import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'
import { Button } from './Button'

/**
 * Tiga bentuk Datepicker:
 * - `single` — satu tanggal, dengan tombol Hari ini dan Hapus.
 * - `period` — satu kalender untuk memilih rentang, dengan pintasan periode:
 *   Hari ini, Minggu ini, Bulan ini, Hapus, dan Semua Waktu.
 * - `multiple` — rentang tanggal: dua kotak (mulai dan selesai) dengan dua
 *   kalender berdampingan, dengan tombol Hari ini dan Hapus. Dengan
 *   `shortcuts`, pintasan periode milik `period` ikut tampil.
 *
 * Pada `period` dan `multiple`, rentang dipilih dengan dua klik — tanggal
 * mulai, lalu tanggal selesai — dan panel baru tertutup setelah klik kedua.
 */
export type DatepickerType = 'single' | 'period' | 'multiple'

/**
 * Rentang tanggal milik `period` dan `multiple`. Selama pengguna baru memilih
 * tanggal mulai, `end` masih `null`.
 *
 * Keduanya `null` artinya Semua Waktu — rentang tanpa batas. Itu berbeda dari
 * belum diisi, yang ditandai dengan nilai `null` untuk seluruh rentangnya.
 */
export interface DateRange {
  start: Date | null
  end: Date | null
}

interface DatepickerBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'placeholder'> {
  /** Teks label di atas kotak tanggal. */
  label?: ReactNode
  /**
   * Teks saat belum ada tanggal. Pada `multiple` dipakai kedua kotak, kecuali
   * `endPlaceholder` diisi.
   */
  placeholder?: string
  /** Tampilan gelap untuk kotak, panel, kalender, dan tombolnya. */
  darkMode?: boolean
  disabled?: boolean
  /**
   * Nama field untuk pengiriman formulir. Tanggal dikirim sebagai `YYYY-MM-DD`;
   * pada `period` dan `multiple` dikirim dua field, `nama[start]` dan `nama[end]`.
   */
  name?: string
}

export interface DatepickerSingleProps extends DatepickerBaseProps {
  type?: 'single'
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (value: Date | null) => void
}

export interface DatepickerRangeProps extends DatepickerBaseProps {
  type: 'period' | 'multiple'
  value?: DateRange | null
  defaultValue?: DateRange | null
  onChange?: (value: DateRange | null) => void
  /** Teks kotak kedua pada `multiple` selama tanggal selesai belum dipilih. */
  endPlaceholder?: string
  /**
   * Menambahkan pintasan periode — Minggu ini, Bulan ini, dan Semua Waktu — di
   * samping Hari ini dan Hapus. Hanya untuk `multiple`; `period` selalu memilikinya.
   */
  shortcuts?: boolean
}

export type DatepickerProps = DatepickerSingleProps | DatepickerRangeProps

/**
 * Bentuk longgar untuk dibaca di dalam komponen. Kaitan antara `type` dan tipe
 * nilainya sudah dijaga `DatepickerProps` di sisi pemakai.
 */
type PropsDalam = DatepickerBaseProps & {
  type?: DatepickerType
  value?: Date | DateRange | null
  defaultValue?: Date | DateRange | null
  onChange?: (value: never) => void
  endPlaceholder?: string
  shortcuts?: boolean
}

const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

/** Tanggal tanpa jam, supaya dua tanggal bisa dibandingkan apa adanya. */
const polos = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const geserHari = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const awalBulan = (d: Date, geser = 0) => new Date(d.getFullYear(), d.getMonth() + geser, 1)
/** Tanggal yang sama di bulan lain; dipotong ke hari terakhir bila bulannya lebih pendek. */
const geserBulan = (d: Date, n: number) => {
  const akhir = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate()
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), akhir))
}
/** Angka urut sebuah tanggal — cukup untuk membandingkan, tanpa urusan jam dan zona waktu. */
const kunci = (d: Date) => d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate()
const bulanSama = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const selisihBulan = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth()

const dua = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`
const tulis = (d: Date) => `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`

/** Rentang dalam satu baris; bulan dan tahun yang sama tidak ditulis dua kali. */
function tulisRentang(a: Date, b: Date) {
  if (kunci(a) === kunci(b)) return tulis(a)
  if (a.getFullYear() !== b.getFullYear()) return `${tulis(a)} – ${tulis(b)}`
  if (a.getMonth() !== b.getMonth()) return `${a.getDate()} ${BULAN[a.getMonth()]} – ${tulis(b)}`
  return `${a.getDate()}–${tulis(b)}`
}

/** Menyeragamkan nilai dari luar jadi rentang tanpa jam — `single` pun disimpan begitu. */
function keRentang(v: Date | DateRange | null | undefined): DateRange | null {
  if (!v) return null
  if (v instanceof Date) return { start: polos(v), end: polos(v) }
  return { start: v.start && polos(v.start), end: v.end && polos(v.end) }
}

/** Minggu-minggu utuh yang tampil untuk satu bulan, dimulai hari Minggu. */
function isiBulan(bulan: Date): Date[] {
  const hariDalamBulan = new Date(bulan.getFullYear(), bulan.getMonth() + 1, 0).getDate()
  const baris = Math.ceil((bulan.getDay() + hariDalamBulan) / 7)
  const awal = geserHari(bulan, -bulan.getDay())
  return Array.from({ length: baris * 7 }, (_, i) => geserHari(awal, i))
}

type Pintasan = 'hari' | 'minggu' | 'bulan' | 'hapus' | 'semua'

function rentangPintasan(p: Pintasan, hariIni: Date): DateRange | null {
  switch (p) {
    case 'hari':
      return { start: hariIni, end: hariIni }
    case 'minggu': {
      const awal = geserHari(hariIni, -hariIni.getDay())
      return { start: awal, end: geserHari(awal, 6) }
    }
    case 'bulan':
      return { start: awalBulan(hariIni), end: new Date(hariIni.getFullYear(), hariIni.getMonth() + 1, 0) }
    case 'semua':
      return { start: null, end: null }
    case 'hapus':
      return null
  }
}

/** Warna tiap bagian untuk tampilan terang dan gelap. */
const temaTerang = {
  label: 'text-gray-900',
  kotak: 'border-gray-300 bg-gray-50',
  ikon: 'text-gray-500',
  isi: 'text-gray-900',
  placeholder: 'text-gray-500',
  panel: 'bg-white',
  judul: 'text-gray-900',
  panah: 'text-gray-900 hover:bg-gray-100',
  namaHari: 'text-gray-500',
  tanggal: 'text-gray-900',
  luarBulan: 'text-gray-500',
  sorot: 'hover:bg-gray-100',
  terpilih: 'bg-primary-700 text-white',
  antara: 'bg-gray-100',
  hapus: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-100',
  hapusGanda: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-100',
}

type Tema = typeof temaTerang

const temaGelap: Tema = {
  label: 'text-gray-50',
  kotak: 'border-gray-600 bg-gray-700',
  ikon: 'text-gray-400',
  isi: 'text-white',
  placeholder: 'text-gray-400',
  panel: 'bg-gray-700',
  judul: 'text-white',
  panah: 'text-white hover:bg-gray-600',
  namaHari: 'text-gray-400',
  tanggal: 'text-white',
  luarBulan: 'text-gray-500',
  sorot: 'hover:bg-gray-600',
  terpilih: 'bg-primary-600 text-white',
  antara: 'bg-gray-600',
  hapus: 'border-gray-500 bg-gray-600 text-white hover:bg-gray-500',
  // Desain multiple gelap menulis Hapus dengan gray-300; single dan period putih.
  hapusGanda: 'border-gray-500 bg-gray-600 text-gray-300 hover:bg-gray-500',
}

/** Lebar panel per bentuk: 7 kolom × 36px, 7 × ±42px, dan dua kalender berdampingan. */
const lebarPanel: Record<DatepickerType, string> = {
  single: 'w-71',
  period: 'w-81.25',
  multiple: 'w-150',
}

/** Angka yang sama dalam piksel, untuk menempatkan panel sebelum ia bisa diukur. */
const lebarPanelPx: Record<DatepickerType, number> = { single: 284, period: 325, multiple: 600 }

/**
 * Lebar bawaan komponennya: selebar panel, supaya tepi kotak dan kalender
 * segaris. Di wadah yang lebih sempit ia ikut menyusut; `max-w-none` di
 * `className` melepas batas ini.
 */
const lebarKotak: Record<DatepickerType, string> = {
  single: 'max-w-71',
  period: 'max-w-81.25',
  multiple: 'max-w-150',
}

/** Jarak panel dari kotak tanggal, dan dari tepi layar. */
const JARAK = 8

/** `newState` belum ada di lib.dom semua versi TypeScript, jadi ditulis sendiri. */
type PeristiwaToggle = Event & { newState?: string }

/** Ikon kalender 14px di kiri kotak. */
const IkonKalender = () => (
  <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
  </svg>
)

/** Panah 16×12 untuk berpindah bulan. */
const Panah = ({ kanan }: { kanan?: boolean }) => (
  <svg
    className={cn('h-3 w-4', kanan && 'rotate-180')}
    viewBox="0 0 16 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14.8 6H1.2m0 0 4.5 4.8M1.2 6l4.5-4.8" />
  </svg>
)

interface KalenderProps {
  bulan: Date
  /**
   * Bulan di kalender sebelahnya pada bentuk `multiple`. Tanggal luar bulan
   * yang di sana tampil sebagai tanggal dalam bulan tidak disorot di sini.
   */
  bulanSebelah?: Date
  nilai: DateRange | null
  hariIni: Date
  /** Tanggal yang menerima Tab — hanya satu di seluruh panel. */
  sasaran: Date
  tema: Tema
  idJudul: string
  /** Kisi tanggal diberi jarak 8px di kiri-kanan, seperti pada bentuk `multiple`. */
  menjorok?: boolean
  onPilih: (d: Date) => void
  onSebelum: () => void
  onSesudah: () => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

/** Satu kalender bulanan: judul dengan panah, nama hari, lalu kisi tanggal. */
function Kalender({
  bulan,
  bulanSebelah,
  nilai,
  hariIni,
  sasaran,
  tema,
  idJudul,
  menjorok,
  onPilih,
  onSebelum,
  onSesudah,
  onKeyDown,
}: KalenderProps) {
  const tanggal = isiBulan(bulan)
  const minggu = Array.from({ length: tanggal.length / 7 }, (_, i) => tanggal.slice(i * 7, i * 7 + 7))

  const kMulai = nilai?.start ? kunci(nilai.start) : null
  const kSelesai = nilai?.end ? kunci(nilai.end) : null
  const rentangUtuh = kMulai !== null && kSelesai !== null && kMulai !== kSelesai
  const kHariIni = kunci(hariIni)
  const kSasaran = kunci(sasaran)

  // Panah dibuat lebih besar 6px ke segala arah supaya mudah ditekan, lalu
  // ditarik kembali dengan margin negatif — ikonnya tetap menempel di tepi.
  const panah = cn('-m-1.5 flex items-center justify-center rounded-lg p-1.5 transition-colors', tema.panah)

  return (
    <div>
      <div className="flex h-4.5 items-center justify-between">
        <button type="button" onClick={onSebelum} aria-label="Bulan sebelumnya" className={panah}>
          <Panah />
        </button>
        <p id={idJudul} aria-live="polite" className={cn('text-xs font-bold', tema.judul)}>
          {BULAN[bulan.getMonth()]} {bulan.getFullYear()}
        </p>
        <button type="button" onClick={onSesudah} aria-label="Bulan berikutnya" className={panah}>
          <Panah kanan />
        </button>
      </div>

      <div
        role="grid"
        aria-labelledby={idJudul}
        onKeyDown={onKeyDown}
        className={cn('mt-2 grid grid-cols-7', menjorok && 'px-2')}
      >
        <div role="row" className="contents">
          {HARI.map((hari) => (
            <div
              key={hari}
              role="columnheader"
              aria-label={hari}
              className={cn('flex h-8.5 items-center justify-center text-xs font-medium', tema.namaHari)}
            >
              {hari.slice(0, 3)}
            </div>
          ))}
        </div>

        {minggu.map((baris) => (
          <div key={kunci(baris[0])} role="row" className="contents">
            {baris.map((d) => {
              const k = kunci(d)
              const dalamBulan = bulanSama(d, bulan)
              // Tanggal luar bulan yang juga tampil di kalender sebelah — 27–30
              // September di kalender Oktober, misalnya — hanya disorot di sana,
              // tempat ia tanggal dalam bulan. Di sini ia tetap bisa ditekan.
              const kembar = !dalamBulan && !!bulanSebelah && bulanSama(d, bulanSebelah)
              const ujungMulai = !kembar && k === kMulai
              const ujungSelesai = !kembar && k === kSelesai
              const terpilih = ujungMulai || ujungSelesai
              const antara = !kembar && rentangUtuh && k > kMulai && k < kSelesai
              // Hanya tanggal di dalam bulannya yang bisa menerima Tab: tanggal
              // luar bulan juga muncul di kalender sebelah pada bentuk `multiple`.
              const fokus = dalamBulan && k === kSasaran

              return (
                <div key={k} role="gridcell" aria-selected={terpilih || antara} className="h-8.5">
                  <button
                    type="button"
                    tabIndex={fokus ? 0 : -1}
                    data-fokus={fokus || undefined}
                    aria-label={`${HARI[d.getDay()]}, ${tulis(d)}`}
                    aria-current={k === kHariIni ? 'date' : undefined}
                    onClick={() => onPilih(d)}
                    className={cn(
                      'flex size-full items-center justify-center text-xs font-semibold transition-colors',
                      // Pada rentang, ujungnya hanya membulat di sisi luar supaya
                      // menyambung dengan tanggal di antaranya.
                      terpilih && rentangUtuh ? (ujungMulai ? 'rounded-l-lg' : 'rounded-r-lg') : antara ? '' : 'rounded-lg',
                      terpilih
                        ? tema.terpilih
                        : antara
                          ? // Di dalam rentang, tanggal bulan sebelah tidak diredupkan.
                            cn(tema.antara, tema.tanggal)
                          : cn(dalamBulan ? tema.tanggal : tema.luarBulan, tema.sorot),
                    )}
                  >
                    {d.getDate()}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Datepicker — pemilih tanggal dengan kalender di panel melayang.
 *
 * Bentuknya ditentukan `type`: `single` untuk satu tanggal, `period` untuk
 * satu kalender dengan pintasan periode, dan `multiple` untuk rentang dengan
 * dua kalender — pintasan periodenya ditambahkan lewat `shortcuts`. Nilai
 * `single` berupa `Date`; `period` dan `multiple` berupa `DateRange`, karena
 * Minggu ini, Bulan ini, dan Semua Waktu memang rentang. Keduanya memilih
 * rentang dengan dua klik, dan panelnya baru tertutup setelah tanggal selesai.
 *
 * Lebar bawaannya sama dengan panelnya, jadi tepi kotak dan kalender segaris.
 *
 * Seperti Dropdown, panelnya memakai HTML Popover API: peramban yang menutupnya
 * saat pengguna menekan di luar atau menekan Escape, dan mengangkatnya ke top
 * layer. Tanggal ditelusuri dengan panah, Home/End (awal/akhir minggu), dan
 * PageUp/PageDown (bulan; dengan Shift, tahun).
 *
 * `darkMode` mengganti seluruh warnanya ke tampilan gelap.
 */
export function Datepicker(props: DatepickerProps) {
  const {
    type = 'single',
    label,
    placeholder = 'Pilih Tanggal',
    endPlaceholder = placeholder,
    shortcuts = false,
    darkMode = false,
    disabled = false,
    name,
    value,
    defaultValue,
    onChange,
    className,
    id,
    'aria-label': ariaLabel,
    ...rest
  } = props as PropsDalam

  const autoId = useId()
  const idDasar = id ?? autoId
  const labelId = `${idDasar}-label`
  const panelId = `${idDasar}-panel`
  const idSelesai = `${idDasar}-selesai`

  const tema = darkMode ? temaGelap : temaTerang
  // Dua kotak dan dua kalender.
  const ganda = type === 'multiple'
  const pintasanPeriode = type === 'period' || (ganda && shortcuts)

  const [simpanan, setSimpanan] = useState(() => keRentang(defaultValue))
  const nilai = value !== undefined ? keRentang(value) : simpanan
  const mulai = nilai?.start ?? null
  const selesai = nilai?.end ?? null
  const semuaWaktu = nilai !== null && !mulai && !selesai

  const [hariIni, setHariIni] = useState(() => polos(new Date()))
  const [tampil, setTampil] = useState(() => awalBulan(mulai ?? hariIni))
  const [tampilKanan, setTampilKanan] = useState(() => awalBulan(mulai ?? hariIni, 1))
  const [fokus, setFokus] = useState(() => mulai ?? hariIni)
  // Ujung rentang yang diisi klik berikutnya. Setiap kali panel dibuka, klik
  // pertama mengisi tanggal mulai dan klik kedua tanggal selesai.
  const [ujung, setUjung] = useState<'start' | 'end'>('start')
  const [terbuka, setTerbuka] = useState(false)

  const panelRef = useRef<HTMLDivElement | null>(null)
  const jangkarRef = useRef<HTMLDivElement | null>(null)
  const pemicuRef = useRef<HTMLButtonElement | null>(null)
  const pindahFokus = useRef(false)

  const terlihat = (d: Date) => bulanSama(d, tampil) || (ganda && bulanSama(d, tampilKanan))
  // Bila bulan yang tampil sudah digeser menjauh dari tanggal yang difokus,
  // Tab jatuh ke tanggal 1 bulan pertama supaya kisi tetap bisa dicapai.
  const sasaran = terlihat(fokus) ? fokus : tampil

  const tutup = useCallback(() => {
    const panel = panelRef.current
    if (panel?.isConnected && panel.matches(':popover-open')) panel.hidePopover()
  }, [])

  /**
   * Panel berada di top layer, jadi posisinya diukur sendiri dari kotak
   * tanggalnya: rata kiri, 8px di bawahnya, dan dibalik ke atas bila tidak
   * muat di bawah sekaligus lebih lapang di atas.
   */
  const tempatkan = useCallback(() => {
    const panel = panelRef.current
    const jangkar = jangkarRef.current
    if (!panel || !jangkar) return

    const kotak = jangkar.getBoundingClientRect()
    const lebar = panel.offsetWidth || Math.min(lebarPanelPx[type], window.innerWidth - JARAK * 2)
    panel.style.left = `${Math.max(JARAK, Math.min(kotak.left, window.innerWidth - lebar - JARAK))}px`

    const tinggi = panel.offsetHeight
    const ruangBawah = window.innerHeight - kotak.bottom - JARAK
    panel.style.top =
      tinggi > ruangBawah && kotak.top - JARAK > ruangBawah
        ? `${Math.max(JARAK, kotak.top - tinggi - JARAK)}px`
        : `${kotak.bottom + JARAK}px`
  }, [type])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    let kembalikan = false

    // `beforetoggle` menempatkan panel sebelum tampil supaya tidak terlihat
    // melompat; `toggle` mengulanginya setelah tinggi aslinya terukur.
    const sebelum = (e: Event) => {
      const buka = (e as PeristiwaToggle).newState === 'open'
      setTerbuka(buka)
      if (buka) tempatkan()
      // Dicatat sebelum panel hilang: sesudahnya fokus sudah terlepas darinya.
      else kembalikan = panel.contains(document.activeElement)
    }

    const sesudah = (e: Event) => {
      if ((e as PeristiwaToggle).newState === 'open') {
        tempatkan()
        // Fokus langsung jatuh ke tanggal terpilih — atau hari ini — supaya
        // panah bisa dipakai tanpa Tab lebih dulu. Harus di sini: saat
        // `beforetoggle` selesai diproses, panelnya belum tampil dan fokus
        // ke dalamnya akan ditolak peramban.
        panel.querySelector<HTMLElement>('[data-fokus]')?.focus()
      } else if (kembalikan) {
        // Ditutup selagi fokus ada di dalamnya — Escape, klik di luar, atau
        // tanggal dipilih — jadi fokus dikembalikan ke kotak yang membukanya.
        kembalikan = false
        pemicuRef.current?.focus()
      }
    }

    panel.addEventListener('beforetoggle', sebelum)
    panel.addEventListener('toggle', sesudah)
    return () => {
      panel.removeEventListener('beforetoggle', sebelum)
      panel.removeEventListener('toggle', sesudah)
    }
  }, [tempatkan])

  useEffect(() => {
    if (!terbuka) return
    const ikut = () => tempatkan()
    // `true` supaya guliran pada pembungkus mana pun ikut terdengar.
    window.addEventListener('scroll', ikut, true)
    window.addEventListener('resize', ikut)
    return () => {
      window.removeEventListener('scroll', ikut, true)
      window.removeEventListener('resize', ikut)
    }
  }, [terbuka, tempatkan])

  // Tinggi panel ikut jumlah minggu di bulan yang tampil, jadi posisinya
  // dihitung ulang setiap kali isinya berganti.
  useEffect(() => {
    if (terbuka) tempatkan()
  })

  // Setelah panah menggeser tanggal, fokus menyusul ke tombolnya yang baru.
  useEffect(() => {
    if (!pindahFokus.current) return
    pindahFokus.current = false
    panelRef.current?.querySelector<HTMLElement>('[data-fokus]')?.focus()
  })

  const kirim = (baru: DateRange | null) => {
    if (value === undefined) setSimpanan(baru)
    if (type === 'single') (onChange as ((v: Date | null) => void) | undefined)?.(baru?.start ?? null)
    else (onChange as ((v: DateRange | null) => void) | undefined)?.(baru)
  }

  /** Dipanggil kotak tanggal sebelum panel terbuka: menyiapkan bulan dan fokusnya. */
  const siapkan = (e: MouseEvent<HTMLButtonElement>) => {
    // Selagi panel terbuka, menekan kotak tidak mengulang pilihan yang sedang
    // berjalan — tanggal mulai yang sudah diklik tetap menunggu tanggal selesai.
    if (terbuka) return
    pemicuRef.current = e.currentTarget
    const kini = polos(new Date())
    setHariIni(kini)
    setUjung('start')

    const kiri = awalBulan(mulai ?? kini)
    setFokus(mulai ?? kini)
    setTampil(kiri)
    setTampilKanan(selesai && selisihBulan(kiri, selesai) >= 1 ? awalBulan(selesai) : awalBulan(kiri, 1))
  }

  const pilih = (d: Date) => {
    setFokus(d)
    if (type === 'single') {
      kirim({ start: d, end: d })
      tutup()
      return
    }

    // `period` dan `multiple`: klik pertama mengisi tanggal mulai, klik kedua
    // tanggal selesai — baru setelah itu panel tertutup. Tanggal selesai yang
    // jatuh sebelum tanggal mulai dianggap memulai ulang dari tanggal itu.
    if (ujung === 'start' || !mulai || kunci(d) < kunci(mulai)) {
      kirim({ start: d, end: null })
      setUjung('end')
    } else {
      kirim({ start: mulai, end: d })
      tutup()
    }
  }

  const pakai = (p: Pintasan) => {
    kirim(rentangPintasan(p, hariIni))
    tutup()
  }

  /** Menggeser bulan yang tampil supaya tanggal hasil papan ketik ikut terlihat. */
  const tampilkan = (d: Date) => {
    if (!ganda) {
      if (!bulanSama(d, tampil)) setTampil(awalBulan(d))
      return
    }
    if (bulanSama(d, tampil) || bulanSama(d, tampilKanan)) return
    if (kunci(d) < kunci(tampil)) {
      setTampil(awalBulan(d))
      setTampilKanan(awalBulan(d, 1))
    } else {
      setTampil(awalBulan(d, -1))
      setTampilKanan(awalBulan(d))
    }
  }

  const kisiKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const langkah: Record<string, (d: Date) => Date> = {
      ArrowLeft: (d) => geserHari(d, -1),
      ArrowRight: (d) => geserHari(d, 1),
      ArrowUp: (d) => geserHari(d, -7),
      ArrowDown: (d) => geserHari(d, 7),
      Home: (d) => geserHari(d, -d.getDay()),
      End: (d) => geserHari(d, 6 - d.getDay()),
      PageUp: (d) => geserBulan(d, e.shiftKey ? -12 : -1),
      PageDown: (d) => geserBulan(d, e.shiftKey ? 12 : 1),
    }
    const geser = langkah[e.key]
    if (!geser) return
    e.preventDefault()
    const baru = geser(sasaran)
    setFokus(baru)
    tampilkan(baru)
    pindahFokus.current = true
  }

  /**
   * Pada `multiple` kedua kalender bisa digeser sendiri-sendiri, supaya rentang
   * yang panjang tetap bisa dipilih tanpa melewati setiap bulan di antaranya.
   * Kalender kiri selalu dijaga lebih awal dari yang kanan.
   */
  const geserKiri = (n: number) => {
    const kiri = awalBulan(tampil, n)
    setTampil(kiri)
    if (selisihBulan(kiri, tampilKanan) < 1) setTampilKanan(awalBulan(kiri, 1))
  }
  const geserKanan = (n: number) => {
    const kanan = awalBulan(tampilKanan, n)
    setTampilKanan(kanan)
    if (selisihBulan(tampil, kanan) < 1) setTampil(awalBulan(kanan, -1))
  }

  const kalender = (bulan: Date, sisi: 'kiri' | 'kanan') => (
    <Kalender
      bulan={bulan}
      bulanSebelah={ganda ? (sisi === 'kiri' ? tampilKanan : tampil) : undefined}
      nilai={nilai}
      hariIni={hariIni}
      sasaran={sasaran}
      tema={tema}
      idJudul={`${idDasar}-judul-${sisi}`}
      menjorok={ganda}
      onPilih={pilih}
      onSebelum={() => (sisi === 'kiri' ? geserKiri(-1) : geserKanan(-1))}
      onSesudah={() => (sisi === 'kiri' ? geserKiri(1) : geserKanan(1))}
      onKeyDown={kisiKeyDown}
    />
  )

  const tombolPintasan = (p: Pintasan, teks: string) => (
    <Button
      size="xs"
      // Tampilan gelap memakai tombol berisi; tampilan terang tombol bergaris.
      variant={darkMode ? 'filled' : 'outline'}
      className="w-full"
      onClick={() => pakai(p)}
    >
      {teks}
    </Button>
  )

  // Tidak ada varian Button yang berlatar netral, jadi Hapus dibentuk sendiri
  // dengan ukuran, sudut, dan cincin fokus yang sama dengan Button `xs`.
  const tombolHapus = (
    <button
      type="button"
      onClick={() => pakai('hapus')}
      className={cn(
        'inline-flex h-8.5 w-full items-center justify-center rounded-lg border px-4 text-xs font-medium',
        'transition-colors duration-200 focus:ring-2 focus:ring-primary-400 focus:outline-none',
        ganda ? tema.hapusGanda : tema.hapus,
      )}
    >
      Hapus
    </button>
  )

  /** Satu kotak tanggal — tombol yang membuka panel. */
  const kotak = (u: 'start' | 'end', idKotak: string, teks: string | null, kosong: string) => {
    const idTeks = `${idKotak}-teks`
    // Pada `multiple`, garis aktif menandai kotak yang diisi klik berikutnya.
    const aktif = terbuka && (!ganda || ujung === u)
    return (
      <button
        type="button"
        id={idKotak}
        disabled={disabled}
        popoverTarget={panelId}
        // Pada `multiple`, menekan kotak mana pun selagi panel terbuka tidak
        // menutupnya, jadi tanggal selesai tetap bisa dipilih sesudahnya.
        popoverTargetAction={ganda ? 'show' : 'toggle'}
        aria-haspopup="dialog"
        aria-expanded={terbuka}
        aria-controls={panelId}
        aria-labelledby={[labelId, ganda && `${idKotak}-nama`, idTeks].filter(Boolean).join(' ')}
        data-aktif={aktif || undefined}
        onClick={siapkan}
        className={cn(
          'relative flex h-10.5 w-full items-center rounded-lg border pr-4 pl-9.5 text-left text-sm outline-none',
          'transition-colors focus:border-primary-500 data-aktif:border-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          tema.kotak,
        )}
      >
        <span className={cn('pointer-events-none absolute inset-y-0 left-4 flex items-center', tema.ikon)}>
          <IkonKalender />
        </span>
        {ganda && (
          <span id={`${idKotak}-nama`} hidden>
            {u === 'start' ? 'mulai' : 'selesai'}
          </span>
        )}
        <span id={idTeks} className={cn('truncate', teks ? tema.isi : tema.placeholder)}>
          {teks ?? kosong}
        </span>
      </button>
    )
  }

  const teksTunggal =
    type === 'single'
      ? mulai && tulis(mulai)
      : semuaWaktu
        ? 'Semua Waktu'
        : mulai && selesai
          ? tulisRentang(mulai, selesai)
          : mulai && tulis(mulai)

  return (
    <div className={cn('w-full', lebarKotak[type], className)} {...rest}>
      {label ? (
        <label htmlFor={idDasar} id={labelId} className={cn('mb-2 block text-sm font-bold', tema.label)}>
          {label}
        </label>
      ) : (
        // Tanpa label terlihat, `aria-label` tetap dipakai sebagai nama kotak dan panelnya.
        <span id={labelId} hidden>
          {ariaLabel ?? 'Tanggal'}
        </span>
      )}

      {ganda ? (
        // Kedua kotak bisa berteks sama ("Pilih Tanggal"); pembaca layar tetap
        // membedakannya lewat "mulai" dan "selesai" di nama aksesibelnya.
        <div ref={jangkarRef} className="grid grid-cols-2 gap-2">
          {kotak('start', idDasar, semuaWaktu ? 'Semua Waktu' : mulai && tulis(mulai), placeholder)}
          {kotak('end', idSelesai, semuaWaktu ? 'Semua Waktu' : selesai && tulis(selesai), endPlaceholder)}
        </div>
      ) : (
        <div ref={jangkarRef}>{kotak('start', idDasar, teksTunggal || null, placeholder)}</div>
      )}

      {name &&
        (type === 'single' ? (
          <input type="hidden" name={name} value={mulai ? iso(mulai) : ''} />
        ) : (
          <>
            <input type="hidden" name={`${name}[start]`} value={mulai ? iso(mulai) : ''} />
            <input type="hidden" name={`${name}[end]`} value={selesai ? iso(selesai) : ''} />
          </>
        ))}

      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        role="dialog"
        aria-labelledby={labelId}
        className={cn(
          'fixed inset-auto m-0 max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-lg p-4',
          'shadow-[0_4px_6px_rgb(0_0_0/0.05),0_10px_15px_-3px_rgb(0_0_0/0.1)]',
          lebarPanel[type],
          tema.panel,
        )}
      >
        {ganda ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {kalender(tampil, 'kiri')}
            {kalender(tampilKanan, 'kanan')}
          </div>
        ) : (
          kalender(tampil, 'kiri')
        )}

        {/* Pada multiple semua jaraknya 16px; pada satu kalender 8px. */}
        {pintasanPeriode ? (
          <>
            <div className={cn('grid grid-cols-2 gap-4', ganda ? 'mt-4 sm:grid-cols-4' : 'mt-2')}>
              {tombolPintasan('hari', 'Hari ini')}
              {tombolPintasan('minggu', 'Minggu ini')}
              {tombolPintasan('bulan', 'Bulan ini')}
              {tombolHapus}
            </div>
            <div className={ganda ? 'mt-4' : 'mt-2'}>{tombolPintasan('semua', 'Semua Waktu')}</div>
          </>
        ) : (
          <div className={cn('grid grid-cols-2 gap-4', ganda ? 'mt-4' : 'mt-2')}>
            {tombolPintasan('hari', 'Hari ini')}
            {tombolHapus}
          </div>
        )}
      </div>
    </div>
  )
}
