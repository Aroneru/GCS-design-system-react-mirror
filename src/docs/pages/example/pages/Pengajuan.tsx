import { useEffect, useState } from 'react'
import { Badge, Button, InputField, Pagination, Select, Spinner } from '../../../../lib'
import { Download, Filter, Plus, Search } from '../../../../lib/icons/outline'
import { BARIS_PER_HALAMAN, PENGAJUAN, VARIAN_STATUS } from '../data'
import { BelumAda } from '../BelumAda'

const SARINGAN_STATUS = [
  { value: 'semua', label: 'Semua status' },
  { value: 'Menunggu', label: 'Menunggu' },
  { value: 'Diproses', label: 'Diproses' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Ditolak', label: 'Ditolak' },
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

  const totalHalaman = Math.max(1, Math.ceil(tersaring.length / BARIS_PER_HALAMAN))
  // Saringan bisa memangkas daftar sampai halaman aktif tidak ada lagi; nilai
  // yang dipakai dibatasi di sini supaya tabel tidak pernah tampil kosong.
  const halamanAman = Math.min(halaman, totalHalaman)
  const baris = tersaring.slice(
    (halamanAman - 1) * BARIS_PER_HALAMAN,
    halamanAman * BARIS_PER_HALAMAN,
  )

  const saring = (ubah: () => void) => {
    ubah()
    setHalaman(1)
    setMemuat(true)
  }

  return (
    <section className="ds-card overflow-hidden">
      <div className="border-b border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
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

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          {/*
            InputField di sini menyamar jadi Search Form, yang komponennya
            belum ada di kit (/form/search masih placeholder). Kabelnya
            sengaja dibiarkan utuh: begitu Search Form jadi dan pembungkus
            ini dilepas, pencariannya langsung hidup kembali.
          */}
          <BelumAda ringkas adaLabel>
            <InputField
              label="Cari"
              placeholder="Nomor atau nama pemohon…"
              icon={<Search className="size-4" />}
              value={cari}
              onChange={(e) => saring(() => setCari(e.target.value))}
            />
          </BelumAda>
          <Select
            label="Status"
            options={SARINGAN_STATUS}
            value={status}
            onChange={(e) => saring(() => setStatus(e.target.value))}
            className="sm:w-56"
          />
        </div>
      </div>

      <div className="relative">
        {memuat && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/70">
            <Spinner aria-label="Memuat data pengajuan" />
          </div>
        )}

        {baris.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-body-sm text-gray-500">
              Tidak ada pengajuan yang cocok dengan saringan ini.
            </p>
            <div className="mt-4 flex justify-center">
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
          </div>
        ) : (
          <BelumAda>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-body-sm">
                <thead className="bg-surface-subtle text-caption font-bold tracking-wide text-gray-500 uppercase">
                  <tr>
                    <th className="px-5 py-3">Nomor</th>
                    <th className="px-5 py-3">Pemohon</th>
                    <th className="px-5 py-3">Layanan</th>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {baris.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-surface-subtle">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                      <td className="px-5 py-3 font-bold text-gray-900">{p.nama}</td>
                      <td className="px-5 py-3 text-gray-600">{p.layanan}</td>
                      <td className="px-5 py-3 text-gray-600">{p.tanggal}</td>
                      <td className="px-5 py-3">
                        <Badge variant={VARIAN_STATUS[p.status]}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BelumAda>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-5">
        <p className="text-body-sm text-gray-500">
          {tersaring.length} pengajuan · halaman {halamanAman} dari {totalHalaman}
        </p>
        <Pagination
          currentPage={halamanAman}
          totalPages={totalHalaman}
          onPageChange={(ke) => {
            setHalaman(ke)
            setMemuat(true)
          }}
        />
      </div>
    </section>
  )
}
