import { Github, Instagram } from '../../../lib/brandIcons'
import * as OutlineIcons from '../../../lib/icons/outline'
import { OverviewCard, OverviewPage } from '../../pageKit'

/** Swatch kecil untuk preview palet warna. */
const swatches = ['bg-primary-600', 'bg-green-500', 'bg-yellow-300', 'bg-red-500', 'bg-purple-500']

export function FoundationsOverview() {
  return (
    <OverviewPage
      eyebrow="Foundations · Overview"
      title="Foundations"
      description="Token dan aturan dasar yang menjadi pijakan seluruh komponen: warna, tipografi, jarak, garis, kedalaman, dan ikon. Semuanya terbit sebagai CSS token lewat @tpl/design-kit-react/tokens.css."
    >
      <OverviewCard
        route="/foundations/colors"
        name="Colors"
        desc="Delapan palet primitive dan lapisan semantic token yang memisahkan makna dari nilai warna."
        wide
      >
        <div className="rounded-xl bg-surface-subtle p-5">
          <div className="flex gap-2">
            {swatches.map((bg) => (
              <span key={bg} className={`${bg} h-12 flex-1 rounded-lg`} />
            ))}
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/foundations/typography"
        name="Typography"
        desc="Skala tipe Lato dari Display hingga Caption, lengkap dengan bobot dan tinggi baris."
      >
        <div className="rounded-xl bg-surface-subtle p-5">
          <p className="text-heading-2 leading-none font-black text-gray-900">Aa</p>
          <p className="mt-2 text-body-sm text-gray-500">Lato · 48 → 12px</p>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/foundations/spacing"
        name="Spacing"
        desc="Skala jarak berbasis 4px untuk padding, margin, dan gap di seluruh produk."
      >
        <div className="flex flex-col justify-center gap-1.5 rounded-xl bg-surface-subtle p-5">
          {['w-6', 'w-12', 'w-20', 'w-32'].map((w) => (
            <span key={w} className={`${w} h-2.5 rounded-xs bg-primary-600`} />
          ))}
        </div>
      </OverviewCard>

      <OverviewCard
        route="/foundations/border"
        name="Border"
        desc="Radius sudut, ketebalan garis, dan gaya garis yang membentuk kontur komponen."
      >
        <div className="flex items-center gap-3 rounded-xl bg-surface-subtle p-5">
          <span className="size-12 rounded-sm bg-primary-600" />
          <span className="size-12 rounded-lg bg-primary-600" />
          <span className="size-12 rounded-2xl bg-primary-600" />
          <span className="size-12 rounded-full bg-primary-600" />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/foundations/elevation"
        name="Elevation"
        desc="Enam tingkat bayangan untuk menyusun hierarki kedalaman antarpermukaan."
      >
        <div className="flex items-center gap-4 rounded-xl bg-surface-subtle p-5">
          <span className="size-12 rounded-lg bg-white shadow-sm" />
          <span className="size-12 rounded-lg bg-white shadow-md" />
          <span className="size-12 rounded-lg bg-white shadow-lg" />
          <span className="size-12 rounded-lg bg-white shadow-xl" />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/foundations/icons"
        name="Icons"
        desc="Set ikon solid dan outline, plus 30 logo brand — semuanya diekspor ulang oleh design kit."
        wide
      >
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface-subtle p-5 text-gray-700">
          <OutlineIcons.Home className="size-6" />
          <OutlineIcons.Search className="size-6" />
          <OutlineIcons.BellRing className="size-6" />
          <OutlineIcons.UserSettings className="size-6" />
          <span className="h-6 w-px bg-border" />
          <Github className="size-6" />
          <Instagram className="size-6" />
        </div>
      </OverviewCard>
    </OverviewPage>
  )
}
