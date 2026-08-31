import { useState } from 'react'
import {
  TextArea,
  type TextAreaApplication,
  type TextAreaPlatform,
  type TextAreaType,
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

const applications: { value: TextAreaApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'simaya', label: 'simaya', token: 'purple-700' },
]

const textAreaProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas kotak.'],
  ['hint', 'ReactNode', 'undefined', 'Teks kecil di kanan label, mis. penghitung karakter.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah kotak.'],
  ['type', "'default' | 'editor'", 'default', 'Kotak polos, atau kotak dengan toolbar di atasnya.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi kotak type default: 162px atau 120px.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna garis saat difokus dan tombol kirim.'],
  ['toolbar', 'ReactNode', 'undefined', 'Mengganti isi toolbar editor dengan elemen sendiri.'],
  ['onToolbarAction', '(action) => void', 'undefined', 'Dipanggil saat tombol toolbar bawaan ditekan.'],
  ['submitLabel', 'ReactNode', 'undefined', 'Label tombol kirim; tombol hanya muncul bila diisi.'],
  ['onSubmit', '() => void', 'undefined', 'Aksi tombol kirim.'],
  ['…props', 'TextareaHTMLAttributes', '—', 'Seluruh atribut <textarea> standar diteruskan (rows, maxLength, value, onChange, …).'],
]

const toc: TocEntry[] = [
  { id: 'text-area', label: 'Text Area' },
  { id: 'editor', label: 'Editor' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

/** Isi `hint` yang dicontohkan di Playground — hint tak harus penghitung karakter. */
type HintKind = 'counter' | 'opsional' | 'none'

const hintOptions: { value: HintKind; label: string }[] = [
  { value: 'counter', label: 'Counter' },
  { value: 'opsional', label: 'Opsional' },
  { value: 'none', label: 'Tidak ada' },
]

export function TextAreaPage() {
  const [type, setType] = useState<TextAreaType>('editor')
  const [platform, setPlatform] = useState<TextAreaPlatform>('default')
  const [application, setApplication] = useState<TextAreaApplication>('default')
  const [hintKind, setHintKind] = useState<HintKind>('opsional')
  const [withHelper, setWithHelper] = useState(true)
  const [withSubmit, setWithSubmit] = useState(true)
  const [value, setValue] = useState('')

  const isEditor = type === 'editor'
  const hint =
    hintKind === 'counter' ? `${value.length}/500` : hintKind === 'opsional' ? 'Opsional' : undefined

  return (
    <UsulanPage
      eyebrow="Form · Input Field Form"
      title="Text Area"
      description="Isian teks banyak baris. Tersedia sebagai kotak polos atau sebagai editor dengan toolbar dan tombol kirim, memakai token warna, radius, dan jarak yang sama dengan Foundations."
      toc={toc}
    >
      <FlowSection id="text-area" title="Text Area">
        <Lead>
          Kotak polos untuk keterangan panjang: label di atas, kotak berlatar abu muda, lalu caption di
          bawah. Tingginya mengikuti platform — 162px di desktop, 120px di mobile.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 162px">
            <TextArea
              label="Keterangan"
              placeholder="Tulis keterangan tambahan…"
              helperText="Maksimal 500 karakter."
            />
          </Demo>
          <Demo label="Mobile · 120px">
            <TextArea
              platform="mobile"
              label="Keterangan"
              placeholder="Tulis keterangan tambahan…"
              helperText="Maksimal 500 karakter."
            />
          </Demo>
        </div>
        <SectionCode>
          {"import { TextArea } from '@tpl/design-kit-react'\n\n"}
          {'<TextArea\n'}
          {'    label="Keterangan"\n'}
          {'    placeholder="Tulis keterangan tambahan…"\n'}
          {'    helperText="Maksimal 500 karakter."\n'}
          {'/>\n\n'}
          {'{/* Mobile — kotak 120px */}\n'}
          {'<TextArea '}
          <H>platform</H>
          {'="mobile" label="Keterangan" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="editor" title="Editor">
        <Lead>
          Type <H>editor</H> menambahkan toolbar setinggi 40px di atas area isian — tujuh alat dengan garis
          pemisah setelah alat ketiga. Teks di kanan label bisa dipakai sebagai penghitung karakter, dan
          tombol kirim muncul begitu <H>submitLabel</H> diisi.
        </Lead>
        <Demo>
          <TextArea
            type="editor"
            label="Isi pesan"
            hint="0/500"
            placeholder="Tulis pesan Anda…"
            submitLabel="Submit Text"
          />
        </Demo>
        <SectionCode>
          {'<TextArea\n'}
          {'    '}
          <H>type</H>
          {'="editor"\n'}
          {'    label="Isi pesan"\n'}
          {'    hint={`${value.length}/500`}\n'}
          {'    placeholder="Tulis pesan Anda…"\n'}
          {'    '}
          <H>submitLabel</H>
          {'="Submit Text"\n'}
          {'    onSubmit={kirim}\n'}
          {'    onToolbarAction={(action) => console.log(action)}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna tombol kirim — dan garis kotak saat difokus — mengikuti aplikasi yang memakainya, dengan
          token warna yang sama seperti pada Input Field.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <TextArea
                type="editor"
                application={a.value}
                label="Isi pesan"
                placeholder="Tulis pesan Anda…"
                helperText={`bg-${a.token}`}
                submitLabel="Submit Text"
              />
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<TextArea\n'}
          {'    type="editor"\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    label="Isi pesan"\n'}
          {'    submitLabel="Submit Text"\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        <Stage maxWidth={platform === 'mobile' && !isEditor ? 'max-w-[380px]' : 'max-w-[494px]'}>
          <TextArea
            type={type}
            platform={platform}
            application={application}
            label="Isi pesan"
            hint={hint}
            placeholder="Tulis pesan Anda…"
            helperText={withHelper ? 'Maksimal 500 karakter.' : undefined}
            maxLength={500}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            submitLabel={withSubmit ? 'Submit Text' : undefined}
          />
        </Stage>

        <Controls>
          <Control label="Type">
            <Segmented
              label="Pilih type"
              value={type}
              onChange={setType}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'editor', label: 'Editor' },
              ]}
            />
          </Control>

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

          <Control label="Application">
            <Segmented
              label="Pilih aplikasi"
              value={application}
              onChange={setApplication}
              itemClassName="px-2.5"
              options={applications.map((a) => ({ value: a.value, label: a.label }))}
            />
          </Control>

          <Control label="Hint">
            <Segmented
              label="Pilih isi hint"
              value={hintKind}
              onChange={setHintKind}
              itemClassName="px-2.5"
              options={hintOptions}
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

          <Control label="Tombol kirim">
            {/* Mati pada type default: di sana tombol kirim memang tidak pernah dirender. */}
            <Segmented
              label="Tampilkan tombol kirim"
              value={withSubmit}
              onChange={setWithSubmit}
              disabled={!isEditor}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Tombol kirim hanya dirender pada type <em>editor</em>, jadi kontrolnya ikut mati saat type{' '}
          <em>default</em>. Hint dan helper text berlaku di kedua type; platform hanya mengubah tinggi kotak
          pada type <em>default</em>. Isi <H>hint</H> bebas — penghitung karakter perlu diikat ke nilai
          isian, sedangkan penanda seperti <em>Opsional</em> cukup teks tetap.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis, jadi yang tersisa hanya yang benar-benar perlu Anda
          salin.
        </Lead>
        {/*
          Baris opsional memakai `kondisi && …`. nodeText() memperlakukan `false`
          sebagai string kosong, jadi teks tombol salin tetap sama persis dengan
          yang terlihat.
        */}
        <SectionCode flush>
          {"import { TextArea } from '@tpl/design-kit-react'\n\n"}
          {'<TextArea\n'}
          {isEditor && (
            <>
              {'    '}
              <H>type</H>
              {'="editor"\n'}
            </>
          )}
          {platform === 'mobile' && (
            <>
              {'    '}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          )}
          {application !== 'default' && (
            <>
              {'    '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {'    label="Isi pesan"\n'}
          {hintKind !== 'none' && (
            <>
              {'    '}
              <H>hint</H>
              {hintKind === 'counter' ? '={`${value.length}/500`}\n' : '="Opsional"\n'}
            </>
          )}
          {'    placeholder="Tulis pesan Anda…"\n'}
          {withHelper && (
            <>
              {'    '}
              <H>helperText</H>
              {'="Maksimal 500 karakter."\n'}
            </>
          )}
          {'    maxLength={500}\n'}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {isEditor && withSubmit && (
            <>
              {'    '}
              <H>submitLabel</H>
              {'="Submit Text"\n'}
              {'    onSubmit={kirim}\n'}
            </>
          )}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;textarea&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={textAreaProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
