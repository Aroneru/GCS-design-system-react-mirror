import { useState, type CSSProperties } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Icon,
  InputField,
  Popover,
  Select,
  Spinner,
  TextArea,
  Toggle,
} from '../../../../lib'
import { Check, Edit, Plus, Search, TrashBin } from '../../../../lib/icons/outline'
import { asset } from '../../../asset'

/**
 * Contoh modifikasi komponen.
 *
 * Menunjukkan tiga tingkat penyesuaian yang tersedia tanpa menyentuh kode
 * library: memilih varian yang sudah disediakan, menyusun ulang lewat slot
 * (`toolbar`, `actions`, `icon`), dan menimpa tampilan lewat `className`.
 *
 * Tiga bagian terakhir keluar dari tangga itu dan berdiri sendiri: mengatur
 * lebar lewat Container, menempelkan gerak dari luar, dan menimpa token warna
 * pada satu bagian halaman saja.
 *
 * Perlu dicatat soal `className`: `cn()` di library ini clsx murni, bukan
 * tailwind-merge. Kelas yang bertabrakan tidak saling menggantikan — keduanya
 * ikut terpasang dan urutan CSS yang menentukan. Jadi penimpaan yang aman
 * adalah menambah properti yang belum dipakai komponen (lebar, margin, radius
 * yang lebih besar), bukan menandingi properti yang sama.
 */

const TEMA = ['primary', 'green', 'gray', 'simaya', 'orange', 'yellow'] as const
const UKURAN = ['xs', 's', 'base', 'l', 'xl'] as const
const VARIAN_BADGE = ['gray', 'brand', 'success', 'warning', 'danger'] as const

/** Isi dropdown di bagian 5. Isinya tidak penting — yang diperagakan panahnya. */
const PILIHAN = [
  { value: 'ktp', label: 'Perekaman KTP' },
  { value: 'kk', label: 'Kartu Keluarga' },
  { value: 'akta', label: 'Akta Kelahiran' },
]

/**
 * Gerak untuk panah Select, ditempelkan lewat `className`.
 *
 * Panahnya digambar komponen sebagai `<svg>` di dalam `<span>` tepat setelah
 * `<select>`; itulah yang dijangkau `select~span_svg`. Menjangkau ke dalam
 * markup komponen seperti ini yang paling rapuh di halaman ini — begitu
 * susunannya berubah, gerakannya diam-diam berhenti tanpa ada yang gagal
 * dikompilasi.
 *
 * Ditulis terpisah, bukan berderet di JSX, supaya ketiga kelasnya terbaca
 * satu per satu. Tailwind memindai nama kelas secara harfiah, dan tiap kelas
 * di sini tetap utuh dalam satu string.
 */
const PANAH_BERANIMASI =
  '[&_select~span_svg]:transition-transform ' +
  '[&_select~span_svg]:duration-300 ' +
  '[&:has(select:focus)_select~span_svg]:rotate-180'

/**
 * Token `primary` versi hijau untuk bagian 6.
 *
 * Hanya tiga nilai yang benar-benar dipakai komponen di bawah yang ditimpa;
 * sisanya tetap mewarisi yang asli. Itu memang cukup — dan sekaligus jadi
 * peringatan: menimpa setengah tangga warna bisa memutus kontrasnya kalau
 * komponen lain ikut masuk ke dalam pembungkus yang sama.
 */
const HIJAU = {
  '--color-primary-50': '#f0fdf4',
  '--color-primary-700': '#15803d',
  '--color-primary-800': '#166534',
} as CSSProperties

/**
 * Isi toolbar editor buatan sendiri. Hurufnya sengaja diberi gaya sesuai
 * artinya — tebal, miring, coret — supaya bedanya dengan tujuh ikon bawaan
 * terbaca sekali lihat, bukan setelah dibandingkan.
 */
const ALAT = [
  { huruf: 'B', gaya: 'font-black', nama: 'Tebal' },
  { huruf: 'I', gaya: 'italic', nama: 'Miring' },
  { huruf: 'S', gaya: 'line-through', nama: 'Coret' },
]

/**
 * Empat komponen yang warnanya sama-sama datang dari token `primary`, dan
 * tak satu pun punya prop untuk menggantinya. Dirender dua kali di bagian 6
 * — sekali dengan token bawaan, sekali di dalam pembungkus yang menimpanya.
 */
function ContohToken() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <Button size="s">Simpan</Button>
      <Badge variant="brand">Aktif</Badge>
      <Toggle defaultChecked label="Notifikasi" />
      <Checkbox defaultChecked label="Setuju" />
    </div>
  )
}

function Blok({
  judul,
  catatan,
  children,
}: {
  judul: string
  catatan: string
  children: React.ReactNode
}) {
  return (
    <section className="ds-card p-6 sm:p-8">
      <h2 className="text-heading-4 font-black text-gray-900">{judul}</h2>
      <p className="mt-1 max-w-2xl text-body-sm text-gray-500">{catatan}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Modifikasi() {
  const [tema, setTema] = useState<(typeof TEMA)[number]>('primary')
  const [ukuran, setUkuran] = useState<(typeof UKURAN)[number]>('base')
  const [outline, setOutline] = useState(false)
  const [gelap, setGelap] = useState(false)
  const [catatan, setCatatan] = useState('')

  return (
    <div className="space-y-8">
      <Alert variant="info" heading="Enam contoh cara menyesuaikan" dismissible={false}>
        <p>
          Tiga yang pertama satu tangga: varian bawaan, slot, lalu{' '}
          <code className="font-mono text-xs">className</code> — dalam urutan itu, karena tiap
          anak tangga lebih rapuh dari yang di atasnya.
        </p>
        {/* Jaraknya ditulis sendiri: preflight Tailwind menihilkan margin <p>. */}
        <p className="mt-2">
          Tiga sisanya berdiri sendiri: lebar lewat Container, gerak dari luar, dan token warna
          yang ditimpa setempat. 
        </p>
        <p className="mt-2">
          Menyentuh kode library tetap pilihan terakhir — perubahannya hilang di pembaruan 
          paket berikutnya.
        </p>
      </Alert>

      {/* ── 1. Varian bawaan ── */}
      <Blok
        judul="1. Memilih varian yang sudah ada"
        catatan="Button punya 6 tema × 5 ukuran × 2 variant × 2 tone — 120 kombinasi tanpa satu baris CSS pun."
      >
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
          <div className="space-y-4 rounded-xl bg-surface-subtle p-5">
            <div>
              <p className="text-caption font-bold tracking-wide text-gray-500 uppercase">theme</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TEMA.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTema(t)}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                      tema === t ? 'bg-primary-700 text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-caption font-bold tracking-wide text-gray-500 uppercase">size</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {UKURAN.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUkuran(u)}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                      ukuran === u ? 'bg-primary-700 text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setOutline((v) => !v)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                  outline ? 'bg-primary-700 text-white' : 'bg-white text-gray-600'
                }`}
              >
                outline
              </button>
              <button
                type="button"
                onClick={() => setGelap((v) => !v)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                  gelap ? 'bg-primary-700 text-white' : 'bg-white text-gray-600'
                }`}
              >
                tone dark
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-subtle p-6">
              <Button
                theme={tema}
                size={ukuran}
                variant={outline ? 'outline' : 'filled'}
                tone={gelap ? 'dark' : 'light'}
                leftIcon={<Plus />}
              >
                Tambah data
              </Button>
              <Button
                type="iconOnly"
                theme={tema}
                size={ukuran}
                variant={outline ? 'outline' : 'filled'}
                tone={gelap ? 'dark' : 'light'}
                aria-label="Ubah data"
              >
                <Edit />
              </Button>
            </div>

            <div className="rounded-xl bg-surface-subtle p-6">
              <p className="text-caption font-bold tracking-wide text-gray-500 uppercase">
                Badge — lima variant semantik, tanpa kombinasi apa pun
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {VARIAN_BADGE.map((v) => (
                  <Badge key={v} variant={v}>
                    {v}
                  </Badge>
                ))}
              </div>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
              {`import { Button } from '@ceplok-ui/design-kit-react'
import { Plus } from '@ceplok-ui/design-kit-react/icons/outline'

<Button
  theme="${tema}"
  size="${ukuran}"${outline ? '\n  variant="outline"' : ''}${gelap ? '\n  tone="dark"' : ''}
  leftIcon={<Plus />}
>
  Tambah data
</Button>`}
            </pre>
          </div>
        </div>
      </Blok>

      {/* ── 2. Slot ── */}
      <Blok
        judul="2. Menyusun ulang lewat slot"
        catatan="Prop seperti toolbar, actions, dan icon menerima ReactNode apa pun, jadi isinya Anda tentukan sendiri tanpa mengubah komponennya."
      >
        {/*
          Dua editor yang sama persis kecuali satu prop. Yang kiri memakai
          toolbar bawaan — tujuh ikon abu-abu; yang kanan menggantinya
          seluruhnya. Perubahan sebesar ini tidak butuh satu baris pun di
          dalam TextArea.
        */}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextArea
            type="editor"
            label="toolbar bawaan"
            placeholder="Tulis catatan…"
          />
          <TextArea
            type="editor"
            label="toolbar diganti"
            placeholder="Tulis catatan…"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            toolbar={
              <>
                <div className="flex items-center gap-1">
                  {ALAT.map((a) => (
                    <button
                      key={a.huruf}
                      type="button"
                      title={a.nama}
                      aria-label={a.nama}
                      className={`grid size-7 place-items-center rounded-md bg-white text-xs text-gray-700 shadow-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${a.gaya}`}
                    >
                      {a.huruf}
                    </button>
                  ))}
                </div>
                <Badge variant="brand">Markdown</Badge>
                <span className="ml-auto font-mono text-xs text-gray-500">
                  {catatan.length}/280
                </span>
              </>
            }
          />
        </div>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
          {`import { Badge, TextArea } from '@ceplok-ui/design-kit-react'

// Tanpa toolbar: tujuh tombol bawaan yang tampil.
<TextArea type="editor" label="Catatan" />

// Dengan toolbar: isi bawaannya diganti seluruhnya. Komponennya tetap
// yang sama — tinggi bar, garis, radius, dan warna fokusnya tidak
// berubah — hanya isi barnya yang jadi milik Anda.
<TextArea
  type="editor"
  label="Catatan"
  toolbar={
    <>
      <button type="button" className="size-7 rounded-md bg-white font-black">B</button>
      <Badge variant="brand">Markdown</Badge>
      <span className="ml-auto font-mono text-xs text-gray-500">0/280</span>
    </>
  }
/>`}
        </pre>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Card
            image={asset('/images/card-sample.svg')}
            imageAlt=""
            title="Slot actions kosong"
            description="Tanpa actions, Card berhenti di deskripsi."
          />
          <Card
            image={asset('/images/card-sample.svg')}
            imageAlt=""
            title="Slot actions terisi"
            description="Baris aksi di bawah sepenuhnya markup Anda sendiri."
            actions={
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Aktif</Badge>
                  <Popover title="Slot bebas" side="top">
                    Isi actions tidak harus tombol — badge, teks, atau apa pun boleh.
                  </Popover>
                </div>
                <Button type="iconOnly" size="xs" theme="gray" variant="outline" aria-label="Hapus">
                  <TrashBin />
                </Button>
              </div>
            }
          />
        </div>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
          {`import { Badge, Button, Card } from '@ceplok-ui/design-kit-react'
import { TrashBin } from '@ceplok-ui/design-kit-react/icons/outline'

// Tanpa actions: Card berhenti di deskripsi.
<Card image="/images/card-sample.svg" title="Judul" description="Deskripsi singkat." />

// Dengan actions: baris di bawahnya sepenuhnya markup Anda sendiri.
<Card
  image="/images/card-sample.svg"
  title="Judul"
  description="Deskripsi singkat."
  actions={
    <div className="flex w-full items-center justify-between">
      <Badge variant="success">Aktif</Badge>
      <Button type="iconOnly" size="xs" theme="gray" variant="outline" aria-label="Hapus">
        <TrashBin />
      </Button>
    </div>
  }
/>`}
        </pre>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <InputField label="icon bawaan" placeholder="Tanpa icon" />
          <InputField
            label="icon diisi sendiri"
            placeholder="Cari sesuatu…"
            icon={<Search className="size-4" />}
          />
        </div>
      </Blok>

      {/* ── 3. className ── */}
      <Blok
        judul="3. Menimpa lewat className"
        catatan="Cara paling langsung, tapi paling rapuh — cn() di library ini clsx murni, bukan tailwind-merge, jadi kelas yang bertabrakan tidak saling menggantikan."
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-surface-subtle p-6">
            <p className="text-caption font-bold tracking-wide text-green-700 uppercase">
              Aman — menambah properti yang belum dipakai komponen
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button className="w-full sm:w-56">w-full · lebar</Button>
              <Badge variant="brand" className="tracking-widest uppercase">
                tracking · uppercase
              </Badge>
              <Spinner className="text-purple-600" aria-label="Memuat" />
            </div>
          </div>

          <div className="rounded-xl bg-surface-subtle p-6">
            <p className="text-caption font-bold tracking-wide text-red-700 uppercase">
              Rapuh — menandingi properti yang sudah dipakai
            </p>
            <p className="mt-2 text-body-sm text-gray-600">
              <code className="font-mono text-xs">theme="primary"</code> sudah menetapkan latar, jadi
              menambah <code className="font-mono text-xs">bg-red-600</code> membuat keduanya
              terpasang sekaligus — yang menang ditentukan urutan CSS, bukan urutan penulisan Anda.
              Untuk kasus begini, pilih tema yang sesuai atau tambahkan variant baru di library.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button className="bg-red-600 hover:bg-red-700">Hasilnya tak terjamin</Button>
              <Button theme="orange">Pakai theme yang ada</Button>
            </div>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
            {`import { Button } from '@ceplok-ui/design-kit-react'

// Aman — w-full belum dipakai Button, jadi tidak ada yang ditandingi.
<Button className="w-full sm:w-56">Lebar penuh di mobile</Button>

// Hindari — theme sudah menetapkan latar, jadi bg-red-600 tidak
// menggantikannya. Keduanya terpasang dan urutan CSS yang menentukan.
<Button theme="primary" className="bg-red-600">Hasilnya tak terjamin</Button>`}
          </pre>
        </div>
      </Blok>

      {/* ── 4. Container ── */}
      <Blok
        judul="4. Mengatur lebar lewat Container"
        catatan="Container punya empat ukuran; ganti size, seluruh isinya ikut menyesuaikan tanpa perhitungan lebar manual."
      >
        <div className="space-y-3">
          {(['prose', 'default', 'wide', 'full'] as const).map((s) => (
            <Container key={s} size={s} padded={false}>
              <div className="flex items-center justify-between rounded-lg border-2 border-dashed border-primary-300 bg-white px-4 py-3">
                <span className="font-mono text-xs font-bold text-primary-700">size="{s}"</span>
                <Icon className="size-4 text-primary-400">
                  <Check />
                </Icon>
              </div>
            </Container>
          ))}
        </div>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
          {`import { Container } from '@ceplok-ui/design-kit-react'

// Empat batas lebar; isinya tidak perlu tahu angkanya.
<Container size="prose">…</Container>   // 720px  — teks panjang & formulir
<Container>…</Container>                // 1126px — bawaan
<Container size="wide">…</Container>    // 1440px — tabel & dasbor
<Container size="full">…</Container>    // selebar induknya

// Jarak sisinya ikut melebar bersama layar (20px → 56px). Matikan bila
// induknya sudah punya jarak sendiri — seperti keempat contoh di atas.
<Container size="wide" padded={false}>
  <Tabel />
</Container>

// as mengganti tag yang dirender, jadi Container bisa langsung menjadi
// elemen semantiknya alih-alih menambah satu <div> pembungkus lagi.
<Container as="main" size="prose">
  <Artikel />
</Container>`}
        </pre>
      </Blok>

      {/* ── 5. Animasi ── */}
      <Blok
        judul="5. Menempelkan animasi"
        catatan="Komponen kit ini tidak membawa gerak apa pun. Transisi bisa ditempelkan dari luar lewat className, tanpa menyentuh kode di dalamnya."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="panah bawaan" placeholder="Pilih layanan" options={PILIHAN} />
          <Select
            label="panah beranimasi"
            placeholder="Pilih layanan"
            options={PILIHAN}
            className={PANAH_BERANIMASI}
          />
        </div>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
          {`import { Select } from '@ceplok-ui/design-kit-react'

// Panahnya <svg> di dalam <span> tepat setelah <select>.
const PANAH_BERANIMASI =
  '[&_select~span_svg]:transition-transform ' +
  '[&_select~span_svg]:duration-300 ' +
  '[&:has(select:focus)_select~span_svg]:rotate-180'

<Select label="Layanan" options={pilihan} className={PANAH_BERANIMASI} />`}
        </pre>

        <p className="mt-4 text-body-sm text-gray-500">
          Panahnya mengikuti <strong>fokus</strong>, bukan terbuka atau tertutupnya daftar:
          peramban tidak memberi tahu CSS kapan daftar bawaan sistem sedang terbentang. Jadi
          setelah Anda memilih, panahnya tetap menghadap ke atas selama field-nya masih
          difokus. Itu batas yang melekat pada <code className="font-mono text-xs">&lt;select&gt;</code>
          asli, dan menukarnya dengan dropdown buatan sendiri berarti kehilangan papan tombol
          serta pemilih bawaan ponsel — harga yang jauh lebih mahal daripada panah yang
          telat berbalik.
        </p>
      </Blok>

      {/* ── 6. Token ── */}
      <Blok
        judul="6. Menimpa token pada satu bagian saja"
        catatan="Setiap warna kit ini dibaca lewat CSS variable. Menimpanya di satu pembungkus mengganti semua komponen di dalamnya sekaligus — termasuk yang tidak punya prop warna."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl bg-surface-subtle p-6">
            <p className="text-caption font-bold tracking-wide text-gray-500 uppercase">Token bawaan</p>
            <div className="mt-4">
              <ContohToken />
            </div>
          </div>

          {/*
            Pembungkus yang sama persis, hanya diberi tiga nilai token. Tak satu
            pun komponen di dalamnya menerima prop warna.
          */}
          <div style={HIJAU} className="rounded-xl bg-surface-subtle p-6">
            <p className="text-caption font-bold tracking-wide text-gray-500 uppercase">--color-primary-* ditimpa</p>
            <div className="mt-4">
              <ContohToken />
            </div>
          </div>
        </div>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
          {`import { Badge, Button, Checkbox, Toggle } from '@ceplok-ui/design-kit-react'

// Semua warna kit dibaca lewat var(--color-*), jadi menimpanya di satu
// pembungkus mengubah seluruh isinya — tanpa satu prop pun berubah.
<div
  style={{
    '--color-primary-50': '#f0fdf4',
    '--color-primary-700': '#15803d',
    '--color-primary-800': '#166534',
  } as CSSProperties}
>
  <Button>Simpan</Button>
  <Badge variant="brand">Aktif</Badge>
  <Toggle defaultChecked label="Notifikasi" />
  <Checkbox defaultChecked label="Setuju" />
</div>`}
        </pre>

        <p className="mt-4 text-body-sm text-gray-500">
          Berbeda dengan <code className="font-mono text-xs">theme</code> di bagian 1, cara ini
          menjangkau komponen yang memang <em>tidak punya</em> prop warna — Toggle, Checkbox,
          dan Badge di atas tidak menerima satu pun prop di sini. Timpa tokennya di
          <code className="font-mono text-xs">:root</code> kalau seluruh aplikasi memang berganti
          warna; pakai pembungkus seperti ini kalau yang berganti hanya satu bagian halaman.
        </p>
      </Blok>
    </div>
  )
}
