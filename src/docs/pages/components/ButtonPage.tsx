// import { Button } from '../../../lib'
// import { DocExample } from '../../DocExample'
// import { PropsTable, type PropRow } from '../../PropsTable'
// import { ComponentPage, H, Section } from '../../pageKit'

// const buttonProps: PropRow[] = [
//   ['variant', 'string', 'primary', 'primary · secondary · danger · ghost'],
//   ['as', "'button' | 'a'", 'button', "Elemen yang dirender, mis. 'a' untuk link"],
// ]

// export function ButtonPage() {
//   return (
//     <ComponentPage
//       title="Button"
//       description="Memicu aksi utama pada sebuah halaman atau form. Empat variant untuk tingkat penekanan yang berbeda."
//     >
//       <Section title="Variants">
//         <DocExample
//           code={
//             <>
//               {'<Button variant="'}
//               <H>primary</H>
//               {'">Simpan perubahan</Button>\n'}
//               {'<Button variant="secondary">Batal</Button>\n'}
//               {'<Button variant="danger">Hapus</Button>\n'}
//               {'<Button variant="ghost">Lewati</Button>'}
//             </>
//           }
//         >
//           <Button variant="primary">Simpan perubahan</Button>
//           <Button variant="secondary">Batal</Button>
//           <Button variant="danger">Hapus</Button>
//           <Button variant="ghost">Lewati</Button>
//         </DocExample>
//       </Section>

//       <Section title="States">
//         <DocExample
//           code={
//             <>
//               {'<Button variant="primary" '}
//               <H>disabled</H>
//               {'>Nonaktif</Button>'}
//             </>
//           }
//         >
//           <Button variant="primary">Normal</Button>
//           <Button variant="primary" disabled>
//             Nonaktif
//           </Button>
//         </DocExample>
//       </Section>

//       <Section title="Sebagai link">
//         <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
//           Gunakan prop <code className="text-xs font-bold text-gray-700">as="a"</code> agar dirender sebagai
//           anchor tanpa kehilangan gaya tombol.
//         </p>
//         <DocExample
//           code={
//             <>
//               {'<Button as="'}
//               <H>a</H>
//               {'" href="/foundations/colors" variant="secondary">\n'}
//               {'    Buka Foundations\n'}
//               {'</Button>'}
//             </>
//           }
//         >
//           <Button as="a" href="#/foundations/colors" variant="secondary">
//             Buka Foundations
//           </Button>
//         </DocExample>
//       </Section>

//       <Section title="Properties">
//         <PropsTable rows={buttonProps} minWidth="36rem" />
//       </Section>
//     </ComponentPage>
//   )
// }

import { useState } from "react";
import { Messages } from "flowbite-react-icons/outline";

import { Button } from "../../../lib";
import { DocHero } from "../../DocHero";
import { DocUsage } from "../../DocUsage";

export function ButtonPage() {
  const sizes = ["xs", "s", "base", "l", "xl"] as const;

  const [variant, setVariant] = useState<"filled" | "outline">("filled");

  const [theme, setTheme] = useState<
    "primary" | "green" | "gray" | "portal" | "purple" | "orange" | "yellow"
  >("primary");

  const [tone, setTone] = useState<"light" | "dark">("light");

  const [showLeftIcon, setShowLeftIcon] = useState(true);
  const [showRightIcon, setShowRightIcon] = useState(true);

  return (
    <div>
      {/* =========================================================
          HERO
      ========================================================= */}

      <DocHero
        eyebrow="COMPONENTS"
        title="Button"
        description="Tombol untuk memicu aksi utama pada sebuah halaman atau form. Mendukung berbagai ukuran, warna, varian, dan penggunaan icon."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-6 py-12">
        {/* =========================================================
            VARIANTS
        ========================================================= */}

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Variants</h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Preview */}
            <div className="flex flex-wrap items-center gap-6 p-8">
              <Button variant="filled" theme="primary" tone="light">
                Simpan perubahan
              </Button>

              <Button variant="outline" theme="primary" tone="light">
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

        {/* =========================================================
            SIZES & ICONS
        ========================================================= */}

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

        {/* =========================================================
            ICON ONLY
        ========================================================= */}

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

        {/* =========================================================
            INTERACTIVE
        ========================================================= */}

        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Interactive</h2>

          <p className="mb-6 text-sm text-gray-500">
            Gunakan kontrol di sebelah kanan untuk melihat perubahan Button secara langsung.
          </p>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Preview</h3>

              {/* Normal buttons */}
              <div className="mb-10">
                <p className="mb-4 text-sm font-medium text-gray-600">Button</p>

                <div className="flex flex-wrap items-center gap-5">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      size={size}
                      variant={variant}
                      theme={theme}
                      tone={tone}
                      leftIcon={showLeftIcon ? <Messages /> : undefined}
                      rightIcon={showRightIcon ? <Messages /> : undefined}
                    >
                      Button
                    </Button>
                  ))}
                </div>
              </div>

              {/* Icon only */}
              <div>
                <p className="mb-4 text-sm font-medium text-gray-600">Icon Only</p>

                <div className="flex flex-wrap items-center gap-5">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      size={size}
                      variant={variant}
                      theme={theme}
                      tone={tone}
                      iconOnly
                      aria-label={`Messages ${size}`}
                    >
                      <Messages />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Controls</h3>

              {/* Variant */}
              <div className="mb-8">
                <h4 className="mb-4 text-sm font-semibold text-gray-700">Variant</h4>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      checked={variant === "filled"}
                      onChange={() => setVariant("filled")}
                      className="h-4 w-4"
                    />

                    <span className="text-sm">Filled</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      checked={variant === "outline"}
                      onChange={() => setVariant("outline")}
                      className="h-4 w-4"
                    />

                    <span className="text-sm">Outline</span>
                  </label>
                </div>
              </div>

              {/* Color */}
              <div className="mb-8">
                <h4 className="mb-4 text-sm font-semibold text-gray-700">Color</h4>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    ["primary", "Primary"],
                    ["green", "Green"],
                    ["gray", "Gray"],
                    ["portal", "Blue Portal"],
                    ["purple", "Purple"],
                    ["orange", "Orange"],
                    ["yellow", "Yellow"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="theme"
                        value={value}
                        checked={theme === value}
                        onChange={() => setTheme(value as typeof theme)}
                        className="h-4 w-4"
                      />

                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-8">
                <h4 className="mb-4 text-sm font-semibold text-gray-700">Tone</h4>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="tone"
                      checked={tone === "light"}
                      onChange={() => setTone("light")}
                      className="h-4 w-4"
                    />

                    <span className="text-sm">Light</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="tone"
                      checked={tone === "dark"}
                      onChange={() => setTone("dark")}
                      className="h-4 w-4"
                    />

                    <span className="text-sm">Dark</span>
                  </label>
                </div>
              </div>

              {/* Icons */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-gray-700">Icons</h4>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showLeftIcon}
                      onChange={(e) => setShowLeftIcon(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />

                    <span className="text-sm">Left Icon</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showRightIcon}
                      onChange={(e) => setShowRightIcon(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />

                    <span className="text-sm">Right Icon</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            AS LINK
        ========================================================= */}

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

        {/* =========================================================
            PROPERTIES
        ========================================================= */}

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
