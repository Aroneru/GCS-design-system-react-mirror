import { Fragment, useState, type ReactNode } from 'react'
import { Close } from 'flowbite-react-icons/outline'
import { ExclamationCircle } from '../../../lib/icons/solid'
import { Button, Icon, Modal, type ModalSize, type ModalVariant } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Hl, Mark, Segmented } from '../../pageKit'
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

type ModalExample = 'basic' | 'image' | 'long' | 'nested'
type ModalDismissal = {
  closeOnBackdrop: boolean
  closeOnEscape: boolean
  showCloseButton: boolean
}

// Consumer-owned Popup content follows the ambient theme; danger colors follow the reference.
const popupCancelClass = 'border-[light-dark(var(--color-gray-500),var(--color-gray-50))]! text-[light-dark(var(--color-gray-500),var(--color-gray-50))]! bg-transparent hover:bg-[light-dark(var(--color-gray-100),var(--color-surface-subtle))]! hover:text-[light-dark(var(--color-gray-700),var(--color-content))]!'
// Button has no danger theme. Explicit utility overrides are local to this action;
// darker red steps keep white text readable, including in the ambient Dark theme.
const popupDangerClass = 'bg-[light-dark(var(--color-orange-600),var(--color-red-700))]! text-white! font-sans font-semibold! leading-[1.5] enabled:hover:bg-red-800! enabled:active:bg-red-900! focus:ring-[light-dark(var(--color-red-700),var(--color-red-300))]! focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
const popupIconClass = 'size-12! shrink-0 text-feedback-error'

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
}: {
  theme: 'light' | 'dark'
  variant: ModalVariant
  example: ModalExample
  size: ModalSize
  dismissal: ModalDismissal
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
        {'\n<div '}<Mark>data-theme</Mark>{`="${theme}">\n<Modal\n  trigger={<Button>Buka Modal</Button>}`}
        {dismissalCode}
        {'\n  '}
        <H>variant</H>
        {'="popup"\n  '}
        <H>aria-label</H>
        {`="Konfirmasi hapus konten"\n  footer={({ close }) => (\n    <div className="flex w-full flex-wrap justify-center gap-4">\n      <Button variant="outline" theme="gray" size="xs" className="${popupCancelClass}" onClick={close}>\n        Tidak, Batalkan\n      </Button>\n      <Button size="xs" className="${popupDangerClass}" onClick={close}>\n        Ya, hapus konten ini\n      </Button>\n    </div>\n  )}\n>\n  <div className="text-center">\n    <div className="flex justify-center">\n      <Icon className="${popupIconClass}"><ExclamationCircle viewBox="2 2 20 20" /></Icon>\n    </div>\n    <p className="mx-auto mt-4 max-w-xs text-body font-medium text-content-subtle">\n      Apakah anda yakin ingin menghapus konten ini?\n    </p>\n  </div>\n</Modal>\n</div>`}
      </>
    )
  }

  return (
    <>
      {"import { Button, Modal } from '@ceplok-ui/design-kit-react'\n"}
      {'\n<div '}<Mark>data-theme</Mark>{`="${theme}">\n<Modal\n  trigger={<Button>Buka Modal</Button>}`}
      {dismissalCode}
      {size === 'm' && (
        <>
          {'\n  '}
          <H>size</H>
          {'="m"'}
        </>
      )}
      {'\n  '}<Mark>title</Mark>{`="${judul}"\n  footer={({ close }) => <Button size="xs" className="ml-auto" onClick={close}>${
        example === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'
      }</Button>}\n>\n`}
      {example === 'image' ? (
        <>
          {'  <'}
          <H>img</H>
          {'\n    src="/images/ceplok.svg"\n    alt="Ilustrasi motif Ceplok"\n    className="aspect-[600/437] w-full rounded-lg object-cover"\n  />'}
          {`\n  <div className="mt-5 space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </>
      ) : example === 'long' ? (
        `  <div className="space-y-5">\n${longContent.map((paragraph) => `    <p>${paragraph}</p>`).join('\n')}\n  </div>\n</Modal>`
      ) : (
        `  <div className="space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`
      )}
      {'\n</div>'}
    </>
  )
}

function renderNestedModalExampleCode({
  theme,
  size,
  dismissal,
}: {
  theme: 'light' | 'dark'
  size: ModalSize
  dismissal: ModalDismissal
}) {
  const dismissalCode = (keyPrefix: string) =>
    Object.entries(dismissal)
      .filter(([, enabled]) => !enabled)
      .map(([prop]) => (
        <Fragment key={`${keyPrefix}-${prop}`}>
          {'\n  '}
          <H>{prop}</H>
          {'={false}'}
        </Fragment>
      ))

  return (
    <>
      {"import { useState } from 'react'\n"}
      {"import { Button, Modal } from '@ceplok-ui/design-kit-react'\n\n"}
      {'export function NestedModalExample() {\n  const [defaultOpen, setDefaultOpen] = useState(false)\n  const [popupOpen, setPopupOpen] = useState(false)\n\n  return (\n    <div '}
      <Mark>data-theme</Mark>
      {`="${theme}">\n      <Button onClick={() => setDefaultOpen(true)}>Buka Modal Bertingkat</Button>\n\n      <Modal\n  `}
      <H>open</H>
      {'={defaultOpen}\n  '}
      <H>onOpenChange</H>
      {'={(nextOpen) => {\n    setDefaultOpen(nextOpen)\n    if (!nextOpen) setPopupOpen(false)\n  }}'}
      {dismissalCode('default')}
      {size === 'm' && (
        <>
          {'\n  '}
          <H>size</H>
          {'="m"'}
        </>
      )}
      {'\n  title="Kelola konten"\n  footer={({ close }) => <Button size="xs" className="ml-auto" onClick={close}>Selesai</Button>}\n>\n  <Button size="xs" onClick={() => setPopupOpen(true)}>Hapus konten</Button>\n</Modal>\n\n<Modal\n  '}
      <H>open</H>
      {'={popupOpen}\n  '}
      <H>onOpenChange</H>
      {'={setPopupOpen}'}
      {dismissalCode('popup')}
      {'\n  '}
      <H>variant</H>
      {'="popup"\n  '}
      <H>aria-label</H>
      {`="Konfirmasi hapus konten"\n  footer={({ close }) => (\n    <div className="flex w-full flex-wrap justify-center gap-4">\n      <Button variant="outline" theme="gray" size="xs" className="${popupCancelClass}" onClick={close}>\n        Tidak, Batalkan\n      </Button>\n      <Button size="xs" className="${popupDangerClass}" onClick={close}>\n        Ya, hapus konten ini\n      </Button>\n    </div>\n  )}\n>\n  <p>Apakah anda yakin ingin menghapus konten ini?</p>\n</Modal>\n    </div>\n  )\n}`}
    </>
  )
}

const modalProps: PropRow[] = [
  ['trigger', 'ReactElement', 'required*', 'Tombol milik consumer yang membuka Modal. Wajib pada mode internal; opsional ketika open diberikan.'],
  ['open', 'boolean', 'undefined', 'Visibilitas terkontrol. Jika diberikan, nilai ini menjadi sumber kebenaran dan trigger bersifat opsional.'],
  ['onOpenChange', '(open: boolean) => void', 'undefined', 'Dipanggil saat Modal minta dibuka atau ditutup (tombol tutup, Escape, backdrop, atau close di footer).'],
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

function ModalThemeFrame({ label, children }: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-gray-900">{label}</p>
      <div data-theme="dark" className="grid min-h-[440px] place-items-center overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-4">
        {children}
      </div>
    </div>
  )
}

function StaticModalCloseButton() {
  return (
    <button
      type="button"
      onClick={(event) => event.preventDefault()}
      aria-label="Tutup modal"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-surface-subtle hover:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Close className="size-4" aria-hidden="true" />
    </button>
  )
}

function StaticDefaultDarkModal() {
  return (
    <div className="flex w-full max-w-[416px] flex-col overflow-hidden rounded-lg border border-border-strong bg-surface text-left text-content shadow-xl">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-strong px-6 py-5">
        <h3 className="min-w-0 flex-1 font-alt text-lg leading-[1.5] font-semibold text-content">Terms of Service</h3>
        <div className="-my-2 -mr-2"><StaticModalCloseButton /></div>
      </div>
      <div className="min-h-0 flex-1 px-5 py-6 font-sans text-body font-medium text-content-muted">
        <p>{ceplokCopy[0]}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border-strong px-6 py-4">
        <Button size="xs" className="ml-auto">Saya Setuju</Button>
      </div>
    </div>
  )
}

function StaticPopupDarkModal() {
  return (
    <div className="flex w-full max-w-[416px] flex-col overflow-hidden rounded-lg border border-border-strong bg-gray-600 text-left text-content shadow-xl">
      <div className="relative h-7 shrink-0 px-5">
        <div className="absolute right-0.5 top-0.5"><StaticModalCloseButton /></div>
      </div>
      <div className="min-h-0 flex-1 px-5 pb-4 pt-5 font-sans text-body font-medium text-content-muted">
        <div className="text-center">
          <div className="flex justify-center">
            <Icon className={popupIconClass}>
              <ExclamationCircle viewBox="2 2 20 20" />
            </Icon>
          </div>
          <p className="mx-auto mt-4 max-w-xs text-body font-medium text-content-subtle">
            Apakah anda yakin ingin menghapus konten ini?
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-4 px-5 pb-5">
        <Button variant="outline" theme="gray" size="xs" className={popupCancelClass}>Tidak, Batalkan</Button>
        <Button size="xs" className={popupDangerClass}>Ya, hapus konten ini</Button>
      </div>
    </div>
  )
}

function ControlledModalExample({ theme }: { theme: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false)

  return (
    <div data-theme={theme} className="mt-4">
      <Button onClick={() => setOpen(true)}>Edit data</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Edit data"
        footer={({ close }) => (
          <Button size="xs" className="ml-auto" onClick={close}>
            Simpan
          </Button>
        )}
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

  return (
    <div data-theme={theme} className="mt-4">
      <Button onClick={() => setDefaultOpen(true)}>{triggerLabel}</Button>
      <Modal
        {...dismissal}
        open={defaultOpen}
        onOpenChange={(nextOpen) => {
          setDefaultOpen(nextOpen)
          if (!nextOpen) setPopupOpen(false)
        }}
        size={size}
        title="Kelola konten"
        footer={({ close }) => <Button size="xs" className="ml-auto" onClick={close}>Selesai</Button>}
      >
        <div className="space-y-4">
          <p>Buka konfirmasi untuk menghapus konten tanpa menutup Modal ini.</p>
          <Button size="xs" onClick={() => setPopupOpen(true)}>
            Hapus konten
          </Button>
        </div>
      </Modal>
      <Modal
        {...dismissal}
        open={popupOpen}
        onOpenChange={setPopupOpen}
        variant="popup"
        aria-label="Konfirmasi hapus konten"
        footer={({ close }) => (
          <div className="flex w-full flex-wrap justify-center gap-4">
            <Button variant="outline" theme="gray" size="xs" className={popupCancelClass} onClick={close}>
              Tidak, Batalkan
            </Button>
            <Button size="xs" className={popupDangerClass} onClick={close}>
              Ya, hapus konten ini
            </Button>
          </div>
        )}
      >
        <div className="text-center">
          <div className="flex justify-center">
            <Icon className={popupIconClass}>
              <ExclamationCircle viewBox="2 2 20 20" />
            </Icon>
          </div>
          <p className="mx-auto mt-4 max-w-xs text-body font-medium text-content-subtle">
            Apakah anda yakin ingin menghapus konten ini?
          </p>
        </div>
      </Modal>
    </div>
  )
}

export function ModalPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
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
              <div className="flex w-full flex-wrap justify-end gap-3">
                <Button variant="outline" theme="gray" size="xs" onClick={close}>
                  Batal
                </Button>
                <Button size="xs" onClick={close}>
                  Saya Setuju
                </Button>
              </div>
            )}
          >
            <p>{ceplokCopy[0]}</p>
          </Modal>
        </div>

        <SectionCode>
          {'<Modal\n  trigger={<Button>Buka Modal</Button>}\n  title="Terms of Service"\n  footer={({ close }) => (\n    <div className="flex w-full flex-wrap justify-end gap-3">\n      <Button variant="outline" theme="gray" size="xs" onClick={close}>Batal</Button>\n      <Button size="xs" onClick={close}>Saya Setuju</Button>\n    </div>\n  )}\n>\n  ...\n</Modal>'}
        </SectionCode>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          <Hl>title</Hl> pada Default menjadi judul visual sekaligus nama aksesibel. Untuk Popup
          atau Modal tanpa judul visual yang sesuai, berikan <Hl>aria-label</Hl> atau arahkan{' '}
          <Hl>aria-labelledby</Hl> ke elemen yang memuat namanya.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Title Default sudah dirender sebagai <Hl>&lt;h2&gt;</Hl>; jangan membungkus isinya
          dengan heading tambahan hanya untuk membuat judul. Modal tidak otomatis membuat{' '}
          <Hl>aria-describedby</Hl>; berikan atribut tersebut bila diperlukan.
        </p>
      </FlowSection>

      <FlowSection id="popup" title="Popup">
        <Lead>
          Gunakan Popup untuk konfirmasi atau keputusan ringkas. Susun icon dan pesan di dalam
          children, lalu tempatkan tombol aksi di footer tanpa divider.
        </Lead>

        <div data-theme="light" className="mt-4">
          <Modal
            trigger={<Button>Buka Popup</Button>}
            variant="popup"
            aria-label="Konfirmasi hapus konten"
            footer={({ close }) => (
              <div className="flex w-full flex-wrap justify-center gap-4">
                <Button variant="outline" theme="gray" size="xs" className={popupCancelClass} onClick={close}>
                  Tidak, Batalkan
                </Button>
                <Button size="xs" className={popupDangerClass} onClick={close}>
                  Ya, hapus konten ini
                </Button>
              </div>
            )}
          >
            <div className="text-center">
              <div className="flex justify-center">
                <Icon className={popupIconClass}>
                  <ExclamationCircle viewBox="2 2 20 20" />
                </Icon>
              </div>
              <p className="mx-auto mt-4 max-w-xs text-body font-medium text-content-subtle">
                Apakah anda yakin ingin menghapus konten ini?
              </p>
            </div>
          </Modal>
        </div>

        <SectionCode>
          {renderModalExampleCode({
            theme: 'light', variant: 'popup', example: 'basic', size: 's',
            dismissal: { closeOnBackdrop: true, closeOnEscape: true, showCloseButton: true },
          })}
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
                    <Button size="xs" className="ml-auto" onClick={close}>
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
          {`="m"\n  title="Terms of Service"\n  footer={({ close }) => (\n    <Button size="xs" className="ml-auto" onClick={close}>Ya, saya setuju</Button>\n  )}\n>\n  <div className="space-y-4">\n    <p>${ceplokCopy[0]}</p>\n    <p>${ceplokCopy[1]}</p>\n  </div>\n</Modal>`}
        </SectionCode>

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500">
          Size S digunakan secara bawaan. Gunakan <Hl>size=&quot;m&quot;</Hl> untuk lebar M.
        </p>
      </FlowSection>

      <FlowSection id="aksi-footer" title="Aksi Footer">
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal tidak mengatur proses bisnis seperti validasi atau submit. Gunakan{' '}
          <Hl>close()</Hl> dari render function <Hl>footer</Hl> ketika aksi memang perlu menutup
          Modal, misalnya setelah proses simpan berhasil.
        </p>
        <SectionCode>
          {'<Modal\n  trigger={<Button>Edit data</Button>}\n  title="Edit data"\n  '}
          <H>footer</H>
          {'={({ close }) => (\n    <>\n      <Button variant="outline" theme="gray" onClick={close}>\n        Batal\n      </Button>\n      <Button\n        onClick={async () => {\n          const success = await save()\n\n          if (success) {\n            close()\n          }\n        }}\n      >\n        Simpan\n      </Button>\n    </>\n  )}\n>\n  {/* Form milik consumer */}\n</Modal>'}
        </SectionCode>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Footer opsional: tanpa isi footer, container aksi dan divider footer tidak dirender.
          ReactNode cocok untuk konten statis; render function menyediakan <Hl>close()</Hl>.
          Tombol footer tidak otomatis menutup Modal. Default memakai divider, Popup tidak.
        </p>
      </FlowSection>

      <FlowSection id="state-modal" title="State Modal">
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Tanpa <Hl>open</Hl>, Modal mengelola visibilitas secara internal dan{' '}
          <Hl>trigger</Hl> wajib tersedia.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Gunakan <Hl>open</Hl> dan <Hl>onOpenChange</Hl> ketika visibilitas perlu mengikuti state
          aplikasi. Dalam mode terkontrol, <Hl>trigger</Hl> opsional dan nilai <Hl>open</Hl> tetap
          menjadi sumber kebenaran.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          <Hl>onOpenChange(false)</Hl> adalah permintaan penutupan, bukan callback native
          <Hl> onClose</Hl>; onClose dan onCancel tidak tersedia sebagai API consumer.
          Kontrol Cara Menutup di Playground bekerja independen: false pada closeOnBackdrop
          menonaktifkan klik latar, false pada closeOnEscape menahan Escape, dan false pada
          showCloseButton menghapus tombol X. Nilai bawaan ketiganya true dan dihilangkan
          dari generated snippet; pilihan false ditulis eksplisit. Fungsi footer close()
          tetap meminta penutupan pada semua kombinasi.
        </p>
        <SectionCode>
          {'<Modal\n  trigger={<Button>Buka Modal</Button>}\n  title="Konfirmasi"\n  '}
          <Mark>closeOnBackdrop</Mark>{'={false}\n  '}<Mark>closeOnEscape</Mark>{'={false}\n  '}
          <Mark>showCloseButton</Mark>{'={false}\n  footer={({ close }) => <Button onClick={close}>Saya Mengerti</Button>}\n>\n  <p>Baca informasi sebelum melanjutkan.</p>\n</Modal>'}
        </SectionCode>
        <ControlledModalExample theme={theme} />
        <SectionCode>
          {`import { useState } from 'react'\nimport { Button, Modal } from '@ceplok-ui/design-kit-react'\n\nexport function ControlledModalExample() {\n  const [open, setOpen] = useState(false)\n\n  return (\n    <div data-theme="${theme}">\n      <Button onClick={() => setOpen(true)}>Edit data</Button>\n\n      <Modal\n        open={open}\n        onOpenChange={setOpen}\n        title="Edit data"\n        footer={({ close }) => <Button size="xs" className="ml-auto" onClick={close}>Simpan</Button>}\n      >\n        {/* Form milik consumer */}\n      </Modal>\n    </div>\n  )\n}`}
        </SectionCode>
        <h3 className="mt-8 text-sm font-black text-gray-900">Modal bertingkat</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Gunakan state terkontrol terpisah untuk Modal pertama dan Popup konfirmasi. Popup yang
          dibuka terakhir berada di top layer; menutupnya tidak menutup Modal pertama dan fokus
          kembali ke tombol pembukanya.
        </p>
        <NestedModalExample theme={theme} />
        <SectionCode>
          {`const [defaultOpen, setDefaultOpen] = useState(false)\nconst [popupOpen, setPopupOpen] = useState(false)\n\n<Modal\n  open={defaultOpen}\n  onOpenChange={(nextOpen) => {\n    setDefaultOpen(nextOpen)\n    if (!nextOpen) setPopupOpen(false)\n  }}\n  title="Kelola konten"\n>\n  <Button size="xs" onClick={() => setPopupOpen(true)}>Hapus konten</Button>\n</Modal>\n\n<Modal\n  open={popupOpen}\n  onOpenChange={setPopupOpen}\n  variant="popup"\n  aria-label="Konfirmasi hapus konten"\n>\n  {/* Konten dan aksi Popup */}\n</Modal>`}
        </SectionCode>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Secara bawaan, backdrop, Escape, dan tombol X meminta penutupan. Atur masing-masing
          melalui <Hl>closeOnBackdrop</Hl>, <Hl>closeOnEscape</Hl>, dan <Hl>showCloseButton</Hl>.
          Jika ketiganya false, sediakan aksi eksplisit yang memanggil <Hl>close()</Hl>.
          Dalam mode terkontrol, consumer perlu memperbarui state melalui <Hl>onOpenChange</Hl>.
        </p>
        <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
          Elemen native <Hl>&lt;dialog&gt;</Hl> menyediakan perilaku dialog dan top layer;
          Modal menyerahkan perilaku fokus kepada browser tanpa focus trap kustom. Susun kontrol
          awal yang aman, misalnya Batal, dan jangan arahkan fokus awal ke aksi yang merusak data.
        </p>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark Mode">
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Modal mengikuti <Hl>data-theme=&quot;dark&quot;</Hl>. Default memakai surface gray-700,
          sedangkan Popup memakai gray-600 dengan teks gray-300 dan warna action sesuai desain.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ModalThemeFrame label="Default Dark">
            <StaticDefaultDarkModal />
          </ModalThemeFrame>
          <ModalThemeFrame label="Popup Dark">
            <StaticPopupDarkModal />
          </ModalThemeFrame>
        </div>
        <SectionCode>
          {renderModalExampleCode({
            theme: 'dark', variant: 'default', example: 'basic', size: 's',
            dismissal: { closeOnBackdrop: true, closeOnEscape: true, showCloseButton: true },
          })}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Variant menentukan struktur Modal. Default memakai ukuran S secara bawaan; ubah ke M bila
          diperlukan. Popup menggunakan struktur dan ukuran bawaannya sendiri.
        </Lead>

        <Stage maxWidth="max-w-[420px]" dark={theme === 'dark'}>
          <div data-theme={theme} className="flex min-h-40 items-center justify-center">
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
                {...dismissal}
                trigger={<Button>Buka Modal</Button>}
                variant="popup"
                aria-label="Konfirmasi hapus konten"
                footer={({ close }) => (
                  <div className="flex w-full flex-wrap justify-center gap-4">
                    <Button variant="outline" theme="gray" size="xs" className={popupCancelClass} onClick={close}>
                      Tidak, Batalkan
                    </Button>
                    <Button size="xs" className={popupDangerClass} onClick={close}>
                      Ya, hapus konten ini
                    </Button>
                  </div>
                )}
              >
                <div className="text-center">
                  <div className="flex justify-center">
                    <Icon className={popupIconClass}>
                      <ExclamationCircle viewBox="2 2 20 20" />
                    </Icon>
                  </div>
                  <p className="mx-auto mt-4 max-w-xs text-body font-medium text-content-subtle">
                    Apakah anda yakin ingin menghapus konten ini?
                  </p>
                </div>
              </Modal>
            ) : (
              <Modal
                key={playgroundKey}
                {...dismissal}
                trigger={<Button>Buka Modal</Button>}
                size={playgroundSize}
                title={playgroundExample === 'long' ? 'Ketentuan Layanan' : 'Terms of Service'}
                footer={({ close }) => (
                  <Button size="xs" className="ml-auto" onClick={close}>
                    {playgroundExample === 'long' ? 'Saya mengerti' : 'Ya, saya setuju'}
                  </Button>
                )}
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
          <Control label="Mode">
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

        <p className="mt-4 max-w-2xl text-body-sm text-gray-500">
          Variant menentukan struktur Modal. Contoh mengubah komposisi konten pada Default,
          sedangkan Size mengatur lebar maksimum Default Modal.
        </p>
        {isNested && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Nested Modal selalu memakai alur Default ke Popup. Variant dikunci pada Default; Size
            dan Cara Menutup diterapkan pada kedua dialog.
          </p>
        )}
        {isPopup && (
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Popup digunakan untuk konfirmasi ringkas. Gunakan <Hl>aria-label</Hl> atau{' '}
            <Hl>aria-labelledby</Hl> sebagai nama aksesibel, susun icon dan pesan di dalam children,
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
        <SectionCode flush>
          {isNested
            ? renderNestedModalExampleCode({ theme, size: playgroundSize, dismissal })
            : renderModalExampleCode({
                theme, variant: playgroundVariant, example: playgroundExample,
                size: playgroundSize, dismissal,
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
