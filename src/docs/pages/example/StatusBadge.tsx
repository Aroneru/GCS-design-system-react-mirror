import type { ComponentType } from 'react'
import { Badge } from '../../../lib'
import { CheckCircle, Clock, CloseCircle, Hourglass } from '../../../lib/icons/outline'
import { VARIAN_STATUS, type StatusPengajuan } from './data'

const IKON_STATUS: Record<StatusPengajuan, ComponentType> = {
  Selesai: CheckCircle,
  Diproses: Clock,
  Menunggu: Hourglass,
  Ditolak: CloseCircle,
}

/** Badge status pengajuan: warna dan ikon dipetakan dari status. */
export function StatusBadge({ status }: { status: StatusPengajuan }) {
  const Ikon = IKON_STATUS[status]
  return (
    <Badge variant={VARIAN_STATUS[status]} icon={<Ikon />}>
      {status}
    </Badge>
  )
}
