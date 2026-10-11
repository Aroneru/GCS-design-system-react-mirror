import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Modal,
  Toast,
} from '../../../../lib'
import { Clock } from '../../../../lib/icons/outline'
import { asset } from '../../../asset'
import { LAYANAN } from '../data'

export function Layanan() {
  const [terkirim, setTerkirim] = useState(false)

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
                <Badge variant="brand" icon={<Clock />}>
                  {l.durasi}
                </Badge>
                <Modal
                  trigger={<Button size="xs">Ajukan</Button>}
                  title={l.judul}
                  footer={({ close }) => (
                    <>
                      <Button variant="outline" theme="gray" size="xs" onClick={close}>
                        Batal
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => {
                          setTerkirim(true)
                          close()
                        }}
                      >
                        Lanjutkan
                      </Button>
                    </>
                  )}
                >
                  <p>{l.deskripsi}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-surface-subtle p-4">
                    <div>
                      <dt className="text-caption font-bold tracking-wide text-gray-500 uppercase">
                        Estimasi
                      </dt>
                      <dd className="mt-1 text-body-sm font-bold text-gray-900">{l.durasi}</dd>
                    </div>
                    <div>
                      <dt className="text-caption font-bold tracking-wide text-gray-500 uppercase">
                        Biaya
                      </dt>
                      <dd className="mt-1 text-body-sm font-bold text-gray-900">{l.biaya}</dd>
                    </div>
                  </dl>
                </Modal>
              </div>
            }
          />
        ))}
      </div>

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
