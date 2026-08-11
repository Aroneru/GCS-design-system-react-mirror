import { useState } from 'react'
import { User } from '../../../../lib/icons/solid'
import {
  InputField,
  type InputFieldApplication,
  type InputFieldPlatform,
  type InputFieldState,
} from '../../../../lib'
import { PropsTable, type PropRow } from '../../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../../pageKit'

const states: { value: InputFieldState; label: string; desc: string }[] = [
  { value: 'default', label: 'Default', desc: 'Belum disentuh — garis abu-abu netral.' },
  { value: 'typing', label: 'Typing', desc: 'Sedang diisi/difokus — garis memakai warna aplikasi.' },
  { value: 'inactive', label: 'Inactive', desc: 'Tidak bisa diisi; seluruh teks meredup.' },
  { value: 'failed', label: 'Failed', desc: 'Isian ditolak validasi — latar dan teks merah.' },
]

const applications: { value: InputFieldApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const inputProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas field.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah field; jadi pesan error saat state failed.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon di sisi kiri field.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi field: 52px (default) atau 40px (mobile).'],
  ['state', "'default' | 'typing' | 'inactive' | 'failed'", 'default', 'Kondisi visual field.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna garis aksen saat field aktif.'],
  ['onClear', '() => void', 'undefined', 'Bila diisi, tombol hapus (×) muncul di kanan field.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input> standar diteruskan (type, value, onChange, …).'],
]

export function InputFieldPage() {
  const [platform, setPlatform] = useState<InputFieldPlatform>('default')
  const [state, setState] = useState<InputFieldState>('default')
  const [application, setApplication] = useState<InputFieldApplication>('default')
  const [withIcon, setWithIcon] = useState(true)
  const [value, setValue] = useState('')

  return (
    <ComponentPage
      eyebrow="Form · Input Field Form"
      title="Input Field"
      description="Isian teks satu baris dengan label di atas field. Tinggi, warna, dan jaraknya memakai token yang sama dengan Foundations."
    >
      <Section title="Input Field">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Isian teks satu baris: label di atas, field dengan ikon opsional dan tombol hapus, lalu caption di bawah.
          Tinggi field mengikuti platform — 52px di desktop, 40px di mobile.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 52px">
            <InputField
              label="Nama lengkap"
              placeholder="Masukkan nama lengkap"
              helperText="Sesuai yang tertera pada KTP."
              icon={<User className="size-4" />}
            />
          </Demo>
          <Demo label="Mobile · 40px">
            <InputField
              platform="mobile"
              label="Nama lengkap"
              placeholder="Masukkan nama lengkap"
              helperText="Sesuai yang tertera pada KTP."
              icon={<User className="size-4" />}
            />
          </Demo>
        </div>
      </Section>

      <Section title="States">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Empat kondisi sesuai varian Figma. <H>inactive</H> otomatis menonaktifkan input dan <H>failed</H> menandainya{' '}
          <code className="text-xs font-bold text-gray-700">aria-invalid</code>, jadi tampilan dan makna aksesibilitasnya
          selalu sejalan.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {states.map((s) => (
            <Demo key={s.value} label={s.label}>
              <InputField
                state={s.value}
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                helperText={s.value === 'failed' ? 'Nama lengkap wajib diisi.' : s.desc}
                icon={<User className="size-4" />}
              />
            </Demo>
          ))}
        </div>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Warna garis saat field aktif mengikuti aplikasi yang memakainya — memakai token warna yang sama dengan palet
          Foundations.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <InputField
                application={a.value}
                state="typing"
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                helperText={`border-${a.token}`}
                icon={<User className="size-4" />}
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
              platform === 'mobile' ? 'max-w-[326px]' : 'max-w-[364px]'
            }`}
          >
            <InputField
              platform={platform}
              state={state}
              application={application}
              label="Nama lengkap"
              placeholder="Masukkan nama lengkap"
              helperText={state === 'failed' ? 'Nama lengkap wajib diisi.' : 'Sesuai yang tertera pada KTP.'}
              icon={withIcon ? <User className="size-4" /> : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onClear={() => setValue('')}
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
                itemClassName="px-2.5"
                wrap
                options={states.map((s) => ({ value: s.value, label: s.label }))}
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
            <ControlLabel>Ikon kiri</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan ikon kiri"
                value={withIcon}
                onChange={setWithIcon}
                options={[
                  { value: true, label: 'Ada' },
                  { value: false, label: 'Tanpa' },
                ]}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Ketik pada field di atas untuk melihat state <em>typing</em> yang sesungguhnya — garisnya berubah lewat{' '}
          <code className="text-xs font-bold text-gray-700">focus-within</code>, tanpa perlu mengubah prop.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { InputField } from '@tpl/design-kit-react'\n"}
          {"import { User } from '@tpl/design-kit-react/icons/solid'\n\n"}
          {'{/* Dasar: label + caption + ikon */}\n'}
          {'<InputField\n'}
          {'    label="Nama lengkap"\n'}
          {'    placeholder="Masukkan nama lengkap"\n'}
          {'    helperText="Sesuai yang tertera pada KTP."\n'}
          {'    icon={<User className="size-4" />}\n'}
          {'/>\n\n'}
          {'{/* Pesan error — state failed sekaligus menandai aria-invalid */}\n'}
          {'<InputField\n'}
          {'    '}
          <H>state</H>
          {'="failed"\n'}
          {'    label="Nama lengkap"\n'}
          {'    helperText="Nama lengkap wajib diisi."\n'}
          {'/>\n\n'}
          {'{/* Mobile + tombol hapus + warna aksen aplikasi */}\n'}
          {'<InputField\n'}
          {'    '}
          <H>platform</H>
          {'="mobile"\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {'    '}
          <H>onClear</H>
          {"={() => setValue('')}\n"}
          {'/>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={inputProps} minWidth="46rem" />
      </Section>
    </ComponentPage>
  )
}
