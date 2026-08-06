import { useState } from 'react'
import { Radio, type RadioApplication, type RadioPlatform, type RadioState } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../pageKit'

const applications: { value: RadioApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'portal', label: 'Portal', token: 'blue-portal-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const kewarganegaraan = [
  { value: 'wni', label: 'Warga negara Indonesia' },
  { value: 'wna', label: 'Warga negara asing' },
]

const radioProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks di samping lingkaran.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption 12px di bawah label.'],
  ['platform', "'default' | 'mobile'", 'default', 'Ukuran lingkaran: 16px atau 14px.'],
  ['state', "'default' | 'inactive'", 'default', 'Inactive meredupkan tampilan sekaligus menonaktifkan kontrol.'],
  ['application', "'default' | 'portal' | 'simaya'", 'default', 'Warna cincin saat pilihan dipilih.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="radio"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

export function RadioPage() {
  const [platform, setPlatform] = useState<RadioPlatform>('default')
  const [state, setState] = useState<RadioState>('default')
  const [application, setApplication] = useState<RadioApplication>('default')
  const [withCaption, setWithCaption] = useState(false)
  const [pilihan, setPilihan] = useState('wni')

  return (
    <ComponentPage
      eyebrow="Form"
      title="Radio Button"
      description="Pilihan tunggal dari beberapa opsi yang saling meniadakan. Dibangun di atas <input type='radio'> bawaan supaya navigasi panah dan pembaca layar tetap berfungsi, dengan warna, ukuran, dan jarak dari Foundations."
    >
      <Section title="Radio Button">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Lingkaran 16px berlatar gray-50 dengan garis gray-300. Saat dipilih, garisnya menebal jadi 3,5px
          berwarna aksen — sisa ruang di tengah (9px) itulah yang tampak sebagai titik.
        </p>
        <Demo>
          <div className="flex flex-wrap gap-8">
            <Radio name="ds-radio-dasar" label="Belum dipilih" />
            <Radio name="ds-radio-dasar" label="Sedang dipilih" defaultChecked />
            <Radio name="ds-radio-nonaktif" state="inactive" label="Tidak aktif" />
          </div>
        </Demo>
      </Section>

      <Section title="Dengan caption">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Isi <H>helperText</H> untuk menambahkan keterangan 12px di bawah label — berguna saat pilihannya
          perlu penjelasan. Lingkaran tetap sejajar dengan baris pertama label.
        </p>
        <Demo>
          <div className="space-y-4">
            <Radio
              name="ds-radio-caption"
              label="Warga negara Indonesia"
              helperText="Wajib melampirkan KTP elektronik yang masih berlaku."
              defaultChecked
            />
            <Radio
              name="ds-radio-caption"
              label="Warga negara asing"
              helperText="Wajib melampirkan paspor dan izin tinggal."
            />
          </div>
        </Demo>
      </Section>

      <Section title="Platform">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Platform mobile memakai lingkaran 14px dengan label 12px; ukuran caption tetap 12px di keduanya.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 16px">
            <div className="space-y-3">
              {kewarganegaraan.map((o) => (
                <Radio key={o.value} name="ds-radio-desktop" label={o.label} defaultChecked={o.value === 'wni'} />
              ))}
            </div>
          </Demo>
          <Demo label="Mobile · 14px">
            <div className="space-y-3">
              {kewarganegaraan.map((o) => (
                <Radio
                  key={o.value}
                  platform="mobile"
                  name="ds-radio-mobile"
                  label={o.label}
                  defaultChecked={o.value === 'wni'}
                />
              ))}
            </div>
          </Demo>
        </div>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Warna cincin saat dipilih mengikuti aplikasi yang memakainya; state lain memakai abu yang sama.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <div className="space-y-3">
                <Radio
                  name={`ds-radio-${a.value}`}
                  application={a.value}
                  label="Dipilih"
                  helperText={`border-${a.token}`}
                  defaultChecked
                />
                <Radio name={`ds-radio-${a.value}`} application={a.value} label="Belum dipilih" />
              </div>
            </Demo>
          ))}
        </div>
      </Section>

      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div className="mx-auto max-w-[420px] space-y-4">
            {kewarganegaraan.map((o) => (
              <Radio
                key={o.value}
                name="ds-radio-playground"
                platform={platform}
                state={state}
                application={application}
                label={o.label}
                helperText={withCaption ? 'Keterangan singkat tentang pilihan ini.' : undefined}
                checked={pilihan === o.value}
                onChange={() => setPilihan(o.value)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-6">
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
            <ControlLabel>State</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih state"
                value={state}
                onChange={setState}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'inactive', label: 'Inactive' },
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
            <ControlLabel>Caption</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan caption"
                value={withCaption}
                onChange={setWithCaption}
                options={[
                  { value: true, label: 'Ada' },
                  { value: false, label: 'Tanpa' },
                ]}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Satu kelompok pilihan dibentuk dengan memberi <H>name</H> yang sama pada tiap Radio — sama seperti
          formulir HTML biasa, jadi panah atas/bawah otomatis berpindah antar-opsi.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { Radio } from '@tpl/design-kit-react'\n\n"}
          {'{/* Sekelompok pilihan: samakan name-nya */}\n'}
          {'<Radio '}
          <H>name</H>
          {'="kewarganegaraan" label="Warga negara Indonesia" defaultChecked />\n'}
          {'<Radio '}
          <H>name</H>
          {'="kewarganegaraan" label="Warga negara asing" />\n\n'}
          {'{/* Dengan caption */}\n'}
          {'<Radio\n'}
          {'    name="kewarganegaraan"\n'}
          {'    label="Warga negara asing"\n'}
          {'    '}
          <H>helperText</H>
          {'="Wajib melampirkan paspor dan izin tinggal."\n'}
          {'/>\n\n'}
          {'{/* Terkendali + warna aplikasi + mobile */}\n'}
          {'<Radio\n'}
          {'    name="kewarganegaraan"\n'}
          {'    '}
          <H>platform</H>
          {'="mobile"\n'}
          {'    '}
          <H>application</H>
          {'="portal"\n'}
          {'    label="Warga negara Indonesia"\n'}
          {'    checked={pilihan === "wni"}\n'}
          {'    onChange={() => setPilihan("wni")}\n'}
          {'/>\n\n'}
          {'{/* Inactive — meredup sekaligus nonaktif */}\n'}
          {'<Radio '}
          <H>state</H>
          {'="inactive" label="Tidak tersedia" />'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={radioProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
