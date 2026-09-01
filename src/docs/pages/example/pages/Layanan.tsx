import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toast,
} from '../../../../lib'
import { asset } from '../../../asset'
import { LAYANAN } from '../data'

export function Layanan() {
  const [dipilih, setDipilih] = useState<string | null>(null)
  const [terkirim, setTerkirim] = useState(false)

  const layanan = LAYANAN.find((l) => l.slug === dipilih)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-3 font-black text-gray-900">Layanan tersedia</h2>
        <p className="mt-1 text-body-sm text-gray-500">
          Tiga layanan yang paling sering diajukan bulan ini.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LAYANAN.map((l) => (
          <Card
            key={l.slug}
            image={asset('/images/card-sample.svg')}
            imageAlt=""
            title={l.judul}
            description={l.deskripsi}
            actions={
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <Badge variant="brand">{l.durasi}</Badge>
                <Button size="xs" onClick={() => setDipilih(l.slug)}>
                  Ajukan
                </Button>
              </div>
            }
          />
        ))}
      </div>

      <Modal
        open={dipilih !== null}
        onClose={() => setDipilih(null)}
        aria-label="Konfirmasi pengajuan layanan"
      >
        <ModalHeader>{layanan?.judul ?? 'Ajukan layanan'}</ModalHeader>
        <ModalBody>
          <p>{layanan?.deskripsi}</p>
          <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-surface-subtle p-4">
            <div>
              <dt className="text-caption font-bold tracking-wide text-gray-500 uppercase">
                Estimasi
              </dt>
              <dd className="mt-1 text-body-sm font-bold text-gray-900">{layanan?.durasi}</dd>
            </div>
            <div>
              <dt className="text-caption font-bold tracking-wide text-gray-500 uppercase">Biaya</dt>
              <dd className="mt-1 text-body-sm font-bold text-gray-900">{layanan?.biaya}</dd>
            </div>
          </dl>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" theme="gray" size="xs" onClick={() => setDipilih(null)}>
            Batal
          </Button>
          <Button
            size="xs"
            onClick={() => {
              setDipilih(null)
              setTerkirim(true)
            }}
          >
            Lanjutkan
          </Button>
        </ModalFooter>
      </Modal>

      {terkirim && (
        <div className="fixed bottom-4 left-4 z-50">
          <Toast variant="success" heading="Pengajuan dibuat" onDismiss={() => setTerkirim(false)}>
            Lengkapi datanya di halaman Pengaturan sebelum dikirim ke petugas.
          </Toast>
        </div>
      )}
    </div>
  )
}
