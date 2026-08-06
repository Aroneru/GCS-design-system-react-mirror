import { FloatingLabel, InputField } from '../../../lib'
import { User } from '../../../lib/icons/solid'
import { OverviewCard, OverviewPage } from '../../pageKit'

/** Pembungkus preview kartu overview — latar netral seragam. */
function Preview({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-surface-subtle p-5">{children}</div>
}

export function InputFieldFormPage() {
  return (
    <OverviewPage
      eyebrow="Form · Overview"
      title="Input Field Form"
      description="Kumpulan isian teks pada formulir: Input Field satu baris, Floating Label, dan Text Area untuk isian panjang. Seluruh warna, radius, dan jarak memakai token dari Foundations."
    >
      <OverviewCard
        route="/form/input-field/input"
        name="Input Field"
        desc="Isian teks satu baris dengan label di atas field, lengkap dengan state dan warna per aplikasi."
      >
        <Preview>
          <InputField
            label="Nama lengkap"
            placeholder="Masukkan nama lengkap"
            icon={<User className="size-4" />}
          />
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/input-field/floating-label"
        name="Floating Label"
        desc="Label yang naik ke garis atas begitu field difokus atau berisi — hemat ruang tanpa kehilangan keterangan."
      >
        <Preview>
          <FloatingLabel
            label="Nama lengkap"
            defaultValue="Budi Santoso"
            state="active"
            icon={<User className="size-4" />}
          />
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/input-field/text-area"
        name="Text Area"
        desc="Isian teks banyak baris untuk keterangan panjang, dengan tinggi yang bisa diatur."
        wide
      >
        <Preview>
          <div className="rounded-lg border border-gray-300 bg-surface px-4 py-3">
            <p className="text-sm text-gray-500">Tulis keterangan tambahan…</p>
            <div className="mt-8 flex justify-end">
              <span className="text-xs text-gray-400">0/500</span>
            </div>
          </div>
        </Preview>
      </OverviewCard>
    </OverviewPage>
  )
}
