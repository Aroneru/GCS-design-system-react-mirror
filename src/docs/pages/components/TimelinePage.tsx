import { Fragment, useState, type ReactNode } from 'react'
import { CheckCircle, Clock, ExclamationCircle } from 'flowbite-react-icons/solid'
import {
  Alert,
  Timeline,
  type TimelineItem,
  type TimelinePlatform,
  type TimelineSize,
  type TimelineStatus,
} from '../../../lib'
import { asset } from '../../asset'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../pageKit'
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

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
const sed = 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

/** Status seperti di desain: Badge success dengan ikon jam dan tombol tutup. */
const designStatus: TimelineStatus = { label: 'Badge', icon: <Clock />, dismissible: true }

/** Isi contoh dari desain: item pertama ringkas, sisanya lengkap. */
const designItems: TimelineItem[] = [
  { id: 1, name: 'User 01', role: 'Role / Department', time: '01 Jan 2026 · 09:00', description: lorem },
  ...[2, 3, 4].map((n) => ({
    id: n,
    name: `User 0${n}`,
    role: 'Role / Department',
    time: `01 Jan 2026 · 09:${String((n - 1) * 5).padStart(2, '0')}`,
    elapsed: '5 minutes',
    description: lorem,
    details: sed,
    attachments: [{ name: `sample-document-0${n}.pdf` }, { name: `sample-document-0${n - 1}.pdf` }],
    status: designStatus,
  })),
]

/** Tiga variant Badge untuk tiga tahap proses yang berbeda. */
const statusItems: TimelineItem[] = [
  {
    id: 'menunggu',
    name: 'User 01',
    role: 'Role / Department',
    time: '01 Jan 2026 · 09:00',
    status: { label: 'Menunggu', variant: 'warning', icon: <ExclamationCircle /> },
  },
  {
    id: 'disetujui',
    name: 'User 02',
    role: 'Role / Department',
    time: '01 Jan 2026 · 09:05',
    status: { label: 'Disetujui', icon: <CheckCircle /> },
  },
  {
    id: 'badge',
    name: 'User 03',
    role: 'Role / Department',
    time: '01 Jan 2026 · 09:10',
    status: designStatus,
  },
]

/** PDF dummy untuk lampiran yang bisa dibuka atau diunduh di halaman ini. */
const samplePdf = asset('/files/sample-document.pdf')

const lampiranItems: TimelineItem[] = [
  {
    id: 'lampiran',
    name: 'User 02',
    role: 'Role / Department',
    time: '01 Jan 2026 · 09:05',
    description: lorem,
    attachments: [
      { name: 'surat-permohonan.pdf' },
      { name: 'berita-acara.pdf', href: samplePdf, target: '_blank' },
      { name: 'lampiran-ktp.pdf', href: samplePdf, download: 'lampiran-ktp.pdf' },
    ],
  },
]

type AttachmentMode = 'teks' | 'tab-baru' | 'unduh'

/**
 * Lampiran contoh di Playground: tetap teks seperti desain, atau ditautkan ke
 * PDF dummy yang dibuka di tab baru atau diunduh dengan nama yang tampil.
 */
function linkAttachments(items: TimelineItem[], mode: AttachmentMode): TimelineItem[] {
  if (mode === 'teks') return items

  return items.map((item) => ({
    ...item,
    attachments: item.attachments?.map((file) =>
      mode === 'tab-baru'
        ? { ...file, href: samplePdf, target: '_blank' }
        : { ...file, href: samplePdf, download: String(file.name) },
    ),
  }))
}

const contohIndonesia: TimelineItem[] = [
  {
    id: 'pengajuan',
    name: 'Rina Wulandari',
    role: 'Pemohon',
    initials: 'RW',
    time: '12 Okt 2026 · 08:30',
    description: 'Mengajukan permohonan izin usaha mikro.',
  },
  {
    id: 'verifikasi',
    name: 'Budi Santoso',
    role: 'Verifikator / Dinas PMPTSP',
    avatar: asset('/images/avatar-sample.svg'),
    time: '12 Okt 2026 · 10:05',
    elapsed: '1 jam 35 menit',
    description: 'Memeriksa kelengkapan berkas permohonan.',
    details: 'Seluruh dokumen persyaratan lengkap dan sesuai.',
    attachments: [{ name: 'berita-acara-verifikasi.pdf' }],
    status: { label: 'Terverifikasi', icon: <CheckCircle /> },
  },
]

const labelIndonesia = { elapsed: 'Waktu proses:', details: 'Rincian', attachments: 'Lampiran' }

const platformOptions = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
]

const sizeOptions = [
  { value: 'large', label: 'Large' },
  { value: 'small', label: 'Small' },
]

/** Nilai teks di contoh kode, dikutip tunggal seperti kode di halaman lain. */
const q = (value: ReactNode) => `'${String(value)}'`

/** Ikon status di data Playground selalu Clock, jadi ditulis apa adanya. */
const statusCode = (status: TimelineStatus) =>
  `    status: { label: ${q(status.label)}${status.icon ? ', icon: <Clock />' : ''}${
    status.dismissible ? ', dismissible: true' : ''
  } },\n`

/**
 * Kode satu item persis seperti datanya, untuk blok Penggunaan. Ditulis sebagai
 * node biasa, bukan komponen, karena tombol Salin hanya menelusuri `children`.
 * `target` dan `download` disorot karena mengikuti kontrol Lampiran.
 */
function itemCode(item: TimelineItem) {
  const fields = (['name', 'role', 'time', 'elapsed', 'description', 'details'] as const).filter(
    (key) => item[key],
  )

  return (
    <Fragment key={item.id}>
      {'  {\n'}
      {fields.map((key) => `    ${key}: ${q(item[key])},\n`).join('')}
      {item.attachments && (
        <>
          {'    attachments: [\n'}
          {item.attachments.map((file, i) => (
            <Fragment key={i}>
              {`      { name: ${q(file.name)}`}
              {file.href && ", href: '/files/sample-document.pdf'"}
              {file.target && (
                <>
                  {', '}
                  <H>target</H>
                  {`: ${q(file.target)}`}
                </>
              )}
              {file.download && (
                <>
                  {', '}
                  <H>download</H>
                  {`: ${typeof file.download === 'string' ? q(file.download) : 'true'}`}
                </>
              )}
              {' },\n'}
            </Fragment>
          ))}
          {'    ],\n'}
        </>
      )}
      {item.status && statusCode(item.status)}
      {'  },\n'}
    </Fragment>
  )
}

const countOptions = [1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))

const attachmentOptions = [
  { value: 'teks', label: 'Teks' },
  { value: 'tab-baru', label: 'Tab baru' },
  { value: 'unduh', label: 'Unduh' },
]

/** Lebar artboard mobile di desain (440px dan 360px) dikurangi margin 16px. */
const stageWidth: Record<TimelinePlatform, Record<TimelineSize, string>> = {
  desktop: { large: 'max-w-full', small: 'max-w-full' },
  mobile: { large: 'max-w-102', small: 'max-w-82' },
}

const timelineProps: PropRow[] = [
  ['items', 'TimelineItem[]', '—', 'Kejadian berurutan dari atas ke bawah. Isi tiap item ada di tabel TimelineItem.'],
  [
    'platform',
    "'desktop' | 'mobile'",
    "'desktop'",
    'desktop menaruh garis di tengah dengan kartu berselang-seling kiri dan kanan. mobile menaruh garis di kiri dan semua kartu di kanannya.',
  ],
  [
    'size',
    "'large' | 'small'",
    "'large'",
    'large: teks 14px, avatar 44px, padding kartu 20px. small: teks 12px, avatar 36px, padding kartu 16px.',
  ],
  [
    'labels',
    'Partial<TimelineLabels>',
    "Elapsed time:, Details, Attachments",
    'Mengganti label elapsed, details, dan attachments di dalam kartu. Label yang tidak diisi tetap memakai bawaannya.',
  ],
  ['darkMode', 'boolean', 'false', 'Memaksa tema gelap. Tanpa prop ini Timeline ikut data-theme elemen pembungkusnya.'],
  [
    '…props',
    'HTMLAttributes<HTMLOListElement>',
    '—',
    'Atribut lain diteruskan ke elemen <ol> terluar; className disambung ke class bawaannya.',
  ],
]

const itemProps: PropRow[] = [
  ['name', 'ReactNode', '—', 'Wajib. Nama pelaku, ditulis paling atas dengan warna aksen.'],
  ['role', 'ReactNode', 'undefined', 'Jabatan atau unit kerja, di bawah nama.'],
  ['time', 'ReactNode', 'undefined', 'Waktu kejadian, mis. 01 Jan 2026 · 09:00.'],
  ['elapsed', 'ReactNode', 'undefined', 'Lama prosesnya, ditulis setelah label elapsed.'],
  ['description', 'ReactNode', 'undefined', 'Keterangan utama kejadiannya.'],
  ['details', 'ReactNode', 'undefined', 'Isi bagian Details, satu baris kosong di bawah keterangan utama.'],
  [
    'attachments',
    'TimelineAttachment[]',
    'undefined',
    'Daftar berkas bagian Attachments. Berkas yang punya href menjadi tautan.',
  ],
  ['status', 'TimelineStatus', 'undefined', 'Badge status di pojok kanan atas kartu. Isinya ada di tabel TimelineStatus.'],
  [
    'avatar',
    'string',
    'undefined',
    'Alamat foto pelaku, diteruskan ke Avatar. Bila kosong atau gagal dimuat, yang tampil initials, lalu siluet bawaan.',
  ],
  ['initials', 'ReactNode', 'undefined', 'Inisial di Avatar saat tidak ada foto.'],
  ['id', 'string | number', 'urutan item', 'Kunci unik item untuk React.'],
]

const statusProps: PropRow[] = [
  ['label', 'ReactNode', '—', 'Wajib. Teks Badge, mis. Disetujui.'],
  ['variant', 'BadgeVariant', "'success'", 'Warna Badge: gray, brand, danger, warning, atau success.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon di kiri label, mis. <Clock /> dari icons/solid.'],
  ['dismissible', 'boolean', 'false', 'Menampilkan tombol tutup (×) di kanan label.'],
  ['onDismiss', '() => void', 'undefined', 'Dipanggil saat tombol tutup diklik.'],
  ['darkMode', 'boolean', 'darkMode Timeline', 'Tampilan gelap Badge. Bawaannya mengikuti prop darkMode Timeline.'],
  [
    '…props',
    'BadgeProps',
    '—',
    'Prop Badge lainnya, mis. open, size, dan className, diteruskan apa adanya.',
  ],
]

const attachmentProps: PropRow[] = [
  ['name', 'ReactNode', '—', 'Wajib. Nama berkas yang tampil.'],
  ['href', 'string', 'undefined', 'Alamat berkasnya. Tanpa ini namanya tampil sebagai teks biasa.'],
  [
    'target',
    'HTMLAttributeAnchorTarget',
    'undefined',
    'Tempat tautan dibuka, mis. _blank untuk tab baru. Tab baru otomatis diberi rel="noreferrer".',
  ],
  [
    'download',
    'boolean | string',
    'undefined',
    'Mengunduh berkas alih-alih membukanya; teks menjadi nama berkas hasil unduhan. Browser hanya menurutinya untuk alamat di domain yang sama, blob:, dan data:.',
  ],
]

const toc: TocEntry[] = [
  { id: 'platform', label: 'Platform' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'isi-item', label: 'Isi item' },
  { id: 'status', label: 'Status' },
  { id: 'attachments', label: 'Attachments' },
  { id: 'label', label: 'Label' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function TimelinePage() {
  const [platform, setPlatform] = useState<TimelinePlatform>('desktop')
  const [size, setSize] = useState<TimelineSize>('large')
  const [theme, setTheme] = useState('light')
  const [count, setCount] = useState('4')
  const [lampiran, setLampiran] = useState<AttachmentMode>('tab-baru')

  const dark = theme === 'dark'
  const playgroundItems = linkAttachments(designItems.slice(0, Number(count)), lampiran)

  return (
    <UsulanPage
      eyebrow="Components · Timeline View"
      title="Timeline View"
      description="Riwayat kejadian berurutan: siapa, kapan, dan apa yang terjadi di tiap langkah, dengan avatar di sepanjang satu garis."
      toc={toc}
      actions={
        <div className="max-w-2xl">
          <Alert variant="info" heading="Desain belum final" dismissible={false}>
            Desain Timeline View masih bisa berubah, begitu pula nama prop, ukuran, dan warnanya.
            Pakai untuk uji coba dulu, dan hindari fitur produksi sampai komponen ini dinyatakan
            stabil.
          </Alert>
        </div>
      }
    >
      <FlowSection id="platform" title="Platform">
        <Lead>
          <Hl>desktop</Hl> menaruh garis di tengah dengan kartu berselang-seling kiri dan kanan,
          untuk halaman yang lebar. <Hl>mobile</Hl> menaruh garis di kiri dan semua kartu di
          kanannya, untuk layar atau kolom yang sempit. Susunannya tidak berganti sendiri mengikuti
          lebar layar, jadi pilih platform-nya dari halaman pemakai. Lancip kartu selalu menunjuk ke
          avatarnya.
        </Lead>

        <div className="space-y-5">
          <Demo label="desktop">
            <Timeline items={designItems.slice(0, 3)} />
          </Demo>
          <Demo label="mobile">
            <div className="max-w-102">
              <Timeline items={designItems.slice(0, 2)} platform="mobile" />
            </div>
          </Demo>
        </div>

        <SectionCode>
          {"import { Timeline } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<Timeline items={items} />\n\n<Timeline items={items} '}
          <H>platform=&quot;mobile&quot;</H>
          {' />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="sizes" title="Sizes">
        <Lead>
          <Hl>large</Hl> adalah ukuran bawaan: teks 14px, avatar 44px, padding kartu 20px, dan
          jarak antar-item 24px. <Hl>small</Hl> untuk tampilan yang padat: teks 12px, avatar 36px,
          padding 16px, dan jarak 18px.
        </Lead>

        <div className="grid gap-5 lg:grid-cols-2">
          <Demo label="large">
            <Timeline items={designItems.slice(0, 2)} platform="mobile" />
          </Demo>
          <Demo label="small">
            <Timeline items={designItems.slice(0, 2)} platform="mobile" size="small" />
          </Demo>
        </div>

        <SectionCode>
          {'<Timeline items={items} />\n\n<Timeline items={items} '}
          <H>size=&quot;small&quot;</H>
          {' />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="isi-item" title="Isi item">
        <Lead>
          Tiap item hanya wajib punya <Hl>name</Hl>; bagian lain tampil bila diisi. <Hl>role</Hl>{' '}
          ditulis di bawah nama, lalu <Hl>time</Hl>, <Hl>elapsed</Hl>, dan <Hl>description</Hl>{' '}
          sebagai keterangan utama. <Hl>details</Hl> dan <Hl>attachments</Hl> menyusul sebagai
          kelompok berikutnya, dan <Hl>status</Hl> menjadi Badge di pojok kanan atas kartu.
        </Lead>

        <Demo label="ringkas dan lengkap">
          <Timeline items={designItems.slice(0, 2)} />
        </Demo>

        <SectionCode>
          {"import { Clock } from '@ceplok-ui/design-kit-react/icons/solid'\n\n"}
          {'const items = [\n'}
          {'  {\n'}
          {'    '}
          <H>name</H>
          {": 'User 01',\n"}
          {"    role: 'Role / Department',\n"}
          {"    time: '01 Jan 2026 · 09:00',\n"}
          {`    description: '${lorem}',\n`}
          {'  },\n'}
          {'  {\n'}
          {'    '}
          <H>name</H>
          {": 'User 02',\n"}
          {"    role: 'Role / Department',\n"}
          {"    time: '01 Jan 2026 · 09:05',\n"}
          {'    '}
          <H>elapsed</H>
          {": '5 minutes',\n"}
          {`    description: '${lorem}',\n`}
          {'    '}
          <H>details</H>
          {`: '${sed}',\n`}
          {'    '}
          <H>attachments</H>
          {": [{ name: 'sample-document-02.pdf' }, { name: 'sample-document-01.pdf' }],\n"}
          {'    '}
          <H>status</H>
          {": { label: 'Badge', icon: <Clock />, dismissible: true },\n"}
          {'  },\n'}
          {']\n\n'}
          {'<Timeline items={items} />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="status" title="Status">
        <Lead>
          <Hl>status</Hl> dirender dengan komponen Badge, jadi semua prop Badge berlaku:{' '}
          <Hl>variant</Hl>, <Hl>icon</Hl>, <Hl>dismissible</Hl>, <Hl>onDismiss</Hl>, dan lainnya,
          dengan <Hl>label</Hl> sebagai isinya. Bawaannya mengikuti desain: variant{' '}
          <Hl>success</Hl> ukuran <Hl>sm</Hl>. Desainnya memakai ikon jam dan tombol tutup; pilih
          variant dan ikon lain untuk tahap yang berbeda.
        </Lead>

        <Demo label="warning, success, dan Badge seperti di desain">
          <div className="max-w-102">
            <Timeline items={statusItems} platform="mobile" />
          </div>
        </Demo>

        <SectionCode>
          {"import { CheckCircle, Clock, ExclamationCircle } from '@ceplok-ui/design-kit-react/icons/solid'\n\n"}
          {"status: { label: 'Menunggu', "}
          <H>variant</H>
          {": 'warning', icon: <ExclamationCircle /> }\n"}
          {"status: { label: 'Disetujui', "}
          <H>icon</H>
          {': <CheckCircle /> }\n'}
          {"status: { label: 'Badge', icon: <Clock />, "}
          <H>dismissible</H>
          {': true }'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="attachments" title="Attachments">
        <Lead>
          Tiap lampiran berisi <Hl>name</Hl> dan, bila berkasnya bisa dibuka, <Hl>href</Hl>. Tanpa{' '}
          <Hl>href</Hl> namanya tampil sebagai teks biasa seperti di desain. Dengan <Hl>href</Hl> ia
          menjadi tautan: <Hl>target=&quot;_blank&quot;</Hl> membukanya di tab baru, dan{' '}
          <Hl>download</Hl> mengunduhnya. Browser hanya menuruti <Hl>download</Hl> untuk alamat di
          domain yang sama, <Hl>blob:</Hl>, dan <Hl>data:</Hl>. Timeline tidak menyimpan berkasnya:
          alamatnya bisa dari server, atau dari <Hl>URL.createObjectURL()</Hl> untuk berkas yang baru
          dipilih pengguna.
        </Lead>

        <Demo label="teks biasa, tab baru, dan unduhan">
          <div className="max-w-102">
            <Timeline items={lampiranItems} platform="mobile" />
          </div>
        </Demo>

        <SectionCode>
          {'attachments: [\n'}
          {"  { name: 'surat-permohonan.pdf' },\n"}
          {"  { name: 'berita-acara.pdf', href: '/files/sample-document.pdf', "}
          <H>target</H>
          {": '_blank' },\n"}
          {"  { name: 'lampiran-ktp.pdf', href: '/files/sample-document.pdf', "}
          <H>download</H>
          {": 'lampiran-ktp.pdf' },\n"}
          {']\n\n'}
          {'// Berkas yang baru dipilih pengguna, mis. dari onFilesChange milik Upload.\n'}
          {'// Panggil URL.revokeObjectURL(href) saat berkasnya tidak ditampilkan lagi.\n'}
          {'attachments: files.map((file) => ({\n'}
          {'  name: file.name,\n'}
          {'  '}
          <H>href</H>
          {': URL.createObjectURL(file),\n'}
          {'  '}
          <H>download</H>
          {': file.name,\n'}
          {'}))'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="label" title="Label">
        <Lead>
          Label <Hl>Elapsed time:</Hl>, <Hl>Details</Hl>, dan <Hl>Attachments</Hl> mengikuti teks
          desain. Ganti lewat <Hl>labels</Hl>, mis. untuk aplikasi berbahasa Indonesia; label yang
          tidak diisi tetap memakai bawaannya. Contoh ini juga memakai <Hl>initials</Hl> dan foto{' '}
          <Hl>avatar</Hl>, yang diteruskan ke komponen Avatar.
        </Lead>

        <Demo label="labels bahasa Indonesia">
          <div className="max-w-102">
            <Timeline items={contohIndonesia} platform="mobile" labels={labelIndonesia} />
          </div>
        </Demo>

        <SectionCode>
          {'const items = [\n'}
          {"  { name: 'Rina Wulandari', role: 'Pemohon', "}
          <H>initials</H>
          {": 'RW', … },\n"}
          {"  { name: 'Budi Santoso', role: 'Verifikator / Dinas PMPTSP', "}
          <H>avatar</H>
          {": '/images/budi.jpg', … },\n"}
          {']\n\n'}
          {'<Timeline\n'}
          {'  items={items}\n'}
          {'  platform="mobile"\n'}
          {'  '}
          <H>labels</H>
          {"={{ elapsed: 'Waktu proses:', details: 'Rincian', attachments: 'Lampiran' }}\n"}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Garis, tepi kartu, dan latar avatar memakai token semantik <Hl>border</Hl>, serta nama dan
          jabatan memakai <Hl>brand</Hl>. Warna lainnya dari token komponen{' '}
          <Hl>--color-timeline-surface</Hl>, <Hl>-content</Hl>, dan <Hl>-avatar</Hl>. Aktifkan
          lewat prop <Hl>darkMode</Hl>, atau biarkan Timeline ikut{' '}
          <Hl>data-theme=&quot;dark&quot;</Hl> dari pembungkusnya. Kartu menjadi gray-800, garis
          dan tepinya gray-700, nama dan jabatan primary-400, serta teks isi dan siluet avatar
          gray-100. Badge status memakai tampilan gelapnya sendiri (green-900 dengan teks
          green-300) lewat <Hl>darkMode</Hl>. Badge belum berbasis token, jadi ia tidak ikut gelap
          lewat <Hl>data-theme</Hl> pembungkus; pakai prop <Hl>darkMode</Hl> bila kartunya memuat
          status.
        </Lead>

        <Demo label="darkMode" dark>
          <Timeline items={designItems.slice(0, 2)} darkMode />
        </Demo>

        <SectionCode>
          {'<Timeline '}
          <H>darkMode</H>
          {' items={items} />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Ubah platform, ukuran, mode, jumlah item, dan cara lampiran dibuka. Lampiran di item kedua
          sampai keempat menautkan PDF dummy. Kode di bagian Penggunaan ikut berubah.
        </Lead>

        <Stage maxWidth={stageWidth[platform][size]} dark={dark}>
          <Timeline
            items={playgroundItems}
            platform={platform}
            size={size}
            darkMode={dark}
          />
        </Stage>

        <Controls>
          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={(v) => setPlatform(v as TimelinePlatform)}
              options={platformOptions}
            />
          </Control>
          <Control label="Size">
            <Segmented
              label="Pilih ukuran"
              value={size}
              onChange={(v) => setSize(v as TimelineSize)}
              options={sizeOptions}
            />
          </Control>
          <Control label="Mode">
            <Segmented
              label="Pilih mode"
              value={theme}
              onChange={(v) => setTheme(String(v))}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </Control>
          <Control label="Jumlah item">
            <Segmented
              label="Pilih jumlah item"
              value={count}
              onChange={(v) => setCount(String(v))}
              options={countOptions}
            />
          </Control>
          <Control label="Lampiran">
            <Segmented
              label="Pilih cara lampiran dibuka"
              value={lampiran}
              onChange={(v) => setLampiran(v as AttachmentMode)}
              options={attachmentOptions}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground, termasuk isi lengkap tiap item yang tampil. Prop
          Timeline yang masih memakai nilai bawaan sengaja tidak ditulis.
        </Lead>

        <SectionCode flush>
          {"import { Timeline } from '@ceplok-ui/design-kit-react'\n"}
          {playgroundItems.some((item) => item.status) &&
            "import { Clock } from '@ceplok-ui/design-kit-react/icons/solid'\n"}
          {'\nconst items = [\n'}
          {playgroundItems.map(itemCode)}
          {']\n\n'}
          {'<Timeline\n'}
          {'  items={items}\n'}
          {platform !== 'desktop' && (
            <>
              {'  '}
              <H>platform</H>
              {`="${platform}"\n`}
            </>
          )}
          {size !== 'large' && (
            <>
              {'  '}
              <H>size</H>
              {`="${size}"\n`}
            </>
          )}
          {dark && (
            <>
              {'  '}
              <H>darkMode</H>
              {'\n'}
            </>
          )}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Seluruh prop Timeline, isi tiap item, status, dan bentuk berkas lampirannya.</Lead>

        <div className="space-y-8">
          <PropsTable rows={timelineProps} minWidth="46rem" />

          <div>
            <h3 className="mb-3 text-sm font-black text-gray-900">TimelineItem</h3>
            <PropsTable rows={itemProps} minWidth="46rem" />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-black text-gray-900">TimelineStatus</h3>
            <PropsTable rows={statusProps} minWidth="46rem" />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-black text-gray-900">TimelineAttachment</h3>
            <PropsTable rows={attachmentProps} minWidth="46rem" />
          </div>
        </div>
      </FlowSection>
    </UsulanPage>
  )
}
