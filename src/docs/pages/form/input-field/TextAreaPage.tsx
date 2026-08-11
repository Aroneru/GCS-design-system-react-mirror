import { useState } from 'react'
import {
  TextArea,
  type TextAreaApplication,
  type TextAreaPlatform,
  type TextAreaType,
} from '../../../../lib'
import { PropsTable, type PropRow } from '../../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../../pageKit'

const applications: { value: TextAreaApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'simaya', label: 'simaya', token: 'purple-700' },
]

const textAreaProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas kotak.'],
  ['hint', 'ReactNode', 'undefined', 'Teks kecil di kanan label, mis. penghitung karakter.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah kotak.'],
  ['type', "'default' | 'editor'", 'default', 'Kotak polos, atau kotak dengan toolbar di atasnya.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi kotak type default: 162px atau 120px.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna garis saat difokus dan tombol kirim.'],
  ['toolbar', 'ReactNode', 'undefined', 'Mengganti isi toolbar editor dengan elemen sendiri.'],
  ['onToolbarAction', '(action) => void', 'undefined', 'Dipanggil saat tombol toolbar bawaan ditekan.'],
  ['submitLabel', 'ReactNode', 'undefined', 'Label tombol kirim; tombol hanya muncul bila diisi.'],
  ['onSubmit', '() => void', 'undefined', 'Aksi tombol kirim.'],
  ['…props', 'TextareaHTMLAttributes', '—', 'Seluruh atribut <textarea> standar diteruskan (rows, maxLength, value, onChange, …).'],
]

export function TextAreaPage() {
  const [type, setType] = useState<TextAreaType>('editor')
  const [platform, setPlatform] = useState<TextAreaPlatform>('default')
  const [application, setApplication] = useState<TextAreaApplication>('default')
  const [withSubmit, setWithSubmit] = useState(true)
  const [value, setValue] = useState('')

  return (
    <ComponentPage
      eyebrow="Form · Input Field Form"
      title="Text Area"
      description="Isian teks banyak baris. Tersedia sebagai kotak polos atau sebagai editor dengan toolbar dan tombol kirim, memakai token warna, radius, dan jarak yang sama dengan Foundations."
    >
      <Section title="Text Area">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Kotak polos untuk keterangan panjang: label di atas, kotak berlatar abu muda, lalu caption di bawah.
          Tingginya mengikuti platform — 162px di desktop, 120px di mobile.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 162px">
            <TextArea
              label="Keterangan"
              placeholder="Tulis keterangan tambahan…"
              helperText="Maksimal 500 karakter."
            />
          </Demo>
          <Demo label="Mobile · 120px">
            <TextArea
              platform="mobile"
              label="Keterangan"
              placeholder="Tulis keterangan tambahan…"
              helperText="Maksimal 500 karakter."
            />
          </Demo>
        </div>
      </Section>

      <Section title="Editor">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Type <H>editor</H> menambahkan toolbar setinggi 40px di atas area isian — tujuh alat dengan garis
          pemisah setelah alat ketiga, persis seperti Figma. Teks di kanan label bisa dipakai sebagai penghitung
          karakter, dan tombol kirim muncul begitu <H>submitLabel</H> diisi.
        </p>
        <Demo>
          <TextArea
            type="editor"
            label="Isi pesan"
            hint="0/500"
            placeholder="Tulis pesan Anda…"
            submitLabel="Submit Text"
          />
        </Demo>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Warna tombol kirim — dan garis kotak saat difokus — mengikuti aplikasi yang memakainya, dengan token
          warna yang sama seperti pada Input Field.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <TextArea
                type="editor"
                application={a.value}
                label="Isi pesan"
                placeholder="Tulis pesan Anda…"
                helperText={`bg-${a.token}`}
                submitLabel="Submit Text"
              />
            </Demo>
          ))}
        </div>
      </Section>

      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div
            className={`mx-auto transition-[max-width] duration-300 ease-out ${
              platform === 'mobile' && type === 'default' ? 'max-w-[380px]' : 'max-w-[494px]'
            }`}
          >
            <TextArea
              type={type}
              platform={platform}
              application={application}
              label="Isi pesan"
              hint={type === 'editor' ? `${value.length}/500` : undefined}
              placeholder="Tulis pesan Anda…"
              helperText="Maksimal 500 karakter."
              maxLength={500}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              submitLabel={withSubmit ? 'Submit Text' : undefined}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div>
            <ControlLabel>Type</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih type"
                value={type}
                onChange={setType}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'editor', label: 'Editor' },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Platform</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih platform"
                value={platform}
                onChange={setPlatform}
                options={[
                  { value: 'mobile', label: 'Mobile' },
                  { value: 'default', label: 'Desktop' },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Application</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih aplikasi"
                value={application}
                onChange={setApplication}
                itemClassName="px-2.5"
                options={applications.map((a) => ({ value: a.value, label: a.label }))}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Tombol kirim</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan tombol kirim"
                value={withSubmit}
                onChange={setWithSubmit}
                options={[
                  { value: true, label: 'Ada' },
                  { value: false, label: 'Tanpa' },
                ]}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Tombol kirim dan penghitung karakter hanya berlaku pada type <em>editor</em>; pada type{' '}
          <em>default</em> hanya tingginya yang mengikuti platform.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { TextArea } from '@tpl/design-kit-react'\n\n"}
          {'{/* Dasar: label + caption */}\n'}
          {'<TextArea\n'}
          {'    label="Keterangan"\n'}
          {'    placeholder="Tulis keterangan tambahan…"\n'}
          {'    helperText="Maksimal 500 karakter."\n'}
          {'/>\n\n'}
          {'{/* Mobile — kotak 120px */}\n'}
          {'<TextArea '}
          <H>platform</H>
          {'="mobile" label="Keterangan" />\n\n'}
          {'{/* Editor: toolbar, penghitung karakter, dan tombol kirim */}\n'}
          {'<TextArea\n'}
          {'    '}
          <H>type</H>
          {'="editor"\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    label="Isi pesan"\n'}
          {'    hint={`${value.length}/500`}\n'}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {'    '}
          <H>submitLabel</H>
          {'="Submit Text"\n'}
          {'    onSubmit={kirim}\n'}
          {'    onToolbarAction={(action) => console.log(action)}\n'}
          {'/>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={textAreaProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
