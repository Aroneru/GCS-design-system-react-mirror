import { useState } from 'react'
import { ExclamationCircle } from '../../../lib/icons/outline'
import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalSize,
} from '../../../lib'
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
  'Saat isi bertambah, tinggi panel tetap dibatasi oleh viewport agar tombol tutup dan action tetap dapat dijangkau.',
  'Header berada di bagian atas dan tidak ikut bergerak ketika pengguna menggulir isi ModalBody.',
  'Footer juga tetap terlihat sehingga pengguna tidak perlu menggulir halaman utama untuk menemukan action.',
  'Gunakan struktur semantik seperti paragraf, daftar, heading bagian, atau field form langsung di dalam ModalBody.',
  'Hindari menetapkan tinggi tetap hanya untuk menyamai satu contoh desain karena panjang isi dan ukuran viewport dapat berubah.',
  'Pada perangkat yang lebih sempit, lebar Modal menyesuaikan ruang yang tersedia sambil mempertahankan gutter di kedua sisi.',
  'Consumer tetap menentukan hasil action, validasi, status loading, dan kapan state open diubah menjadi false.',
  'Jika proses menyimpan data membutuhkan waktu, tampilkan status yang relevan pada action tanpa mengubah tanggung jawab Modal.',
  'Pesan error dari server tetap menjadi bagian dari content atau form yang disusun consumer di dalam ModalBody.',
  'Konten yang terstruktur sebaiknya mempertahankan urutan baca yang jelas agar tetap mudah dipahami saat body digulir.',
  'Gunakan label yang spesifik pada action sehingga pengguna memahami konsekuensi sebelum menjalankan perubahan.',
  'Untuk tindakan destruktif, sediakan pilihan pembatalan dan jangan mengarahkan fokus awal ke action yang merusak data.',
  'Gambar dapat ditempatkan bersama teks selama sumber, alternative text, dan perilaku responsifnya ditentukan oleh consumer.',
  'Tabel atau daftar panjang tetap dapat digunakan, tetapi consumer perlu memastikan kontennya juga responsif di dalam body.',
  'Tombol pada footer tidak ditutup otomatis oleh Modal sehingga proses asynchronous dapat selesai sebelum dialog ditutup.',
  'Klik backdrop dan tombol Escape meminta penutupan melalui onClose dengan state open tetap dimiliki oleh consumer.',
  'Contoh ini sengaja tidak menetapkan fixed height; overflow muncul secara natural dari panjang konten dan ukuran viewport.',
]

function ModalExampleCode({ example, size }: { example: ModalExample; size: ModalSize }) {
  const componentImport =
    example === 'confirmation'
      ? "import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader } from '@tpl/design-kit-react'\n"
      : "import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@tpl/design-kit-react'\n"

  return (
    <>
      {componentImport}
      {example === 'confirmation' &&
        "import { ExclamationCircle } from '@tpl/design-kit-react/icons/outline'\n"}
      {'\nconst [open, setOpen] = useState(false)\n'}
      {example === 'confirmation' &&
        '\nasync function handleDelete() {\n  await deleteContent()\n  setOpen(false)\n}\n'}
      {'\n<Modal open={open} '}
      <H>{`size="${size}"`}</H>
      {' onClose={() => setOpen(false)}'}
      {example === 'confirmation' ? (
        <>
          {'\n  '}
          <H>aria-label=&quot;Konfirmasi hapus konten&quot;</H>
          {'\n>\n  '}
          <H>&lt;ModalHeader /&gt;</H>
          {'\n  <ModalBody>\n    <div className="text-center">\n      <Icon><ExclamationCircle /></Icon>\n      <p>Apakah anda yakin ingin menghapus konten ini?</p>\n    </div>\n  </ModalBody>\n  <ModalFooter className="justify-center">\n    <Button variant="outline" theme="gray" size="xs" onClick={() => setOpen(false)}>\n      Tidak, Batalkan\n    </Button>\n    <Button theme="orange" size="xs" onClick={handleDelete}>\n      Ya, hapus konten ini\n    </Button>\n  </ModalFooter>\n</Modal>'}
        </>
      ) : example === 'image' ? (
        <>
          {'>\n  <ModalHeader>Designing Interfaces</ModalHeader>\n  <ModalBody>\n    '}
          <H>
            {'<img\n      src={imageUrl}\n      alt="Sampul Designing Interfaces"\n      className="aspect-video w-full rounded-lg object-cover"\n    />'}
          </H>
          {'\n    <p className="mt-5">...</p>\n  </ModalBody>\n  <ModalFooter>\n    <Button size="xs" onClick={() => setOpen(false)}>Ya, saya setuju</Button>\n  </ModalFooter>\n</Modal>'}
        </>
      ) : example === 'long' ? (
        <>
          {'>\n  <ModalHeader>Ketentuan Layanan</ModalHeader>\n  <ModalBody>\n    '}
          <H>{'{/* Konten panjang; ModalBody menangani scrolling. */}'}</H>
          {'\n  </ModalBody>\n  <ModalFooter>\n    <Button size="xs" onClick={() => setOpen(false)}>Saya mengerti</Button>\n  </ModalFooter>\n</Modal>'}
        </>
      ) : (
        <>
          {'>\n  <ModalHeader>Terms of Service</ModalHeader>\n  <ModalBody>\n    <p>Modal tetap responsif pada viewport sempit.</p>\n  </ModalBody>\n  <ModalFooter>\n    <Button size="xs" onClick={() => setOpen(false)}>Ya, saya setuju</Button>\n  </ModalFooter>\n</Modal>'}
        </>
      )}
    </>
  )
}

const modalProps: PropRow[] = [
  ['open', 'boolean', 'required', 'Menentukan apakah Modal sedang terbuka.'],
  ['onClose', '() => void', 'required', 'Meminta consumer menutup Modal dengan memperbarui state open.'],
  ['size', "'s' | 'm'", "'s'", 'Lebar maksimum Modal: 416px untuk s dan 640px untuk m.'],
  ['children', 'ReactNode', 'required', 'Susunan ModalHeader, ModalBody, dan ModalFooter.'],
  ['className', 'string', 'undefined', 'Class tambahan nonstruktural pada elemen <dialog>.'],
  [
    '…props',
    'DialogHTMLAttributes<HTMLDialogElement>',
    '—',
    'Atribut dialog native yang aman diteruskan; open, onClose, dan onCancel dikelola Modal.',
  ],
]

const headerProps: PropRow[] = [
  ['children', 'ReactNode', 'undefined', 'Judul yang terlihat dan menjadi nama aksesibel Modal.'],
  ['closeLabel', 'string', "'Tutup modal'", 'Nama aksesibel untuk tombol tutup.'],
  ['className', 'string', 'undefined', 'Class tambahan pada wrapper header.'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut <div> native yang relevan diteruskan.'],
]

const sectionProps: PropRow[] = [
  ['children', 'ReactNode', 'undefined', 'Konten bebas di dalam bagian Modal.'],
  ['className', 'string', 'undefined', 'Class tambahan pada wrapper bagian.'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut <div> native yang relevan diteruskan.'],
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

  return (
    <UsulanPage
      eyebrow="Components"
      title="Modal"
      description="Gunakan Modal untuk meminta perhatian pengguna pada informasi atau tindakan yang perlu diselesaikan sebelum kembali ke halaman utama."
      toc={toc}
    >
      <FlowSection id="sizes" title="Sizes">
        <Lead>
          Pilih ukuran berdasarkan kompleksitas isi, bukan untuk memaksakan lebar halaman. Keduanya
          mengisi ruang yang tersedia dan tetap menyisakan gutter pada viewport sempit.
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
        >
          <ModalHeader>Terms of Service</ModalHeader>
          <ModalBody>
            <p>
              Baca informasi berikut sebelum melanjutkan. Tinggi Modal mengikuti isi dan body akan
              bergulir ketika konten melebihi ruang viewport.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button size="xs" onClick={() => setSizeExample(null)}>
              Ya, saya setuju
            </Button>
          </ModalFooter>
        </Modal>

        <SectionCode>
          {'<Modal open={open} size="s" onClose={handleClose}>\n'}
          {'  <ModalHeader>Terms of Service</ModalHeader>\n'}
          {'  <ModalBody>...</ModalBody>\n'}
          {'  <ModalFooter>...</ModalFooter>\n'}
          {'</Modal>\n\n'}
          {'<Modal open={open} '}
          <H>size=&quot;m&quot;</H>
          {' onClose={handleClose}>\n  ...\n</Modal>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Pilih komposisi konten dan ukuran, lalu buka satu preview Modal. Tombol tutup, backdrop, dan
          Escape memanggil callback yang memperbarui state <H>open</H>.
        </Lead>

        <Stage maxWidth="max-w-[420px]">
          <div className="flex min-h-40 items-center justify-center">
            <Button onClick={() => setPlaygroundOpen(true)}>Buka Modal</Button>
          </div>
        </Stage>

        <Controls>
          <Control label="Contoh">
            <Segmented
              label="Pilih contoh komposisi Modal"
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
              onChange={setPlaygroundSize}
              options={sizes.map(({ value, label }) => ({ value, label }))}
            />
          </Control>
        </Controls>

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500">
          Pilihan Contoh hanya mengubah komposisi konten pada demo dan bukan prop Modal. Size adalah
          prop publik yang menentukan lebar maksimum Modal.
        </p>
        {playgroundExample === 'image' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Gambar ditempatkan langsung di ModalBody bersama konten lain; Modal tidak memiliki prop
            image khusus.
          </p>
        )}
        {playgroundExample === 'confirmation' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Konfirmasi disusun dari compound component yang sama, dengan nama aksesibel eksplisit dan
            tanpa variant khusus pada Modal.
          </p>
        )}
        {playgroundExample === 'long' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Konten panjang menguji scrolling alami ModalBody tanpa fixed height atau prop khusus.
          </p>
        )}

        <Modal
          open={playgroundOpen}
          size={playgroundSize}
          onClose={() => setPlaygroundOpen(false)}
          aria-label={playgroundExample === 'confirmation' ? 'Konfirmasi hapus konten' : undefined}
        >
          <ModalHeader>
            {playgroundExample === 'confirmation'
              ? undefined
              : playgroundExample === 'image'
                ? 'Designing Interfaces'
                : playgroundExample === 'long'
                  ? 'Ketentuan Layanan'
                  : 'Terms of Service'}
          </ModalHeader>
          <ModalBody>
            {playgroundExample === 'image' ? (
              <>
                <img
                  src="/images/3154bf66990a1dfa79977d6ea6c1e4d16d80037a.png"
                  alt="Sampul Designing Interfaces"
                  className="aspect-video w-full rounded-lg object-cover object-top"
                />
                <p className="mt-5">
                  Consumer menentukan sumber, teks alternatif, aspect ratio, dan cara gambar mengisi
                  ruang sesuai kebutuhan konten.
                </p>
              </>
            ) : playgroundExample === 'confirmation' ? (
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
          </ModalBody>
          <ModalFooter className={playgroundExample === 'confirmation' ? 'justify-center' : undefined}>
            {playgroundExample === 'confirmation' ? (
              <>
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
              </>
            ) : (
              <Button size="xs" onClick={() => setPlaygroundOpen(false)}>
                {playgroundExample === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'}
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Modal hanya menangani container dialog, backdrop, close interaction, dan susunan bagian.
          Consumer mengontrol state <H>open</H>, callback <H>onClose</H>, action, form submission,
          proses asynchronous, serta kapan Modal benar-benar ditutup.
        </Lead>

        <SectionCode flush>
          <ModalExampleCode example={playgroundExample} size={playgroundSize} />
        </SectionCode>

        <h3 className="mt-8 text-sm font-black text-gray-900">State dan action</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal tidak otomatis menutup setelah action diklik. Jalankan validasi atau proses simpan
          di handler consumer, lalu ubah <code>open</code> menjadi false setelah proses berhasil.
          Modal juga tidak mengambil alih event submit pada form.
        </p>
        <SectionCode>
          {'<Button\n  onClick={async () => {\n    await saveData()\n    setOpen(false)\n  }}\n>\n  Simpan\n</Button>'}
        </SectionCode>

        <p className="mt-5 max-w-2xl text-body-sm text-gray-500">
          Gunakan <code>className</code> untuk styling tambahan yang tidak bertentangan dengan layout
          bawaan. Jangan mengandalkan utility yang konflik untuk mengganti width, max-height,
          overflow, atau flex behavior. Pilih <code>size=&quot;s&quot;</code> atau{' '}
          <code>size=&quot;m&quot;</code> untuk mengatur lebar Modal.
        </p>

        <h3 className="mt-10 text-sm font-black text-gray-900">Close behavior</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal dapat ditutup melalui tombol tutup, klik pada backdrop, atau tombol Escape. Callback
          <code> onClose</code> hanya meminta consumer memperbarui state <code>open</code>; Modal tidak
          menyimpan state terbuka atau tertutup sendiri. Tombol tutup dapat dijangkau dan diaktifkan
          menggunakan keyboard.
        </p>

        <h3 className="mt-8 text-sm font-black text-gray-900">Accessibility</h3>
        <div className="mt-1 max-w-2xl space-y-3 text-body-sm text-gray-500">
          <p>
            Modal memakai elemen dialog native. Judul yang terlihat di ModalHeader memberi nama
            aksesibel secara otomatis. Jika tidak ada judul yang terlihat, berikan{' '}
            <code>aria-label</code> pada Modal. Modal tidak otomatis memakai seluruh ModalBody sebagai{' '}
            <code>aria-describedby</code>. Tombol tutup dapat dijangkau dengan keyboard; tombol
            Escape dan klik backdrop meminta penutupan melalui <code>onClose</code>.
          </p>
          <p>
            Dialog native menangani perilaku fokus awal. Untuk tindakan destruktif, jangan arahkan
            fokus awal ke action yang merusak data. Jika kontrol yang digunakan mendukung penentuan
            fokus awal, prioritaskan action yang lebih aman seperti tombol Batal.
          </p>
          <p>
            Gunakan satu ModalHeader per Modal dan berikan isi judul langsung sebagai children.
            Jangan membungkus judul dengan <code>&lt;h2&gt;</code> atau <code>&lt;h3&gt;</code> karena
            ModalHeader sudah menyediakan heading semantics.
          </p>
        </div>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Prop publik Modal dan setiap bagian compound yang tersedia untuk consumer.</Lead>

        <h3 className="mb-3 text-sm font-black text-gray-900">Modal</h3>
        <PropsTable rows={modalProps} minWidth="52rem" />

        <h3 className="mt-8 mb-3 text-sm font-black text-gray-900">ModalHeader</h3>
        <PropsTable rows={headerProps} minWidth="46rem" />

        <h3 className="mt-8 mb-3 text-sm font-black text-gray-900">ModalBody</h3>
        <PropsTable rows={sectionProps} minWidth="46rem" />

        <h3 className="mt-8 mb-3 text-sm font-black text-gray-900">ModalFooter</h3>
        <PropsTable rows={sectionProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  )
}
