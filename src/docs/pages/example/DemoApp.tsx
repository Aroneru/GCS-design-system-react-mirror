import { useState, type CSSProperties } from "react";
import {
  Breadcrumb,
  Button,
  Container,
  Hero,
  Navbar,
  Sidebar,
  cn,
  type SidebarItem,
} from "../../../lib";
import {
  ChartMixed,
  Cog,
  Envelope,
  FileLines,
  GridPlus,
  Home,
  Moon,
  Newspaper,
  Palette,
  Sun,
  UsersGroup,
} from "../../../lib/icons/outline";
import { asset } from "../../asset";
import { DemoFooter } from "./DemoFooter";
import { JUDUL_HALAMAN, type HalamanDemo } from "./data";
import { Dasbor } from "./pages/Dasbor";
import { Layanan } from "./pages/Layanan";
import { Modifikasi } from "./pages/Modifikasi";
import { Pemohon } from "./pages/Pemohon";
import { Pengajuan } from "./pages/Pengajuan";
import { Pengaturan } from "./pages/Pengaturan";
import { Simaya } from "./pages/Simaya";
import { BeritaLayananDigital } from "./pages/BeritaLayananDigital";
import { BERITA_LAYANAN_DIGITAL_TOC } from "./pages/BeritaLayananDigitalToc";

/**
 * Kerangka aplikasi demo.
 *
 * PENTING — berkas ini dan seluruh isi `example/pages/` sengaja hanya mengimpor
 * dari `../../../lib`. Tidak ada GSAP, tidak ada primitif gerak dari
 * `docs/motion`, tidak ada pustaka pihak ketiga apa pun. Contoh ini gunanya
 * menunjukkan apa yang benar-benar didapat konsumen dari
 * `@ceplok-ui/design-kit-react`; begitu ia dibumbui pustaka lain, ia berhenti
 * menjadi bukti dan berubah jadi iklan. Transisi masuk/keluar yang memakai GSAP
 * hidup di `ExampleAppFrame.tsx`, di luar batas ini.
 *
 * Satu-satunya impor non-lib adalah `asset()`, yaitu helper path berkas milik
 * situs dokumentasi — bukan pustaka, dan tidak memengaruhi tampilan.
 */

const RUTE: { halaman: HalamanDemo; ikon: React.ReactNode; badge?: string }[] = [
  { halaman: "dasbor", ikon: <ChartMixed className="size-5" /> },
  { halaman: "pengajuan", ikon: <FileLines className="size-5" />, badge: "10" },
  { halaman: "pemohon", ikon: <UsersGroup className="size-5" /> },
  { halaman: "layanan", ikon: <GridPlus className="size-5" /> },
  { halaman: "simaya", ikon: <Envelope className="size-5" /> },
  { halaman: "modifikasi", ikon: <Palette className="size-5" /> },
  { halaman: "pengaturan", ikon: <Cog className="size-5" /> },
  { halaman: "simaya2", ikon: <Newspaper className="size-5" /> },
];

/** Sub-rute nyata, bukan state palsu — jadi Sidebar dan Navbar bekerja sebagai tautan. */
const href = (h: HalamanDemo) => (h === "dasbor" ? "#/example/app" : `#/example/app/${h}`);

const DESKRIPSI: Record<HalamanDemo, string> = {
  dasbor: "Ringkasan pengajuan, capaian bulan ini, dan aktivitas terbaru.",
  pengajuan: "Seluruh pengajuan yang masuk, lengkap dengan saringan dan pencarian.",
  pemohon: "Daftar akun pemohon terdaftar beserta status keaktifannya.",
  layanan: "Layanan yang dibuka untuk umum, beserta estimasi dan biayanya.",
  simaya: "Persuratan internal dengan aksen Simaya — prop application pada tujuh komponen form.",
  modifikasi: "Tiga tingkat penyesuaian komponen: varian bawaan, slot, lalu className.",
  pengaturan: "Data profil dan preferensi pemberitahuan akun Anda.",
  simaya2: "Berita dan pembaruan terbaru seputar Portal Layanan Terpadu.",
};

const RUTE_SIDEBAR = ["dasbor", "pengajuan", "pemohon", "modifikasi", "pengaturan"] as const;
const RUTE_LAYANAN = ["layanan", "simaya"] as const;

const TEMA = [
  { gelap: false, label: "Terang", Ikon: Sun },
  { gelap: true, label: "Gelap", Ikon: Moon },
];

function ThemeIconToggle({
  darkMode,
  onChange,
  className,
}: {
  darkMode: boolean;
  onChange: (darkMode: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label="Mode gelap"
      aria-pressed={darkMode}
      title={darkMode ? "Matikan mode gelap" : "Nyalakan mode gelap"}
      onClick={() => onChange(!darkMode)}
      className={cn(
        "grid size-9 place-items-center rounded-lg text-content-subtle transition-colors hover:bg-surface-subtle hover:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand in-data-[theme=dark]:text-gray-400",
        className,
      )}
    >
      <Sun
        strokeWidth={1.8}
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 size-5 transition-[opacity,rotate,scale] duration-300 ease-out motion-reduce:transition-none",
          darkMode ? "opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
      />
      <Moon
        strokeWidth={1.8}
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 size-5 transition-[opacity,rotate,scale] duration-300 ease-out motion-reduce:transition-none",
          darkMode ? "rotate-90 scale-50 opacity-0" : "opacity-100",
        )}
      />
    </button>
  );
}

function Isi({ halaman, darkMode }: { halaman: HalamanDemo; darkMode: boolean }) {
  switch (halaman) {
    case "pengajuan":
      return <Pengajuan darkMode={darkMode} />;
    case "pemohon":
      return <Pemohon darkMode={darkMode} />;
    case "layanan":
      return <Layanan darkMode={darkMode} />;
    case "simaya":
      return <Simaya darkMode={darkMode} />;
    case "simaya2":
      return <BeritaLayananDigital darkMode={darkMode} />;
    case "modifikasi":
      return <Modifikasi darkMode={darkMode} />;
    case "pengaturan":
      return <Pengaturan darkMode={darkMode} />;
    default:
      return <Dasbor darkMode={darkMode} />;
  }
}

export function DemoApp({
  halaman,
  darkMode = false,
  onDarkModeChange,
}: {
  halaman: HalamanDemo;
  darkMode?: boolean;
  onDarkModeChange?: (darkMode: boolean) => void;
}) {
  const [ringkas, setRingkas] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState("");
  // Separator struktural aplikasi portal perlu tetap terbaca di atas surface
  // gray-700. Cukup satu tingkat lebih terang (gray-600): gray-400 terlalu
  // tegas dibanding gray-200 di mode terang. Dibuat lokal agar token border
  // seluruh design system tidak ikut berubah pada mode gelap.
  const separatorStyle = darkMode
    ? { borderColor: "var(--color-gray-600)" }
    : undefined;

  const menu: SidebarItem[] = RUTE_SIDEBAR.map((h) => {
    const route = RUTE.find(({ halaman: routePage }) => routePage === h);
    return {
      id: h,
      label: JUDUL_HALAMAN[h],
      href: href(h),
      icon: route?.ikon,
      badge: route?.badge,
      active: h === halaman,
    };
  });
  const navbarDestination = (h: HalamanDemo) => {
    const route = RUTE.find(({ halaman: routePage }) => routePage === h);

    return {
      id: h,
      type: "destination" as const,
      label: JUDUL_HALAMAN[h],
      href: href(h),
      icon: route?.ikon,
      current: h === halaman,
    };
  };
  const navbarItems = [
    {
      id: "layanan-digital",
      type: "disclosure" as const,
      label: "Layanan Digital",
      icon: <GridPlus className="size-5" />,
      children: RUTE_LAYANAN.map(navbarDestination),
    },
    {
      ...navbarDestination("simaya2"),
      label: "Berita & Pembaruan",
    },
  ];
  const searchCategories = menu.map(({ id, label }) => ({ value: id ?? label, label }));
  const sidebarUser = {
    name: "Rafli Arandhana",
    profileLabel: "Administrator",
    items: [
      {
        id: "account-settings",
        label: "Pengaturan akun",
        href: href("pengaturan"),
      },
      {
        id: "logout",
        label: "Keluar",
        tone: "danger" as const,
        onClick: () => setSearchFeedback("Aksi demo: Keluar"),
      },
    ],
  };

  return (
    // Kolom, bukan baris: Sidebar dan konten berdampingan di dalam satu baris,
    // lalu footer jadi saudara baris itu — supaya latarnya melebar penuh
    // selebar layar, ikut menutupi kolom di bawah Sidebar.
    <div
      data-theme={darkMode ? "dark" : "light"}
      className={cn(
        "flex min-h-screen flex-col text-content",
        // Latar halaman satu tingkat di bawah surface-subtle saat gelap, supaya
        // kartu dan tabel (gray-800/700, warna asli komponennya) tampak naik
        // dari alasnya, sama seperti kartu putih di atas gray-50 di mode terang.
        darkMode ? "bg-gray-900" : "bg-surface-subtle",
        darkMode &&
          "[&_.bg-white]:bg-surface [&_.border-gray-200]:border-border [&_.border-gray-300]:border-border-strong [&_.text-gray-900]:text-content [&_.text-gray-800]:text-content [&_.text-gray-700]:text-content-subtle [&_.text-gray-600]:text-content-subtle [&_.text-gray-500]:text-content-muted [&_.bg-primary-50]:bg-primary-900 [&_.border-primary-100]:border-primary-800 [&_.text-primary-900]:text-primary-100 [&_.text-primary-800]:text-primary-100 [&_.text-primary-700]:text-primary-400 [&_.bg-yellow-50]:bg-yellow-900 [&_.text-yellow-800]:text-yellow-100 [&_.bg-purple-100]:bg-purple-900 [&_.text-purple-700]:text-purple-300 [&_.text-green-700]:text-green-400 [&_.text-red-700]:text-red-400",
      )}
    >
      <div className="flex flex-1">
        {/* Pada mobile, menu Sidebar ini dipindahkan ke hamburger kiri Navbar. */}
        <div className="hidden lg:block">
          <Sidebar
            logo={
              <img
                src={asset("/images/ceplok.svg")}
                alt="CEPLOK"
                className="mx-auto h-8 max-w-full w-auto"
              />
            }
            /*
             * Logo ringkas memakai `images/ceplok.svg` — mark 1057×1080 yang sama
             * dengan rail situs dokumentasi. Sebelumnya `images/s.svg`, dan itu
             * gambar 1440×810: dipaksa masuk kotak 32×32 ia gepeng, bukan mengecil.
             */
            collapsedLogo={<img src={asset("/images/ceplok.svg")} alt="CEPLOK" className="size-8" />}
            items={menu}
            user={sidebarUser}
            sticky
            collapsed={ringkas}
            onCollapse={() => setRingkas((v) => !v)}
            darkMode={darkMode}
            style={separatorStyle}
            footer={
              onDarkModeChange ? (
                ringkas ? (
                  <div className="flex justify-center p-3">
                    <Button
                      iconOnly
                      variant="outline"
                      size="s"
                      aria-label={darkMode ? "Matikan mode gelap" : "Nyalakan mode gelap"}
                      aria-pressed={darkMode}
                      title={darkMode ? "Matikan mode gelap" : "Nyalakan mode gelap"}
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
                      className="relative grid grid-cols-2 rounded-full border border-border bg-surface-subtle p-1 transition-colors duration-200"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm ring-1 ring-border",
                          "transition-[translate,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
                          "in-data-[theme=dark]:bg-gray-600",
                          darkMode && "translate-x-full",
                        )}
                      />
                      {TEMA.map(({ gelap, label, Ikon }) => {
                        const aktif = darkMode === gelap;
                        return (
                          <button
                            key={label}
                            type="button"
                            aria-pressed={aktif}
                            onClick={() => onDarkModeChange(gelap)}
                            className={cn(
                              "relative flex h-9 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors duration-300",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                              aktif ? "text-content" : "text-content-muted hover:text-content",
                            )}
                          >
                            <Ikon
                              aria-hidden="true"
                              className={cn(
                                "size-5 transition-[color,rotate,scale] duration-300 ease-out motion-reduce:transition-none",
                                aktif ? "text-brand" : gelap ? "-rotate-12 scale-90" : "rotate-90 scale-90",
                              )}
                            />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              ) : undefined
            }
            /*
             * Catatan status di kaki Sidebar. Ditaruh di dalam navigasinya, bukan
             * di halaman pintu masuk, supaya ia terbaca justru saat orang sedang
             * menatap menu yang dimaksud — termasuk yang membuka rute ini langsung
             * lewat URL tanpa lewat halaman Example.
             *
             * Saat ringkas, kalimatnya diganti satu kata: 72px tidak cukup untuk
             * teks sepanjang itu, dan memaksanya masuk cuma menghasilkan tumpukan
             * baris satu-dua huruf. Keterangan penuhnya tetap ada di `title`.
             */
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative">
            <Navbar
            platform="back-office"
            darkMode={darkMode}
            style={separatorStyle}
            brand={{
              content: (
                <img
                  src={asset("/images/ceplok.svg")}
                  alt=""
                  className="size-8 object-contain"
                />
              ),
              href: href("dasbor"),
              ariaLabel: "CEPLOK — Dasbor",
            }}
            items={navbarItems}
            sidebarItems={menu}
            sidebarUser={sidebarUser}
            tableOfContents={halaman === "simaya2" ? {
              label: "On this page",
              items: BERITA_LAYANAN_DIGITAL_TOC,
            } : undefined}
            search={{
              "aria-label": "Cari pengajuan atau pemohon",
              placeholder: "Cari pengajuan, pemohon ...",
              categories: searchCategories,
              categoryPlaceholder: "Kategori",
              onSearch: (value, category) => setSearchFeedback(`Pencarian demo: ${value}${category ? ` (${category})` : ""}`),
            }}
            notificationTrigger={{
              ariaLabel: "Buka notifikasi",
              onClick: () => setSearchFeedback("Aksi demo: Buka notifikasi"),
            }}
            mobileNavigationOpen={mobileSidebarOpen}
            onMobileNavigationOpenChange={setMobileSidebarOpen}
            />
            {onDarkModeChange && (
              <ThemeIconToggle
                darkMode={darkMode}
                onChange={onDarkModeChange}
                className="absolute top-4.5 right-29 min-[576px]:hidden"
              />
            )}
          </div>

          {onDarkModeChange && (
            <ThemeIconToggle
              darkMode={darkMode}
              onChange={onDarkModeChange}
              className="fixed right-4 bottom-20 z-40 hidden shadow-lg min-[576px]:grid lg:hidden"
            />
          )}

          {searchFeedback && (
            <div className="border-b border-border bg-surface" style={separatorStyle}>
              <Container>
                <p role="status" aria-live="polite" className="py-2 text-body-sm text-content-subtle">
                  {searchFeedback}
                </p>
              </Container>
            </div>
          )}

          <main className="flex-1">
            <div className="border-b border-border bg-surface" style={separatorStyle}>
              <Container>
                <div className="flex items-center gap-4 py-6">
                  <Breadcrumb
                    darkMode={darkMode}
                    items={[
                      { label: "Beranda", href: href("dasbor"), icon: <Home className="size-4" /> },
                      { label: JUDUL_HALAMAN[halaman] },
                    ]}
                  />
                </div>
              </Container>

              {/* Hero hanya di Dasbor: di halaman kerja ia hanya akan mendorong
                  isi yang penting ke bawah lipatan. */}
              {halaman === "dasbor" ? (
                <Hero
                  darkMode={darkMode}
                  heading="Portal Layanan Terpadu"
                  subHeading="Satu pintu untuk seluruh layanan"
                  description="Ajukan, pantau, dan selesaikan permohonan tanpa perlu datang ke kantor. Seluruh antarmuka di halaman ini dirakit dari komponen @ceplok-ui/design-kit-react."
                  buttonLabel="Lihat pengajuan"
                  buttonHref={href("pengajuan")}
                  image={asset("/images/hero-sample.svg")}
                  imageAlt=""
                />
              ) : (
                <Container>
                  <div className="pb-8">
                    <h1 className="text-heading-2 font-black text-content">
                      {JUDUL_HALAMAN[halaman]}
                    </h1>
                    <p className="mt-2 max-w-2xl text-body-sm text-content-muted">
                      {DESKRIPSI[halaman]}
                    </p>
                  </div>
                </Container>
              )}
            </div>

            {/* Container di tema gelap melukis latar gray-700. Di sini ia hanya
                pembatas lebar, jadi latarnya dimatikan lokal; tanpa ini muncul
                pita gray-700 di tengah halaman yang tidak ada di mode terang. */}
            <Container
              style={darkMode ? ({ "--color-container": "transparent" } as CSSProperties) : undefined}
            >
              <div className="py-10">
                <Isi halaman={halaman} darkMode={darkMode} />
              </div>
            </Container>
          </main>

        </div>
      </div>

      <DemoFooter />
    </div>
  );
}
