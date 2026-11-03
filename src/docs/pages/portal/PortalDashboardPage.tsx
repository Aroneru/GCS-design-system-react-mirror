import { ExamplePage } from '../ExamplePage'

/**
 * Pintu masuk Portal Dashboard, berpola sama dengan Example: satu tombol di
 * tengah yang membuka dasbornya penuh layar di `/portal-dashboard/app`.
 */
export function PortalDashboardPage() {
  return (
    <ExamplePage
      eyebrow="Portal Dashboard"
      judul="Beranda portal pegawai dari komponen yang sudah ada"
      deskripsi={
        <>
          Sapaan, kalender, wiki terbaru, anggaran, presensi, dan rencana kegiatan harian — dirakit dari
          komponen <code className="font-mono text-sm">@ceplok-ui/design-kit-react</code>.
        </>
      }
      labelTombol="Buka Portal Dashboard"
      tujuan="/portal-dashboard/app"
    />
  )
}
