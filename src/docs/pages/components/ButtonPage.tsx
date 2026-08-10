import { useState } from "react";
import { Messages } from "flowbite-react-icons/outline";
import { Button, Radio, Checkbox, type ButtonTheme, type ButtonVariant, cn } from "../../../lib";
import { DocHero } from "../../DocHero";
import { DocUsage } from "../../DocUsage";

export function ButtonPage() {
  const sizes = ["xs", "s", "base", "l", "xl"] as const;
  type ButtonSize = (typeof sizes)[number];

  const [selectedSize, setSelectedSize] = useState<ButtonSize>("base");
  const [selectedIconSize, setSelectedIconSize] = useState<ButtonSize>("base");

  const [variant, setVariant] = useState<ButtonVariant>("filled");
  const [theme, setTheme] = useState<ButtonTheme>("primary");
  const [tone, setTone] = useState<"light" | "dark">("light");

  const [showLeftIcon, setShowLeftIcon] = useState(true);
  const [showRightIcon, setShowRightIcon] = useState(true);

  const themes: { value: ButtonTheme; label: string }[] = [
    { value: "primary", label: "Primary" },
    { value: "green", label: "Green" },
    { value: "gray", label: "Gray" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "yellow", label: "Yellow" },
  ];

  const buttonCode = `<Button
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
  }
>
  Button
</Button>`;

  return (
    <div>
      <DocHero
        eyebrow="COMPONENTS"
        title="Button"
        description="Tombol untuk memicu aksi utama pada sebuah halaman atau form. Mendukung berbagai ukuran, warna, varian, dan penggunaan icon."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-6 py-12">
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Variants</h2>

          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-6">
                <Button variant="filled" theme="primary" tone="light">
                  Simpan perubahan
                </Button>

                <Button variant="outline" theme="orange" tone="light">
                  Batal
                </Button>
              </div>
            </div>

            {/* React Code */}
            <DocUsage
              code={`<Button variant="filled" theme="primary" tone="light">
  Simpan perubahan
</Button>

<Button variant="outline" theme="orange" tone="light">
  Batal
</Button>`}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Sizes & Icons</h2>

          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start gap-6">
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;

                  return (
                    <div key={size} className="flex flex-col items-center gap-3">
                      <div
                        className={cn(
                          "rounded-xl p-1 transition-all",
                          isSelected && "ring-2 ring-primary-300 ring-offset-2",
                        )}
                      >
                        <Button
                          size={size}
                          variant="filled"
                          theme="primary"
                          tone="light"
                          leftIcon={<Messages />}
                          rightIcon={<Messages />}
                          onClick={() => setSelectedSize(size)}
                        >
                          Button
                        </Button>
                      </div>

                      <span
                        className={cn(
                          "text-xs font-semibold uppercase",
                          isSelected ? "text-primary-700" : "text-gray-500",
                        )}
                      >
                        {size}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* React Code */}
            <DocUsage
              code={`<Button
  size="${selectedSize}"
  leftIcon={}
  rightIcon={}
>
  Button
</Button>`}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Icon Only</h2>

          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start gap-6">
                {sizes.map((size) => {
                  const isSelected = selectedIconSize === size;

                  return (
                    <div key={size} className="flex flex-col items-center gap-3">
                      <div
                        className={cn(
                          "rounded-full p-1 transition-all",
                          isSelected && "ring-2 ring-primary-300 ring-offset-2",
                        )}
                      >
                        <Button
                          size={size}
                          variant="filled"
                          theme="primary"
                          tone="light"
                          iconOnly
                          aria-label={`Button ${size}`}
                          onClick={() => setSelectedIconSize(size)}
                        >
                          <Messages />
                        </Button>
                      </div>

                      <span
                        className={cn(
                          "text-xs font-semibold uppercase",
                          isSelected ? "text-primary-700" : "text-gray-500",
                        )}
                      >
                        {size}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* React Code */}
            <DocUsage
              code={`<Button
  size="${selectedIconSize}"
  iconOnly
  aria-label="Messages"
>
  <Messages />
</Button>`}
            />
          </div>
        </section>
        {/* Interactive */}
        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Interactive</h2>
          <p className="mb-6 text-gray-500">
            Gunakan kontrol di sebelah kanan untuk melihat perubahan Button secara langsung.
          </p>
          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_300px]">
            {/* LEFT */}
            <div className="flex h-[650px] flex-col gap-4">
              {/* Preview */}
              <div className="h-[400px] rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="p-8">
                  <h3 className="mb-8 text-lg font-semibold text-gray-900">Preview</h3>

                  <div className="flex min-h-[150px] items-center justify-center">
                    <Button
                      size={selectedSize}
                      variant={variant}
                      theme={theme}
                      tone={tone}
                      leftIcon={showLeftIcon ? <Messages className="size-5" /> : undefined}
                      rightIcon={showRightIcon ? <Messages className="size-5" /> : undefined}
                    >
                      Button
                    </Button>
                  </div>
                </div>
              </div>

              {/* React Code */}
              <DocUsage code={buttonCode} />
            </div>

            {/* RIGHT - Controls */}
            <div className="h-[650px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Controls</h3>

              {/* Variant */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Variant</h4>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Radio
                    name="interactive-variant"
                    label="Filled"
                    checked={variant === "filled"}
                    onChange={() => setVariant("filled")}
                  />

                  <Radio
                    name="interactive-variant"
                    label="Outline"
                    checked={variant === "outline"}
                    onChange={() => setVariant("outline")}
                  />
                </div>
              </div>

              {/* Size */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-gray-900">Size</h4>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {sizes.map((size) => (
                    <Radio
                      key={size}
                      name="interactive-size"
                      label={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="capitalize"
                    />
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-gray-900">Color</h4>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {themes.map((item) => (
                    <Radio
                      key={item.value}
                      name="interactive-theme"
                      label={item.label}
                      checked={theme === item.value}
                      onChange={() => setTheme(item.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-gray-900">Tone</h4>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Radio
                    name="interactive-tone"
                    label="Light"
                    checked={tone === "light"}
                    onChange={() => setTone("light")}
                  />

                  <Radio
                    name="interactive-tone"
                    label="Dark"
                    checked={tone === "dark"}
                    onChange={() => setTone("dark")}
                  />
                </div>
              </div>

              {/* Icons */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-gray-900">Icons</h4>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Checkbox
                    name="interactive-left-icon"
                    label="Left Icon"
                    checked={showLeftIcon}
                    onChange={(event) => setShowLeftIcon(event.currentTarget.checked)}
                  />

                  <Checkbox
                    name="interactive-right-icon"
                    label="Right Icon"
                    checked={showRightIcon}
                    onChange={(event) => setShowRightIcon(event.currentTarget.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Sebagai link</h2>

          <p className="mb-6 text-sm text-gray-500">
            Gunakan prop <code>as="a"</code> agar Button dirender sebagai anchor tanpa kehilangan
            gaya Button.
          </p>

          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <Button
                as="a"
                href="/foundations/colors"
                variant="filled"
                theme="primary"
                tone="light"
              >
                Buka Foundations
              </Button>
            </div>

            {/* React Code */}
            <DocUsage
              code={`<Button
  as="a"
  href="/foundations/colors"
  variant="filled"
  theme="primary"
  tone="light"
>
  Buka Foundations
</Button>`}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Properties</h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-semibold">PROP</th>

                  <th className="px-5 py-4 font-semibold">TYPE</th>

                  <th className="px-5 py-4 font-semibold">DEFAULT</th>

                  <th className="px-5 py-4 font-semibold">KETERANGAN</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">variant</td>

                  <td className="px-5 py-4 text-gray-600">"filled" | "outline"</td>

                  <td className="px-5 py-4 font-mono text-gray-600">filled</td>

                  <td className="px-5 py-4 text-gray-600">Menentukan gaya Button.</td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">size</td>

                  <td className="px-5 py-4 text-gray-600">"xs" | "s" | "base" | "l" | "xl"</td>

                  <td className="px-5 py-4 font-mono text-gray-600">base</td>

                  <td className="px-5 py-4 text-gray-600">Menentukan ukuran Button.</td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">theme</td>

                  <td className="px-5 py-4 text-gray-600">
                    primary | green | gray | portal | purple | orange | yellow
                  </td>

                  <td className="px-5 py-4 font-mono text-gray-600">primary</td>

                  <td className="px-5 py-4 text-gray-600">Menentukan warna Button.</td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">tone</td>

                  <td className="px-5 py-4 text-gray-600">light | dark</td>

                  <td className="px-5 py-4 font-mono text-gray-600">light</td>

                  <td className="px-5 py-4 text-gray-600">
                    Menentukan shade warna yang digunakan.
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">leftIcon</td>

                  <td className="px-5 py-4 text-gray-600">ReactNode</td>

                  <td className="px-5 py-4 font-mono text-gray-600">-</td>

                  <td className="px-5 py-4 text-gray-600">
                    Icon yang ditampilkan di sebelah kiri.
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">rightIcon</td>

                  <td className="px-5 py-4 text-gray-600">ReactNode</td>

                  <td className="px-5 py-4 font-mono text-gray-600">-</td>

                  <td className="px-5 py-4 text-gray-600">
                    Icon yang ditampilkan di sebelah kanan.
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">iconOnly</td>

                  <td className="px-5 py-4 text-gray-600">boolean</td>

                  <td className="px-5 py-4 font-mono text-gray-600">false</td>

                  <td className="px-5 py-4 text-gray-600">
                    Mengubah Button menjadi Button berbentuk icon-only.
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">as</td>

                  <td className="px-5 py-4 text-gray-600">"button" | "a"</td>

                  <td className="px-5 py-4 font-mono text-gray-600">button</td>

                  <td className="px-5 py-4 text-gray-600">
                    Menentukan elemen HTML yang digunakan.
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-mono text-primary-700">disabled</td>

                  <td className="px-5 py-4 text-gray-600">boolean</td>

                  <td className="px-5 py-4 font-mono text-gray-600">false</td>

                  <td className="px-5 py-4 text-gray-600">Menonaktifkan Button.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
