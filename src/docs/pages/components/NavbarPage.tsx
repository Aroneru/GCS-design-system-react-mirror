import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar, type NavbarItem } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import {
  ControlLabel,
  Demo,
  H,
  Segmented,
} from "../../pageKit";
import {
  FlowSection,
  Lead,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

type PlaygroundState = "guest" | "authenticated";
type MenuPosition = "left" | "right";
type PreviewDevice = "desktop" | "mobile";
type PlaygroundVariant = "front-office" | "back-office";

const navbarToc: TocEntry[] = [
  { id: "variants", label: "Variants" },
  { id: "states", label: "States" },
  { id: "navigation", label: "Navigation" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

function createFigmaItems(count: number): NavbarItem[] {
  return Array.from({ length: count }, (_, index) => {
    const menuNumber = index + 1;
    const contextualItems = ["overview", "settings", "history"].map((key) => ({
      id: `menu-${menuNumber}-${key}`,
      label: `${key === "overview" ? "Ringkasan" : key === "settings" ? "Pengaturan" : "Riwayat"} Menu ${menuNumber}`,
      href: `#/menu-${menuNumber}/${key === "overview" ? "ringkasan" : key === "settings" ? "pengaturan" : "riwayat"}`,
    }));
    const submenuItems = [1, 2].map((submenuNumber) => ({
      id: `menu-${menuNumber}-submenu-${submenuNumber}`,
      label: `Submenu ${submenuNumber} Menu ${menuNumber}`,
      href: `#/menu-${menuNumber}/submenu-${submenuNumber}`,
      ...(menuNumber === 2
        ? {
            contextualItems: [
              {
                id: `menu-2-submenu-${submenuNumber}-overview`,
                label: `Ringkasan Submenu ${submenuNumber}`,
                href: `#/menu-2/submenu-${submenuNumber}/ringkasan`,
              },
              {
                id: `menu-2-submenu-${submenuNumber}-${submenuNumber === 1 ? "settings" : "history"}`,
                label: `${submenuNumber === 1 ? "Pengaturan" : "Riwayat"} Submenu ${submenuNumber}`,
                href: `#/menu-2/submenu-${submenuNumber}/${submenuNumber === 1 ? "pengaturan" : "riwayat"}`,
              },
              ...(submenuNumber === 1
                ? [
                    {
                      id: "menu-2-submenu-1-history",
                      label: "Riwayat Submenu 1",
                      href: "#/menu-2/submenu-1/riwayat",
                    },
                  ]
                : []),
            ],
          }
        : {}),
    }));

    if (menuNumber === 1) {
      return {
        id: `menu-${menuNumber}`,
        label: `Menu ${menuNumber}`,
        href: `#/menu-${menuNumber}`,
        contextualItems,
      };
    }

    if (menuNumber === 2) {
      return {
        id: `menu-${menuNumber}`,
        label: `Menu ${menuNumber}`,
        href: `#/menu-${menuNumber}`,
        children: submenuItems,
        contextualItems,
      };
    }

    if (menuNumber === 3) {
      return {
        id: `menu-${menuNumber}`,
        label: `Menu ${menuNumber}`,
        href: `#/menu-${menuNumber}`,
        children: submenuItems,
      };
    }

    if (menuNumber === 5) {
      return {
        id: `menu-${menuNumber}`,
        label: `Menu ${menuNumber}`,
        children: submenuItems,
      };
    }

    return {
      id: `menu-${menuNumber}`,
      label: `Menu ${menuNumber}`,
      href: `#/menu-${menuNumber}`,
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

    const itemLinks = [
      ...(Array.isArray(item.children) ? item.children : []),
      ...(Array.isArray(item.contextualItems) ? item.contextualItems : []),
      ...(Array.isArray(item.children)
        ? item.children.flatMap((child) => child.contextualItems ?? [])
        : []),
    ];
    const activeChild = itemLinks.find((child) => child.href === activeHref);
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
  [
    "brand",
    "ReactNode",
    "—",
    "Konten brand Front Office dan Back Office mobile; tidak ditampilkan pada Back Office desktop.",
  ],
  ["brandLabel", "string", "—", "Nama aksesibel untuk link brand."],
  ["brandHref", "string", "/", "Tujuan link brand; tetap digunakan oleh brand mobile Back Office."],
  [
    "items",
    "NavbarItem[]",
    "—",
    "Daftar menu utama. children membentuk submenu. NavbarItem.contextualItems menjadi context parent page dan NavbarSubItem.contextualItems menjadi context submenu page. Field yang diomit atau array kosong berarti tanpa context; Drawer hanya tampil pada Back Office mobile.",
  ],
  [
    "activeHref",
    "string",
    "undefined",
    "Href halaman aktif untuk aria-current dan konteks Drawer Back Office mobile.",
  ],
  [
    "search",
    "NavbarSearchConfig",
    "undefined",
    "Konfigurasi pencarian; Front Office memakai layout FO, sedangkan Back Office mobile mengisi ruang tersedia.",
  ],
  [
    "guestActions",
    "NavbarGuestActions",
    "undefined",
    "Aksi Masuk dan Daftar untuk Front Office guest; diabaikan pada Back Office.",
  ],
  [
    "user",
    "NavbarUser",
    "undefined",
    "Data authenticated user; detail tampilan menyesuaikan variant serta desktop atau mobile.",
  ],
  [
    "notification",
    "NavbarNotification",
    "undefined",
    "Konfigurasi notification Front Office authenticated pada desktop.",
  ],
  [
    "variant",
    "'front-office' | 'back-office'",
    "front-office",
    "Menentukan komposisi Navbar untuk konteks Front Office atau Back Office.",
  ],
  [
    "menuPosition",
    "'left' | 'right'",
    "right",
    "Posisi grup menu Front Office pada desktop; tidak berlaku pada Back Office atau mobile.",
  ],
  ["ariaLabel", "string", "Navigasi utama", "Accessible label untuk navigation landmark."],
  ["onNavigate", "function", "undefined", "Callback saat link menu dipilih; dapat digunakan oleh router consumer."],
  ["mobileOpen", "boolean", "undefined", "State controlled untuk panel mobile."],
  ["defaultMobileOpen", "boolean", "false", "State awal panel mobile ketika uncontrolled."],
  ["onMobileOpenChange", "function", "undefined", "Callback ketika panel mobile dibuka atau ditutup."],
  ["className", "string", "undefined", "Class tambahan untuk root Navbar."],
  ["…props", "HTMLAttributes<HTMLElement>", "—", "Atribut elemen header standar diteruskan ke root Navbar."],
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
    const submenuItems = `[
        { id: 'menu-${number}-submenu-1', label: 'Submenu 1 Menu ${number}', href: '/menu-${number}/submenu-1' },
        { id: 'menu-${number}-submenu-2', label: 'Submenu 2 Menu ${number}', href: '/menu-${number}/submenu-2' },
      ]`;
    const menuTwoSubmenuItems = `[
        {
          id: 'menu-2-submenu-1',
          label: 'Submenu 1 Menu 2',
          href: '/menu-2/submenu-1',
          contextualItems: [
            { id: 'menu-2-submenu-1-overview', label: 'Ringkasan Submenu 1', href: '/menu-2/submenu-1/ringkasan' },
            { id: 'menu-2-submenu-1-settings', label: 'Pengaturan Submenu 1', href: '/menu-2/submenu-1/pengaturan' },
            { id: 'menu-2-submenu-1-history', label: 'Riwayat Submenu 1', href: '/menu-2/submenu-1/riwayat' },
          ],
        },
        {
          id: 'menu-2-submenu-2',
          label: 'Submenu 2 Menu 2',
          href: '/menu-2/submenu-2',
          contextualItems: [
            { id: 'menu-2-submenu-2-overview', label: 'Ringkasan Submenu 2', href: '/menu-2/submenu-2/ringkasan' },
            { id: 'menu-2-submenu-2-history', label: 'Riwayat Submenu 2', href: '/menu-2/submenu-2/riwayat' },
          ],
        },
      ]`;
    const contextualItems = `[
        { id: 'menu-${number}-overview', label: 'Ringkasan Menu ${number}', href: '/menu-${number}/ringkasan' },
        { id: 'menu-${number}-settings', label: 'Pengaturan Menu ${number}', href: '/menu-${number}/pengaturan' },
        { id: 'menu-${number}-history', label: 'Riwayat Menu ${number}', href: '/menu-${number}/riwayat' },
      ]`;

    if (number === 1) {
      return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      href: '/menu-${number}',${
        variant === "back-office" ? `
      contextualItems: ${contextualItems},` : ""
      }
    }`;
    }

    if (number === 2) {
      return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      href: '/menu-${number}',
      children: ${variant === "back-office" ? menuTwoSubmenuItems : submenuItems},${
        variant === "back-office" ? `
      contextualItems: ${contextualItems},` : ""
      }
    }`;
    }

    if (number === 3) {
      return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      href: '/menu-${number}',
      children: ${submenuItems},
    }`;
    }

    if (number === 5) {
      return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      children: ${submenuItems},
    }`;
    }

    return `    {
      id: 'menu-${number}',
      label: 'Menu ${number}',
      href: '/menu-${number}',
    }`;
  }).join(",\n");

  let segmentKey = 0;
  const code: ReactNode[] = [];
  const add = (text: string, highlighted = false) => {
    const key = `code-segment-${segmentKey++}`;
    code.push(
      highlighted ? (
        <H key={key}>{text}</H>
      ) : (
        <span key={key}>{text}</span>
      ),
    );
  };

  add("import { Navbar } from '@stasi/design-kit-react';\n\n");
  add(`const items = [\n${items.replace(/^ {2}/gm, "")}\n];\n\n`, true);
  add("<Navbar\n");

  if (variant === "back-office") {
    add('  variant="back-office"\n', true);
  }

  add("  brand={<Logo />}\n");
  add('  brandLabel="KOMDIGI — Beranda"\n');
  add("  items={items}\n");

  if (searchEnabled) {
    add(
      "  search={{\n    label: 'Cari layanan',\n    placeholder: 'Search Civitas, Organisasi ...',\n    onSubmit: (query) => console.log(query),\n  }}\n",
      true,
    );
  }

  if (variant === "front-office" && menuPosition !== "right") {
    add(`  menuPosition="${menuPosition}"\n`, true);
  }

  if (variant === "front-office" && state === "guest" && guestActionsEnabled) {
    add(
      "  guestActions={{\n    login: { label: 'Masuk', href: '/login' },\n    register: { label: 'Daftar', href: '/register' },\n  }}\n",
      true,
    );
  }

  if (state === "authenticated") {
    add(
      `  user={{\n    name: 'User Komdigi',\n    avatarSrc: '/avatar.jpg',\n    items: [{ id: 'profile', label: 'Profil', href: '/profile' }],\n  }}\n${
        variant === "front-office"
          ? "  notification={{ unread: true, href: '/notifications' }}\n"
          : ""
      }`,
      true,
    );
  }

  add("/>");
  return <>{code}</>;
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
    variant === "back-office"
      ? "Hanya digunakan pada Front Office desktop."
      : previewDevice === "mobile"
        ? "Hanya berlaku pada tampilan desktop."
        : "Mengatur posisi grup menu pada tampilan desktop.";
  const guestActionsDisabled = variant === "back-office";

  return (
    <>
      <FlowSection id="playground" title="Playground">
        <Lead>
          Gunakan controls untuk melihat bagaimana public props mengubah komposisi Navbar dan kode
          implementasinya. Preview Desktop/Mobile hanya mensimulasikan viewport dokumentasi dan
          bukan konfigurasi public Navbar.
        </Lead>
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
          className="mt-4 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
              Hanya mengubah ukuran viewport preview. Tidak menghasilkan prop pada kode karena
              Navbar menyesuaikan layout secara responsif.
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
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
          <Lead>
            Blok ini mengikuti kontrol di Playground—ubah kontrolnya, lalu preview dan kode ikut
            berubah. Generated code mengikuti variant: Front Office mengomit contextualItems
            karena tidak menghasilkan UI, sedangkan Back Office menunjukkan context page-specific.
            Preview Desktop/Mobile hanya mengubah viewport dan tidak mengubah public API atau kode.
            Prop bawaan atau yang tidak digunakan sengaja tidak ditulis.
          </Lead>
          <SectionCode flush>{code}</SectionCode>
      </FlowSection>
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

const variantsCode = (
  <>
    {"<Navbar\n"}
    <H>{'  variant="back-office"\n'}</H>
    {"  brand={<Logo />}\n  brandLabel=\"KOMDIGI — Beranda\"\n  items={items}\n  search={search}\n/>"}
  </>
);

const statesCode = (
  <>
    {"// Guest: omit `user` dan gunakan `guestActions` bila diperlukan.\n<Navbar\n  brand={<Logo />}\n  brandLabel=\"KOMDIGI — Beranda\"\n  items={items}\n  search={search}\n"}
    <H>
      {
        "  user={{ name: 'User Komdigi', items: accountItems }}\n  notification={{ unread: true, href: '/notifications' }}\n"
      }
    </H>
    {"/>"}
  </>
);

const navigationShapesCode = (
  <>
    {"const items = [\n"}
    {"  { id: 'direct', label: 'Direct', "}<H>{"href: '/direct'"}</H>{" },\n"}
    {"  {\n    id: 'submenu-page',\n    label: 'Page + submenu',\n    href: '/submenu-page',\n"}
    <H>{"    children: [{ id: 'child', label: 'Child', href: '/submenu-page/child' }],\n"}</H>
    {"  },\n"}
    {"  { id: 'group', label: 'Group', "}<H>{"children: submenuItems"}</H>{" },\n"}
    {"  {\n    id: 'context',\n    label: 'Context',\n    href: '/context',\n"}
    <H>
      {
        "    contextualItems: [{ id: 'summary', label: 'Ringkasan', href: '/context/ringkasan' }],\n"
      }
    </H>
    {"  },\n"}
    {"  {\n    id: 'menu-2',\n    label: 'Menu 2',\n    href: '/menu-2',\n"}
    <H>
      {
        "    children: [\n      {\n        id: 'menu-2-submenu-1',\n        label: 'Submenu 1 Menu 2',\n        href: '/menu-2/submenu-1',\n        contextualItems: [\n          { id: 'submenu-summary', label: 'Ringkasan Submenu 1', href: '/menu-2/submenu-1/ringkasan' },\n        ],\n      },\n    ],\n"
      }
    </H>
    <H>
      {
        "    contextualItems: [\n      { id: 'menu-2-overview', label: 'Ringkasan Menu 2', href: '/menu-2/ringkasan' },\n      { id: 'menu-2-settings', label: 'Pengaturan Menu 2', href: '/menu-2/pengaturan' },\n    ],\n"
      }
    </H>
    {"  },\n"}
    {"] satisfies NavbarItem[];"}
  </>
);

export function NavbarPage() {
  return (
    <UsulanPage
      eyebrow="Components · Navbar"
      title="Navbar"
      description="Navbar digunakan sebagai navigasi utama di bagian atas aplikasi. Komponen ini mendukung menu, pencarian, aksi untuk guest, serta akun pengguna pada kondisi authenticated."
      toc={navbarToc}
    >
      <FlowSection id="variants" title="Variants">
          <Lead>
            Pilih Front Office untuk layanan publik dan Back Office untuk application shell.
            Front Office adalah default; tambahkan prop variant untuk memakai Back Office.
          </Lead>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-gray-900">Front Office</h3>
              <p className="mt-2 mb-3 max-w-2xl text-body-sm leading-6 text-gray-500">
                Menampilkan brand, pencarian, navigation, serta aksi Masuk dan Daftar. Pada mobile,
                Hamburger kanan membuka Sidebar kiri dalam layout dua baris tanpa Drawer. Front
                Office adalah variant default.
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
                Desktop menempatkan Search di kiri dan navigation di kanan tanpa brand visual atau
                guest actions. Mobile memakai Hamburger kiri, stacked brand, Search inline, serta
                trigger Drawer kanan hanya ketika halaman aktif memiliki navigation sekunder.
                Escape menutup surface dan focus kembali ke trigger.
              </p>
              <Demo>
                <ScaledDesktopFrame
                  title="Preview statis Back Office"
                  src="?navbarVariant=back-office#/preview/navbar/desktop-no-button-3"
                  embedded
                  referenceWidth={1184}
                />
              </Demo>
            </div>
          </div>
          <SectionCode>{variantsCode}</SectionCode>
      </FlowSection>

      <FlowSection id="states" title="States">
          <Lead>
            Guest dapat menampilkan aksi Masuk dan Daftar. Ketika data user diberikan, Navbar
            menggantinya dengan authenticated controls; Bell hanya tampil pada Front Office
            desktop.
          </Lead>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-gray-900">Guest</h3>
              <p className="mt-2 mb-3 text-body-sm leading-6 text-gray-500">
                Gunakan tanpa prop user dan tambahkan guestActions untuk aksi autentikasi.
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
              <p className="mt-2 mb-3 text-body-sm leading-6 text-gray-500">
                Berikan user untuk menampilkan avatar dan user controls; mobile menyembunyikan
                nama user dan Bell.
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
          <SectionCode>{statesCode}</SectionCode>
      </FlowSection>

      <FlowSection id="navigation" title="Navigation">
        <Lead>
          Bentuk setiap <code>NavbarItem</code> menentukan cara item berperilaku sebagai halaman,
          submenu, atau contextual navigation khusus Back Office mobile.
        </Lead>
        <div>
          <h3 className="text-sm font-black text-gray-900">Primary &amp; Submenu Navigation</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-black text-gray-900">Primary navigation</h4>
              <p className="mt-2 text-xs font-bold text-primary-700">href</p>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Item dengan href mengarahkan pengguna langsung ke halaman utama. Link aktif
                ditandai menggunakan <code>aria-current</code>.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Page + submenu</h4>
              <p className="mt-2 text-xs font-bold text-primary-700">href + children</p>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Parent memiliki halaman sendiri dan children membentuk submenu. Bentuk ini tidak
                menghasilkan contextual Drawer kecuali page tersebut memiliki contextualItems
                secara eksplisit.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">True submenu</h4>
              <p className="mt-2 text-xs font-bold text-primary-700">children-only</p>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Parent tidak memiliki href dan hanya menjadi trigger submenu. Trigger menggunakan
                aria-expanded dan aria-controls; Escape menutup submenu dan mengembalikan focus.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-black text-gray-900">
            Contextual Navigation — Back Office Mobile Only
          </h3>
          <p className="mt-2 max-w-2xl text-body-sm leading-6 text-gray-500">
            Semua contextualItems, baik pada parent maupun submenu, hanya ditampilkan sebagai
            Drawer pada Back Office Mobile. Front Office Desktop, Front Office Mobile, dan Back
            Office Desktop tidak menampilkan contextual Drawer atau UI tambahan dari data tersebut.
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-black text-gray-900">Page context</h4>
              <p className="mt-2 text-xs font-bold text-primary-700">href + contextualItems</p>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Parent tetap direct page. contextualItems menjadi context milik page tersebut dan
                ditampilkan sebagai Drawer hanya pada Back Office Mobile.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Page + submenu + context</h4>
              <p className="mt-2 text-xs font-bold text-primary-700">
                href + children + contextualItems
              </p>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Parent memiliki halaman, submenu, dan context sendiri. children tetap menjadi
                submenu; contextualItems menjadi context parent page dan tidak menghasilkan Drawer
                pada Front Office atau Back Office Desktop.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Submenu-specific context</h4>
              <p className="mt-2 text-xs font-bold text-primary-700">
                children[].contextualItems
              </p>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Submenu dapat memiliki context sendiri. Drawer mengikuti page aktif yang paling
                spesifik: Menu 2 memakai context Menu 2, sedangkan Submenu 1 atau Submenu 2 memakai
                context masing-masing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-1 text-body-sm leading-6 text-gray-500">
          <p><code>children</code> → submenu</p>
          <p><code>NavbarItem.contextualItems</code> → context parent page</p>
          <p><code>NavbarSubItem.contextualItems</code> → context submenu page</p>
          <p>Semua contextualItems → Drawer hanya pada Back Office Mobile</p>
          <p>
            Context tidak diwariskan otomatis. Untuk berbagi context, berikan data contextualItems
            yang sama secara eksplisit pada setiap page.
          </p>
        </div>
          <SectionCode>{navigationShapesCode}</SectionCode>
      </FlowSection>

      <NavbarDocumentationDemo />

      <FlowSection id="properties" title="Properties">
          <Lead>
            Pada <code>NavbarItem</code>, <code>href</code> membuat primary navigation link,
            <code>children</code> membentuk submenu. <code>contextualItems</code> pada parent atau
            subitem menjadi context page tersebut dan hanya muncul sebagai Drawer Back Office
            mobile. Field ini tetap valid pada data Front Office atau Back Office desktop, tetapi
            tidak menghasilkan UI tambahan. Jika diomit atau berupa array kosong, page tidak
            memiliki context dan tidak mewarisi context parent.
            Consumer perlu menyediakan <code>brandLabel</code>, label menu, href, dan alternative
            text yang bermakna.
          </Lead>
          <PropsTable rows={navbarProps} />
      </FlowSection>
    </UsulanPage>
  );
}
