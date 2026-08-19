import { useState } from 'react'
import { Spinner, type SpinnerSize } from '../../../lib'
import { DocExample } from '../../DocExample'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ControlLabel, H, Segmented } from '../../pageKit'
import { FlowSection, Lead, UsulanPage, type TocEntry } from '../../usulanKit'

const spinnerProps: PropRow[] = [
  [
    'size',
    "'default' | 'large'",
    "'default'",
    'Menentukan ukuran Spinner: 50×50 px untuk default dan 100×100 px untuk large.',
  ],
  [
    '…props',
    'Native SVG attributes',
    '—',
    'Atribut SVG native yang relevan diteruskan, termasuk className, style, aria-*, data-*, id, dan event handler. Ukuran dan geometri Spinner dikontrol oleh API komponen.',
  ],
]

const toc: TocEntry[] = [
  { id: 'sizes', label: 'Sizes' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'properties', label: 'Properties' },
]

export function SpinnerPage() {
  const [size, setSize] = useState<SpinnerSize>('default')

  return (
    <UsulanPage
      eyebrow="Components"
      title="Spinner"
      description="Indikator proses berputar untuk kondisi loading yang durasinya belum diketahui."
      toc={toc}
    >
      <FlowSection id="sizes" title="Sizes">
        <div className="grid gap-4 md:grid-cols-2">
          <article>
            <h3 className="text-sm font-black text-gray-900">Default</h3>
            <p className="mt-1 mb-3 text-body-sm text-gray-500">
              Ukuran standar 50×50 px untuk indikator loading pada area komponen atau konten umum.
              Ukuran ini digunakan secara default, jadi prop <code>size</code> tidak perlu ditulis.
            </p>
            <DocExample>
              <Spinner />
            </DocExample>
          </article>

          <article>
            <h3 className="text-sm font-black text-gray-900">Large</h3>
            <p className="mt-1 mb-3 text-body-sm text-gray-500">
              Ukuran 100×100 px untuk loading state yang membutuhkan penekanan visual lebih besar.
              Gunakan <code>size=&quot;large&quot;</code> untuk memilih ukuran ini.
            </p>
            <DocExample>
              <Spinner size="large" />
            </DocExample>
          </article>
        </div>

        <div className="mt-4">
          <CodeBlock>
            {'<Spinner />\n\n<Spinner '}
            <H>size=&quot;large&quot;</H>
            {' />'}
          </CodeBlock>
        </div>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Ubah Size untuk melihat ukuran Spinner. Nilai default tidak perlu ditulis pada kode penggunaan.
        </p>
        <DocExample>
          {size === 'default' ? <Spinner /> : <Spinner size="large" />}
        </DocExample>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ControlLabel>Size</ControlLabel>
          <Segmented
            label="Pilih ukuran Spinner"
            value={size}
            onChange={setSize}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'large', label: 'Large' },
            ]}
          />
        </div>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Blok ini mengikuti kontrol di Playground — ubah Size, preview dan kodenya ikut berubah. Prop
          yang masih memakai nilai bawaan sengaja tidak ditulis.
        </p>
        <CodeBlock>
          {size === 'default' ? (
            '<Spinner />'
          ) : (
            <>
              {'<Spinner '}
              <H>size=&quot;large&quot;</H>
              {' />'}
            </>
          )}
        </CodeBlock>
      </FlowSection>

      <FlowSection id="accessibility" title="Accessibility">
        <h3 className="text-sm font-black text-gray-900">Standalone loading</h3>
        <p className="mt-1 mb-3 max-w-2xl text-body-sm text-gray-500">
          Gunakan Spinner secara standalone ketika tidak ada teks loading lain. Spinner memiliki status
          aksesibel dengan label default “Loading”. Sesuaikan <code>aria-label</code> jika proses yang
          berlangsung perlu dijelaskan lebih spesifik.
        </p>
        <DocExample>
          <Spinner aria-label="Memuat daftar pengguna" />
        </DocExample>

        <h3 className="mt-6 text-sm font-black text-gray-900">Spinner dengan teks</h3>
        <p className="mt-1 mb-3 max-w-2xl text-body-sm text-gray-500">
          Jika teks di sebelah Spinner sudah menjelaskan proses loading, sembunyikan Spinner dari screen
          reader dengan <code>aria-hidden=&quot;true&quot;</code> agar informasi yang sama tidak diumumkan dua kali.
          Teks yang terlihat menjadi sumber informasi loading bagi pengguna.
        </p>
        <DocExample>
          <div className="flex items-center gap-3">
            <Spinner aria-hidden="true" />
            <span className="text-body-sm text-gray-700">Memuat data…</span>
          </div>
        </DocExample>

        <div className="mt-4">
          <CodeBlock>
            {'<Spinner '}
            <H>aria-label=&quot;Memuat daftar pengguna&quot;</H>
            {' />\n\n<div className="flex items-center gap-3">\n  <Spinner '}
            <H>aria-hidden=&quot;true&quot;</H>
            {' />\n  <span>Memuat data...</span>\n</div>'}
          </CodeBlock>
        </div>

        <h3 className="mt-6 text-sm font-black text-gray-900">Loading region &amp; reduced motion</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Letakkan <code>aria-busy=&quot;true&quot;</code> pada region yang sedang dimuat, bukan pada Spinner.
          Saat pengguna mengaktifkan reduced motion, animasi Spinner dihentikan tetapi indikator loading
          tetap terlihat.
        </p>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut SVG native
          yang relevan tetap dapat diteruskan.
        </Lead>
        <div className="[&_td:first-child]:whitespace-nowrap [&_td:nth-child(2)]:whitespace-nowrap">
          <PropsTable rows={spinnerProps} minWidth="46rem" />
        </div>
      </FlowSection>
    </UsulanPage>
  )
}
