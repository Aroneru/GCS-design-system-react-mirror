import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Icon,
  ListView,
  Search,
  Select,
  Sidebar,
  Toast,
  cn,
  type SidebarItem,
} from '../../../lib'
import {
  ArrowRightToBracket,
  Bars,
  Bell,
  BookOpen,
  Bullhorn,
  CalendarMonth,
  Cash,
  ClipboardList,
  Clock,
  CodeBranch,
  ExclamationCircle,
  FileLines,
  Home,
  Lightbulb,
  Messages,
  Newspaper,
  QuestionCircle,
  User,
} from '../../../lib/icons/outline'
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
 * sapaan, dan hiasannya.
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
 * Jaraknya mengikuti desain: kisi 7 kolom selebar 240px di tengah kartu, judul
 * 21px dari tepi atas, baris tanggal 25px, dan baris terakhir 23px dari tepi
 * bawah. Enam baris tetap: sisa minggu diisi tanggal bulan sebelum dan
 * sesudahnya.
 */
function Kalender({ className }: { className?: string }) {
  const [bulan, setBulan] = useState(() => new Date(HARI_INI.getFullYear(), HARI_INI.getMonth(), 1))
  const tahun = bulan.getFullYear()
  const indeks = bulan.getMonth()
  const geserAwal = new Date(tahun, indeks, 1).getDay()
  const sel = Array.from({ length: 42 }, (_, i) => new Date(tahun, indeks, i - geserAwal + 1))
  // Tombol panah seperti di Datepicker: area tekannya 6px lebih besar ke segala
  // arah, lalu ditarik kembali dengan margin negatif.
  const panah =
    '-m-1.5 justify-self-center rounded-lg p-1.5 text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  return (
    <Card className={className}>
      {/* Margin negatif menarik kalender ke jarak desain, yang lebih rapat dari
          padding bawaan Card (16px, lalu 24px mulai kartu 320px). */}
      <div className="mx-auto -mt-1 -mb-2 w-full max-w-60 @xs:-mt-3 @xs:-mb-4">
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
          <h2 aria-live="polite" className="col-span-5 text-center text-xs font-bold text-gray-900">
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

        <table className="mt-2.5 w-full table-fixed text-center text-xs">
          <caption className="sr-only">
            Kalender {BULAN[indeks]} {tahun}
          </caption>
          <thead>
            {/* Baris 30px: pb-1 menaruh nama hari 13px dari atasnya, dan sisanya
                menjadi jarak ke baris tanggal pertama, seperti desainnya. */}
            <tr className="h-7.5">
              {HARI.map((hari) => (
                <th key={hari} scope="col" className="pb-1 font-medium text-gray-500">
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
                            ? 'bg-primary-700 text-white'
                            : diLuar
                              ? 'text-gray-500'
                              : akhirPekan
                                ? 'text-red-600'
                                : 'text-gray-900',
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

export function PortalDashboard() {
  const [ringkas, setRingkas] = useState(false)
  const [menuSeluler, setMenuSeluler] = useState(false)
  // Pesan demo tampil sebagai Toast di kanan atas lalu hilang sendiri. Teksnya
  // disimpan terpisah dari `tampil` supaya tidak lenyap sebelum Toast selesai
  // memudar, dan `kali` membuat pesan yang sama pun memulai ulang hitungannya.
  const [umpan, setUmpan] = useState({ teks: '', tampil: false, kali: 0 })
  const [kata, setKata] = useState('')
  const [kategori, setKategori] = useState('')
  const [sumber, setSumber] = useState('monsakti')
  const idMenuSeluler = useId()
  const sidebarSelulerRef = useRef<HTMLDialogElement>(null)
  const anggaran = ANGGARAN[sumber]

  useEffect(() => {
    if (!umpan.tampil) return
    const tutup = window.setTimeout(() => setUmpan((u) => ({ ...u, tampil: false })), 4000)
    return () => window.clearTimeout(tutup)
  }, [umpan.kali, umpan.tampil])

  useEffect(() => {
    const dialog = sidebarSelulerRef.current
    if (!dialog) return
    if (menuSeluler && !dialog.open) dialog.showModal()
    if (!menuSeluler && dialog.open) dialog.close()
  }, [menuSeluler])

  const kabari = (teks: string) => setUmpan((u) => ({ teks, tampil: true, kali: u.kali + 1 }))

  // Hanya Dashboard yang dirancang; menu lain memberi tahu lewat Toast alih-alih
  // membuka halaman kosong.
  const menuDemo = (label: string) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setMenuSeluler(false)
    kabari(`Halaman ${label} belum ada di contoh ini.`)
  }

  const cari = (teks: string, kat: string) => {
    const kunci = teks.trim()
    const area = KATEGORI.find(({ value }) => value === kat)?.label ?? 'semua menu'
    kabari(kunci ? `Pencarian demo: "${kunci}" di ${area}.` : 'Ketik kata kunci dulu untuk mencari.')
  }

  const menuSidebar: SidebarItem[] = [
    ...MENU.map(({ id, label, Ikon }) => ({
      id,
      label,
      href: '#/portal-dashboard/app',
      icon: <Ikon className="size-5" />,
      active: id === 'dashboard',
      onClick: id === 'dashboard' ? () => setMenuSeluler(false) : menuDemo(label),
    })),
    {
      id: 'keluar',
      label: 'Keluar',
      href: '#/portal-dashboard',
      // Sidebar belum punya tone danger untuk item menu; ikonnya saja yang merah.
      icon: <ArrowRightToBracket className="size-5 text-red-600" />,
      onClick: () => setMenuSeluler(false),
    },
  ]

  const sidebarLogo = <img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="h-8 w-auto" />
  const sidebarCollapsedLogo = <img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="size-8" />
  const sidebarUser = {
    name: NAMA,
    profileLabel: 'Lihat Profile',
    avatarSrc: asset('/images/avatar-sample.svg'),
    onClick: () => kabari('Halaman profil belum ada di contoh ini.'),
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop dan mobile memakai komponen, akun, dan item Sidebar yang sama.
          Di bawah lg instance mobile tampil sebagai panel modal dari kiri. */}
      <div className="hidden lg:block">
        <Sidebar
          logo={sidebarLogo}
          collapsedLogo={sidebarCollapsedLogo}
          user={sidebarUser}
          items={menuSidebar}
          sticky
          collapsed={ringkas}
          onCollapse={() => setRingkas((v) => !v)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-18 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
          <Button
            iconOnly
            variant="outline"
            theme="gray"
            size="s"
            className="lg:hidden"
            aria-label="Buka menu"
            aria-expanded={menuSeluler}
            aria-controls={idMenuSeluler}
            onClick={() => setMenuSeluler(true)}
          >
            <Bars />
          </Button>
          <img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="size-8 lg:hidden" />

          {/* Search berkategori di kiri, selebar slot search Navbar back-office:
              348px, menyusut sampai 180px bila ruangnya kurang. Varian kategori
              membawa role="search" sendiri, jadi pembungkus ini tidak. */}
          <div className="hidden w-87 max-w-87 min-w-45 flex-[0_1_348px] md:block">
            <Search
              categories={KATEGORI}
              categoryPlaceholder="Pilih"
              category={kategori}
              onCategoryChange={setKategori}
              placeholder="Pencarian"
              aria-label="Pencarian"
              buttonLabel="Cari"
              trigger="enter"
              value={kata}
              onChange={(e) => setKata(e.target.value)}
              onSearch={cari}
            />
          </div>

          {/* Lonceng bergaya notificationTrigger Navbar front-office: ikon 20px
              gray-500 dalam kotak 36px, tanpa angka. */}
          <button
            type="button"
            aria-label="Notifikasi"
            onClick={() => kabari('Ada 5 notifikasi baru.')}
            className="ml-auto grid size-9 shrink-0 place-items-center rounded-lg text-content-muted transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Bell className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* Toast di kanan atas, tepat di bawah header. */}
        <div className="fixed top-22 right-4 z-30 w-80 max-w-[calc(100vw-2rem)] sm:right-6">
          <Toast open={umpan.tampil} onDismiss={() => setUmpan((u) => ({ ...u, tampil: false }))}>
            {umpan.teks}
          </Toast>
        </div>

        <main className="flex-1 bg-blue-50">
          <div className={LEBAR_ISI}>
            <div className="space-y-5 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-heading-3 font-bold text-content">Dashboard</h1>
                <Button
                  variant="outline"
                  size="s"
                  onClick={() => kabari('Pengaturan layout belum ada di contoh ini.')}
                >
                  Pengaturan Layout
                </Button>
              </div>

              {/* Satu kolom di layar sempit, dua kolom di md, lalu grid 12 kolom di xl
                  dengan pembagian seperti desainnya: 8/4, 5/7, 5/7. Jarak antarkartu
                  14px; di desain, baris ketiga berjarak 20px, jadi kartunya diberi
                  tambahan 6px di xl. */}
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

                <Kalender className="xl:col-span-4" />

                <Card className="xl:col-span-5">
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-orange-600">
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

                <Card className="relative xl:col-span-7">
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-green-700">
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
                      kosong; di layout satu kolom titiknya menimpa angka dan catatan. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 bottom-5 hidden h-12 w-44 xl:block bg-[radial-gradient(var(--color-gray-200)_2px,transparent_2px)] bg-size-[16px_16px]"
                  />
                </Card>

                <Card className="xl:col-span-5 xl:mt-1.5">
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                    <h2 className="text-body font-bold text-content">Presensi Harian</h2>
                    <Badge variant="brand" size="sm">
                      Kantor (WFO)
                    </Badge>
                  </div>
                  <p className="flex items-center gap-2 text-body-sm text-content-subtle">
                    <CalendarMonth className="size-4" aria-hidden="true" />
                    Selasa, 13 Oktober 2026
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-heading-2 font-bold text-content">14:03:52</span>
                    <Badge variant="gray" size="sm">
                      WIB
                    </Badge>
                  </p>
                  <Alert variant="info" icon={<QuestionCircle />} dismissible={false}>
                    Rekomendasi waktu Check-In Anda adalah pukul 05.00 - Batas waktu Check-Out Anda adalah
                    pukul 22.00
                  </Alert>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-green-100 text-green-700">
                        <Clock className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-caption text-content-muted">Jam Check-In Anda</p>
                        <p className="text-body-sm font-bold text-content">07:12:45 WIB</p>
                      </div>
                    </div>
                    <Button theme="gray" size="s" disabled>
                      SUDAH CHECK IN
                    </Button>
                  </div>
                </Card>

                <Card className="md:col-span-2 xl:col-span-7 xl:mt-1.5">
                  <JudulKartu
                    ikon={
                      <Icon className="mt-0.5 text-orange-600">
                        <ClipboardList />
                      </Icon>
                    }
                    judul="Rencana dan Realisasi Kegiatan Harian"
                    keterangan="Selasa, 13 Oktober 2026"
                  />
                  <Alert variant="danger" icon={<ExclamationCircle />} dismissible={false}>
                    Pengisian Rencana dan Realisasi Kegiatan tidak diaktifkan untuk hari ini.
                  </Alert>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <dialog
        ref={sidebarSelulerRef}
        id={idMenuSeluler}
        aria-label="Navigasi Portal Dashboard"
        className="fixed inset-y-0 left-0 right-auto m-0 h-full max-h-full w-[280px] max-w-[calc(100vw-2rem)] overflow-visible border-0 bg-transparent p-0 shadow-none backdrop:bg-gray-900/50 lg:hidden"
        onCancel={(event: SyntheticEvent<HTMLDialogElement>) => {
          event.preventDefault()
          setMenuSeluler(false)
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuSeluler(false)
        }}
        onClose={() => {
          if (menuSeluler) setMenuSeluler(false)
        }}
      >
        <Sidebar
          logo={sidebarLogo}
          collapsedLogo={sidebarCollapsedLogo}
          user={sidebarUser}
          items={menuSidebar}
          collapsed={false}
          onCollapse={() => setMenuSeluler(false)}
          className="h-full !min-h-0 max-w-full shadow-2xl"
        />
      </dialog>
    </div>
  )
}
