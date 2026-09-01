import { useState } from 'react'
import { User } from '../../../../lib/icons/solid'
import {
  FloatingLabel,
  type FloatingLabelApplication,
  type FloatingLabelPlatform,
  type FloatingLabelState,
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
import { adaTidakAda } from '../../../usulanOptions'

const states: { value: FloatingLabelState; label: string; desc: string }[] = [
  { value: 'default', label: 'Default', desc: 'Field kosong — label duduk di dalam field sebagai placeholder.' },
  { value: 'active', label: 'Active', desc: 'Sedang difokus/berisi — label naik ke garis atas dengan warna aksen.' },
  { value: 'error', label: 'Error', desc: 'Isian ditolak validasi — garis dan label merah.' },
]

const applications: { value: FloatingLabelApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-600' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const floatingProps: PropRow[] = [
  ['label', 'ReactNode', '— (wajib)', 'Teks label; turun ke dalam field saat kosong, naik ke garis saat diisi.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah field; jadi pesan kesalahan saat state error.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon di sisi kiri field.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi field: 58px (default) atau 50px (mobile).'],
  ['state', "'default' | 'active' | 'error'", 'default', 'Mengunci tampilan label yang naik; error sekaligus memasang aria-invalid.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna garis dan label saat field aktif.'],
  ['placeholder', 'string', 'undefined', 'Hanya muncul setelah label naik, agar tak bertumpuk dengan label.'],
  ['onClear', '() => void', 'undefined', 'Bila diisi, tombol hapus (×) muncul di kanan field.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input> standar diteruskan (type, value, onChange, …).'],
]

const toc: TocEntry[] = [
  { id: 'floating-label', label: 'Floating Label' },
  { id: 'states', label: 'States' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function FloatingLabelPage() {
  const [platform, setPlatform] = useState<FloatingLabelPlatform>('default')
  const [state, setState] = useState<FloatingLabelState>('default')
  const [application, setApplication] = useState<FloatingLabelApplication>('default')
  const [withIcon, setWithIcon] = useState(true)
  const [withHelper, setWithHelper] = useState(true)
  const [withClear, setWithClear] = useState(true)
  const [value, setValue] = useState('')

  const helper = state === 'error' ? 'Isian tidak dapat diproses.' : 'Sesuai yang tertera pada KTP.'

  return (
    <UsulanPage
      eyebrow="Form · Input Field Form"
      title="Floating Label"
      description="Isian teks yang labelnya naik ke garis atas begitu field difokus atau berisi — menghemat ruang tanpa menghilangkan keterangan field."
      toc={toc}
    >
      <FlowSection id="floating-label" title="Floating Label">
        <Lead>
          Saat kosong, label duduk di dalam field dan berperan sebagai placeholder. Begitu field difokus
          atau berisi, label menyusut ke 12px dan naik menimpa garis atas. Tinggi field mengikuti platform —
          58px di desktop, 50px di mobile.
        </Lead>
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
        <SectionCode>
          {"import { FloatingLabel } from '@stasi/design-kit-react'\n"}
          {"import { User } from '@stasi/design-kit-react/icons/solid'\n\n"}
          {'{/* Label naik sendiri saat difokus atau berisi */}\n'}
          {'<FloatingLabel\n'}
          {'    label="Nama lengkap"\n'}
          {'    icon={<User className="size-4" />}\n'}
          {'/>\n\n'}
          {'{/* Mobile — field 50px */}\n'}
          {'<FloatingLabel '}
          <H>platform</H>
          {'="mobile" label="Nama lengkap" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="states" title="States">
        <Lead>
          Tiga kondisi visual field. Klik salah satu field untuk melihat label naik sendiri — <H>state</H>{' '}
          hanya perlu diisi untuk mengunci tampilan atau menandai kesalahan. State <H>error</H> memasang{' '}
          <H>aria-invalid</H> pada input.
        </Lead>
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
        <SectionCode>
          {'{/* Pesan kesalahan — error sekaligus menandai aria-invalid */}\n'}
          {'<FloatingLabel\n'}
          {'    '}
          <H>state</H>
          {'="error"\n'}
          {'    label="Nama lengkap"\n'}
          {'    helperText="Isian tidak dapat diproses."\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Garis dan label saat field aktif mengikuti aplikasi yang memakainya, dengan token warna yang sama
          seperti pada Input Field.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
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
        <SectionCode>
          {'<FloatingLabel\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    state="active"\n'}
          {'    label="Nama lengkap"\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        <Stage maxWidth={platform === 'mobile' ? 'max-w-[348px]' : 'max-w-[364px]'}>
          <FloatingLabel
            platform={platform}
            state={state}
            application={application}
            label="Placeholder Text"
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
              options={adaTidakAda}
            />
          </Control>

          <Control label="Helper text">
            <Segmented
              label="Tampilkan helper text"
              value={withHelper}
              onChange={setWithHelper}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tombol hapus">
            <Segmented
              label="Tampilkan tombol hapus"
              value={withClear}
              onChange={setWithClear}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Klik field di atas tanpa mengubah prop apa pun: labelnya naik saat difokus dan tetap di atas
          selama masih ada isi. Perhatikan juga posisi label saat turun — ia menyesuaikan diri bila ada ikon
          kiri.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { FloatingLabel } from '@stasi/design-kit-react'\n"}
          {withIcon && "import { User } from '@stasi/design-kit-react/icons/solid'\n"}
          {'\n'}
          {'<FloatingLabel\n'}
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
          {'    label="Placeholder Text"\n'}
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
          {withClear && (
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
        <PropsTable rows={floatingProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
