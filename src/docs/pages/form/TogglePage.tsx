import { useState } from 'react'
import { Toggle, type ToggleApplication, type TogglePlatform, type ToggleState } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../pageKit'

const applications: { value: ToggleApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'portal', label: 'Portal', token: 'blue-portal-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const toggleProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks di samping sakelar.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption 12px di bawah label.'],
  ['platform', "'default' | 'mobile'", 'default', 'Ukuran sakelar: 40×20px atau 36×18px.'],
  ['state', "'default' | 'inactive'", 'default', 'Inactive meredupkan tampilan sekaligus menonaktifkan kontrol.'],
  ['application', "'default' | 'portal' | 'simaya'", 'default', 'Warna jalur saat sakelar menyala.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="checkbox"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

export function TogglePage() {
  const [platform, setPlatform] = useState<TogglePlatform>('default')
  const [state, setState] = useState<ToggleState>('default')
  const [application, setApplication] = useState<ToggleApplication>('default')
  const [withCaption, setWithCaption] = useState(false)
  const [aktif, setAktif] = useState(true)

  return (
    <ComponentPage
      eyebrow="Form"
      title="Toggle Button"
      description="Sakelar untuk menyalakan atau mematikan satu pengaturan, berlaku seketika tanpa tombol simpan. Dibangun di atas <input type='checkbox'> dengan role='switch' supaya keyboard dan pembaca layar tetap berfungsi."
    >
      <Section title="Toggle Button">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Jalur 40×20px dengan bulatan putih 16px yang menyisakan 2px di tiap sisi. Saat mati jalurnya
          gray-200; saat menyala ia berganti ke warna aksen dan bulatannya bergeser 20px ke kanan.
        </p>
        <Demo>
          <div className="flex flex-wrap gap-8">
            <Toggle label="Mati" />
            <Toggle label="Menyala" defaultChecked />
            <Toggle state="inactive" label="Tidak aktif" />
          </div>
        </Demo>
      </Section>

      <Section title="Dengan caption">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Isi <H>helperText</H> untuk menerangkan akibat dari menyalakan pengaturan — berguna karena sakelar
          berlaku langsung tanpa konfirmasi.
        </p>
        <Demo>
          <div className="space-y-4">
            <Toggle
              label="Notifikasi email"
              helperText="Kirim ringkasan permohonan baru setiap pagi."
              defaultChecked
            />
            <Toggle
              label="Tampilkan data sensitif"
              helperText="NIK dan nomor telepon ditampilkan penuh pada tabel."
            />
          </div>
        </Demo>
      </Section>

      <Section title="Platform">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Platform mobile memakai sakelar 36×18px dengan bulatan 14px dan label 12px; ukuran caption tetap
          12px di keduanya.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 40×20px">
            <div className="space-y-3">
              <Toggle label="Notifikasi aktif" defaultChecked />
              <Toggle label="Notifikasi nonaktif" />
            </div>
          </Demo>
          <Demo label="Mobile · 36×18px">
            <div className="space-y-3">
              <Toggle platform="mobile" label="Notifikasi aktif" defaultChecked />
              <Toggle platform="mobile" label="Notifikasi nonaktif" />
            </div>
          </Demo>
        </div>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Warna jalur saat menyala mengikuti aplikasi yang memakainya; state mati dan inactive memakai abu
          yang sama.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <div className="space-y-3">
                <Toggle
                  application={a.value}
                  label="Menyala"
                  helperText={`bg-${a.token}`}
                  defaultChecked
                />
                <Toggle application={a.value} label="Mati" />
              </div>
            </Demo>
          ))}
        </div>
      </Section>

      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div className="mx-auto max-w-[420px]">
            <Toggle
              platform={platform}
              state={state}
              application={application}
              label="Notifikasi email"
              helperText={withCaption ? 'Kirim ringkasan permohonan baru setiap pagi.' : undefined}
              checked={aktif}
              onChange={(e) => setAktif(e.target.checked)}
            />
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
          State <em>Off</em> dan <em>Active</em> di Figma sama dengan mati/menyalanya sakelar, jadi keduanya
          diatur lewat <H>checked</H> seperti checkbox biasa — bukan lewat prop <H>state</H>.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { Toggle } from '@tpl/design-kit-react'\n\n"}
          {'{/* Dasar: menyala sejak awal */}\n'}
          {'<Toggle label="Notifikasi email" defaultChecked />\n\n'}
          {'{/* Dengan caption */}\n'}
          {'<Toggle\n'}
          {'    label="Tampilkan data sensitif"\n'}
          {'    '}
          <H>helperText</H>
          {'="NIK dan nomor telepon ditampilkan penuh pada tabel."\n'}
          {'/>\n\n'}
          {'{/* Terkendali + warna aplikasi + mobile */}\n'}
          {'<Toggle\n'}
          {'    '}
          <H>platform</H>
          {'="mobile"\n'}
          {'    '}
          <H>application</H>
          {'="portal"\n'}
          {'    label="Notifikasi email"\n'}
          {'    checked={aktif}\n'}
          {'    onChange={(e) => setAktif(e.target.checked)}\n'}
          {'/>\n\n'}
          {'{/* Inactive — meredup sekaligus nonaktif */}\n'}
          {'<Toggle '}
          <H>state</H>
          {'="inactive" label="Belum tersedia" />'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={toggleProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
