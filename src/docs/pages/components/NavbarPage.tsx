import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar, type NavbarItem } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { CodeBlock, ComponentPage, Section } from "../../pageKit";

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
  ["brand, brandLabel", "ReactNode, string", "—", "Konten brand dan accessible name."],
  ["items", "NavbarItem[]", "[]", "Link atau submenu maksimal satu tingkat."],
  [
    "search",
    "NavbarSearchConfig",
    "undefined",
    "Search submit biasa, controlled atau uncontrolled.",
  ],
  [
    "menuPosition",
    "'left' | 'right'",
    "'right'",
    "Posisi menu desktop; tidak memengaruhi komposisi mobile.",
  ],
  ["guestActions", "NavbarGuestActions", "undefined", "Action login dan register."],
  [
    "user, notification",
    "NavbarUser, NavbarNotification",
    "undefined",
    "Komposisi authenticated dan unread state.",
  ],
  [
    "mobileOpen",
    "boolean",
    "undefined",
    "Controlled mobile panel; gunakan defaultMobileOpen untuk uncontrolled.",
  ],
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

function NavbarShowcase({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div>
        <h3 className="text-heading-4 font-black text-content">{title}</h3>
        {note && <p className="mt-1 text-body-sm text-content-subtle">{note}</p>}
      </div>
      <div className="overflow-visible rounded-lg border border-border bg-surface-subtle p-2 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function NavbarDesktopShowcase({ title, src }: { title: string; src: string }) {
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
    <section className="min-w-0 space-y-2">
      <h3 className="text-heading-4 font-black text-content">{title}</h3>
      <div
        ref={wrapperRef}
        className="relative w-full rounded-lg border border-border bg-surface shadow-sm"
        style={{ height: previewHeight * scale }}
      >
        <iframe
          title={`Preview ${title}`}
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
    </section>
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

function NavbarMobileShowcase({ title, src }: { title: string; src: string }) {
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(122);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return (
    <NavbarShowcase
      title={title}
      note="Iframe memakai viewport mobile nyata; search tetap terlihat di luar panel."
    >
      <div className="mx-auto w-full max-w-[412px]">
        <iframe
          title={`Preview ${title}`}
          src={src}
          className="block w-full rounded-lg border-0 bg-surface"
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
    </NavbarShowcase>
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
  const authenticated = variant === "authenticated";
  const menuPosition =
    variant === "guest" &&
    menuCount === 2 &&
    new URLSearchParams(window.location.search).get("navbarMenuPosition") === "left"
      ? "left"
      : "right";

  return (
    <NavbarPreviewSurface>
      <Navbar
        brand={<DemoBrand />}
        brandLabel="KOMDIGI — Beranda"
        items={figmaMenuItems[menuCount]}
        search={{
          value: query,
          onValueChange: setQuery,
          onSubmit: () => undefined,
          placeholder: "Search Civitas, Organisasi ...",
        }}
        guestActions={variant === "guest" ? demoGuestActions : undefined}
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
  const authenticated = variant === "authenticated";

  return (
    <NavbarPreviewSurface>
      <Navbar
        brand={<DemoBrand />}
        brandLabel="KOMDIGI — Beranda"
        items={figmaMenuItems[3]}
        search={{
          value: query,
          onValueChange: setQuery,
          onSubmit: () => undefined,
          placeholder: "Search Civitas, Organisasi ...",
        }}
        guestActions={authenticated ? undefined : demoGuestActions}
        user={
          authenticated ? { name: "User Komdigi", initials: "UK", items: accountItems } : undefined
        }
        notification={authenticated ? { unread: true, onClick: () => undefined } : undefined}
        onNavigate={(_, event) => event.preventDefault()}
        mobileOpen={open}
        onMobileOpenChange={setOpen}
      />
    </NavbarPreviewSurface>
  );
}

export function NavbarPage() {
  return (
    <ComponentPage
      eyebrow="Components · Navbar"
      title="Navbar"
      description="Navigasi responsif dengan search, submenu satu tingkat, guest actions, notification, dan account menu."
    >
      <Section title="Desktop Guest">
        <div className="space-y-8">
          <p className="text-body-sm text-content-subtle">
            Brand pada showcase masih berupa placeholder karena aset logo KOMDIGI resmi belum
            tersedia di repository.
          </p>

          {([5, 4, 3] as const).map((count) => (
            <NavbarDesktopShowcase
              key={`guest-${count}-button`}
              title={`${count} Menu + Button`}
              src={`#/preview/navbar/desktop-guest-${count}`}
            />
          ))}

          <NavbarDesktopShowcase
            title="2 Menu + Button — Menu Position Left"
            src="?navbarMenuPosition=left#/preview/navbar/desktop-guest-2"
          />
          <NavbarDesktopShowcase
            title="2 Menu + Button — Menu Position Right"
            src="#/preview/navbar/desktop-guest-2"
          />

          {([5, 4, 3] as const).map((count) => (
            <NavbarDesktopShowcase
              key={`guest-${count}`}
              title={`${count} Menu tanpa Button`}
              src={`#/preview/navbar/desktop-no-button-${count}`}
            />
          ))}
        </div>
      </Section>

      <Section title="Desktop Authenticated">
        <div className="space-y-8">
          {([5, 4, 3] as const).map((count) => (
            <NavbarDesktopShowcase
              key={`authenticated-${count}`}
              title={`${count} Menu + User`}
              src={`#/preview/navbar/desktop-authenticated-${count}`}
            />
          ))}
        </div>
      </Section>

      <Section title="Mobile">
        <div className="space-y-8">
          {(
            [
              ["Mobile Guest", "#/preview/navbar/mobile-guest"],
              ["Mobile Authenticated", "#/preview/navbar/mobile-authenticated"],
            ] satisfies Array<[string, string]>
          ).map(([title, src]) => (
            <NavbarMobileShowcase key={src} title={title} src={src} />
          ))}
        </div>
      </Section>

      <Section title="Properties">
        <PropsTable rows={navbarProps} />
      </Section>

      <Section title="Accessibility dan responsive">
        <div className="ds-card space-y-3 p-5 text-sm leading-6 text-content-subtle">
          <p>
            Navbar memakai landmark header/nav/search, aria-current untuk link aktif, serta
            aria-expanded dan aria-controls untuk disclosure.
          </p>
          <p>
            Desktop dimulai pada breakpoint lg. Di bawah lg, search selalu terlihat pada baris kedua
            dan hamburger membuka panel vertikal inline yang bukan modal.
          </p>
          <p>
            Avatar, Dropdown, Search Form, dan notification control saat ini masih berupa
            implementasi internal sementara dan bukan public API package.
          </p>
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>{`<Navbar
  brand={<Logo />}
  brandLabel="KOMDIGI — Beranda"
  items={[
    { id: 'menu-1', label: 'Menu 1', children: [{ id: 'overview', label: 'Ringkasan', href: '/menu-1' }] },
  ]}
  search={{ placeholder: 'Search Civitas, Organisasi ...', onSubmit: (query) => console.log(query) }}
  guestActions={{
    login: { label: 'Masuk', href: '/login' },
    register: { label: 'Daftar', href: '/register' },
  }}
/>`}</CodeBlock>
      </Section>
    </ComponentPage>
  );
}
