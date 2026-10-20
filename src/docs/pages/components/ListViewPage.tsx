import { useState } from "react";
import {
  Badge,
  ListViewItem,
  type ListViewPlatform,
  type ListViewSize,
} from "../../../lib";
import { Clock } from "../../../lib/icons/solid";
import { PropsTable, type PropRow } from "../../PropsTable";
import { Demo, H, Hl, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

const platformOptions: { value: ListViewPlatform; label: string }[] = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
];

const sizeOptions = [
  { value: "s", label: "S (Small)" },
  { value: "m", label: "M (Medium)" },
  { value: "l", label: "L (Large)" },
];

const decorationOptions = [
  { value: false, label: "Tidak Ada" },
  { value: true, label: "Ada" },
];

const badgeOptions = [
  { value: false, label: "Tidak Ada" },
  { value: true, label: "Ada" },
];

const listViewItemProps: PropRow[] = [
  ["title", "ReactNode", "—", "Judul utama berkas atau item dokumen."],
  [
    "description",
    "ReactNode",
    "undefined",
    "Keterangan atau teks deskripsi tambahan di bawah judul.",
  ],
  [
    "metadata",
    "ReactNode[]",
    "undefined",
    "Daftar metadata ringkas yang otomatis digabung dengan tanda pemisah titik tengah (·). Contoh: ['PDF', '2.4 MB', 'Updated Oct 10, 2026'].",
  ],
  [
    "icon",
    "ReactNode | null",
    "<FileLines />",
    "Elemen visual di sisi kiri. Bernilai null jika tidak ingin menampilkan wadah ikon sama sekali.",
  ],
  [
    "platform",
    "'desktop' | 'mobile'",
    "'desktop'",
    "Platform tampilan kartu: 'desktop' (lebar 410–600 px) atau 'mobile' (ringkas 348 px).",
  ],
  [
    "decoration",
    "boolean",
    "false",
    "Menampilkan garis dekorasi aksen vertikal warna primary pada sisi kiri kartu.",
  ],
  [
    "badge",
    "ReactNode",
    "undefined",
    "Badge atau elemen label status tambahan yang ditampilkan di bawah metadata.",
  ],
  [
    "actionLabel",
    "ReactNode",
    "undefined",
    "Label untuk tombol aksi cepat di sisi kanan (otomatis merender Button filled bawaan).",
  ],
  [
    "onAction",
    "(e: MouseEvent) => void",
    "undefined",
    "Callback saat tombol aksi bawaan diklik.",
  ],
  [
    "actionHref",
    "string",
    "undefined",
    "Alamat tautan jika tombol aksi bertindak sebagai tautan.",
  ],
  [
    "actionButtonSize",
    "ButtonSize",
    "undefined",
    "Ukuran tombol aksi bawaan. Mengikuti prop size kartu bila tidak ditentukan.",
  ],
  [
    "size",
    "'s' | 'm' | 'l' | 'sm' | 'default' | 'lg'",
    "'m' / 'default'",
    "Kerapatan ukuran visual item: S (ringkas), M (standar), atau L (lapang).",
  ],
  [
    "href",
    "string",
    "undefined",
    "Alamat tautan jika seluruh kartu item bertindak sebagai link interaktif.",
  ],
  [
    "darkMode",
    "boolean",
    "false",
    "Menyetel kartu item ke tema gelap secara eksplisit.",
  ],
  [
    "as",
    "ElementType",
    "'article' / 'a'",
    "Elemen HTML pembungkus kartu.",
  ],
  [
    "…props",
    "HTMLAttributes<HTMLElement>",
    "—",
    "Seluruh atribut HTML native lainnya diteruskan.",
  ],
];

const listViewContainerProps: PropRow[] = [
  [
    "items",
    "ListViewItemProps[]",
    "undefined",
    "Array data item jika ingin merender daftar berkas secara otomatis.",
  ],
  [
    "gap",
    "'none' | 'sm' | 'md' | 'lg'",
    "'md'",
    "Jarak vertikal antar item dalam daftar berkas.",
  ],
  [
    "platform",
    "'desktop' | 'mobile'",
    "'desktop'",
    "Platform bawaan yang diwariskan ke semua item di dalamnya.",
  ],
  [
    "decoration",
    "boolean",
    "false",
    "Garis dekorasi aksen bawaan yang diwariskan ke semua item di dalamnya.",
  ],
  [
    "size",
    "'s' | 'm' | 'l' | 'sm' | 'default' | 'lg'",
    "'m' / 'default'",
    "Ukuran bawaan yang diwariskan ke semua item di dalamnya.",
  ],
  [
    "darkMode",
    "boolean",
    "false",
    "Menyetel seluruh daftar ke tema gelap.",
  ],
  [
    "children",
    "ReactNode",
    "undefined",
    "Elemen ListViewItem anak saat menggunakan susunan deklaratif.",
  ],
  [
    "…props",
    "HTMLAttributes<HTMLElement>",
    "—",
    "Seluruh atribut HTML pembungkus kontainer diteruskan.",
  ],
];

const toc: TocEntry[] = [
  { id: "variant", label: "Variant" },
  { id: "decoration", label: "Decoration" },
  { id: "badge", label: "Badge" },
  { id: "darkmode", label: "Darkmode" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

export function ListViewPage() {
  const [platform, setPlatform] = useState<ListViewPlatform>("desktop");
  const [size, setSize] = useState<ListViewSize>("m");
  const [decoration, setDecoration] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <UsulanPage
      eyebrow="Components · List View"
      title="List View"
      description="Komponen kartu daftar vertikal untuk menampilkan ringkasan berkas, lampiran, dokumen, atau item data lengkap dengan ikon, judul, metadata, dan aksi cepat."
      toc={toc}
    >
      {/* 1. Variant Section (Desktop | Mobile) */}
      <FlowSection id="variant" title="Variant">
        <Lead>
          Varian terbagi untuk platform <Hl>desktop</Hl> yang menyediakan 3 pilihan ukuran <Hl>(S, M, L)</Hl> serta tombol aksi di sisi kanan, dan <Hl>mobile</Hl> yang
          ringkas dan terstandardisasi untuk layar perangkat genggam.
        </Lead>

        <div className="space-y-8">
          {/* Sub-bagian 1: Desktop (S, M, L) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">1. Desktop</h3>
            </div>


            {/* S */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">Small (S)</h4>
              </div>
              <p className="mb-3 text-body-sm text-gray-500">
                Ukuran ringkas (410 px) dengan wadah ikon 32×32 px dan tombol aksi ukuran XS.
              </p>
              <Demo>
                <div className="w-full max-w-[410px]">
                  <ListViewItem
                    size="s"
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    actionLabel="Open"
                  />
                </div>
              </Demo>
            </div>

            {/* M */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Medium (M) · Default
                </h4>
              </div>
              <p className="mb-3 text-body-sm text-gray-500">
                Ukuran standar bawaan (514 px) dengan wadah ikon 40×40 px dan tombol aksi ukuran S.
              </p>
              <Demo>
                <div className="w-full max-w-[514px]">
                  <ListViewItem
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    actionLabel="Open"
                  />
                </div>
              </Demo>
            </div>

            {/* L */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">Large (L)</h4>
              </div>
              <p className="mb-3 text-body-sm text-gray-500">
                Ukuran lapang (600 px) dengan wadah ikon 48×48 px dan tombol aksi ukuran Base.
              </p>
              <Demo>
                <div className="w-full max-w-[600px]">
                  <ListViewItem
                    size="l"
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    actionLabel="Open"
                  />
                </div>
              </Demo>
            </div>
          </div>

          {/* Sub-bagian 2: Mobile (1 Ukuran + Notes) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">2. Mobile</h3>
            </div>
            <p className="mt-1 text-body-sm text-gray-500">
              Platform mobile hanya memiliki 1 ukuran standar (lebar 348 px, tinggi 58 px). Wadah ikon 40×40 px dengan layout satu baris ringkas.
            </p>

            {/* Kartu Mobile Standar */}
            <div>
              <Demo>
                <div className="w-full max-w-[348px]">
                  <ListViewItem
                    platform="mobile"
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                  />
                </div>
              </Demo>
            </div>
          </div>
        </div>

        <SectionCode>
          {"import { ListViewItem } from '@ceplok-ui/design-kit-react'\n\n"}
          {"{/* 1. Desktop — Small (size=\"s\") */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>size</H>
          {'="s"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* 2. Desktop — Medium (Default, prop size tidak perlu ditulis) */}\n"}
          {"<ListViewItem\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* 3. Desktop — Large (size=\"l\") */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>size</H>
          {'="l"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* 4. Mobile — 1 Ukuran Standar (348 px) */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>platform</H>
          {'="mobile"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 2. Decoration Section (Ada | Tidak Ada) */}
      <FlowSection id="decoration" title="Decoration">
        <Lead>
          Prop <Hl>decoration</Hl> menyematkan garis aksen vertikal warna primary pada sisi kiri
          kartu untuk memberikan aksentuasi visual atau penanda status berkas.
        </Lead>

        <div className="space-y-8">
          {/* Sub-bagian 2: Dengan Dekorasi */}
          <div className="space-y-5">

            {/* Desktop M mewakili */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Desktop (Medium)
                </h4>

              </div>
              <Demo>
                <div className="w-full max-w-[514px]">
                  <ListViewItem
                    decoration
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    actionLabel="Open"
                  />
                </div>
              </Demo>
            </div>

            {/* Mobile mewakili */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Mobile
                </h4>
              </div>
              <Demo>
                <div className="w-full max-w-[348px]">
                  <ListViewItem
                    platform="mobile"
                    decoration
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                  />
                </div>
              </Demo>
            </div>
          </div>
        </div>

        <SectionCode>
          {"import { ListViewItem } from '@ceplok-ui/design-kit-react'\n\n"}
          {"{/* 1. Tanpa Dekorasi (Default) */}\n"}
          {"<ListViewItem\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* 2. Dengan Dekorasi (Garis aksen vertikal di sisi kiri) */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>decoration</H>
          {"\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 3. Badge Section (Ada | Tidak Ada) */}
      <FlowSection id="badge" title="Badge">
        <Lead>
          Prop <Hl>badge</Hl> menyisipkan elemen label status di bawah baris metadata dokumen.
          Tata letak vertikal kartu dan wadah ikon otomatis menyesuaikan proporsinya agar tetap seimbang.
        </Lead>

        <div className="space-y-8">
          {/* Sub-bagian 2: Dengan Badge */}
          <div className="space-y-5">

            {/* Desktop M mewakili */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Desktop (Medium)
                </h4>
              </div>
              <Demo>
                <div className="w-full max-w-[514px]">
                  <ListViewItem
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    badge={
                      <Badge
                        variant="success"
                        size="sm"
                        icon={<Clock className="size-3.5" />}
                      >
                        Badge
                      </Badge>
                    }
                    actionLabel="Open"
                  />
                </div>
              </Demo>
            </div>

            {/* Mobile mewakili */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Mobile
                </h4>
              </div>
              <Demo>
                <div className="w-full max-w-[348px]">
                  <ListViewItem
                    platform="mobile"
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    badge={
                      <Badge
                        variant="success"
                        size="sm"
                        icon={<Clock className="size-3.5" />}
                      >
                        Badge
                      </Badge>
                    }
                  />
                </div>
              </Demo>
            </div>
          </div>
        </div>

        <SectionCode>
          {"import { Badge, ListViewItem } from '@ceplok-ui/design-kit-react'\n"}
          {"import { Clock } from '@ceplok-ui/design-kit-react/icons/solid'\n\n"}
          {"{/* 1. Tanpa Badge */}\n"}
          {"<ListViewItem\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* 2. Dengan Badge */}\n"}
          {"<ListViewItem\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"  "}
          <H>badge</H>
          {'={<Badge variant="success" size="sm" icon={<Clock className="size-3.5" />}>Badge</Badge>}\n'}
          {'  actionLabel="Open"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 4. Darkmode Section */}
      <FlowSection id="darkmode" title="Darkmode">
        <Lead>
          Prop <Hl>darkMode</Hl> mengaktifkan tema gelap pada komponen. Warna latar beralih ke <Hl>gray-700</Hl>, teks judul menjadi (<Hl>white</Hl>),
          metadata <Hl>gray-400</Hl>, dan ikon <Hl>gray-200</Hl>. Elemen badge menyesuaikan bawaan komponen <Hl>Badge</Hl>.
        </Lead>

        <div className="space-y-8">
          <div className="space-y-5">
            {/* Desktop mewakili */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Desktop
                </h4>
              </div>
              <Demo dark>
                <div className="w-full max-w-[514px]">
                  <ListViewItem
                    darkMode
                    decoration
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    badge={
                      <Badge
                        variant="success"
                        size="sm"
                        icon={<Clock className="size-3.5" />}
                        darkMode
                      >
                        Badge
                      </Badge>
                    }
                    actionLabel="Open"
                  />
                </div>
              </Demo>
            </div>

            {/* Mobile mewakili */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Mobile
                </h4>
              </div>
              <Demo dark>
                <div className="w-full max-w-[348px]">
                  <ListViewItem
                    platform="mobile"
                    darkMode
                    decoration
                    title="Project brief"
                    metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                    badge={
                      <Badge
                        variant="success"
                        size="sm"
                        icon={<Clock className="size-3.5" />}
                        darkMode
                      >
                        Badge
                      </Badge>
                    }
                  />
                </div>
              </Demo>
            </div>
          </div>
        </div>

        <SectionCode>
          {"import { Badge, ListViewItem } from '@ceplok-ui/design-kit-react'\n"}
          {"import { Clock } from '@ceplok-ui/design-kit-react/icons/solid'\n\n"}
          {"{/* 1. Desktop — Dark Mode dengan Badge + Dekorasi */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>darkMode</H>
          {"\n"}
          {"  "}
          <H>decoration</H>
          {"\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"  "}
          <H>badge</H>
          {'={<Badge variant="success" size="sm" darkMode icon={<Clock className="size-3.5" />}>Badge</Badge>}\n'}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* 2. Mobile — Dark Mode dengan Badge + Dekorasi */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>platform</H>
          {'="mobile"\n'}
          {"  "}
          <H>darkMode</H>
          {"\n"}
          {"  "}
          <H>decoration</H>
          {"\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"  "}
          <H>badge</H>
          {'={<Badge variant="success" size="sm" darkMode icon={<Clock className="size-3.5" />}>Badge</Badge>}\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 5. Playground Section */}
      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Uji coba kombinasi platform (Desktop/Mobile), varian ukuran, garis
          dekorasi, penambahan badge, serta mode tampilan secara interaktif.
        </p>

        <Stage maxWidth="max-w-3xl" dark={darkMode}>
          <div className="flex h-[134px] w-full items-center justify-center">
            <div
              className={`w-full transition-[max-width] duration-300 ease-out ${platform === "mobile"
                ? "max-w-[348px]"
                : size === "s"
                  ? "max-w-[410px]"
                  : size === "l"
                    ? "max-w-[600px]"
                    : "max-w-[514px]"
                }`}
            >
              <ListViewItem
                platform={platform}
                size={size}
                decoration={decoration}
                title="Project brief"
                metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                badge={
                  hasBadge ? (
                    <Badge
                      variant="success"
                      size="sm"
                      icon={<Clock className="size-3.5" />}
                      darkMode={darkMode}
                    >
                      Badge
                    </Badge>
                  ) : undefined
                }
                actionLabel={platform !== "mobile" ? "Open" : undefined}
                onAction={
                  platform !== "mobile"
                    ? () => alert("Open diklik!")
                    : undefined
                }
                darkMode={darkMode}
              />
            </div>
          </div>
        </Stage>

        <Controls>
          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={(val) => setPlatform(val as ListViewPlatform)}
              options={platformOptions}
            />
          </Control>

          <Control label="Size">
            <Segmented
              label="Pilih varian ukuran"
              value={size}
              onChange={(val) => setSize(val as ListViewSize)}
              options={sizeOptions}
              disabled={platform === "mobile"}
            />
          </Control>

          <Control label="Decoration">
            <Segmented
              label="Pilih dekorasi garis aksen"
              value={decoration}
              onChange={(val) => setDecoration(Boolean(val))}
              options={decorationOptions}
            />
          </Control>

          <Control label="Badge">
            <Segmented
              label="Pilih status badge"
              value={hasBadge}
              onChange={(val) => setHasBadge(Boolean(val))}
              options={badgeOptions}
            />
          </Control>

          <Control label="Dark Mode">
            <Segmented
              label="Pilih mode tampilan"
              value={darkMode}
              onChange={(val) => setDarkMode(Boolean(val))}
              options={[
                { value: false, label: "Light" },
                { value: true, label: "Dark" },
              ]}
            />
          </Control>
        </Controls>
      </FlowSection>

      {/* 6. Penggunaan Section */}
      <FlowSection id="penggunaan" title="Penggunaan">
        <p className="mb-6 text-body-sm text-gray-500">
          Kode di bawah ini otomatis mengikuti kombinasi opsi yang dipilih pada
          Playground dan siap disalin ke aplikasi.
        </p>

        <SectionCode flush>
          {"import { Badge, ListViewItem } from '@ceplok-ui/design-kit-react'\n"}
          {hasBadge &&
            "import { Clock } from '@ceplok-ui/design-kit-react/icons/solid'\n"}
          {"\n"}
          {"<ListViewItem\n"}
          {platform === "mobile" ? (
            <>
              {"  "}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          ) : (
            size !== "m" && (
              <>
                {"  "}
                <H>size</H>
                {`="${size}"\n`}
              </>
            )
          )}
          {decoration && (
            <>
              {"  "}
              <H>decoration</H>
              {"\n"}
            </>
          )}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {hasBadge && (
            <>
              {"  "}
              <H>badge</H>
              {'={<Badge variant="success" size="sm" icon={<Clock className="size-3.5" />}>Badge</Badge>}\n'}
            </>
          )}
          {platform !== "mobile" && (
            <>
              {'  actionLabel="Open"\n'}
              {"  onAction={() => console.log('Open clicked')}\n"}
            </>
          )}
          {darkMode && (
            <>
              {"  "}
              <H>darkMode</H>
              {"\n"}
            </>
          )}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 7. Properties Section */}
      <FlowSection id="properties" title="Properties">
        <p className="mb-6 text-body-sm text-gray-500">
          Referensi lengkap prop yang didukung oleh komponen <Hl>ListViewItem</Hl>{" "}
          dan kontainer pembungkus <Hl>ListView</Hl>.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">
              ListViewItem Props
            </h3>
            <PropsTable rows={listViewItemProps} minWidth="46rem" />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">
              ListView (Container) Props
            </h3>
            <PropsTable rows={listViewContainerProps} minWidth="46rem" />
          </div>
        </div>
      </FlowSection>
    </UsulanPage>
  );
}
