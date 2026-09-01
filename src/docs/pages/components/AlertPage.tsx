import { useState } from 'react'
import { Messages } from '../../../lib/icons/outline'
import { Alert, type AlertVariant } from '../../../lib'
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

/**
 * Warna tombol aksi mengikuti "ink" dari variant Alert yang sama — ditulis di
 * sini karena `actions` adalah slot bebas, bukan sesuatu yang dihasilkan oleh
 * komponen Alert itu sendiri.
 *
 * Belum memakai <Button> dari kit: theme-nya belum punya merah untuk danger,
 * jadi kelima variant ditulis seragam sebagai <button> biasa.
 */
const variants: { value: AlertVariant; label: string; button: string }[] = [
  { value: 'success', label: 'Success', button: 'bg-green-800 hover:bg-green-900' },
  { value: 'danger', label: 'Danger', button: 'bg-red-800 hover:bg-red-900' },
  { value: 'warning', label: 'Warning', button: 'bg-yellow-800 hover:bg-yellow-900' },
  { value: 'info', label: 'Info', button: 'bg-primary-800 hover:bg-primary-900' },
  { value: 'purple', label: 'Purple', button: 'bg-purple-800 hover:bg-purple-900' },
]

const isiAlert =
  'Ini merupakan Design system Stasi berupa component alert. Ini merupakan Design system Stasi berupa component alert.'

/** Tombol contoh untuk slot `actions`. */
function AksiButton({ variant }: { variant: AlertVariant }) {
  const { button } = variants.find((v) => v.value === variant) ?? variants[3]

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${button}`}
    >
      Button text
      <Messages className="size-4" />
    </button>
  )
}

const alertProps: PropRow[] = [
  ['variant', "'success' | 'danger' | 'warning' | 'info' | 'purple'", 'info', 'Warna semantik pesan.'],
  ['heading', 'ReactNode', 'undefined', 'Judul singkat di baris pertama.'],
  ['icon', 'ReactNode | false', 'undefined', 'Ikon kiri kustom. false menyembunyikannya, kosong memakai bawaan variant.'],
  ['dismissible', 'boolean', 'true', 'Menampilkan tombol tutup (×) di kanan atas.'],
  ['onDismiss', '() => void', 'undefined', 'Dipanggil saat tombol tutup diklik.'],
  ['open', 'boolean', 'undefined', 'Kendalikan tampil/sembunyi dari luar; tanpa ini Alert mengurusnya sendiri.'],
  ['actions', 'ReactNode', 'undefined', 'Baris tombol tindak lanjut di bawah isi.'],
  ['children', 'ReactNode', 'undefined', 'Isi pesan.'],
  ['…props', 'HTMLAttributes', '—', 'Seluruh atribut <div> diteruskan (className, id, …).'],
]

const toc: TocEntry[] = [
  { id: 'alert', label: 'Alert' },
  { id: 'opsional', label: 'Elemen opsional' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function AlertPage() {
  const [variant, setVariant] = useState<AlertVariant>('success')
  const [lebar, setLebar] = useState<'mobile' | 'desktop'>('desktop')
  const [pakaiIkon, setPakaiIkon] = useState(true)
  const [pakaiTutup, setPakaiTutup] = useState(true)
  const [pakaiAksi, setPakaiAksi] = useState(true)

  // Alert menutup dirinya sendiri; ganti key untuk memasangnya kembali dari nol.
  const [tayangan, setTayangan] = useState(0)

  return (
    <UsulanPage
      eyebrow="Components"
      title="Alert"
      description="Menyampaikan pesan status — sukses, error, peringatan, atau informasi — tepat di dalam alur halaman. Lima variant warna dengan elemen yang sepenuhnya opsional."
      toc={toc}
    >
      <FlowSection id="alert" title="Alert">
        <Lead>
          Kotak beradius 8px berisi ikon status, judul, isi pesan, dan tombol tutup. Lima variant warnanya
          punya makna semantik yang sama dengan Badge dan token warna lain di design system ini.
        </Lead>
        <div className="space-y-4">
          {variants.map((v) => (
            <Alert
              key={v.value}
              variant={v.value}
              heading="Ini adalah Alert"
              actions={<AksiButton variant={v.value} />}
            >
              {isiAlert}
            </Alert>
          ))}
        </div>
        <SectionCode>
          {"import { Alert } from '@stasi/design-kit-react'\n\n"}
          {'<Alert\n'}
          {'    '}
          <H>variant</H>
          {'="success"\n'}
          {'    heading="Ini adalah Alert"\n'}
          {'    actions={<button type="button" className="…">Button text</button>}\n'}
          {'>\n'}
          {'    Ini merupakan Design system Stasi berupa component alert.\n'}
          {'</Alert>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="opsional" title="Elemen opsional">
        <Lead>
          Heading, tombol aksi, ikon kiri, dan tombol tutup semuanya opsional — cukup hilangkan bagian yang
          tidak dipakai. Yang tersisa paling ringkas adalah satu baris teks.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Tanpa tombol">
            <Alert variant="warning" heading="Ini adalah Alert">
              {isiAlert}
            </Alert>
          </Demo>
          <Demo label="Tanpa tombol tutup">
            <Alert variant="warning" heading="Ini adalah Alert" dismissible={false}>
              {isiAlert}
            </Alert>
          </Demo>
          <Demo label="Tanpa ikon">
            <Alert variant="warning" icon={false} heading="Ini adalah Alert" dismissible={false}>
              {isiAlert}
            </Alert>
          </Demo>
          <Demo label="Hanya pesan">
            <Alert variant="warning" dismissible={false}>
              Ini merupakan Design system Stasi berupa component alert.
            </Alert>
          </Demo>
        </div>
        <SectionCode>
          {'{/* Tanpa tombol: cukup hilangkan prop actions */}\n'}
          {'<Alert variant="warning" heading="Ini adalah Alert">…</Alert>\n\n'}
          {'{/* Tanpa tombol tutup */}\n'}
          {'<Alert variant="warning" heading="Ini adalah Alert" '}
          <H>dismissible</H>
          {'={false}>…</Alert>\n\n'}
          {'{/* Tanpa ikon kiri */}\n'}
          {'<Alert variant="warning" '}
          <H>icon</H>
          {'={false} heading="Ini adalah Alert">…</Alert>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu Alert yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung terlihat
          di sini, dan bagian Penggunaan menuliskan kodenya. Setelah Alert ditutup, klik{' '}
          <H>Tampilkan Alert</H> untuk memasangnya kembali.
        </Lead>

        <Stage maxWidth={lebar === 'mobile' ? 'max-w-75' : 'max-w-full'}>
          <Alert
            key={tayangan}
            variant={variant}
            heading="Ini adalah Alert"
            icon={pakaiIkon ? undefined : false}
            dismissible={pakaiTutup}
            actions={pakaiAksi ? <AksiButton variant={variant} /> : undefined}
          >
            Ini merupakan Design system Ministerium Fur Staatssicherheit berupa component alert.
          </Alert>
        </Stage>

        <Controls>
          <Control label="Variant">
            <Segmented
              label="Pilih variant"
              value={variant}
              onChange={setVariant}
              itemClassName="px-2.5"
              wrap
              options={variants.map((v) => ({ value: v.value, label: v.label }))}
            />
          </Control>

          <Control label="Lebar">
            <Segmented
              label="Pilih lebar alert"
              value={lebar}
              onChange={setLebar}
              options={[
                { value: 'mobile', label: 'Mobile' },
                { value: 'desktop', label: 'Desktop' },
              ]}
            />
          </Control>

          <Control label="Icon kiri">
            <Segmented
              label="Tampilkan icon kiri"
              value={pakaiIkon}
              onChange={setPakaiIkon}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tombol tutup">
            <Segmented
              label="Tampilkan tombol tutup"
              value={pakaiTutup}
              onChange={setPakaiTutup}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tombol aksi">
            <Segmented
              label="Tampilkan tombol aksi"
              value={pakaiAksi}
              onChange={setPakaiAksi}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <button
          type="button"
          onClick={() => setTayangan((n) => n + 1)}
          className="mt-5 inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-800"
        >
          Tampilkan Alert
        </button>

        <p className="mt-4 text-body-sm text-gray-500">
          Tombol tutup mengurus visibilitasnya sendiri, jadi tidak ada state yang perlu Anda siapkan. Isi{' '}
          <H>onDismiss</H> bila penutupan perlu dicatat, atau <H>open</H> bila Alert dikendalikan penuh dari
          luar.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Alert } from '@stasi/design-kit-react'\n\n"}
          {'<Alert\n'}
          {variant !== 'info' && (
            <>
              {'    '}
              <H>variant</H>
              {`="${variant}"\n`}
            </>
          )}
          {'    heading="Ini adalah Alert"\n'}
          {!pakaiIkon && (
            <>
              {'    '}
              <H>icon</H>
              {'={false}\n'}
            </>
          )}
          {!pakaiTutup && (
            <>
              {'    '}
              <H>dismissible</H>
              {'={false}\n'}
            </>
          )}
          {pakaiAksi && (
            <>
              {'    '}
              <H>actions</H>
              {'={<button type="button" className="…">Button text</button>}\n'}
            </>
          )}
          {'>\n'}
          {'    Ini merupakan Design system STASI berupa component alert.\n'}
          {'</Alert>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut <H>&lt;div&gt;</H>{' '}
          standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={alertProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
