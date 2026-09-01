import { useEffect, useState, type ReactNode } from "react";
import { Footer, type FooterMenu } from "../lib";
import { FacebookIcon, InstagramIcon, XIcon } from "./socialIcons";
import { asset } from "./asset";
import { rail, sidebars, type NavItem, type Section } from "./navigation";
import { Drawer, prefersReducedMotion, SlideIn } from "./motion";

/**
 * Menu footer sama di seluruh halaman: kelima area utama, diturunkan dari
 * `rail` yang sama dengan navigasi kiri supaya keduanya tak mungkin melenceng.
 */
const footerMenus: FooterMenu[] = rail.map((r) => ({ label: r.label, url: `#${r.route}` }));

function sectionOf(path: string): Section {
  if (path.startsWith("/foundations")) return "foundations";
  if (path.startsWith("/components")) return "components";
  if (path.startsWith("/form")) return "form";
  if (path.startsWith("/example")) return "example";
  return "home";
}

/**
 * Daftar tautan panel samping — sub-halaman ditarik masuk di bawah induknya.
 *
 * Entri bertanda `soon` (komponennya belum jadi) tidak dirender: rutenya tetap
 * hidup dan bisa dibuka lewat URL, hanya tautannya yang disembunyikan supaya
 * navigasi cuma memuat hal yang sudah siap dipakai.
 */
function NavLinks({ items, path }: { items: NavItem[]; path: string }) {
  return (
    <>
      {items
        .filter((item) => !item.soon)
        .map((item) => (
          <div key={item.route} data-slide-item className="mt-1">
            <a
              href={`#${item.route}`}
              className={`ds-nav-link w-full ${path === item.route ? "is-active" : ""}`}
              aria-current={path === item.route ? "page" : undefined}
            >
              {item.label}
            </a>
            {item.children && (
              <div className="mt-1 ml-5 border-l border-border pl-2">
                {item.children
                  .filter((child) => !child.soon)
                  .map((child) => (
                    <a
                      key={child.route}
                      href={`#${child.route}`}
                      className={`ds-nav-link w-full py-2 text-[13px] ${path === child.route ? "is-active" : ""}`}
                      aria-current={path === child.route ? "page" : undefined}
                    >
                      {child.label}
                    </a>
                  ))}
              </div>
            )}
          </div>
        ))}
    </>
  );
}

function Logo({ small }: { small?: boolean }) {
  return (
    <img
      src={asset("/stasi.svg")}
      alt=""
      aria-hidden="true"
      className={`${small ? "size-8" : "size-9"} shrink-0 object-contain`}
    />
  );
}

/**
 * Panel navigasi samping di desktop, lengkap dengan cara masuk DAN keluarnya.
 *
 * Panel ini selalu terpasang — juga di Beranda dan Example yang tidak punya
 * sub-navigasi. Itu disengaja: kalau ia dilepas begitu areanya berganti, tidak
 * ada lagi yang tersisa untuk dianimasikan dan panel sekadar hilang, sementara
 * kolom konten di sebelahnya melompat melebar dalam satu frame. Yang berubah
 * saat berpindah ke area tanpa panel hanyalah `open`, sehingga lebarnya menyusut
 * ke nol lewat transisi yang sama dengan waktu ia membuka.
 *
 * `entered` mengurus pemuatan pertama. Transisi CSS butuh nilai yang BERUBAH,
 * sedangkan pada frame pertama lebar panel langsung bernilai akhir — tanpa ini
 * halaman yang dibuka langsung di rute ber-panel tidak akan pernah beranimasi.
 * Frame pertama digambar dengan lebar nol, frame berikutnya menyalakan lebar
 * penuh, dan barulah ada perubahan untuk ditransisikan.
 *
 * `kept` mengurus isinya. Isi panel diturunkan dari area yang sedang dibuka,
 * dan di Beranda tidak ada area yang bisa diturunkan sama sekali — kalau isinya
 * ikut kosong seketika, yang menyusut cuma kotak putih. Karena itu panel
 * mengingat area terakhir yang punya sub-navigasi dan tetap menampilkannya
 * sepanjang animasi menutup. Yang diingat cukup NAMA areanya, bukan markup-nya:
 * dari nama itu isinya bisa dirakit ulang, dan nilainya tetap sama di setiap
 * render sehingga tidak memicu render berputar.
 *
 * `filled` yang melepas isi itu dari DOM, tepat setelah transisi lebarnya usai.
 *
 * Lebar memang bukan properti yang murah untuk dianimasikan, tapi di sini ia
 * tidak terhindarkan: kolom konten di sebelahnya harus ikut bergeser. Yang bisa
 * dihindari adalah menganimasikan isinya dengan cara yang sama — itu ditangani
 * `SlideIn` lewat transform.
 */
function SidebarPanel({
  section,
  path,
  expanded,
}: {
  /** Area yang sedang dibuka, atau null kalau area itu tak punya sub-navigasi. */
  section: Section | null;
  path: string;
  /** Niat pengguna lewat tombol lipat di rail. */
  expanded: boolean;
}) {
  // Tanpa animasi, panel langsung berada di lebar akhirnya sejak frame pertama.
  const [entered, setEntered] = useState(() => prefersReducedMotion());
  const open = section !== null && expanded;
  const [filled, setFilled] = useState(open);

  // Area terakhir yang sempat tampil, dipakai selama panel menutup. Ditahan pula
  // supaya `SlideIn` tidak menganggap ini area baru dan memutar ulang animasi
  // masuknya justru ketika panel sedang pergi.
  const [kept, setKept] = useState(section);
  // Perbandingan string, jadi setelah satu render ulang nilainya sudah sama dan
  // cabang ini tidak bisa berputar — pola resmi menyelaraskan state dengan prop.
  if (section !== null && section !== kept) setKept(section);

  useEffect(() => {
    if (entered) return;
    // rAF, bukan setState langsung: perubahan lebar harus jatuh di frame
    // SETELAH frame yang menggambar lebar nol, kalau tidak React menggabungkan
    // keduanya dan tidak ada nilai yang pernah berubah untuk ditransisikan.
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [entered]);

  // Isi harus sudah terpasang di frame yang sama dengan lebar yang membuka,
  // jadi ini disetel saat render — bukan lewat efek, yang selalu terlambat satu
  // frame dan menyisakan panel kosong yang melebar lebih dulu.
  if (open && !filled) setFilled(true);

  const shown = entered && open;
  const body = kept ? sidebars[kept] : null;

  return (
    <aside
      className={`sticky top-0 z-20 hidden h-screen shrink-0 overflow-hidden bg-white transition-[width] duration-300 ease-out lg:block ${
        shown ? "w-[248px] border-r border-border" : "w-0"
      }`}
      // Panel yang sedang menutup masih punya tautan yang bisa difokus dengan
      // Tab meski tak terlihat. `inert` menutup keduanya sekaligus: hilang dari
      // urutan fokus sekaligus dari pembaca layar.
      inert={!open}
      onTransitionEnd={(e) => {
        // Transisi warna dari tautan di dalamnya ikut menggelembung ke sini.
        if (e.target === e.currentTarget && e.propertyName === "width" && !open) {
          setFilled(false);
        }
      }}
    >
      {/* Lebar dikunci di dalam supaya isinya tidak ikut mengkerut saat panel menutup. */}
      {filled && body && kept && (
        <SlideIn keyed={kept} className="flex h-full w-[248px] flex-col overflow-y-auto px-5 py-7">
          <p
            data-slide-item
            className="px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase"
          >
            {body.title}
          </p>
          <nav className="mt-2" aria-label={body.title}>
            <NavLinks items={body.items} path={path} />
          </nav>
          <div data-slide-item className="mt-auto rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-bold text-gray-900">Foundation v1.0</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              React · Vite
              <br />
              Tailwind CSS v4
            </p>
          </div>
        </SlideIn>
      )}
    </aside>
  );
}

export function DocsLayout({ path, children }: { path: string; children: ReactNode }) {
  const section = sectionOf(path);
  const sidebar = sidebars[section] ?? null;
  const [drawer, setDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", drawer);
    return () => document.body.classList.remove("overflow-hidden");
  }, [drawer]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ══ Top bar — mobile ══ */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <a href="#/" className="flex items-center gap-2.5" aria-label="Beranda">
          <Logo small />
          <span className="text-sm font-black tracking-tight text-gray-900">Design System</span>
        </a>
        <button
          onClick={() => setDrawer(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Buka navigasi"
        >
          <svg
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* ══ Drawer — mobile ══ */}
      {/*
        `Drawer` menahan dirinya tetap di DOM sampai animasi keluarnya selesai,
        jadi `drawer` di sini murni niat buka/tutup — bukan penanda apakah panel
        masih terpasang.
      */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} label="Navigasi">
        <div
          data-drawer-item
          className="flex items-center justify-between border-b border-border px-5 py-4"
        >
          <span className="text-sm font-black tracking-tight text-gray-900">Navigasi</span>
          <button
            onClick={() => setDrawer(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup navigasi"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <nav
          className="px-4 py-5"
          onClick={(e) => (e.target as HTMLElement).closest("a") && setDrawer(false)}
        >
          <p
            data-drawer-item
            className="mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase"
          >
            Area
          </p>
          {rail.map((item) => (
            <a
              key={item.key}
              data-drawer-item
              href={`#${item.route}`}
              className={`ds-nav-link mt-1 w-full ${section === item.key ? "is-active" : ""}`}
            >
              <svg
                className="size-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </a>
          ))}
          {sidebar && (
            <>
              <p
                data-drawer-item
                className="mt-6 mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase"
              >
                {sidebar.title}
              </p>
              <div data-drawer-item>
                <NavLinks items={sidebar.items} path={path} />
              </div>
            </>
          )}
        </nav>
      </Drawer>

      {/*
       * Baris utama: rail + panel samping + konten. Keduanya `sticky` (bukan
       * `fixed`) supaya tingginya berhenti di ujung baris ini — footer di
       * bawahnya jadi bisa melebar penuh dari tepi kiri layar.
       */}
      <div className="flex flex-1">
        {/* ══ Icon rail — desktop ══ */}
        <aside className="sticky top-0 z-30 hidden h-screen w-[76px] shrink-0 flex-col items-center border-r border-border bg-white py-5 lg:flex">
          <a href="#/" aria-label="Beranda">
            <Logo />
          </a>
          <nav className="mt-8 flex flex-col gap-2" aria-label="Area utama">
            {rail.map((item) => (
              <a
                key={item.key}
                href={`#${item.route}`}
                className={`flex w-14 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-colors ${
                  section === item.key
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
                aria-current={section === item.key ? "page" : undefined}
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </a>
            ))}
          </nav>
          {/*
            Tombolnya tetap dirender di area tanpa panel, hanya dipudarkan.
            Melepasnya dari DOM membuat ia berkedip hilang seketika, tepat saat
            panel di sebelahnya justru sedang menutup perlahan.
          */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className={`mt-auto grid size-10 place-items-center rounded-xl text-gray-400 transition-[opacity,transform,color,background-color] duration-300 hover:bg-gray-100 hover:text-gray-700 ${
              sidebar ? "opacity-100" : "pointer-events-none scale-75 opacity-0"
            }`}
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Sembunyikan panel" : "Tampilkan panel"}
            inert={!sidebar}
          >
              <svg
                className={`size-5 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5Zm5.5 0v14" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 9.5 13.5 12l2.5 2.5" />
            </svg>
          </button>
        </aside>

        {/* ══ Sidebar drawer — desktop ══ */}
        {/*
          Selalu dirender, juga di Beranda dan Example. Di sana `sidebar` kosong,
          jadi `open` menjadi false dan panel MENUTUP dengan animasi alih-alih
          lenyap seketika — lihat catatan di SidebarPanel.
        */}
        <SidebarPanel section={sidebar ? section : null} path={path} expanded={sidebarOpen} />

        {/* ══ Konten ══ */}
        {/* min-w-0: tabel & blok kode lebar menggulung sendiri, tidak melebarkan baris. */}
        <div className="min-w-0 flex-1">
          <main>{children}</main>
        </div>
      </div>

      {/* Saudara dari baris di atas — melebar penuh selebar layar, di bawah rail. */}
      <Footer
        fluid
        logo={asset("/images/stasi-logo.svg")}
        logoAlt="STASI — Ministerium Fur Staatssicherheit"
        menus={footerMenus}
        copyright={`© ${new Date().getFullYear()} STASI - Ministerium Fur Staatssicherheit`}
        socials={[
          { label: "Instagram", url: "#", icon: InstagramIcon },
          { label: "X", url: "#", icon: XIcon },
          { label: "Facebook", url: "#", icon: FacebookIcon },
        ]}
      />
    </div>
  );
}
