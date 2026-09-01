import { useState } from "react";
import { Messages } from "../../../lib/icons/solid";
import { Button, type ButtonTheme, type ButtonVariant } from "../../../lib";
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

const typeOptions = [
  { value: "button", label: "Button" },
  { value: "iconOnly", label: "Icon Only" },
];

const buttonProps: PropRow[] = [
  ["as", '"button" | "a"', "button", "Menentukan elemen yang dirender. Bisa jadi anchor."],
  ["type", '"button" | "iconOnly"', "button", "Menentukan tipe tombol."],
  ["size", '"xs" | "s" | "base" | "l" | "xl"', "base", "Menentukan ukuran tombol."],
  ["variant", '"filled" | "outline"', "filled", "Gaya utama tombol: solid atau outline."],
  ["tone", '"light" | "dark"', "light", "Menyetel kontras warna untuk variant atau theme."],
  ["leftIcon", "ReactNode", "undefined", "Ikon di sisi kiri tombol."],
  ["rightIcon", "ReactNode", "undefined", "Ikon di sisi kanan tombol."],
  ["theme", "ButtonTheme", "primary", "Warna aksen tombol."],
];

const toc: TocEntry[] = [
  { id: "button", label: "Button & Sizes" },
  { id: "icon-only", label: "Icon Only & Sizes" },
  { id: "variants", label: "Variants" },
  { id: "themes", label: "Themes" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

export function ButtonPage() {
  const [selectedSize, setSelectedSize] = useState<ButtonSize>("base");
  const [variant, setVariant] = useState<ButtonVariant>("filled");
  const [theme, setTheme] = useState<ButtonTheme>("primary");
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [type, setType] = useState<"button" | "iconOnly">("button");
  const [showLeftIcon, setShowLeftIcon] = useState(true);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const [asLink, setAsLink] = useState<"button" | "a">("button");

  return (
    <UsulanPage
      eyebrow="Components · Button"
      title="Button"
      description="Tombol untuk memicu aksi utama pada sebuah halaman atau form. Mendukung berbagai ukuran, warna, varian, dan penggunaan icon."
      toc={toc}
    >
      <FlowSection id="button" title="Button & Sizes">
        <p className="mb-4 text-body-sm text-gray-500">
          Tombol default dalam berbagai ukuran untuk membantu memilih <H>size</H> yang sesuai dengan
          ruang layout. Tombol ditampilkan menggunakan ikon untuk memberikan gambaran untuk tombol
          dengan ikon saat dipakai sebagai aksi utama.
        </p>

        <div className="mb-4 flex flex-wrap items-start justify-start gap-6">
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
        <SectionCode>
          {"<Button\n"}
          {"    "}
          <H>type</H>
          {'="button"\n'}
          {"    "}
          <H>size</H>
          {'="base"\n'}
          {'    leftIcon={<Messages className="size-3.5" />}\n'}
          {'    rightIcon={<Messages className="size-3.5" />}\n'}
          {"    >\n"}
          {"    Button\n"}
          {"</Button>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="icon-only" title="Icon Only & Sizes">
        <p className="mb-4 text-body-sm text-gray-500">
          Versi ringkas untuk aksi cepat seperti toolbar, floating action, menu, atau shortcut.
          Tersedia dengan beberapa ukuran dan digunakan saat label tidak diperlukan atau ruang
          layout yang sempit.
        </p>

        <div className="mb-4 flex flex-wrap items-start justify-start gap-6">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Button
                size={size}
                variant="filled"
                theme="primary"
                tone="light"
                type="iconOnly"
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
        <SectionCode>
          {"<Button\n"}
          {"    "}
          <H>type</H>
          {'="iconOnly"\n'}
          {"    "}
          <H>size</H>
          {'="base"\n'}
          {"    >\n"}
          {'    <Messages className="size-4" />\n'}
          {"</Button>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="variants" title="Variants">
        <p className="mb-4 text-body-sm text-gray-500">
          Variasi tombol yang itentukan oleh <H>variant</H>. Gunakan <H>filled</H> untuk aksi utama
          yang perlu mendapat perhatian lebih, dan <H>outline</H> untuk tindakan pendukung yang
          tetap terlihat, namun tidak terlalu dominan.
        </p>

        <div className="mb-4 grid gap-5 sm:grid-cols-2">
          <Demo label="Filled">
            <Button variant="filled" theme="primary" tone="light">
              Simpan Perubahan
            </Button>
          </Demo>

          <Demo label="Outline">
            <Button variant="outline" theme="primary" tone="light">
              Lihat Detail
            </Button>
          </Demo>
        </div>
        <SectionCode>
          {"<Button\n"}
          {'    type="button"\n'}
          {'    size="base"\n'}
          {"    "}
          <H>variant</H>
          {'="outline"\n'}
          {"    >\n"}
          {"    Lihat Detail\n"}
          {"</Button>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="themes" title="Themes">
        <p className="mb-6 text-body-sm text-gray-500">
          Tema digunakan untuk membedakan konteks dan tingkat prioritas suatu aksi.
        </p>

        <div className="mb-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Button variant="filled" theme="primary" tone="light">
              Primary
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Primary</H> digunakan untuk tindakan utama atau aksi yang paling penting dalam
              suatu halaman.
            </p>
          </div>

          <div>
            <Button variant="filled" theme="green" tone="light">
              Green
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Green</H> digunakan untuk tindakan yang menunjukkan keberhasilan, konfirmasi, atau
              penyelesaian.
            </p>
          </div>

          <div>
            <Button variant="filled" theme="gray" tone="light">
              Gray
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Gray</H> digunakan untuk tindakan sekunder atau aksi dengan tingkat prioritas
              rendah.
            </p>
          </div>

          <div>
            <Button variant="filled" theme="purple" tone="light">
              Purple
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Purple</H> digunakan untuk tindakan atau fitur khusus yang membutuhkan penekanan
              visual berbeda.
            </p>
          </div>

          <div>
            <Button variant="filled" theme="orange" tone="light">
              Orange
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Orange</H> digunakan untuk tindakan yang membutuhkan perhatian atau bersifat
              peringatan.
            </p>
          </div>

          <div>
            <Button variant="filled" theme="yellow" tone="light">
              Yellow
            </Button>

            <p className="mt-3 text-sm text-gray-600">
              <H>Yellow</H> digunakan untuk informasi yang perlu diperhatikan tanpa menunjukkan
              kondisi kritis.
            </p>
          </div>
        </div>
        <SectionCode>
          {"<Button\n"}
          {'    type="button"\n'}
          {'    variant="filled"\n'}
          {"    "}
          <H>theme</H>
          {'="green"\n'}
          {"    "}
          <H>tone</H>
          {'="light"\n'}
          {"    >\n"}
          {"    Green\n"}
          {"</Button>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Memungkinkan Anda mencoba kombinasi prop secara langsung untuk membantu menyesuaikan
          tombol dengan kebutuhan aplikasi Anda sebelum diimplementasikan.
        </p>

        <Stage maxWidth="max-w-[380px]">
          <div className="mx-auto flex min-h-[180px] items-center justify-center">
            <Button
              type={type === "iconOnly" ? "iconOnly" : "button"}
              as={asLink}
              href={asLink === "a" ? "/foundations/colors" : undefined}
              size={selectedSize}
              variant={variant}
              theme={theme}
              tone={tone}
              leftIcon={showLeftIcon ? <Messages className="size-4" /> : undefined}
              rightIcon={showRightIcon ? <Messages className="size-4" /> : undefined}
            >
              {type === "iconOnly" ? <Messages className="size-4" /> : "Button"}
            </Button>
          </div>
        </Stage>

        <Controls>
          <Control label="As">
            <Segmented
              label="Pilih render"
              value={asLink}
              onChange={(value) => setAsLink(value as "button" | "a")}
              options={[
                { value: "button", label: "Button" },
                { value: "a", label: "Link" },
              ]}
            />
          </Control>

          <Control label="Type">
            <Segmented
              label="Pilih type"
              value={type}
              onChange={(value) => {
                const newType = value as "button" | "iconOnly";

                setType(newType);

                if (newType === "iconOnly") {
                  setShowLeftIcon(false);
                  setShowRightIcon(false);
                }
              }}
              options={typeOptions}
            />
          </Control>

          <Control label="Size">
            <Segmented
              label="Pilih ukuran"
              value={selectedSize}
              onChange={setSelectedSize}
              options={sizeOptions}
              wrap
            />
          </Control>

          <Control label="Variant">
            <Segmented
              label="Pilih variant"
              value={variant}
              onChange={setVariant}
              options={variantOptions}
            />
          </Control>

          <Control label="Tone">
            <Segmented
              label="Pilih tone"
              value={tone}
              onChange={(value) => setTone(value as "light" | "dark")}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </Control>

          <Control label="Icons">
            <Segmented
              label="Pilih posisi ikon"
              value={
                type === "iconOnly"
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
                if (type === "iconOnly") return;

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
          </Control>

          <Control label="Theme">
            <Segmented
              label="Pilih theme"
              value={theme}
              onChange={setTheme}
              options={themeOptions}
              wrap
              itemClassName="basis-1/3 justify-center"
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <p className="mb-6 text-body-sm text-gray-500">
          Bagian ini menampilkan kode setelah Anda menggunakan Playground untuk kombinasi prop. Kode
          yang tampil di sini adalah kode yang siap diimplementasikan ke aplikasi.
        </p>
        <SectionCode flush>
          {"import { Button } from '@stasi/design-kit-react'\n"}
          {"import { Messages } from '@stasi/design-kit-react/icons/solid'\n"}
          {"\n"}
          {"<Button\n"}

          <>
            {"    "}
            <H>as</H>
            {`="${asLink}"\n`}
          </>

          <>
            {"    "}
            <H>type</H>
            {`="${type}"\n`}
          </>

          <>
            {"    "}
            <H>variant</H>
            {`="${variant}"\n`}
          </>

          <>
            {"    "}
            <H>theme</H>
            {`="${theme}"\n`}
          </>

          <>
            {"    "}
            <H>tone</H>
            {`="${tone}"\n`}
          </>

          <>
            {"    "}
            <H>size</H>
            {`="${selectedSize}"\n`}
          </>

          {showLeftIcon && type !== "iconOnly" && (
            <>
              {"    "}
              <H>leftIcon</H>
              {'={<Messages className="size-4" />}\n'}
            </>
          )}

          {showRightIcon && type !== "iconOnly" && (
            <>
              {"    "}
              <H>rightIcon</H>
              {'={<Messages className="size-4" />}\n'}
            </>
          )}

          {"    >\n"}

          {type === "iconOnly" ? (
            <>
              {"    "}
              {'<Messages className="size-4" />\n'}
            </>
          ) : (
            "    Button\n"
          )}

          {"</Button>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <p className="mb-6 text-body-sm text-gray-500">
          Referensi semua prop yang tersedia. Digunakan untuk bisa memahami cara kerja komponen
          tanpa harus menebak implementasinya dari kode.
        </p>

        <PropsTable rows={buttonProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
