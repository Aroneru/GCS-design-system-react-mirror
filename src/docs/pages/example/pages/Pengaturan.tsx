import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  FloatingLabel,
  Icon,
  InputField,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Select,
  TextArea,
  Toast,
  Toggle,
} from '../../../../lib'
import { Envelope, ExclamationCircle, InfoCircle, User } from '../../../../lib/icons/outline'
import { JENIS_LAYANAN } from '../data'

export function Pengaturan() {
  const [nama, setNama] = useState('Yermi Rachman')
  const [surel, setSurel] = useState('yermi@contoh.id')
  const [telepon, setTelepon] = useState('')
  const [jenis, setJenis] = useState('perizinan')
  const [prioritas, setPrioritas] = useState('normal')
  const [keterangan, setKeterangan] = useState('')
  const [setuju, setSetuju] = useState(false)
  const [surelMasuk, setSurelMasuk] = useState(true)
  const [ringkasan, setRingkasan] = useState(false)

  const [konfirmasi, setKonfirmasi] = useState(false)
  const [tersimpan, setTersimpan] = useState(false)

  return (
    <div className="space-y-8">
      <Alert variant="warning" heading="Profil belum lengkap" dismissible={false}>
        Nomor telepon belum diisi. Petugas memakainya untuk mengonfirmasi jadwal layanan.
      </Alert>

      <section className="ds-card p-6 sm:p-8">
        <h2 className="text-heading-3 font-black text-gray-900">Profil pemohon</h2>
        <p className="mt-1 text-body-sm text-gray-500">
          Data ini otomatis mengisi setiap formulir pengajuan yang Anda buat.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <InputField
            label="Nama lengkap"
            placeholder="Sesuai dokumen identitas"
            icon={<User className="size-4" />}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <FloatingLabel
            label="Alamat surel"
            type="email"
            icon={<Envelope className="size-4" />}
            value={surel}
            onChange={(e) => setSurel(e.target.value)}
          />
          <InputField
            label="Nomor telepon"
            placeholder="08xx-xxxx-xxxx"
            helperText="Dipakai hanya untuk konfirmasi jadwal."
            state={telepon === '' ? 'failed' : 'default'}
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
          />
          <Select
            label="Layanan yang paling sering diajukan"
            options={JENIS_LAYANAN}
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          />
        </div>

        <fieldset className="mt-6">
          <legend className="text-caption font-bold tracking-wide text-gray-500 uppercase">
            Prioritas bawaan
          </legend>
          <div className="mt-3 flex flex-wrap gap-6">
            <Radio
              name="prioritas"
              label="Normal"
              helperText="Selesai 5 hari kerja"
              checked={prioritas === 'normal'}
              onChange={() => setPrioritas('normal')}
            />
            <Radio
              name="prioritas"
              label="Dipercepat"
              helperText="Selesai 2 hari kerja"
              checked={prioritas === 'cepat'}
              onChange={() => setPrioritas('cepat')}
            />
          </div>
        </fieldset>

        <div className="mt-6">
          <TextArea
            type="editor"
            label="Catatan tetap"
            hint={`${keterangan.length}/500`}
            placeholder="Keterangan yang selalu disertakan pada setiap pengajuan…"
            maxLength={500}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            submitLabel="Simpan catatan"
            onSubmit={() => setTersimpan(true)}
          />
        </div>
      </section>

      <section className="ds-card p-6 sm:p-8">
        <h2 className="text-heading-3 font-black text-gray-900">Pemberitahuan</h2>

        <div className="mt-6 space-y-4">
          <Toggle
            label="Surel setiap perubahan status"
            helperText="Dikirim segera setiap pengajuan berpindah status."
            checked={surelMasuk}
            onChange={(e) => setSurelMasuk(e.target.checked)}
          />
          <Toggle
            label="Ringkasan mingguan"
            helperText="Satu surel tiap Senin pagi berisi rekap pekan sebelumnya."
            checked={ringkasan}
            onChange={(e) => setRingkasan(e.target.checked)}
          />
          <Checkbox
            label="Saya menyatakan seluruh data di atas benar"
            helperText="Data yang tidak sesuai dapat membatalkan pengajuan."
            checked={setuju}
            onChange={(e) => setSetuju(e.target.checked)}
          />
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={() => setKonfirmasi(true)}>Simpan perubahan</Button>
          <Button variant="outline" theme="gray">
            Batalkan
          </Button>
        </div>
      </section>

      <Modal
        open={konfirmasi}
        onClose={() => setKonfirmasi(false)}
        aria-label="Konfirmasi penyimpanan pengaturan"
      >
        <ModalHeader>Simpan perubahan?</ModalHeader>
        <ModalBody>
          <div className="flex gap-3">
            <Icon className="mt-0.5 shrink-0 text-primary-700">
              <InfoCircle />
            </Icon>
            <p>
              Pengaturan ini akan dipakai pada seluruh pengajuan berikutnya. Pengajuan yang sedang
              berjalan tidak ikut berubah.
            </p>
          </div>

          {!setuju && (
            <div className="mt-4 flex gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800">
              <Icon className="mt-0.5 size-4 shrink-0">
                <ExclamationCircle />
              </Icon>
              <span className="text-xs">
                Pernyataan kebenaran data belum dicentang — ini hanya contoh, penyimpanan tetap
                diizinkan.
              </span>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" theme="gray" size="xs" onClick={() => setKonfirmasi(false)}>
            Batal
          </Button>
          <Button
            size="xs"
            onClick={() => {
              setKonfirmasi(false)
              setTersimpan(true)
            }}
          >
            Ya, simpan
          </Button>
        </ModalFooter>
      </Modal>

      {tersimpan && (
        <div className="fixed bottom-4 left-4 z-50">
          <Toast variant="success" heading="Perubahan tersimpan" onDismiss={() => setTersimpan(false)}>
            Pengaturan profil dan pemberitahuan Anda sudah diperbarui.
          </Toast>
        </div>
      )}
    </div>
  )
}
