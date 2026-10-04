import { Fragment, useState } from 'react'
import { ExclamationCircle } from '../../../lib/icons/solid'
import { Button, Icon, Modal, type ModalSize, type ModalVariant } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Segmented } from '../../pageKit'
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

const sizes: { value: ModalSize; label: string; description: string }[] = [
  {
    value: 's',
    label: 'S',
    description: 'Untuk informasi singkat atau form sederhana.',
  },
  {
    value: 'm',
    label: 'M',
    description: 'Untuk konten panjang, form lebih besar, atau konten dengan gambar.',
  },
]

type ModalExample = 'basic' | 'image' | 'long'

const examples: { value: ModalExample; label: string }[] = [
  { value: 'basic', label: 'Dasar' },
  { value: 'image', label: 'Dengan Gambar' },
  { value: 'long', label: 'Konten Panjang' },
]

const variants: { value: ModalVariant; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'popup', label: 'Popup' },
]

const longContent = [
  'Modal dapat memuat informasi yang perlu dibaca sebelum pengguna melanjutkan proses.',
  'Saat isi bertambah, tinggi panel tetap dibatasi viewport agar tombol tutup dan tombol aksi tetap terjangkau.',
  'Header berada di bagian atas dan tidak ikut bergerak ketika pengguna menggulir isinya.',
  'Footer juga tetap terlihat, jadi pengguna tidak perlu menggulir untuk menemukan tombol aksinya.',
  'Pakai struktur semantik — paragraf, daftar, heading bagian, atau field form — langsung sebagai isi Modal.',
  'Hindari menetapkan tinggi tetap hanya demi menyamai satu contoh desain; panjang isi dan ukuran layar selalu berubah.',
  'Pada layar sempit, lebar Modal menyesuaikan ruang yang ada sambil menyisakan jarak di kedua sisinya.',
  'Consumer tetap menentukan hasil aksi, validasi, status memuat, dan kapan proses dinyatakan selesai.',
  'Kalau proses simpannya lama, tampilkan statusnya pada tombol aksi tanpa mengubah tanggung jawab Modal.',
  'Pesan error dari server tetap bagian dari konten atau form yang Anda susun sendiri di dalam Modal.',
  'Konten yang terstruktur sebaiknya menjaga urutan baca yang jelas supaya tetap terbaca saat digulir.',
  'Pakai label yang spesifik pada tombol aksi supaya pengguna paham akibatnya sebelum menekan.',
  'Untuk tindakan yang merusak data, sediakan pilihan batal dan jangan arahkan fokus awal ke tombol perusaknya.',
  'Gambar boleh diletakkan bersama teks selama sumber, teks alternatif, dan perilaku responsifnya Anda tentukan.',
  'Tabel atau daftar panjang tetap bisa dipakai, tapi Anda yang memastikan isinya ikut responsif.',
  'Tombol di footer menjalankan aksi milik consumer dan tidak menutup Modal secara otomatis.',
  'Secara bawaan, klik latar dan tombol Escape menutup Modal melalui state internalnya.',
  'Contoh ini sengaja tidak menetapkan tinggi tetap — gulirannya muncul sendiri dari panjang isi dan ukuran layar.',
]

const ceplokCopy = [
  'Ceplok merupakan platform digital yang dirancang untuk mempermudah akses layanan pemerintah dengan pendekatan yang lebih modern, efisien, dan ramah pengguna. Melalui penyederhanaan alur layanan, Ceplok berfokus pada kemudahan pengguna',
  'Dalam pengembangannya, Ceplok mengadopsi prinsip desain berbasis kebutuhan pengguna (user-centered design), memastikan setiap fitur menjawab masalah nyata di lapangan. Elemen seperti navigasi, form input, dan komponen notifikasi ditampilkan secara sederhana tanpa detail visual berlebihan',
]

function ModalExampleCode({
  variant,
  example,
  size,
  dismissal,
}: {
  variant: ModalVariant
  example: ModalExample
  size: ModalSize
  dismissal: { closeOnBackdrop: boolean; closeOnEscape: boolean; showCloseButton: boolean }
}) {
  const dismissalCode = Object.entries(dismissal)
    .filter(([, enabled]) => !enabled)
    .map(([prop]) => (
      <Fragment key={prop}>
        {'\n  '}
        <H>{prop}</H>
        {'={false}'}
      </Fragment>
    ))
  const judul = example === 'long' ? 'Ketentuan Layanan' : 'Terms of Service'

  if (variant === 'popup') {
    return (
      <>
        {"import { Button, Icon, Modal } from '@ceplok-ui/design-kit-react'\n"}
        {"import { ExclamationCircle } from '@ceplok-ui/design-kit-react/icons/solid'\n"}
        {'\n<Modal\n  trigger={<Button>Buka Modal</Button>}'}
        {dismissalCode}
        {'\n  '}
        <H>variant</H>
        {'="popup"\n  '}
        <H>aria-label</H>
        {'="Konfirmasi hapus konten"\n  footer={({ close }) => (\n    <div className="flex w-full justify-center gap-4">\n      <Button variant="outline" theme="gray" size="xs" onClick={close}>\n        Tidak, Batalkan\n      </Button>\n      <Button theme="orange" size="xs" onClick={close}>\n        Ya, hapus konten ini\n      </Button>\n    </div>\n  )}\n>\n  <div className="text-center">\n    <div className="flex justify-center">\n      <Icon className="size-12 text-orange-600"><ExclamationCircle /></Icon>\n    </div>\n    <p className="mx-auto mt-4 max-w-xs text-body font-medium text-gray-500">\n      Apakah anda yakin ingin menghapus konten ini?\n    </p>\n  </div>\n</Modal>'}
      </>
    )
  }

  return (
    <>
      {"import { Button, Modal } from '@ceplok-ui/design-kit-react'\n"}
      {'\n<Modal\n  trigger={<Button>Buka Modal</Button>}'}
      {dismissalCode}
      {size === 'm' && (
        <>
          {'\n  '}
          <H>size</H>
          {'="m"'}
        </>
      )}
      {`\n  title="${judul}"\n  footer={({ close }) => <Button size="xs" onClick={close}>${
        example === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'
      }</Button>}\n>\n`}
      {example === 'image' ? (
        <>
          {'  <'}
          <H>img</H>
          {'\n    src="/images/ceplok.svg"\n    alt="Ilustrasi motif Ceplok"\n    className="h-[437px] w-full rounded-lg object-cover"\n  />'}
          {`\n  <div className="mt-5 space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </>
      ) : example === 'long' ? (
        '  {/* Konten panjang; body Modal akan menggulir secara otomatis. */}\n</Modal>'
      ) : (
        `  <div className="space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`
      )}
    </>
  )
}

const modalProps: PropRow[] = [
  ['trigger', 'ReactElement', 'required', 'Tombol milik consumer yang membuka Modal.'],
  ['variant', "'default' | 'popup'", "'default'", 'Menentukan struktur Modal. Popup digunakan untuk dialog konfirmasi ringkas.'],
  ['size', "'s' | 'm'", "'s'", 'Ukuran Default Modal. Tidak tersedia untuk Popup.'],
  ['title', 'ReactNode', 'undefined', 'Judul Default Modal sekaligus nama aksesibel. Tidak tersedia untuk Popup.'],
  ['closeOnBackdrop', 'boolean', 'true', 'Tutup Modal saat klik backdrop. Tidak memengaruhi klik di dalam dialog.'],
  ['closeOnEscape', 'boolean', 'true', 'Tutup Modal saat menekan Escape. Jika false, cancel native dicegah.'],
  ['showCloseButton', 'boolean', 'true', 'Tampilkan tombol X. Jika false, tombol dihapus sepenuhnya.'],
  ['closeLabel', 'string', "'Tutup modal'", 'Nama aksesibel tombol tutup.'],
  ['footer', 'ReactNode | ({ close }) => ReactNode', 'undefined', 'Area aksi Default dan Popup. Render function menyediakan close untuk penutupan eksplisit; footer Popup tidak memakai divider.'],
  ['children', 'ReactNode', 'undefined', 'Isi Modal. Pada Popup, icon dan pesan disusun di sini.'],
  ['className', 'string', 'undefined', 'Class tambahan pada elemen <dialog>.'],
  [
    '…props',
    "Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel' | 'title'>",
    '—',
    'Atribut dialog native yang didukung diteruskan ke <dialog>. open, onClose, dan onCancel sengaja tidak tersedia sebagai API publik; title diatur khusus untuk Default.',
  ],
]

const toc: TocEntry[] = [
  { id: 'modal', label: 'Modal' },
  { id: 'popup', label: 'Popup' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function ModalPage() {
  const [playgroundVariant, setPlaygroundVariant] = useState<ModalVariant>('default')
  const [playgroundExample, setPlaygroundExample] = useState<ModalExample>('basic')
  const [playgroundSize, setPlaygroundSize] = useState<ModalSize>('s')

  const [dismissal, setDismissal] = useState({
    closeOnBackdrop: true,
    closeOnEscape: true,
    showCloseButton: true,
  })

  const isPopup = playgroundVariant === 'popup'

  return (
    <UsulanPage
      eyebrow="Components"
      title="Modal"
      description="Dialog untuk informasi atau tindakan yang perlu diselesaikan sebelum kembali ke halaman utama. Gunakan Default untuk konten umum dan Popup untuk konfirmasi ringkas."
      toc={toc}
    >
      <FlowSection id="modal" title="Modal">
        <Lead>
          Gunakan Default untuk informasi, form, atau konten umum. Variant dan ukuran S tidak perlu
          ditulis karena keduanya merupakan nilai bawaan.
        </Lead>

        <div className="mt-4">
          <Modal
            trigger={<Button>Buka Default</Button>}
            title="Terms of Service"
            footer={({ close }) => (
              <>
                <Button variant="outline" theme="gray" size="xs" onClick={close}>
                  Batal
                </Button>
                <Button size="xs" onClick={close}>
                  Saya Setuju
                </Button>
              </>
            )}
          >
            <p>{ceplokCopy[0]}</p>
          </Modal>
        </div>

        <SectionCode>
          {'<Modal\n  trigger={<Button>Buka Modal</Button>}\n  title="Terms of Service"\n  footer={({ close }) => (\n    <>\n      <Button onClick={close}>Batal</Button>\n      <Button onClick={close}>Saya Setuju</Button>\n    </>\n  )}\n>\n  ...\n</Modal>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="popup" title="Popup">
        <Lead>
          Gunakan Popup untuk konfirmasi atau keputusan ringkas. Susun icon dan pesan di dalam
          children, lalu tempatkan tombol aksi di footer tanpa divider.
        </Lead>

        <div className="mt-4">
          <Modal
            trigger={<Button>Buka Popup</Button>}
            variant="popup"
            aria-label="Konfirmasi hapus konten"
            footer={({ close }) => (
              <div className="flex w-full justify-center gap-4">
                <Button variant="outline" theme="gray" size="xs" onClick={close}>
                  Tidak, Batalkan
                </Button>
                <Button theme="orange" size="xs" onClick={close}>
                  Ya, hapus konten ini
                </Button>
              </div>
            )}
          >
            <div className="text-center">
              <div className="flex justify-center">
                <Icon className="size-12 text-orange-600">
                  <ExclamationCircle />
                </Icon>
              </div>
              <p className="mx-auto mt-4 max-w-xs text-body font-medium text-gray-500">
                Apakah anda yakin ingin menghapus konten ini?
              </p>
            </div>
          </Modal>
        </div>

        <SectionCode>
          {'<Modal\n  trigger={<Button>Buka Modal</Button>}\n  '}
          <H>variant</H>
          {'="popup"\n  '}
          <H>aria-label</H>
          {'="Konfirmasi hapus konten"\n  footer={({ close }) => (\n    <div className="flex w-full justify-center gap-4">\n      <Button onClick={close}>Tidak, Batalkan</Button>\n      <Button onClick={close}>Ya, hapus konten ini</Button>\n    </div>\n  )}\n>\n  ...\n</Modal>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="sizes" title="Sizes">
        <Lead>
          Ukuran S dan M hanya berlaku pada Default Modal. Popup menggunakan ukuran bawaannya
          sendiri. Kedua ukuran Default tetap menyisakan jarak pada layar sempit.
        </Lead>

        <div className="grid gap-4 sm:grid-cols-2">
          {sizes.map((item) => (
            <article key={item.value} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Size {item.label}</h3>
                  <p className="mt-1 text-body-sm text-gray-500">{item.description}</p>
                </div>
                <span className="shrink-0 rounded-md bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">
                  {item.value === 's' ? '416px' : '640px'} max
                </span>
              </div>
              <div className="mt-4">
                <Modal
                  trigger={<Button>Buka Modal {item.label}</Button>}
                  size={item.value}
                  title="Terms of Service"
                  footer={({ close }) => (
                    <Button size="xs" onClick={close}>
                      Ya, saya setuju
                    </Button>
                  )}
                >
                  <div className="space-y-4">
                    {ceplokCopy.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </Modal>
              </div>
            </article>
          ))}
        </div>

        <SectionCode>
          {'<Modal\n  trigger={<Button>Buka Modal</Button>}\n  '}
          <H>size</H>
          {`="m"\n  title="Terms of Service"\n  footer={({ close }) => (\n    <Button size="xs" onClick={close}>Ya, saya setuju</Button>\n  )}\n>\n  <div className="space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </SectionCode>

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500">
          Size S digunakan secara bawaan. Gunakan <code>size=&quot;m&quot;</code> untuk lebar M.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Variant menentukan struktur Modal. Default memakai ukuran S secara bawaan; ubah ke M bila
          diperlukan. Popup menggunakan struktur dan ukuran bawaannya sendiri.
        </Lead>

        <Stage maxWidth="max-w-[420px]">
          <div className="flex min-h-40 items-center justify-center">
            {isPopup ? (
              <Modal
                {...dismissal}
                trigger={<Button>Buka Modal</Button>}
                variant="popup"
                aria-label="Konfirmasi hapus konten"
                footer={({ close }) => (
                  <div className="flex w-full justify-center gap-4">
                    <Button variant="outline" theme="gray" size="xs" onClick={close}>
                      Tidak, Batalkan
                    </Button>
                    <Button theme="orange" size="xs" onClick={close}>
                      Ya, hapus konten ini
                    </Button>
                  </div>
                )}
              >
                <div className="text-center">
                  <div className="flex justify-center">
                    <Icon className="size-12 text-orange-600">
                      <ExclamationCircle />
                    </Icon>
                  </div>
                  <p className="mx-auto mt-4 max-w-xs text-body font-medium text-gray-500">
                    Apakah anda yakin ingin menghapus konten ini?
                  </p>
                </div>
              </Modal>
            ) : (
              <Modal
                {...dismissal}
                trigger={<Button>Buka Modal</Button>}
                size={playgroundSize}
                title={playgroundExample === 'long' ? 'Ketentuan Layanan' : 'Terms of Service'}
                footer={({ close }) => (
                  <Button size="xs" onClick={close}>
                    {playgroundExample === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'}
                  </Button>
                )}
              >
                {playgroundExample === 'image' ? (
                  <>
                    <img
                      src="/images/ceplok.svg"
                      alt="Ilustrasi motif Ceplok"
                      className="h-[437px] w-full rounded-lg object-cover"
                    />
                    <div className="mt-5 space-y-4">
                      {ceplokCopy.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </>
                ) : playgroundExample === 'long' ? (
                  <div className="space-y-5">
                    {longContent.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ceplokCopy.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </Modal>
            )}
          </div>
        </Stage>

        <Controls>
          <Control label="Variant">
            <Segmented
              label="Pilih variant Modal"
              value={playgroundVariant}
              onChange={setPlaygroundVariant}
              options={variants}
            />
          </Control>

          <Control label="Size">
            <Segmented
              label="Pilih ukuran Modal"
              value={playgroundSize}
              onChange={setPlaygroundSize}
              options={sizes.map(({ value, label }) => ({ value, label }))}
              disabled={isPopup}
            />
          </Control>

          <Control label="Contoh">
            <Segmented
              label="Pilih contoh susunan Modal"
              value={playgroundExample}
              onChange={setPlaygroundExample}
              options={examples}
              itemClassName="basis-1/2 justify-center px-2.5"
              wrap
              disabled={isPopup}
            />
          </Control>

          <Control label="Cara Menutup">
            <div className="flex flex-col gap-2">
              {([
                ['closeOnBackdrop', 'Tutup lewat backdrop'],
                ['closeOnEscape', 'Tutup lewat Escape'],
                ['showCloseButton', 'Tampilkan tombol X'],
              ] as const).map(([prop, label]) => (
                <label key={prop} className="flex items-center gap-2 text-body-sm">
                  <input
                    type="checkbox"
                    checked={dismissal[prop]}
                    onChange={(event) => setDismissal({ ...dismissal, [prop]: event.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </Control>
        </Controls>

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500">
          Variant menentukan struktur Modal. Contoh hanya mengubah komposisi konten pada Default,
          sedangkan Size mengatur lebar maksimum Default Modal.
        </p>
        {isPopup && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Popup digunakan untuk konfirmasi ringkas. Gunakan <H>aria-label</H> atau{' '}
            <H>aria-labelledby</H> sebagai nama aksesibel, susun icon dan pesan di dalam children,
            lalu tempatkan tombol di footer. Contoh dan Size hanya tersedia untuk Default Modal.
          </p>
        )}
        {!isPopup && playgroundExample === 'image' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Gambar disusun sebagai bagian dari children; Modal tidak memiliki prop khusus untuk
            gambar.
          </p>
        )}
        {!isPopup && playgroundExample === 'long' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Konten panjang menggunakan gulir body Modal secara otomatis tanpa prop khusus.
          </p>
        )}

      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Kode mengikuti pilihan di Playground. Prop yang nilainya masih bawaan sengaja tidak
          ditulis.
        </Lead>

        <SectionCode flush>
          <ModalExampleCode
            variant={playgroundVariant}
            example={playgroundExample}
            size={playgroundSize}
            dismissal={dismissal}
          />
        </SectionCode>

        <p className="mt-5 max-w-2xl text-body-sm text-gray-500">
          Panggil <code>close()</code> hanya ketika aksi perlu menutup Modal. Untuk validasi atau
          proses asinkron, panggil setelah proses berhasil. Ketiga kontrol penutupan bekerja
          independen; <code>close()</code> tetap dapat menutup Modal apa pun nilainya.
          Jika backdrop, Escape, dan tombol X dinonaktifkan, sediakan aksi eksplisit yang
          memanggil <code>close()</code>, misalnya tombol Saya Mengerti di footer.
        </p>

        <h3 className="mt-8 text-sm font-black text-gray-900">State dan aksi</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal mengelola visibilitasnya secara internal. State aplikasi atau form di dalam Modal,
          validasi, dan pengiriman asinkron tetap menjadi tanggung jawab consumer. Modal tidak
          mengambil alih event submit atau otomatis menutup setelah tombol aksi ditekan. Gunakan
          fungsi <code>close()</code> dari render function footer setelah proses berhasil.
        </p>
        <SectionCode>
          {'<Modal\n  trigger={<Button>Edit data</Button>}\n  title="Edit data"\n  '}
          <H>footer</H>
          {'={({ close }) => (\n    <>\n      <Button variant="outline" theme="gray" onClick={close}>Batal</Button>\n      <Button\n        onClick={async () => {\n          const success = await save()\n          if (success) close()\n        }}\n      >\n        Simpan\n      </Button>\n    </>\n  )}\n>\n  {/* Form milik consumer; save() menjalankan validasi dan penyimpanan. */}\n</Modal>'}
        </SectionCode>

        <p className="mt-5 max-w-2xl text-body-sm text-gray-500">
          Gunakan <code>className</code> untuk gaya tambahan. Utility yang bertabrakan tetap
          terpasang karena <code>cn()</code> memakai clsx; hasil override mengikuti urutan CSS,
          bukan urutan class. Untuk pilihan lebar Default, utamakan <code>size="s"</code> atau{' '}
          <code>size="m"</code>. Popup tidak menerima ukuran yang dapat dikonfigurasi.
        </p>

        <h3 className="mt-8 text-sm font-black text-gray-900">Accessibility</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          {isPopup ? (
            <>
              Popup tidak memiliki judul visual. Berikan <code>aria-label</code> atau{' '}
              <code>aria-labelledby</code> sebagai nama aksesibel Modal.
            </>
          ) : (
            <>
              Gunakan <code>title</code> khusus Default sebagai judul sekaligus nama aksesibel
              Modal, kecuali Anda memberikan <code>aria-label</code> atau{' '}
              <code>aria-labelledby</code> sendiri. Jika Modal
              tidak memiliki judul visual, berikan <code>aria-label</code> atau{' '}
              <code>aria-labelledby</code>.
            </>
          )}
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Untuk nama eksplisit, gunakan <code>aria-label</code> atau arahkan{' '}
          <code>aria-labelledby</code> ke ID elemen di dalam dialog yang memuat namanya.
          Pastikan Popup selalu memiliki nama aksesibel.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Title Default sudah dirender sebagai <code>&lt;h2&gt;</code>; jangan membungkus isinya
          dengan heading tambahan hanya untuk membuat judul. Modal tidak otomatis membuat{' '}
          <code>aria-describedby</code>; berikan atribut tersebut bila diperlukan.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Elemen native <code>&lt;dialog&gt;</code> menyediakan perilaku dialog dan top layer;
          browser mengelola fokus serta membuat latar belakang tidak interaktif. Susun kontrol
          awal yang aman, misalnya Batal, dan jangan arahkan fokus awal ke aksi yang merusak data.
        </p>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;dialog&gt;</H> yang didukung diteruskan, dengan pengecualian{' '}
          <code>open</code>, <code>onClose</code>, dan <code>onCancel</code> dari API publik.
          Prop <code>title</code> diatur khusus untuk Default.
        </Lead>
        <PropsTable rows={modalProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
