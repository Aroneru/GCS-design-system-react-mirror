import { useState } from 'react'
import { User } from '../../../../lib/icons/solid'
import {
  FloatingLabel,
  type FloatingLabelApplication,
  type FloatingLabelPlatform,
  type FloatingLabelState,
} from '../../../../lib'
import { PropsTable, type PropRow } from '../../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../../pageKit'

const states: { value: FloatingLabelState; label: string; desc: string }[] = [
  { value: 'default', label: 'Default', desc: 'Field kosong — label duduk di dalam field sebagai placeholder.' },
  { value: 'active', label: 'Active', desc: 'Sedang difokus/berisi — label naik ke garis atas dengan warna aksen.' },
  { value: 'error', label: 'Error', desc: 'Isian ditolak validasi — garis dan label merah.' },
]

const applications: { value: FloatingLabelApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-600' },
  { value: 'portal', label: 'Portal', token: 'blue-portal-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const floatingProps: PropRow[] = [
  ['label', 'ReactNode', '— (wajib)', 'Teks label; turun ke dalam field saat kosong, naik ke garis saat diisi.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah field; jadi pesan kesalahan saat state error.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon di sisi kiri field.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi field: 58px (default) atau 50px (mobile).'],
  ['state', "'default' | 'active' | 'error'", 'default', 'Mengunci tampilan label yang naik; error sekaligus memasang aria-invalid.'],
  ['application', "'default' | 'portal' | 'simaya'", 'default', 'Warna garis dan label saat field aktif.'],
  ['placeholder', 'string', 'undefined', 'Hanya muncul setelah label naik, agar tak bertumpuk dengan label.'],
  ['onClear', '() => void', 'undefined', 'Bila diisi, tombol hapus (×) muncul di kanan field.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input> standar diteruskan (type, value, onChange, …).'],
]

export function FloatingLabelPage() {
  const [platform, setPlatform] = useState<FloatingLabelPlatform>('default')
  const [state, setState] = useState<FloatingLabelState>('default')
  const [application, setApplication] = useState<FloatingLabelApplication>('default')
  const [withIcon, setWithIcon] = useState(true)
  const [value, setValue] = useState('')

  return (
    <ComponentPage
      eyebrow="Form · Input Field Form"
      title="Floating Label"
      description="Isian teks yang labelnya naik ke garis atas begitu field difokus atau berisi — menghemat ruang tanpa menghilangkan keterangan field."
    >
      <Section title="Floating Label">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Saat kosong, label duduk di dalam field dan berperan sebagai placeholder. Begitu field difokus atau berisi,
          label menyusut ke 12px dan naik menimpa garis atas. Tinggi field mengikuti platform — 58px di desktop, 50px di
          mobile.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 58px">
            <div className="space-y-5">
              <FloatingLabel label="Placeholder Text" icon={<User className="size-4" />} onClear={() => {}} />
              <FloatingLabel
                label="Placeholder Text"
                defaultValue="Text Input"
                state="active"
                icon={<User className="size-4" />}
                onClear={() => {}}
              />
            </div>
          </Demo>
          <Demo label="Mobile · 50px">
            <div className="space-y-5">
              <FloatingLabel
                platform="mobile"
                label="Placeholder Text"
                icon={<User className="size-4" />}
                onClear={() => {}}
              />
              <FloatingLabel
                platform="mobile"
                label="Placeholder Text"
                defaultValue="Text Input"
                state="active"
                icon={<User className="size-4" />}
                onClear={() => {}}
              />
            </div>
          </Demo>
        </div>
      </Section>

      <Section title="States">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Tiga kondisi sesuai varian Figma. Klik salah satu field untuk melihat label naik sendiri — <H>state</H> hanya
          perlu diisi untuk mengunci tampilan atau menandai kesalahan. State <H>error</H> memasang{' '}
          <code className="text-xs font-bold text-gray-700">aria-invalid</code> pada input.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {states.map((s) => (
            <Demo key={s.value} label={s.label}>
              <FloatingLabel
                state={s.value}
                label="Placeholder Text"
                defaultValue={s.value === 'default' ? undefined : 'Text Input'}
                helperText={s.value === 'error' ? 'Isian tidak dapat diproses.' : s.desc}
                icon={<User className="size-4" />}
                onClear={() => {}}
              />
            </Demo>
          ))}
        </div>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Garis dan label saat field aktif mengikuti aplikasi yang memakainya, dengan token warna yang sama seperti pada
          Input Field.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <FloatingLabel
                application={a.value}
                state="active"
                label="Placeholder Text"
                defaultValue="Text Input"
                helperText={`border-${a.token}`}
                icon={<User className="size-4" />}
                onClear={() => {}}
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
              platform === 'mobile' ? 'max-w-[348px]' : 'max-w-[364px]'
            }`}
          >
            <FloatingLabel
              platform={platform}
              state={state}
              application={application}
              label="Placeholder Text"
              helperText={state === 'error' ? 'Isian tidak dapat diproses.' : undefined}
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
          Klik field di atas tanpa mengubah prop apa pun: labelnya naik saat difokus dan tetap di atas selama masih ada
          isi. Perhatikan juga posisi label saat turun — ia menyesuaikan diri bila ada ikon kiri.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { FloatingLabel } from '@tpl/design-kit-react'\n"}
          {"import { User } from '@tpl/design-kit-react/icons/solid'\n\n"}
          {'{/* Dasar — label naik sendiri saat difokus atau berisi */}\n'}
          {'<FloatingLabel\n'}
          {'    label="Nama lengkap"\n'}
          {'    icon={<User className="size-4" />}\n'}
          {'/>\n\n'}
          {'{/* Pesan kesalahan — error sekaligus menandai aria-invalid */}\n'}
          {'<FloatingLabel\n'}
          {'    '}
          <H>state</H>
          {'="error"\n'}
          {'    label="Nama lengkap"\n'}
          {'    helperText="Isian tidak dapat diproses."\n'}
          {'/>\n\n'}
          {'{/* Mobile + tombol hapus + warna aksen aplikasi */}\n'}
          {'<FloatingLabel\n'}
          {'    '}
          <H>platform</H>
          {'="mobile"\n'}
          {'    '}
          <H>application</H>
          {'="portal"\n'}
          {'    label="Nama lengkap"\n'}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {'    '}
          <H>onClear</H>
          {"={() => setValue('')}\n"}
          {'/>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={floatingProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
