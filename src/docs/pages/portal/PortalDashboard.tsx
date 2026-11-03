import { useId, useState, type MouseEvent, type ReactNode } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Drawer,
  Icon,
  ListView,
  Search,
  Select,
  Sidebar,
  cn,
  type DrawerMenuItem,
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
  ChevronLeft,
  ChevronRight,
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
  Search as SearchIcon,
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

/**
 * Kalender bulanan selalu terbuka. Kit belum punya bentuk ini — Datepicker
 * hanya field dengan panel — jadi grid-nya dirakit di sini. Enam baris tetap
 * seperti desainnya: sisa minggu diisi tanggal bulan sebelum dan sesudahnya.
 */
function Kalender({ className }: { className?: string }) {
  const [bulan, setBulan] = useState(() => new Date(HARI_INI.getFullYear(), HARI_INI.getMonth(), 1))
  const tahun = bulan.getFullYear()
  const indeks = bulan.getMonth()
  const geserAwal = new Date(tahun, indeks, 1).getDay()
  const sel = Array.from({ length: 42 }, (_, i) => new Date(tahun, indeks, i - geserAwal + 1))
  const tombol =
    'grid size-8 place-items-center rounded-lg text-content-muted transition-colors hover:bg-surface-subtle hover:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Bulan sebelumnya"
          onClick={() => setBulan(new Date(tahun, indeks - 1, 1))}
          className={tombol}
        >
          <ChevronLeft className="size-4" />
        </button>
        <h2 aria-live="polite" className="text-body font-bold text-content">
          {BULAN[indeks]} {tahun}
        </h2>
        <button
          type="button"
          aria-label="Bulan berikutnya"
          onClick={() => setBulan(new Date(tahun, indeks + 1, 1))}
          className={tombol}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <table className="w-full table-fixed text-center text-body-sm">
        <caption className="sr-only">
          Kalender {BULAN[indeks]} {tahun}
        </caption>
        <thead>
          <tr>
            {HARI.map((hari) => (
              <th key={hari} scope="col" className="pb-1 text-caption font-medium text-content-muted">
                {hari}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, baris) => (
            <tr key={baris}>
              {sel.slice(baris * 7, baris * 7 + 7).map((tanggal, kolom) => {
                const diLuar = tanggal.getMonth() !== indeks
                const hariIni = sama(tanggal, HARI_INI)
                // Minggu dan Sabtu merah, seperti desainnya; tanggal di luar bulan tetap pudar.
                const akhirPekan = kolom === 0 || kolom === 6

                return (
                  <td key={tanggal.getTime()}>
                    <span
                      aria-current={hariIni ? 'date' : undefined}
                      className={cn(
                        'mx-auto grid size-7 place-items-center rounded-full',
                        diLuar
                          ? 'text-gray-300'
                          : hariIni
                            ? 'bg-primary-100 font-bold text-primary-700'
                            : akhirPekan
                              ? 'text-red-600'
                              : 'text-content',
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
    </Card>
  )
}

export function PortalDashboard() {
  const [ringkas, setRingkas] = useState(false)
  const [menuSeluler, setMenuSeluler] = useState(false)
  const [umpan, setUmpan] = useState('')
  const [kata, setKata] = useState('')
  const [kategori, setKategori] = useState('')
  const [sumber, setSumber] = useState('monsakti')
  const idMenuSeluler = useId()
  const anggaran = ANGGARAN[sumber]

  // Hanya Dashboard yang dirancang; menu lain memberi tahu lewat baris status
  // alih-alih membuka halaman kosong.
  const menuDemo = (label: string) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setMenuSeluler(false)
    setUmpan(`Halaman ${label} belum ada di contoh ini.`)
  }

  const cari = (teks: string) => {
    const kunci = teks.trim()
    const area = KATEGORI.find(({ value }) => value === kategori)?.label ?? 'semua menu'
    setUmpan(kunci ? `Pencarian demo: "${kunci}" di ${area}.` : 'Ketik kata kunci dulu untuk mencari.')
  }

  const menuSidebar: SidebarItem[] = [
    ...MENU.map(({ id, label, Ikon }) => ({
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

  const menuDrawer: DrawerMenuItem[] = menuSidebar.map(({ id, label, href, icon, active }) => ({
    id,
    label,
    href,
    icon,
    active,
    onClick: id === 'dashboard' || id === 'keluar' ? () => setMenuSeluler(false) : menuDemo(label),
  }))

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Di bawah lg Sidebar disembunyikan; menunya pindah ke Drawer dari tombol di header. */}
      <div className="hidden lg:block">
        <Sidebar
          logo={<img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="h-8 w-auto" />}
          collapsedLogo={<img src={asset('/images/ceplok.svg')} alt="CEPLOK" className="size-8" />}
          user={{
            name: NAMA,
            profileLabel: 'Lihat Profile',
            avatarSrc: asset('/images/avatar-sample.svg'),
            onClick: () => setUmpan('Halaman profil belum ada di contoh ini.'),
          }}
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

          {/* Lebar diatur pembungkusnya: pembungkus terluar Select selalu
              membawa w-full, jadi kelas lebar yang dititipkan ke sana bisa kalah. */}
          <div role="search" className="ml-auto hidden items-center gap-2 md:flex">
            <div className="w-44 shrink-0 xl:w-56">
              <Search
                platform="compact"
                showButton={false}
                trigger="enter"
                placeholder="Pencarian"
                aria-label="Pencarian"
                value={kata}
                onChange={(e) => setKata(e.target.value)}
                onSearch={cari}
              />
            </div>
            <div className="w-40 shrink-0">
              <Select
                placeholder="Pilih"
                aria-label="Cari di menu"
                options={KATEGORI}
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              />
            </div>
            <Button iconOnly size="s" className="shrink-0" aria-label="Cari" onClick={() => cari(kata)}>
              <SearchIcon />
            </Button>
          </div>

          <span aria-hidden="true" className="ml-auto h-8 w-px bg-border md:ml-2" />

          <button
            type="button"
            aria-label="Notifikasi, 5 belum dibaca"
            onClick={() => setUmpan('Ada 5 notifikasi baru.')}
            className="relative grid size-10 place-items-center rounded-lg text-primary-700 transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Bell className="size-6" />
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 grid h-4.5 min-w-4.5 place-items-center rounded bg-red-600 px-1 text-caption leading-none font-bold text-white"
            >
              5
            </span>
          </button>
        </header>

        {umpan && (
          <div className="border-b border-border bg-surface">
            <Container>
              <p role="status" aria-live="polite" className="py-2 text-body-sm text-content-subtle">
                {umpan}
              </p>
            </Container>
          </div>
        )}

        <main className="flex-1">
          <Container>
            <div className="space-y-6 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-heading-3 font-bold text-content">Dashboard</h1>
                <Button
                  variant="outline"
                  size="s"
                  onClick={() => setUmpan('Pengaturan layout belum ada di contoh ini.')}
                >
                  Pengaturan Layout
                </Button>
              </div>

              {/* Satu kolom di layar sempit, dua kolom di md, lalu grid 12 kolom di xl
                  dengan pembagian seperti desainnya: 8/4, 5/7, 5/7. */}
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
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
                        setUmpan('Daftar wiki belum ada di contoh ini.')
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

                <Card className="xl:col-span-5">
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

                <Card className="md:col-span-2 xl:col-span-7">
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
          </Container>
        </main>
      </div>

      <Drawer
        id={idMenuSeluler}
        open={menuSeluler}
        onClose={() => setMenuSeluler(false)}
        position="left"
        size="s"
        eyebrow="Portal Dashboard"
        header={<Drawer.Title>Menu</Drawer.Title>}
        items={menuDrawer}
      />
    </div>
  )
}
