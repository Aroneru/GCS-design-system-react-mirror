import { useState } from "react";
import { Home } from "flowbite-react-icons/solid";
import { Breadcrumb, type BreadcrumbSize } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { Demo, H, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

type BackgroundOption = "with" | "without";

const sizeOptions = [
  { value: "sm", label: "12px" },
  { value: "base", label: "14px" },
];

const backgroundOptions = [
  { value: "with", label: "Ada" },
  { value: "without", label: "Tanpa" },
];

const menuOptions = [
  { value: "2", label: "1" },
  { value: "3", label: "2" },
  { value: "4", label: "3" },
  { value: "5", label: "4" },
];

const breadcrumbProps: PropRow[] = [
  ["items", "BreadcrumbItem[]", "—", "Daftar item yang ditampilkan pada Breadcrumb."],
  [
    "size",
    '"sm" | "base"',
    "base",
    "Menentukan ukuran teks Breadcrumb. sm = 12px dan base = 14px.",
  ],
  ["background", '"bg" | "none"', "none", "Menentukan apakah Breadcrumb menggunakan background."],
];

const toc: TocEntry[] = [
  // { id: "breadcrumb", label: "Breadcrumb" },
  { id: "sizes", label: "Sizes" },
  { id: "variants", label: "Variants" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

const allItems = [
  {
    label: "Home",
    href: "#",
    icon: <Home className="size-4" />,
  },
  { label: "Menu 1", href: "#" },
  { label: "Menu 2", href: "#" },
  { label: "Menu 3", href: "#" },
  { label: "Menu 4" },
];

export function BreadcrumbPage() {
  const [size, setSize] = useState<BreadcrumbSize>("base");
  const [background, setBackground] = useState<BackgroundOption>("without");
  const [menuCount, setMenuCount] = useState("3");

  const items = allItems.slice(0, Number(menuCount));

  return (
    <UsulanPage
      eyebrow="Components · Breadcrumb"
      title="Breadcrumb"
      description="Menampilkan posisi halaman saat ini dalam struktur navigasi dan membantu pengguna berpindah ke halaman sebelumnya."
      toc={toc}
    >
      <FlowSection id="sizes" title="Sizes">
        <p className="mb-6 text-body-sm text-gray-500">
          Breadcrumb tersedia dalam dua ukuran untuk menyesuaikan kebutuhan hierarki dan kepadatan
          informasi pada layout.
        </p>

        <div className="mb-4 grid gap-5 sm:grid-cols-2">
          <Demo label="sm">
            <div>
              <Breadcrumb items={allItems.slice(0, 3)} size="sm" background="none" />
            </div>
          </Demo>

          <Demo label="base - 14 px">
            <Breadcrumb items={allItems.slice(0, 3)} size="base" background="none" />
          </Demo>
        </div>

        <SectionCode>
          {"const items = [\n"}
          {'    { label: "Home", href: "#" },\n'}
          {'    { label: "Menu 1", href: "#" },\n'}
          {'    { label: "Menu 2", href: "#" },\n'}
          {"]\n\n"}
          {"<Breadcrumb\n"}
          {"    items={items}\n"}
          {"    "}
          <H>size</H>
          {'="base"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="variants" title="Variants">
        <p className="mb-6 text-body-sm text-gray-500">
          Breadcrumb dapat digunakan dengan atau tanpa background. Background digunakan ketika
          Breadcrumb perlu memiliki area visual tersendiri dari konten halaman.
        </p>

        <div className="mb-4 grid gap-5 sm:grid-cols-2">
          <Demo label="Tanpa Backgorund">
            <Breadcrumb items={allItems.slice(0, 3)} size="base" background="none" />
          </Demo>

          <Demo label="Dengan Background">
            <Breadcrumb items={allItems.slice(0, 3)} size="base" background="bg" />
          </Demo>
        </div>

        <SectionCode>
          {"const items = [\n"}
          {'    { label: "Home", href: "#" },\n'}
          {'    { label: "Menu 1", href: "#" },\n'}
          {'    { label: "Menu 2", href: "#" },\n'}
          {"]\n\n"}
          {"/*Tanpa background*/\n"}
          {"<Breadcrumb\n"}
          {"    items={items}\n"}
          {"    "}
          <H>background</H>
          {'="none"\n'}
          {"/>"}
          {"\n\n"}
          {"/*Dengan background*/\n"}
          {"<Breadcrumb\n"}
          {"    items={items}\n"}
          {"    "}
          <H>background</H>
          {'="bg"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Coba konfigurasi Breadcrumb secara langsung melalui kontrol di bawah ini. Anda dapat
          mengubah ukuran, background, dan jumlah menu.
        </p>

        <Stage maxWidth="max-w-[700px]">
          <div className="flex min-h-[160px] items-center justify-center">
            <Breadcrumb
              items={items}
              size={size}
              background={background === "with" ? "bg" : "none"}
            />
          </div>
        </Stage>

        <Controls>
          {/* SIZE */}

          <Control label="Size">
            <Segmented
              label="Pilih ukuran"
              value={size}
              onChange={(value) => setSize(value as BreadcrumbSize)}
              options={sizeOptions}
            />
          </Control>

          {/* BACKGROUND */}

          <Control label="Background">
            <Segmented
              label="Pilih background"
              value={background}
              onChange={(value) => setBackground(value as BackgroundOption)}
              options={backgroundOptions}
            />
          </Control>

          {/* MENU */}

          <Control label="Jumlah Menu">
            <Segmented
              label="Pilih jumlah menu"
              value={menuCount}
              onChange={setMenuCount}
              options={menuOptions}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <p className="mb-6 text-body-sm text-gray-500">
          Bagian ini menampilkan contoh kode penggunaan Breadcrumb berdasarkan konfigurasi yang
          dipilih pada Playground.
        </p>

        <SectionCode flush>
          {"import { Breadcrumb } from '@tpl/design-kit-react'\n"}
          {"\n"}
          {"const items = [\n"}

          {items.map((item, index) => (
            <span key={item.label}>
              {`    { label: "${item.label}"${item.href ? `, href: "${item.href}"` : ""} },\n`}
            </span>
          ))}

          {"]\n"}
          {"\n"}
          {"<Breadcrumb\n"}

          <>
            {"    "}
            <H>items</H>
            {"={items}\n"}
          </>

          <>
            {"    "}
            <H>size</H>
            {`="${size}"\n`}
          </>

          <>
            {"    "}
            <H>background</H>
            {`="${background === "with" ? "bg" : "none"}"\n`}
          </>

          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <p className="mb-6 text-body-sm text-gray-500">
          Referensi semua prop yang tersedia pada komponen Breadcrumb.
        </p>

        <PropsTable rows={breadcrumbProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
