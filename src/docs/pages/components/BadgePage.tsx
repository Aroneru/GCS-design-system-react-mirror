import { Badge } from '../../../lib'
import { DocExample } from '../../DocExample'
import { PropsTable, type PropRow } from '../../PropsTable'
import { ComponentPage, G, Section } from '../../pageKit'

const badgeProps: PropRow[] = [
  ['variant', 'string', 'gray', 'gray · brand · danger · warning · success'],
]

export function BadgePage() {
  return (
    <ComponentPage
      title="Badge"
      description="Label status ringkas untuk menandai kondisi sebuah entitas. Lima variant warna dengan makna semantik."
    >
      <Section title="Variants">
        <DocExample
          code={
            <>
              {'<Badge variant="'}
              <G>success</G>
              {'">Aktif</Badge>\n'}
              {'<Badge variant="warning">Menunggu</Badge>\n'}
              {'<Badge variant="danger">Ditolak</Badge>'}
            </>
          }
        >
          <Badge variant="gray">Draft</Badge>
          <Badge variant="brand">Baru</Badge>
          <Badge variant="success">Aktif</Badge>
          <Badge variant="warning">Menunggu</Badge>
          <Badge variant="danger">Ditolak</Badge>
        </DocExample>
      </Section>

      <Section title="Dalam konteks">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Badge biasanya menyertai judul, baris tabel, atau kartu untuk menandai status tanpa memakan banyak
          ruang.
        </p>
        <DocExample>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
            Pengajuan izin <Badge variant="warning">Menunggu</Badge>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
            Verifikasi data <Badge variant="success">Selesai</Badge>
          </span>
        </DocExample>
      </Section>

      <Section title="Properties">
        <PropsTable rows={badgeProps} minWidth="36rem" />
      </Section>
    </ComponentPage>
  )
}
