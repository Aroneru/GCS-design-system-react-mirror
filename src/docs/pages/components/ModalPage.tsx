import { Fragment, useState, type ReactNode } from 'react'
import { Button, Modal, type ModalSize, type ModalVariant } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Hl, Mark, Segmented } from '../../pageKit'
import { tocForDarkDocs, useDocsDark, usePlaygroundDark } from '../../docsTheme'
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

type ModalExample = 'basic' | 'image' | 'long' | 'nested'
type ModalDismissal = {
  closeOnBackdrop: boolean
  closeOnEscape: boolean
  showCloseButton: boolean
}

const examples: { value: ModalExample; label: string }[] = [
  { value: 'basic', label: 'Dasar' },
  { value: 'image', label: 'Dengan Gambar' },
  { value: 'long', label: 'Konten Panjang' },
  { value: 'nested', label: 'Nested Modal' },
]

const variants: { value: ModalVariant; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'popup', label: 'Popup' },
]

const defaultDismissal: ModalDismissal = {
  closeOnBackdrop: true,
  closeOnEscape: true,
  showCloseButton: true,
}

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

function renderModalExampleCode({
  variant,
  example,
  size,
  dismissal,
  theme,
  highlightDarkMode = false,
  highlightTitle = true,
  highlightPlayground = false,
}: {
  theme: 'light' | 'dark'
  variant: ModalVariant
  example: ModalExample
  size: ModalSize
  dismissal: ModalDismissal
  highlightDarkMode?: boolean
  highlightTitle?: boolean
  highlightPlayground?: boolean
}) {
  const Highlight = highlightPlayground ? Mark : H
  const dismissalCode = Object.entries(dismissal)
    .filter(([, enabled]) => !enabled)
    .map(([prop]) => (
      <Fragment key={prop}>
        {'\n  '}
        <Highlight>{prop}</Highlight>
        {'={false}'}
      </Fragment>
    ))
  const judul = example === 'long' ? 'Ketentuan Layanan' : 'Terms of Service'
  const buttonDarkModeProp = theme === 'dark' ? <> <Highlight>darkMode</Highlight></> : null
  const modalDarkModeProp =
    theme === 'dark' && (highlightDarkMode || highlightPlayground)
      ? <> <Highlight>darkMode</Highlight></>
      : theme === 'dark'
        ? ' darkMode'
        : null

  if (variant === 'popup') {
    return (
      <>
        {"import { Button, Modal } from '@ceplok-ui/design-kit-react'\n"}
        {'\n<Modal'}
        {modalDarkModeProp}
        {'\n  trigger={<Button'}
        {buttonDarkModeProp}
        {'>Buka Modal</Button>}'}
        {dismissalCode}
        {'\n  '}
        <Highlight>variant</Highlight>
        {'="popup"\n  '}
        <H>aria-label</H>
        {'="Konfirmasi hapus konten"\n  '}
        <Highlight>actions</Highlight>
        {`={{\n    secondary: { label: 'Tidak, Batalkan', onClick: ({ close }) => close() },\n    danger: { label: 'Ya, hapus konten ini', onClick: ({ close }) => close() },\n  }}\n>\n  <p className="mx-auto max-w-xs text-center text-body font-medium text-content-subtle">\n    Apakah anda yakin ingin menghapus konten ini?\n  </p>\n        </Modal>`}
      </>
    )
  }

  return (
    <>
      {"import { Button, Modal } from '@ceplok-ui/design-kit-react'\n"}
      {'\n<Modal'}
      {modalDarkModeProp}
      {'\n  trigger={<Button'}
      {buttonDarkModeProp}
      {'>Buka Modal</Button>}'}
      {dismissalCode}
      {highlightPlayground && (
        <>
          {'\n  '}
          <Highlight>variant</Highlight>
          {'="default"'}
        </>
      )}
      {(size === 'm' || highlightPlayground) && (
        <>
          {'\n  '}
          <Highlight>size</Highlight>
          {`="${size}"`}
        </>
      )}
      {'\n  '}{highlightTitle ? <Mark>title</Mark> : 'title'}{`="${judul}"\n  `}
      <Highlight>actions</Highlight>
      {`={{\n    primary: { label: '${example === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'}', onClick: ({ close }) => close() },\n  }}\n>\n`}
      {example === 'image' ? (
        <>
          {'  <'}
          <H>img</H>
          {'\n    '}
          <H>src</H>
          {'="/images/ceplok.svg"\n    '}
          <H>alt</H>
          {'="Ilustrasi motif Ceplok"\n    '}
          <H>className</H>
          {'="aspect-[600/437] w-full rounded-lg object-cover"\n  />\n  <div '}
          <H>className</H>
          {`="mt-5 space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </>
      ) : example === 'long' ? (
        <>
          {'  <div '}
          <H>className</H>
          {`="space-y-5">\n${longContent.map((paragraph) => `    <p>${paragraph}</p>`).join('\n')}\n  </div>\n</Modal>`}
        </>
      ) : (
        <>
          {'  <div '}
          <H>className</H>
          {`="space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </>
      )}
    </>
  )
}

function renderNestedModalExampleCode({
  theme,
  size,
  dismissal,
  highlightDarkMode = false,
  highlightPlayground = false,
}: {
  theme: 'light' | 'dark'
  size: ModalSize
  dismissal: ModalDismissal
  highlightDarkMode?: boolean
  highlightPlayground?: boolean
}) {
  const Highlight = highlightPlayground ? Mark : H
  const buttonDarkModeProp = theme === 'dark' ? <> <Highlight>darkMode</Highlight></> : null
  const modalDarkModeProp =
    theme === 'dark' && (highlightDarkMode || highlightPlayground)
      ? <> <Highlight>darkMode</Highlight></>
      : theme === 'dark'
        ? ' darkMode'
        : null
  const dismissalCode = (keyPrefix: string) =>
    Object.entries(dismissal)
      .filter(([, enabled]) => !enabled)
      .map(([prop]) => (
        <Fragment key={`${keyPrefix}-${prop}`}>
          {'\n  '}
          <Highlight>{prop}</Highlight>
          {'={false}'}
        </Fragment>
      ))

  return (
    <>
      {"import { useState } from 'react'\n"}
      {"import { Button, Modal } from '@ceplok-ui/design-kit-react'\n\n"}
      {'export function NestedModalExample() {\n  const [defaultOpen, setDefaultOpen] = useState(false)\n  const [popupOpen, setPopupOpen] = useState(false)\n\n  return (\n'}
      {'    <div>\n      <Button'}
      {buttonDarkModeProp}
      {' onClick={() => setDefaultOpen(true)}>Buka Modal Bertingkat</Button>\n\n      <Modal'}
      {modalDarkModeProp}
      {'\n  '}
      <Highlight>open</Highlight>
      {'={defaultOpen}\n  '}
      <Highlight>onOpenChange</Highlight>
      {'={(nextOpen) => {\n    setDefaultOpen(nextOpen)\n    if (!nextOpen) setPopupOpen(false)\n  }}'}
      {dismissalCode('default')}
      {'\n  '}
      <Highlight>size</Highlight>
      {`="${size}"\n  title="Kelola konten"\n  `}
      <Highlight>actions</Highlight>
      {'={{ primary: { label: "Selesai", onClick: ({ close }) => close() } }}\n>\n  <div className="space-y-4">\n    <p>Buka konfirmasi untuk menghapus konten tanpa menutup Modal ini.</p>\n    <Button size="xs" onClick={() => setPopupOpen(true)}>Hapus konten</Button>\n  </div>\n</Modal>\n\n<Modal'}
      {modalDarkModeProp}
      {'\n  '}
      <Highlight>open</Highlight>
      {'={popupOpen}\n  '}
      <Highlight>onOpenChange</Highlight>
      {'={setPopupOpen}'}
      {dismissalCode('popup')}
      {'\n  '}
      <Highlight>variant</Highlight>
      {'="popup"\n  '}
      <H>aria-label</H>
      {'="Konfirmasi hapus konten"\n  '}
      <Highlight>actions</Highlight>
      {`={{\n    secondary: { label: 'Tidak, Batalkan', onClick: ({ close }) => close() },\n    danger: { label: 'Ya, hapus konten ini', onClick: ({ close }) => close() },\n  }}\n>\n  <p>Apakah anda yakin ingin menghapus konten ini?</p>\n</Modal>\n    </div>\n  )\n}`}
    </>
  )
}

const modalProps: PropRow[] = [
  ['trigger', 'ReactElement', 'required*', 'Tombol milik consumer yang membuka Modal. Wajib pada mode internal; opsional ketika open diberikan.'],
  ['open', 'boolean', 'undefined', 'Visibilitas terkontrol. Jika diberikan, nilai ini menjadi sumber kebenaran dan trigger bersifat opsional.'],
  ['onOpenChange', '(open: boolean) => void', 'undefined', 'Dipanggil saat Modal minta dibuka atau ditutup (tombol tutup, Escape, backdrop, atau close di footer).'],
  ['variant', "'default' | 'popup'", "'default'", 'Menentukan struktur Modal. Popup digunakan untuk dialog konfirmasi ringkas.'],
  ['icon', 'ReactElement | null', 'tanda seru (Popup)', 'Ganti ikon bawaan Popup dengan ReactElement lain, atau gunakan null untuk menyembunyikannya. Hanya tersedia untuk Popup.'],
  ['size', "'s' | 'm'", "'s'", 'Ukuran Default Modal. Tidak tersedia untuk Popup.'],
  ['data-theme', "'light' | 'dark'", 'undefined', 'Boundary tema eksplisit pada dialog. Meng-override darkMode dan tema pembungkus, serta diteruskan sebagai tema efektif komponen internal.'],
  ['darkMode', 'boolean', 'undefined', 'Terapkan tema gelap lokal pada dialog dan diwariskan ke Button di dalamnya. data-theme eksplisit menjadi override; trigger milik consumer mengatur temanya sendiri.'],
  ['title', 'ReactNode', 'undefined', 'Judul Default Modal sekaligus nama aksesibel. Tidak tersedia untuk Popup.'],
  ['closeOnBackdrop', 'boolean', 'true', 'Tutup Modal saat klik backdrop. Tidak memengaruhi klik di dalam dialog.'],
  ['closeOnEscape', 'boolean', 'true', 'Tutup Modal saat menekan Escape. Jika false, cancel native dicegah.'],
  ['showCloseButton', 'boolean', 'true', 'Tampilkan tombol X. Jika false, tombol dihapus sepenuhnya.'],
  ['closeLabel', 'string', "'Tutup modal'", 'Nama aksesibel tombol tutup.'],
  ['actions', 'ModalActions', 'undefined', 'Aksi berperan secondary, primary, atau danger. Modal mengatur tampilan dan urutan; label, handler, dan proses ditentukan consumer.'],
  ['footer', 'ReactNode | ({ close }) => ReactNode', 'undefined', 'Override penuh untuk footer kustom. Tidak dapat digunakan bersamaan dengan actions; footer Popup tidak memakai divider.'],
  ['children', 'ReactNode', 'undefined', 'Isi Modal. Untuk Popup, susun pesan di sini; ikon diatur melalui prop icon.'],
  ['className', 'string', 'undefined', 'Class tambahan pada elemen <dialog>.'],
  [
    '…props',
    "Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel' | 'title'>",
    '—',
    'Atribut dialog native yang didukung diteruskan ke <dialog>. Lifecycle native onClose dan onCancel dimiliki Modal; open tersedia sebagai state terkontrol, bukan atribut native langsung. title diatur khusus untuk Default.',
  ],
]

const toc: TocEntry[] = [
  { id: 'modal', label: 'Modal' },
  { id: 'popup', label: 'Popup' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'aksi-footer', label: 'Aksi Footer' },
  { id: 'state-modal', label: 'State Modal' },
  { id: 'dark-mode', label: 'Dark Mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]
const tocDark = tocForDarkDocs(toc, true)

function ModalThemeFrame({ label, theme, children }: {
  label: string
  theme: 'light' | 'dark'
  children: ReactNode
}) {
  const isDark = theme === 'dark'
  return (
    <div>
      <p className="mb-2 text-sm font-black text-gray-900 dark:text-white">{label}</p>
      <div
        data-theme={theme}
        className={`grid min-h-[440px] place-items-center overflow-hidden rounded-2xl border p-4 ${
          isDark ? 'border-gray-800 bg-gray-900' : 'border-border bg-surface-subtle'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function ModalThemeExample({ variant, theme }: { variant: ModalVariant; theme: 'light' | 'dark' }) {
  const darkMode = theme === 'dark'

  return (
    variant === 'popup' ? (
      <Modal
        darkMode={darkMode}
        trigger={<Button darkMode={darkMode}>Buka Popup</Button>}
        variant="popup"
        aria-label="Konfirmasi hapus konten"
        actions={{
          secondary: { label: 'Tidak, Batalkan', onClick: ({ close }) => close() },
          danger: { label: 'Ya, hapus konten ini', onClick: ({ close }) => close() },
        }}
      >
        <p className="mx-auto max-w-xs text-center text-body font-medium text-content-subtle">
          Apakah anda yakin ingin menghapus konten ini?
        </p>
      </Modal>
    ) : (
      <Modal
        darkMode={darkMode}
        trigger={<Button darkMode={darkMode}>Buka Default</Button>}
        title="Terms of Service"
        actions={{ primary: { label: 'Saya Setuju', onClick: ({ close }) => close() } }}
      >
        <p>{ceplokCopy[0]}</p>
      </Modal>
    )
  )
}

function ControlledModalExample({ theme }: { theme: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false)
  const darkMode = theme === 'dark'

  return (
    <div className="mt-4">
      <Button darkMode={darkMode} onClick={() => setOpen(true)}>Edit data</Button>
      <Modal
        darkMode={darkMode}
        open={open}
        onOpenChange={setOpen}
        title="Edit data"
        actions={{ primary: { label: 'Simpan', onClick: ({ close }) => close() } }}
      >
        <p>Form dan proses penyimpanan tetap dimiliki consumer.</p>
      </Modal>
    </div>
  )
}

function NestedModalExample({
  theme,
  size = 's',
  dismissal = defaultDismissal,
  triggerLabel = 'Buka Modal Bertingkat',
}: {
  theme: 'light' | 'dark'
  size?: ModalSize
  dismissal?: ModalDismissal
  triggerLabel?: string
}) {
  const [defaultOpen, setDefaultOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const darkMode = theme === 'dark'

  return (
    <div className="mt-4">
      <Button darkMode={darkMode} onClick={() => setDefaultOpen(true)}>{triggerLabel}</Button>
      <Modal
        darkMode={darkMode}
        {...dismissal}
        open={defaultOpen}
        onOpenChange={(nextOpen) => {
          setDefaultOpen(nextOpen)
          if (!nextOpen) setPopupOpen(false)
        }}
        size={size}
        title="Kelola konten"
        actions={{ primary: { label: 'Selesai', onClick: ({ close }) => close() } }}
      >
        <div className="space-y-4">
          <p>Buka konfirmasi untuk menghapus konten tanpa menutup Modal ini.</p>
          <Button size="xs" onClick={() => setPopupOpen(true)}>
            Hapus konten
          </Button>
        </div>
      </Modal>
      <Modal
        darkMode={darkMode}
        {...dismissal}
        open={popupOpen}
        onOpenChange={setPopupOpen}
        variant="popup"
        aria-label="Konfirmasi hapus konten"
        actions={{
          secondary: { label: 'Tidak, Batalkan', onClick: ({ close }) => close() },
          danger: { label: 'Ya, hapus konten ini', onClick: ({ close }) => close() },
        }}
      >
        <p className="mx-auto max-w-xs text-center text-body font-medium text-content-subtle">
          Apakah anda yakin ingin menghapus konten ini?
        </p>
      </Modal>
    </div>
  )
}

export function ModalPage() {
  const docsDark = useDocsDark()
  const docsTheme = docsDark ? 'dark' : 'light'
  const docsDarkModeProp = docsDark ? ' darkMode' : ''
  const [playgroundDark, setPlaygroundDark] = usePlaygroundDark()
  const theme = playgroundDark ? 'dark' : 'light'
  const setTheme = (nextTheme: 'light' | 'dark') => setPlaygroundDark(nextTheme === 'dark')
  const [playgroundVariant, setPlaygroundVariant] = useState<ModalVariant>('default')
  const [playgroundExample, setPlaygroundExample] = useState<ModalExample>('basic')
  const [playgroundSize, setPlaygroundSize] = useState<ModalSize>('s')

  const [dismissal, setDismissal] = useState<ModalDismissal>(defaultDismissal)

  const isPopup = playgroundVariant === 'popup'
  const isNested = playgroundExample === 'nested'
  const playgroundKey = `${theme}-${playgroundVariant}-${playgroundExample}-${playgroundSize}-${dismissal.closeOnBackdrop}-${dismissal.closeOnEscape}-${dismissal.showCloseButton}`

  return (
    <UsulanPage
      eyebrow="Components"
      title="Modal"
      description="Dialog untuk informasi atau tindakan yang perlu diselesaikan sebelum kembali ke halaman utama. Gunakan Default untuk konten umum dan Popup untuk konfirmasi ringkas."
      toc={docsDark ? tocDark : toc}
    >
      <FlowSection id="modal" title="Modal">
        <Lead>
          Gunakan Default untuk informasi, form, atau konten umum. Variant dan ukuran S tidak perlu
          ditulis karena keduanya merupakan nilai bawaan.
        </Lead>

        <div className="mt-4">
          <Modal
            darkMode={docsDark}
            trigger={<Button darkMode={docsDark}>Buka Default</Button>}
            title="Terms of Service"
            actions={{
              secondary: { label: 'Batal', onClick: ({ close }) => close() },
              primary: { label: 'Saya Setuju', onClick: ({ close }) => close() },
            }}
          >
            <p>{ceplokCopy[0]}</p>
          </Modal>
        </div>

        <SectionCode>
          {`<Modal${docsDarkModeProp}\n  trigger={<Button${docsDarkModeProp}>Buka Modal</Button>}\n  `}
          <H>title</H>
          {`="Terms of Service"\n  actions={{\n    secondary: { label: 'Batal', onClick: ({ close }) => close() },\n    primary: { label: 'Saya Setuju', onClick: ({ close }) => close() },\n  }}\n>\n  ...\n</Modal>`}
        </SectionCode>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          <Hl>title</Hl> pada Default menjadi judul visual sekaligus nama aksesibel. Untuk Popup
          atau Modal tanpa judul visual yang sesuai, berikan <Hl>aria-label</Hl> atau arahkan{' '}
          <Hl>aria-labelledby</Hl> ke elemen yang memuat namanya.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Title Default sudah dirender sebagai <Hl>&lt;h2&gt;</Hl>; jangan membungkus isinya
          dengan heading tambahan hanya untuk membuat judul. Modal tidak otomatis membuat{' '}
          <Hl>aria-describedby</Hl>; berikan atribut tersebut bila diperlukan.
        </p>
      </FlowSection>

      <FlowSection id="popup" title="Popup">
        <Lead>
          Gunakan Popup untuk konfirmasi atau keputusan ringkas. Tanda seru tampil secara bawaan;
          ganti dengan prop <Hl>icon</Hl> atau hilangkan dengan <Hl>icon={'{null}'}</Hl>. Modal
          mengatur posisi dan jarak ikon; consumer dapat mengganti jenis ikon sekaligus menentukan
          ukuran dan warnanya. Susun pesan di dalam children dan gunakan <Hl>actions</Hl> untuk
          tombol standar. Footer Popup tidak memakai divider.
        </Lead>

        <div className="mt-4">
          <Modal
            darkMode={docsDark}
            trigger={<Button darkMode={docsDark}>Buka Popup</Button>}
            variant="popup"
            aria-label="Konfirmasi hapus konten"
            actions={{
              secondary: { label: 'Tidak, Batalkan', onClick: ({ close }) => close() },
              danger: { label: 'Ya, hapus konten ini', onClick: ({ close }) => close() },
            }}
          >
            <p className="mx-auto max-w-xs text-center text-body font-medium text-content-subtle">
              Apakah anda yakin ingin menghapus konten ini?
            </p>
          </Modal>
        </div>

        <SectionCode>
          {renderModalExampleCode({
            theme: docsTheme, variant: 'popup', example: 'basic', size: 's',
            dismissal: { closeOnBackdrop: true, closeOnEscape: true, showCloseButton: true },
          })}
        </SectionCode>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Contoh ini mengganti tanda seru dengan ikon <Hl>InfoCircle</Hl> dan mengatur ukuran serta
          warnanya. Gunakan <Hl>icon={'{null}'}</Hl> untuk menyembunyikan ikon bawaan.
        </p>
        <SectionCode>
          {`import { Icon, Modal } from '@ceplok-ui/design-kit-react'\nimport { InfoCircle } from '@ceplok-ui/design-kit-react/icons/outline'\n\n<Modal\n  variant="popup"\n  icon={<Icon className="size-8 text-primary-700"><InfoCircle /></Icon>}\n  aria-label="Informasi layanan"\n>\n  <p>Periksa kembali informasi layanan sebelum melanjutkan.</p>\n</Modal>\n\n<Modal variant="popup" icon={null} aria-label="Konfirmasi">\n  <p>Dialog ini tidak menampilkan ikon.</p>\n</Modal>`}
        </SectionCode>
      </FlowSection>

      <FlowSection id="sizes" title="Sizes">
        <Lead>
          Ukuran S dan M hanya berlaku pada Default Modal. Popup menggunakan ukuran bawaannya
          sendiri. Kedua ukuran Default tetap menyisakan jarak pada layar sempit.
        </Lead>

        <div className="grid gap-4 sm:grid-cols-2">
          {sizes.map((item) => (
            <article
              key={item.value}
              data-theme={docsDark ? 'dark' : undefined}
              className={`rounded-xl border p-5 ${
                docsDark ? 'border-gray-800 bg-gray-900 dark:border-gray-700' : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-content">Size {item.label}</h3>
                  <p className="mt-1 text-body-sm text-content-muted">{item.description}</p>
                </div>
                <span className="shrink-0 rounded-md bg-[light-dark(var(--color-primary-50),var(--color-primary-900))] px-2 py-1 text-xs font-bold text-[light-dark(var(--color-primary-700),var(--color-primary-200))]">
                  {item.value === 's' ? '416px' : '640px'} max
                </span>
              </div>
              <div className="mt-4">
                <Modal
                  darkMode={docsDark}
                  trigger={<Button darkMode={docsDark}>Buka Modal {item.label}</Button>}
                  size={item.value}
                  title="Terms of Service"
                  actions={{ primary: { label: 'Ya, saya setuju', onClick: ({ close }) => close() } }}
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
          {`<Modal${docsDarkModeProp}\n  trigger={<Button${docsDarkModeProp}>Buka Modal</Button>}\n  `}
          <H>size</H>
          {`="m"\n  title="Terms of Service"\n  actions={{ primary: { label: 'Ya, saya setuju', onClick: ({ close }) => close() } }}\n>\n  <div className="space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </SectionCode>

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Size S digunakan secara bawaan. Gunakan <Hl>size=&quot;m&quot;</Hl> untuk lebar M.
        </p>
      </FlowSection>

      <FlowSection id="aksi-footer" title="Aksi Footer">
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Gunakan <Hl>actions</Hl> untuk tombol standar yang konsisten pada Default dan Popup.
          Peran aksi menentukan makna dan tampilan tombol, bukan proses yang dijalankan:
        </p>
        <ul className="mt-2 max-w-2xl list-disc space-y-1 pl-5 text-body-sm text-gray-500 dark:text-gray-400">
          <li>
            <Hl>primary</Hl> untuk aksi utama yang menyelesaikan tujuan, misalnya Simpan atau Lanjutkan.
          </li>
          <li>
            <Hl>secondary</Hl> untuk aksi alternatif atau pendukung, sering kali Batal atau Kembali.
          </li>
          <li>
            <Hl>danger</Hl> untuk aksi destruktif atau sulit dibatalkan, misalnya Hapus; bukan sekadar
            aksen merah.
          </li>
        </ul>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Consumer menentukan label, handler, proses, dan responsnya. Peran hanya memberi tampilan
          serta urutan standar—<Hl>secondary</Hl>, <Hl>primary</Hl>, lalu <Hl>danger</Hl>. Modal
          meratakan aksi ke kanan pada Default dan ke tengah pada Popup. Aksi tidak menutup Modal
          otomatis; panggil <Hl>close()</Hl> setelah proses berhasil.
        </p>
        <SectionCode>
          {`<Modal${docsDarkModeProp}\n  trigger={<Button${docsDarkModeProp}>Edit data</Button>}\n  title="Edit data"\n  `}
          <H>actions</H>
          {'={{\n    secondary: { label: "Batal", onClick: ({ close }) => close() },\n    primary: {\n      label: "Simpan",\n      onClick: async ({ close }) => {\n        const success = await save()\n\n        if (success) close()\n      },\n    },\n  }}\n>\n  {/* Form milik consumer */}\n</Modal>'}
        </SectionCode>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Sesuaikan tombol per aksi lewat <Hl>buttonProps</Hl>, misalnya <Hl>size</Hl>,{' '}
          <Hl>variant</Hl>, <Hl>theme</Hl>, <Hl>tone</Hl>, <Hl>darkMode</Hl>, <Hl>disabled</Hl>,{' '}
          <Hl>type</Hl>, atau <Hl>className</Hl>. Efeknya bergantung pada peran aksi. Mengisi{' '}
          <Hl>buttonProps.theme</Hl> pada aksi <Hl>danger</Hl> mengganti preset destruktif Modal
          dengan theme Button yang dipilih. <Hl>className</Hl> ditambahkan ke preset dan tidak
          dijamin dapat mengganti warna destruktifnya.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Gunakan <Hl>footer</Hl> jika perlu mengganti seluruh area footer dengan layout atau konten
          kustom; render function menerima{' '}
          <Hl>close()</Hl>. Pilih salah satu: <Hl>actions</Hl> atau <Hl>footer</Hl>. Tanpa
          keduanya, area footer tidak dirender.
        </p>
        <SectionCode>
          {`<Modal${docsDarkModeProp}\n  title="Pilih jadwal"\n  `}
          <H>footer</H>
          {'={({ close }) => (\n    <div className="flex items-center justify-between">\n      <p>Perubahan belum disimpan</p>\n      <Button onClick={close}>Tutup</Button>\n    </div>\n  )}\n>\n  ...\n</Modal>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="state-modal" title="State Modal">
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Tanpa <Hl>open</Hl>, Modal mengelola visibilitas secara internal dan{' '}
          <Hl>trigger</Hl> wajib tersedia.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Gunakan <Hl>open</Hl> dan <Hl>onOpenChange</Hl> ketika visibilitas perlu mengikuti state
          aplikasi. Dalam mode terkontrol, <Hl>trigger</Hl> opsional dan nilai <Hl>open</Hl> tetap
          menjadi sumber kebenaran.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          <Hl>onOpenChange(false)</Hl> adalah permintaan penutupan, bukan callback native
          <Hl> onClose</Hl>; onClose dan onCancel tidak tersedia sebagai API consumer.
          Kontrol Cara Menutup di Playground bekerja independen: false pada closeOnBackdrop
          menonaktifkan klik latar, false pada closeOnEscape menahan Escape, dan false pada
          showCloseButton menghapus tombol X. Nilai bawaan ketiganya true dan dihilangkan
          dari generated snippet; pilihan false ditulis eksplisit. Fungsi footer close()
          tetap meminta penutupan pada semua kombinasi.
        </p>
        <h3 className="mt-8 text-sm font-black text-gray-900 dark:text-white">State internal</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Modal berikut menyimpan visibilitasnya sendiri karena tidak menerima <Hl>open</Hl>.
          Trigger membuka dialog, sedangkan aksi eksplisit menutupnya.
        </p>
        <div className="mt-4">
          <Modal
            darkMode={docsDark}
            trigger={<Button darkMode={docsDark}>Buka Modal</Button>}
            title="Konfirmasi"
            closeOnBackdrop={false}
            closeOnEscape={false}
            showCloseButton={false}
            actions={{ primary: { label: 'Saya Mengerti', onClick: ({ close }) => close() } }}
          >
            <p>Baca informasi sebelum melanjutkan.</p>
          </Modal>
        </div>
        <SectionCode>
          {`<Modal${docsDarkModeProp}\n  trigger={<Button${docsDarkModeProp}>Buka Modal</Button>}\n  title="Konfirmasi"\n  `}
          <Mark>closeOnBackdrop</Mark>{'={false}\n  '}<Mark>closeOnEscape</Mark>{'={false}\n  '}
          <Mark>showCloseButton</Mark>{'={false}\n  actions={{ primary: { label: "Saya Mengerti", onClick: ({ close }) => close() } }}\n>\n  <p>Baca informasi sebelum melanjutkan.</p>\n</Modal>'}
        </SectionCode>
        <h3 className="mt-8 text-sm font-black text-gray-900 dark:text-white">State terkontrol</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Pada contoh ini, consumer menjadi sumber kebenaran melalui <Hl>open</Hl> dan{' '}
          <Hl>onOpenChange</Hl>.
        </p>
        <ControlledModalExample theme={docsTheme} />
        <SectionCode>
          {`import { useState } from 'react'\nimport { Button, Modal } from '@ceplok-ui/design-kit-react'\n\nexport function ControlledModalExample() {\n  const [open, setOpen] = useState(false)\n\n  return (\n    <div>\n      <Button${docsDarkModeProp} onClick={() => setOpen(true)}>Edit data</Button>\n\n      <Modal${docsDarkModeProp}\n        `}
          <H>open</H>
          {'={open}\n        '}
          <H>onOpenChange</H>
          {`={setOpen}\n        title="Edit data"\n        actions={{ primary: { label: "Simpan", onClick: ({ close }) => close() } }}\n      >\n        {/* Form milik consumer */}\n      </Modal>\n    </div>\n  )\n}`}
        </SectionCode>
        <h3 className="mt-8 text-sm font-black text-gray-900 dark:text-white">Modal bertingkat</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Gunakan state terkontrol terpisah untuk Modal pertama dan Popup konfirmasi. Popup yang
          dibuka terakhir berada di top layer; menutupnya tidak menutup Modal pertama dan fokus
          kembali ke tombol pembukanya.
        </p>
        <NestedModalExample theme={docsTheme} />
        <SectionCode>
          {`const [defaultOpen, setDefaultOpen] = useState(false)\nconst [popupOpen, setPopupOpen] = useState(false)\n\n<Modal${docsDarkModeProp}\n  `}
          <H>open</H>
          {'={defaultOpen}\n  '}
          <H>onOpenChange</H>
          {`={(nextOpen) => {\n    setDefaultOpen(nextOpen)\n    if (!nextOpen) setPopupOpen(false)\n  }}\n  title="Kelola konten"\n>\n  <Button size="xs" onClick={() => setPopupOpen(true)}>Hapus konten</Button>\n</Modal>\n\n<Modal${docsDarkModeProp}\n  `}
          <H>open</H>
          {'={popupOpen}\n  '}
          <H>onOpenChange</H>
          {'={setPopupOpen}\n  '}
          <H>variant</H>
          {'="popup"\n  '}
          <H>aria-label</H>
          {`="Konfirmasi hapus konten"\n>\n  {/* Konten dan aksi Popup */}\n</Modal>`}
        </SectionCode>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Secara bawaan, backdrop, Escape, dan tombol X meminta penutupan. Atur masing-masing
          melalui <Hl>closeOnBackdrop</Hl>, <Hl>closeOnEscape</Hl>, dan <Hl>showCloseButton</Hl>.
          Jika ketiganya false, sediakan aksi eksplisit yang memanggil <Hl>close()</Hl>.
          Dalam mode terkontrol, consumer perlu memperbarui state melalui <Hl>onOpenChange</Hl>.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Elemen native <Hl>&lt;dialog&gt;</Hl> menyediakan perilaku dialog dan top layer;
          Modal menyerahkan perilaku fokus kepada browser tanpa focus trap kustom. Susun kontrol
          awal yang aman, misalnya Batal, dan jangan arahkan fokus awal ke aksi yang merusak data.
        </p>
      </FlowSection>

      <ModeSection
        name="Modal"
        stayDark
        lead={
          <>
            Gunakan <Hl>darkMode</Hl> untuk menerapkan token gelap pada dialog dan Button di
            dalamnya. Atribut <Hl>data-theme</Hl> eksplisit menjadi override dan memakai tema efektif
            yang sama untuk keduanya. Trigger milik consumer, misalnya Button, mengatur temanya sendiri. Default memakai surface gray-700,
            sedangkan Popup memakai gray-600 dengan teks gray-300 dan warna action sesuai desain.
          </>
        }
      >
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ModalThemeFrame
            label="Default Dark"
            theme="dark"
          >
            <ModalThemeExample variant="default" theme="dark" />
          </ModalThemeFrame>
          <ModalThemeFrame
            label="Popup Dark"
            theme="dark"
          >
            <ModalThemeExample variant="popup" theme="dark" />
          </ModalThemeFrame>
        </div>
        <SectionCode>
          {renderModalExampleCode({
            theme: 'dark',
            variant: 'default',
            example: 'basic',
            size: 's',
            dismissal: { closeOnBackdrop: true, closeOnEscape: true, showCloseButton: true },
            highlightDarkMode: true,
            highlightTitle: false,
          })}
        </SectionCode>
      </ModeSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Variant menentukan struktur Modal. Default memakai ukuran S secara bawaan; ubah ke M bila
          diperlukan. Popup menggunakan struktur dan ukuran bawaannya sendiri.
        </Lead>

        <Stage maxWidth="max-w-[420px]" dark={theme === 'dark'}>
          <div className="flex min-h-40 items-center justify-center">
            {isNested ? (
              <NestedModalExample
                key={playgroundKey}
                theme={theme}
                size={playgroundSize}
                dismissal={dismissal}
                triggerLabel="Buka Nested Modal"
              />
            ) : isPopup ? (
              <Modal
                key={playgroundKey}
                darkMode={theme === 'dark'}
                {...dismissal}
                trigger={<Button darkMode={theme === 'dark'}>Buka Modal</Button>}
                variant="popup"
                aria-label="Konfirmasi hapus konten"
                actions={{
                  secondary: { label: 'Tidak, Batalkan', onClick: ({ close }) => close() },
                  danger: { label: 'Ya, hapus konten ini', onClick: ({ close }) => close() },
                }}
              >
                <p className="mx-auto max-w-xs text-center text-body font-medium text-content-subtle">
                  Apakah anda yakin ingin menghapus konten ini?
                </p>
              </Modal>
            ) : (
              <Modal
                key={playgroundKey}
                darkMode={theme === 'dark'}
                {...dismissal}
                trigger={<Button darkMode={theme === 'dark'}>Buka Modal</Button>}
                size={playgroundSize}
                title={playgroundExample === 'long' ? 'Ketentuan Layanan' : 'Terms of Service'}
                actions={{
                  primary: {
                    label: playgroundExample === 'long' ? 'Saya mengerti' : 'Ya, saya setuju',
                    onClick: ({ close }) => close(),
                  },
                }}
              >
                {playgroundExample === 'image' ? (
                  <>
                    <img
                      src="/images/ceplok.svg"
                      alt="Ilustrasi motif Ceplok"
                      className="aspect-[600/437] w-full rounded-lg object-cover"
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
          <Control label="Tampilan">
            <Segmented
              label="Pilih mode warna Modal"
              value={theme}
              onChange={setTheme}
              options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
            />
          </Control>
          <Control label="Variant">
            <Segmented
              label="Pilih variant Modal"
              value={playgroundVariant}
              onChange={setPlaygroundVariant}
              options={variants}
              disabled={isNested}
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
              onChange={(nextExample) => {
                setPlaygroundExample(nextExample)
                if (nextExample === 'nested') setPlaygroundVariant('default')
              }}
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

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
          Variant menentukan struktur Modal. Contoh mengubah komposisi konten pada Default,
          sedangkan Size mengatur lebar maksimum Default Modal.
        </p>
        {isNested && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
            Nested Modal selalu memakai alur Default ke Popup. Variant dikunci pada Default; Size
            dan Cara Menutup diterapkan pada kedua dialog.
          </p>
        )}
        {isPopup && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
            Popup digunakan untuk konfirmasi ringkas. Gunakan <Hl>aria-label</Hl> atau{' '}
            <Hl>aria-labelledby</Hl> sebagai nama aksesibel, susun pesan di dalam children, atur ikon
            melalui prop <Hl>icon</Hl>, lalu tentukan tombol melalui <Hl>actions</Hl>. Contoh dan Size
            hanya tersedia untuk Default Modal.
          </p>
        )}
        {!isPopup && playgroundExample === 'image' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
            Gambar disusun sebagai bagian dari children; Modal tidak memiliki prop khusus untuk
            gambar.
          </p>
        )}
        {!isPopup && playgroundExample === 'long' && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500 dark:text-gray-400">
            Konten panjang menggunakan gulir body Modal secara otomatis tanpa prop khusus.
          </p>
        )}

      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <SectionCode flush>
          {isNested
            ? renderNestedModalExampleCode({
                theme,
                size: playgroundSize,
                dismissal,
                highlightDarkMode: theme === 'dark',
                highlightPlayground: true,
              })
            : renderModalExampleCode({
                theme, variant: playgroundVariant, example: playgroundExample,
                size: playgroundSize, dismissal,
                highlightDarkMode: theme === 'dark',
                highlightPlayground: true,
              })}
        </SectionCode>

      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <Hl>&lt;dialog&gt;</Hl> yang didukung diteruskan. Modal memiliki kontrak state sendiri melalui{' '}
          <Hl>open</Hl> dan <Hl>onOpenChange</Hl>; lifecycle native <Hl>onClose</Hl> dan{' '}
          <Hl>onCancel</Hl> tetap dimiliki komponen. Prop <Hl>title</Hl> diatur khusus untuk Default.
        </Lead>
        <PropsTable rows={modalProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
