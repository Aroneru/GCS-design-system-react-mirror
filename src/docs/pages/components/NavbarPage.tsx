import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar, type NavbarItem } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import {
  CodeBlock,
  ComponentPage,
  ControlLabel,
  Demo,
  Section,
  Segmented,
} from "../../pageKit";

type PlaygroundState = "guest" | "authenticated";
type MenuPosition = "left" | "right";
type PreviewDevice = "desktop" | "mobile";
type PlaygroundVariant = "front-office" | "back-office";

function createFigmaItems(count: number): NavbarItem[] {
  return Array.from({ length: count }, (_, index) => {
    const menuNumber = index + 1;
    const isTrueSubmenu = count >= 2 && index === count - 1;

    if (isTrueSubmenu) {
      return {
        id: `menu-${menuNumber}`,
        label: `Menu ${menuNumber}`,
        children: [
          {
            id: `menu-${menuNumber}-submenu-1`,
            label: "Submenu 1",
            href: `#/menu-${menuNumber}/submenu-1`,
          },
          {
            id: `menu-${menuNumber}-submenu-2`,
            label: "Submenu 2",
            href: `#/menu-${menuNumber}/submenu-2`,
          },
        ],
      };
    }

    return {
      id: `menu-${menuNumber}`,
      label: `Menu ${menuNumber}`,
      href: `#/menu-${menuNumber}`,
      children: [
        {
          id: `menu-${menuNumber}-overview`,
          label: `Ringkasan Menu ${menuNumber}`,
          href: `#/menu-${menuNumber}/ringkasan`,
        },
        {
          id: `menu-${menuNumber}-settings`,
          label: `Pengaturan Menu ${menuNumber}`,
          href: `#/menu-${menuNumber}/pengaturan`,
        },
        {
          id: `menu-${menuNumber}-history`,
          label: `Riwayat Menu ${menuNumber}`,
          href: `#/menu-${menuNumber}/riwayat`,
        },
      ],
    };
  });
}

const figmaMenuItems = {
  1: createFigmaItems(1),
  2: createFigmaItems(2),
  3: createFigmaItems(3),
  4: createFigmaItems(4),
  5: createFigmaItems(5),
};

function getMobilePreviewPage(items: NavbarItem[], activeHref?: string) {
  if (!activeHref) {
    return {
      title: "Beranda",
      description: "Pilih menu dari navigasi utama untuk melihat contoh halaman.",
    };
  }

  for (const item of items) {
    if ("href" in item && item.href === activeHref) {
      return {
        title: item.label,
        description: `Anda sedang berada di halaman utama ${item.label}.`,
      };
    }

    if (!Array.isArray(item.children)) continue;

    const activeChild = item.children.find((child) => child.href === activeHref);
    if (!activeChild) continue;

    const suffix = ` ${item.label}`;
    const childContext = activeChild.label.endsWith(suffix)
      ? activeChild.label.slice(0, -suffix.length)
      : activeChild.label;

    return {
      title: activeChild.label,
      description: `Anda sedang melihat ${childContext} dari ${item.label}.`,
    };
  }

  return {
    title: "Beranda",
    description: "Pilih menu dari navigasi utama untuk melihat contoh halaman.",
  };
}

const accountItems = [
  { id: "profile", label: "Profil", href: "#/profile" },
  { id: "settings", label: "Pengaturan", href: "#/settings" },
];

const navbarProps: PropRow[] = [
  ["brand", "ReactNode", "—", "Konten logo atau identitas brand."],
  ["brandLabel", "string", "—", "Nama aksesibel untuk link brand."],
  ["brandHref", "string", "'/'", "Tujuan link brand."],
  [
    "items",
    "NavbarItem[]",
    "[]",
    "Daftar menu utama berupa link, page dengan navigasi sekunder, atau true submenu.",
  ],
  ["activeHref", "string", "undefined", "Href halaman aktif yang akan ditandai pada navigation."],
  ["search", "NavbarSearchConfig", "undefined", "Konfigurasi fitur pencarian Navbar."],
  ["guestActions", "NavbarGuestActions", "undefined", "Aksi Masuk dan Daftar untuk pengguna guest."],
  ["user", "NavbarUser", "undefined", "Jika diberikan, Navbar menggunakan tampilan authenticated."],
  ["notification", "NavbarNotification", "undefined", "Konfigurasi notification untuk pengguna authenticated."],
  [
    "variant",
    "'front-office' | 'back-office'",
    "'front-office'",
    "Menentukan komposisi Navbar untuk konteks Front Office atau Back Office.",
  ],
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
      <span className="grid size-9 grid-cols-2 gap-0.5 rounded-md bg-primary-700 p-1.5 lg:size-[46px]">
        <span className="rounded-sm bg-white" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-white" />
      </span>
      <span className="w-[70px] text-sm font-black tracking-tight text-content lg:w-[90px]">
        KOMDIGI
      </span>
    </span>
  );
}

function ScaledDesktopFrame({
  title,
  src,
  embedded = false,
  referenceWidth = 1440,
}: {
  title: string;
  src: string;
  embedded?: boolean;
  referenceWidth?: 1184 | 1440;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const previewWidth = referenceWidth;
  const previewHeight = 220;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => setScale(Math.min(1, wrapper.clientWidth / previewWidth));
    const observer = new ResizeObserver(updateScale);

    updateScale();
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [previewWidth]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full overflow-hidden bg-surface ${
        embedded ? "" : "rounded-lg border border-border shadow-sm"
      }`}
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

function NavbarPreviewSurface({
  children,
  onHomeNavigate,
}: {
  children: ReactNode;
  onHomeNavigate?: () => void;
}) {
  return (
    <div
      className="min-h-screen bg-surface"
      onClickCapture={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const link = target.closest("a");
        if (!link) return;

        event.preventDefault();
        if (link.getAttribute("href") === "/") onHomeNavigate?.();
      }}
    >
      {children}
    </div>
  );
}

function PlaygroundMobileFrame({
  src,
  referenceWidth = 412,
}: {
  src: string;
  referenceWidth?: 412 | 456;
}) {
  return (
    <div
      className={`mx-auto w-full overflow-hidden rounded-lg border border-border bg-surface shadow-sm ${referenceWidth === 456 ? "max-w-[456px]" : "max-w-[412px]"}`}
    >
      <iframe
        key={src}
        title="Preview interaktif Navbar mobile"
        src={src}
        className="block w-full border-0 bg-surface"
        style={{ height: 640 }}
      />
    </div>
  );
}

function createPlaygroundCode({
  variant,
  state,
  menuCount,
  searchEnabled,
  guestActionsEnabled,
  menuPosition,
}: {
  variant: PlaygroundVariant;
  state: PlaygroundState;
  menuCount: number;
  searchEnabled: boolean;
  guestActionsEnabled: boolean;
  menuPosition: MenuPosition;
}) {
  const items = Array.from({ length: menuCount }, (_, index) => {
    const number = index + 1;
    const isTrueSubmenu = menuCount >= 2 && index === menuCount - 1;

    if (isTrueSubmenu) {
      return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      children: [
        { id: 'menu-${number}-submenu-1', label: 'Submenu 1', href: '/menu-${number}/submenu-1' },
        { id: 'menu-${number}-submenu-2', label: 'Submenu 2', href: '/menu-${number}/submenu-2' },
      ],
    }`;
    }

    return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      href: '/menu-${number}',
      children: [
        { id: 'menu-${number}-overview', label: 'Ringkasan Menu ${number}', href: '/menu-${number}/ringkasan' },
        { id: 'menu-${number}-settings', label: 'Pengaturan Menu ${number}', href: '/menu-${number}/pengaturan' },
        { id: 'menu-${number}-history', label: 'Riwayat Menu ${number}', href: '/menu-${number}/riwayat' },
      ],
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

  if (variant === "back-office") lines.splice(1, 0, '  variant="back-office"');

  if (searchEnabled) {
    lines.push(
      "  search={{",
      "    label: 'Cari layanan',",
      "    placeholder: 'Search Civitas, Organisasi ...',",
      "    onSubmit: (query) => console.log(query),",
      "  }}",
    );
  }

  if (variant === "front-office") lines.push(`  menuPosition="${menuPosition}"`);

  if (variant === "front-office" && state === "guest" && guestActionsEnabled) {
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

function NavbarDocumentationDemo() {
  const [variant, setVariant] = useState<PlaygroundVariant>("front-office");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [state, setState] = useState<PlaygroundState>("guest");
  const [menuCount, setMenuCount] = useState(1);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [guestActionsEnabled, setGuestActionsEnabled] = useState(true);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>("right");

  const params = new URLSearchParams({
    navbarPlayground: "true",
    navbarVariant: variant,
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
    variant,
    state,
    menuCount,
    searchEnabled,
    guestActionsEnabled,
    menuPosition,
  });
  const menuPositionDisabled = previewDevice === "mobile" || variant === "back-office";
  const menuPositionHelp =
    menuPositionDisabled
      ? "Hanya digunakan pada Front Office desktop."
      : "Mengatur posisi grup menu pada tampilan desktop.";
  const guestActionsDisabled = variant === "back-office";

  return (
    <>
      <Section title="Playground">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Gunakan controls untuk melihat bagaimana public props mengubah komposisi Navbar dan kode
          implementasinya.
        </p>
        {previewDevice === "desktop" ? (
          <ScaledDesktopFrame
            title="Preview interaktif Navbar desktop"
            src={previewSrc}
            referenceWidth={variant === "back-office" ? 1184 : 1440}
          />
        ) : (
          <PlaygroundMobileFrame
            src={previewSrc}
            referenceWidth={variant === "back-office" ? 456 : 412}
          />
        )}
        <div
          data-navbar-config-grid
          className="mt-4 grid w-full gap-x-10 gap-y-6 md:grid-cols-2"
        >
          <div>
            <ControlLabel>Variant</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih variant Navbar"
                value={variant}
                onChange={setVariant}
                options={[
                  { value: "front-office", label: "Front Office" },
                  { value: "back-office", label: "Back Office" },
                ]}
              />
            </div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
              Pilih komposisi untuk layanan publik atau application shell internal.
            </p>
          </div>

          <div>
            <ControlLabel>Preview</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih viewport preview"
                value={previewDevice}
                onChange={setPreviewDevice}
                options={[
                  { value: "desktop", label: "Desktop" },
                  { value: "mobile", label: "Mobile" },
                ]}
              />
            </div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
              Preview hanya mengubah viewport dokumentasi; responsive behavior ditangani Navbar.
            </p>
          </div>

          <div>
            <ControlLabel>State</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih state Navbar"
                value={state}
                onChange={setState}
                options={[
                  { value: "guest", label: "Guest" },
                  { value: "authenticated", label: "Authenticated" },
                ]}
              />
            </div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
              Gunakan Authenticated ketika data user tersedia.
            </p>
          </div>

          <div>
            <ControlLabel>Jumlah menu</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih jumlah menu"
                value={menuCount}
                onChange={setMenuCount}
                itemClassName="w-9 justify-center"
                wrap
                options={[1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }))}
              />
            </div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
              Jumlah menu mengikuti jumlah item pada prop <code>items</code>.
            </p>
          </div>

          <div>
            <ControlLabel>Search</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan search"
                value={searchEnabled}
                onChange={setSearchEnabled}
                options={[
                  { value: true, label: "On" },
                  { value: false, label: "Off" },
                ]}
              />
            </div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
              Matikan jika Navbar tidak membutuhkan pencarian.
            </p>
          </div>

          {state === "guest" && (
            <div>
              <ControlLabel>Guest actions</ControlLabel>
              <fieldset
                disabled={guestActionsDisabled}
                className={
                  guestActionsDisabled
                    ? "mt-2 w-fit cursor-not-allowed opacity-50 [&_button]:cursor-not-allowed"
                    : "mt-2 w-fit"
                }
              >
                <Segmented
                  label="Tampilkan guest actions"
                  value={guestActionsEnabled}
                  onChange={setGuestActionsEnabled}
                  options={[
                    { value: true, label: "On" },
                    { value: false, label: "Off" },
                  ]}
                />
              </fieldset>
              <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
                {guestActionsDisabled
                  ? "Hanya digunakan pada Front Office."
                  : "Menampilkan aksi Masuk dan Daftar untuk guest."}
              </p>
            </div>
          )}

          <div>
            <ControlLabel>Menu position</ControlLabel>
            <fieldset
              disabled={menuPositionDisabled}
              className={
                menuPositionDisabled
                  ? "mt-2 w-fit cursor-not-allowed opacity-50 [&_button]:cursor-not-allowed"
                  : "mt-2 w-fit"
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
            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500">{menuPositionHelp}</p>
          </div>
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>{code}</CodeBlock>
      </Section>
    </>
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
  const navbarVariant =
    params.get("navbarVariant") === "back-office" ? "back-office" : "front-office";

  return (
    <NavbarPreviewSurface>
      <Navbar
        variant={navbarVariant}
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
  const [navigationInstanceKey, setNavigationInstanceKey] = useState(0);
  const params = new URLSearchParams(window.location.search);
  const playground = params.get("navbarPlayground") === "true";
  const requestedMenuCount = Number(params.get("navbarMenuCount"));
  const effectiveMenuCount =
    playground && [1, 2, 3, 4, 5].includes(requestedMenuCount)
      ? (requestedMenuCount as 1 | 2 | 3 | 4 | 5)
      : 3;
  const previewItems = figmaMenuItems[effectiveMenuCount];
  const [activeHref, setActiveHref] = useState<string>();
  const previewPage = getMobilePreviewPage(previewItems, activeHref);
  const authenticated = playground
    ? params.get("navbarState") === "authenticated"
    : variant === "authenticated";
  const searchEnabled = !playground || params.get("navbarSearch") !== "off";
  const guestActionsEnabled = !playground || params.get("navbarGuestActions") !== "off";
  const menuPosition = params.get("navbarMenuPosition") === "left" ? "left" : "right";
  const navbarVariant =
    params.get("navbarVariant") === "back-office" ? "back-office" : "front-office";

  return (
    <NavbarPreviewSurface
      onHomeNavigate={() => {
        setActiveHref(undefined);
        setOpen(false);
        setNavigationInstanceKey((key) => key + 1);
      }}
    >
      <Navbar
        variant={navbarVariant}
        key={navigationInstanceKey}
        brand={<DemoBrand />}
        brandHref="/"
        brandLabel="KOMDIGI — Beranda"
        items={previewItems}
        activeHref={activeHref}
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
        onNavigate={(item, event) => {
          event.preventDefault();
          if ("href" in item && item.href) setActiveHref(item.href);
        }}
        mobileOpen={open}
        onMobileOpenChange={setOpen}
      />
      <main className="min-h-[480px] bg-surface px-4 py-6">
        <section className="max-w-prose" aria-live="polite">
          <h1 className="text-lg font-bold text-content">{previewPage.title}</h1>
          <p className="mt-2 text-sm leading-6 text-content-subtle">
            {previewPage.description}
          </p>
        </section>
      </main>
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
  "Mengelola Sidebar mobile dan, khusus Back Office, trigger serta Drawer navigasi sekunder.",
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
      description="Navbar digunakan sebagai navigasi utama di bagian atas aplikasi. Komponen ini mendukung menu, pencarian, aksi untuk guest, serta akun pengguna pada kondisi authenticated."
    >
      <Section title="States">
        <div className="grid gap-5">
          <div>
            <h3 className="text-sm font-black text-gray-900">Guest</h3>
            <p className="mt-2 mb-3 max-w-2xl text-body-sm leading-6 text-gray-500">
              Digunakan ketika pengguna belum terautentikasi. Navbar dapat menampilkan aksi Masuk
              dan Daftar.
            </p>
            <Demo>
              <ScaledDesktopFrame
                title="Preview statis Navbar Guest"
                src="?#/preview/navbar/desktop-guest-3"
                embedded
              />
            </Demo>
          </div>

          <div>
            <h3 className="text-sm font-black text-gray-900">Authenticated</h3>
            <p className="mt-2 mb-3 max-w-2xl text-body-sm leading-6 text-gray-500">
              Digunakan ketika data pengguna tersedia. Guest actions digantikan oleh notification
              dan user controls.
            </p>
            <Demo>
              <ScaledDesktopFrame
                title="Preview statis Navbar Authenticated"
                src="?#/preview/navbar/desktop-authenticated-3"
                embedded
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Variants">
        <div className="grid gap-5">
          <div>
            <h3 className="text-sm font-black text-gray-900">Front Office</h3>
            <p className="mt-2 mb-3 max-w-2xl text-body-sm leading-6 text-gray-500">
              Digunakan untuk layanan publik. Desktop menampilkan brand, sedangkan mobile memakai
              Hamburger di kanan untuk membuka Sidebar tanpa secondary Drawer.
            </p>
            <Demo>
              <ScaledDesktopFrame
                title="Preview statis Front Office"
                src="?navbarVariant=front-office#/preview/navbar/desktop-guest-3"
                embedded
              />
            </Demo>
          </div>

          <div>
            <h3 className="text-sm font-black text-gray-900">Back Office</h3>
            <p className="mt-2 mb-3 max-w-2xl text-body-sm leading-6 text-gray-500">
              Digunakan sebagai application shell. Desktop tidak menampilkan brand; pada mobile,
              Hamburger, brand, Search, avatar opsional, dan trigger Drawer tersusun dalam satu
              baris.
            </p>
            <Demo>
              <ScaledDesktopFrame
                title="Preview statis Back Office"
                src="?navbarVariant=back-office#/preview/navbar/desktop-authenticated-3"
                embedded
                referenceWidth={1184}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Navigation">
        <p className="mb-4 max-w-2xl text-body-sm leading-6 text-gray-500">
          Bentuk setiap <code>NavbarItem</code> menentukan cara item berperilaku sebagai halaman,
          navigasi sekunder, atau submenu.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-black text-gray-900">Primary navigation</h3>
            <p className="mt-2 text-xs font-bold text-primary-700">href</p>
            <p className="mt-2 text-body-sm leading-6 text-gray-500">
              Item dengan href mengarahkan pengguna langsung ke halaman utama.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Secondary navigation</h3>
            <p className="mt-2 text-xs font-bold text-primary-700">href + children</p>
            <p className="mt-2 text-body-sm leading-6 text-gray-500">
              Item dengan href dan children memiliki halaman utama serta navigasi sekunder. Pada
              Back Office mobile, navigasi ini dibuka melalui trigger Drawer.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Submenu</h3>
            <p className="mt-2 text-xs font-bold text-primary-700">children</p>
            <p className="mt-2 text-body-sm leading-6 text-gray-500">
              Item dengan children tanpa href berfungsi sebagai submenu dan menggunakan chevron
              untuk membuka item turunannya.
            </p>
          </div>
        </div>
      </Section>

      <NavbarDocumentationDemo />

      <Section title="Responsive">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-black text-gray-900">Desktop</h3>
            <p className="mt-2 max-w-2xl text-body-sm leading-6 text-gray-500">
              Front Office menampilkan brand, Search, navigation, dan actions atau user controls;
              menuPosition mengatur grup menu. Back Office menampilkan Search di kiri serta
              navigation dan user controls di kanan tanpa brand.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Mobile</h3>
            <p className="mt-2 max-w-2xl text-body-sm leading-6 text-gray-500">
              Front Office memakai Hamburger kanan dan Sidebar kiri tanpa Drawer. Back Office
              memakai satu baris dengan Hamburger kiri, brand, Search, avatar opsional, dan trigger
              Drawer kanan ketika halaman aktif memiliki navigasi sekunder. Notification Bell tidak
              tampil pada authenticated mobile.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-black text-gray-900">Ditangani otomatis oleh Navbar</h3>
            <ul className="mt-3 space-y-2 text-body-sm leading-6 text-content-subtle">
              {automaticAccessibility.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-gray-900">Perlu diperhatikan consumer</h3>
            <ul className="mt-3 space-y-2 text-body-sm leading-6 text-content-subtle">
              {consumerAccessibility.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Properties">
        <p className="mb-4 max-w-2xl text-body-sm leading-6 text-gray-500">
          Pada <code>NavbarItem</code>, <code>href</code> membuat primary navigation link,
          kombinasi <code>href + children</code> menyediakan secondary navigation context untuk
          Drawer Back Office, dan <code>children</code> tanpa <code>href</code> membuat true submenu.
        </p>
        <PropsTable rows={navbarProps} />
      </Section>
    </ComponentPage>
  );
}
