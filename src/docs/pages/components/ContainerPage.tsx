import { useState } from 'react'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, H, Section, Segmented } from '../../pageKit'

const containerProps: PropRow[] = [
  ['as', 'ElementType', 'div', 'Elemen HTML pembungkus (mis. div, section, main).'],
  ['className', 'string', '—', 'Kelas tambahan; override padding/max-width bila perlu.'],
  ['children', 'ReactNode', '—', 'Konten yang dibatasi lebarnya.'],
]

const containerSpecs: [string, string, string][] = [
  ['Mobile', '≤ 640px', 'max-w 380px · rounded-xl · padding 20px'],
  ['Tablet ke atas', '≥ 640px (sm)', 'max-w 1126px · tanpa radius · padding melebar'],
  ['Tinggi', 'Semua ukuran', 'auto — mengikuti tinggi konten'],
]

export function ContainerPage() {
  const [view, setView] = useState<'mobile' | 'desktop'>('desktop')

  return (
    <ComponentPage
      title="Container"
      description="Pembungkus yang menjaga lebar konten tetap konsisten di seluruh halaman: 380px di mobile (dengan sudut membulat) dan maksimum 1126px di desktop. Tingginya selalu mengikuti konten."
    >
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Preview</h2>

        {/* Area preview: kotak bergaris menandai batas container. */}
        <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-6">
          <div
            className={`mx-auto transition-[max-width] duration-300 ease-out ${
              view === 'mobile' ? 'max-w-[380px]' : 'max-w-[1126px]'
            }`}
          >
            <div
              className={`rounded-xl border-2 border-dashed border-primary-300 bg-surface px-5 py-8 text-center sm:px-8 ${
                view === 'mobile' ? 'rounded-xl' : 'sm:rounded-lg'
              }`}
            >
              <p className="text-sm font-black text-primary-700">Container</p>
              <p className="mt-1 text-xs text-gray-500">
                {view === 'mobile' ? 'max-w 380px · rounded-xl' : 'max-w 1126px'}
              </p>
            </div>
          </div>
        </div>

        {/* Kontrol lebar */}
        <div className="mt-4 flex items-center gap-3">
          <ControlLabel>Lebar</ControlLabel>
          <Segmented
            label="Pilih lebar container"
            value={view}
            onChange={setView}
            options={[
              { value: 'mobile', label: 'Mobile' },
              { value: 'desktop', label: 'Desktop' },
            ]}
          />
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Container hanya mengatur <em>lebar</em> dan <em>padding horizontal</em>. Jarak vertikal (mis.{' '}
          <code className="text-xs font-bold text-gray-700">py-12</code>) ditambahkan lewat kelas saat dipakai.
        </p>
      </section>

      <Section title="Spesifikasi">
        <div className="grid gap-4 sm:grid-cols-3">
          {containerSpecs.map(([title, range, detail]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1 text-xs font-bold text-primary-700">{range}</p>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">{detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>
          {'{/* Dasar: batasi lebar konten */}\n'}
          {'<Container>\n    ...\n</Container>\n\n'}
          {'{/* Tambah jarak vertikal lewat className */}\n'}
          {'<Container className="'}
          <H>py-12 lg:py-16</H>
          {'">\n    ...\n</Container>\n\n'}
          {'{/* Ganti elemen pembungkus & nol-kan padding\n'}
          {'    (mis. saat section sudah punya padding sendiri) */}\n'}
          {'<Container '}
          <H>as</H>
          {'="section" className="px-0 sm:px-0">\n    ...\n</Container>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={containerProps} />
      </Section>
    </ComponentPage>
  )
}
