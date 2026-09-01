import { useState } from "react";
import { ChartPie, Clipboard, Inbox, Layers, Lock } from "flowbite-react-icons/solid";
import { Sidebar } from "../../../lib";
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
type ProfileOption = "show" | "hide";
type BadgeOption = "show" | "hide";

const collapseOptions = [
  { value: "expanded", label: "Expanded" },
  { value: "collapsed", label: "Collapsed" },
];

const profileOptions = [
  { value: "show", label: "Tampil" },
  { value: "hide", label: "Sembunyi" },
];

const badgeOptions = [
  { value: "show", label: "Tampil" },
  { value: "hide", label: "Sembunyi" },
];

const sidebarProps: PropRow[] = [
  ["items", "SidebarItem[]", "—", "Daftar menu yang ditampilkan pada Sidebar."],
  ["logo", "ReactNode", "undefined", "Logo atau identitas aplikasi pada bagian atas Sidebar."],
  ["user", "SidebarUser", "undefined", "Informasi pengguna yang ditampilkan pada profile section."],
  ["collapsed", "boolean", "false", "Menentukan apakah Sidebar dalam kondisi collapsed."],
  ["onCollapse", "() => void", "undefined", "Callback ketika tombol collapse Sidebar ditekan."],
  ["className", "string", "—", "Class tambahan untuk menyesuaikan tampilan Sidebar."],
  ["…props", "HTMLAttributes<HTMLElement>", "—", "Atribut HTML yang valid untuk elemen aside."],
];

const toc: TocEntry[] = [
  { id: "sidebar", label: "Sidebar" },
  { id: "menu", label: "Menu" },
  { id: "submenu", label: "Sub Menu" },
  { id: "badge", label: "Badge" },
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
    icon: <Clipboard className="size-4" />,
    children: [
      { label: "Sub - Menu 1", href: "#" },
      { label: "Sub - Menu 2", href: "#" },
    ],
  },
  {
    label: "Menu 3",
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
    icon: <Lock className="size-4" />,
    children: [
      { label: "Sub - Menu 1", href: "#" },
      { label: "Sub - Menu 2", href: "#" },
    ],
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

export function SidebarPage() {
  const [collapse, setCollapse] = useState<CollapseOption>("expanded");
  const [profile, setProfile] = useState<ProfileOption>("show");
  const [badge, setBadge] = useState<BadgeOption>("show");

  const collapsed = collapse === "collapsed";

  const playgroundItems = baseItems.map((item) => {
    if (item.label === "Menu 4") {
      return {
        ...item,
        badge: badge === "show" ? 1 : undefined,
      };
    }

    return item;
  });

  return (
    <UsulanPage
      eyebrow="Components · Sidebar"
      title="Sidebar"
      description="Navigasi vertikal yang digunakan untuk menampilkan struktur menu utama aplikasi, profile pengguna, submenu, dan informasi tambahan."
      toc={toc}
    >
      {/* ==================== SIDEBAR ==================== */}

      <FlowSection id="sidebar" title="Sidebar">
        <p className="mb-6 text-body-sm text-gray-500">
          Sidebar digunakan sebagai navigasi utama pada aplikasi dengan menampilkan identitas
          aplikasi, informasi pengguna, dan daftar menu dalam struktur vertikal.
        </p>

        <div className="mb-4 flex justify-start">
          <div className="h-[720px] overflow-hidden rounded-xl border border-gray-200">
            <Sidebar
              logo={<div className="text-sm font-black tracking-wide text-gray-900">KOMDIGI</div>}
              user={{
                name: "Nama User",
                profileLabel: "Lihat Profil",
                avatar: "/images/avatar-sample.png",
                href: "#",
              }}
              items={baseItems}
            />
          </div>
        </div>

        <SectionCode>
          {"<Sidebar\n"}
          {"    "}
          <H>logo</H>
          {"={logo}\n"}
          {"    "}
          <H>user</H>
          {"={user}\n"}
          {"    "}
          <H>items</H>
          {"={items}\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* ==================== MENU ==================== */}

      <FlowSection id="menu" title="Menu">
        <p className="mb-6 text-body-sm text-gray-500">
          Menu digunakan sebagai navigasi utama pada Sidebar. Setiap item dapat memiliki ikon,
          label, tautan, dan state interaksi.
        </p>

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
              <span>Menu 4</span>
            </div>
          </div>
        </div>

        <SectionCode>
          {"const items = [\n"}
          {"    {\n"}
          {'        label: "Menu 1",\n'}
          {'        href: "#",\n'}
          {"        "}
          <H>icon</H>
          {"={<ChartPie />},\n"}
          {"    },\n"}
          {"]"}
        </SectionCode>
      </FlowSection>

      {/* ==================== SUB MENU ==================== */}

      <FlowSection id="submenu" title="Sub Menu">
        <p className="mb-6 text-body-sm text-gray-500">
          Submenu digunakan untuk mengelompokkan navigasi yang masih berada dalam satu kategori menu
          utama.
        </p>

        <div className="mb-4 max-w-[280px] rounded-xl border border-gray-200 bg-white p-4">
          <div className="rounded-lg bg-gray-100 px-3 py-2.5">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <span className="flex-1">Menu 3</span>
            </div>

            <div className="mt-2 space-y-1">
              <div className="py-2 pl-7 text-sm text-gray-600">Sub - Menu 1</div>

              <div className="py-2 pl-7 text-sm text-gray-600">Sub - Menu 2</div>

              <div className="py-2 pl-7 text-sm text-gray-600">Sub - Menu 3</div>
            </div>
          </div>
        </div>

        <SectionCode>
          {"const items = [\n"}
          {"    {\n"}
          {'        label: "Menu 3",\n'}
          {"        "}
          <H>children</H>
          {"={[\n"}
          {'            { label: "Sub - Menu 1", href: "#" },\n'}
          {'            { label: "Sub - Menu 2", href: "#" },\n'}
          {'            { label: "Sub - Menu 3", href: "#" },\n'}
          {"        ]}\n"}
          {"    },\n"}
          {"]"}
        </SectionCode>
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
          {'    label: "Menu 4",\n'}
          {"    "}
          <H>badge</H>
          {"={1},\n"}
          {"}"}
        </SectionCode>
      </FlowSection>

      {/* ==================== PLAYGROUND ==================== */}

      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Coba konfigurasi Sidebar melalui kontrol di bawah ini untuk melihat perubahan mode
          collapse, profile pengguna, dan badge.
        </p>

        <Stage maxWidth="max-w-[520px]">
          <div className="flex min-h-[760px] justify-center">
            <Sidebar
              collapsed={collapsed}
              onCollapse={() =>
                setCollapse((current) => (current === "expanded" ? "collapsed" : "expanded"))
              }
              logo={<div className="text-sm font-black tracking-wide text-gray-900">KOMDIGI</div>}
              user={
                profile === "show"
                  ? {
                      name: "Nama User",
                      profileLabel: "Lihat Profil",
                      avatar: "/images/avatar-sample.png",
                      href: "#",
                    }
                  : undefined
              }
              items={playgroundItems}
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

          <Control label="Profile">
            <Segmented
              label="Tampilkan profile"
              value={profile}
              onChange={(value) => setProfile(value as ProfileOption)}
              options={profileOptions}
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
        </Controls>
      </FlowSection>

      {/* ==================== PENGGUNAAN ==================== */}

      <FlowSection id="penggunaan" title="Penggunaan">
        <p className="mb-6 text-body-sm text-gray-500">
          Bagian ini menampilkan contoh penggunaan Sidebar berdasarkan konfigurasi yang dipilih pada
          Playground.
        </p>

        <SectionCode flush>
          {"import { Sidebar } from '@tpl/design-kit-react'\n"}
          {"\n"}
          {"const items = [\n"}
          {"    {\n"}
          {'        label: "Menu 1",\n'}
          {'        href: "#",\n'}
          {"    },\n"}
          {"    {\n"}
          {'        label: "Menu 3",\n'}
          {"        children: [\n"}
          {'            { label: "Sub - Menu 1", href: "#" },\n'}
          {'            { label: "Sub - Menu 2", href: "#" },\n'}
          {"        ],\n"}
          {"    },\n"}

          {badge === "show" && (
            <>
              {"    {\n"}
              {'        label: "Menu 4",\n'}
              {"        "}
              <H>badge</H>
              {"={1},\n"}
              {"    },\n"}
            </>
          )}

          {"]\n"}
          {"\n"}
          {"<Sidebar\n"}

          <>
            {"    "}
            <H>items</H>
            {"={items}\n"}
          </>

          {profile === "show" && (
            <>
              {"    "}
              <H>user</H>
              {"={user}\n"}
            </>
          )}

          <>
            {"    "}
            <H>collapsed</H>
            {`={${collapsed ? "true" : "false"}}\n`}
          </>

          <>
            {"    "}
            <H>onCollapse</H>
            {"={() => setCollapsed((prev) => !prev)}\n"}
          </>

          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* ==================== PROPERTIES ==================== */}

      <FlowSection id="properties" title="Properties">
        <p className="mb-6 text-body-sm text-gray-500">
          Referensi semua prop yang tersedia pada komponen Sidebar.
        </p>

        <PropsTable rows={sidebarProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
