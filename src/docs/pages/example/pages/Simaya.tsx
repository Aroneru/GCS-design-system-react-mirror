import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  FloatingLabel,
  Icon,
  InputField,
  Radio,
  Select,
  TextArea,
  Toast,
  Toggle,
} from '../../../../lib'
import { FileLines, InfoCircle, User } from '../../../../lib/icons/outline'

/**
 * Contoh aplikasi Simaya.
 *
 * Simaya bukan tema terpisah, melainkan nilai prop `application` yang diterima
 * tujuh komponen form: InputField, FloatingLabel, Select, TextArea, Radio,
 * Checkbox, dan Toggle. Yang berubah hanya warna aksen — garis saat difokus,
 * cincin radio, kotak centang, jalur sakelar, dan tombol kirim editor — dari
 * primary ke ungu. Struktur, ukuran, dan jaraknya identik.
 *
 * Komponen non-form tidak punya prop itu. Untuk menyelaraskannya, Button
 * memakai `theme="purple"` dan Badge memakai kelas token yang sama.
 */

const KLASIFIKASI = [
  { value: 'biasa', label: 'Biasa' },
  { value: 'terbatas', label: 'Terbatas' },
  { value: 'rahasia', label: 'Rahasia' },
]

export function Simaya() {
  const [perihal, setPerihal] = useState('')
  const [tujuan, setTujuan] = useState('')
  const [klasifikasi, setKlasifikasi] = useState('biasa')
  const [sifat, setSifat] = useState('biasa')
  const [isi, setIsi] = useState('')
  const [ttd, setTtd] = useState(true)
  const [tembusan, setTembusan] = useState(false)
  const [terkirim, setTerkirim] = useState(false)

  return (
    <div className="space-y-8">
      <Alert variant="purple" heading="Mode Simaya aktif" dismissible={false}>
        Seluruh kontrol di halaman ini memakai <code className="font-mono text-xs">application="simaya"</code>.
        Bandingkan dengan halaman Pengaturan yang memakai nilai bawaan — strukturnya sama persis,
        hanya warna aksennya yang berbeda.
      </Alert>

      <section className="ds-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-3 font-black text-gray-900">Naskah dinas baru</h2>
            <p className="mt-1 text-body-sm text-gray-500">
              Formulir persuratan internal dengan aksen ungu khas Simaya.
            </p>
          </div>
          <Badge variant="gray" className="bg-purple-100 text-purple-700">
            Simaya
          </Badge>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <InputField
            application="simaya"
            label="Perihal"
            placeholder="Ringkasan isi naskah…"
            icon={<FileLines className="size-4" />}
            value={perihal}
            onChange={(e) => setPerihal(e.target.value)}
          />
          <FloatingLabel
            application="simaya"
            label="Unit tujuan"
            icon={<User className="size-4" />}
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
          />
          <Select
            application="simaya"
            label="Klasifikasi"
            options={KLASIFIKASI}
            value={klasifikasi}
            onChange={(e) => setKlasifikasi(e.target.value)}
          />
          <InputField
            application="simaya"
            label="Nomor agenda"
            placeholder="Otomatis bila dikosongkan"
            helperText="Diisi sistem saat naskah disetujui."
          />
        </div>

        <fieldset className="mt-6">
          <legend className="text-caption font-bold tracking-wide text-gray-500 uppercase">
            Sifat naskah
          </legend>
          <div className="mt-3 flex flex-wrap gap-6">
            <Radio
              application="simaya"
              name="sifat"
              label="Biasa"
              checked={sifat === 'biasa'}
              onChange={() => setSifat('biasa')}
            />
            <Radio
              application="simaya"
              name="sifat"
              label="Segera"
              checked={sifat === 'segera'}
              onChange={() => setSifat('segera')}
            />
            <Radio
              application="simaya"
              name="sifat"
              label="Sangat segera"
              checked={sifat === 'sangat'}
              onChange={() => setSifat('sangat')}
            />
          </div>
        </fieldset>

        <div className="mt-6">
          <TextArea
            application="simaya"
            type="editor"
            label="Isi naskah"
            hint={`${isi.length}/500`}
            placeholder="Tulis isi naskah dinas…"
            maxLength={500}
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            submitLabel="Kirim naskah"
            onSubmit={() => setTerkirim(true)}
          />
        </div>

        <div className="mt-6 space-y-4">
          <Toggle
            application="simaya"
            label="Bubuhkan tanda tangan elektronik"
            helperText="Memakai sertifikat elektronik yang terdaftar pada akun Anda."
            checked={ttd}
            onChange={(e) => setTtd(e.target.checked)}
          />
          <Checkbox
            application="simaya"
            label="Kirim tembusan ke unit terkait"
            helperText="Tembusan tidak memerlukan persetujuan tambahan."
            checked={tembusan}
            onChange={(e) => setTembusan(e.target.checked)}
          />
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button theme="purple" onClick={() => setTerkirim(true)}>
            Kirim naskah
          </Button>
          <Button variant="outline" theme="purple">
            Simpan konsep
          </Button>
        </div>
      </section>

      <section className="ds-card p-6 sm:p-8">
        <div className="flex gap-3">
          <Icon className="mt-0.5 shrink-0 text-purple-700">
            <InfoCircle />
          </Icon>
          <div>
            <h3 className="text-body font-black text-gray-900">Perbandingan berdampingan</h3>
            <p className="mt-1 text-body-sm text-gray-500">
              Kontrol yang sama, hanya berbeda nilai <code className="font-mono text-xs">application</code>.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl bg-surface-subtle p-5">
            <p className="text-caption font-bold tracking-wide text-gray-500 uppercase">default</p>
            <InputField label="Perihal" placeholder="Klik untuk melihat garis fokus" />
            <Toggle label="Tanda tangan elektronik" defaultChecked />
            <Checkbox label="Kirim tembusan" defaultChecked />
          </div>

          <div className="space-y-4 rounded-xl bg-surface-subtle p-5">
            <p className="text-caption font-bold tracking-wide text-purple-700 uppercase">simaya</p>
            <InputField
              application="simaya"
              label="Perihal"
              placeholder="Klik untuk melihat garis fokus"
            />
            <Toggle application="simaya" label="Tanda tangan elektronik" defaultChecked />
            <Checkbox application="simaya" label="Kirim tembusan" defaultChecked />
          </div>
        </div>
      </section>

      {terkirim && (
        <div className="fixed bottom-4 left-4 z-50">
          <Toast variant="purple" heading="Naskah terkirim" onDismiss={() => setTerkirim(false)}>
            Naskah diteruskan ke unit tujuan dan menunggu persetujuan pimpinan.
          </Toast>
        </div>
      )}
    </div>
  )
}
