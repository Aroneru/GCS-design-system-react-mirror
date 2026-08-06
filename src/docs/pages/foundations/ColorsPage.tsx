import { useState } from 'react'
import { DocHero } from '../../DocHero'
import { DocUsage } from '../../DocUsage'

// Primitive palette — sama persis dengan foundations/colors.blade.php.
const palettes: { key: string; name: string; colors: [number, string][] }[] = [
  { key: 'primary', name: 'Biru (untuk identitas utama aplikasi)', colors: [[900, '#233876'], [800, '#1E429F'], [700, '#1A56DB'], [600, '#1C64F2'], [500, '#3F83F8'], [400, '#76A9FA'], [300, '#A4CAFE'], [200, '#C3DDFD'], [100, '#E1EFFE'], [50, '#EBF5FF']] },
  { key: 'blue-portal', name: 'Biru Portal (untuk identitas ...)', colors: [[900, '#020217'], [800, '#060746'], [700, '#0B0C75'], [600, '#0F11A4'], [500, '#2D30EC'], [400, '#5B5EF0'], [300, '#5B5EF0'], [200, '#8A8CF4'], [100, '#B9BAF9'], [50, '#E8E8FD']] },
  { key: 'gray', name: 'Abu-abu (untuk teks, border, dan permukaan)', colors: [[900, '#111827'], [800, '#1F2937'], [700, '#374151'], [600, '#4B5563'], [500, '#6B7280'], [400, '#9CA3AF'], [300, '#D1D5DB'], [200, '#E5E7EB'], [100, '#F3F4F6'], [50, '#F9FAFB']] },
  { key: 'red', name: 'Merah (untuk pertanda suatu error)', colors: [[900, '#771D1D'], [800, '#9B1C1C'], [700, '#C81E1E'], [600, '#E02424'], [500, '#F05252'], [400, '#F98080'], [300, '#F8B4B4'], [200, '#FBD5D5'], [100, '#FDE8E8'], [50, '#FDF2F2']] },
  { key: 'orange', name: 'Orange (untuk pertanda suatu peringatan)', colors: [[900, '#771D1D'], [800, '#8A2C0D'], [700, '#B43403'], [600, '#D03801'], [500, '#FF5A1F'], [400, '#FF8A4C'], [300, '#FDBA8C'], [200, '#FCD9BD'], [100, '#FEECDC'], [50, '#FFF8F1']] },
  { key: 'yellow', name: 'Kuning (untuk warna border dari peringatan)', colors: [[900, '#633112'], [800, '#723B13'], [700, '#8E4B10'], [600, '#9F580A'], [500, '#C27803'], [400, '#E3A008'], [300, '#FACA15'], [200, '#FCE96A'], [100, '#FDF6B2'], [50, '#FDFDEA']] },
  { key: 'green', name: 'Hijau (untuk warna penanda sukses proses & aplikasi Digika)', colors: [[900, '#014737'], [800, '#03543F'], [700, '#046C4E'], [600, '#057A55'], [500, '#0E9F6E'], [400, '#31C48D'], [300, '#84E1BC'], [200, '#BCF0DA'], [100, '#DEF7EC'], [50, '#F3FAF7']] },
  { key: 'purple', name: 'Ungu (untuk warna Simaya)', colors: [[900, '#4A1D96'], [800, '#5521B5'], [700, '#6C2BD9'], [600, '#7E3AF2'], [500, '#9061F9'], [400, '#AC94FA'], [300, '#CABFFD'], [200, '#DCD7FE'], [100, '#EDEBFE'], [50, '#F6F5FF']] },
]

const semantics: [string, string, string, string, string][] = [
  ['Brand', 'Aksi dan identitas utama', 'bg-brand', 'text-white', 'primary-600'],
  ['Error', 'Error dan aksi destruktif', 'bg-feedback-error', 'text-white', 'red-600'],
  ['Warning', 'Status perlu perhatian', 'bg-feedback-warning', 'text-gray-900', 'yellow-300'],
  ['Success', 'Proses berhasil', 'bg-feedback-success', 'text-white', 'green-600'],
]

const primitiveUsage = `{/* Latar, teks, dan garis */}
<div className="bg-primary-600 text-white">Panel utama</div>
<p className="text-gray-500">Teks sekunder</p>
<div className="border border-gray-200">Kotak dengan garis</div>

{/* Warna dengan transparansi */}
<div className="bg-gray-900/50">Overlay 50%</div>`

const semanticUsage = `{/* Pakai token semantik di komponen, bukan primitive langsung */}
<button className="bg-brand text-white hover:bg-brand-hover">Simpan</button>
<span className="text-feedback-error">Terjadi kesalahan</span>
<div className="border border-border bg-surface text-content">Kartu</div>
<p className="text-content-subtle">Keterangan pendukung</p>`

export function ColorsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (hex: string, id: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(id)
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200)
    } catch {
      /* noop */
    }
  }

  return (
    <>
      <DocHero
        eyebrow="Foundations · Color"
        title="Color tokens"
        description="Klik warna untuk menyalin nilai HEX. Skala primitive dinamai berdasarkan warna, lalu dipetakan ke semantic token agar makna terpisah dari palet."
      >
        <span className="mt-5 inline-block w-fit rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
          8 palette · 80 tokens
        </span>
      </DocHero>

      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
        <div className="space-y-9">
          {palettes.map((palette) => (
            <article key={palette.key}>
              <h2 className="text-heading-4 font-black text-gray-900">{palette.name}</h2>
              <code className="mt-0.5 block text-sm text-gray-400">colors.{palette.key}</code>

              <div className="ds-scroll-x mt-4 overflow-x-auto pb-1">
                <div className="min-w-[46rem]">
                  <div className="grid grid-cols-10 overflow-hidden rounded-xl">
                    {palette.colors.map(([shade, hex]) => {
                      const id = `${palette.key}-${shade}`
                      return (
                        <button
                          key={shade}
                          onClick={() => copy(hex, id)}
                          className="relative grid h-20 place-items-center transition-transform hover:z-10 hover:-translate-y-0.5 focus:z-10"
                          style={{ backgroundColor: hex }}
                          aria-label={`Salin ${palette.key} ${shade}, ${hex}`}
                        >
                          <span className={`text-sm font-bold ${shade >= 500 ? 'text-white' : 'text-gray-900'}`}>{shade}</span>
                          {copied === id && (
                            <span className="absolute inset-0 grid place-items-center bg-gray-900/80 text-[11px] font-bold text-white">
                              Tersalin!
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-2 grid grid-cols-10">
                    {palette.colors.map(([shade, hex]) => (
                      <span key={shade} className="text-center text-[11px] text-gray-400">
                        {hex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <DocUsage code={primitiveUsage} label="React" />

        <div className="mt-14">
          <p className="ds-eyebrow">Semantic layer</p>
          <h2 className="mt-2 text-heading-3 font-black text-gray-900">Tokens berdasarkan fungsi</h2>
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Gunakan token ini di komponen, bukan primitive-nya langsung — supaya palet bisa berubah
            tanpa menyentuh kode komponen.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {semantics.map(([name, description, cls, textClass, source]) => (
              <div key={name} className="ds-card p-4">
                <div className={`${cls} ${textClass} grid size-11 place-items-center rounded-xl`}>
                  <span className="size-3 rounded-full border-2 border-current" />
                </div>
                <h3 className="mt-4 text-sm font-black text-gray-900">{name}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
                <code className="mt-3 block text-[11px] font-bold text-gray-400">→ colors.{source}</code>
              </div>
            ))}
          </div>
        </div>
        <DocUsage code={semanticUsage} label="React" />
      </div>
    </>
  )
}
