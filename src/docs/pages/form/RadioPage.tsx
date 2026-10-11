import { useState } from 'react'
import { Radio, type RadioApplication, type RadioPlatform, type RadioState } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../pageKit'
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

const applications: { value: RadioApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
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
  ['application', "'default' | 'simaya'", 'default', 'Warna cincin saat pilihan dipilih.'],
  ['darkMode', 'boolean', 'false', 'Tampilan gelap: lingkaran gray-300 bergaris gray-400 dengan label terang; inactive gray-800 dengan teks gray-600.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="radio"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

const toc: TocEntry[] = [
  { id: 'radio-button', label: 'Radio Button' },
  { id: 'caption', label: 'Dengan caption' },
  { id: 'platform', label: 'Platform' },
  { id: 'application', label: 'Application' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function RadioPage() {
  const [platform, setPlatform] = useState<RadioPlatform>('default')
  const [state, setState] = useState<RadioState>('default')
  const [application, setApplication] = useState<RadioApplication>('default')
  const [withCaption, setWithCaption] = useState(false)
  const [dark, setDark] = useState(false)
  const [pilihan, setPilihan] = useState('wni')

  return (
    <UsulanPage
      eyebrow="Form"
      title="Radio Button"
      description="Pilihan tunggal dari beberapa opsi yang saling meniadakan. Dibangun di atas <input type='radio'> bawaan supaya navigasi panah dan pembaca layar tetap berfungsi, dengan warna, ukuran, dan jarak dari Foundations. Tersedia juga dalam tampilan gelap."
      toc={toc}
    >
      <FlowSection id="radio-button" title="Radio Button">
        <Lead>
          Lingkaran 16px berlatar gray-50 dengan garis gray-300. Saat dipilih, garisnya menebal jadi 3,5px
          berwarna aksen — sisa ruang di tengah (9px) itulah yang tampak sebagai titik. State{' '}
          <Hl>inactive</Hl> memakai latar gray-100 dan cincin gray-400, sekaligus mematikan kontrolnya.
        </Lead>
        <Demo>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Radio name="ds-radio-dasar" label="Belum dipilih" />
            <Radio name="ds-radio-dasar" label="Sedang dipilih" defaultChecked />
            <Radio name="ds-radio-nonaktif" state="inactive" label="Tidak aktif" />
            <Radio
              name="ds-radio-nonaktif-terpilih"
              state="inactive"
              label="Tidak aktif, terpilih"
              defaultChecked
            />
          </div>
        </Demo>
        <SectionCode>
          {"import { Radio } from '@ceplok-ui/design-kit-react'\n\n"}
          {'{/* Sekelompok pilihan: samakan name-nya */}\n'}
          {'<Radio '}
          <H>name</H>
          {'="pilihan" label="Belum dipilih" />\n'}
          {'<Radio '}
          <H>name</H>
          {'="pilihan" label="Sedang dipilih" defaultChecked />\n\n'}
          {'{/* Inactive — meredup sekaligus nonaktif */}\n'}
          {'<Radio name="pilihan-nonaktif" '}
          <H>state</H>
          {'="inactive" label="Tidak aktif" />\n'}
          {'<Radio name="pilihan-nonaktif" '}
          <H>state</H>
          {'="inactive" label="Tidak aktif, terpilih" defaultChecked />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="caption" title="Dengan caption">
        <Lead>
          Isi <Hl>helperText</Hl> untuk menambahkan keterangan 12px di bawah label — berguna saat pilihannya
          perlu penjelasan. Lingkaran tetap sejajar dengan baris pertama label.
        </Lead>
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
        <SectionCode>
          {'<Radio\n'}
          {'    name="kewarganegaraan"\n'}
          {'    label="Warga negara Indonesia"\n'}
          {'    '}
          <H>helperText</H>
          {'="Wajib melampirkan KTP elektronik yang masih berlaku."\n'}
          {'    defaultChecked\n'}
          {'/>\n'}
          {'<Radio\n'}
          {'    name="kewarganegaraan"\n'}
          {'    label="Warga negara asing"\n'}
          {'    '}
          <H>helperText</H>
          {'="Wajib melampirkan paspor dan izin tinggal."\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>
          Platform mobile memakai lingkaran 14px dengan label 12px; ukuran caption tetap 12px di keduanya.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 16px">
            <div className="space-y-3">
              {kewarganegaraan.map((o) => (
                <Radio
                  key={o.value}
                  name="ds-radio-desktop"
                  label={o.label}
                  defaultChecked={o.value === 'wni'}
                />
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
        <SectionCode>
          {'{/* Desktop — platform bawaan, tanpa prop */}\n'}
          {'<Radio name="wn-desktop" label="Warga negara Indonesia" defaultChecked />\n'}
          {'<Radio name="wn-desktop" label="Warga negara asing" />\n\n'}
          {'{/* Mobile */}\n'}
          {'<Radio '}
          <H>platform</H>
          {'="mobile" name="wn-mobile" label="Warga negara Indonesia" defaultChecked />\n'}
          {'<Radio '}
          <H>platform</H>
          {'="mobile" name="wn-mobile" label="Warga negara asing" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna cincin saat dipilih mengikuti aplikasi yang memakainya. Lingkaran yang belum dipilih —
          gray-50 bergaris gray-300 — sama di kedua aplikasi.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
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
        <SectionCode>
          {'{/* Default — tanpa prop application */}\n'}
          {'<Radio name="pilihan-default" label="Dipilih" helperText="border-primary-700" defaultChecked />\n'}
          {'<Radio name="pilihan-default" label="Belum dipilih" />\n\n'}
          {'{/* simaya */}\n'}
          {'<Radio\n'}
          {'    name="pilihan-simaya"\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    label="Dipilih"\n'}
          {'    helperText="border-purple-500"\n'}
          {'    defaultChecked\n'}
          {'/>\n'}
          {'<Radio name="pilihan-simaya" '}
          <H>application</H>
          {'="simaya" label="Belum dipilih" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Prop <Hl>darkMode</Hl> mengganti lingkaran ke gray-300 bergaris gray-400, dengan label terang dan
          caption gray-400. Cincin pilihan aktif tetap memakai warna aplikasi. State <Hl>inactive</Hl> memakai
          lingkaran gray-800 dengan teks gray-600.
        </Lead>
        <Demo dark>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Radio darkMode name="ds-radio-gelap" label="Belum dipilih" helperText="Keterangan singkat." />
            <Radio
              darkMode
              name="ds-radio-gelap"
              label="Sedang dipilih"
              helperText="Keterangan singkat."
              defaultChecked
            />
            <Radio
              darkMode
              name="ds-radio-gelap-nonaktif"
              state="inactive"
              label="Tidak aktif"
              helperText="Keterangan singkat."
            />
            <Radio
              darkMode
              name="ds-radio-gelap-nonaktif-terpilih"
              state="inactive"
              label="Tidak aktif, terpilih"
              helperText="Keterangan singkat."
              defaultChecked
            />
          </div>
        </Demo>
        <SectionCode>
          {'<Radio '}
          <H>darkMode</H>
          {' name="pilihan-gelap" label="Belum dipilih" helperText="Keterangan singkat." />\n'}
          {'<Radio\n'}
          {'    '}
          <H>darkMode</H>
          {'\n'}
          {'    name="pilihan-gelap"\n'}
          {'    label="Sedang dipilih"\n'}
          {'    helperText="Keterangan singkat."\n'}
          {'    defaultChecked\n'}
          {'/>\n\n'}
          {'{/* Inactive */}\n'}
          {'<Radio\n'}
          {'    '}
          <H>darkMode</H>
          {'\n'}
          {'    name="pilihan-gelap-nonaktif"\n'}
          {'    state="inactive"\n'}
          {'    label="Tidak aktif"\n'}
          {'    helperText="Keterangan singkat."\n'}
          {'/>\n'}
          {'<Radio\n'}
          {'    '}
          <H>darkMode</H>
          {'\n'}
          {'    name="pilihan-gelap-nonaktif"\n'}
          {'    state="inactive"\n'}
          {'    label="Tidak aktif, terpilih"\n'}
          {'    helperText="Keterangan singkat."\n'}
          {'    defaultChecked\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu kelompok pilihan yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan
          langsung terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        {/*
          max-w-fit, bukan lebar tetap: kolom 420px membuat kelompok pilihan
          menempel di tepi kirinya dan tampak melenceng dari tengah kartu.
          Dengan fit-content, blok menyusut seukuran isinya lalu mx-auto
          benar-benar memusatkannya.
        */}
        <Stage maxWidth="max-w-fit" dark={dark}>
          <div className="space-y-4">
            {kewarganegaraan.map((o) => (
              <Radio
                key={o.value}
                name="ds-radio-playground"
                platform={platform}
                state={state}
                application={application}
                darkMode={dark}
                label={o.label}
                helperText={withCaption ? 'Keterangan singkat tentang pilihan ini.' : undefined}
                checked={pilihan === o.value}
                onChange={() => setPilihan(o.value)}
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

          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan"
              value={dark}
              onChange={setDark}
              options={[
                { value: false, label: 'Light' },
                { value: true, label: 'Dark' },
              ]}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Satu kelompok pilihan dibentuk dengan memberi <Hl>name</Hl> yang sama pada tiap Radio — sama seperti
          formulir HTML biasa, jadi panah atas/bawah otomatis berpindah antar-opsi.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Radio } from '@ceplok-ui/design-kit-react'\n\n"}
          {'{/* kewarganegaraan = [{ value: "wni", label: "Warga negara Indonesia" }, …] */}\n'}
          {'{kewarganegaraan.map((o) => (\n'}
          {'    <Radio\n'}
          {'        key={o.value}\n'}
          {'        name="kewarganegaraan"\n'}
          {platform === 'mobile' && (
            <>
              {'        '}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          )}
          {state !== 'default' && (
            <>
              {'        '}
              <H>state</H>
              {'="inactive"\n'}
            </>
          )}
          {application !== 'default' && (
            <>
              {'        '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {dark && (
            <>
              {'        '}
              <H>darkMode</H>
              {'\n'}
            </>
          )}
          {'        label={o.label}\n'}
          {withCaption && (
            <>
              {'        '}
              <H>helperText</H>
              {'="Keterangan singkat tentang pilihan ini."\n'}
            </>
          )}
          {'        checked={pilihan === o.value}\n'}
          {'        onChange={() => setPilihan(o.value)}\n'}
          {'    />\n'}
          {'))}'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <Hl>&lt;input type=&quot;radio&quot;&gt;</Hl> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={radioProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
