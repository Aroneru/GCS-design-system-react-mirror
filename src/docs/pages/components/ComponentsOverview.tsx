import { CheckCircle, CloseCircle, Hourglass, InfoCircle } from "flowbite-react-icons/outline";
import { Clock } from "flowbite-react-icons/solid";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Footer,
  Hero,
  Icon,
  Navbar,
  Pagination,
  Sidebar,
  Spinner,
  Timeline,
  Toast,
  Drawer,
  ListViewItem,
} from "../../../lib";
// Internal: kartu Drawer memakai sub-komponennya tanpa akar Drawer, jadi tema
// gelapnya diberikan lewat konteks yang biasanya dipasang akar itu.
import { DrawerContext, type DrawerContextValue } from "../../../lib/components/DrawerContext";
import { useDocsDark } from "../../docsTheme";
import { OverviewCard, OverviewPage } from "../../pageKit";
import { asset } from "../../asset";
import { FacebookIcon, InstagramIcon, XIcon } from "../../socialIcons";

const tanpaAksi = () => undefined;

export function ComponentsOverview() {
  // Di mode gelap docs pratinjaunya ikut gelap: komponen dengan prop `darkMode`
  // menerimanya, sedangkan tiruan statis dan komponen yang mengikuti tema
  // pembungkus (Avatar, Navbar) memakai `data-theme`; tiruan statis memakai
  // pasangan utilitas `dark:`.
  const docsDark = useDocsDark();
  const tema = docsDark ? "dark" : undefined;
  const konteksDrawer: DrawerContextValue = {
    onClose: tanpaAksi,
    titleId: "",
    descriptionId: "",
    registerTitle: tanpaAksi,
    registerDescription: tanpaAksi,
    darkMode: docsDark,
  };

  return (
    <OverviewPage
      eyebrow="Components · Overview"
      title="Components"
      description="Komponen React siap pakai dari package @ceplok-ui/design-kit-react. Dipakai lewat import { Nama } from '@ceplok-ui/design-kit-react' setelah package terpasang."
    >
      <OverviewCard
        route="/components/container"
        name="Container"
        desc="Pembungkus lebar konten: 380px di mobile (rounded), maksimum 1126px di desktop."
        wide
      >
        <div className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <div className="mx-auto max-w-[220px] rounded-lg border-2 border-dashed border-primary-300 bg-white px-4 py-6 text-center dark:border-primary-700 dark:bg-gray-700">
            <span className="text-xs font-black text-primary-700 dark:text-primary-300">1126px · 380px</span>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/button"
        name="Button"
        desc="Aksi utama dengan variant filled atau outline, enam theme warna, dan lima ukuran."
      >
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Button variant="outline" darkMode={docsDark}>Secondary</Button>
          <Button variant="filled" darkMode={docsDark}>Primary</Button>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/clipboard"
        name="Clipboard"
        desc="Teks hanya-baca dengan tombol salin, label, dan keterangan opsional."
      >
        <div aria-hidden="true" data-theme={tema} className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <div className="mb-2 text-sm font-medium text-content">Nomor referensi</div>
          <div className="flex items-center gap-2">
            <div className="flex h-10.5 min-w-0 flex-1 items-center rounded-lg border border-gray-300 bg-surface-subtle px-3 text-sm text-content dark:border-gray-800"><span className="truncate">INV-2026-001</span></div>
            <span className="inline-flex h-10.5 shrink-0 items-center rounded-lg bg-primary-700 px-4 text-sm font-medium text-white">Copy</span>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/badge"
        name="Badge"
        desc="Label status ringkas dengan lima variant warna semantik."
      >
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Badge variant="success" icon={<CheckCircle />} darkMode={docsDark}>Aktif</Badge>
          <Badge variant="warning" icon={<Hourglass />} darkMode={docsDark}>Menunggu</Badge>
          <Badge variant="danger" icon={<CloseCircle />} darkMode={docsDark}>Ditolak</Badge>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/alert"
        name="Alert"
        desc="Pesan status di dalam alur halaman dengan lima variant warna dan elemen yang sepenuhnya opsional."
      >
        <div className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Alert variant="success" heading="Ini adalah Alert" dismissible={false} darkMode={docsDark}>
            Ini merupakan Design system Ceplok berupa component alert.
          </Alert>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/avatar"
        name="Avatar"
        desc="Lingkaran identitas berisi foto profil, atau inisial namanya bila fotonya tidak ada."
      >
        <div data-theme={tema} className="flex items-center justify-center gap-4 rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Avatar src={asset("/images/avatar-sample.svg")} name="Putri Handayani" alt="" size="large" />
          <Avatar initials="PH" />
          <Avatar initials="PH" size="small" />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/spinner"
        name="Spinner"
        desc="Indikator proses berputar dalam ukuran default dan large."
      >
        <div className="flex items-center justify-center rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Spinner aria-label="Memuat preview" />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/popover"
        name="Popover"
        desc="Menampilkan informasi kontekstual secara ringkas di dekat elemen yang memicunya."
      >
        {/* Tiruan Popover memakai token Popover, jadi `data-theme` cukup untuk membuatnya gelap. */}
        <div
          data-theme={tema}
          className="flex items-center justify-center rounded-xl bg-surface-subtle p-5 dark:bg-gray-900"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center text-gray-500 dark:text-gray-400">
              <Icon className="size-5">
                <InfoCircle />
              </Icon>
            </span>
            <div className="relative w-56 shrink-0 [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.08))]">
              <span className="pointer-events-none absolute top-1/2 left-[-8px] z-30 size-4 -translate-y-1/2 -rotate-90">
                <span className="absolute top-[3.25px] left-[3px] size-2.5 rotate-45 border-t border-l border-popover-border bg-popover-surface" />
              </span>
              <div className="relative z-10 overflow-hidden rounded-md bg-popover-surface">
                <div className="border-b border-popover-border bg-popover-header-surface px-3 py-2 text-xs font-semibold text-popover-header-content">
                  Informasi
                </div>
                <div className="bg-popover-surface px-3 py-2 text-xs font-medium text-popover-body-content">
                  <span className="whitespace-nowrap">Informasi tambahan yang relevan</span>
                  <br />
                  <span className="whitespace-nowrap">untuk membantu memahami konteks.</span>
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 rounded-md border border-popover-border"
                />
              </div>
            </div>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/dropdown"
        name="Dropdown"
        desc="Kumpulan aksi atau pilihan tambahan yang dibuka dari sebuah trigger."
      >
        {/* Tiruan Dropdown memakai token Dropdown, sama seperti tiruan Popover di atas. */}
        <div data-theme={tema} className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <div className="mx-auto flex w-fit max-w-full flex-col items-center gap-2">
            <div className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 text-base font-medium text-white">
              Dropdown button
              <svg
                aria-hidden="true"
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="w-full rounded-lg bg-dropdown-surface py-1 shadow-md" aria-hidden="true">
              <div className="px-4 py-2 text-sm font-medium text-dropdown-item-content">Profil</div>
              <div className="px-4 py-2 text-sm font-medium text-dropdown-item-content">Pengaturan</div>
              <div className="my-1 border-t border-border" />
              <div className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400">Keluar</div>
            </div>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/modal"
        name="Modal"
        desc="Dialog terkontrol untuk informasi atau tindakan yang harus diselesaikan sebelum kembali ke halaman utama."
      >
        <div className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <div className="mx-auto max-w-[240px] overflow-hidden rounded-lg border border-border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-gray-700">
              <div className="h-2.5 w-24 rounded bg-gray-300 dark:bg-gray-600" />
              <div className="size-3 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="space-y-2 px-4 py-5">
              <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-1.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="border-t border-border px-4 py-3 dark:border-gray-700">
              <div className="h-6 w-20 rounded-lg bg-primary-700 dark:bg-primary-600" />
            </div>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/drawer"
        name="Drawer"
        desc="Panel kontekstual di tepi layar (Side Sheet / Off-canvas) untuk form, filter, atau detail data."
      >
        <div className="relative flex h-[264px] flex-col overflow-hidden rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          {/* Latar skeleton agar selaras dengan Toast */}
          <div className="space-y-3 opacity-60" aria-hidden="true">
            <div className="h-2 w-2/5 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 h-2 w-1/3 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 h-2 w-2/5 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Overlay / Backdrop */}
          <div className="absolute inset-0 bg-gray-900/40" />

          {/* Drawer Panel Menggunakan Sub-komponen Asli. Panel gelapnya bg-gray-800 bergaris gray-700, seperti Drawer ber-darkMode. */}
          <div className="absolute bottom-0 right-0 top-0 flex w-48 flex-col border-l-[0.5px] border-gray-200 bg-white shadow-2xl [&_a]:!py-2 [&_a]:!text-sm [&_button]:!py-2 [&_button]:!text-sm dark:border-gray-700 dark:bg-gray-800">
            <DrawerContext.Provider value={konteksDrawer}>
              <Drawer.Header eyebrow="MENU" showCloseButton={false} className="!px-4 !pb-3 !pt-5 [&_span]:!text-xs" />
              <Drawer.Body className="space-y-1 !p-3">
                <Drawer.NavItem label="Beranda" active theme="primary" />
                <Drawer.NavItem label="Layanan" />
                <Drawer.NavItem label="Laporan" />
              </Drawer.Body>
            </DrawerContext.Provider>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/toast"
        name="Toast"
        desc="Notifikasi sekilas yang melayang di atas konten, dengan heading dan aksi opsional."
      >
        {/*
          Skeleton halaman di belakangnya penting: Toast bedanya dengan Alert
          justru karena ia melayang di atas konten, bukan menempati alur. Tanpa
          latar ini kartunya tak terbedakan dari kartu Alert.
          mt-auto menurunkan Toast ke sudut bawah kiri, memakai sisa tinggi
          kartu yang memang diserap preview.
        */}
        <div className="flex flex-col rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <div className="space-y-3 opacity-60" aria-hidden="true">
            <div className="h-2 w-2/5 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 h-2 w-1/3 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="mt-auto max-w-80 pt-8">
            <Toast variant="success" darkMode={docsDark}>
              Sukses Membuat Data!
            </Toast>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/card"
        name="Card"
        desc="Wadah informasi dengan gambar, judul, deskripsi, dan aksi yang semuanya opsional."
      >
        <div className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Card
            image={asset("/images/card-sample.svg")}
            imageAlt=""
            title="Judul Kartu"
            description="Deskripsi singkat yang menjelaskan isi kartu dalam satu atau dua baris."
            darkMode={docsDark}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/sidebar"
        name="Sidebar"
        desc="Navigasi samping dengan grup menu, submenu, profil akun, dan mode ringkas."
      >
        <div className="relative flex h-[264px] flex-col overflow-hidden rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          {/* Skeleton Konten Halaman */}
          <div className="ml-56 hidden space-y-3 opacity-60 sm:block" aria-hidden="true">
            <div className="h-2 w-2/5 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 h-2 w-1/3 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Sidebar Asli Full. Pembungkusnya sewarna Sidebar gelap (gray-700). */}
          <div className="absolute bottom-0 left-0 top-0 flex w-56 flex-col overflow-hidden border-r-[0.5px] border-gray-200 bg-white shadow-sm [&>aside]:min-h-full [&>aside]:w-full [&>aside]:border-none [&_nav]:!overflow-hidden dark:border-gray-700 dark:bg-gray-700">
            <Sidebar
              darkMode={docsDark}
              logo={
                <div className="flex items-center gap-2">
                  <div className="grid size-8 grid-cols-2 gap-0.5 rounded-md bg-primary-700 p-1.5">
                    <div className="rounded-sm bg-white" />
                    <div className="rounded-sm bg-primary-300" />
                    <div className="rounded-sm bg-primary-300" />
                    <div className="rounded-sm bg-white" />
                  </div>
                  <span className="text-sm font-black tracking-tight">CEPLOK</span>
                </div>
              }
              items={[
                { label: "Beranda", active: true },
                { label: "Layanan" },
                { label: "Laporan" },
                { label: "Pengaturan" },
              ]}
            />
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/table-of-contents"
        name="Table of Contents"
        desc="Daftar isi “On this page” yang menyorot bagian yang sedang dibaca."
      >
        {/*
          Kartu Overview sendiri sudah berupa <a>, jadi <TableOfContents> asli
          tidak bisa dipasang di sini: tautan di dalam tautan tidak sah dan
          peramban akan memecah DOM-nya. Yang dirender tiruan statis dengan
          ukuran dan warna yang sama; isi halamannya berupa skeleton.
        */}
        <div
          data-theme={tema}
          className="relative flex h-[264px] gap-6 overflow-hidden rounded-xl bg-surface-subtle p-5 dark:bg-gray-900"
          aria-hidden="true"
        >
          <div className="min-w-0 flex-1 space-y-3 rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800">
            <div className="h-2 w-2/5 rounded bg-primary-300 dark:bg-primary-700" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 h-2 w-1/3 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-6 h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="w-36 shrink-0 pt-1">
            <p className="text-[11px] leading-4 font-bold tracking-[0.14em] text-content-disabled uppercase">
              On this page
            </p>
            <ul className="mt-3 border-l border-border">
              {["Tampilan dasar", "Variasi", "Dark mode", "Playground", "Properties"].map(
                (label, i) => (
                  <li
                    key={label}
                    className={`-ml-px border-l-2 py-1.5 pl-3.5 text-xs leading-5 ${
                      i === 0 ? "border-brand text-brand" : "border-transparent text-content-subtle"
                    }`}
                  >
                    {label}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/list-view"
        name="List View"
        desc="Kartu daftar berkas dan dokumen dengan wadah ikon, metadata ringkas, dan aksi cepat."
      >
        <div className="flex flex-col justify-center gap-2 rounded-xl bg-surface-subtle p-3 dark:bg-gray-900">
          <ListViewItem
            size="s"
            title="Project brief"
            metadata={["PDF", "2.4 MB"]}
            actionLabel="Open"
            darkMode={docsDark}
          />
          <ListViewItem
            size="s"
            title="Project brief"
            metadata={["PDF", "2.4 MB"]}
            actionLabel="Open"
            darkMode={docsDark}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/timeline"
        name="Timeline View"
        desc="Riwayat kejadian berurutan dengan avatar, waktu, dan status di tiap langkah."
      >
        <div className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Timeline
            darkMode={docsDark}
            platform="mobile"
            size="small"
            items={[
              { name: "User 01", role: "Role / Department", time: new Date("2026-01-01T09:00") },
              {
                name: "User 02",
                role: "Role / Department",
                time: new Date("2026-01-01T09:05"),
                status: { label: "Badge", icon: <Clock />, dismissible: true },
              },
            ]}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/navbar"
        name="Navbar"
        desc="Navigasi responsif dengan search, menu, guest actions, dan account controls."
        wide
      >
        {/* Navbar mengikuti tema pembungkusnya lewat `data-theme`. */}
        <div data-theme={tema} className="overflow-hidden rounded-xl bg-surface-subtle p-2 dark:bg-gray-900">
          <Navbar
            platform="front-office"
            brand={{
              content: <span className="text-sm font-black text-content">CEPLOK</span>,
              href: "#/",
              ariaLabel: "CEPLOK — Beranda",
            }}
            items={[
              { id: "menu-1", type: "destination", label: "Menu 1", href: "#/components" },
              { id: "menu-2", type: "destination", label: "Menu 2", href: "#/example" },
            ]}
            guestActions={{
              signIn: { label: "Masuk", href: "#/example/app" },
              signUp: { label: "Daftar", href: "#/components/navbar" },
            }}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/hero"
        name="Hero"
        desc="Pembuka halaman: judul, sub heading, deskripsi, satu tombol, dan gambar di kiri atau kanan."
        wide
      >
        <div className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
          <Hero
            darkMode={docsDark}
            heading="Judul Halaman"
            subHeading="Sub heading"
            description="Paragraf pembuka yang menjelaskan isi halaman secara singkat."
            buttonLabel="Selengkapnya"
            image={asset("/images/hero-sample.svg")}
            imageAlt=""
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/footer"
        name="Footer"
        desc="Penutup halaman responsif dengan logo, menu, hak cipta, dan tautan media sosial."
        wide
      >
        {/* Footer sudah gelap dari desainnya; di kartu gelap docs bingkai gray-700 menjaga batasnya, sama dengan Hero. */}
        <div className="overflow-hidden rounded-xl dark:border dark:border-gray-700">
          <Footer
            logo={asset("/images/footer-logo.svg")}
            logoAlt="Ceplok Design System"
            menus={[
              { label: "Menu 1" },
              { label: "Menu 2" },
              { label: "Menu 3" },
              { label: "Menu 4" },
            ]}
            copyright={`© ${new Date().getFullYear()} CEPLOK Design System`}
            socials={[
              { label: "Facebook", icon: FacebookIcon, url: "#" },
              { label: "Twitter", icon: XIcon, url: "#" },
              { label: "Instagram", icon: InstagramIcon, url: "#" },
            ]}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/breadcrumb"
        name="Breadcrumb"
        desc="Jejak lokasi halaman dengan pemisah chevron, dua ukuran teks, dan latar opsional."
      >
        <div className="flex items-center rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Breadcrumb
            items={[{ label: "Beranda" }, { label: "Komponen" }, { label: "Breadcrumb" }]}
            darkMode={docsDark}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/pagination"
        name="Pagination"
        desc="Navigasi antar halaman daftar data, dengan tema warna mengikuti aplikasi."
      >
        <div className="flex justify-center rounded-xl bg-surface-subtle p-5 dark:bg-gray-900">
          <Pagination currentPage={2} totalPages={5} onPageChange={() => undefined} darkMode={docsDark} />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/table"
        name="Table"
        desc="Tabel data dengan pencarian, filter kolom, pengurutan, pagination, dan aksi per baris."
        wide
      >
        {/*
          Skeleton, bukan Table asli — sama seperti kartu Modal dan Drawer.

          Lima kolom (nomor, pemohon, layanan, status, aksi) hanya mulai sm;
          di bawahnya kolom layanan dan aksi disembunyikan supaya tetap muat.
        */}
        <div className="rounded-xl bg-surface-subtle p-5 dark:bg-gray-900" aria-hidden="true">
          <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Toolbar: kotak cari, tombol filter, aksi di kanan */}
            <div className="flex items-center gap-3 p-4">
              <div className="h-7 w-40 max-w-full rounded-md border border-gray-200 bg-gray-50 sm:w-56 dark:border-gray-600 dark:bg-gray-700" />
              <div className="h-7 w-20 shrink-0 rounded-md border border-gray-300 dark:border-gray-600" />
              <div className="ml-auto hidden h-7 w-24 rounded-md bg-primary-700 sm:block" />
            </div>
            {/* Header */}
            <div className="grid grid-cols-[1fr_1.4fr_1fr] items-center gap-4 border-y border-gray-200 bg-gray-50 px-4 py-3 sm:grid-cols-[1fr_1.4fr_1.4fr_1fr_0.8fr] dark:border-gray-700 dark:bg-gray-700">
              <div className="h-1.5 w-10 rounded bg-gray-300 dark:bg-gray-500" />
              <div className="h-1.5 w-14 rounded bg-gray-300 dark:bg-gray-500" />
              <div className="hidden h-1.5 w-14 rounded bg-gray-300 sm:block dark:bg-gray-500" />
              <div className="h-1.5 w-10 rounded bg-gray-300 dark:bg-gray-500" />
              <div className="hidden h-1.5 w-8 rounded bg-gray-300 sm:block dark:bg-gray-500" />
            </div>
            {/* Baris: nomor, nama tebal, layanan, pill status, tombol aksi */}
            {[
              "bg-green-100 dark:bg-green-900",
              "bg-primary-100 dark:bg-primary-900",
              "bg-yellow-100 dark:bg-yellow-900",
            ].map((pill, i) => (
              <div
                key={pill}
                className={`grid grid-cols-[1fr_1.4fr_1fr] items-center gap-4 px-4 py-3.5 sm:grid-cols-[1fr_1.4fr_1.4fr_1fr_0.8fr] ${i < 2 ? "border-b border-gray-200 dark:border-gray-700" : ""
                  }`}
              >
                <div className="h-1.5 w-12 rounded bg-gray-200 dark:bg-gray-600" />
                <div className="h-2 w-24 max-w-full rounded bg-gray-300 dark:bg-gray-500" />
                <div className="hidden h-1.5 w-28 max-w-full rounded bg-gray-200 sm:block dark:bg-gray-600" />
                <div className={`h-4 w-14 rounded-full ${pill}`} />
                <div className="hidden gap-1.5 sm:flex">
                  <div className="size-4 rounded bg-primary-700" />
                  <div className="size-4 rounded border border-gray-300 dark:border-gray-600" />
                </div>
              </div>
            ))}
            {/* Ringkasan dan pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="h-1.5 w-28 rounded bg-gray-200 dark:bg-gray-600" />
              <div className="flex gap-1">
                <div className="size-5 rounded bg-gray-200 dark:bg-gray-600" />
                <div className="size-5 rounded bg-primary-700" />
                <div className="size-5 rounded bg-gray-200 dark:bg-gray-600" />
                <div className="size-5 rounded bg-gray-200 dark:bg-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </OverviewCard>
    </OverviewPage>
  );
}
