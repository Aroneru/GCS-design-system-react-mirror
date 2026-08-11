import { useState } from "react";
import { Messages } from "flowbite-react-icons/outline";
import { Button, Radio, Checkbox, type ButtonTheme, type ButtonVariant } from "../../../lib";
import { DocHero } from "../../DocHero";
import { DocUsage } from "../../DocUsage";

export function ButtonPage() {
  const sizes = ["xs", "s", "base", "l", "xl"] as const;

  const [variant, setVariant] = useState<ButtonVariant>("filled");
  const [theme, setTheme] = useState<ButtonTheme>("primary");

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

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Preview */}
            <div className="flex flex-wrap items-center gap-6 p-8">
              <Button variant="filled" theme="primary" tone="light">
                Simpan perubahan
              </Button>

              <Button variant="outline" theme="orange" tone="light">
                Batal
              </Button>
            </div>

            {/* Code */}
            <DocUsage
              code={`<Button variant="filled">
  Simpan perubahan
</Button>

<Button variant="outline">
  Batal
</Button>`}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Sizes & Icons</h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Preview */}
            <div className="space-y-8 p-8">
              <div>
                <div className="flex flex-wrap items-center gap-5">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      size={size}
                      variant="filled"
                      theme="primary"
                      tone="light"
                      leftIcon={<Messages />}
                      rightIcon={<Messages />}
                    >
                      Button
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code */}
            <DocUsage
              code={`<Button
  size="base"
  leftIcon={<Messages />}
  rightIcon={<Messages />}
>
  Button
</Button>`}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Icon Only</h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-5">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    size={size}
                    variant="filled"
                    theme="primary"
                    tone="light"
                    iconOnly
                    aria-label={`Button ${size}`}
                  >
                    <Messages />
                  </Button>
                ))}
              </div>
            </div>

            <DocUsage
              code={`<Button
  size="base"
  iconOnly
  aria-label="Messages"
>
  <Messages />
</Button>`}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Interactive</h2>

          <p className="mb-6 text-sm text-gray-500">
            Gunakan kontrol di sebelah kanan untuk melihat perubahan Button secara langsung.
          </p>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Preview</h3>
              <div className="space-y-6">
                {/* Light */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-500">Light</p>

                  <div className="flex flex-wrap gap-4">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        size={size}
                        variant={variant}
                        theme={theme}
                        tone="light"
                        leftIcon={showLeftIcon ? <Messages className="size-5" /> : undefined}
                        rightIcon={showRightIcon ? <Messages className="size-5" /> : undefined}
                      >
                        Button
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Dark */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-500">Dark</p>

                  <div className="flex flex-wrap gap-4">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        size={size}
                        variant={variant}
                        theme={theme}
                        tone="dark"
                        leftIcon={showLeftIcon ? <Messages className="size-5" /> : undefined}
                        rightIcon={showRightIcon ? <Messages className="size-5" /> : undefined}
                      >
                        Button
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Icon only */}
              <div className="mt-8 space-y-6">
                {/* Light */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-500">Light</p>

                  <div className="flex flex-wrap gap-5">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        size={size}
                        variant={variant}
                        theme={theme}
                        tone="light"
                        iconOnly
                      >
                        <Messages className="size-5" />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Dark */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-500">Dark</p>

                  <div className="flex flex-wrap gap-5">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        size={size}
                        variant={variant}
                        theme={theme}
                        tone="dark"
                        iconOnly
                      >
                        <Messages className="size-5" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Controls</h3>

              {/* Variant */}
              <div className="space-y-3">
                <h4 className="font-semibold">Variant</h4>

                <Radio
                  name="button-variant"
                  label="Filled"
                  checked={variant === "filled"}
                  onChange={() => setVariant("filled")}
                />

                <Radio
                  name="button-variant"
                  label="Outline"
                  checked={variant === "outline"}
                  onChange={() => setVariant("outline")}
                />
              </div>

              {/* Color */}
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold">Color</h4>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {themes.map((item) => (
                    <Radio
                      key={item.value}
                      name="button-theme"
                      label={item.label}
                      checked={theme === item.value}
                      onChange={() => setTheme(item.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Icons */}
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold">Variant</h4>
                <Checkbox
                  name="button-left-icon"
                  label="Left Icon"
                  checked={showLeftIcon}
                  onChange={(e) => setShowLeftIcon(e.target.checked)}
                />

                <Checkbox
                  name="button-right-icon"
                  label="Right Icon"
                  checked={showRightIcon}
                  onChange={(e) => setShowRightIcon(e.target.checked)}
                />
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

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-8">
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

            <DocUsage
              code={`<Button
  as="a"
  href="/foundations/colors"
  variant="outline"
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
                    primary | green | gray | purple | orange | yellow
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
