import { useState } from 'react'
import {
  Checkbox,
  type CheckboxApplication,
  type CheckboxPlatform,
  type CheckboxState,
} from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../pageKit'

const applications: { value: CheckboxApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'portal', label: 'Portal', token: 'blue-portal-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const berkas = [
  { value: 'ktp', label: 'KTP elektronik' },
  { value: 'kk', label: 'Kartu keluarga' },
  { value: 'npwp', label: 'NPWP' },
]

const checkboxProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks di samping kotak.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption 12px di bawah label.'],
  ['platform', "'default' | 'mobile'", 'default', 'Ukuran kotak: 16px atau 14px.'],
  ['state', "'default' | 'inactive'", 'default', 'Inactive meredupkan teks sekaligus menonaktifkan kontrol.'],
  ['application', "'default' | 'portal' | 'simaya'", 'default', 'Warna kotak saat tercentang.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="checkbox"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

export function CheckboxPage() {
  const [platform, setPlatform] = useState<CheckboxPlatform>('default')
  const [state, setState] = useState<CheckboxState>('default')
  const [application, setApplication] = useState<CheckboxApplication>('default')
  const [withCaption, setWithCaption] = useState(false)
  const [dipilih, setDipilih] = useState<string[]>(['ktp'])

  const toggle = (value: string) =>
    setDipilih((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  return (
    <ComponentPage
      eyebrow="Form"
      title="Checkbox"
      description="Pilihan ganda yang bisa dicentang secara mandiri. Dibangun di atas <input type='checkbox'> bawaan supaya keyboard dan pembaca layar tetap berfungsi, dengan warna, ukuran, dan jarak dari Foundations."
    >
      <Section title="Checkbox">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Kotak 16px beradius 4px, berlatar gray-50 dengan garis gray-300. Saat dicentang, kotaknya terisi
          warna aksen dan centang putih 10px muncul di tengahnya.
        </p>
        <Demo>
          <div className="flex flex-wrap gap-8">
            <Checkbox label="Belum dicentang" />
            <Checkbox label="Sudah dicentang" defaultChecked />
            <Checkbox state="inactive" label="Tidak aktif" />
          </div>
        </Demo>
      </Section>

      <Section title="Dengan caption">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Isi <H>helperText</H> untuk menerangkan pilihan — berguna saat satu centang punya konsekuensi yang
          perlu dijelaskan. Kotak tetap sejajar dengan baris pertama label.
        </p>
        <Demo>
          <div className="space-y-4">
            <Checkbox
              label="Saya menyetujui syarat dan ketentuan"
              helperText="Termasuk pemrosesan data pribadi sesuai kebijakan privasi."
              defaultChecked
            />
            <Checkbox
              label="Kirim salinan ke email"
              helperText="Tanda terima dikirim setelah permohonan tersimpan."
            />
          </div>
        </Demo>
      </Section>

      <Section title="Platform">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Platform mobile memakai kotak 14px dengan label 12px; ukuran centang dan caption tetap sama di
          keduanya.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 16px">
            <div className="space-y-3">
              {berkas.map((b) => (
                <Checkbox key={b.value} label={b.label} defaultChecked={b.value === 'ktp'} />
              ))}
            </div>
          </Demo>
          <Demo label="Mobile · 14px">
            <div className="space-y-3">
              {berkas.map((b) => (
                <Checkbox
                  key={b.value}
                  platform="mobile"
                  label={b.label}
                  defaultChecked={b.value === 'ktp'}
                />
              ))}
            </div>
          </Demo>
        </div>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Warna kotak saat tercentang mengikuti aplikasi yang memakainya; state kosong memakai abu yang sama.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <div className="space-y-3">
                <Checkbox
                  application={a.value}
                  label="Tercentang"
                  helperText={`bg-${a.token}`}
                  defaultChecked
                />
                <Checkbox application={a.value} label="Kosong" />
              </div>
            </Demo>
          ))}
        </div>
      </Section>

      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div className="mx-auto max-w-[420px] space-y-4">
            {berkas.map((b) => (
              <Checkbox
                key={b.value}
                platform={platform}
                state={state}
                application={application}
                label={b.label}
                helperText={withCaption ? 'Unggah berkas asli berwarna, maksimal 2 MB.' : undefined}
                checked={dipilih.includes(b.value)}
                onChange={() => toggle(b.value)}
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
          Berbeda dengan Radio, tiap Checkbox berdiri sendiri — pakai <H>name</H> yang sama hanya bila
          server Anda memang mengharapkan satu daftar nilai dari satu nama.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { Checkbox } from '@tpl/design-kit-react'\n\n"}
          {'{/* Dasar */}\n'}
          {'<Checkbox label="Saya menyetujui syarat" defaultChecked />\n\n'}
          {'{/* Dengan caption */}\n'}
          {'<Checkbox\n'}
          {'    label="Kirim salinan ke email"\n'}
          {'    '}
          <H>helperText</H>
          {'="Tanda terima dikirim setelah permohonan tersimpan."\n'}
          {'/>\n\n'}
          {'{/* Terkendali + warna aplikasi + mobile */}\n'}
          {'<Checkbox\n'}
          {'    '}
          <H>platform</H>
          {'="mobile"\n'}
          {'    '}
          <H>application</H>
          {'="portal"\n'}
          {'    label="KTP elektronik"\n'}
          {'    checked={dipilih.includes("ktp")}\n'}
          {'    onChange={() => toggle("ktp")}\n'}
          {'/>\n\n'}
          {'{/* Inactive — teks meredup sekaligus nonaktif */}\n'}
          {'<Checkbox '}
          <H>state</H>
          {'="inactive" label="Belum tersedia" />'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={checkboxProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
