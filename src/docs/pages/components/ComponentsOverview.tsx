import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Footer,
  Hero,
  Navbar,
  Pagination,
  Popover,
  Sidebar,
  Spinner,
  Toast,
} from "../../../lib";
import { NotReadyPreview, OverviewCard, OverviewPage } from "../../pageKit";
import { asset } from "../../asset";

export function ComponentsOverview() {
  return (
    <OverviewPage
      eyebrow="Components · Overview"
      title="Components"
      description="Komponen React siap pakai dari package @stasi/design-kit-react. Dipakai lewat import { Nama } from '@stasi/design-kit-react' setelah package terpasang."
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
        route="/components/popover"
        name="Popover"
        desc="Panel informasi ringkas dengan arrow pada empat pilihan sisi."
      >
        <div className="flex items-center justify-center rounded-xl bg-surface-subtle p-5">
          <Popover title="Popover" side="bottom">
            Popover Body Text, Popover Body Text, Popover Body Text
          </Popover>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/modal"
        name="Modal"
        desc="Dialog terkontrol untuk informasi atau tindakan yang harus diselesaikan sebelum kembali ke halaman utama."
      >
        <div className="rounded-xl bg-gray-900/40 p-5">
          <div className="mx-auto max-w-[240px] overflow-hidden rounded-lg border border-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="h-2.5 w-24 rounded bg-gray-300" />
              <div className="size-3 rounded bg-gray-200" />
            </div>
            <div className="space-y-2 px-4 py-5">
              <div className="h-1.5 w-full rounded bg-gray-200" />
              <div className="h-1.5 w-2/3 rounded bg-gray-200" />
            </div>
            <div className="border-t border-border px-4 py-3">
              <div className="h-6 w-20 rounded-lg bg-primary-700" />
            </div>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/toast"
        name="Toast"
        desc="Notifikasi sekilas yang melayang di atas konten, dengan heading dan aksi opsional."
      >
        {/*
          Skeleton halaman di belakangnya penting: Toast bedanya dengan Alert
          justru karena ia melayang di atas konten, bukan menempati alur. Tanpa
          latar ini kartunya tak terbedakan dari kartu Alert.
          mt-auto menurunkan Toast ke sudut bawah kiri, memakai sisa tinggi
          kartu yang memang diserap preview.
        */}
        <div className="flex flex-col rounded-xl bg-surface-subtle p-5">
          <div className="space-y-3 opacity-60" aria-hidden="true">
            <div className="h-2 w-2/5 rounded bg-gray-300" />
            <div className="h-1.5 w-full rounded bg-gray-200" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200" />
            <div className="mt-6 h-2 w-1/3 rounded bg-gray-300" />
            <div className="h-1.5 w-full rounded bg-gray-200" />
            <div className="h-1.5 w-4/6 rounded bg-gray-200" />
          </div>
          <div className="mt-auto max-w-80 pt-8">
            <Toast variant="success">Sukses Membuat Data!</Toast>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/card"
        name="Card"
        desc="Wadah informasi dengan gambar, judul, deskripsi, dan aksi yang semuanya opsional."
      >
        {/* Tanpa `href`: Card merender <a> hanya bila href diisi, jadi preview
            ini aman di dalam anchor kartu. Terverifikasi lewat renderToString. */}
        <div className="rounded-xl bg-surface-subtle p-5">
          <Card
            image={asset("/images/card-sample.svg")}
            imageAlt=""
            title="Judul Kartu"
            description="Deskripsi singkat yang menjelaskan isi kartu dalam satu atau dua baris."
          />
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
        route="/components/hero"
        name="Hero"
        desc="Pembuka halaman: judul, sub heading, deskripsi, satu tombol, dan gambar di kiri atau kanan."
        wide
      >
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <Hero
            heading="Judul Halaman"
            subHeading="Sub heading"
            description="Paragraf pembuka yang menjelaskan isi halaman secara singkat."
            buttonLabel="Selengkapnya"
            image={asset("/images/hero-sample.svg")}
            imageAlt=""
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/footer"
        name="Footer"
        desc="Penutup halaman responsif dengan logo, menu, hak cipta, dan tautan media sosial."
        wide
      >
        {/*
          Catatan: Footer tetap merender <a href="#"> untuk tiap menu walau
          `url` dikosongkan, jadi preview ini menaruh anchor di dalam anchor
          kartu — sama seperti kartu Navbar. Lihat komentar di OverviewCard.
        */}
        <div className="overflow-hidden rounded-xl">
          <Footer
            logo={asset("/images/komdigi-logo.svg")}
            logoAlt="Komdigi"
            menus={[
              { label: "Menu 1" },
              { label: "Menu 2" },
              { label: "Menu 3" },
              { label: "Menu 4" },
            ]}
            copyright="© 2026 Komdigi"
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/breadcrumb"
        name="Breadcrumb"
        desc="Jejak lokasi halaman dengan pemisah chevron, dua ukuran teks, dan latar opsional."
      >
        {/* Tanpa href: Breadcrumb hanya merender <a> bila item punya href, dan
            kartu ini sendiri sudah berupa <a>. */}
        <div className="flex items-center rounded-xl bg-surface-subtle p-5">
          <Breadcrumb
            items={[{ label: "Beranda" }, { label: "Komponen" }, { label: "Breadcrumb" }]}
          />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/pagination"
        name="Pagination"
        desc="Navigasi antar halaman daftar data, dengan tema warna mengikuti aplikasi."
      >
        <div className="flex justify-center rounded-xl bg-surface-subtle p-5">
          <Pagination currentPage={2} totalPages={5} onPageChange={() => undefined} />
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/sidebar"
        name="Sidebar"
        desc="Navigasi samping dengan grup menu, submenu, profil akun, dan mode ringkas."
      >
        {/*
          Sidebar asli, tapi dipotong pembungkus bertinggi tetap: komponennya
          memakai min-h-screen, dan cn() di library ini clsx murni tanpa
          tailwind-merge — jadi tingginya tidak bisa ditimpa lewat className.
          Yang tampil bagian atasnya, cukup untuk memperlihatkan menu aktif.

          Sama seperti Footer, Sidebar tetap merender <a href="#"> untuk tiap
          item walau `href` dikosongkan.
        */}
        <div className="rounded-xl bg-surface-subtle p-5">
          <div className="h-56 w-70 max-w-full overflow-hidden rounded-lg border border-border">
            <Sidebar
              items={[
                { label: "Beranda", active: true },
                { label: "Layanan" },
                { label: "Laporan" },
                { label: "Pengaturan" },
              ]}
            />
          </div>
        </div>
      </OverviewCard>

      <OverviewCard
        route="/components/table"
        name="Table"
        desc="Tabel data dengan header, baris berselang, dan aksi per baris."
        wide
        soon
      >
        <NotReadyPreview name="Table" />
      </OverviewCard>
    </OverviewPage>
  );
}
