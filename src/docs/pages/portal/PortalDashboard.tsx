import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Icon,
  ListView,
  Navbar,
  Select,
  Sidebar,
  Toast,
  cn,
  type SidebarItem,
  type NavbarPrimaryItem,
} from '../../../lib'
import {
  Archive,
  ArrowLeftToBracket,
  ArrowRightToBracket,
  Award,
  BookOpen,
  BookOpenReader,
  Bullhorn,
  CalendarMonth,
  CalendarPlus,
  Cash,
  ChartMixed,
  ChartPie,
  ChevronDown,
  CirclePlus,
  ClipboardList,
  CloudArrowUp,
  CodeBranch,
  Envelope,
  ExclamationCircle,
  FileLines,
  Fingerprint,
  Grid,
  Home,
  InboxFull,
  Lightbulb,
  MapPin,
  Messages,
  Moon,
  Newspaper,
  PaperPlane,
  Play,
  QrCode,
  QuestionCircle,
  Rocket,
  ScaleBalanced,
  Store,
  Sun,
  Thumbtack,
  Ticket,
  Truck,
  User,
  UserHeadset,
  UsersGroup,
} from '../../../lib/icons/outline'
import { Apple } from '../../../lib/icons/solid'
import { asset } from '../../asset'

/**
 * Portal Dashboard — beranda portal pegawai.
 *
 * Seperti aplikasi demo Example, berkas ini hanya mengimpor dari
 * `../../../lib`, ditambah `asset()` untuk path berkas. Tidak ada GSAP atau
 * pustaka lain: halaman ini menunjukkan apa yang didapat konsumen dari
 * `@ceplok-ui/design-kit-react` saja. Transisi masuk dan keluarnya diurus
 * `ExampleAppFrame`.
 *
 * Bagian yang belum punya komponen di kit dirakit dari token warnanya:
 * kalender bulanan (Datepicker hanya punya bentuk field + panel), kartu
 * sapaan dan hiasannya, ubin Aplikasi Intranet, serta kartu unduhan KOSMO.
 *
 * Mode gelapnya dipasang seperti di aplikasi consumer: `data-theme="dark"` di
 * akar, `darkMode` di setiap komponen kit, dan varian `in-data-[theme=dark]:`
 * untuk bagian yang dirakit sendiri.
 */

/** Ditulis kapital, seperti di desain. */
const NAMA = 'RAFLI ARANDHANA'

/**
 * "Hari ini" dikunci ke 13 Oktober 2026, supaya kalender, presensi, dan
 * tanggal data anggaran selalu tampil seperti desainnya.
 */
const HARI_INI = new Date(2026, 9, 13)

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

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const MENU = [
  { id: 'dashboard', label: 'Dashboard', Ikon: Home },
  { id: 'kms', label: 'KMS', Ikon: Lightbulb },
  { id: 'pengumuman', label: 'Pengumuman', Ikon: Bullhorn },
  { id: 'forum', label: 'Forum', Ikon: Messages },
  { id: 'berita', label: 'Berita', Ikon: Newspaper },
  { id: 'event', label: 'Event', Ikon: CalendarMonth },
]

const MENU_SIDEBAR = MENU.filter(({ id }) => id === 'dashboard' || id === 'kms')
const MENU_NAVBAR = MENU.filter(({ id }) => id !== 'dashboard' && id !== 'kms')

const KATEGORI = MENU.filter(({ id }) => id !== 'dashboard').map(({ id, label }) => ({
  value: id,
  label,
}))

const WIKI = [
  {
    judul: 'Integrasi dan Template Standar',
    tanggal: '09 Okt 2026',
    penulis: 'Rezy Tijo Waskito',
    ruang: 'Repository Kode Sumber',
  },
  {
    judul: 'SonarQube — Analisis Kode dan Kualitas',
    tanggal: '09 Okt 2026',
    penulis: 'Rezy Tijo Waskito',
    ruang: 'Repository Kode Sumber',
  },
]

const ANGGARAN: Record<string, { label: string; pagu: string; realisasi: string; persentase: string }> = {
  monsakti: {
    label: 'Realisasi Kementerian (MONSAKTI)',
    pagu: 'Rp. 10.214.835.286.000',
    realisasi: 'Rp. 6.117.956.903.552',
    persentase: '59.89%',
  },
  sakti: {
    label: 'Realisasi Satuan Kerja (SAKTI)',
    pagu: 'Rp. 1.482.650.000.000',
    realisasi: 'Rp. 902.715.448.120',
    persentase: '60.89%',
  },
}

/**
 * Ubin Aplikasi Intranet. Logo aplikasinya di desain berupa gambar yang belum
 * ada di repo; sementara ini diganti ikon kit berwarna token, naik ke tangga
 * 400 di mode gelap. Ganti dengan <img> begitu berkas logonya tersedia.
 *
 * Mula-mula hanya APLIKASI_RINGKAS ubin pertama yang tampil, dua baris di xl
 * seperti desainnya. Tombol panah membuka sisanya; enam ubin terakhir rekaan,
 * untuk memperagakan daftar yang terbuka.
 */
const APLIKASI = [
  { nama: 'Kinerja Harian', Ikon: ChartMixed, warna: 'text-primary-700 in-data-[theme=dark]:text-primary-400' },
  { nama: 'e-Mail', Ikon: Envelope, warna: 'text-orange-600 in-data-[theme=dark]:text-orange-400' },
  { nama: 'Satu Data Komdigi', Ikon: ChartPie, warna: 'text-primary-700 in-data-[theme=dark]:text-primary-400' },
  { nama: 'E-Presensi', Ikon: Fingerprint, warna: 'text-gray-700 in-data-[theme=dark]:text-gray-300' },
  { nama: 'sidara', Ikon: PaperPlane, warna: 'text-primary-700 in-data-[theme=dark]:text-primary-400' },
  { nama: 'LPSE', Ikon: Store, warna: 'text-gray-700 in-data-[theme=dark]:text-gray-300' },
  { nama: 'Simaya+', Ikon: InboxFull, warna: 'text-purple-700 in-data-[theme=dark]:text-purple-400' },
  { nama: 'KCloud', Ikon: CloudArrowUp, warna: 'text-gray-700 in-data-[theme=dark]:text-gray-300' },
  { nama: 'E-Arsip', Ikon: Archive, warna: 'text-primary-700 in-data-[theme=dark]:text-primary-400' },
  { nama: 'Pinjam Ruangan', Ikon: CalendarPlus, warna: 'text-red-600 in-data-[theme=dark]:text-red-400' },
  { nama: 'Simpatik', Ikon: UsersGroup, warna: 'text-primary-700 in-data-[theme=dark]:text-primary-400' },
  { nama: 'JDIH', Ikon: ScaleBalanced, warna: 'text-green-700 in-data-[theme=dark]:text-green-400' },
  { nama: 'Helpdesk TI', Ikon: UserHeadset, warna: 'text-primary-700 in-data-[theme=dark]:text-primary-400' },
  { nama: 'Perpustakaan Digital', Ikon: BookOpenReader, warna: 'text-orange-600 in-data-[theme=dark]:text-orange-400' },
  { nama: 'Kendaraan Dinas', Ikon: Truck, warna: 'text-gray-700 in-data-[theme=dark]:text-gray-300' },
  { nama: 'Peta Kantor', Ikon: MapPin, warna: 'text-red-600 in-data-[theme=dark]:text-red-400' },
  { nama: 'Penghargaan', Ikon: Award, warna: 'text-yellow-700 in-data-[theme=dark]:text-yellow-400' },
  { nama: 'Tiket Layanan', Ikon: Ticket, warna: 'text-purple-700 in-data-[theme=dark]:text-purple-400' },
]

/** Jumlah ubin sebelum daftarnya dibuka: dua baris di xl. */
const APLIKASI_RINGKAS = 12

/**
 * Isi Forum Terbaru dan Sticky Post. Nama dan judulnya contoh rekaan, dengan
 * tanggal sebelum "hari ini".
 */
const FORUM = [
  {
    penulis: 'Ayu Lestari',
    kategori: 'Diskusi Bebas',
    waktu: '12 Okt 2026 13:08 WIB',
    judul: 'Sorotan Kegiatan Pegawai | September 2026',
    dilihat: 353,
    komentar: 0,
    suka: 10,
  },
  {
    penulis: 'Bima Pratama',
    kategori: 'Kearsipan',
    waktu: '09 Okt 2026 08:04 WIB',
    judul: 'Tata cara penyerahan arsip inaktif ke unit kearsipan',
    dilihat: 1689,
    komentar: 1,
    suka: 2,
  },
  {
    penulis: 'Citra Maharani',
    kategori: 'Bantuan Teknis',
    waktu: '07 Okt 2026 13:04 WIB',
    judul: 'Jadwal pemeliharaan jaringan kantor akhir pekan ini',
    dilihat: 838,
    komentar: 2,
    suka: 3,
  },
  {
    penulis: 'Dimas Saputra',
    kategori: 'Bantuan Teknis',
    waktu: '06 Okt 2026 10:55 WIB',
    judul: 'Pendingin ruangan di Lantai 6 Gedung B kurang dingin',
    dilihat: 430,
    komentar: 1,
    suka: 5,
  },
  {
    penulis: 'Eka Wulandari',
    kategori: 'Kepegawaian',
    waktu: '02 Okt 2026 09:59 WIB',
    judul: 'Tindak lanjut webinar penguatan budaya organisasi',
    dilihat: 774,
    komentar: 3,
    suka: 15,
  },
]

const STICKY = [
  { judul: 'Panduan Akses Wi-Fi Kantor', tanggal: '01 Sep 2026 10:45 WIB', penulis: 'Fajar Nugroho' },
  { judul: 'Panduan Akses Jaringan Internal', tanggal: '05 Mar 2026 10:19 WIB', penulis: 'Ayu Lestari' },
  { judul: 'Pedoman Desain Flyer Portal', tanggal: '15 Jan 2026 17:45 WIB', penulis: 'Gita Permata' },
  { judul: 'Langkah Mengubah Kata Sandi Portal Intranet', tanggal: '02 Jul 2025 22:45 WIB', penulis: 'Gita Permata' },
]

/** Toko aplikasi untuk kartu unduhan KOSMO. */
const TOKO = [
  {
    id: 'android',
    sistem: 'Android',
    toko: 'Google Play',
    ajakan: 'Tersedia di',
    tautan: 's.komdigi.go.id/kosmo-android',
    Ikon: Play,
  },
  {
    id: 'ios',
    sistem: 'iOS',
    toko: 'App Store',
    ajakan: 'Unduh di',
    tautan: 's.komdigi.go.id/kosmo-ios',
    Ikon: Apple,
  },
]

/**
 * Padding isi mengikuti rasio desain: kolom konten 1350px berisi isi 1080px
 * dengan padding 135px kiri-kanan, yaitu 10% : 80% : 10%. Dalam persen,
 * rasio itu sama di layar selebar apa pun; lebar kartu ikut, karena grid-nya
 * juga proporsional. Ditulis di sini, bukan lewat Container, karena lebar dan
 * padding bawaan Container (1126px, padding sampai 56px) tidak mengikuti
 * rasio ini. Di bawah xl padding-nya tetap kecil supaya kartu masih lega.
 */
const LEBAR_ISI = 'w-full px-5 sm:px-6 xl:px-[10%]'

const sama = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Judul kartu: ikon kecil, judul, keterangan opsional, lalu isi tambahan di kanan. */
function JudulKartu({
  ikon,
  judul,
  keterangan,
  children,
}: {
  ikon?: ReactNode
  judul: string
  keterangan?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {ikon}
        <div className="min-w-0">
          <h2 className="text-body font-bold text-content">{judul}</h2>
          {keterangan && <p className="mt-0.5 text-body-sm text-content-subtle">{keterangan}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

/**
 * Hiasan kartu sapaan. Ilustrasi orang di depan layar di desain adalah gambar
 * yang belum ada di repo; sementara ini diganti bentuk sederhana dari token
 * warna kit. Ganti dengan <img> begitu berkas ilustrasinya tersedia.
 */
function Hiasan() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-4 bottom-0 -z-10 hidden h-44 w-80 sm:block"
    >
      <div className="absolute right-0 bottom-0 h-32 w-72 rounded-t-full bg-purple-200" />
      <div className="absolute top-0 left-6 size-14 rounded-full border-2 border-white/30" />
      <div className="absolute right-16 bottom-8 w-40 -rotate-6 rounded-lg bg-white p-2.5 shadow-soft">
        <div className="h-2 w-14 rounded-full bg-primary-200" />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className="h-9 rounded bg-primary-100" />
          <div className="h-9 rounded bg-primary-100" />
          <div className="h-9 rounded bg-orange-100" />
        </div>
        <div className="mt-2 h-1.5 w-28 rounded-full bg-gray-200" />
        <div className="mt-1 h-1.5 w-20 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}

/** Panah 16×12 milik panel Datepicker, untuk berpindah bulan. */
function Panah({ kanan }: { kanan?: boolean }) {
  return (
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
}

/**
 * Kalender bulanan selalu terbuka, bergaya kalender di panel Datepicker: panah
 * yang sama, judul dan tanggal text-xs, nama hari tiga huruf gray-500, tanggal
 * luar bulan gray-500, dan hari ini bertanda seperti tanggal terpilih
 * (bg-primary-700). Datepicker belum punya bentuk tanpa field, jadi
 * tampilannya disalin di sini. Bedanya satu, mengikuti desain: Minggu dan
 * Sabtu di bulan itu merah.
 *
 * Kisinya memenuhi kartu: tujuh kolom selebar kartu, dan baris tanggal ikut
 * memanjang bila kartu lebih tinggi dari isinya, mis. saat bersebelahan
 * dengan kartu wiki di layar md. Jarak lainnya mengikuti desain: judul 21px
 * dari tepi atas, baris tanggal minimal 25px, dan baris terakhir 23px dari
 * tepi bawah. Enam baris tetap: sisa minggu diisi tanggal bulan sebelum dan
 * sesudahnya.
 *
 * Di mode gelap warnanya mengikuti panel gelap Datepicker. Akhir pekan memakai
 * red-400, karena red-600 terlalu redup di atas kartu gray-700.
 */
function Kalender({ className, darkMode }: { className?: string; darkMode?: boolean }) {
  const [bulan, setBulan] = useState(() => new Date(HARI_INI.getFullYear(), HARI_INI.getMonth(), 1))
  const tahun = bulan.getFullYear()
  const indeks = bulan.getMonth()
  const geserAwal = new Date(tahun, indeks, 1).getDay()
  const sel = Array.from({ length: 42 }, (_, i) => new Date(tahun, indeks, i - geserAwal + 1))
  // Tombol panah seperti di Datepicker: area tekannya 6px lebih besar ke segala
  // arah, lalu ditarik kembali dengan margin negatif.
  const panah =
    '-m-1.5 justify-self-center rounded-lg p-1.5 text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand in-data-[theme=dark]:text-white in-data-[theme=dark]:hover:bg-gray-600'

  return (
    <Card className={className} darkMode={darkMode}>
      {/* Margin negatif menarik kalender ke jarak desain, yang lebih rapat dari
          padding bawaan Card (16px, lalu 24px mulai kartu 320px). `flex-1`
          mengisi sisa tinggi kartu, dan tabelnya membaginya ke baris tanggal. */}
      <div className="-mt-1 -mb-2 flex w-full flex-1 flex-col @xs:-mt-3 @xs:-mb-4">
        {/* Header ikut kisi 7 kolom, supaya panahnya tepat di atas kolom Min dan Sab. */}
        <div className="grid h-4.5 grid-cols-7 items-center">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => setBulan(new Date(tahun, indeks - 1, 1))}
            className={panah}
          >
            <Panah />
          </button>
          <h2
            aria-live="polite"
            className="col-span-5 text-center text-xs font-bold text-gray-900 in-data-[theme=dark]:text-white"
          >
            {BULAN[indeks]} {tahun}
          </h2>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => setBulan(new Date(tahun, indeks + 1, 1))}
            className={panah}
          >
            <Panah kanan />
          </button>
        </div>

        <table className="mt-2.5 w-full flex-1 table-fixed text-center text-xs">
          <caption className="sr-only">
            Kalender {BULAN[indeks]} {tahun}
          </caption>
          <thead>
            {/* Baris 30px: pb-1 menaruh nama hari 13px dari atasnya, dan sisanya
                menjadi jarak ke baris tanggal pertama, seperti desainnya. */}
            <tr className="h-7.5">
              {HARI.map((hari) => (
                <th
                  key={hari}
                  scope="col"
                  className="pb-1 font-medium text-gray-500 in-data-[theme=dark]:text-gray-400"
                >
                  {hari}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, baris) => (
              <tr key={baris} className="h-6.25">
                {sel.slice(baris * 7, baris * 7 + 7).map((tanggal, kolom) => {
                  const diLuar = tanggal.getMonth() !== indeks
                  const hariIni = sama(tanggal, HARI_INI)
                  const akhirPekan = kolom === 0 || kolom === 6

                  return (
                    <td key={tanggal.getTime()} className="p-0">
                      <span
                        aria-current={hariIni ? 'date' : undefined}
                        className={cn(
                          'mx-auto flex size-6.25 items-center justify-center rounded-lg font-semibold',
                          hariIni
                            ? 'bg-primary-700 text-white in-data-[theme=dark]:bg-primary-600'
                            : diLuar
                              ? 'text-gray-500'
                              : akhirPekan
                                ? 'text-red-600 in-data-[theme=dark]:text-red-400'
                                : 'text-gray-900 in-data-[theme=dark]:text-white',
                        )}
                      >
                        {tanggal.getDate()}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/**
 * Kartu unduhan aplikasi KOSMO untuk satu toko. Di desain kartu ini gambar
 * (logo, kode QR, dan lencana toko) yang belum ada di repo, jadi sementara
 * dirakit dari token warna dan ikon kit, termasuk kotak QR-nya. Ganti dengan
 * <img> begitu berkasnya tersedia. Warnanya tetap sama di mode gelap, seperti
 * kartu sapaan.
 */
function KartuKosmo({
  sistem,
  toko,
  ajakan,
  tautan,
  Ikon,
  onUnduh,
}: Omit<(typeof TOKO)[number], 'id'> & { onUnduh: () => void }) {
  return (
    <div className="relative isolate flex flex-col items-center gap-3 overflow-hidden rounded-lg bg-primary-800 px-3 pt-12 pb-4 text-white shadow-soft">
      <span
        aria-hidden="true"
        className="absolute top-3 left-3 grid size-8 place-items-center rounded-lg bg-white text-primary-800"
      >
        <Ikon className="size-5" />
      </span>
      <div aria-hidden="true" className="absolute -top-12 -right-14 -z-10 size-40 rounded-full bg-primary-700" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-12 -z-10 size-44 rounded-full bg-primary-900" />
      <p className="flex items-center gap-1.5 text-heading-4 font-black tracking-wide">
        <Rocket className="size-6 shrink-0" aria-hidden="true" />
        KOSMO
      </p>
      <div
        role="img"
        aria-label={`Kode QR unduhan KOSMO untuk ${sistem}`}
        className="grid aspect-square w-full max-w-36 place-items-center rounded-lg bg-white text-gray-900"
      >
        <QrCode className="size-3/4" aria-hidden="true" />
      </div>
      <p className="w-full truncate rounded bg-white px-1.5 py-0.5 text-center text-caption text-primary-800">
        {tautan}
      </p>
      <button
        type="button"
        onClick={onUnduh}
        className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-left ring-1 ring-white/50 transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Ikon className="size-5 shrink-0" aria-hidden="true" />
        <span className="leading-tight">
          <span className="block text-caption">{ajakan}</span>
          <span className="block text-body-sm font-semibold">{toko}</span>
        </span>
      </button>
    </div>
  )
}

export function PortalDashboard({
  darkMode = false,
  onDarkModeChange,
}: {
  /** Tampilan gelap seluruh dasbor. */
  darkMode?: boolean
  /** Dipanggil tombol tema di header. Tanpa prop ini tombolnya tidak dirender. */
  onDarkModeChange?: (darkMode: boolean) => void
} = {}) {
  const [ringkas, setRingkas] = useState(false)
  // Pesan demo tampil sebagai Toast di kanan atas lalu hilang sendiri. Teksnya
  // disimpan terpisah dari `tampil` supaya tidak lenyap sebelum Toast selesai
  // memudar, dan `kali` membuat pesan yang sama pun memulai ulang hitungannya.
  const [umpan, setUmpan] = useState({ teks: '', tampil: false, kali: 0 })
  const [kata, setKata] = useState('')
  const [kategori, setKategori] = useState('')
  const [sumber, setSumber] = useState('monsakti')
  const anggaran = ANGGARAN[sumber]
  const [semuaAplikasi, setSemuaAplikasi] = useState(false)

  useEffect(() => {
    if (!umpan.tampil) return
    const tutup = window.setTimeout(() => setUmpan((u) => ({ ...u, tampil: false })), 4000)
    return () => window.clearTimeout(tutup)
  }, [umpan.kali, umpan.tampil])

  const kabari = (teks: string) => setUmpan((u) => ({ teks, tampil: true, kali: u.kali + 1 }))

  // Hanya Dashboard yang dirancang; menu lain memberi tahu lewat Toast alih-alih
  // membuka halaman kosong.
  const menuDemo = (label: string) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    kabari(`Halaman ${label} belum ada di contoh ini.`)
  }

  const cari = (teks: string, kat: string) => {
    const kunci = teks.trim()
    const area = KATEGORI.find(({ value }) => value === kat)?.label ?? 'semua menu'
    kabari(kunci ? `Pencarian demo: "${kunci}" di ${area}.` : 'Ketik kata kunci dulu untuk mencari.')
  }

  const menuSidebar: SidebarItem[] = [
    ...MENU_SIDEBAR.map(({ id, label, Ikon }) => ({
      id,
      label,
      href: '#/portal-dashboard/app',
      icon: <Ikon className="size-5" />,
      active: id === 'dashboard',
      onClick: id === 'dashboard' ? undefined : menuDemo(label),
    })),
    {
      id: 'keluar',
      label: 'Keluar',
      href: '#/portal-dashboard',
      // Sidebar belum punya tone danger untuk item menu; ikonnya saja yang merah.
      icon: <ArrowRightToBracket className="size-5 text-red-600" />,
    },
  ]

  const navbarItems: NavbarPrimaryItem[] = MENU_NAVBAR.map(({ id, label, Ikon }) => ({
    id,
    type: 'destination',
    label,
    href: '#/portal-dashboard/app',
    icon: <Ikon className="size-5" />,
    onClick: menuDemo(label),
  }))

  const sidebarLogo = <img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="h-8 w-auto" />
  const sidebarCollapsedLogo = <img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="size-8" />
  const sidebarUser = {
    name: NAMA,
    profileLabel: 'Lihat Profile',
    avatarSrc: asset('/images/avatar-sample.svg'),
    onClick: () => kabari('Halaman profil belum ada di contoh ini.'),
    items: [{ id: 'logout', label: 'Keluar', tone: 'danger' as const, href: '#/portal-dashboard' }],
  }

  return (
    <div data-theme={darkMode ? 'dark' : undefined} className="flex min-h-screen bg-surface">
      {/* Sidebar desktop. Di bawah lg, Navbar memakai item dan akun Sidebar
          yang sama untuk panel navigasi selulernya. */}
      <div className="hidden lg:block">
        <Sidebar
          logo={sidebarLogo}
          collapsedLogo={sidebarCollapsedLogo}
          user={sidebarUser}
          items={menuSidebar}
          sticky
          collapsed={ringkas}
          onCollapse={() => setRingkas((v) => !v)}
          darkMode={darkMode}
          footer={
            onDarkModeChange ? (
              ringkas ? (
                <div className="flex justify-center p-3">
                  <Button
                    iconOnly
                    variant="outline"
                    size="s"
                    aria-label={darkMode ? 'Matikan mode gelap' : 'Nyalakan mode gelap'}
                    aria-pressed={darkMode}
                    title={darkMode ? 'Matikan mode gelap' : 'Nyalakan mode gelap'}
                    onClick={() => onDarkModeChange(!darkMode)}
                    darkMode={darkMode}
                  >
                    {darkMode ? <Sun /> : <Moon />}
                  </Button>
                </div>
              ) : (
                <div className="px-5 py-4">
                  <div
                    role="group"
                    aria-label="Pilih tema"
                    className="relative grid grid-cols-2 overflow-hidden rounded-full border border-border bg-surface-subtle p-1"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-7 -translate-x-1/2 -translate-y-1/2 border-l border-border"
                    />
                    <button
                      type="button"
                      aria-label="Gunakan mode terang"
                      aria-pressed={!darkMode}
                      onClick={() => onDarkModeChange(false)}
                      className={cn(
                        'flex h-9 items-center justify-center rounded-full border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand',
                        !darkMode
                          ? 'border-primary-700 text-primary-700 hover:bg-primary-50'
                          : 'text-content-muted hover:text-content',
                      )}
                    >
                      <Sun className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Gunakan mode gelap"
                      aria-pressed={darkMode}
                      onClick={() => onDarkModeChange(true)}
                      className={cn(
                        'flex h-9 items-center justify-center rounded-full border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand',
                        darkMode
                          ? 'border-gray-50 text-gray-50 hover:bg-white hover:text-gray-700'
                          : 'text-content-muted hover:text-content',
                      )}
                    >
                      <Moon className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )
            ) : undefined
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar dan Search internal mengikuti tema efektif yang sama. Garis
            field Search memakai gray-600 di mode gelap agar ruas kategorinya
            tidak melebur dengan header gray-700. */}
        <div className="sticky top-0 z-20">
          <Navbar
            platform="back-office"
            darkMode={darkMode}
            className="[--color-field-border-dark:var(--color-gray-600)]"
            brand={{
              content: <img src={asset('/images/ceplok.svg')} alt="" className="size-8" />,
              href: '#/portal-dashboard/app',
              ariaLabel: 'CEPLOK — Dashboard',
            }}
            items={navbarItems}
            sidebarItems={menuSidebar}
            sidebarUser={sidebarUser}
            search={{
              categories: KATEGORI,
              categoryPlaceholder: 'Pilih',
              category: kategori,
              onCategoryChange: setKategori,
              placeholder: 'Pencarian',
              'aria-label': 'Pencarian',
              buttonLabel: 'Cari',
              value: kata,
              onChange: (e) => setKata(e.target.value),
              onSearch: cari,
            }}
            notificationTrigger={{
              ariaLabel: 'Notifikasi',
              badge: 5,
              className: 'lg:ml-12',
              onClick: () => kabari('Ada 5 notifikasi baru.'),
            }}
          />
        </div>

        {/* Beri jarak 8px dari Navbar: tingginya 140px saat Search BO berada
            di baris kedua, lalu 94px mulai viewport 576px. */}
        <div className="fixed top-[148px] right-4 z-30 w-80 max-w-[calc(100vw-2rem)] min-[576px]:top-[102px] sm:right-6">
          <Toast
            open={umpan.tampil}
            onDismiss={() => setUmpan((u) => ({ ...u, tampil: false }))}
            darkMode={darkMode}
          >
            {umpan.teks}
          </Toast>
        </div>

        {/* Latar halaman gray-800 di mode gelap, setingkat di bawah kartu gray-700. */}
        <main className="flex-1 bg-blue-50 in-data-[theme=dark]:bg-gray-800">
          <div className={LEBAR_ISI}>
            <div className="space-y-5 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-heading-3 font-bold text-content">Dashboard</h1>
                <div className="flex items-center gap-2">
                  <Button
                    theme="primary"
                    size="s"
                    onClick={() => kabari('Pengaturan layout belum ada di contoh ini.')}
                    darkMode={darkMode}
                  >
                    Pengaturan Layout
                  </Button>
                </div>
              </div>

              {/* Satu kolom di layar sempit, dua kolom di md, lalu grid 12 kolom di xl
                  dengan pembagian seperti desainnya: 8/4, 5/7, 5/7, 12, lalu 7/5.
                  Jarak antarkartu 14px; di desain, baris ketiga dan sesudahnya
                  berjarak 20px, jadi kartunya diberi tambahan 6px di xl. */}
              <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-12">
                <section
                  aria-labelledby="portal-sapaan"
                  className="relative isolate flex min-h-56 flex-col overflow-hidden rounded-lg bg-primary-700 p-6 text-white shadow-soft md:col-span-2 xl:col-span-8"
                >
                  <p className="text-body">Selamat Datang,</p>
                  <h2 id="portal-sapaan" className="mt-1 text-heading-4 font-black">
                    {NAMA}!
                  </h2>
                  <Hiasan />
                  <p className="mt-auto max-w-xl self-start rounded bg-gray-900/30 px-2 py-1 text-body-sm">
                    Ketika kamu merasa lelah, ingatlah mengapa kamu memulai. Have a Good Day!
                  </p>
                </section>

                <Kalender className="xl:col-span-4" darkMode={darkMode} />

                <Card className="xl:col-span-5" darkMode={darkMode}>
                  {/* Ikon judul kartu naik ke tangga 400 di mode gelap: tangga
                      600–700 terlalu redup di atas kartu gray-700. */}
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-orange-600 in-data-[theme=dark]:text-orange-400">
                        <BookOpen />
                      </Icon>
                    }
                    judul="Space & Page Wiki Terbaru"
                  >
                    <a
                      href="#/portal-dashboard/app"
                      onClick={(e) => {
                        e.preventDefault()
                        kabari('Daftar wiki belum ada di contoh ini.')
                      }}
                      className="text-body-sm font-medium text-brand underline underline-offset-2 hover:text-brand-hover"
                    >
                      Lihat semua
                    </a>
                  </JudulKartu>
                  <ListView
                    size="sm"
                    decoration
                    gap="md"
                    darkMode={darkMode}
                    items={WIKI.map(({ judul, tanggal, penulis, ruang }) => ({
                      title: judul,
                      icon: <FileLines className="size-4" aria-hidden="true" />,
                      // ListView membungkus tiap metadata dengan <span> biasa, jadi
                      // ikon dan teksnya perlu pembungkus flex sendiri agar sebaris.
                      metadata: [
                        <span className="inline-flex items-center gap-1">
                          <CalendarMonth className="size-3.5" aria-hidden="true" />
                          {tanggal}
                        </span>,
                        <span className="inline-flex items-center gap-1">
                          <User className="size-3.5" aria-hidden="true" />
                          {penulis}
                        </span>,
                      ],
                      badge: (
                        <Badge variant="brand" size="sm" icon={<CodeBranch />}>
                          {ruang}
                        </Badge>
                      ),
                      actionLabel: 'Buka',
                      actionDisabled: true,
                      onAction: () => kabari(`Detail wiki "${judul}" belum ada di contoh ini.`),
                      interactiveFeedback: false,
                    }))}
                  />
                </Card>

                <Card className="relative xl:col-span-7" darkMode={darkMode}>
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-green-700 in-data-[theme=dark]:text-green-400">
                        <Cash />
                      </Icon>
                    }
                    judul="Anggaran"
                  >
                    <Select
                      aria-label="Sumber data anggaran"
                      options={Object.entries(ANGGARAN).map(([value, { label }]) => ({ value, label }))}
                      className="w-full sm:w-72"
                      value={sumber}
                      onChange={(e) => setSumber(e.target.value)}
                      darkMode={darkMode}
                    />
                  </JudulKartu>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body text-content">
                    <dt>Pagu</dt>
                    <dd className="text-right">{anggaran.pagu}</dd>
                    <dt>Realisasi</dt>
                    <dd className="text-right">{anggaran.realisasi}</dd>
                    <dt>Persentase</dt>
                    <dd className="text-right">{anggaran.persentase}</dd>
                  </dl>
                  <p className="text-body-sm text-content-subtle">Data Anggaran Per Tanggal 13 Oct 2026</p>
                  {/* Pola titik hiasan di pojok kanan bawah, seperti desainnya. Hanya di
                      xl: di sana kartu ini memanjang setinggi kartu wiki dan punya ruang
                      kosong; di layout satu kolom titiknya menimpa angka dan catatan.
                      Titik gray-200 terlalu terang di mode gelap, jadi diganti gray-600. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 bottom-5 hidden h-12 w-44 xl:block bg-[radial-gradient(var(--color-gray-200)_2px,transparent_2px)] bg-size-[16px_16px] in-data-[theme=dark]:bg-[radial-gradient(var(--color-gray-600)_2px,transparent_2px)]"
                  />
                </Card>

                <Card className="xl:col-span-5 xl:mt-1.5" darkMode={darkMode}>
                  {/* Di mode gelap token `border` sewarna kartu (gray-700), jadi
                      garisnya memakai gray-600 supaya tetap terlihat. */}
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-3 in-data-[theme=dark]:border-gray-600">
                    <h2 className="text-body font-bold text-content">Presensi Harian</h2>
                    <Badge variant="brand" size="sm" darkMode={darkMode}>
                      Kantor (WFO)
                    </Badge>
                  </div>
                  <p className="flex items-center gap-2 text-body-sm text-content-subtle">
                    <CalendarMonth className="size-4" aria-hidden="true" />
                    Selasa, 13 Oktober 2026
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-heading-2 font-bold text-content">14:03:52</span>
                    <Badge variant="gray" size="sm" darkMode={darkMode}>
                      WIB
                    </Badge>
                  </p>
                  <Alert variant="info" icon={<QuestionCircle />} dismissible={false} darkMode={darkMode}>
                    Rekomendasi waktu Check-In Anda adalah pukul 05.00 - Batas waktu Check-Out Anda adalah
                    pukul 22.00
                  </Alert>
                  {/* Jam presensi seperti desainnya: check-in hijau, check-out biru.
                      Kedua tombolnya selebar, dan warnanya naik ke tangga 400 di
                      mode gelap. */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-green-100 text-green-700 in-data-[theme=dark]:bg-green-900 in-data-[theme=dark]:text-green-400">
                        <ArrowLeftToBracket className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-caption text-content-muted">Jam Check-In Anda</p>
                        <p className="text-body-sm font-bold text-green-700 in-data-[theme=dark]:text-green-400">
                          07:12:45 WIB
                        </p>
                      </div>
                    </div>
                    <Button theme="gray" size="s" disabled className="w-40" darkMode={darkMode}>
                      SUDAH CHECK IN
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary-100 text-primary-700 in-data-[theme=dark]:bg-primary-900 in-data-[theme=dark]:text-primary-400">
                        <ArrowRightToBracket className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-caption text-content-muted">Jam Check-Out Anda</p>
                        <p className="text-body-sm font-bold text-primary-700 in-data-[theme=dark]:text-primary-400">
                          15:30:00 WIB
                        </p>
                      </div>
                    </div>
                    <Button
                      theme="primary"
                      size="s"
                      className="w-40"
                      onClick={() => kabari('Check-out belum ada di contoh ini.')}
                      darkMode={darkMode}
                    >
                      CHECK OUT
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 border-t border-border pt-3 in-data-[theme=dark]:border-gray-600">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gray-800 text-white in-data-[theme=dark]:bg-gray-900">
                      <Fingerprint className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-body-sm font-bold text-content">Detail Kehadiran</p>
                      <p className="text-caption text-content-muted">
                        Untuk detail data kehadiran, silakan cek di aplikasi Apik.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="md:col-span-2 xl:col-span-7 xl:mt-1.5" darkMode={darkMode}>
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-orange-600 in-data-[theme=dark]:text-orange-400">
                        <ClipboardList />
                      </Icon>
                    }
                    judul="Rencana dan Realisasi Kegiatan Harian"
                    keterangan="Selasa, 13 Oktober 2026"
                  />
                  <Alert variant="danger" icon={<ExclamationCircle />} dismissible={false} darkMode={darkMode}>
                    Pengisian Rencana dan Realisasi Kegiatan tidak diaktifkan untuk hari ini.
                  </Alert>
                </Card>

                {/* Tombol panah di tepi bawah kartu menonjol separuh ke luar, jadi
                    ia dipasang di pembungkus: Card memotong isinya dengan
                    overflow-hidden. Jarak bawah 20px di pembungkus memberi ruang
                    di bawah tombol itu, supaya tidak menempel ke kartu sesudahnya. */}
                <div className="relative mb-5 md:col-span-2 xl:col-span-12 xl:mt-1.5">
                  <Card className="h-full" darkMode={darkMode}>
                    <JudulKartu
                      ikon={
                        <Icon className="mt-0.5 text-purple-700 in-data-[theme=dark]:text-purple-400">
                          <Grid />
                        </Icon>
                      }
                      judul="Aplikasi Intranet"
                    >
                      {/* Oranye seperti desainnya, bukan brand seperti tautan kartu lain. */}
                      <a
                        href="#/portal-dashboard/app"
                        onClick={(e) => {
                          e.preventDefault()
                          kabari('Pengaturan urutan aplikasi belum ada di contoh ini.')
                        }}
                        className="text-body-sm font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700 in-data-[theme=dark]:text-orange-400 in-data-[theme=dark]:hover:text-orange-300"
                      >
                        Atur Urutan
                      </a>
                    </JudulKartu>
                    {/* Hover dan garis gelapnya mengikuti kartu ListView yang bisa diklik. */}
                    <ul id="portal-aplikasi" className="grid grid-cols-3 gap-3 pb-2 sm:grid-cols-4 lg:grid-cols-6">
                      {APLIKASI.slice(0, semuaAplikasi ? undefined : APLIKASI_RINGKAS).map(({ nama, Ikon, warna }) => (
                        <li key={nama}>
                          <button
                            type="button"
                            onClick={() => kabari(`Aplikasi ${nama} belum ada di contoh ini.`)}
                            className="flex size-full min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2 py-3 text-center text-caption text-content transition-all hover:border-primary-400/80 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand in-data-[theme=dark]:border-gray-600"
                          >
                            <Ikon className={cn('size-8 shrink-0', warna)} aria-hidden="true" />
                            {nama}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  {/* Membuka dan menutup sisa ubin. Panahnya berbalik saat terbuka. */}
                  <Button
                    iconOnly
                    size="xs"
                    theme="primary"
                    aria-label="Tampilkan semua aplikasi"
                    aria-controls="portal-aplikasi"
                    aria-expanded={semuaAplikasi}
                    onClick={() => setSemuaAplikasi((v) => !v)}
                    className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 shadow-soft"
                    darkMode={darkMode}
                  >
                    <ChevronDown className={cn('size-4 transition-transform', semuaAplikasi && 'rotate-180')} />
                  </Button>
                </div>

                <Card className="md:col-span-2 xl:col-span-7" darkMode={darkMode}>
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-orange-600 in-data-[theme=dark]:text-orange-400">
                        <Messages />
                      </Icon>
                    }
                    judul="Forum Terbaru"
                  >
                    <Button
                      variant="outline"
                      theme="primary"
                      size="s"
                      leftIcon={<CirclePlus className="size-6" />}
                      className="[&>span:first-child]:size-6"
                      onClick={() => kabari('Halaman buat forum belum ada di contoh ini.')}
                      darkMode={darkMode}
                    >
                      Buat Forum
                    </Button>
                  </JudulKartu>
                  {/* Ukuran lg (paling lebar 728px) supaya kartunya memenuhi kolom. */}
                  <ListView
                    size="lg"
                    gap="md"
                    darkMode={darkMode}
                    items={FORUM.map(({ penulis, kategori, waktu, judul, dilihat, komentar, suka }) => ({
                      variant: 'article' as const,
                      subject: penulis,
                      category: kategori,
                      timestamp: waktu,
                      title: judul,
                      views: dilihat,
                      comments: komentar,
                      likes: suka,
                      href: '#/portal-dashboard/app',
                      onClick: (e: MouseEvent<HTMLElement>) => {
                        e.preventDefault()
                        kabari(`Detail forum "${judul}" belum ada di contoh ini.`)
                      },
                    }))}
                  />
                </Card>

                {/* Sticky Post lalu kartu unduhan KOSMO: bertumpuk di samping forum
                    di xl, bersebelahan di md. `content-start` menjaga barisnya
                    tidak ikut memanjang setinggi forum. */}
                <div className="grid content-start gap-3.5 md:col-span-2 md:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
                  <Card darkMode={darkMode}>
                    <JudulKartu
                      ikon={
                        <Icon className="mt-0.5 text-red-600 in-data-[theme=dark]:text-red-400">
                          <Thumbtack />
                        </Icon>
                      }
                      judul="Sticky Post"
                    />
                    <ListView
                      size="sm"
                      decoration
                      gap="md"
                      darkMode={darkMode}
                      items={STICKY.map(({ judul, tanggal, penulis }) => ({
                        title: judul,
                        description: tanggal,
                        metadata: [penulis],
                        icon: null,
                        actionDisabled: true,
                        onAction: () => kabari(`Detail "${judul}" belum ada di contoh ini.`),
                        interactiveFeedback: false,
                      }))}
                    />
                  </Card>

                  <section aria-label="Unduh aplikasi KOSMO" className="grid grid-cols-2 gap-3.5">
                    {TOKO.map(({ id, ...toko }) => (
                      <KartuKosmo
                        key={id}
                        {...toko}
                        onUnduh={() => kabari(`Tautan KOSMO di ${toko.toko} belum ada di contoh ini.`)}
                      />
                    ))}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
