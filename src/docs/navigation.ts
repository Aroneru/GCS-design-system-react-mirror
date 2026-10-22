/**
 * Struktur navigasi dokumentasi — satu-satunya sumber untuk panel samping di
 * DocsLayout sekaligus angka ringkas di halaman Home. Dipisah dari DocsLayout
 * supaya berkas komponen hanya mengekspor komponen (syarat react-refresh).
 */

export type Section = "home" | "components" | "form" | "foundations" | "example";

/** Pintasan pencarian halaman untuk ditampilkan, mengikuti sistem operasi pembaca. */
export const pintasanCari =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

export const rail: { key: Section; label: string; route: string; icon: string; keywords?: string }[] = [
  {
    key: "home",
    label: "Home",
    route: "/",
    icon: "M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-6h5v6",
    keywords: "beranda halaman utama",
  },
  {
    key: "components",
    label: "Components",
    route: "/components",
    icon: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
  },
  {
    key: "form",
    label: "Form",
    route: "/form",
    icon: "M4 6h16M4 12h10M4 18h13M17.5 10.5l3 3-4.5 4.5H13v-3l4.5-4.5Z",
  },
  {
    key: "foundations",
    label: "Foundations",
    route: "/foundations",
    icon: "M12 3.5c3.8 3.2 6.5 6 6.5 9.5a6.5 6.5 0 1 1-13 0c0-3.5 2.7-6.3 6.5-9.5Z",
  },
  {
    key: "example",
    label: "Example",
    route: "/example",
    icon: "M4 5.5h16v13H4v-13Zm0 4h16M7.5 13h5m-5 2.5h8",
    keywords: "contoh aplikasi demo",
  },
];

/**
 * Entri panel samping; `children` dipakai halaman yang punya sub-halaman.
 * `soon` menandai halaman yang komponennya belum ada (masih PlaceholderPage):
 * tidak ikut terhitung sebagai elemen yang tersedia di Home, dan tautannya
 * disembunyikan dari panel samping. Rutenya tetap hidup dan bisa dibuka lewat
 * URL, jadi entri ini sengaja dipertahankan, bukan dihapus.
 */
export type NavItem = {
  label: string;
  route: string;
  children?: NavItem[];
  soon?: boolean;
  /**
   * Menandai halaman yang mendokumentasikan komponen yang sama dengan entri
   * lain — misal susunan "usulan" — supaya tidak ikut terhitung dua kali pada
   * angka ringkas di halaman Home.
   */
  alt?: boolean;
  /**
   * Kata lain untuk pencarian halaman (Ctrl+K), dipisah spasi — terutama
   * padanan bahasa Indonesia dari label yang berbahasa Inggris, mis. "tombol"
   * untuk Button.
   */
  keywords?: string;
};

export const sidebars: Record<string, { title: string; items: NavItem[] }> = {
  foundations: {
    title: "Foundations",
    items: [
      { label: "Overview", route: "/foundations", keywords: "ikhtisar dasar" },
      { label: "Colors", route: "/foundations/colors", keywords: "warna palet token" },
      { label: "Typography", route: "/foundations/typography", keywords: "tipografi huruf font teks" },
      { label: "Spacing", route: "/foundations/spacing", keywords: "jarak spasi" },
      { label: "Border", route: "/foundations/border", keywords: "garis radius sudut" },
      { label: "Elevation", route: "/foundations/elevation", keywords: "bayangan shadow" },
      { label: "Icons", route: "/foundations/icons", keywords: "ikon" },
    ],
  },
  form: {
    title: "Form",
    items: [
      { label: "Overview", route: "/form", keywords: "ikhtisar formulir" },
      {
        label: "Input Field Form",
        route: "/form/input-field",
        keywords: "isian",
        children: [
          { label: "Input Field", route: "/form/input-field/input", keywords: "isian teks password kata sandi" },
          { label: "Floating Label", route: "/form/input-field/floating-label", keywords: "label melayang" },
          { label: "Text Area", route: "/form/input-field/text-area", keywords: "teks panjang editor" },
        ],
      },
      { label: "Regular Select Form", route: "/form/select", keywords: "pilihan dropdown provinsi" },
      { label: "Search Form", route: "/form/search", keywords: "cari pencarian" },
      { label: "Datepicker", route: "/form/datepicker", keywords: "tanggal kalender" },
      { label: "Upload Form", route: "/form/upload", keywords: "unggah berkas file" },
      { label: "Radio Button", route: "/form/radio", keywords: "pilihan tunggal" },
      { label: "Toggle Button", route: "/form/toggle", keywords: "sakelar switch" },
      { label: "Checkbox", route: "/form/checkbox", keywords: "centang kotak" },
    ],
  },
  components: {
    title: "Components",
    items: [
      { label: "Overview", route: "/components", keywords: "ikhtisar komponen" },
      { label: "Container", route: "/components/container", keywords: "wadah" },
      { label: "Button", route: "/components/button", keywords: "tombol" },
      { label: "Clipboard", route: "/components/clipboard", keywords: "salin copy" },
      { label: "Badge", route: "/components/badge", keywords: "lencana label" },
      { label: "Avatar", route: "/components/avatar", keywords: "foto profil inisial" },
      { label: "Spinner", route: "/components/spinner", keywords: "memuat loading" },
      { label: "Popover", route: "/components/popover", keywords: "tooltip" },
      { label: "Dropdown", route: "/components/dropdown", keywords: "menu" },
      { label: "Modal", route: "/components/modal", keywords: "dialog" },
      { label: "Drawer", route: "/components/drawer", keywords: "panel samping laci" },
      { label: "Alert", route: "/components/alert", keywords: "peringatan pesan" },
      { label: "Toast", route: "/components/toast", keywords: "notifikasi" },
      { label: "Card", route: "/components/card", keywords: "kartu" },
      { label: "Navbar", route: "/components/navbar", keywords: "navigasi header" },
      { label: "Hero", route: "/components/hero", keywords: "banner" },
      { label: "Footer", route: "/components/footer", keywords: "kaki halaman" },
      { label: "Breadcrumb", route: "/components/breadcrumb", keywords: "jejak remah" },
      { label: "Pagination", route: "/components/pagination", keywords: "halaman paginasi" },
      { label: "Sidebar", route: "/components/sidebar", keywords: "menu samping" },
      { label: "Table", route: "/components/table", keywords: "tabel data" },
      {
        label: "Timeline View",
        route: "/components/timeline",
        keywords: "linimasa riwayat aktivitas jejak proses persetujuan",
      },
    ],
  },
};
