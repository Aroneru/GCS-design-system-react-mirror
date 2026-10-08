import { useEffect, useState } from 'react'
import { Badge, Button, Select, Table } from '../../../../lib'
import type { TableColumn } from '../../../../lib'
import { Download, Eye, Filter, Plus } from '../../../../lib/icons/outline'
import {
  BARIS_PER_HALAMAN,
  PENGAJUAN,
  VARIAN_STATUS,
  type Pengajuan as DataPengajuan,
  type StatusPengajuan,
} from '../data'
import { StatusBadge } from '../StatusBadge'

const SARINGAN_STATUS = [
  { value: 'semua', label: 'Semua status' },
  { value: 'Menunggu', label: 'Menunggu' },
  { value: 'Diproses', label: 'Diproses' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Ditolak', label: 'Ditolak' },
]

const KOLOM: TableColumn<DataPengajuan>[] = [
  {
    key: 'id',
    header: 'Nomor',
    align: 'left',
    sortable: true,
    hideable: false,
    cell: (p) => <span className="font-mono text-xs">{p.id}</span>,
  },
  { key: 'nama', header: 'Pemohon', align: 'left', emphasis: true, sortable: true, hideable: false },
  { key: 'layanan', header: 'Layanan', align: 'left', sortable: true },
  {
    key: 'tanggal',
    header: 'Tanggal',
    align: 'left',
    sortable: true,
    // Tanggalnya teks seperti "02 Sep 2026" yang tidak bisa diurutkan apa
    // adanya. Nomor pengajuan naik sesuai urutan masuk, jadi itu yang dipakai.
    sortValue: (p) => p.id,
    sortDirections: ['desc', 'asc'],
  },
  {
    key: 'status',
    header: 'Status',
    align: 'left',
    cell: (p) => <StatusBadge status={p.status} />,
  },
  {
    key: 'aksi',
    header: 'Aksi',
    hideable: false,
    actions: [
      { key: 'lihat', icon: <Eye />, label: (p) => `Lihat ${p.id}` },
      {
        key: 'unduh',
        icon: <Download />,
        label: 'Unduh bukti',
        variant: 'outline',
        theme: 'gray',
        // Bukti hanya ada untuk pengajuan yang sudah selesai.
        disabled: (p) => p.status !== 'Selesai',
      },
    ],
  },
]

export function Pengajuan() {
  const [halaman, setHalaman] = useState(1)
  const [status, setStatus] = useState('semua')
  const [cari, setCari] = useState('')
  const [memuat, setMemuat] = useState(false)

  // Spinner dinyalakan di handler, bukan di dalam efek: setState sinkron di
  // badan efek memicu render berantai. Efek ini hanya mematikannya kembali.
  useEffect(() => {
    if (!memuat) return
    const timer = setTimeout(() => setMemuat(false), 500)
    return () => clearTimeout(timer)
  }, [memuat])

  const tersaring = PENGAJUAN.filter(
    (p) =>
      (status === 'semua' || p.status === status) &&
      (cari === '' ||
        p.nama.toLowerCase().includes(cari.toLowerCase()) ||
        p.id.toLowerCase().includes(cari.toLowerCase())),
  )

  const saring = (ubah: () => void) => {
    ubah()
    setHalaman(1)
    setMemuat(true)
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-heading-4 font-black text-gray-900">Semua pengajuan</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs" variant="outline" theme="gray" leftIcon={<Download />}>
            Unduh
          </Button>
          <Button size="xs" leftIcon={<Plus />}>
            Pengajuan baru
          </Button>
        </div>
      </div>

      {/*
        Pencarian, filter kolom, pengurutan, pagination, spinner, dan keadaan
        kosong semuanya dari Table. Halaman ini hanya menyaring data sesuai
        kata kunci dan status, lalu menyerahkan hasilnya ke Table.
      */}
      <Table
        columns={KOLOM}
        data={tersaring}
        rowKey="id"
        loading={memuat}
        search={{
          placeholder: 'Cari nomor atau nama pemohon',
          value: cari,
          onChange: (e) => saring(() => setCari(e.target.value)),
        }}
        filter={{}}
        actions={
          <>
            {/* Chip saringan aktif; tombol × mengembalikan ke "Semua status". */}
            {status !== 'semua' && (
              <Badge
                key={status}
                variant={VARIAN_STATUS[status as StatusPengajuan]}
                dismissible
                onDismiss={() => saring(() => setStatus('semua'))}
              >
                Status: {status}
              </Badge>
            )}
            <Select
              aria-label="Saring status"
              options={SARINGAN_STATUS}
              value={status}
              onChange={(e) => saring(() => setStatus(e.target.value))}
              className="w-44"
            />
          </>
        }
        pagination={{
          pageSize: BARIS_PER_HALAMAN,
          page: halaman,
          onPageChange: (ke) => {
            setHalaman(ke)
            setMemuat(true)
          },
        }}
        emptyText={
          <div className="space-y-4">
            <p>Tidak ada pengajuan yang cocok dengan saringan ini.</p>
            <Button
              size="xs"
              variant="outline"
              theme="gray"
              leftIcon={<Filter />}
              onClick={() =>
                saring(() => {
                  setStatus('semua')
                  setCari('')
                })
              }
            >
              Bersihkan saringan
            </Button>
          </div>
        }
      />
    </section>
  )
}
