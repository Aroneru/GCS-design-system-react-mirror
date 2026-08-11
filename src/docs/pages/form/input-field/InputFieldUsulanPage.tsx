import { useState } from 'react'
import { User } from '../../../../lib/icons/solid'
import {
  InputField,
  type InputFieldApplication,
  type InputFieldPlatform,
  type InputFieldState,
} from '../../../../lib'
import { PropsTable, type PropRow } from '../../../PropsTable'
import { Demo, H, Segmented } from '../../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../../usulanKit'
import { adaTanpa } from '../../../usulanOptions'

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

const toc: TocEntry[] = [
  { id: 'input-field', label: 'Input Field' },
  { id: 'states', label: 'States' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function InputFieldUsulanPage() {
  const [platform, setPlatform] = useState<InputFieldPlatform>('default')
  const [state, setState] = useState<InputFieldState>('default')
  const [application, setApplication] = useState<InputFieldApplication>('default')
  const [withIcon, setWithIcon] = useState(true)
  const [withHelper, setWithHelper] = useState(true)
  const [withClear, setWithClear] = useState(true)
  const [value, setValue] = useState('')

  const isFailed = state === 'failed'
  const helper = isFailed ? 'Nama lengkap wajib diisi.' : 'Sesuai yang tertera pada KTP.'

  return (
    <UsulanPage
      eyebrow="Form · Input Field Form"
      title="Input Field"
      description="Isian teks satu baris dengan label di atas field. Tinggi, warna, dan jaraknya memakai token yang sama dengan Foundations."
      toc={toc}
    >
      <FlowSection id="input-field" title="Input Field">
        <Lead>
          Label di atas, field dengan ikon opsional dan tombol hapus, lalu caption di bawah. Tinggi field
          mengikuti platform — 52px di desktop, 40px di mobile.
        </Lead>
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
        <SectionCode>
          {"import { InputField } from '@tpl/design-kit-react'\n"}
          {"import { User } from '@tpl/design-kit-react/icons/solid'\n\n"}
          {'<InputField\n'}
          {'    label="Nama lengkap"\n'}
          {'    placeholder="Masukkan nama lengkap"\n'}
          {'    helperText="Sesuai yang tertera pada KTP."\n'}
          {'    icon={<User className="size-4" />}\n'}
          {'/>\n\n'}
          {'{/* Mobile — field 40px */}\n'}
          {'<InputField '}
          <H>platform</H>
          {'="mobile" label="Nama lengkap" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="states" title="States">
        <Lead>
          Empat kondisi visual field. <H>inactive</H> otomatis menonaktifkan input dan <H>failed</H>{' '}
          menandainya <H>aria-invalid</H>, jadi tampilan dan makna aksesibilitasnya selalu sejalan.
        </Lead>
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
        <SectionCode>
          {'{/* Pesan error — failed sekaligus menandai aria-invalid */}\n'}
          {'<InputField\n'}
          {'    '}
          <H>state</H>
          {'="failed"\n'}
          {'    label="Nama lengkap"\n'}
          {'    helperText="Nama lengkap wajib diisi."\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna garis saat field aktif mengikuti aplikasi yang memakainya — memakai token warna yang sama
          dengan palet Foundations.
        </Lead>
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
        <SectionCode>
          {'<InputField\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    state="typing"\n'}
          {'    label="Nama lengkap"\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        <Stage maxWidth={platform === 'mobile' ? 'max-w-[326px]' : 'max-w-[364px]'}>
          <InputField
            platform={platform}
            state={state}
            application={application}
            label="Nama lengkap"
            placeholder="Masukkan nama lengkap"
            helperText={withHelper ? helper : undefined}
            icon={withIcon ? <User className="size-4" /> : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={withClear ? () => setValue('') : undefined}
          />
        </Stage>

        <Controls>
          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={setPlatform}
              options={[
                { value: 'mobile', label: 'Mobile' },
                { value: 'default', label: 'Desktop' },
              ]}
            />
          </Control>

          <Control label="State">
            <Segmented
              label="Pilih state"
              value={state}
              onChange={setState}
              itemClassName="px-2.5"
              wrap
              options={states.map((s) => ({ value: s.value, label: s.label }))}
            />
          </Control>

          <Control label="Application">
            <Segmented
              label="Pilih aplikasi"
              value={application}
              onChange={setApplication}
              itemClassName="px-2.5"
              options={applications.map((a) => ({ value: a.value, label: a.label }))}
            />
          </Control>

          <Control label="Ikon kiri">
            <Segmented
              label="Tampilkan ikon kiri"
              value={withIcon}
              onChange={setWithIcon}
              options={adaTanpa}
            />
          </Control>

          <Control label="Helper text">
            <Segmented
              label="Tampilkan helper text"
              value={withHelper}
              onChange={setWithHelper}
              options={adaTanpa}
            />
          </Control>

          <Control label="Tombol hapus">
            {/* Mati saat inactive: field yang tidak bisa diisi tidak perlu tombol hapus. */}
            <Segmented
              label="Tampilkan tombol hapus"
              value={withClear}
              onChange={setWithClear}
              disabled={state === 'inactive'}
              options={adaTanpa}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Ketik pada field di atas untuk melihat state <em>typing</em> yang sesungguhnya — garisnya berubah
          lewat <H>focus-within</H>, tanpa perlu mengubah prop. Pada state <em>failed</em>, helper text
          otomatis berganti jadi pesan kesalahan.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { InputField } from '@tpl/design-kit-react'\n"}
          {withIcon && "import { User } from '@tpl/design-kit-react/icons/solid'\n"}
          {'\n'}
          {'<InputField\n'}
          {platform === 'mobile' && (
            <>
              {'    '}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          )}
          {state !== 'default' && (
            <>
              {'    '}
              <H>state</H>
              {`="${state}"\n`}
            </>
          )}
          {application !== 'default' && (
            <>
              {'    '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {'    label="Nama lengkap"\n'}
          {'    placeholder="Masukkan nama lengkap"\n'}
          {withHelper && (
            <>
              {'    '}
              <H>helperText</H>
              {`="${helper}"\n`}
            </>
          )}
          {withIcon && (
            <>
              {'    '}
              <H>icon</H>
              {'={<User className="size-4" />}\n'}
            </>
          )}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {withClear && state !== 'inactive' && (
            <>
              {'    '}
              <H>onClear</H>
              {"={() => setValue('')}\n"}
            </>
          )}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut <H>&lt;input&gt;</H>{' '}
          standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={inputProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  )
}
