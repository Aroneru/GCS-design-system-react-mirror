import { useState } from "react";
import { Messages } from "flowbite-react-icons/outline";
import { Button, type ButtonTheme, type ButtonVariant } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from "../../pageKit";

const sizes = ["xs", "s", "base", "l", "xl"] as const;
type ButtonSize = (typeof sizes)[number];

const variantOptions: { value: ButtonVariant; label: string }[] = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
];

const sizeOptions = sizes.map((size) => ({ value: size, label: size.toUpperCase() }));

const themeOptions: { value: ButtonTheme; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "green", label: "Green" },
  { value: "gray", label: "Gray" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
];

const iconOnlyOptions = [
  { value: false, label: "Button" },
  { value: true, label: "Icon Only" },
];

const buttonProps: PropRow[] = [
  ["variant", '"filled" | "outline"', "filled", "Gaya utama tombol: solid atau outline."],
  ["size", '"xs" | "s" | "base" | "l" | "xl"', "base", "Menentukan ukuran tombol."],
  ["theme", "ButtonTheme", "primary", "Warna aksen tombol."],
  ["tone", '"light" | "dark"', "light", "Menyetel kontras warna untuk variant atau theme."],
  ["leftIcon", "ReactNode", "undefined", "Ikon di sisi kiri tombol."],
  ["rightIcon", "ReactNode", "undefined", "Ikon di sisi kanan tombol."],
  ["iconOnly", "boolean", "false", "Menyembunyikan label dan menampilkan ikon saja."],
  ["as", '"button" | "a"', "button", "Menentukan elemen yang dirender. Bisa jadi anchor."],
  ["disabled", "boolean", "false", "Menonaktifkan interaksi."],
  ["…props", "ButtonHTMLAttributes", "—", "Seluruh atribut button atau anchor yang valid."],
];

export function ButtonPage() {
  const [selectedSize, setSelectedSize] = useState<ButtonSize>("base");
  const [variant, setVariant] = useState<ButtonVariant>("filled");
  const [theme, setTheme] = useState<ButtonTheme>("primary");
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [iconOnly, setIconOnly] = useState(false);
  const [showLeftIcon, setShowLeftIcon] = useState(true);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const [asLink, setAsLink] = useState<"button" | "a">("button");

  const buttonCode = `<Button
  as="${asLink}"
  size="${selectedSize}"
  variant="${variant}"
  theme="${theme}"
  tone="${tone}"${
    showLeftIcon
      ? `
  leftIcon={<Messages />}`
      : ""
  }${
    showRightIcon
      ? `
  rightIcon={<Messages />}`
      : ""
  }${
    asLink === "a"
      ? `
  href="/foundations/colors"`
      : ""
  }
>
  Button
</Button>`;

  return (
    <ComponentPage
      eyebrow="Components · Button"
      title="Button"
      description="Tombol untuk memicu aksi utama pada sebuah halaman atau form. Mendukung berbagai ukuran, warna, varian, dan penggunaan icon."
    >
      <Section title="Button & Sizes">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Ukuran mengikuti sistem token, sementara ikon kiri dan kanan bisa ditambahkan sesuai
          kebutuhan tindakan.
        </p>

        <div className="flex flex-wrap items-start justify-start gap-6">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Button
                size={size}
                variant="filled"
                theme="primary"
                tone="light"
                leftIcon={<Messages className="size-4" />}
                rightIcon={<Messages className="size-4" />}
              >
                Button
              </Button>

              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {size}
              </span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Icon Only & Sizes">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Untuk aksi yang ringkas seperti toolbar, menu, atau quick action, tombol bisa dirender
          tanpa label.
        </p>

        <div className="flex flex-wrap items-start justify-start gap-6">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Button
                size={size}
                variant="filled"
                theme="primary"
                tone="light"
                iconOnly
                aria-label={`Icon ${size}`}
              >
                <Messages className="size-4" />
              </Button>

              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {size}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Variants">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Varian <H>filled</H> digunakan untuk aksi utama, sedangkan varian <H>outline</H> lebih
          sesuai untuk aksi tambahan.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Filled">
            <Button variant="filled" theme="primary" tone="light">
              Simpan perubahan
            </Button>
          </Demo>

          <Demo label="Outline">
            <Button variant="outline" theme="primary" tone="light">
              Lihat detail
            </Button>
          </Demo>
        </div>
      </Section>
      <Section title="Colors">
        <p className="mb-6 max-w-2xl text-body-sm text-gray-500">
          Warna Button digunakan untuk membedakan konteks dan tingkat kepentingan suatu tindakan.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Button
              variant="filled"
              theme="primary"
              tone="light"
              leftIcon={<Messages className="size-4" />}
            >
              Button
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Primary</H> digunakan untuk tindakan utama atau aksi yang paling penting dalam
              suatu halaman.
            </p>
          </div>

          <div>
            <Button
              variant="filled"
              theme="green"
              tone="light"
              leftIcon={<Messages className="size-4" />}
            >
              Button
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Green</H> digunakan untuk tindakan yang menunjukkan keberhasilan, konfirmasi, atau
              penyelesaian.
            </p>
          </div>

          <div>
            <Button
              variant="filled"
              theme="gray"
              tone="light"
              leftIcon={<Messages className="size-4" />}
            >
              Button
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Gray</H> digunakan untuk tindakan sekunder atau aksi dengan tingkat prioritas
              rendah.
            </p>
          </div>

          <div>
            <Button
              variant="filled"
              theme="purple"
              tone="light"
              leftIcon={<Messages className="size-4" />}
            >
              Button
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Purple</H> digunakan untuk tindakan atau fitur khusus yang membutuhkan penekanan
              visual berbeda.
            </p>
          </div>

          <div>
            <Button
              variant="filled"
              theme="orange"
              tone="light"
              leftIcon={<Messages className="size-4" />}
            >
              Button
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Orange</H> digunakan untuk tindakan yang membutuhkan perhatian atau bersifat
              peringatan.
            </p>
          </div>

          <div>
            <Button
              variant="filled"
              theme="yellow"
              tone="light"
              leftIcon={<Messages className="size-4" />}
            >
              Button
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Yellow</H> digunakan untuk informasi yang perlu diperhatikan tanpa menunjukkan
              kondisi kritis.
            </p>
          </div>
        </div>
      </Section>
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div className="mx-auto flex min-h-[180px] items-center justify-center">
            <Button
              iconOnly={iconOnly}
              as={asLink}
              href={asLink === "a" ? "/foundations/colors" : undefined}
              size={selectedSize}
              variant={variant}
              theme={theme}
              tone={tone}
              leftIcon={showLeftIcon ? <Messages className="size-4" /> : undefined}
              rightIcon={showRightIcon ? <Messages className="size-4" /> : undefined}
            >
              {iconOnly ? <Messages className="size-4" /> : "Button"}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div>
            <ControlLabel>Type</ControlLabel>

            <div className="mt-2">
              <Segmented
                label="Pilih type"
                value={iconOnly ? "iconOnly" : "button"}
                onChange={(value) => setIconOnly(value === "iconOnly")}
                options={[
                  { value: "button", label: "Button" },
                  { value: "iconOnly", label: "Icon Only" },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Variant</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih variant"
                value={variant}
                onChange={setVariant}
                options={variantOptions}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Theme</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih theme"
                value={theme}
                onChange={setTheme}
                options={themeOptions}
                wrap
              />
            </div>
          </div>

          <div>
            <ControlLabel>Size</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih ukuran"
                value={selectedSize}
                onChange={setSelectedSize}
                options={sizeOptions}
                wrap
              />
            </div>
          </div>

          <div>
            <ControlLabel>Tone</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih tone"
                value={tone}
                onChange={(value) => setTone(value as "light" | "dark")}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Icons</ControlLabel>

            <div className="mt-2">
              <Segmented
                label="Pilih posisi icon"
                value={
                  iconOnly
                    ? "none"
                    : showLeftIcon && showRightIcon
                      ? "both"
                      : showLeftIcon
                        ? "left"
                        : showRightIcon
                          ? "right"
                          : "none"
                }
                onChange={(value) => {
                  if (iconOnly) return;

                  setShowLeftIcon(value === "left" || value === "both");
                  setShowRightIcon(value === "right" || value === "both");
                }}
                options={[
                  { value: "none", label: "None" },
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                  { value: "both", label: "Both" },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Render</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih render"
                value={asLink}
                onChange={(value) => setAsLink(value as "button" | "a")}
                options={[
                  { value: "button", label: "Button" },
                  { value: "a", label: "Link" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
      <Section title="Penggunaan">
        <CodeBlock>
          {`import { Button } from '@tpl/design-kit-react'
import { Messages } from '@tpl/design-kit-react/icons/solid'

<Button
  as="${asLink}"
  variant="${variant}"
  theme="${theme}"
  tone="${tone}"
  size="${selectedSize}"${showLeftIcon ? '\n  leftIcon={<Messages className="size-4" />}' : ""}${showRightIcon ? '\n  rightIcon={<Messages className="size-4" />}' : ""}
>
  Button
</Button>`}
        </CodeBlock>
      </Section>
      <Section title="Properties">
        <PropsTable rows={buttonProps} minWidth="46rem" />
      </Section>
    </ComponentPage>
  );
}
