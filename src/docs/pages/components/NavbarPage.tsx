import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar, type NavbarItem } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { CodeBlock, ComponentPage, ControlLabel, Section, Segmented } from "../../pageKit";

type PlaygroundState = "guest" | "authenticated";
type MenuPosition = "left" | "right";
type PreviewDevice = "desktop" | "mobile";

function createFigmaItems(count: number): NavbarItem[] {
  return Array.from({ length: count }, (_, index) => {
    const menuNumber = index + 1;

    return {
      id: `menu-${menuNumber}`,
      label: `Menu ${menuNumber}`,
      children: [
        {
          id: `menu-${menuNumber}-overview`,
          label: `Ringkasan Menu ${menuNumber}`,
          href: `#/menu-${menuNumber}`,
        },
      ],
    };
  });
}

const figmaMenuItems = {
  1: createFigmaItems(1),
  2: [
    {
      id: "menu-1",
      label: "Menu 1",
      children: [{ id: "menu-1-child", label: "Submenu Menu 1", href: "#/menu-1" }],
    },
    {
      id: "menu-2",
      label: "Menu 2",
      children: [{ id: "menu-2-child", label: "Submenu Menu 2", href: "#/menu-2" }],
    },
  ] satisfies NavbarItem[],
  3: createFigmaItems(3),
  4: createFigmaItems(4),
  5: createFigmaItems(5),
};

const accountItems = [
  { id: "profile", label: "Profil", href: "#/profile" },
  { id: "settings", label: "Pengaturan", href: "#/settings" },
];

const navbarProps: PropRow[] = [
  ["brand", "ReactNode", "—", "Konten logo atau identitas brand."],
  ["brandLabel", "string", "—", "Nama aksesibel untuk link brand."],
  ["brandHref", "string", "'/'", "Tujuan link brand."],
  ["items", "NavbarItem[]", "[]", "Daftar menu utama yang dirender Navbar."],
  ["activeHref", "string", "undefined", "Href halaman aktif yang akan ditandai pada navigation."],
  ["search", "NavbarSearchConfig", "undefined", "Konfigurasi fitur pencarian Navbar."],
  ["guestActions", "NavbarGuestActions", "undefined", "Aksi Masuk dan Daftar untuk pengguna guest."],
  ["user", "NavbarUser", "undefined", "Jika diberikan, Navbar menggunakan tampilan authenticated."],
  ["notification", "NavbarNotification", "undefined", "Konfigurasi notification untuk pengguna authenticated."],
  ["menuPosition", "'left' | 'right'", "'right'", "Posisi grup menu pada desktop."],
  ["ariaLabel", "string", "'Navigasi utama'", "Accessible label untuk navigation landmark."],
  ["onNavigate", "function", "undefined", "Callback saat link menu dipilih; dapat digunakan oleh router consumer."],
  ["mobileOpen", "boolean", "undefined", "State controlled untuk panel mobile."],
  ["defaultMobileOpen", "boolean", "false", "State awal panel mobile ketika uncontrolled."],
  ["onMobileOpenChange", "function", "undefined", "Callback ketika panel mobile dibuka atau ditutup."],
];

function DemoBrand() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-8 grid-cols-2 gap-0.5 rounded-md bg-primary-700 p-1.5">
        <span className="rounded-sm bg-white" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-white" />
      </span>
      <span className="text-sm font-black tracking-tight text-content">KOMDIGI</span>
    </span>
  );
}

function ScaledDesktopFrame({ title, src }: { title: string; src: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const previewWidth = 1440;
  const previewHeight = 220;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => setScale(Math.min(1, wrapper.clientWidth / previewWidth));
    const observer = new ResizeObserver(updateScale);

    updateScale();
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
      style={{ height: previewHeight * scale }}
    >
      <iframe
        title={title}
        src={src}
        className="absolute top-0 left-0 block border-0 bg-surface"
        style={{
          width: previewWidth,
          height: previewHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}

const demoGuestActions = {
  login: { label: "Masuk", onClick: () => undefined },
  register: { label: "Daftar", onClick: () => undefined },
};

function NavbarPreviewSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-surface"
      onClickCapture={(event) => {
        const target = event.target;

        if (target instanceof Element && target.closest("a")) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
}

function PlaygroundMobileFrame({ src }: { src: string }) {
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(122);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return (
    <div className="mx-auto w-full max-w-[412px] overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <iframe
        key={src}
        title="Preview interaktif Navbar mobile"
        src={src}
        className="block w-full border-0 bg-surface"
        style={{ height }}
        onLoad={(event) => {
          observerRef.current?.disconnect();

          const navbar = event.currentTarget.contentDocument?.querySelector("header");
          if (!navbar) return;

          const updateHeight = () => setHeight(Math.ceil(navbar.getBoundingClientRect().height));
          observerRef.current = new ResizeObserver(updateHeight);
          observerRef.current.observe(navbar);
          updateHeight();
        }}
      />
    </div>
  );
}

function createPlaygroundCode({
  state,
  menuCount,
  searchEnabled,
  guestActionsEnabled,
  menuPosition,
}: {
  state: PlaygroundState;
  menuCount: number;
  searchEnabled: boolean;
  guestActionsEnabled: boolean;
  menuPosition: MenuPosition;
}) {
  const items = Array.from({ length: menuCount }, (_, index) => {
    const number = index + 1;
    return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      children: [{ id: 'menu-${number}-overview', label: 'Ringkasan', href: '/menu-${number}' }],
    }`;
  }).join(",\n");

  const lines = [
    "<Navbar",
    "  brand={<Logo />}",
    '  brandLabel="KOMDIGI — Beranda"',
    "  items={[",
    items,
    "  ]}",
  ];

  if (searchEnabled) {
    lines.push(
      "  search={{",
      "    label: 'Cari layanan',",
      "    placeholder: 'Search Civitas, Organisasi ...',",
      "    onSubmit: (query) => console.log(query),",
      "  }}",
    );
  }

  lines.push(`  menuPosition="${menuPosition}"`);

  if (state === "guest" && guestActionsEnabled) {
    lines.push(
      "  guestActions={{",
      "    login: { label: 'Masuk', href: '/login' },",
      "    register: { label: 'Daftar', href: '/register' },",
      "  }}",
    );
  }

  if (state === "authenticated") {
    lines.push(
      "  user={{",
      "    name: 'User Komdigi',",
      "    avatarSrc: '/avatar.jpg',",
      "    items: [{ id: 'profile', label: 'Profil', href: '/profile' }],",
      "  }}",
      "  notification={{ unread: true, href: '/notifications' }}",
    );
  }

  lines.push("/>");
  return lines.join("\n");
}

function NavbarPlayground() {
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [state, setState] = useState<PlaygroundState>("guest");
  const [menuCount, setMenuCount] = useState(1);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [guestActionsEnabled, setGuestActionsEnabled] = useState(true);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>("right");

  const params = new URLSearchParams({
    navbarPlayground: "true",
    navbarState: state,
    navbarMenuCount: String(menuCount),
    navbarSearch: searchEnabled ? "on" : "off",
    navbarGuestActions: guestActionsEnabled ? "on" : "off",
    navbarMenuPosition: menuPosition,
  });
  const previewRoute =
    previewDevice === "desktop"
      ? "/preview/navbar/desktop-guest-2"
      : "/preview/navbar/mobile-guest";
  const previewSrc = `?${params.toString()}#${previewRoute}`;
  const code = createPlaygroundCode({
    state,
    menuCount,
    searchEnabled,
    guestActionsEnabled,
    menuPosition,
  });
  const menuPositionDisabled = previewDevice === "mobile" || state === "authenticated";
  const menuPositionHelp =
    previewDevice === "mobile"
      ? "Hanya berlaku pada tampilan desktop."
      : state === "authenticated"
        ? "Menu Position hanya digunakan pada Navbar guest desktop."
        : "Mengatur posisi grup menu pada tampilan desktop.";

  return (
    <div className="space-y-5">
      {previewDevice === "desktop" ? (
        <ScaledDesktopFrame title="Preview interaktif Navbar desktop" src={previewSrc} />
      ) : (
        <PlaygroundMobileFrame src={previewSrc} />
      )}

      <div className="ds-card w-full p-6">
        <h3 className="text-sm font-black text-content">Konfigurasi</h3>
        <div data-navbar-config-grid className="mt-6 grid w-full gap-x-10 gap-y-7 md:grid-cols-2">
          <div className="space-y-2">
            <div className="block">
              <ControlLabel>Preview</ControlLabel>
            </div>
            <Segmented
              label="Pilih viewport preview"
              value={previewDevice}
              onChange={setPreviewDevice}
              options={[
                { value: "desktop", label: "Desktop" },
                { value: "mobile", label: "Mobile" },
              ]}
            />
            <p className="max-w-xs text-xs leading-5 text-content-subtle">
              Preview hanya mengubah viewport dokumentasi. Navbar menangani responsive behavior
              secara otomatis.
            </p>
          </div>

          <div className="space-y-2">
            <div className="block">
              <ControlLabel>State</ControlLabel>
            </div>
            <Segmented
              label="Pilih state Navbar"
              value={state}
              onChange={setState}
              options={[
                { value: "guest", label: "Guest" },
                { value: "authenticated", label: "Authenticated" },
              ]}
            />
            <p className="max-w-xs text-xs leading-5 text-content-subtle">
              Gunakan Guest untuk pengguna yang belum masuk dan Authenticated jika data user
              tersedia.
            </p>
          </div>

          <div className="space-y-2">
            <div className="block">
              <ControlLabel>Jumlah menu</ControlLabel>
            </div>
            <Segmented
              label="Pilih jumlah menu"
              value={menuCount}
              onChange={setMenuCount}
              itemClassName="w-9 justify-center"
              wrap
              options={[1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }))}
            />
            <p className="max-w-xs text-xs leading-5 text-content-subtle">
              Jumlah menu mengikuti jumlah item pada prop <code>items</code>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="block">
              <ControlLabel>Search</ControlLabel>
            </div>
            <Segmented
              label="Tampilkan search"
              value={searchEnabled}
              onChange={setSearchEnabled}
              options={[
                { value: true, label: "On" },
                { value: false, label: "Off" },
              ]}
            />
            <p className="max-w-xs text-xs leading-5 text-content-subtle">
              Matikan jika Navbar tidak membutuhkan fitur pencarian.
            </p>
          </div>

          {state === "guest" && (
            <div className="space-y-2">
              <div className="block">
                <ControlLabel>Guest actions</ControlLabel>
              </div>
              <Segmented
                label="Tampilkan guest actions"
                value={guestActionsEnabled}
                onChange={setGuestActionsEnabled}
                options={[
                  { value: true, label: "On" },
                  { value: false, label: "Off" },
                ]}
              />
              <p className="max-w-xs text-xs leading-5 text-content-subtle">
                Menampilkan aksi Masuk dan Daftar untuk pengguna yang belum terautentikasi.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="block">
              <ControlLabel>Menu position</ControlLabel>
            </div>
            <fieldset
              disabled={menuPositionDisabled}
              className={
                menuPositionDisabled
                  ? "w-fit cursor-not-allowed opacity-50 [&_button]:cursor-not-allowed"
                  : "w-fit"
              }
            >
              <Segmented
                label="Pilih posisi grup menu desktop"
                value={menuPosition}
                onChange={setMenuPosition}
                options={[
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
              />
            </fieldset>
            <p className="max-w-xs text-xs leading-5 text-content-subtle">{menuPositionHelp}</p>
          </div>
        </div>
      </div>

      <CodeBlock>{code}</CodeBlock>
    </div>
  );
}

export function NavbarDesktopPreview({
  variant,
  menuCount,
}: {
  variant: "guest" | "no-button" | "authenticated";
  menuCount: 2 | 3 | 4 | 5;
}) {
  const [query, setQuery] = useState("");
  const params = new URLSearchParams(window.location.search);
  const playground = params.get("navbarPlayground") === "true";
  const requestedMenuCount = Number(params.get("navbarMenuCount"));
  const effectiveMenuCount =
    playground && [1, 2, 3, 4, 5].includes(requestedMenuCount)
      ? (requestedMenuCount as 1 | 2 | 3 | 4 | 5)
      : menuCount;
  const authenticated = playground
    ? params.get("navbarState") === "authenticated"
    : variant === "authenticated";
  const searchEnabled = !playground || params.get("navbarSearch") !== "off";
  const guestActionsEnabled =
    playground ? params.get("navbarGuestActions") !== "off" : variant === "guest";
  const menuPosition = params.get("navbarMenuPosition") === "left" ? "left" : "right";

  return (
    <NavbarPreviewSurface>
      <Navbar
        brand={<DemoBrand />}
        brandLabel="KOMDIGI — Beranda"
        items={figmaMenuItems[effectiveMenuCount]}
        search={
          searchEnabled
            ? {
                value: query,
                onValueChange: setQuery,
                onSubmit: () => undefined,
                placeholder: "Search Civitas, Organisasi ...",
              }
            : undefined
        }
        guestActions={!authenticated && guestActionsEnabled ? demoGuestActions : undefined}
        user={
          authenticated ? { name: "User Komdigi", initials: "UK", items: accountItems } : undefined
        }
        notification={authenticated ? { unread: true, onClick: () => undefined } : undefined}
        menuPosition={menuPosition}
      />
    </NavbarPreviewSurface>
  );
}

export function NavbarMobilePreview({ variant }: { variant: "guest" | "authenticated" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const params = new URLSearchParams(window.location.search);
  const playground = params.get("navbarPlayground") === "true";
  const requestedMenuCount = Number(params.get("navbarMenuCount"));
  const effectiveMenuCount =
    playground && [1, 2, 3, 4, 5].includes(requestedMenuCount)
      ? (requestedMenuCount as 1 | 2 | 3 | 4 | 5)
      : 3;
  const authenticated = playground
    ? params.get("navbarState") === "authenticated"
    : variant === "authenticated";
  const searchEnabled = !playground || params.get("navbarSearch") !== "off";
  const guestActionsEnabled = !playground || params.get("navbarGuestActions") !== "off";
  const menuPosition = params.get("navbarMenuPosition") === "left" ? "left" : "right";

  return (
    <NavbarPreviewSurface>
      <Navbar
        brand={<DemoBrand />}
        brandLabel="KOMDIGI — Beranda"
        items={figmaMenuItems[effectiveMenuCount]}
        search={
          searchEnabled
            ? {
                value: query,
                onValueChange: setQuery,
                onSubmit: () => undefined,
                placeholder: "Search Civitas, Organisasi ...",
              }
            : undefined
        }
        guestActions={!authenticated && guestActionsEnabled ? demoGuestActions : undefined}
        user={
          authenticated ? { name: "User Komdigi", initials: "UK", items: accountItems } : undefined
        }
        notification={authenticated ? { unread: true, onClick: () => undefined } : undefined}
        menuPosition={menuPosition}
        onNavigate={(_, event) => event.preventDefault()}
        mobileOpen={open}
        onMobileOpenChange={setOpen}
      />
    </NavbarPreviewSurface>
  );
}

const automaticAccessibility = [
  "Menyediakan elemen semantic header, nav, dan search.",
  "Menandai halaman aktif dengan aria-current.",
  "Menyampaikan status menu melalui aria-expanded dan aria-controls.",
  "Menutup menu dengan Escape dan mengembalikan focus ke trigger.",
  "Mencegah navigation item disabled diaktifkan.",
  "Menyembunyikan icon dekoratif dari assistive technology.",
  "Menyampaikan status hamburger dan label notification secara aksesibel.",
];

const consumerAccessibility = [
  "Berikan brandLabel yang jelas dan bermakna.",
  "Gunakan label menu yang deskriptif dan href yang valid.",
  "Isi search.label jika konteks pencarian berbeda dari default.",
  "Isi notification.label jika label default kurang spesifik.",
  "Sediakan avatarAlt atau initials yang sesuai bila avatar digunakan.",
];

export function NavbarPage() {
  return (
    <ComponentPage
      eyebrow="Components · Navbar"
      title="Navbar"
      description="Navbar digunakan sebagai navigasi utama di bagian atas aplikasi. Komponen ini mendukung menu, pencarian, aksi untuk guest, dan akun pengguna pada kondisi authenticated. Gunakan Playground untuk menyesuaikan konfigurasi dan melihat kode implementasinya."
    >
      <Section title="Playground">
        <div className="space-y-4">
          <p className="text-body-sm leading-6 text-content-subtle">
            Gunakan controls untuk melihat bagaimana public props mengubah komposisi Navbar dan kode
            implementasinya.
          </p>
          <NavbarPlayground />
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="ds-card p-5">
            <h3 className="font-black text-content">Ditangani otomatis oleh Navbar</h3>
            <ul className="mt-3 space-y-2 text-body-sm leading-6 text-content-subtle">
              {automaticAccessibility.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="ds-card p-5">
            <h3 className="font-black text-content">Perlu diperhatikan consumer</h3>
            <ul className="mt-3 space-y-2 text-body-sm leading-6 text-content-subtle">
              {consumerAccessibility.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section title="Responsive behavior">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="ds-card p-5">
            <h3 className="font-black text-content">Desktop</h3>
            <p className="mt-2 text-body-sm leading-6 text-content-subtle">
              Navigation ditampilkan horizontal bersama guest actions atau user controls. Prop
              menuPosition mengatur posisi grup menu pada tampilan desktop.
            </p>
          </article>
          <article className="ds-card p-5">
            <h3 className="font-black text-content">Mobile</h3>
            <p className="mt-2 text-body-sm leading-6 text-content-subtle">
              Navigation dibuka melalui hamburger, sementara search tetap terlihat di luar panel.
              Panel tampil inline dan notification Bell tidak ditampilkan pada authenticated mobile.
            </p>
          </article>
        </div>
      </Section>

      <Section title="Properties">
        <PropsTable rows={navbarProps} />
      </Section>
    </ComponentPage>
  );
}
