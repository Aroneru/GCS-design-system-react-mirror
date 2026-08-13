import { C } from '../../pageKit'
import {
  FlowSection,
  Lead,
  PrincipleList,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'

const radiusScale: [string, string][] = [
  ['rounded-sm', '2px'], ['rounded', '4px'], ['rounded-md', '6px'], ['rounded-lg', '8px'],
  ['rounded-xl', '12px'], ['rounded-2xl', '16px'], ['rounded-3xl', '24px'], ['rounded-full', '9999px'],
]

const borderWidths: [string, string, string][] = [
  ['border-0', '0px', 'outline outline-dashed outline-gray-300'],
  ['border', '1px', ''], ['border-2', '2px', ''], ['border-4', '4px', ''], ['border-8', '8px', ''],
]

const toc: TocEntry[] = [
  { id: 'radius', label: 'Border radius' },
  { id: 'width', label: 'Border width' },
  { id: 'style', label: 'Border style' },
  { id: 'prinsip', label: 'Prinsip penggunaan' },
]

export function BorderPage() {
  return (
    <UsulanPage
      eyebrow="Foundations · Border"
      title="Radius, ketebalan, dan gaya garis"
      description="Border membentuk kontur komponen — radius menentukan karakter sudut, ketebalan memberi penekanan, dan gaya garis membedakan status."
      toc={toc}
    >
      <FlowSection id="radius" title="Border radius">
        <Lead>
          Dari <C>rounded-sm</C> (2px) hingga <C>rounded-full</C> (pill/lingkaran). Gunakan <C>rounded</C>{' '}
          sebagai default.
        </Lead>

        <article className="ds-card p-5 sm:p-7">
          <div className="ds-scroll-x flex items-center gap-4 overflow-x-auto pb-2">
            {radiusScale.map(([cls, value]) => (
              <div key={cls} className={`${cls} ${cls === 'rounded-full' ? 'size-40' : 'aspect-6/7 w-40'} flex shrink-0 flex-col items-center justify-center gap-1 bg-primary-600 text-center`}>
                <code className="text-sm font-bold text-white">.{cls}</code>
                <code className="text-xs text-primary-200">{value}</code>
              </div>
            ))}
          </div>
        </article>

        <SectionCode>{`{/* Radius sesuai jenis komponen */}
<button className="rounded-lg border border-border px-4 py-2">Tombol</button>
<div className="rounded-2xl border border-border p-6">Kartu</div>
<span className="rounded-full bg-primary-50 px-2.5 py-1">Badge</span>`}</SectionCode>
      </FlowSection>

      <FlowSection id="width" title="Border width">
        <Lead>
          Lima tingkat dari <C>border-0</C> hingga <C>border-8</C>. Default <C>border</C> (1px) cukup untuk
          mayoritas kebutuhan.
        </Lead>

        <article className="ds-card p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {borderWidths.map(([cls, value, extra]) => (
              <div key={cls} className={`${cls} ${extra} flex aspect-6/7 flex-col items-center justify-center gap-1 rounded-lg border-primary-300 bg-white text-center`}>
                <code className="text-sm font-bold break-all text-primary-700">.{cls}</code>
                <code className="text-xs text-gray-400">{value}</code>
              </div>
            ))}
          </div>
        </article>

        <SectionCode>{`{/* Ketebalan — di atas 1px hanya untuk penekanan */}
<div className="border border-border">Default 1px</div>
<div className="border-2 border-primary-600">Sedang terpilih</div>
<div className="border-b border-border">Garis bawah saja</div>`}</SectionCode>
      </FlowSection>

      <FlowSection id="style" title="Border style">
        <Lead>
          Gaya standar adalah <C>border-solid</C> — dipakai untuk seluruh kontur komponen.
        </Lead>

        <article className="ds-card p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="flex aspect-6/7 flex-col items-center justify-center gap-1 rounded-lg border-2 border-solid border-white bg-primary-500 text-center ring-1 ring-gray-200">
              <code className="text-sm font-bold break-all text-white">.border-solid</code>
              <code className="text-xs text-primary-100">solid</code>
            </div>
          </div>
        </article>

        <SectionCode>{`{/* Gaya garis */}
<div className="border border-solid border-border">Solid — default</div>
<div className="border border-dashed border-gray-300">Putus-putus</div>`}</SectionCode>
      </FlowSection>

      <FlowSection id="prinsip" title="Prinsip penggunaan">
        <PrincipleList
          items={[
            <>Kontrol interaktif memakai <C>rounded-lg</C>, kartu <C>rounded-2xl</C>, badge/avatar <C>rounded-full</C>.</>,
            <>Gunakan token <C>border-border</C> (gray-200) untuk garis pemisah dan kontur netral.</>,
            <>Ketebalan di atas 1px hanya untuk penekanan — fokus, seleksi aktif, atau validasi.</>,
            <>Jangan mencampur radius berbeda pada elemen bertumpuk; sudut dalam sebaiknya lebih kecil dari sudut luar.</>,
          ]}
        />
      </FlowSection>
    </UsulanPage>
  )
}
