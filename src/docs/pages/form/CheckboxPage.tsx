import { useState } from 'react'
import {
  Checkbox,
  type CheckboxApplication,
  type CheckboxPlatform,
  type CheckboxState,
} from '../../../lib'
import { tocForDarkDocs, useDarkModeSnippet, useDocsDark, usePlaygroundDark } from '../../docsTheme'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  ModeSection,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'

const applications: { value: CheckboxApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'purple', label: 'Purple', token: 'purple-500' },
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
  ['application', "'default' | 'purple'", 'default', 'Warna kotak saat tercentang.'],
  ['darkMode', 'boolean', 'false', 'Tampilan gelap: kotak gray-700 bergaris gray-600 dengan label putih; inactive meredupkan teksnya ke gray-500.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="checkbox"> diteruskan (name, checked, defaultChecked, onChange, …).'],
]

const toc: TocEntry[] = [
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'caption', label: 'Dengan caption' },
  { id: 'platform', label: 'Platform' },
  { id: 'application', label: 'Application' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const tocDark = tocForDarkDocs(toc, true)

export function CheckboxPage() {
  // Contoh di halaman ini mengikuti mode docs; aturannya di docsTheme.ts.
  const docsDark = useDocsDark()
  const dm = useDarkModeSnippet()
  const [platform, setPlatform] = useState<CheckboxPlatform>('default')
  const [state, setState] = useState<CheckboxState>('default')
  const [application, setApplication] = useState<CheckboxApplication>('default')
  const [withCaption, setWithCaption] = useState(false)
  const [dark, setDark] = usePlaygroundDark()
  const [dipilih, setDipilih] = useState<string[]>(['ktp'])

  const toggle = (value: string) =>
    setDipilih((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  // Potongan `darkMode` di cuplikan bagian Dark mode, sebagai atribut sebaris
  // dan sebagai baris sendiri.
  const atributDarkMode = (
    <>
      <H>darkMode</H>{' '}
    </>
  )
  const barisDarkMode = (
    <>
      {'    '}
      <H>darkMode</H>
      {'\n'}
    </>
  )

  return (
    <UsulanPage
      eyebrow="Form"
      title="Checkbox"
      description="Pilihan ganda yang bisa dicentang secara mandiri. Dibangun di atas <input type='checkbox'> bawaan supaya keyboard dan pembaca layar tetap berfungsi, dengan warna, ukuran, dan jarak dari Foundations. Tersedia juga dalam tampilan gelap."
      toc={docsDark ? tocDark : toc}
    >
      <FlowSection id="checkbox" title="Checkbox">
        <Lead>
          Kotak 16px beradius 4px, berlatar gray-50 dengan garis gray-300. Saat dicentang, kotaknya terisi
          warna aksen dan centang putih 10px muncul di tengahnya.
        </Lead>
        <Demo>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Checkbox label="Belum dicentang" darkMode={docsDark} />
            <Checkbox label="Sudah dicentang" defaultChecked darkMode={docsDark} />
            <Checkbox state="inactive" label="Tidak aktif" darkMode={docsDark} />
            <Checkbox state="inactive" label="Tidak aktif, tercentang" defaultChecked darkMode={docsDark} />
          </div>
        </Demo>
        <SectionCode>
          {"import { Checkbox } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<Checkbox label="Belum dicentang"'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox label="Sudah dicentang" '}
          <H>defaultChecked</H>
          {dm.inline}
          {' />\n\n'}
          {'{/* Inactive — teks meredup sekaligus nonaktif */}\n'}
          {'<Checkbox '}
          <H>state</H>
          {'="inactive" label="Tidak aktif"'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox '}
          <H>state</H>
          {'="inactive" label="Tidak aktif, tercentang" defaultChecked'}
          {dm.inline}
          {' />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="caption" title="Dengan caption">
        <Lead>
          Isi <Hl>helperText</Hl> untuk menerangkan pilihan — berguna saat satu centang punya konsekuensi yang
          perlu dijelaskan. Kotak tetap sejajar dengan baris pertama label.
        </Lead>
        <Demo>
          <div className="space-y-4">
            <Checkbox
              label="Saya menyetujui syarat dan ketentuan"
              helperText="Termasuk pemrosesan data pribadi sesuai kebijakan privasi."
              defaultChecked
              darkMode={docsDark}
            />
            <Checkbox
              label="Kirim salinan ke email"
              helperText="Tanda terima dikirim setelah permohonan tersimpan."
              darkMode={docsDark}
            />
          </div>
        </Demo>
        <SectionCode>
          {'<Checkbox\n'}
          {'    label="Saya menyetujui syarat dan ketentuan"\n'}
          {'    '}
          <H>helperText</H>
          {'="Termasuk pemrosesan data pribadi sesuai kebijakan privasi."\n'}
          {'    defaultChecked\n'}
          {dm.line}
          {'/>\n'}
          {'<Checkbox\n'}
          {'    label="Kirim salinan ke email"\n'}
          {'    '}
          <H>helperText</H>
          {'="Tanda terima dikirim setelah permohonan tersimpan."\n'}
          {dm.line}
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
                <Checkbox key={b.value} label={b.label} defaultChecked={b.value === 'ktp'} darkMode={docsDark} />
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
                  darkMode={docsDark}
                />
              ))}
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'{/* Desktop — platform bawaan, tanpa prop */}\n'}
          {'<Checkbox label="KTP elektronik" defaultChecked'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox label="Kartu keluarga"'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox label="NPWP"'}
          {dm.inline}
          {' />\n\n'}
          {'{/* Mobile */}\n'}
          {'<Checkbox '}
          <H>platform</H>
          {'="mobile" label="KTP elektronik" defaultChecked'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox '}
          <H>platform</H>
          {'="mobile" label="Kartu keluarga"'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox '}
          <H>platform</H>
          {'="mobile" label="NPWP"'}
          {dm.inline}
          {' />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna kotak saat tercentang mengikuti aplikasi yang memakainya. Kotak yang kosong — gray-50
          bergaris gray-300 — sama di kedua aplikasi.
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
                  darkMode={docsDark}
                />
                <Checkbox application={a.value} label="Kosong" darkMode={docsDark} />
              </div>
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'{/* Default — tanpa prop application */}\n'}
          {'<Checkbox label="Tercentang" helperText="bg-primary-700" defaultChecked'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox label="Kosong"'}
          {dm.inline}
          {' />\n\n'}
          {'{/* Purple */}\n'}
          {'<Checkbox '}
          <H>application</H>
          {'="purple" label="Tercentang" helperText="bg-purple-500" defaultChecked'}
          {dm.inline}
          {' />\n'}
          {'<Checkbox '}
          <H>application</H>
          {'="purple" label="Kosong"'}
          {dm.inline}
          {' />'}
        </SectionCode>
      </FlowSection>

      <ModeSection
        name="Checkbox"
        stayDark
        lead={
          <>
            Prop <Hl>darkMode</Hl> mengganti kotak ke gray-700 bergaris gray-600, dengan label putih dan caption
            gray-400. Kotak yang tercentang tetap memakai warna aplikasi. State <Hl>inactive</Hl> meredupkan
            label dan caption ke gray-500; kotaknya tetap, kecuali saat tercentang yang terisi gray-500.
          </>
        }
      >
        <Demo dark>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Checkbox darkMode label="Belum dicentang" helperText="Keterangan singkat." />
            <Checkbox darkMode label="Sudah dicentang" helperText="Keterangan singkat." defaultChecked />
            <Checkbox
              darkMode
              state="inactive"
              label="Tidak aktif"
              helperText="Keterangan singkat."
            />
            <Checkbox
              darkMode
              state="inactive"
              label="Tidak aktif, tercentang"
              helperText="Keterangan singkat."
              defaultChecked
            />
          </div>
        </Demo>
        <SectionCode>
          {'<Checkbox '}
          {atributDarkMode}
          {'label="Belum dicentang" helperText="Keterangan singkat." />\n'}
          {'<Checkbox '}
          {atributDarkMode}
          {'label="Sudah dicentang" helperText="Keterangan singkat." defaultChecked />\n\n'}
          {'{/* Inactive */}\n'}
          {'<Checkbox '}
          {atributDarkMode}
          {'state="inactive" label="Tidak aktif" helperText="Keterangan singkat." />\n'}
          {'<Checkbox\n'}
          {barisDarkMode}
          {'    state="inactive"\n'}
          {'    label="Tidak aktif, tercentang"\n'}
          {'    helperText="Keterangan singkat."\n'}
          {'    defaultChecked\n'}
          {'/>'}
        </SectionCode>
      </ModeSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Sekelompok checkbox yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        {/* max-w-fit: blok menyusut seukuran isinya, jadi mx-auto benar-benar memusatkannya. */}
        <Stage maxWidth="max-w-fit" dark={dark}>
          <div className="space-y-4">
            {berkas.map((b) => (
              <Checkbox
                key={b.value}
                platform={platform}
                state={state}
                application={application}
                darkMode={dark}
                label={b.label}
                helperText={withCaption ? 'Unggah berkas asli berwarna, maksimal 2 MB.' : undefined}
                checked={dipilih.includes(b.value)}
                onChange={() => toggle(b.value)}
              />
            ))}
          </div>
        </Stage>

        <Controls>
          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan"
              value={dark}
              onChange={(v) => setDark(v as boolean)}
              options={[
                { value: false, label: 'Light' },
                { value: true, label: 'Dark' },
              ]}
            />
          </Control>

          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={(v) => setPlatform(v as CheckboxPlatform)}
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
              onChange={(v) => setState(v as CheckboxState)}
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
              onChange={(v) => setApplication(v as CheckboxApplication)}
              itemClassName="px-2.5"
              options={applications.map((a) => ({ value: a.value, label: a.label }))}
            />
          </Control>

          <Control label="Caption">
            <Segmented
              label="Tampilkan caption"
              value={withCaption}
              onChange={(v) => setWithCaption(v as boolean)}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500 dark:text-gray-400">
          Berbeda dengan Radio, tiap Checkbox berdiri sendiri — pakai <Hl>name</Hl> yang sama hanya bila
          server Anda memang mengharapkan satu daftar nilai dari satu nama.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Checkbox } from '@ceplok-ui/design-kit-react'\n\n"}
          {'{/* berkas = [{ value: "ktp", label: "KTP elektronik" }, …] */}\n'}
          {'{berkas.map((b) => (\n'}
          {'    <Checkbox\n'}
          {'        key={b.value}\n'}
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
          {'        label={b.label}\n'}
          {withCaption && (
            <>
              {'        '}
              <H>helperText</H>
              {'="Unggah berkas asli berwarna, maksimal 2 MB."\n'}
            </>
          )}
          {'        checked={dipilih.includes(b.value)}\n'}
          {'        onChange={() => toggle(b.value)}\n'}
          {'    />\n'}
          {'))}'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <Hl>&lt;input type=&quot;checkbox&quot;&gt;</Hl> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={checkboxProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
