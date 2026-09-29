import { useState } from 'react'
import { ExclamationCircle } from '../../../lib/icons/outline'
import { Button, Icon, Modal, type ModalSize } from '../../../lib'
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
    description: 'Untuk konfirmasi, informasi singkat, atau form sederhana.',
  },
  {
    value: 'm',
    label: 'M',
    description: 'Untuk konten panjang, form lebih besar, atau konten dengan gambar.',
  },
]

type ModalExample = 'basic' | 'image' | 'confirmation' | 'long'

const examples: { value: ModalExample; label: string }[] = [
  { value: 'basic', label: 'Dasar' },
  { value: 'image', label: 'Dengan Gambar' },
  { value: 'confirmation', label: 'Konfirmasi' },
  { value: 'long', label: 'Konten Panjang' },
]

const longContent = [
  'Modal dapat memuat informasi yang perlu dibaca sebelum pengguna melanjutkan proses.',
  'Saat isi bertambah, tinggi panel tetap dibatasi viewport agar tombol tutup dan tombol aksi tetap terjangkau.',
  'Header berada di bagian atas dan tidak ikut bergerak ketika pengguna menggulir isinya.',
  'Footer juga tetap terlihat, jadi pengguna tidak perlu menggulir untuk menemukan tombol aksinya.',
  'Pakai struktur semantik — paragraf, daftar, heading bagian, atau field form — langsung sebagai isi Modal.',
  'Hindari menetapkan tinggi tetap hanya demi menyamai satu contoh desain; panjang isi dan ukuran layar selalu berubah.',
  'Pada layar sempit, lebar Modal menyesuaikan ruang yang ada sambil menyisakan jarak di kedua sisinya.',
  'Consumer tetap menentukan hasil aksi, validasi, status memuat, dan kapan `open` berubah jadi false.',
  'Kalau proses simpannya lama, tampilkan statusnya pada tombol aksi tanpa mengubah tanggung jawab Modal.',
  'Pesan error dari server tetap bagian dari konten atau form yang Anda susun sendiri di dalam Modal.',
  'Konten yang terstruktur sebaiknya menjaga urutan baca yang jelas supaya tetap terbaca saat digulir.',
  'Pakai label yang spesifik pada tombol aksi supaya pengguna paham akibatnya sebelum menekan.',
  'Untuk tindakan yang merusak data, sediakan pilihan batal dan jangan arahkan fokus awal ke tombol perusaknya.',
  'Gambar boleh diletakkan bersama teks selama sumber, teks alternatif, dan perilaku responsifnya Anda tentukan.',
  'Tabel atau daftar panjang tetap bisa dipakai, tapi Anda yang memastikan isinya ikut responsif.',
  'Tombol di footer tidak menutup Modal sendiri, jadi proses asinkron sempat selesai sebelum dialognya tertutup.',
  'Klik latar dan tombol Escape hanya MEMINTA penutupan lewat onClose; `open` tetap milik Anda.',
  'Contoh ini sengaja tidak menetapkan tinggi tetap — gulirannya muncul sendiri dari panjang isi dan ukuran layar.',
]

function ModalExampleCode({ example, size }: { example: ModalExample; size: ModalSize }) {
  const judul =
    example === 'image'
      ? 'Designing Interfaces'
      : example === 'long'
        ? 'Ketentuan Layanan'
        : 'Terms of Service'

  return (
    <>
      {example === 'confirmation'
        ? "import { Button, Icon, Modal } from '@ceplok-ui/design-kit-react'\n"
        : "import { Button, Modal } from '@ceplok-ui/design-kit-react'\n"}
      {example === 'confirmation' &&
        "import { ExclamationCircle } from '@ceplok-ui/design-kit-react/icons/outline'\n"}
      {'\nconst [open, setOpen] = useState(false)\n'}
      {example === 'confirmation' &&
        '\nasync function handleDelete() {\n  await deleteContent()\n  setOpen(false)\n}\n'}
      {'\n<Modal\n  open={open}\n  onClose={() => setOpen(false)}\n  '}
      <H>{`size="${size}"`}</H>

      {example === 'confirmation' ? (
        <>
          {'\n  '}
          <H>aria-label=&quot;Konfirmasi hapus konten&quot;</H>
          {'\n  '}
          <H>footer</H>
          {'={\n    <div className="flex w-full justify-center gap-3">\n      <Button variant="outline" theme="gray" size="xs" onClick={() => setOpen(false)}>\n        Tidak, Batalkan\n      </Button>\n      <Button theme="orange" size="xs" onClick={handleDelete}>\n        Ya, hapus konten ini\n      </Button>\n    </div>\n  }\n>\n  <div className="text-center">\n    <Icon><ExclamationCircle /></Icon>\n    <p>Apakah anda yakin ingin menghapus konten ini?</p>\n  </div>\n</Modal>'}
        </>
      ) : (
        <>
          {'\n  '}
          <H>title</H>
          {`="${judul}"\n  `}
          <H>footer</H>
          {`={<Button size="xs" onClick={() => setOpen(false)}>${example === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'
            }</Button>}\n>\n`}
          {example === 'image' ? (
            <>
              {'  '}
              <H>
                {'<img\n    src={imageUrl}\n    alt="Sampul Designing Interfaces"\n    className="aspect-video w-full rounded-lg object-cover"\n  />'}
              </H>
              {'\n  <p className="mt-5">...</p>\n</Modal>'}
            </>
          ) : example === 'long' ? (
            <>
              {'  '}
              <H>{'{/* Konten panjang; badannya menggulir sendiri. */}'}</H>
              {'\n</Modal>'}
            </>
          ) : (
            '  <p>Modal tetap responsif pada viewport sempit.</p>\n</Modal>'
          )}
        </>
      )}
    </>
  )
}

const modalProps: PropRow[] = [
  ['open', 'boolean', 'required', 'Menentukan apakah Modal sedang terbuka.'],
  ['onClose', '() => void', 'required', 'Meminta consumer menutup Modal dengan memperbarui state open.'],
  ['size', "'s' | 'm'", "'s'", 'Lebar maksimum: 416px untuk s, 640px untuk m.'],
  ['title', 'ReactNode', 'undefined', 'Judul di header. Sekaligus nama aksesibilitas dialog bila aria-label tidak diisi.'],
  ['dismissible', 'boolean', 'true', 'Tombol tutup di kanan header. Matikan bila modalnya harus diselesaikan lewat tombol footer.'],
  ['closeLabel', 'string', "'Tutup modal'", 'Nama aksesibel tombol tutup.'],
  ['footer', 'ReactNode', 'undefined', 'Baris tombol di kaki modal. Tidak dirender bila kosong.'],
  ['children', 'ReactNode', 'undefined', 'Isi modal, di antara header dan footer. Bagian inilah yang menggulir.'],
  ['className', 'string', 'undefined', 'Class tambahan pada elemen <dialog>.'],
  [
    '…props',
    'DialogHTMLAttributes<HTMLDialogElement>',
    '—',
    'Atribut dialog native diteruskan; open, onClose, dan onCancel dikelola Modal.',
  ],
]

const toc: TocEntry[] = [
  { id: 'sizes', label: 'Sizes' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function ModalPage() {
  const [sizeExample, setSizeExample] = useState<ModalSize | null>(null)
  const [playgroundExample, setPlaygroundExample] = useState<ModalExample>('basic')
  const [playgroundSize, setPlaygroundSize] = useState<ModalSize>('s')
  const [playgroundOpen, setPlaygroundOpen] = useState(false)

  const handleExampleChange = (example: ModalExample) => {
    setPlaygroundOpen(false)
    setPlaygroundExample(example)
  }

  const isKonfirmasi = playgroundExample === 'confirmation'

  return (
    <UsulanPage
      eyebrow="Components"
      title="Modal"
      description="Dialog di atas halaman untuk informasi atau tindakan yang perlu diselesaikan sebelum kembali ke halaman utama. Susunannya ditentukan prop — title, children, footer — seperti Alert dan Card."
      toc={toc}
    >
      <FlowSection id="sizes" title="Sizes">
        <Lead>
          Pilih ukuran berdasarkan kerumitan isinya, bukan untuk memaksakan lebar halaman. Keduanya
          mengisi ruang yang tersedia dan tetap menyisakan jarak pada layar sempit.
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
              <Button size="xs" className="mt-4" onClick={() => setSizeExample(item.value)}>
                Buka Modal {item.label}
              </Button>
            </article>
          ))}
        </div>

        <Modal
          open={sizeExample !== null}
          size={sizeExample ?? 's'}
          onClose={() => setSizeExample(null)}
          title="Terms of Service"
          footer={
            <Button size="xs" onClick={() => setSizeExample(null)}>
              Ya, saya setuju
            </Button>
          }
        >
          <p>
            Baca informasi berikut sebelum melanjutkan. Tinggi Modal mengikuti isinya, dan badannya
            bergulir sendiri ketika isinya melebihi ruang layar.
          </p>
        </Modal>

        <SectionCode>
          {'<Modal\n  open={open}\n  onClose={handleClose}\n  size="s"\n  title="Terms of Service"\n  footer={<Button size="xs">Ya, saya setuju</Button>}\n>\n  <p>...</p>\n</Modal>\n\n'}
          {'<Modal open={open} onClose={handleClose} '}
          <H>size=&quot;m&quot;</H>
          {' title="..." >\n  ...\n</Modal>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Pilih susunan isi dan ukurannya, lalu buka satu pratinjau. Tombol tutup, latar, dan Escape
          memanggil callback yang memperbarui state <H>open</H>.
        </Lead>

        <Stage maxWidth="max-w-[420px]">
          <div className="flex min-h-40 items-center justify-center">
            <Button onClick={() => setPlaygroundOpen(true)}>Buka Modal</Button>
          </div>
        </Stage>

        <Controls>
          <Control label="Contoh">
            <Segmented
              label="Pilih contoh susunan Modal"
              value={playgroundExample}
              onChange={handleExampleChange}
              options={examples}
              itemClassName="basis-1/2 justify-center px-2.5"
              wrap
            />
          </Control>

          <Control label="Size">
            <Segmented
              label="Pilih ukuran Modal"
              value={playgroundSize}
              onChange={(val) => setPlaygroundSize(val as ModalSize)}
              options={sizes.map(({ value, label }) => ({ value, label }))}
            />
          </Control>
        </Controls>

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500">
          Pilihan Contoh hanya mengubah isi demonya, bukan prop Modal. Size adalah prop publik yang
          menentukan lebar maksimumnya.
        </p>
        {playgroundExample === 'image' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Gambar diletakkan langsung sebagai isi Modal bersama konten lain; Modal tidak punya prop
            khusus untuk gambar.
          </p>
        )}
        {isKonfirmasi && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Konfirmasi ini tidak memakai <H>title</H>, jadi headernya tinggal tombol tutup dan nama
            dialognya datang dari <H>aria-label</H>. Tombolnya dirapatkan ke tengah lewat satu
            pembungkus <H>w-full</H> di dalam <H>footer</H> — Modal tidak menyediakan prop untuk
            mengatur tata letak footer, sama seperti <H>actions</H> pada Alert.
          </p>
        )}
        {playgroundExample === 'long' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Konten panjang menguji guliran alami badan Modal, tanpa tinggi tetap atau prop khusus.
          </p>
        )}

        <Modal
          open={playgroundOpen}
          size={playgroundSize}
          onClose={() => setPlaygroundOpen(false)}
          aria-label={isKonfirmasi ? 'Konfirmasi hapus konten' : undefined}
          title={
            isKonfirmasi
              ? undefined
              : playgroundExample === 'image'
                ? 'Designing Interfaces'
                : playgroundExample === 'long'
                  ? 'Ketentuan Layanan'
                  : 'Terms of Service'
          }
          footer={
            isKonfirmasi ? (
              <div className="flex w-full justify-center gap-3">
                <Button
                  variant="outline"
                  theme="gray"
                  size="xs"
                  onClick={() => setPlaygroundOpen(false)}
                >
                  Tidak, Batalkan
                </Button>
                <Button theme="orange" size="xs" onClick={() => setPlaygroundOpen(false)}>
                  Ya, hapus konten ini
                </Button>
              </div>
            ) : (
              <Button size="xs" onClick={() => setPlaygroundOpen(false)}>
                {playgroundExample === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'}
              </Button>
            )
          }
        >
          {playgroundExample === 'image' ? (
            <>
              <img
                src="/images/3154bf66990a1dfa79977d6ea6c1e4d16d80037a.png"
                alt="Sampul Designing Interfaces"
                className="aspect-video w-full rounded-lg object-cover object-top"
              />
              <p className="mt-5">
                Consumer menentukan sumber, teks alternatif, rasio, dan cara gambar mengisi ruangnya.
              </p>
            </>
          ) : isKonfirmasi ? (
            <div className="text-center">
              <Icon className="mx-auto size-14 text-gray-400">
                <ExclamationCircle />
              </Icon>
              <p className="mx-auto mt-4 max-w-xs text-body text-gray-500">
                Apakah anda yakin ingin menghapus konten ini?
              </p>
            </div>
          ) : playgroundExample === 'long' ? (
            <div className="space-y-5">
              {longContent.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p>
              Modal tetap responsif pada viewport sempit. Ukuran hanya menentukan lebar maksimum,
              bukan lebar paksa.
            </p>
          )}
        </Modal>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Modal mengurus wadah dialog, latar, tombol tutup, dan susunan tiga bagiannya. Anda yang
          memegang state <H>open</H>, callback <H>onClose</H>, tombol aksi, pengiriman form, proses
          asinkron, dan kapan modalnya benar-benar ditutup.
        </Lead>

        <SectionCode flush>
          <ModalExampleCode example={playgroundExample} size={playgroundSize} />
        </SectionCode>

        <h3 className="mt-8 text-sm font-black text-gray-900">State dan aksi</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal tidak menutup dirinya setelah tombol aksi ditekan. Jalankan validasi atau proses
          simpan di handler Anda, lalu ubah <code>open</code> jadi false setelah berhasil. Modal juga
          tidak mengambil alih event submit form.
        </p>
        <SectionCode>
          {'<Button\n  onClick={async () => {\n    await saveData()\n    setOpen(false)\n  }}\n>\n  Simpan\n</Button>'}
        </SectionCode>

        <p className="mt-5 max-w-2xl text-body-sm text-gray-500">
          Pakai <code>className</code> untuk gaya tambahan yang tidak bertabrakan dengan tata letak
          bawaannya. Jangan mengandalkan utility yang bertabrakan untuk mengganti width, max-height,
          overflow, atau perilaku flex — <code>cn()</code> di kit ini clsx biasa, jadi kelas yang
          bertabrakan sama-sama terpasang dan urutan CSS yang menentukan. Untuk lebar, pilih{' '}
          <code>size=&quot;s&quot;</code> atau <code>size=&quot;m&quot;</code>.
        </p>

        <h3 className="mt-10 text-sm font-black text-gray-900">Perilaku menutup</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal bisa ditutup lewat tombol tutup, klik pada latar, atau Escape. Ketiganya hanya
          memanggil <code>onClose</code> — Modal tidak menyimpan keadaan buka/tutupnya sendiri, jadi
          tidak ada dua sumber kebenaran yang bisa melenceng. Untuk dialog yang wajib diselesaikan,
          matikan <code>dismissible</code> supaya tombol tutupnya hilang dan hanya tombol di footer
          yang tersisa.
        </p>

        <h3 className="mt-8 text-sm font-black text-gray-900">Accessibility</h3>
        <div className="mt-1 max-w-2xl space-y-3 text-body-sm text-gray-500">
          <p>
            Modal memakai elemen <code>&lt;dialog&gt;</code> bawaan. Isi <code>title</code> otomatis
            menjadi nama aksesibel dialognya — ia dirender sebagai <code>&lt;h2&gt;</code>, jadi
            jangan membungkusnya lagi dengan heading Anda sendiri. Bila tidak ada judul yang
            terlihat, beri <code>aria-label</code>. Isi modal tidak otomatis dipakai sebagai{' '}
            <code>aria-describedby</code>.
          </p>
          <p>
            Dialog bawaan yang mengurus fokus awal, top layer, dan mematikan latar belakangnya. Untuk
            tindakan yang merusak data, jangan arahkan fokus awal ke tombol perusaknya — dahulukan
            pilihan yang lebih aman seperti Batal.
          </p>
        </div>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;dialog&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={modalProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
