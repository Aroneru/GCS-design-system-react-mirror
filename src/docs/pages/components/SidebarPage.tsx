import { type ReactNode, useState } from "react";
import { ChartPie, Clipboard, Inbox, Layers, Lock, Cart } from "flowbite-react-icons/solid";
import { Sidebar, type SidebarGroup, type SidebarItem } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { H, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

type CollapseOption = "expanded" | "collapsed";
type BadgeOption = "show" | "hide";
type MenuIconOption = "show" | "hide";
type SeparatorOption = "show" | "hide";
type VisibilityOption = "show" | "hide";

const collapseOptions = [
  { value: "expanded", label: "Expanded" },
  { value: "collapsed", label: "Collapsed" },
];

const badgeOptions = [
  { value: "show", label: "Ada" },
  { value: "hide", label: "Tidak Ada" },
];

const menuIconOptions = [
  { value: "show", label: "Ada" },
  { value: "hide", label: "Tidak Ada" },
];

const visibilityOptions = [
  { value: "show", label: "Ada" },
  { value: "hide", label: "Tidak Ada" },
];

const separatorOptions = [
  { value: "show", label: "Ada" },
  { value: "hide", label: "Tidak Ada" },
];

const sidebarProps: PropRow[] = [
  ["items", "SidebarItem[]", "—", "Daftar menu yang ditampilkan pada Sidebar."],
  ["groups", "SidebarGroup[]", "undefined", "Daftar grup menu; mendukung content separator."],
  ["logo", "ReactNode", "undefined", "Logo atau identitas aplikasi pada bagian atas Sidebar."],
  ["collapsedLogo", "ReactNode", "undefined", "Logo/mark ringkas untuk Sidebar collapsed."],
  ["user", "SidebarUser", "undefined", "Informasi pengguna yang ditampilkan pada profile section."],
  [
    "collapsed",
    "boolean",
    "false",
    "State controlled untuk membuka atau menutup Sidebar; gunakan bersama onCollapse.",
  ],
  [
    "showCollapseButton",
    "boolean",
    "false",
    "Menampilkan tombol collapse tanpa mengaktifkan interaksi.",
  ],
  ["onCollapse", "() => void", "undefined", "Handler untuk memperbarui state collapsed."],
];

const sidebarItemProps: PropRow[] = [
  ["label", "string", "—", "Teks menu yang ditampilkan."],
  ["href", "string", "undefined", "Tujuan tautan menu."],
  ["icon", "ReactNode", "undefined", "Icon opsional di sebelah label menu."],
  ["badge", "ReactNode", "undefined", "Konten badge pada sisi kanan menu."],
  ["active", "boolean", "false", "Mengaktifkan tampilan state aktif."],
  ["disabled", "boolean", "false", "Menonaktifkan interaksi pada menu."],
  ["children", "SidebarSubItem[]", "undefined", "Daftar submenu pada menu."],
  ["defaultOpen", "boolean", "false", "Membuka submenu saat pertama dirender."],
  [
    "submenuToggleDisabled",
    "boolean",
    "false",
    "Menonaktifkan tombol buka/tutup submenu tanpa menonaktifkan menu.",
  ],
  ["onCollapse", "() => void", "undefined", "Callback ketika tombol collapse Sidebar ditekan."],
];

const toc: TocEntry[] = [
  { id: "variants", label: "Variants" },
  { id: "menu", label: "Menu" },
  { id: "badge", label: "Badge" },
  { id: "separator", label: "Content Separator" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

const baseItems = [
  {
    label: "Menu 1",
    href: "#",
    icon: <ChartPie className="size-4" />,
  },
  {
    label: "Menu 2",
    href: "#",
    icon: <Clipboard className="size-4" />,
  },
  {
    label: "Menu 3",
    icon: <Cart className="size-4" />,
    defaultOpen: true,
    children: [
      { label: "Sub - Menu 1", href: "#" },
      { label: "Sub - Menu 2", href: "#" },
      { label: "Sub - Menu 3", href: "#" },
    ],
  },
  {
    label: "Menu 4",
    href: "#",
    icon: <Inbox className="size-4" />,
    badge: 1,
  },
  {
    label: "Menu 5",
    href: "#",
    icon: <Lock className="size-4" />,
  },
  {
    label: "Menu 6",
    href: "#",
    icon: <Clipboard className="size-4" />,
  },
  {
    label: "Menu 7",
    href: "#",
    icon: <Layers className="size-4" />,
  },
  {
    label: "Menu 8",
    href: "#",
    icon: <ChartPie className="size-4" />,
  },
];

const menuOnlyItems = Array.from({ length: 14 }, (_, index) => ({
  label: `Menu ${index + 1}`,
  href: "#",
  active: index === 2,
}));

const standardItems = menuOnlyItems.filter((item) => item.label !== "Menu 5");

const nestedItems = [
  { label: "Menu 1", href: "#" },
  { label: "Menu 2", href: "#" },
  {
    label: "Menu 3",
    active: true,
    defaultOpen: true,
    children: [
      { label: "Sub - Menu 1", href: "#" },
      { label: "Sub - Menu 2", href: "#" },
      { label: "Sub - Menu 3", href: "#" },
    ],
  },
  { label: "Menu 4", href: "#", badge: 1 },
  { label: "Menu 5", href: "#" },
  { label: "Menu 6", href: "#" },
  { label: "Menu 7", href: "#" },
  { label: "Menu 8", href: "#" },
];

const iconGroups = [
  { id: "main", items: baseItems.slice(0, 5) },
  { id: "secondary", separator: true, items: baseItems.slice(5) },
];

const separatorGroups: SidebarGroup[] = [
  {
    id: "primary",
    items: [
      { label: "Menu 4", href: "#", icon: <Inbox className="size-4" />, badge: 1 },
      { label: "Menu 5", icon: <Lock className="size-4" /> },
    ],
  },
  {
    id: "secondary",
    separator: true,
    items: [
      { label: "Menu 6", href: "#", icon: <Clipboard className="size-4" /> },
      { label: "Menu 7", href: "#", icon: <Layers className="size-4" /> },
      { label: "Menu 8", href: "#", icon: <ChartPie className="size-4" /> },
    ],
  },
];

function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 grid-cols-2 gap-0.5 rounded-md bg-primary-700 p-1.5">
        <span className="rounded-sm bg-white" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-primary-300" />
        <span className="rounded-sm bg-white" />
      </span>
      {!collapsed && <span className="text-sm font-black tracking-tight text-content">STASI</span>}
    </span>
  );
}

function highlightCode(code: string, tokens: string[]): ReactNode {
  if (tokens.length === 0) return code;

  const pattern = new RegExp(
    `(${tokens
      .sort((left, right) => right.length - left.length)
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "g",
  );

  return code
    .split(pattern)
    .map((part, index) => (tokens.includes(part) ? <H key={`${part}-${index}`}>{part}</H> : part));
}

function VariantPreview({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
      </div>
      <div className="h-[440px] overflow-y-auto overscroll-contain bg-gray-50">{children}</div>
    </article>
  );
}

function SidebarVariant({
  items,
  groups,
  collapsed = false,
}: {
  items?: SidebarItem[];
  groups?: SidebarGroup[];
  collapsed?: boolean;
}) {
  return (
    <Sidebar
      collapsed={collapsed}
      showCollapseButton
      logo={<SidebarBrand />}
      collapsedLogo={<SidebarBrand collapsed />}
      user={{ name: "Nama User", profileLabel: "Lihat Profil", href: "#" }}
      items={items}
      groups={groups}
    />
  );
}

export function SidebarPage() {
  const [collapse, setCollapse] = useState<CollapseOption>("expanded");
  const [badge, setBadge] = useState<BadgeOption>("show");
  const [menuIcon, setMenuIcon] = useState<MenuIconOption>("show");
  const [separator, setSeparator] = useState<SeparatorOption>("show");
  const [userInfo, setUserInfo] = useState<VisibilityOption>("show");
  const [logoWeb, setLogoWeb] = useState<VisibilityOption>("show");

  const collapsed = collapse === "collapsed";

  const playgroundItems = baseItems.map((item) => ({
    ...item,
    icon: menuIcon === "show" ? item.icon : undefined,
    ...(item.label === "Menu 4" ? { badge: badge === "show" ? 1 : undefined } : {}),
  }));

  const playgroundGroups: SidebarGroup[] | undefined =
    separator === "show"
      ? [
          { id: "main", items: playgroundItems.slice(0, 5) },
          { id: "secondary", separator: true, items: playgroundItems.slice(5) },
        ]
      : undefined;

  const iconProperty = (icon: string) =>
    menuIcon === "show" ? `, icon: <${icon} className="size-4" />` : "";
  const usageItems = `const items = [
  { label: "Menu 1", href: "#"${iconProperty("ChartPie")} },
  { label: "Menu 2", href: "#"${iconProperty("Clipboard")} },
  {
    label: "Menu 3"${iconProperty("Cart")},
    defaultOpen: true,
    children: [
      { label: "Sub - Menu 1", href: "#" },
      { label: "Sub - Menu 2", href: "#" },
      { label: "Sub - Menu 3", href: "#" },
    ],
  },
  { label: "Menu 4", href: "#"${iconProperty("Inbox")}${badge === "show" ? ", badge: 1" : ""} },
  { label: "Menu 5", href: "#"${iconProperty("Lock")} },
  { label: "Menu 6", href: "#"${iconProperty("Clipboard")} },
  { label: "Menu 7", href: "#"${iconProperty("Layers")} },
  { label: "Menu 8", href: "#"${iconProperty("ChartPie")} },
]`;
  const usageCode = [
    "import { Sidebar } from '@tpl/design-kit-react'",
    ...(menuIcon === "show"
      ? [
          "import { Cart, ChartPie, Clipboard, Inbox, Layers, Lock } from 'flowbite-react-icons/solid'",
        ]
      : []),
    "",
    usageItems,
    ...(separator === "show"
      ? [
          "",
          "const groups = [",
          "  { id: 'main', items: items.slice(0, 5) },",
          "  { id: 'secondary', separator: true, items: items.slice(5) },",
          "]",
        ]
      : []),
    "",
    "<Sidebar",
    ...(logoWeb === "show" ? ["  logo={<Logo />}", "  collapsedLogo={<LogoMark />}"] : []),
    ...(userInfo === "show"
      ? ["  user={{ name: 'Nama User', profileLabel: 'Lihat Profil', href: '#' }}"]
      : []),
    `  ${separator === "show" ? "groups={groups}" : "items={items}"}`,
    `  collapsed={${collapsed}}`,
    ...(logoWeb === "show" ? ["  onCollapse={() => setCollapsed((current) => !current)}"] : []),
    "/>",
  ].join("\n");
  const usageHighlights = [
    "collapsed",
    ...(menuIcon === "show" ? ["icon"] : []),
    ...(badge === "show" ? ["badge"] : []),
    ...(userInfo === "show" ? ["user"] : []),
    ...(logoWeb === "show" ? ["collapsedLogo", "logo", "onCollapse"] : []),
    ...(separator === "show" ? ["separator: true", "groups"] : []),
  ];

  return (
    <UsulanPage
      eyebrow="Components · Sidebar"
      title="Sidebar"
      description="Navigasi vertikal yang digunakan untuk menampilkan struktur menu utama aplikasi, profile pengguna, submenu, dan informasi tambahan."
      toc={toc}
    >
      {/* ==================== VARIANTS ==================== */}

      <FlowSection id="variants" title="Variants">
        <p className="mb-6 text-body-sm text-gray-500">
          Sidebar tersedia dalam lima konfigurasi, dari navigasi sederhana sampai menu berikon yang
          dikelompokkan dengan content separator.
        </p>

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <VariantPreview
            title="1. Menu saja"
            description="Navigasi dasar tanpa logo dan informasi akun."
          >
            <Sidebar items={menuOnlyItems} />
          </VariantPreview>

          <VariantPreview
            title="2. Menu, user info, logo web"
            description="Navigasi dasar dengan identitas aplikasi dan area akun."
          >
            <SidebarVariant items={standardItems} />
          </VariantPreview>

          <VariantPreview
            title="3. Multi-level menu, user info, logo web"
            description="Menu anak dipakai untuk mengelompokkan navigasi yang berkaitan."
          >
            <SidebarVariant items={nestedItems} />
          </VariantPreview>

          <VariantPreview
            title="4. Multi-level menu + icon"
            description="Menu berikon dikelompokkan; separator membedakan area konten."
          >
            <SidebarVariant groups={iconGroups} />
          </VariantPreview>

          <VariantPreview
            title="5. Collapsed"
            description="Konfigurasi varian 4 dalam kondisi tertutup: icon, user, dan logo mark tetap terlihat."
          >
            <SidebarVariant groups={iconGroups} collapsed />
          </VariantPreview>
        </div>

        {/* <SectionCode>
          {`import { Sidebar, type SidebarGroup } from '@tpl/design-kit-react'
import { Cart, ChartPie, Clipboard, Inbox, Layers, Lock } from 'flowbite-react-icons/solid'

const groups: SidebarGroup[] = [
  {
    id: 'main',
    items: [
      { label: 'Menu 1', href: '#', icon: <ChartPie /> },
      { label: 'Menu 2', href: '#', icon: <Clipboard /> },
      {
        label: 'Menu 3',
        icon: <Cart />,
        defaultOpen: true,
        children: [{ label: 'Sub - Menu 1', href: '#' }, { label: 'Sub - Menu 2', href: '#' }],
      },
      { label: 'Menu 4', href: '#', icon: <Inbox />, badge: 1 },
      { label: 'Menu 5', href: '#', icon: <Lock /> },
    ],
  },
  {
    id: 'secondary',
    separator: true,
    items: [
      { label: 'Menu 6', href: '#', icon: <Clipboard /> },
      { label: 'Menu 7', href: '#', icon: <Layers /> },
    ],
  },
]

<Sidebar
  logo={<Logo />}
  collapsedLogo={<LogoMark />}
  user={{ name: 'Nama User', profileLabel: 'Lihat Profil', href: '#' }}
  groups={groups}
/>`}
        </SectionCode> */}
      </FlowSection>

      {/* ==================== MENU ==================== */}

      <FlowSection id="menu" title="Menu">
        <p className="mb-6 text-body-sm text-gray-500">
          Menu digunakan sebagai navigasi utama pada Sidebar. Setiap item dapat memiliki ikon,
          label, tautan, dan state interaksi.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Menu</h3>
            <div className="mb-4 max-w-[280px] rounded-xl border border-gray-200 bg-white p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                  <ChartPie className="size-4" />
                  <span>Menu 1</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                  <Clipboard className="size-4" />
                  <span>Menu 2</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                  <Inbox className="size-4" />
                  <span>Menu 3</span>
                </div>
              </div>
            </div>

            <SectionCode>
              {"const items = [\n"}
              {"  { "}
              <H>label</H>
              {': "Menu 1", '}
              {"icon: <ChartPie />, "}
              {'href: "#" },\n'}
              {"  { "}
              <H>label</H>
              {': "Menu 2", '}
              {"icon: <Clipboard />, "}
              {'href: "#" },\n'}
              {"  { "}
              <H>label</H>
              {': "Menu 3", '}
              {"icon: <Inbox />, "}
              {'href: "#" },\n'}
              {"]"}
            </SectionCode>
          </div>

          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Sub Menu</h3>
            <div className="mb-4 max-w-[280px] overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Sidebar
                className="!min-h-0"
                items={[
                  {
                    label: "Menu 3",
                    icon: <Cart className="size-4" />,
                    active: true,
                    defaultOpen: true,
                    submenuToggleDisabled: true,
                    children: [
                      { label: "Sub - Menu 1", href: "#" },
                      { label: "Sub - Menu 2", href: "#" },
                    ],
                  },
                ]}
              />
            </div>

            <SectionCode>
              {"{\n"}
              {"  "}
              {'label: "Menu 3",\n'}
              {"  "}
              {"icon: <Cart />,\n"}
              {"  "}
              <H>children</H>
              {": [\n"}
              {"    { "}
              {'label: "Sub - Menu 1", '}
              {'href: "#" },\n'}
              {"    { "}
              {'label: "Sub - Menu 2", '}
              {'href: "#" },\n'}
              {"  ],\n"}
              {"}"}
            </SectionCode>
          </div>
        </div>
      </FlowSection>

      {/* ==================== BADGE ==================== */}

      <FlowSection id="badge" title="Badge">
        <p className="mb-6 text-body-sm text-gray-500">
          Badge dapat digunakan untuk menampilkan informasi singkat seperti jumlah notifikasi atau
          item baru pada menu tertentu.
        </p>

        <div className="mb-4 max-w-[280px] rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700">
            <Inbox className="size-4" />

            <span className="flex-1">Menu 4</span>

            <span className="flex min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
              1
            </span>
          </div>
        </div>

        <SectionCode>
          {"const item = {\n"}
          {"  "}
          {'label: "Menu 4",\n'}
          {"  "}
          {"icon: <Inbox />,\n"}
          {"  "}
          <H>badge</H>
          {": 1,\n"}
          {"}"}
        </SectionCode>
      </FlowSection>

      {/* ==================== SEPARATOR ==================== */}

      <FlowSection id="separator" title="Content Separator">
        <p className="mb-6 text-body-sm text-gray-500">
          Separator memisahkan kelompok menu yang berbeda. Tambahkan{" "}
          <H>
            <code>separator: true </code>
          </H>
          pada group yang ingin diberi garis pemisah di bagian atas.
        </p>

        <div className="mb-4 max-w-[280px] overflow-hidden rounded-xl border border-gray-200 bg-white">
          <Sidebar className="!min-h-0" groups={separatorGroups} />
        </div>

        <SectionCode>
          {"const groups = [\n"}
          {"  {\n    id: 'primary',\n    items: [\n"}
          {"      { label: 'Menu 4', href: '#', icon: <Inbox />, badge: 1 },\n"}
          {"      { label: 'Menu 5', href: '#', icon: <Lock /> },\n"}
          {"    ],\n  },\n"}
          {"  {\n    id: 'secondary',\n    "}
          <H>separator</H>
          {": true,\n"}
          {"    items: [\n"}
          {"      { label: 'Menu 6', href: '#', icon: <Clipboard /> },\n"}
          {"      { label: 'Menu 7', href: '#', icon: <Layers /> },\n"}
          {"      { label: 'Menu 8', href: '#', icon: <ChartPie /> },\n"}
          {"    ],\n  },\n]\n\n"}
          {"<Sidebar groups={groups} />"}
        </SectionCode>
      </FlowSection>

      {/* ==================== PLAYGROUND ==================== */}

      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Coba konfigurasi Sidebar melalui kontrol di bawah ini untuk melihat perubahan mode
          collapse, badge, dan separator.
        </p>

        <Stage maxWidth="max-w-[520px]">
          <div className="flex min-h-[760px] justify-center">
            <Sidebar
              key={separator}
              collapsed={collapsed}
              onCollapse={
                logoWeb === "show"
                  ? () =>
                      setCollapse((current) => (current === "expanded" ? "collapsed" : "expanded"))
                  : undefined
              }
              logo={logoWeb === "show" ? <SidebarBrand /> : undefined}
              collapsedLogo={logoWeb === "show" ? <SidebarBrand collapsed /> : undefined}
              user={
                userInfo === "show"
                  ? { name: "Nama User", profileLabel: "Lihat Profil", href: "#" }
                  : undefined
              }
              groups={playgroundGroups}
              items={playgroundGroups ? undefined : playgroundItems}
            />
          </div>
        </Stage>

        <Controls>
          <Control label="Sidebar">
            <Segmented
              label="Pilih kondisi Sidebar"
              value={collapse}
              onChange={(value) => setCollapse(value as CollapseOption)}
              options={collapseOptions}
            />
          </Control>

          <Control label="Badge">
            <Segmented
              label="Tampilkan badge"
              value={badge}
              onChange={(value) => setBadge(value as BadgeOption)}
              options={badgeOptions}
            />
          </Control>

          <Control label="Icon menu">
            <Segmented
              label="Tampilkan icon menu"
              value={menuIcon}
              onChange={(value) => setMenuIcon(value as MenuIconOption)}
              options={menuIconOptions}
            />
          </Control>

          <Control label="User info">
            <Segmented
              label="Tampilkan informasi user"
              value={userInfo}
              onChange={(value) => setUserInfo(value as VisibilityOption)}
              options={visibilityOptions}
            />
          </Control>

          <Control label="Logo web">
            <Segmented
              label="Tampilkan logo web"
              value={logoWeb}
              onChange={(value) => setLogoWeb(value as VisibilityOption)}
              options={visibilityOptions}
            />
          </Control>

          <Control label="Content separator">
            <Segmented
              label="Tampilkan content separator"
              value={separator}
              onChange={(value) => setSeparator(value as SeparatorOption)}
              options={separatorOptions}
            />
          </Control>
        </Controls>
      </FlowSection>

      {/* ==================== PENGGUNAAN ==================== */}

      <FlowSection id="penggunaan" title="Penggunaan">
        <p className="mb-6 text-body-sm text-gray-500">
          Bagian ini menampilkan contoh penggunaan Sidebar berdasarkan konfigurasi yang dipilih pada
          Playground.
        </p>

        <SectionCode flush>{highlightCode(usageCode, usageHighlights)}</SectionCode>
      </FlowSection>

      {/* ==================== PROPERTIES ==================== */}

      <FlowSection id="properties" title="Properties">
        <p className="mb-6 text-body-sm text-gray-500">
          Referensi seluruh prop Sidebar, termasuk state container serta state per-item
          menu/submenu.
        </p>

        <PropsTable rows={sidebarProps} minWidth="46rem" />

        <h3 className="mt-8 mb-3 text-sm font-bold text-gray-900">SidebarItem</h3>
        <PropsTable rows={sidebarItemProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
