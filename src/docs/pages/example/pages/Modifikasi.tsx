import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Icon,
  InputField,
  Popover,
  Spinner,
} from '../../../../lib'
import { Check, Edit, Plus, Search, TrashBin } from '../../../../lib/icons/outline'
import { asset } from '../../../asset'

/**
 * Contoh modifikasi komponen.
 *
 * Menunjukkan tiga tingkat penyesuaian yang tersedia tanpa menyentuh kode
 * library: memilih varian yang sudah disediakan, menyusun ulang lewat slot
 * (`actions`, `icon`), dan menimpa tampilan lewat `className`.
 *
 * Perlu dicatat soal `className`: `cn()` di library ini clsx murni, bukan
 * tailwind-merge. Kelas yang bertabrakan tidak saling menggantikan — keduanya
 * ikut terpasang dan urutan CSS yang menentukan. Jadi penimpaan yang aman
 * adalah menambah properti yang belum dipakai komponen (lebar, margin, radius
 * yang lebih besar), bukan menandingi properti yang sama.
 */

const TEMA = ['primary', 'green', 'gray', 'purple', 'orange', 'yellow'] as const
const UKURAN = ['xs', 's', 'base', 'l', 'xl'] as const
const VARIAN_BADGE = ['gray', 'brand', 'success', 'warning', 'danger'] as const

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

  return (
    <div className="space-y-8">
      <Alert variant="info" heading="Tiga cara menyesuaikan" dismissible={false}>
        Varian bawaan, slot, lalu <code className="font-mono text-xs">className</code> — dalam urutan
        itu. Menyentuh kode library sebaiknya jadi pilihan terakhir, karena perubahannya hilang di
        pembaruan paket berikutnya.
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

            <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 font-mono text-xs text-gray-100">
              {`<Button
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
        catatan="Prop seperti actions dan icon menerima ReactNode apa pun, jadi isinya Anda tentukan sendiri tanpa mengubah komponennya."
      >
        <div className="grid gap-5 sm:grid-cols-2">
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
      </Blok>

      {/* ── Ringkasan ── */}
      <Blok
        judul="Ketiganya dalam satu berkas"
        catatan="Urutan yang sama seperti di atas: varian dulu, slot bila perlu, className paling akhir dan sesedikit mungkin."
      >
        <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
          {`import { Button, Card, Badge } from '@stasi/design-kit-react'
import { Plus, TrashBin } from '@stasi/design-kit-react/icons/outline'

// 1. Varian bawaan — tidak ada CSS yang ditulis sama sekali.
<Button theme="purple" size="l" variant="outline" leftIcon={<Plus />}>
  Tambah data
</Button>

// 2. Slot — actions menerima ReactNode apa pun.
<Card
  image="/images/card-sample.svg"
  title="Judul Kartu"
  description="Deskripsi singkat."
  actions={
    <div className="flex w-full items-center justify-between">
      <Badge variant="success">Aktif</Badge>
      <Button type="iconOnly" size="xs" theme="gray" variant="outline" aria-label="Hapus">
        <TrashBin />
      </Button>
    </div>
  }
/>

// 3. className — hanya untuk properti yang belum dipakai komponen.
<Button className="w-full sm:w-56">Lebar penuh di mobile</Button>

// Hindari: theme sudah menetapkan latar, jadi bg-red-600 tidak
// menggantikannya — keduanya terpasang dan urutan CSS yang menentukan.
<Button theme="primary" className="bg-red-600">Hasilnya tak terjamin</Button>`}
        </pre>
      </Blok>
    </div>
  )
}
