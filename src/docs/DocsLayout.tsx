import { useEffect, useState, type ReactNode } from "react";
import { Footer, type FooterMenu } from "../lib";
import { FacebookIcon, InstagramIcon, XIcon } from "./socialIcons";
import { asset } from "./asset";
import { rail, sidebars, type NavItem, type Section } from "./navigation";

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
          <div key={item.route} className="mt-1">
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
      {drawer && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi"
        >
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
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
              <p className="mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">
                Area
              </p>
              {rail.map((item) => (
                <a
                  key={item.key}
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
                  <p className="mt-6 mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">
                    {sidebar.title}
                  </p>
                  <NavLinks items={sidebar.items} path={path} />
                </>
              )}
            </nav>
          </aside>
        </div>
      )}

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
          {sidebar && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="mt-auto grid size-10 place-items-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? "Sembunyikan panel" : "Tampilkan panel"}
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
          )}
        </aside>

        {/* ══ Sidebar drawer — desktop ══ */}
        {sidebar && (
          <aside
            className={`sticky top-0 z-20 hidden h-screen shrink-0 overflow-hidden bg-white transition-[width] duration-300 ease-out lg:block ${
              sidebarOpen ? "w-[248px] border-r border-border" : "w-0"
            }`}
            aria-hidden={!sidebarOpen}
          >
            {/* Lebar dikunci di dalam supaya isinya tidak ikut mengkerut saat panel menutup. */}
            <div className="flex h-full w-[248px] flex-col overflow-y-auto px-5 py-7">
              <p className="px-3 text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">
                {sidebar.title}
              </p>
              <nav className="mt-2" aria-label={sidebar.title}>
                <NavLinks items={sidebar.items} path={path} />
              </nav>
              <div className="mt-auto rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold text-gray-900">Foundation v1.0</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  React · Vite
                  <br />
                  Tailwind CSS v4
                </p>
              </div>
            </div>
          </aside>
        )}

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
