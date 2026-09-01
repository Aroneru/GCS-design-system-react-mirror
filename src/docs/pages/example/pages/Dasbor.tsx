import { Alert, Badge, Button, Icon } from '../../../../lib'
import { CheckCircle, ChevronRight, FileLines, UsersGroup } from '../../../../lib/icons/outline'
import { PENGAJUAN, VARIAN_STATUS } from '../data'
import { BelumAda } from '../BelumAda'

const STATISTIK = [
  { label: 'Pengajuan masuk', nilai: '1.284', delta: '+12%', Ikon: FileLines },
  { label: 'Selesai bulan ini', nilai: '976', delta: '+8%', Ikon: CheckCircle },
  { label: 'Pemohon aktif', nilai: '342', delta: '+3%', Ikon: UsersGroup },
]

export function Dasbor() {
  return (
    <div className="space-y-8">
      <Alert variant="info" heading="Pemeliharaan terjadwal">
        Layanan legalisasi dokumen tidak tersedia pada Sabtu, 06.00–09.00 WIB. Pengajuan yang sudah
        masuk tetap diproses seperti biasa.
      </Alert>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STATISTIK.map(({ label, nilai, delta, Ikon }) => (
          <div key={label} className="ds-card p-6">
            <div className="flex items-start justify-between gap-4">
              <Icon className="text-primary-700">
                <Ikon />
              </Icon>
              <Badge variant="success">{delta}</Badge>
            </div>
            <p className="mt-5 text-heading-2 font-black text-gray-900">{nilai}</p>
            <p className="mt-1 text-body-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="ds-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h2 className="text-heading-4 font-black text-gray-900">Pengajuan terbaru</h2>
          <Button
            as="a"
            href="#/example/app/pengajuan"
            size="xs"
            variant="outline"
            theme="gray"
            rightIcon={<ChevronRight />}
          >
            Lihat semua
          </Button>
        </div>

        <BelumAda>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-body-sm">
              <thead className="bg-surface-subtle text-caption font-bold tracking-wide text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3">Nomor</th>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">Layanan</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PENGAJUAN.slice(0, 5).map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-surface-subtle">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{p.nama}</td>
                    <td className="px-5 py-3 text-gray-600">{p.layanan}</td>
                    <td className="px-5 py-3">
                      <Badge variant={VARIAN_STATUS[p.status]}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BelumAda>
      </section>
    </div>
  )
}
