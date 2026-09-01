import { useState } from 'react'
import { Badge, Button, Icon, Popover, Toggle } from '../../../../lib'
import { Envelope, User } from '../../../../lib/icons/outline'
import { PEMOHON } from '../data'

export function Pemohon() {
  // Status aktif dipegang di sini — Toggle-nya benar-benar mengubah data,
  // bukan sekadar bergerak.
  const [aktif, setAktif] = useState(() =>
    Object.fromEntries(PEMOHON.map((p) => [p.surel, p.aktif])),
  )

  const jumlahAktif = Object.values(aktif).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-heading-3 font-black text-gray-900">Pemohon terdaftar</h2>
          <p className="mt-1 text-body-sm text-gray-500">
            {jumlahAktif} dari {PEMOHON.length} akun sedang aktif.
          </p>
        </div>
        <Popover title="Akun nonaktif" side="left">
          Pemohon nonaktif tidak bisa mengirim pengajuan baru, tetapi pengajuan yang sudah berjalan
          tetap diproses sampai selesai.
        </Popover>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {PEMOHON.map((p) => (
          <div key={p.surel} className="ds-card flex flex-col p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700">
                <Icon>
                  <User />
                </Icon>
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-body font-black text-gray-900">{p.nama}</h3>
                  <Badge variant={aktif[p.surel] ? 'success' : 'gray'}>
                    {aktif[p.surel] ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-body-sm text-gray-500">{p.instansi}</p>
                <p className="mt-2 flex items-center gap-2 text-body-sm text-gray-600">
                  <Envelope className="size-4 shrink-0 text-gray-400" />
                  <span className="truncate">{p.surel}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
              <span className="text-body-sm text-gray-500">
                {p.jumlah} pengajuan
              </span>
              <Toggle
                label="Akun aktif"
                checked={aktif[p.surel]}
                onChange={(e) => setAktif((s) => ({ ...s, [p.surel]: e.target.checked }))}
              />
            </div>

            <div className="mt-4">
              <Button size="xs" variant="outline" theme="gray" className="w-full">
                Lihat riwayat
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
