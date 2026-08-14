import { useState } from 'react'
import { Toggle, type ToggleApplication, type TogglePlatform, type ToggleState } from '../../../lib'
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
import { adaTanpa } from '../../usulanOptions'

const applications: { value: ToggleApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const toggleProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks di samping sakelar.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption 12px di bawah label.'],
  ['platform', "'default' | 'mobile'", 'default', 'Ukuran sakelar: 40×20px atau 36×18px.'],
  ['state', "'default' | 'inactive'", 'default', 'Inactive meredupkan tampilan sekaligus menonaktifkan kontrol.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna jalur saat sakelar menyala.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="checkbox"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

const toc: TocEntry[] = [
  { id: 'toggle-button', label: 'Toggle Button' },
  { id: 'caption', label: 'Dengan caption' },
  { id: 'platform', label: 'Platform' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function TogglePage() {
  const [platform, setPlatform] = useState<TogglePlatform>('default')
  const [state, setState] = useState<ToggleState>('default')
  const [application, setApplication] = useState<ToggleApplication>('default')
  const [withCaption, setWithCaption] = useState(false)
  const [aktif, setAktif] = useState(true)

  return (
    <UsulanPage
      eyebrow="Form"
      title="Toggle Button"
      description="Sakelar untuk menyalakan atau mematikan satu pengaturan, berlaku seketika tanpa tombol simpan. Dibangun di atas <input type='checkbox'> dengan role='switch' supaya keyboard dan pembaca layar tetap berfungsi."
      toc={toc}
    >
      <FlowSection id="toggle-button" title="Toggle Button">
        <Lead>
          Jalur 40×20px dengan bulatan putih 16px yang menyisakan 2px di tiap sisi. Saat mati jalurnya
          gray-200; saat menyala ia berganti ke warna aksen dan bulatannya bergeser 20px ke kanan.
        </Lead>
        <Demo>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Toggle label="Mati" />
            <Toggle label="Menyala" defaultChecked />
            <Toggle state="inactive" label="Tidak aktif" />
            <Toggle state="inactive" label="Tidak aktif, menyala" defaultChecked />
          </div>
        </Demo>
        <SectionCode>
          {"import { Toggle } from '@tpl/design-kit-react'\n\n"}
          {'{/* Menyala sejak awal */}\n'}
          {'<Toggle label="Notifikasi email" defaultChecked />\n\n'}
          {'{/* Inactive — meredup sekaligus nonaktif */}\n'}
          {'<Toggle '}
          <H>state</H>
          {'="inactive" label="Belum tersedia" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="caption" title="Dengan caption">
        <Lead>
          Isi <H>helperText</H> untuk menerangkan akibat dari menyalakan pengaturan — berguna karena sakelar
          berlaku langsung tanpa konfirmasi.
        </Lead>
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
        <SectionCode>
          {'<Toggle\n'}
          {'    label="Tampilkan data sensitif"\n'}
          {'    '}
          <H>helperText</H>
          {'="NIK dan nomor telepon ditampilkan penuh pada tabel."\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>
          Platform mobile memakai sakelar 36×18px dengan bulatan 14px dan label 12px; ukuran caption tetap
          12px di keduanya.
        </Lead>
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
        <SectionCode>
          {'<Toggle '}
          <H>platform</H>
          {'="mobile" label="Notifikasi email" defaultChecked />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna jalur saat menyala mengikuti aplikasi yang memakainya; state mati dan inactive memakai abu
          yang sama.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <div className="space-y-3">
                <Toggle application={a.value} label="Menyala" helperText={`bg-${a.token}`} defaultChecked />
                <Toggle application={a.value} label="Mati" />
              </div>
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<Toggle '}
          <H>application</H>
          {'="simaya" label="Notifikasi email" defaultChecked />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        {/* max-w-fit: blok menyusut seukuran isinya, jadi mx-auto benar-benar memusatkannya. */}
        <Stage maxWidth="max-w-fit">
          <Toggle
            platform={platform}
            state={state}
            application={application}
            label="Notifikasi email"
            helperText={withCaption ? 'Kirim ringkasan permohonan baru setiap pagi.' : undefined}
            checked={aktif}
            onChange={(e) => setAktif(e.target.checked)}
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
              options={adaTanpa}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Kondisi mati dan menyala diatur lewat <H>checked</H> seperti checkbox biasa — bukan lewat prop{' '}
          <H>state</H>, yang hanya menangani <em>inactive</em>.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Toggle } from '@tpl/design-kit-react'\n\n"}
          {'<Toggle\n'}
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
          {'    label="Notifikasi email"\n'}
          {withCaption && (
            <>
              {'    '}
              <H>helperText</H>
              {'="Kirim ringkasan permohonan baru setiap pagi."\n'}
            </>
          )}
          {'    checked={aktif}\n'}
          {'    onChange={(e) => setAktif(e.target.checked)}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;input type=&quot;checkbox&quot;&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={toggleProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
