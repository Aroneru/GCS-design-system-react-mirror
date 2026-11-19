import { useState } from 'react'
import { Clipboard, type ClipboardPlatform, type ClipboardVariant } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Segmented } from '../../pageKit'
import { tocForDarkDocs, useDarkModeSnippet, useDocsDark, usePlaygroundDark } from '../../docsTheme'
import { Control, Controls, FlowSection, Lead, ModeSection, SectionCode, Stage, UsulanPage, type TocEntry } from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'

const toc: TocEntry[] = [
  { id: 'default', label: 'Default' },
  { id: 'platform', label: 'Platform' },
  { id: 'segmen', label: 'Dengan segmen' },
  { id: 'states', label: 'States' },
  { id: 'callbacks', label: 'Callback' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const tocDark = tocForDarkDocs(toc)

const variants: { value: ClipboardVariant; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'segmented', label: 'Dengan segmen' },
]

// Representative Clipboard Figma widths; documentation containers only.
const previewWidths: Record<ClipboardVariant, Record<ClipboardPlatform, string>> = {
  default: { default: 'max-w-[384px]', mobile: 'max-w-[380px]' },
  segmented: { default: 'max-w-[452px]', mobile: 'max-w-[355px]' },
}

const clipboardProps: PropRow[] = [
  ['value', 'string', '— (wajib)', 'Nilai yang ditampilkan dan disalin.'],
  ['label', 'ReactNode', 'undefined', 'Label di atas nilai sekaligus nama aksesibel input; gunakan aria-label atau aria-labelledby bila label tidak ditampilkan.'],
  ['helperText', 'ReactNode', 'undefined', 'Keterangan tambahan yang ditampilkan di bawah field.'],
  ['prefix', 'ReactNode', 'undefined', 'Konten sebelum nilai pada tampilan bersegmen. Prefix tidak ikut disalin.'],
  ['variant', "'default' | 'segmented'", 'default', 'Menentukan susunan Clipboard.'],
  ['platform', "'default' | 'mobile'", 'default', 'Menentukan preset ukuran Default atau Mobile.'],
  ['darkMode', 'boolean', 'false', 'Mengaktifkan tampilan gelap. Tanpa prop ini, Clipboard mengikuti tema pembungkusnya.'],
  ['disabled', 'boolean', 'false', 'Menonaktifkan aksi salin dan interaksi pemilihan nilai melalui UI.'],
  ['className', 'string', 'undefined', 'Kelas CSS untuk pembungkus terluar Clipboard.'],
  ['onCopySuccess', '(value: string) => void', 'undefined', 'Dipanggil setelah nilai berhasil disalin. Error callback diabaikan dan tidak mengubah hasil salin.'],
  ['onCopyError', '(error: unknown) => void', 'undefined', 'Dipanggil ketika proses salin gagal. Error callback diabaikan dan tidak mengubah feedback gagal.'],
  ['Atribut input', 'id, aria-label, aria-labelledby, aria-describedby: string', 'undefined', 'Hanya atribut ini diteruskan. ID dibuat otomatis jika kosong; deskripsi digabung dengan helperText.'],
]

export function ClipboardPage() {
  const docsDark = useDocsDark()
  const dm = useDarkModeSnippet()
  const [variant, setVariant] = useState<ClipboardVariant>('default')
  const [platform, setPlatform] = useState<ClipboardPlatform>('default')
  const [value, setValue] = useState('INV-2026-001')
  const [withLabel, setWithLabel] = useState(true)
  const [withHelper, setWithHelper] = useState(true)
  const [withPrefix, setWithPrefix] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [dark, setDark] = usePlaygroundDark()
  const label = 'Nomor referensi'
  const helper = 'Gunakan nomor ini saat menghubungi layanan.'
  const previewProps = {
    value,
    platform,
    label: withLabel ? label : undefined,
    'aria-label': withLabel ? undefined : label,
    helperText: withHelper ? helper : undefined,
    disabled,
    darkMode: dark,
  }
  return (
    <div data-theme={docsDark ? 'dark' : undefined}>
      <UsulanPage eyebrow="Components · Clipboard" title="Clipboard" description="Menampilkan nilai yang dapat disalin melalui tombol aksi, dengan dukungan label dan keterangan tambahan." toc={docsDark ? tocDark : toc}>
      <FlowSection id="default" title="Default">
        <Lead>Clipboard menampilkan nilai hanya-baca yang dapat disalin melalui tombol aksi. Saat aktif, nilai tetap dapat dipilih untuk disalin secara manual. Berikan nama aksesibel melalui label, aria-label, atau aria-labelledby.</Lead>
        <Demo label="Default">
          <div className={`mx-auto w-full ${previewWidths.default.default}`}>
            <Clipboard value="INV-2026-001" label="Nomor referensi" helperText="Gunakan nomor ini saat menghubungi layanan." darkMode={docsDark} />
          </div>
        </Demo>
        <SectionCode>
          {"import { Clipboard } from '@ceplok-ui/design-kit-react'\n\n<Clipboard\n    "}<H>value</H>{'="INV-2026-001"\n    '}<H>label</H>{'="Nomor referensi"\n'}{dm.line}{'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>Platform menentukan preset ukuran Clipboard. Gunakan Default untuk ukuran standar dan Mobile untuk tampilan yang lebih ringkas. Preset dipilih melalui prop, bukan lebar viewport.</Lead>
        <div className="grid gap-5">
          <Demo label="Desktop"><div className={`mx-auto w-full ${previewWidths.default.default}`}><Clipboard value="npm i komdigi" label="Perintah instalasi" darkMode={docsDark} /></div></Demo>
          <Demo label="Mobile"><div className={`mx-auto w-full ${previewWidths.default.mobile}`}><Clipboard value="npm i komdigi" label="Perintah instalasi" platform="mobile" darkMode={docsDark} /></div></Demo>
        </div>
        <SectionCode>{'<Clipboard value="npm i komdigi" '}<H>platform</H>{'="mobile" aria-label="Perintah instalasi"'}{dm.inline}{' />'}</SectionCode>
      </FlowSection>

      <FlowSection id="segmen" title="Dengan segmen">
        <Lead>Susunan bersegmen menggabungkan prefix, nilai, dan aksi salin dalam satu grup. Prefix bersifat kontekstual dan tidak ikut disalin. Arahkan pointer ke ikon untuk melihat tooltip; setelah salin berhasil, ikon berubah menjadi Check tanpa pergeseran layout.</Lead>
        <div className="grid gap-5">
          <Demo label="Dengan prefix"><div className={`mx-auto w-full ${previewWidths.segmented.default}`}><Clipboard value="https://komdigi.go.id/" label="Alamat situs" variant="segmented" prefix="URL" darkMode={docsDark} /></div></Demo>
          <Demo label="Tanpa prefix"><div className={`mx-auto w-full ${previewWidths.segmented.default}`}><Clipboard value="INV-2026-001" label="Nomor referensi" variant="segmented" darkMode={docsDark} /></div></Demo>
        </div>
        <SectionCode>{'<Clipboard\n    '}<H>value</H>{'="https://komdigi.go.id/"\n    '}<H>label</H>{'="Alamat situs"\n    '}<H>variant</H>{'="segmented"\n    '}<H>prefix</H>{'="URL"\n'}{dm.line}{'/>'}</SectionCode>
      </FlowSection>

      <FlowSection id="states" title="States">
        <Lead>Tekan aksi salin untuk melihat status Copied. Saat Nonaktif, tombol, tooltip, dan pemilihan atau penyalinan nilai melalui UI dinonaktifkan; ini bukan mekanisme keamanan data.</Lead>
        <div className="grid gap-5 lg:grid-cols-2">
          <Demo label="Copied interaktif"><div className={`mx-auto w-full ${previewWidths.segmented.default}`}><Clipboard value="https://komdigi.go.id/" variant="segmented" prefix="URL" aria-label="Alamat situs" darkMode={docsDark} /></div></Demo>
          <Demo label="Disabled"><div className={`mx-auto w-full ${previewWidths.default.default}`}><Clipboard value="INV-2026-001" label="Nomor referensi" disabled darkMode={docsDark} /></div></Demo>
        </div>
      </FlowSection>

      <FlowSection id="callbacks" title="Callback">
        <Lead>onCopySuccess dipanggil setelah Clipboard API berhasil, sedangkan onCopyError dipanggil saat API tidak tersedia atau menolak operasi. Error yang dilempar callback consumer—termasuk Promise rejection—diabaikan agar tidak mengubah feedback Clipboard atau menghasilkan unhandled rejection.</Lead>
        <SectionCode>{'<Clipboard\n  value="INV-2026-001"\n  label="Nomor referensi"\n  '}<H>onCopySuccess</H>{'={(copiedValue) => saveAudit(copiedValue)}\n  '}<H>onCopyError</H>{'={(error) => reportCopyError(error)}'}{dm.inline}{'\n/>'}</SectionCode>
      </FlowSection>

      <ModeSection
        name="Clipboard"
        lead={<>Prop <H>darkMode</H> mengaktifkan palet gelap pada field, teks, prefix, dan tooltip. Tanpa prop tersebut, Clipboard mengikuti scope ambient <H>data-theme</H>.</>}
      >
        <Demo dark={!docsDark} light={docsDark}>
          <div className={`mx-auto w-full ${previewWidths.segmented.default}`}>
            <Clipboard value="https://komdigi.go.id/" label="Alamat situs" helperText="Gunakan alamat ini untuk mengunjungi situs." variant="segmented" prefix="URL" darkMode={!docsDark} />
          </div>
        </Demo>
        <SectionCode>{'<Clipboard\n'}{!docsDark && <>  <H>darkMode</H>{'\n'}</>}{'  value="https://komdigi.go.id/"\n  '}<H>aria-label</H>{'="Alamat situs"\n  variant="segmented"\n  prefix="URL"\n/>'}</SectionCode>
      </ModeSection>

      <FlowSection id="playground" title="Playground">
        <Lead>Ubah tampilan, variasi, dan konten melalui kontrol berikut. Preview memakai komponen production yang sama; bagian Penggunaan mengikuti pilihan Anda.</Lead>
        <Stage maxWidth={previewWidths[variant][platform]} dark={dark}>
          {variant === 'segmented'
            ? <Clipboard {...previewProps} variant="segmented" prefix={withPrefix ? 'ID' : undefined} />
            : <Clipboard {...previewProps} />}
        </Stage>
        <Controls>
          <Control label="Tampilan"><Segmented label="Pilih tampilan" value={dark} onChange={setDark} options={[{ value: false, label: 'Light' }, { value: true, label: 'Dark' }]} /></Control>
          <Control label="Variasi"><Segmented label="Pilih variasi" value={variant} onChange={setVariant} options={variants} wrap /></Control>
          <Control label="Platform"><Segmented label="Pilih platform" value={platform} onChange={setPlatform} options={[{ value: 'default', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }]} /></Control>
          <Control label="Nilai"><input aria-label="Nilai yang disalin" value={value} onChange={(event) => setValue(event.target.value)} className="h-10 w-full rounded-lg border border-gray-300 bg-surface px-3 text-sm text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" /></Control>
          <Control label="Label"><Segmented label="Tampilkan label" value={withLabel} onChange={setWithLabel} options={adaTidakAda} /></Control>
          <Control label="Helper text"><Segmented label="Tampilkan helper text" value={withHelper} onChange={setWithHelper} options={adaTidakAda} /></Control>
          <Control label="Prefix"><Segmented label="Tampilkan prefix" value={withPrefix} onChange={setWithPrefix} options={adaTidakAda} disabled={variant === 'default'} /></Control>
          <Control label="Nonaktif"><Segmented label="Nonaktifkan salin" value={disabled} onChange={setDisabled} options={[{ value: false, label: 'Tidak' }, { value: true, label: 'Ya' }]} /></Control>
        </Controls>
        <p className="mt-4 text-body-sm text-content-subtle dark:text-gray-400">Kontrol Nilai hanya mengubah contoh. Clipboard production tetap hanya-baca; penyalinan memerlukan HTTPS atau lingkungan lokal yang dipercaya browser.</p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>Blok ini mengikuti kontrol di Playground. Prop bernilai bawaan sengaja tidak ditulis.</Lead>
        <SectionCode flush>
          {"import { Clipboard } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<Clipboard\n'}
          {'    '}<H>value</H>{`={${JSON.stringify(value)}}\n`}
          {withLabel ? <>{'    '}<H>label</H>{`="${label}"\n`}</> : <>{'    '}<H>aria-label</H>{`="${label}"\n`}</>}
          {variant === 'segmented' && <>{'    '}<H>variant</H>{'="segmented"\n'}</>}
          {platform === 'mobile' && <>{'    '}<H>platform</H>{'="mobile"\n'}</>}
          {variant === 'segmented' && withPrefix && <>{'    '}<H>prefix</H>{'="ID"\n'}</>}
          {withHelper && <>{'    '}<H>helperText</H>{`="${helper}"\n`}</>}
          {disabled && <>{'    '}<H>disabled</H>{'\n'}</>}
          {dark && <>{'    '}<H>darkMode</H>{'\n'}</>}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Daftar prop, tipe, dan nilai bawaannya. Clipboard memerlukan salah satu dari <H>label</H>, <H>aria-label</H>, atau <H>aria-labelledby</H>. Hanya <H>id</H> serta atribut penamaan atau deskripsi aksesibel yang diteruskan ke input hanya-baca. Ref mengarah ke input yang sama.</Lead>
        <PropsTable rows={clipboardProps} minWidth="46rem" />
      </FlowSection>
      </UsulanPage>
    </div>
  )
}
