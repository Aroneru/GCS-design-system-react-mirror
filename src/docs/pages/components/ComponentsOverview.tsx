import { Alert, Badge, Button, Navbar, Spinner, Toast } from "../../../lib";
import { OverviewCard, OverviewPage } from "../../pageKit";

export function ComponentsOverview() {
  return (
    <OverviewPage
      eyebrow="Components · Overview"
      title="Components"
      description="Komponen React siap pakai dari package @tpl/design-kit-react. Dipakai lewat import { Nama } from '@tpl/design-kit-react' setelah package terpasang."
    >
      <OverviewCard
        route="/components/container"
        name="Container"
        desc="Pembungkus lebar konten: 380px di mobile (rounded), maksimum 1126px di desktop."
        wide
      >
        <div className="rounded-xl bg-surface-subtle p-5">
          <div className="mx-auto max-w-[220px] rounded-lg border-2 border-dashed border-primary-300 bg-white px-4 py-6 text-center">
            <span className="text-xs font-black text-primary-700">1126px · 380px</span>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/button"
        name="Button"
        desc="Aksi utama dengan empat variant: primary, secondary, danger, ghost."
      >
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle p-5">
          <Button variant="filled">Primary</Button>
          <Button variant="outline">Secondary</Button>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/badge"
        name="Badge"
        desc="Label status ringkas dengan lima variant warna semantik."
      >
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle p-5">
          <Badge variant="success">Aktif</Badge>
          <Badge variant="warning">Menunggu</Badge>
          <Badge variant="danger">Ditolak</Badge>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/alert"
        name="Alert"
        desc="Pesan status di dalam alur halaman: lima variant warna, gaya soft atau outline."
      >
        <div className="rounded-xl bg-surface-subtle p-5">
          <Alert variant="success" heading="Ini adalah Alert" dismissible={false}>
            Ini merupakan Design system Stasi berupa component alert.
          </Alert>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/spinner"
        name="Spinner"
        desc="Indikator proses berputar dalam ukuran default dan large."
      >
        <div className="flex items-center justify-center rounded-xl bg-surface-subtle p-5">
          <Spinner aria-label="Memuat preview" />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/toast"
        name="Toast"
        desc="Notifikasi sekilas yang melayang di atas konten, dengan heading dan aksi opsional."
      >
        <div className="rounded-xl bg-surface-subtle p-5">
          <Toast variant="success" dismissible={false}>
            Sukses Membuat Data!
          </Toast>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/card"
        name="Card"
        desc="Wadah informasi dengan gambar, judul, deskripsi, dan aksi yang semuanya opsional."
      >
        <div className="rounded-xl bg-surface-subtle p-5">
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <img
              src="/images/card-sample.svg"
              alt=""
              className="aspect-video w-full object-cover"
            />
            <div className="space-y-1.5 p-3">
              <div className="h-2 w-24 rounded bg-gray-300" />
              <div className="h-1.5 w-full rounded bg-gray-200" />
              <div className="h-1.5 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/navbar"
        name="Navbar"
        desc="Navigasi responsif dengan search, menu, guest actions, dan account controls."
        wide
      >
        <div className="overflow-hidden rounded-xl bg-surface-subtle p-2">
          <Navbar
            brand={<span className="text-sm font-black text-content">KOMDIGI</span>}
            brandLabel="KOMDIGI — Beranda"
            items={[
              { id: "menu-1", label: "Menu 1", href: "#/menu-1" },
              { id: "menu-2", label: "Menu 2", href: "#/menu-2" },
            ]}
            guestActions={{
              login: { label: "Masuk", onClick: () => undefined },
              register: { label: "Daftar", onClick: () => undefined },
            }}
            onNavigate={(_, event) => event.preventDefault()}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/footer"
        name="Footer"
        desc="Penutup halaman responsif dengan logo, menu, hak cipta, dan tautan media sosial."
        wide
      >
        <div className="overflow-hidden rounded-xl">
          <div className="flex items-center justify-between gap-4 bg-gray-800 px-5 py-4">
            <img src="/images/komdigi-logo.svg" alt="Komdigi" className="h-7 w-auto" />
            <div className="hidden gap-5 text-xs text-gray-300 sm:flex">
              <span>Menu 1</span>
              <span>Menu 2</span>
              <span>Menu 3</span>
              <span>Menu 4</span>
            </div>
          </div>
        </div>
      </OverviewCard>
    </OverviewPage>
  );
}
