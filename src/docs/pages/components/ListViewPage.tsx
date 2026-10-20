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
  { value: "default", label: "Default" },
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
    "'default' | 'mobile'",
    "'default'",
    "Platform tampilan kartu: 'default' (desktop) atau 'mobile' (tampilan ringkas 58px / 88px dengan badge).",
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
    "'default' | 'mobile'",
    "'default'",
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
    "'default'",
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
  { id: "mobile", label: "Mobile" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

export function ListViewPage() {
  const [platform, setPlatform] = useState<ListViewPlatform>("default");
  const [size, setSize] = useState<ListViewSize>("m");
  const [decoration, setDecoration] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <UsulanPage
      eyebrow="Components · ListView"
      title="ListView"
      description="Komponen kartu daftar vertikal untuk menampilkan ringkasan berkas, lampiran, dokumen, atau item data lengkap dengan ikon, judul, metadata, dan aksi cepat."
      toc={toc}
    >
      {/* 1. Variant Section */}
      <FlowSection id="variant" title="Variant">
        <Lead>
          Tersedia dalam 3 variasi ukuran: <Hl>S</Hl> (Small), <Hl>M</Hl>{" "}
          (Medium/Default), dan <Hl>L</Hl> (Large). Masing-masing varian
          menyesuaikan dimensi wadah ikon, kerapatan padding, tipografi judul,
          serta proporsi tombol aksi di sisi kanan.
        </Lead>

        <div className="space-y-6">
          {/* Variant S */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Small (S)</h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                size=&quot;s&quot;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Ukuran ringkas dengan wadah ikon 36×36 px dan tombol aksi berukuran
              XS. Ideal untuk widget samping, modal sempit, atau daftar padat.
            </p>
            <Demo>
              <div className="w-full max-w-xl">
                <ListViewItem
                  size="s"
                  title="Project brief"
                  metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                  actionLabel="Open"
                />
              </div>
            </Demo>
          </div>

          {/* Variant M */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Medium (M) · Default
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                size=&quot;m&quot;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Ukuran standar bawaan dengan wadah ikon 44×44 px / 48×48 px dan
              tombol aksi berukuran S. Cocok untuk sebagian besar kebutuhan daftar
              berkas dan lampiran dokumen.
            </p>
            <Demo>
              <div className="w-full max-w-xl">
                <ListViewItem
                  size="m"
                  title="Project brief"
                  metadata={["PDF", "2.4 MB", "Updated Oct 10, 2026"]}
                  actionLabel="Open"
                />
              </div>
            </Demo>
          </div>

          {/* Variant L */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Large (L)</h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                size=&quot;l&quot;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Ukuran lapang dengan wadah ikon 52×52 px / 56×56 px, tipografi
              lebih tegas, dan tombol aksi ukuran Base. Ideal untuk item sorotan
              utama atau area interaksi sentuh.
            </p>
            <Demo>
              <div className="w-full max-w-xl">
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

        <SectionCode>
          {"import { ListViewItem } from '@ceplok-ui/design-kit-react'\n\n"}
          {"{/* Variant S (Small) */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>size</H>
          {'="s"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* Variant M (Medium / Default) */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>size</H>
          {'="m"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>\n\n"}
          {"{/* Variant L (Large) */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>size</H>
          {'="l"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {'  actionLabel="Open"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 2. Mobile Section */}
      <FlowSection id="mobile" title="Mobile">
        <Lead>
          Tampilan khusus mobile (<Hl>platform=&quot;mobile&quot;</Hl>) berukuran
          ringkas untuk layar sempit (lebar kartu 348–380 px). Mendukung variasi{" "}
          <Hl>decoration</Hl> (garis aksen vertikal di sisi kiri) serta tambahan{" "}
          <Hl>badge</Hl> status di bawah baris metadata.
        </Lead>

        <div className="space-y-6">
          {/* Mobile tanpa dekorasi */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                1. Tanpa Dekorasi
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                decoration=&#123;false&#125;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Kartu berkas mobile bersih dengan tinggi 58px tanpa garis aksen.
            </p>
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

          {/* Mobile dengan dekorasi */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                2. Dengan Dekorasi
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                decoration=&#123;true&#125;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Menampilkan garis aksen vertikal warna primary di sisi kiri kartu
              untuk penekanan visual status atau tipe dokumen.
            </p>
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

          {/* Mobile tanpa dekorasi + Badge */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                3. Tanpa Dekorasi + Badge
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                badge + decoration=&#123;false&#125;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Kartu berkas mobile dengan tambahan badge status hijau di bawah
              metadata dokumen.
            </p>
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

          {/* Mobile dengan dekorasi + Badge */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                4. Dengan Dekorasi + Badge
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                badge + decoration=&#123;true&#125;
              </span>
            </div>
            <p className="mb-3 text-body-sm text-gray-500">
              Kombinasi garis aksen vertikal di sisi kiri dan badge status di
              bawah metadata dokumen.
            </p>
            <Demo>
              <div className="w-full max-w-[348px]">
                <ListViewItem
                  platform="mobile"
                  decoration
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

        <SectionCode>
          {"import { Badge, ListViewItem } from '@ceplok-ui/design-kit-react'\n"}
          {"import { Clock } from '@ceplok-ui/design-kit-react/icons/solid'\n\n"}
          {"{/* 1. Mobile — Tanpa Dekorasi */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>platform</H>
          {'="mobile"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"/>\n\n"}
          {"{/* 2. Mobile — Dengan Dekorasi */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>platform</H>
          {'="mobile"\n'}
          {"  "}
          <H>decoration</H>
          {"\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"/>\n\n"}
          {"{/* 3. Mobile — Tanpa Dekorasi + Badge */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>platform</H>
          {'="mobile"\n'}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"  "}
          <H>badge</H>
          {'={<Badge variant="success" size="sm" icon={<Clock className="size-3.5" />}>Badge</Badge>}\n'}
          {"/>\n\n"}
          {"{/* 4. Mobile — Dengan Dekorasi + Badge */}\n"}
          {"<ListViewItem\n"}
          {"  "}
          <H>platform</H>
          {'="mobile"\n'}
          {"  "}
          <H>decoration</H>
          {"\n"}
          {'  title="Project brief"\n'}
          {"  metadata={['PDF', '2.4 MB', 'Updated Oct 10, 2026']}\n"}
          {"  "}
          <H>badge</H>
          {'={<Badge variant="success" size="sm" icon={<Clock className="size-3.5" />}>Badge</Badge>}\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      {/* 3. Playground Section */}
      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Uji coba kombinasi platform (Default/Mobile), varian ukuran, garis
          dekorasi, penambahan badge, serta mode tampilan secara interaktif.
        </p>

        <Stage maxWidth={platform === "mobile" ? "max-w-[380px]" : "max-w-2xl"}>
          <div
            className={`w-full transition-colors duration-200 ${
              darkMode ? "rounded-2xl bg-gray-900 p-6" : "p-2"
            }`}
          >
            <div
              className={
                platform === "mobile" ? "mx-auto w-full max-w-[348px]" : "w-full"
              }
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
                    >
                      Badge
                    </Badge>
                  ) : undefined
                }
                actionLabel={platform === "default" ? "Open" : undefined}
                onAction={
                  platform === "default"
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

          {platform === "default" && (
            <Control label="Size">
              <Segmented
                label="Pilih varian ukuran"
                value={size}
                onChange={(val) => setSize(val as ListViewSize)}
                options={sizeOptions}
              />
            </Control>
          )}

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

      {/* 4. Penggunaan Section */}
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
          {platform === "default" && (
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

      {/* 5. Properties Section */}
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
