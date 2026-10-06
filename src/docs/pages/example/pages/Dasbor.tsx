import { Alert, Badge, Button, Icon, Table } from '../../../../lib'
import type { TableColumn } from '../../../../lib'
import { CheckCircle, ChevronRight, FileLines, UsersGroup } from '../../../../lib/icons/outline'
import { PENGAJUAN, VARIAN_STATUS, type Pengajuan } from '../data'

const STATISTIK = [
  { label: 'Pengajuan masuk', nilai: '1.284', delta: '+12%', Ikon: FileLines },
  { label: 'Selesai bulan ini', nilai: '976', delta: '+8%', Ikon: CheckCircle },
  { label: 'Pemohon aktif', nilai: '342', delta: '+3%', Ikon: UsersGroup },
]

const KOLOM: TableColumn<Pengajuan>[] = [
  {
    key: 'id',
    header: 'Nomor',
    align: 'left',
    cell: (p) => <span className="font-mono text-xs">{p.id}</span>,
  },
  { key: 'nama', header: 'Pemohon', align: 'left', emphasis: true },
  { key: 'layanan', header: 'Layanan', align: 'left' },
  {
    key: 'status',
    header: 'Status',
    align: 'left',
    cell: (p) => <Badge variant={VARIAN_STATUS[p.status]}>{p.status}</Badge>,
  },
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

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-heading-4 font-black text-gray-900">Pengajuan terbaru</h2>
          <Button
            as="anchor"
            href="#/example/app/pengajuan"
            size="xs"
            variant="outline"
            theme="gray"
            rightIcon={<ChevronRight />}
          >
            Lihat semua
          </Button>
        </div>

        {/* Ringkasan saja: lima baris terbaru, tanpa toolbar dan pagination.
            Daftar lengkap dengan pencarian ada di halaman Pengajuan. */}
        <Table columns={KOLOM} data={PENGAJUAN.slice(0, 5)} rowKey="id" />
      </section>
    </div>
  )
}
