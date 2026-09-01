import { useState } from 'react'
import { Refresh } from '../../../lib/icons/outline'
import { Button, Toast, type ToastVariant } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Segmented } from '../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'

const variants: { value: ToastVariant; label: string; pesan: string }[] = [
  { value: 'success', label: 'Success', pesan: 'Sukses Membuat Data!' },
  { value: 'danger', label: 'Danger', pesan: 'Gagal Membuat Data!' },
  { value: 'warning', label: 'Warning', pesan: 'Sesi Anda akan berakhir dalam 5 menit.' },
  { value: 'info', label: 'Info', pesan: 'Data sedang diproses.' },
  { value: 'purple', label: 'Purple', pesan: 'Fitur baru sudah tersedia.' },
]

/**
 * Empat sudut viewport. Kelasnya ditulis utuh per sudut, bukan dirakit dari
 * potongan string, supaya Tailwind tetap bisa memindainya.
 */
const sudut = [
  { value: 'top-left', label: 'Atas kiri', vertical: 'top-4', horizontal: 'left-4' },
  { value: 'top-right', label: 'Atas kanan', vertical: 'top-4', horizontal: 'right-4' },
  { value: 'bottom-left', label: 'Bawah kiri', vertical: 'bottom-4', horizontal: 'left-4' },
  { value: 'bottom-right', label: 'Bawah kanan', vertical: 'bottom-4', horizontal: 'right-4' },
] as const

type Sudut = (typeof sudut)[number]['value']

const toastProps: PropRow[] = [
  ['variant', "'success' | 'danger' | 'warning' | 'info' | 'purple'", 'info', 'Warna badge ikon; kartunya tetap netral.'],
  ['heading', 'ReactNode', 'undefined', 'Judul singkat; bila diisi, isi tampil sebagai teks sekunder di bawahnya.'],
  ['icon', 'ReactNode | false', 'undefined', 'Ikon kustom. false menyembunyikan badge ikon, kosong memakai bawaan variant.'],
  ['dismissible', 'boolean', 'true', 'Menampilkan tombol tutup (×) di kanan atas.'],
  ['onDismiss', '() => void', 'undefined', 'Dipanggil saat tombol tutup diklik.'],
  ['open', 'boolean', 'undefined', 'Kendalikan tampil/sembunyi dari luar; tanpa ini Toast mengurusnya sendiri.'],
  ['actions', 'ReactNode', 'undefined', 'Tombol tindak lanjut di bawah isi — umumnya dibuat w-full.'],
  ['children', 'ReactNode', 'undefined', 'Isi pesan.'],
  ['…props', 'HTMLAttributes', '—', 'Seluruh atribut <div> diteruskan (className, id, …).'],
]

const toc: TocEntry[] = [
  { id: 'toast', label: 'Toast' },
  { id: 'heading-aksi', label: 'Dengan heading & aksi' },
  { id: 'posisi', label: 'Posisi & tumpukan' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

/**
 * Tombol contoh untuk slot `actions`. Ukuran xs (tinggi 34px, teks 12px,
 * radius 8px, primary-700) kebetulan persis tombol yang digambar di Figma,
 * jadi contohnya memakai <Button> dari kit apa adanya.
 */
function AksiButton() {
  return (
    <Button size="xs" className="w-full">
      Update 2FA
    </Button>
  )
}

export function ToastPage() {
  const [variant, setVariant] = useState<ToastVariant>('success')
  const [lebar, setLebar] = useState<'mobile' | 'desktop'>('desktop')
  const [posisi, setPosisi] = useState<Sudut>('bottom-left')
  const [pakaiAksi, setPakaiAksi] = useState(false)

  // Toast menutup dirinya sendiri; ganti key untuk memasangnya kembali dari nol.
  const [tayangan, setTayangan] = useState(0)

  const sudutTerpilih = sudut.find((s) => s.value === posisi) ?? sudut[2]

  return (
    <UsulanPage
      eyebrow="Components"
      title="Toast"
      description="Notifikasi sekilas yang melayang di atas konten halaman — untuk konfirmasi aksi, pembaruan status, atau ajakan tindak lanjut. Berbeda dari Alert: kartu tetap netral, hanya badge ikon yang membawa warna variant."
      toc={toc}
    >
      <FlowSection id="toast" title="Toast">
        <Lead>
          Kartu putih 320px beradius 8px, berisi badge ikon 32px di kiri dan tombol tutup 12px di kanan
          atas. Bentuk paling ringkasnya satu baris pesan — cocok untuk konfirmasi singkat setelah sebuah
          aksi selesai.
        </Lead>
        <Demo>
          <div className="space-y-3">
            {variants.map((v) => (
              <Toast key={v.value} variant={v.value} dismissible={false}>
                {v.pesan}
              </Toast>
            ))}
          </div>
        </Demo>
        <SectionCode>
          {"import { Toast } from '@tpl/design-kit-react'\n\n"}
          {'<Toast '}
          <H>variant</H>
          {'="success">Sukses Membuat Data!</Toast>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="heading-aksi" title="Dengan heading & aksi">
        <Lead>
          Isi <H>heading</H> untuk memisahkan judul dari isi, dan <H>actions</H> untuk satu tombol tindak
          lanjut — umumnya dibuat <H>w-full</H> agar memenuhi lebar kartu. Begitu ada salah satunya, badge
          ikon berpindah ke rata atas supaya sejajar dengan baris pertama.
        </Lead>
        <Demo>
          <Toast
            variant="info"
            icon={<Refresh />}
            heading="Update 2FA sudah tersedia!"
            actions={<AksiButton />}
          >
            Update Metode Password anda sekarang
          </Toast>
        </Demo>
        <SectionCode>
          {"import { Button, Toast } from '@tpl/design-kit-react'\n"}
          {"import { Refresh } from '@tpl/design-kit-react/icons/outline'\n\n"}
          {'<Toast\n'}
          {'    variant="info"\n'}
          {'    '}
          <H>icon</H>
          {'={<Refresh />}\n'}
          {'    '}
          <H>heading</H>
          {'="Update 2FA sudah tersedia!"\n'}
          {'    '}
          <H>actions</H>
          {'={<Button size="xs" className="w-full">Update 2FA</Button>}\n'}
          {'>\n'}
          {'    Update Metode Password anda sekarang\n'}
          {'</Toast>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="posisi" title="Posisi & tumpukan">
        <Lead>
          Komponennya sendiri tidak memposisikan apa pun. Bungkus dengan wadah <H>fixed</H> di sudut yang
          Anda mau — dengan begitu beberapa Toast bisa ditumpuk dalam satu wadah ber-<H>space-y</H> tanpa
          mengunci satu posisi ke dalam komponen.
        </Lead>
        <Demo label="Tiga Toast dalam satu wadah">
          <div className="space-y-3">
            <Toast variant="success">Sukses Membuat Data!</Toast>
            <Toast variant="warning">Sesi Anda akan berakhir dalam 5 menit.</Toast>
            <Toast variant="info">Data sedang diproses.</Toast>
          </div>
        </Demo>
        <SectionCode>
          {'{/* Wadah yang memposisikan; Toast-nya sendiri hanya kartu */}\n'}
          {'<div className="'}
          <H>fixed bottom-4 left-4 z-50</H>
          {' space-y-3">\n'}
          {'    <Toast variant="success">Sukses Membuat Data!</Toast>\n'}
          {'    <Toast variant="warning">Sesi Anda akan berakhir dalam 5 menit.</Toast>\n'}
          {'</div>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Bingkai di bawah ini mensimulasikan viewport halaman supaya keempat sudut bisa dicoba. Setiap
          perubahan langsung terlihat, dan bagian Penggunaan menuliskan kodenya. Setelah Toast ditutup,
          klik <H>Tampilkan Toast</H> untuk memasangnya kembali.
        </Lead>

        {/*
          Bukan <Stage>: panggung Playground biasa hanya kartu berlatar netral,
          sedangkan di sini perlu tinggi tetap dan `relative` supaya Toast bisa
          benar-benar ditempel ke sudut bingkainya.
        */}
        <div className="relative h-72 overflow-hidden rounded-2xl border border-border bg-surface-subtle p-4 sm:h-80 sm:p-6">
          <div
            className={`relative mx-auto h-full transition-[max-width] duration-300 ease-out ${
              lebar === 'mobile' ? 'max-w-75' : 'max-w-full'
            }`}
          >
            {/* Skeleton konten halaman, hanya latar */}
            <div className="space-y-3 opacity-60" aria-hidden="true">
              <div className="h-2 w-2/5 rounded bg-gray-300" />
              <div className="h-1.5 w-full rounded bg-gray-200" />
              <div className="h-1.5 w-5/6 rounded bg-gray-200" />
              <div className="h-1.5 w-3/4 rounded bg-gray-200" />
              <div className="mt-6 h-2 w-1/3 rounded bg-gray-300" />
              <div className="h-1.5 w-full rounded bg-gray-200" />
              <div className="h-1.5 w-4/6 rounded bg-gray-200" />
            </div>

            <div
              className={`absolute ${sudutTerpilih.vertical} ${
                lebar === 'mobile' ? 'inset-x-3' : `w-full max-w-80 ${sudutTerpilih.horizontal}`
              }`}
            >
              {pakaiAksi ? (
                <Toast
                  key={`aksi-${tayangan}`}
                  variant={variant}
                  icon={<Refresh />}
                  heading="Update 2FA sudah tersedia!"
                  actions={<AksiButton />}
                >
                  Update Metode Password anda sekarang
                </Toast>
              ) : (
                <Toast key={`singkat-${tayangan}`} variant={variant}>
                  {variants.find((v) => v.value === variant)?.pesan}
                </Toast>
              )}
            </div>
          </div>
        </div>

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
              label="Pilih lebar toast"
              value={lebar}
              onChange={setLebar}
              options={[
                { value: 'mobile', label: 'Mobile' },
                { value: 'desktop', label: 'Desktop' },
              ]}
            />
          </Control>

          <Control label="Isi">
            <Segmented
              label="Pilih isi toast"
              value={pakaiAksi}
              onChange={setPakaiAksi}
              options={[
                { value: false, label: 'Pesan singkat' },
                { value: true, label: 'Heading + aksi' },
              ]}
            />
          </Control>

          <Control label="Posisi">
            <div
              className="inline-grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface p-1"
              role="group"
              aria-label="Pilih posisi toast"
            >
              {sudut.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setPosisi(s.value)}
                  className={`grid size-9 place-items-center rounded-md transition-colors ${
                    posisi === s.value
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  aria-pressed={posisi === s.value}
                  aria-label={s.label}
                  title={s.label}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                </button>
              ))}
            </div>
          </Control>
        </Controls>

        <button
          type="button"
          onClick={() => setTayangan((n) => n + 1)}
          className="mt-5 inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-800"
        >
          Tampilkan Toast
        </button>

        <p className="mt-4 text-body-sm text-gray-500">
          Lebar mobile memakai <H>inset-x-3</H> agar Toast merentang mengikuti layar; di desktop lebarnya
          dibatasi lalu ditempel ke satu sisi.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Wadah{' '}
          <H>fixed</H> ikut ditulis karena posisinya memang ditentukan di sana, bukan di dalam Toast.
        </Lead>
        <SectionCode flush>
          {"import { Toast } from '@tpl/design-kit-react'\n"}
          {pakaiAksi && "import { Refresh } from '@tpl/design-kit-react/icons/outline'\n"}
          {'\n'}
          {'<div className="fixed '}
          <H>{`${sudutTerpilih.vertical} ${sudutTerpilih.horizontal}`}</H>
          {' z-50 space-y-3">\n'}
          {'    <Toast\n'}
          {variant !== 'info' && (
            <>
              {'        '}
              <H>variant</H>
              {`="${variant}"\n`}
            </>
          )}
          {pakaiAksi && (
            <>
              {'        '}
              <H>icon</H>
              {'={<Refresh />}\n'}
              {'        '}
              <H>heading</H>
              {'="Update 2FA sudah tersedia!"\n'}
              {'        '}
              <H>actions</H>
              {'={<button type="button" className="w-full …">Update 2FA</button>}\n'}
            </>
          )}
          {'    >\n'}
          {pakaiAksi
            ? '        Update Metode Password anda sekarang\n'
            : `        ${variants.find((v) => v.value === variant)?.pesan}\n`}
          {'    </Toast>\n'}
          {'</div>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut <H>&lt;div&gt;</H>{' '}
          standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={toastProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
