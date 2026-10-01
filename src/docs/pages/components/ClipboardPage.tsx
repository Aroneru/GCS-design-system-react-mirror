import { useState } from 'react'
import { Clipboard, type ClipboardVariant, type ClipboardPlatform } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Segmented } from '../../pageKit'
import { Control, Controls, FlowSection, Lead, SectionCode, Stage, UsulanPage, type TocEntry } from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'

const toc: TocEntry[] = [
  { id: 'clipboard', label: 'Clipboard' },
  { id: 'platform', label: 'Platform' },
  { id: 'segmen', label: 'Dengan segmen' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

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
  ['label', 'ReactNode', 'undefined', 'Label yang ditampilkan di atas nilai.'],
  ['helperText', 'ReactNode', 'undefined', 'Keterangan tambahan yang ditampilkan di bawah field.'],
  ['prefix', 'ReactNode', 'undefined', 'Konten sebelum nilai pada tampilan bersegmen. Prefix tidak ikut disalin.'],
  ['variant', "'default' | 'segmented'", 'default', 'Menentukan susunan Clipboard.'],
  ['platform', "'default' | 'mobile'", 'default', 'Menentukan preset ukuran Default atau Mobile.'],
  ['disabled', 'boolean', 'false', 'Menonaktifkan aksi salin tanpa menonaktifkan pemilihan nilai.'],
  ['className', 'string', 'undefined', 'Kelas CSS untuk pembungkus terluar Clipboard.'],
  ['onCopySuccess', '(value: string) => void', 'undefined', 'Dipanggil setelah nilai berhasil disalin.'],
  ['onCopyError', '(error: unknown) => void', 'undefined', 'Dipanggil ketika proses salin gagal.'],
  ['Atribut input', 'id, aria-label, aria-labelledby, aria-describedby: string', 'undefined', 'Hanya atribut ini diteruskan. ID dibuat otomatis jika kosong; deskripsi digabung dengan helperText.'],
]

export function ClipboardPage() {
  const [variant, setVariant] = useState<ClipboardVariant>('default')
  const [platform, setPlatform] = useState<ClipboardPlatform>('default')
  const [value, setValue] = useState('INV-2026-001')
  const [withLabel, setWithLabel] = useState(true)
  const [withHelper, setWithHelper] = useState(true)
  const [withPrefix, setWithPrefix] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const label = 'Nomor referensi'
  const helper = 'Gunakan nomor ini saat menghubungi layanan.'
  const previewProps = {
    value,
    platform,
    label: withLabel ? label : undefined,
    'aria-label': withLabel ? undefined : label,
    helperText: withHelper ? helper : undefined,
    disabled,
  }

  return (
    <UsulanPage eyebrow="Components · Clipboard" title="Clipboard" description="Menampilkan nilai yang dapat disalin melalui tombol aksi, dengan dukungan label dan keterangan tambahan." toc={toc}>
      <FlowSection id="clipboard" title="Clipboard">
        <Lead>Clipboard menampilkan nilai hanya-baca yang dapat disalin melalui tombol aksi. Nilai tetap dapat dipilih untuk disalin secara manual.</Lead>
        <Demo label="Default">
          <div className={`mx-auto w-full ${previewWidths.default.default}`}><Clipboard value="INV-2026-001" label="Nomor referensi" /></div>
        </Demo>
        <SectionCode>{`import { Clipboard } from '@ceplok-ui/design-kit-react'

<Clipboard
    value="INV-2026-001"
    label="Nomor referensi"
/>`}</SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>Platform menentukan preset ukuran Clipboard. Gunakan Default untuk ukuran standar dan Mobile untuk tampilan yang lebih ringkas. Preset dipilih melalui prop, bukan lebar viewport.</Lead>
        <div className="grid gap-5">
          <Demo label="Default"><div className={`mx-auto w-full ${previewWidths.default.default}`}> <Clipboard value="npm i komdigi" label="Perintah instalasi" platform="default" /> </div></Demo>
          <Demo label="Mobile"><div className={`mx-auto w-full ${previewWidths.default.mobile}`}> <Clipboard value="npm i komdigi" label="Perintah instalasi" platform="mobile" /> </div></Demo>
        </div>
        <SectionCode>{'<Clipboard value="npm i komdigi" '}<H>platform</H>{'="mobile" aria-label="Perintah instalasi" />'}</SectionCode>
      </FlowSection>

      <FlowSection id="segmen" title="Dengan segmen">
        <Lead>Gunakan susunan bersegmen untuk menggabungkan prefix, nilai, dan aksi salin dalam satu grup. Prefix bersifat kontekstual dan tidak ikut disalin. Tinggi grup tetap sama pada kedua platform.</Lead>
        <div className="grid gap-5">
          <Demo label="Dengan prefix"><div className={`mx-auto w-full ${previewWidths.segmented.default}`}> <Clipboard value="https://komdigi.go.id/" label="Alamat situs" variant="segmented" prefix="URL" /> </div></Demo>
          <Demo label="Tanpa prefix"><div className={`mx-auto w-full ${previewWidths.segmented.default}`}> <Clipboard value="INV-2026-001" label="Nomor referensi" variant="segmented" /> </div></Demo>
        </div>
        <SectionCode>{`<Clipboard
    value="https://komdigi.go.id/"
    label="Alamat situs"
    variant="segmented"
    prefix="URL"
/>`}</SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Tekan tombol salin untuk melihat umpan baliknya; bagian Penggunaan mengikuti pilihan Anda.</Lead>
        <Stage maxWidth={previewWidths[variant][platform]}>
          {variant === 'segmented'
            ? <Clipboard {...previewProps} variant="segmented" prefix={withPrefix ? 'ID' : undefined} />
            : <Clipboard {...previewProps} />}
        </Stage>
        <Controls>
          <Control label="Variasi"><Segmented label="Pilih variasi" value={variant} onChange={setVariant} options={variants} wrap /></Control>
          <Control label="Platform"><Segmented label="Pilih platform" value={platform} onChange={setPlatform} options={[{ value: 'default', label: 'Default' }, { value: 'mobile', label: 'Mobile' }]} /></Control>
          <Control label="Nilai">
            <input aria-label="Nilai yang disalin" value={value} onChange={(event) => setValue(event.target.value)} className="h-10 w-full rounded-lg border border-gray-300 bg-surface px-3 text-sm text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600" />
          </Control>
          <Control label="Label"><Segmented label="Tampilkan label" value={withLabel} onChange={setWithLabel} options={adaTidakAda} /></Control>
          <Control label="Helper text"><Segmented label="Tampilkan helper text" value={withHelper} onChange={setWithHelper} options={adaTidakAda} /></Control>
          <Control label="Prefix"><Segmented label="Tampilkan prefix" value={withPrefix} onChange={setWithPrefix} options={adaTidakAda} disabled={variant === 'default'} /></Control>
          <Control label="Nonaktif"><Segmented label="Nonaktifkan salin" value={disabled} onChange={setDisabled} options={[{ value: false, label: 'Tidak' }, { value: true, label: 'Ya' }]} /></Control>
        </Controls>
        <p className="mt-4 text-body-sm text-content-subtle">Kontrol Nilai mengubah contoh; Clipboard tetap hanya-baca. Penyalinan memerlukan HTTPS atau lingkungan lokal yang dipercaya browser. Jika gagal, pilih teks dan salin secara manual.</p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang nilainya masih bawaan sengaja tidak ditulis.</Lead>
        <SectionCode flush>
          {"import { Clipboard } from '@ceplok-ui/design-kit-react'\n\n<Clipboard\n"}
          {'    '}<H>value</H>{`={${JSON.stringify(value)}}\n`}
          {withLabel ? <>{'    '}<H>label</H>{`="${label}"\n`}</> : <>{'    '}<H>aria-label</H>{`="${label}"\n`}</>}
          {variant === 'segmented' && <>{'    '}<H>variant</H>{'="segmented"\n'}</>}
          {platform === 'mobile' && <>{'    '}<H>platform</H>{'="mobile"\n'}</>}
          {variant === 'segmented' && withPrefix && <>{'    '}<H>prefix</H>{'="ID"\n'}</>}
          {withHelper && <>{'    '}<H>helperText</H>{`="${helper}"\n`}</>}
          {disabled && <>{'    '}<H>disabled</H>{'\n'}</>}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Daftar prop, tipe, dan nilai bawaannya. Hanya <H>id</H> dan atribut penamaan atau deskripsi aksesibel yang diteruskan ke input hanya-baca. Ref mengarah ke input yang sama.</Lead>
        <PropsTable rows={clipboardProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  )
}
