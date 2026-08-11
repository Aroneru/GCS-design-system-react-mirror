import { DocUsage } from '../../DocUsage'
import { C, FoundationPage, Principles, SectionHead } from '../../pageKit'

const shadowScale = ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl']

const shadowColors: [string, string][] = [
  ['shadow-blue-600/50', 'bg-primary-600 shadow-lg shadow-primary-600/50'],
  ['shadow-green-500/50', 'bg-green-500 shadow-lg shadow-green-500/50'],
  ['shadow-red-500/50', 'bg-red-500 shadow-lg shadow-red-500/50'],
  ['shadow-orange-500/50', 'bg-orange-500 shadow-lg shadow-orange-500/50'],
  ['shadow-purple-500/50', 'bg-purple-500 shadow-lg shadow-purple-500/50'],
]

export function ElevationPage() {
  return (
    <FoundationPage
      eyebrow="Foundations · Elevation"
      title="Bayangan dan kedalaman"
      description="Elevation memberi hierarki kedalaman antarpermukaan — semakin tinggi elemen melayang, semakin lembut dan panjang bayangannya."
    >
      <SectionHead eyebrow="Box shadow" title="Skala bayangan">
        Enam tingkat dari <C>shadow-sm</C> hingga <C>shadow-2xl</C>. Gunakan <C>shadow</C> sebagai default untuk elemen melayang standar.
      </SectionHead>
      <article className="ds-card p-5 sm:p-7">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {shadowScale.map((cls) => (
            <div key={cls} className={`${cls} flex aspect-6/7 items-center justify-center rounded-lg bg-white text-center`}>
              <code className="text-sm font-bold text-primary-700">.{cls}</code>
            </div>
          ))}
        </div>
      </article>

      <DocUsage code={`{/* Semakin tinggi melayang, semakin besar bayangannya */}
<div className="rounded-lg bg-white shadow-sm">Kartu diam</div>
<div className="rounded-lg bg-white shadow-lg">Dropdown / popover</div>
<div className="rounded-xl bg-white shadow-2xl">Modal</div>

{/* Transisi bayangan saat hover */}
<div className="rounded-lg bg-white shadow transition-shadow hover:shadow-md">
  Kartu yang bisa diklik
</div>`} />

      <div className="mt-8">
        <SectionHead eyebrow="Box shadow color" title="Bayangan berwarna">
          Kombinasikan skala bayangan dengan warna token, mis. <C>shadow-lg shadow-primary-600/50</C>. Efektif untuk glow pada tombol CTA.
        </SectionHead>
        <article className="ds-card p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {shadowColors.map(([label, tile]) => (
              <div key={label} className={`${tile} flex h-32 items-center justify-center rounded-lg text-center`}>
                <code className="px-3 text-sm font-bold text-white">.{label}</code>
              </div>
            ))}
          </div>
        </article>
      </div>

      <DocUsage code={`{/* Bayangan berwarna — khusus penekanan seperti CTA */}
<button className="rounded-lg bg-primary-600 px-4 py-2 text-white shadow-lg shadow-primary-600/50">
  Aksi utama
</button>
<div className="rounded-lg bg-green-500 p-4 shadow-lg shadow-green-500/50">Berhasil</div>`} />

      <Principles items={[
        <>Kartu memakai <C>shadow-sm</C>/<C>shadow</C>, dropdown/popover <C>shadow-lg</C>, modal <C>shadow-xl</C> ke atas.</>,
        <>Batasi maksimal <strong className="text-gray-900">dua tingkat elevation</strong> dalam satu tampilan agar hierarki jelas.</>,
        <>Bayangan berwarna hanya untuk penekanan khusus (CTA, kartu promosi) — bukan konten reguler.</>,
        <>Bayangan bukan pengganti kontras — elemen interaktif tetap butuh batas/warna yang aksesibel.</>,
      ]} />
    </FoundationPage>
  )
}
