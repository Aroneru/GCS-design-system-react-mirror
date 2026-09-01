import { useState } from 'react'
import {
  Checkbox,
  type CheckboxApplication,
  type CheckboxPlatform,
  type CheckboxState,
} from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Segmented } from '../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'

const applications: { value: CheckboxApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
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
  ['application', "'default' | 'simaya'", 'default', 'Warna kotak saat tercentang.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="checkbox"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

const toc: TocEntry[] = [
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'caption', label: 'Dengan caption' },
  { id: 'platform', label: 'Platform' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
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
    <UsulanPage
      eyebrow="Form"
      title="Checkbox"
      description="Pilihan ganda yang bisa dicentang secara mandiri. Dibangun di atas <input type='checkbox'> bawaan supaya keyboard dan pembaca layar tetap berfungsi, dengan warna, ukuran, dan jarak dari Foundations."
      toc={toc}
    >
      <FlowSection id="checkbox" title="Checkbox">
        <Lead>
          Kotak 16px beradius 4px, berlatar gray-50 dengan garis gray-300. Saat dicentang, kotaknya terisi
          warna aksen dan centang putih 10px muncul di tengahnya.
        </Lead>
        <Demo>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Checkbox label="Belum dicentang" />
            <Checkbox label="Sudah dicentang" defaultChecked />
            <Checkbox state="inactive" label="Tidak aktif" />
            <Checkbox state="inactive" label="Tidak aktif, tercentang" defaultChecked />
          </div>
        </Demo>
        <SectionCode>
          {"import { Checkbox } from '@stasi/design-kit-react'\n\n"}
          {'<Checkbox label="Saya menyetujui syarat" defaultChecked />\n\n'}
          {'{/* Inactive — teks meredup sekaligus nonaktif */}\n'}
          {'<Checkbox '}
          <H>state</H>
          {'="inactive" label="Belum tersedia" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="caption" title="Dengan caption">
        <Lead>
          Isi <H>helperText</H> untuk menerangkan pilihan — berguna saat satu centang punya konsekuensi yang
          perlu dijelaskan. Kotak tetap sejajar dengan baris pertama label.
        </Lead>
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
        <SectionCode>
          {'<Checkbox\n'}
          {'    label="Kirim salinan ke email"\n'}
          {'    '}
          <H>helperText</H>
          {'="Tanda terima dikirim setelah permohonan tersimpan."\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>
          Platform mobile memakai kotak 14px dengan label 12px; ukuran centang dan caption tetap sama di
          keduanya.
        </Lead>
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
        <SectionCode>
          {'<Checkbox '}
          <H>platform</H>
          {'="mobile" label="KTP elektronik" defaultChecked />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna kotak saat tercentang mengikuti aplikasi yang memakainya; state kosong memakai abu yang
          sama.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
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
        <SectionCode>
          {'<Checkbox '}
          <H>application</H>
          {'="simaya" label="KTP elektronik" defaultChecked />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Sekelompok checkbox yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        {/* max-w-fit: blok menyusut seukuran isinya, jadi mx-auto benar-benar memusatkannya. */}
        <Stage maxWidth="max-w-fit">
          <div className="space-y-4">
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
              options={[
                { value: 'default', label: 'Default' },
                { value: 'inactive', label: 'Inactive' },
              ]}
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

          <Control label="Caption">
            <Segmented
              label="Tampilkan caption"
              value={withCaption}
              onChange={setWithCaption}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Berbeda dengan Radio, tiap Checkbox berdiri sendiri — pakai <H>name</H> yang sama hanya bila
          server Anda memang mengharapkan satu daftar nilai dari satu nama.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Checkbox } from '@stasi/design-kit-react'\n\n"}
          {'<Checkbox\n'}
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
              {'="inactive"\n'}
            </>
          )}
          {application !== 'default' && (
            <>
              {'    '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {'    label="KTP elektronik"\n'}
          {withCaption && (
            <>
              {'    '}
              <H>helperText</H>
              {'="Unggah berkas asli berwarna, maksimal 2 MB."\n'}
            </>
          )}
          {'    checked={dipilih.includes("ktp")}\n'}
          {'    onChange={() => toggle("ktp")}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;input type=&quot;checkbox&quot;&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={checkboxProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
