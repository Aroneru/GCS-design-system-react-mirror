import { useEffect, useMemo, useState, type Key, type ReactNode } from "react";
import { Plus } from "flowbite-react-icons/outline";
import { Download, Edit, Eye, Printer, TrashBin } from "flowbite-react-icons/solid";
import {
  Badge,
  Button,
  Table,
  type BadgeVariant,
  type PaginationTheme,
  type TableActionIconSize,
  type TableColumn,
  type TableRowAction,
  type TableSize,
  type TableSort,
} from "../../../lib";
import { asset } from "../../asset";
import { adaTidakAda } from "../../usulanOptions";
import { PropsTable, type PropRow } from "../../PropsTable";
import { Demo, H, Hl, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

/** Gambar contoh bergantian 1.png sampai 5.png di public/images/Placeholder, sesuai id baris. */
const placeholderImage = (id: number) => asset(`images/Placeholder/${((id - 1) % 5) + 1}.png`);

/*
 * Aturan sort di contoh halaman ini:
 * - teks biasa: tanpa sortValue, Table mengurutkan abjad A-Z / Z-A
 *   (angka di dalam teks ikut urut wajar: "Record 9" sebelum "Record 10");
 * - tanggal: sortValue berupa waktu (milidetik), bukan teks tampilannya;
 * - ID: sortValue berupa angka.
 */

const BULAN = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];

/** "10 Maret 1990" → waktu dalam milidetik. */
const waktuTanggalId = (teks: string) => {
  const [hari, bulan, tahun] = teks.split(" ");
  return Date.UTC(Number(tahun), BULAN.indexOf(bulan.toLowerCase()), Number(hari));
};

/** "28/12/2022" (DD/MM/YYYY) → waktu dalam milidetik. */
const waktuDmy = (teks: string) => {
  const [hari, bulan, tahun] = teks.split("/").map(Number);
  return Date.UTC(tahun, bulan - 1, hari);
};

type Row = {
  id: number;
  field1: string;
  field2: string;
  file: string;
  status: BadgeVariant;
};

const statuses: BadgeVariant[] = ["success", "success", "danger", "brand", "success", "warning"];

const allRows: Row[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  field1: `Record ${i + 1}`,
  field2: `Record ${i + 1}`,
  file: `Image ${(i % 5) + 1}.png`,
  status: statuses[i % statuses.length],
}));

/**
 * Aksi per baris: ikon, judul (tooltip), dan tujuannya ditentukan pemakai.
 * Dibuat generik supaya bisa dipakai tabel penduduk di bawah juga. `style`
 * diisi Playground untuk ukuran ikon.
 */
type ActionStyle = Pick<TableRowAction<unknown>, "iconSize">;

const makeActions = <T extends { id: number }>(style: ActionStyle = {}): TableRowAction<T>[] => [
  { key: "ubah", icon: <Edit />, label: "Ubah", theme: "yellow", ...style, onClick: (r) => console.log("ubah", r) },
  { key: "unduh", icon: <Download />, label: "Unduh", ...style, onClick: (r) => console.log("unduh", r) },
  { key: "cetak", icon: <Printer />, label: "Cetak", theme: "green", ...style, onClick: () => window.print() },
];

const rowActions = makeActions<Row>();

/**
 * Kolom teks hanya naik ↔ turun (tanpa kembali ke urutan awal). Gambar dan
 * status tidak bisa diurutkan: urutan gambar atau warna badge tidak berarti.
 */
const columns: TableColumn<Row>[] = [
  { key: "field1", header: "Field 1", sortable: true, sortResettable: false, emphasis: true },
  { key: "field2", header: "Field 2", sortable: true, sortResettable: false },
  {
    key: "file",
    header: "Field 3",
    image: {
      src: (row) => placeholderImage(row.id),
      alt: (row) => row.file,
      caption: (row) => row.file,
    },
  },
  {
    key: "status",
    header: "Field 4",
    cell: (row) => <Badge variant={row.status}>{row.field1}</Badge>,
  },
  { key: "aksi", header: "Field 5", actions: rowActions, hideable: false },
];

type Penduduk = {
  id: number;
  nama: string;
  namaAwal: string;
  namaAkhir: string;
  // nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  telepon: string;
  email: string;
};

const namaPenduduk = ["Andi Saputra", "Budi Santoso", "Citra Lestari", "Dewi Anggraini", "Eko Prasetyo"];

const pendudukRows: Penduduk[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  nama: namaPenduduk[i],
  namaAwal: namaPenduduk[i].split(" ")[0],
  namaAkhir: namaPenduduk[i].split(" ")[1],
  // nik: `32730${1000000000 + i * 7919}`,
  tempatLahir: ["Bandung", "Bogor", "Cimahi", "Garut", "Depok"][i],
  tanggalLahir: `${10 + i} Maret 199${i}`,
  alamat: `Jl. Merdeka No. ${12 + i}`,
  kecamatan: "Sumur Bandung",
  kota: "Kota Bandung",
  provinsi: "Jawa Barat",
  telepon: `0812-3456-78${10 + i}`,
  email: `warga${i + 1}@contoh.go.id`,
}));

const wideColumns: TableColumn<Penduduk>[] = [
  { key: "nama", header: "Nama", emphasis: true, align: "left" },
  // { key: "nik", header: "NIK", align: "left" },
  { key: "tempatLahir", header: "Tempat Lahir", align: "left" },
  { key: "tanggalLahir", header: "Tanggal Lahir", align: "left" },
  { key: "alamat", header: "Alamat", align: "left" },
  { key: "kecamatan", header: "Kecamatan", align: "left" },
  { key: "kota", header: "Kota", align: "left" },
  { key: "provinsi", header: "Provinsi", align: "left" },
  { key: "telepon", header: "Telepon", align: "left" },
  { key: "email", header: "Email", align: "left" },
  { key: "aksi", header: "Aksi", actions: makeActions<Penduduk>() },
];

/** Tiap kolom mengurutkan dengan caranya sendiri — atau tidak sama sekali. */
const sortColumns: TableColumn<Penduduk>[] = [
  // Bawaan: naik → turun → tanpa urutan.
  { key: "nama", header: "Nama", emphasis: true, align: "left", sortable: true },
  // Terbaru dulu, dan tidak bisa kembali tanpa urutan.
  {
    key: "tanggalLahir",
    header: "Tanggal Lahir",
    align: "left",
    sortable: true,
    sortDirections: ["desc", "asc"],
    sortResettable: false,
    sortValue: (row) => waktuTanggalId(row.tanggalLahir),
  },
  // Ikon sort sendiri.
  {
    key: "tempatLahir",
    header: "Tempat Lahir",
    align: "left",
    sortable: true,
    sortIcon: (direction) => (
      <span aria-hidden="true" className="text-[10px]">
        {direction === "asc" ? "A→Z" : direction === "desc" ? "Z→A" : "A↕Z"}
      </span>
    ),
  },
  // Tidak sortable.
  { key: "email", header: "Email", align: "left" },
];

/** Kolom aksi dengan judul terlihat, tautan, dan tombol yang nonaktif per baris. */
const actionColumns: TableColumn<Penduduk>[] = [
  { key: "nama", header: "Nama", emphasis: true, align: "left" },
  { key: "email", header: "Email", align: "left" },
  {
    key: "aksi",
    header: "Aksi",
    actions: [
      { key: "detail", icon: <Eye />, label: "Lihat detail", showLabel: true, variant: "outline", tone: "light", onClick: (r) => console.log("detail", r) },
      { key: "hapus", icon: <TrashBin />, label: "Hapus", theme: "orange", disabled: (r) => r.id === 1, onClick: (r) => console.log("hapus", r) },
    ],
  },
];

/** Tiga posisi judul kolom. */
const alignColumns: TableColumn<Penduduk>[] = [
  { key: "nama", header: "Kiri (bawaan)", emphasis: true, align: "left" },
  { key: "tempatLahir", header: "Tengah", headerAlign: "center" },
  { key: "telepon", header: "Kanan", align: "right" },
];

/** Judul induk "Nama" dan "Kelahiran", masing-masing dengan dua kolom anak. */
const groupColumns: TableColumn<Penduduk>[] = [
  {
    key: "nama",
    header: "Nama",
    children: [
      { key: "namaAwal", header: "Nama Awal", emphasis: true, sortable: true },
      { key: "namaAkhir", header: "Nama Akhir", emphasis: true, sortable: true },
    ],
  },
  {
    key: "kelahiran",
    header: "Kelahiran",
    children: [
      { key: "tempatLahir", header: "Tempat" },
      { key: "tanggalLahir", header: "Tanggal" },
    ],
  },
  { key: "email", header: "Email" },
];

/** Gambar yang sama, sekali dengan pratinjau dan sekali tanpa. */
const imageColumns: TableColumn<Row>[] = [
  { key: "field1", header: "Nama", emphasis: true },
  {
    key: "file",
    header: "Dengan pratinjau",
    image: {
      src: (row) => placeholderImage(row.id),
      alt: (row) => row.file,
      caption: (row) => row.file,
    },
  },
  {
    key: "tanpa",
    header: "Tanpa pratinjau",
    image: {
      src: (row) => placeholderImage(row.id),
      alt: (row) => row.file,
      caption: (row) => row.file,
      preview: false,
    },
  },
];

type Order = {
  id: number;
  kode: string;
  customer: string;
  tanggal: string;
  jumlah: number;
  pembayaran: string;
  status: "Delivered" | "Process" | "Canceled";
};

const orderStatuses: Order["status"][] = ["Delivered", "Delivered", "Process", "Process", "Canceled"];

const orderRows: Order[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  kode: `#${String(10000 + ((i * 7919) % 90000))}`,
  customer: "Arandhana Rafli",
  tanggal: `${String((i % 28) + 1).padStart(2, "0")}/${String((i % 12) + 1).padStart(2, "0")}/2022`,
  jumlah: 8_000_000,
  pembayaran: i % 3 === 1 ? "Cash on Delivery" : "Tranfer Bank",
  status: orderStatuses[i % orderStatuses.length],
}));

const orderBadge: Record<Order["status"], BadgeVariant> = {
  Delivered: "success",
  Process: "warning",
  Canceled: "danger",
};

/** Tabel pesanan dari rancangan Figma untuk size `compact`. */
const orderColumns: TableColumn<Order>[] = [
  { key: "kode", header: "ID", sortable: true, sortResettable: false, sortValue: (row) => Number(row.kode.slice(1)) },
  {
    key: "gambar",
    header: "Gambar",
    align: "left",
    image: { src: (row) => placeholderImage(row.id), alt: (row) => `Produk ${row.kode}` },
  },
  { key: "customer", header: "Customer", align: "left", sortable: true, sortResettable: false },
  { key: "tanggal", header: "Date", align: "left", sortable: true, sortResettable: false, sortValue: (row) => waktuDmy(row.tanggal) },
  {
    key: "jumlah",
    header: "Amount",
    align: "left",
    cell: (row) => `Rp.${row.jumlah.toLocaleString("en-US")}`,
  },
  { key: "pembayaran", header: "Payment Mode", align: "left" },
  {
    key: "status",
    header: "Status",
    align: "left",
    cell: (row) => <Badge variant={orderBadge[row.status]}>{row.status}</Badge>,
  },
  { key: "aksi", header: "Action", actions: makeActions<Order>(), hideable: false },
];

/** Data tanpa `columns` — judulnya dibuat dari nama field. */
const autoRows = [
  { id: 1, namaLayanan: "Pembuatan KTP", jenis_layanan: "Kependudukan", estimasiHari: 3, aktif: true },
  { id: 2, namaLayanan: "Akta Kelahiran", jenis_layanan: "Pencatatan Sipil", estimasiHari: 7, aktif: true },
  { id: 3, namaLayanan: "Surat Pindah", jenis_layanan: "Kependudukan", estimasiHari: 5, aktif: false },
];

const sizeOptions: { value: TableSize; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "compact", label: "Compact" },
];

const themeOptions: { value: PaginationTheme; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "simaya", label: "Simaya" },
];

const actionIconSizeOptions: { value: TableActionIconSize; label: string }[] = [
  { value: "s", label: "S" },
  { value: "base", label: "Base" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];


const onOff = [
  { value: true, label: "On" },
  { value: false, label: "Off" },
];

const tableProps: PropRow[] = [
  ["columns", "TableColumn<T>[]", "dari data", "Daftar kolom yang tampil. Kalau tidak diisi, kolom dibuat otomatis dari data."],
  ["data", "T[]", "—", "Isi tabel. Dengan `manual`, cukup baris halaman yang sedang tampil."],
  ["rowKey", "keyof T | (row) => Key", "—", "Field yang nilainya unik di tiap baris, biasanya `\"id\"`."],
  ["size", '"normal" | "compact"', "normal", "Ukuran tabel. `compact` lebih rapat dan teksnya lebih kecil."],
  ["search", "TableSearchConfig", "undefined", "Menampilkan kotak pencarian di kiri atas."],
  ["filter", "TableFilterConfig", "undefined", "Menampilkan tombol \"Filter Data\" untuk memilih kolom yang tampil. Isi `{}` untuk memakai pengaturan bawaan."],
  ["actions", "ReactNode", "undefined", "Tombol di kanan atas tabel, mis. \"Tambah Data\"."],
  ["selectable", "boolean", "false", "Menambahkan checkbox di tiap baris."],
  ["selectedKeys", "Key[]", "undefined", "Daftar `rowKey` baris yang sedang dicentang."],
  ["defaultSelectedKeys", "Key[]", "undefined", "Baris yang dicentang saat tabel pertama tampil."],
  ["onSelectionChange", "(keys: Key[]) => void", "undefined", "Dipanggil setiap kali centang berubah."],
  ["sort", "{ key, direction } | null", "undefined", "Urutan yang sedang aktif, kalau kamu ingin menyimpannya sendiri."],
  ["defaultSort", "{ key, direction } | null", "null", "Urutan saat tabel pertama tampil."],
  ["onSortChange", "(sort) => void", "undefined", "Dipanggil saat judul kolom diklik."],
  ["sortIcon", "(direction | null) => ReactNode", "panah", "Ganti ikon sort untuk semua kolom."],
  ["pagination", "TablePaginationConfig", "undefined", "Membagi data per halaman. Tanpa ini semua baris tampil."],
  ["manual", "boolean", "false", "Pasang kalau urutan dan halaman diurus server."],
  ["loading", "boolean", "false", "Menampilkan ikon memuat sebagai ganti isi tabel."],
  ["emptyText", "ReactNode", "Tidak ada data", "Tulisan yang tampil kalau data kosong."],
];

const columnProps: PropRow[] = [
  ["key", "string", "—", "Nama field di data yang ditampilkan di kolom ini."],
  ["header", "ReactNode", "—", "Judul kolom."],
  ["children", "TableColumn<T>[]", "undefined", "Kolom anak. Kolom ini jadi judul induk di atas anak-anaknya."],
  ["cell", "(row, index) => ReactNode", "row[key]", "Isi sel sendiri, mis. Badge."],
  ["actions", "TableRowAction<T>[]", "undefined", "Tombol aksi di tiap baris. Tidak dipakai kalau `cell` diisi."],
  ["image", "TableColumnImage<T>", "undefined", "Gambar di sel, bisa diklik untuk dilihat besar. Tidak dipakai kalau `cell` atau `actions` diisi."],
  ["sortable", "boolean", "false", "Kolom bisa diurutkan dengan klik judulnya."],
  ["sortValue", "(row) => string | number", "row[key]", "Nilai yang dipakai untuk mengurutkan."],
  ["sortFn", "(a, b) => number", "undefined", "Fungsi pembanding sendiri. Dipakai sebagai ganti `sortValue`."],
  ["sortDirections", "TableSortDirection[]", '["asc", "desc"]', "Urutan klik. `[\"desc\", \"asc\"]` = mulai dari terbesar."],
  ["sortResettable", "boolean", "true", "Setelah naik dan turun, klik lagi kembali ke urutan awal."],
  ["sortIcon", "(direction | null) => ReactNode", "ikut Table", "Ganti ikon sort khusus kolom ini."],
  ["align", '"left" | "center" | "right"', "center", "Posisi isi sel: kiri, tengah, atau kanan."],
  ["headerAlign", '"left" | "center" | "right"', "ikut align, atau left", "Posisi judul kolom. Kalau tidak diisi, ikut `align`. Kalau `align` juga kosong, rata kiri. Judul induk kolom bertingkat bawaannya `center`."],
  ["emphasis", "boolean", "false", "Teks lebih gelap, biasanya untuk kolom utama seperti nama."],
  ["width", "string", "undefined", "Lebar kolom, mis. `\"12rem\"`."],
  ["minWidth", "string", "undefined", "Lebar paling kecil kolom."],
  ["hideable", "boolean", "true", "Kolom bisa disembunyikan lewat Filter Data. Isi `false` untuk kolom yang harus selalu tampil."],
  ["wrap", "boolean", "false", "Izinkan teks turun baris, mis. untuk alamat panjang."],
];

const actionProps: PropRow[] = [
  ["key", "string", "—", "Nama unik tombol, mis. `\"ubah\"`."],
  ["icon", "ReactNode", "—", "Ikon tombol."],
  ["label", "string | (row) => string", "—", "Judul tombol, muncul sebagai tooltip."],
  ["showLabel", "boolean", "false", "Tulis judul di samping ikon."],
  ["theme", "TableActionTheme", "primary", "Warna tombol: `\"primary\"`, `\"green\"`, `\"gray\"`, `\"simaya\"`, `\"orange\"`, `\"yellow\"`, `\"red\"`."],
  ["variant", '"filled" | "outline"', "filled", "Tombol berisi warna atau hanya garis tepi."],
  ["tone", '"light" | "dark"', "light", "Terang-gelapnya warna tombol."],
  ["iconSize", '"s" | "base" | "l" | "xl"', "base", "Ukuran ikon. Tombol ikut membesar: 20px, 24px, 32px, 40px."],
  ["radius", '"none" | "s" | "base" | "l" | "full"', "base", "Kelengkungan sudut tombol. `\"full\"` membuat tombol bulat."],
  ["href", "string | (row) => string", "undefined", "Alamat tujuan saat tombol diklik."],
  ["target", "string", "undefined", "Isi `\"_blank\"` untuk membuka di tab baru."],
  ["onClick", "(row, index) => void", "undefined", "Fungsi yang dijalankan saat tombol diklik."],
  ["hidden", "boolean | (row) => boolean", "false", "Sembunyikan tombol."],
  ["disabled", "boolean | (row) => boolean", "false", "Tombol tampil tapi tidak bisa diklik."],
];

const imageProps: PropRow[] = [
  ["src", "(row) => string | null", "—", "Alamat gambar. Kalau kosong, sel berisi \"—\"."],
  ["alt", "string | (row) => string", "\"\"", "Keterangan gambar untuk pembaca layar."],
  ["caption", "(row) => ReactNode", "undefined", "Teks di bawah gambar, mis. nama file. Di size `compact` hanya tampil saat pratinjau dibuka."],
  ["preview", "boolean", "true", "Klik gambar untuk melihatnya besar. Isi `false` kalau tidak perlu."],
];

const filterProps: PropRow[] = [
  ["label", "string", "Filter Data", "Teks tombol."],
  ["title", "ReactNode", "Tampilkan kolom", "Judul di atas daftar kolom."],
  ["defaultHiddenColumns", "string[]", "[]", "`key` kolom yang disembunyikan saat tabel pertama tampil."],
  ["hiddenColumns", "string[]", "undefined", "`key` kolom yang sedang disembunyikan, kalau kamu ingin menyimpannya sendiri."],
  ["onHiddenColumnsChange", "(keys: string[]) => void", "undefined", "Dipanggil setiap kali pilihan kolom berubah."],
];

const paginationProps: PropRow[] = [
  ["pageSize", "number", "10", "Jumlah baris per halaman."],
  ["page", "number", "undefined", "Halaman yang sedang tampil, kalau kamu ingin menyimpannya sendiri."],
  ["defaultPage", "number", "1", "Halaman saat tabel pertama tampil."],
  ["onPageChange", "(page) => void", "undefined", "Dipanggil saat user pindah halaman."],
  ["total", "number", "data.length", "Jumlah seluruh data. Wajib diisi kalau memakai `manual`."],
  ["theme", "PaginationTheme", "primary", "Warna tombol halaman yang aktif."],
  ["summary", "({ from, to, total }) => ReactNode", "Memperlihatkan …", "Ganti tulisan \"Memperlihatkan 1-10 of 1000 Data\"."],
];

/** Daftar poin pendek di bawah Lead — lebih mudah dipindai daripada paragraf panjang. */
const Points = ({ items }: { items: ReactNode[] }) => (
  <ul className="mb-4 list-disc space-y-1 pl-5 text-body-sm text-gray-500">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

/** Kotak berjudul untuk "kapan dipakai" dan sejenisnya. */
const Box = ({ title, items }: { title: string; items: ReactNode[] }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 text-body-sm text-gray-500">
    <p className="mb-2 font-semibold text-gray-900">{title}</p>
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);

const toc: TocEntry[] = [
  { id: "table", label: "Table" },
  { id: "states", label: "States" },
  { id: "size", label: "Size" },
  { id: "aksi", label: "Tombol aksi" },
  { id: "posisi", label: "Posisi judul" },
  { id: "gambar", label: "Gambar" },
  { id: "bertingkat", label: "Kolom bertingkat" },
  { id: "sort", label: "Sorting" },
  { id: "filter", label: "Filter kolom" },
  { id: "scroll", label: "Scroll" },
  { id: "otomatis", label: "Kolom otomatis" },
  { id: "server", label: "Data server" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

/** Kolom demo Data server. Sort `field1`/`field2` memakai id supaya "Record 10" jatuh setelah "Record 9". */
const serverColumns: TableColumn<Row>[] = [
  { key: "field1", header: "Field 1", sortable: true, emphasis: true, align: "left" },
  { key: "field2", header: "Field 2", sortable: true, align: "left" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (row) => <Badge variant={row.status}>{row.status}</Badge>,
  },
];

type ServerQuery = { page: number; pageSize: number; sort: TableSort | null; q: string };
type ServerResponse = { items: Row[]; total: number };

/**
 * Server palsu untuk demo: `allRows` berperan sebagai database. Ia mencari,
 * mengurutkan, dan memotong satu halaman, lalu menjawab setelah 600ms supaya
 * keadaan loading terlihat. Di aplikasi asli, isi fungsi ini diganti `fetch`.
 */
function fakeServer({ page, pageSize, sort, q }: ServerQuery): Promise<ServerResponse> {
  const found = allRows.filter((r) => r.field1.toLowerCase().includes(q.toLowerCase()));
  if (sort) {
    const value = (r: Row) => (sort.key === "status" ? r.status : r.id);
    const factor = sort.direction === "asc" ? 1 : -1;
    found.sort((a, b) => (value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0) * factor);
  }
  const items = found.slice((page - 1) * pageSize, page * pageSize);
  return new Promise((resolve) => setTimeout(() => resolve({ items, total: found.length }), 600));
}

/** Alamat request yang setara, ditampilkan di bawah demo supaya terlihat apa yang dikirim. */
const requestUrl = ({ page, pageSize, sort, q }: ServerQuery) =>
  `GET /api/data?page=${page}&pageSize=${pageSize}` +
  (sort ? `&sort=${sort.key}&dir=${sort.direction}` : "") +
  (q ? `&q=${encodeURIComponent(q)}` : "");

/**
 * Demo `manual`. `input` adalah isi kotak pencarian, `q` adalah kata yang benar-
 * benar dikirim ke server. Dengan "Tunda pencarian" On, `q` baru diperbarui
 * 300ms setelah user berhenti mengetik (debounce). Penghitung request
 * memperlihatkan bedanya.
 */
function ServerTable() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TableSort | null>(null);
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [debounce, setDebounce] = useState(true);
  // Mulai dari 1: request pertama saat tabel tampil.
  const [sent, setSent] = useState(1);
  const countRequest = () => setSent((n) => n + 1);

  /** Kirim kata pencarian ke server: selalu mulai lagi dari halaman 1. */
  const sendSearch = (value: string) => {
    setQ(value);
    setPage(1);
    countRequest();
  };

  useEffect(() => {
    if (!debounce || input === q) return;
    const timer = setTimeout(() => {
      setQ(input);
      setPage(1);
      setSent((n) => n + 1);
    }, 300);
    // Setiap ketikan baru membatalkan timer sebelumnya.
    return () => clearTimeout(timer);
  }, [input, q, debounce]);
  // Jawaban server disimpan bersama request-nya. Selama request terakhir belum
  // dijawab, tabel dianggap loading — tidak perlu state `loading` terpisah.
  const [res, setRes] = useState<ServerResponse & { request: string }>({
    items: [],
    total: 0,
    request: "",
  });

  const query: ServerQuery = { page, pageSize, sort, q };
  const request = requestUrl(query);
  const loading = res.request !== request;

  useEffect(() => {
    // Abaikan jawaban lama bila user sudah pindah halaman sebelum server menjawab.
    let stale = false;
    const current = { page, pageSize, sort, q };
    fakeServer(current).then((next) => {
      if (!stale) setRes({ ...next, request: requestUrl(current) });
    });
    return () => {
      stale = true;
    };
  }, [page, sort, q]);

  return (
    <div className="space-y-3">
      <Table
        columns={serverColumns}
        data={res.items}
        rowKey="id"
        manual
        loading={loading}
        search={{
          value: input,
          onChange: (e) => {
            setInput(e.target.value);
            if (!debounce) sendSearch(e.target.value);
          },
        }}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
          countRequest();
        }}
        pagination={{
          page,
          pageSize,
          total: res.total,
          onPageChange: (next) => {
            setPage(next);
            countRequest();
          },
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-body-sm font-semibold text-gray-900">Tunda pencarian 300ms</span>
        <Segmented
          label="Tunda pencarian"
          value={debounce}
          onChange={(on) => {
            setDebounce(on);
            // Kirim ketikan yang masih tertunda supaya tabel tidak tertinggal.
            if (!on && input !== q) sendSearch(input);
          }}
          options={onOff}
        />
      </div>

      <div className="space-y-1 rounded-lg bg-gray-900 px-4 py-2.5 font-mono text-xs text-gray-300">
        <p>
          <span className="text-gray-500">Request terkirim: </span>
          <span className="font-bold text-white">{sent}</span>
        </p>
        <p>
          <span className="text-gray-500">Request terakhir: </span>
          {request}
          {debounce && input !== q ? (
            <span className="text-yellow-300"> · menunggu user berhenti mengetik…</span>
          ) : (
            loading && <span className="text-yellow-300"> · menunggu jawaban server…</span>
          )}
        </p>
      </div>
    </div>
  );
}

function DataTable({ cols = columns }: { cols?: TableColumn<Row>[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Key[]>([1]);

  const rows = useMemo(
    () => allRows.filter((r) => r.field1.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <Table
      columns={cols}
      data={rows}
      rowKey="id"
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
      search={{ value: query, onChange: (e) => setQuery(e.target.value) }}
      filter={{}}
      actions={
        <>
          <Button size="s" leftIcon={<Plus />}>
            Tambah Data
          </Button>
          <Button
            size="s"
            theme="orange"
            leftIcon={<TrashBin />}
            disabled={selected.length === 0}
            onClick={() => setSelected([])}
          >
            Hapus Data
          </Button>
        </>
      }
      pagination={{ pageSize: 10 }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Playground: data pengajuan layanan yang jumlahnya bisa dipilih.     */
/* ------------------------------------------------------------------ */

type StatusPengajuan = "Disetujui" | "Diproses" | "Ditolak";

type Pengajuan = {
  id: number;
  nama: string;
  email: string;
  layanan: string;
  tanggal: string;
  /** Tanggal yang sama dalam format ISO, untuk mengurutkan. */
  tanggalIso: string;
  dokumen: string;
  status: StatusPengajuan;
};

const namaDepan = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gilang", "Hana", "Indra", "Joko", "Kartika", "Lukman", "Maya", "Nanda", "Oki", "Putri", "Rizky", "Sari", "Taufik", "Wulan"];
const namaBelakang = ["Saputra", "Santoso", "Lestari", "Anggraini", "Prasetyo", "Rahmawati", "Ramadhan", "Pertiwi", "Kurniawan", "Susanto", "Wijaya", "Hakim", "Permata", "Utami", "Firmansyah"];
const jenisLayanan = ["Pembuatan KTP", "Akta Kelahiran", "Kartu Keluarga", "Surat Pindah", "Akta Kematian", "Surat Keterangan Usaha"];
const statusPengajuan: StatusPengajuan[] = ["Disetujui", "Diproses", "Disetujui", "Ditolak", "Diproses"];

const statusBadge: Record<StatusPengajuan, BadgeVariant> = {
  Disetujui: "success",
  Diproses: "warning",
  Ditolak: "danger",
};

/** Data contoh yang sama setiap kali dibuat, supaya tidak berubah saat halaman dirender ulang. */
function makePengajuan(count: number): Pengajuan[] {
  const start = Date.UTC(2026, 0, 5);
  return Array.from({ length: count }, (_, i) => {
    const depan = namaDepan[i % namaDepan.length];
    const belakang = namaBelakang[(i * 7) % namaBelakang.length];
    const date = new Date(start + i * 86_400_000);
    return {
      id: i + 1,
      nama: `${depan} ${belakang}`,
      email: `${depan}.${belakang}${i + 1}@mail.com`.toLowerCase(),
      layanan: jenisLayanan[(i * 5) % jenisLayanan.length],
      tanggal: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }),
      tanggalIso: date.toISOString(),
      dokumen: `berkas-${String(i + 1).padStart(4, "0")}.png`,
      status: statusPengajuan[i % statusPengajuan.length],
    };
  });
}

const countOptions = [
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 1000, label: "1000" },
];

/** Kolom Playground: pratinjau gambar bisa dimatikan, dan Nama + Email bisa dikelompokkan. */
function pengajuanColumns({
  preview,
  grouped,
  withRowActions,
  actionStyle,
}: {
  preview: boolean;
  grouped: boolean;
  withRowActions: boolean;
  actionStyle: ActionStyle;
}): TableColumn<Pengajuan>[] {
  const nama: TableColumn<Pengajuan> = { key: "nama", header: "Nama", align: "left", emphasis: true, sortable: true, sortResettable: false };
  const email: TableColumn<Pengajuan> = { key: "email", header: "Email", align: "left" };

  return [
    ...(grouped ? [{ key: "pemohon", header: "Pemohon", children: [nama, email] }] : [nama, email]),
    { key: "layanan", header: "Layanan", align: "left", sortable: true, sortResettable: false },
    { key: "tanggal", header: "Tanggal", align: "left", sortable: true, sortResettable: false, sortValue: (row) => new Date(row.tanggalIso).getTime() },
    {
      key: "dokumen",
      header: "Dokumen",
      image: {
        src: (row) => placeholderImage(row.id),
        alt: (row) => `Dokumen ${row.nama}`,
        caption: (row) => row.dokumen,
        preview,
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <Badge variant={statusBadge[row.status]}>{row.status}</Badge>,
    },
    ...(withRowActions
      ? [{ key: "aksi", header: "Aksi", actions: makeActions<Pengajuan>(actionStyle), hideable: false }]
      : []),
  ];
}

function PlaygroundTable({
  count,
  selectable,
  withSearch,
  withFilter,
  theme,
  size,
  withPagination,
  withRowActions,
  actionStyle,
  preview,
  grouped,
}: {
  count: number;
  selectable: boolean;
  withSearch: boolean;
  withFilter: boolean;
  theme: PaginationTheme;
  size: TableSize;
  withPagination: boolean;
  withRowActions: boolean;
  actionStyle: ActionStyle;
  preview: boolean;
  grouped: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Key[]>([]);

  const data = useMemo(() => makePengajuan(count), [count]);
  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return data.filter(
      (r) => r.nama.toLowerCase().includes(q) || r.email.includes(q) || r.layanan.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <Table
      columns={pengajuanColumns({ preview, grouped, withRowActions, actionStyle })}
      data={rows}
      rowKey="id"
      size={size}
      selectable={selectable}
      selectedKeys={selected}
      onSelectionChange={setSelected}
      search={withSearch ? { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Cari nama, email, atau layanan" } : undefined}
      filter={withFilter ? {} : undefined}
      actions={
        <>
          <Button size="s" leftIcon={<Plus />}>
            Tambah Data
          </Button>
          <Button
            size="s"
            theme="orange"
            leftIcon={<TrashBin />}
            disabled={selected.length === 0}
            onClick={() => setSelected([])}
          >
            Hapus Data
          </Button>
        </>
      }
      pagination={withPagination ? { pageSize: 10, theme } : undefined}
    />
  );
}

/** Tabel pesanan size `compact`, lengkap dengan toolbar dan pagination seperti di Figma. */
function OrderTable({ hiddenColumns = [] }: { hiddenColumns?: string[] }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () => orderRows.filter((r) => r.kode.includes(query) || r.customer.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <Table
      columns={orderColumns}
      data={rows}
      rowKey="id"
      size="compact"
      search={{ value: query, onChange: (e) => setQuery(e.target.value) }}
      filter={{ defaultHiddenColumns: hiddenColumns }}
      actions={
        <>
          <Button size="s" leftIcon={<Plus />}>
            Tambah Data
          </Button>
          <Button size="s" theme="orange" leftIcon={<TrashBin />}>
            Hapus Data
          </Button>
        </>
      }
      pagination={{ pageSize: 10 }}
    />
  );
}

export function TablePage() {
  const [selectable, setSelectable] = useState(true);
  const [withSearch, setWithSearch] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [theme, setTheme] = useState<PaginationTheme>("primary");
  const [size, setSize] = useState<TableSize>("normal");
  const [withPagination, setWithPagination] = useState(true);
  const [withRowActions, setWithRowActions] = useState(true);
  const [actionIconSize, setActionIconSize] = useState<TableActionIconSize>("base");
  // Hanya nilai yang bukan bawaan, supaya kode di Penggunaan tetap ringkas.
  const actionStyle: ActionStyle = {
    ...(actionIconSize !== "base" && { iconSize: actionIconSize }),
  };
  const actionStyleCode = Object.entries(actionStyle)
    .map(([prop, value]) => `, ${prop}: '${value}'`)
    .join("");
  const [withPreview, setWithPreview] = useState(true);
  const [grouped, setGrouped] = useState(false);
  const [count, setCount] = useState(50);

  return (
    <UsulanPage
      eyebrow="Components · Table"
      title="Table"
      description="Tabel data dengan toolbar pencarian, filter, aksi, pengurutan kolom, seleksi baris, dan pagination."
      toc={toc}
    >
      <FlowSection id="table" title="Table">
        <Lead>
          Table butuh dua hal: <Hl>data</Hl> (isi tabel) dan <Hl>columns</Hl> (kolom apa saja
          yang tampil). Sisanya bisa dinyalakan sesuai kebutuhan:
        </Lead>
        <Points
          items={[
            <><Hl>search</Hl> menampilkan kotak pencarian di kiri atas.</>,
            <><Hl>filter</Hl> menampilkan tombol "Filter Data" untuk memilih kolom yang tampil.</>,
            <><Hl>actions</Hl> diisi tombol di kanan atas, mis. "Tambah Data".</>,
            <><Hl>selectable</Hl> menambahkan checkbox di tiap baris.</>,
            <><Hl>pagination</Hl> membagi data per halaman.</>,
            <>Klik judul kolom yang <Hl>sortable</Hl> untuk mengurutkan.</>,
          ]}
        />
        <Lead>
          Bagian-bagiannya memakai komponen yang sudah ada:{" "}
          <Hl><a href="#/form/search">Search</a></Hl>,{" "}
          <Hl><a href="#/components/dropdown">Dropdown</a></Hl>,{" "}
          <Hl><a href="#/components/button">Button</a></Hl>,{" "}
          <Hl><a href="#/form/checkbox">Checkbox</a></Hl>, dan{" "}
          <Hl><a href="#/components/pagination">Pagination</a></Hl>.
        </Lead>

        <DataTable />

        <SectionCode>
          {"import { Table, type TableColumn } from '@ceplok-ui/design-kit-react'\n\n"}
          {"const columns: TableColumn<Row>[] = [\n"}
          {"  { key: 'field1', header: 'Field 1', "}
          <H>sortable</H>
          {": true, emphasis: true },\n"}
          {"  { key: 'status', header: 'Field 4', "}
          <H>cell</H>
          {": (row) => <Badge variant={row.status}>{row.field1}</Badge> },\n"}
          {"]\n\n"}
          {"<Table\n"}
          {"  columns={columns}\n"}
          {"  data={rows}\n"}
          {'  rowKey="id"\n'}
          {"  "}
          <H>selectable</H>
          {"\n"}
          {"  "}
          <H>search</H>
          {"={{ value: query, onChange: (e) => setQuery(e.target.value) }}\n"}
          {"  "}
          <H>filter</H>
          {"={{}}\n"}
          {"  "}
          <H>actions</H>
          {"={<Button size=\"s\" leftIcon={<Plus />}>Tambah Data</Button>}\n"}
          {"  "}
          <H>pagination</H>
          {"={{ pageSize: 10 }}\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="states" title="States">
        <Points
          items={[
            <><Hl>loading</Hl>: pasang saat data sedang diambil. Isi tabel diganti ikon memuat.</>,
            <><Hl>emptyText</Hl>: tulisan yang tampil kalau data kosong. Bawaannya "Tidak ada data".</>,
          ]}
        />

        <div className="mb-4 grid gap-5 lg:grid-cols-2">
          <Demo label="Loading">
            <Table columns={columns.slice(0, 3)} data={[]} rowKey="id" loading />
          </Demo>
          <Demo label="Empty">
            <Table columns={columns.slice(0, 3)} data={[]} rowKey="id" />
          </Demo>
        </div>

        <SectionCode>
          {"<Table columns={columns} data={rows} rowKey=\"id\" "}
          <H>loading</H>
          {" />\n"}
          {"<Table columns={columns} data={[]} rowKey=\"id\" "}
          <H>emptyText</H>
          {'="Belum ada pengajuan" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="size" title="Size">
        <Points
          items={[
            <><Hl>normal</Hl> (bawaan): header abu-abu dengan huruf kapital, dan ada garis di antara baris.</>,
            <><Hl>compact</Hl>: tampilan lebih bersih. Header putih tanpa huruf kapital, garis antarbaris tetap ada, teks lebih gelap, dan gambar kecil berbentuk kotak tanpa teks di bawahnya.</>,
          ]}
        />

        <div className="mb-4 grid gap-5">
          <Demo label="Normal">
            <Table columns={columns} data={allRows.slice(0, 3)} rowKey="id" selectable />
          </Demo>
          <Demo label="Compact">
            <OrderTable />
          </Demo>
        </div>

        <SectionCode>
          {"<Table columns={columns} data={rows} rowKey=\"id\" "}
          <H>size</H>
          {'="compact" />\n\n'}
          {"// Gambar di compact otomatis kotak 32px, caption hanya tampil di pratinjau\n"}
          {"{ key: 'gambar', header: 'Gambar', image: { src: (row) => row.fotoUrl } }"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="aksi" title="Tombol aksi">
        <Lead>
          Untuk tombol seperti Ubah, Unduh, atau Hapus di tiap baris, buat satu kolom lalu isi{" "}
          <Hl>actions</Hl>. Setiap tombol cukup diisi:
        </Lead>
        <Points
          items={[
            <><Hl>icon</Hl>: ikon tombolnya.</>,
            <><Hl>label</Hl>: judul tombol. Muncul sebagai tooltip saat kursor diarahkan ke tombol.</>,
            <><Hl>href</Hl> untuk pindah halaman, <b>atau</b> <Hl>onClick</Hl> untuk menjalankan fungsi.</>,
            <><Hl>theme</Hl> (opsional): warna tombol, mis. <Hl>"yellow"</Hl> atau <Hl>"red"</Hl>.</>,
          ]}
        />
        <Lead>Opsi tambahan kalau dibutuhkan:</Lead>
        <Points
          items={[
            <><Hl>showLabel</Hl>: judul ditulis di samping ikon, bukan hanya tooltip.</>,
            <><Hl>disabled</Hl>: tombol tampil tapi tidak bisa diklik.</>,
            <><Hl>hidden</Hl>: tombol tidak tampil sama sekali.</>,
          ]}
        />
        <Lead>
          Semua isian di atas boleh berupa fungsi <Hl>(row) =&gt; ...</Hl> kalau nilainya
          berbeda per baris. Di contoh ini tombol Hapus di baris pertama dinonaktifkan.
        </Lead>

        <Table columns={actionColumns} data={pendudukRows} rowKey="id" />

        <SectionCode>
          {"{\n"}
          {"  key: 'aksi',\n"}
          {"  header: 'Aksi',\n"}
          {"  "}
          <H>actions</H>
          {": [\n"}
          {"    { key: 'detail', icon: <Eye />, label: 'Lihat detail', showLabel: true, "}
          <H>href</H>
          {": (row) => `/penduduk/${row.id}` },\n"}
          {"    { key: 'hapus', icon: <TrashBin />, label: 'Hapus', theme: 'red',\n"}
          {"      "}
          <H>onClick</H>
          {": (row) => hapus(row.id),\n"}
          {"      "}
          <H>disabled</H>
          {": (row) => row.id === 1 },\n"}
          {"  ],\n"}
          {"}"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="posisi" title="Posisi judul">
        <Lead>
          Judul kolom bisa diletakkan di kiri, tengah, atau kanan lewat <Hl>headerAlign</Hl>.
          Bawaannya rata kiri.
        </Lead>
        <Points
          items={[
            <><Hl>headerAlign</Hl>: posisi judul kolom, <Hl>"left"</Hl>, <Hl>"center"</Hl>, atau <Hl>"right"</Hl>.</>,
            <><Hl>align</Hl>: posisi isi sel. Kalau <Hl>headerAlign</Hl> tidak diisi, judul ikut <Hl>align</Hl>.</>,
            <>Kalau dua-duanya tidak diisi, judul rata kiri dan isi sel rata tengah.</>,
            <>Judul induk di kolom bertingkat bawaannya di tengah, karena membawahi beberapa kolom. Bisa diubah dengan <Hl>headerAlign</Hl> juga.</>,
          ]}
        />

        <Table columns={alignColumns} data={pendudukRows.slice(0, 3)} rowKey="id" />

        <SectionCode>
          {"{ key: 'nama', header: 'Kiri (bawaan)', align: 'left' },\n"}
          {"{ key: 'tempatLahir', header: 'Tengah', "}
          <H>headerAlign</H>
          {": 'center' },\n"}
          {"{ key: 'telepon', header: 'Kanan', "}
          <H>align</H>
          {": 'right' }, // judul ikut align"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="gambar" title="Gambar">
        <Lead>
          Untuk menampilkan gambar di sel, isi <Hl>image</Hl> pada kolom. Tidak perlu menulis{" "}
          <Hl>&lt;img&gt;</Hl> sendiri. Isiannya:
        </Lead>
        <Points
          items={[
            <><Hl>src</Hl>: alamat gambar dari tiap baris, mis. <Hl>(row) =&gt; row.fotoUrl</Hl>.</>,
            <><Hl>alt</Hl> (opsional): keterangan gambar untuk pembaca layar.</>,
            <><Hl>caption</Hl> (opsional): teks di bawah gambar, mis. nama file. Di size <Hl>compact</Hl> teks ini tidak tampil di tabel, hanya saat pratinjau dibuka.</>,
            <><Hl>preview</Hl> (opsional): bawaannya <Hl>true</Hl>. Klik gambar untuk melihatnya besar di atas latar gelap. Tutup dengan tombol X, tombol Esc, atau klik di luar gambar.</>,
            <>Isi <Hl>preview: false</Hl> kalau gambarnya cukup tampil kecil dan tidak perlu bisa diklik.</>,
          ]}
        />
        <Lead>Klik gambar di kolom "Dengan pratinjau" untuk mencobanya.</Lead>

        <Table columns={imageColumns} data={allRows.slice(0, 3)} rowKey="id" />

        <SectionCode>
          {"{\n"}
          {"  key: 'foto',\n"}
          {"  header: 'Foto',\n"}
          {"  "}
          <H>image</H>
          {": {\n"}
          {"    src: (row) => row.fotoUrl,\n"}
          {"    alt: (row) => row.nama,\n"}
          {"    caption: (row) => row.namaFile,\n"}
          {"    "}
          <H>preview</H>
          {": false, // hapus baris ini kalau ingin bisa diklik\n"}
          {"  },\n"}
          {"}"}
        </SectionCode>

        <Lead>
          Kalau isi sel perlu disusun sendiri dengan <Hl>cell</Hl>, pakai komponen{" "}
          <Hl>TableImage</Hl> supaya pratinjaunya tetap ada:
        </Lead>

        <SectionCode>
          {"import { TableImage } from '@ceplok-ui/design-kit-react'\n\n"}
          {"cell: (row) => (\n"}
          {"  <div className=\"flex items-center gap-2\">\n"}
          {"    <"}
          <H>TableImage</H>
          {" src={row.fotoUrl} alt={row.nama} />\n"}
          {"    {row.nama}\n"}
          {"  </div>\n"}
          {")"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="bertingkat" title="Kolom bertingkat">
        <Lead>
          Satu judul bisa membawahi beberapa kolom, mis. judul "Nama" di atas "Nama Awal" dan
          "Nama Akhir". Caranya, isi <Hl>children</Hl> pada kolom induk:
        </Lead>
        <Points
          items={[
            <>Kolom induk cukup diisi <Hl>key</Hl>, <Hl>header</Hl>, dan <Hl>children</Hl>. Kolom induk tidak punya isi sendiri.</>,
            <>Kolom anak ditulis seperti kolom biasa: bisa <Hl>sortable</Hl>, <Hl>cell</Hl>, <Hl>actions</Hl>, <Hl>image</Hl>, dan lainnya.</>,
            <>Kolom tanpa <Hl>children</Hl> otomatis setinggi seluruh header, seperti "Email" di contoh ini.</>,
            <>Di Filter Data, grup tampil sebagai satu pilihan. Menyembunyikannya berarti seluruh anaknya ikut tersembunyi.</>,
          ]}
        />

        <Table columns={groupColumns} data={pendudukRows} rowKey="id" selectable />

        <SectionCode>
          {"const columns: TableColumn<Penduduk>[] = [\n"}
          {"  {\n"}
          {"    key: 'nama',\n"}
          {"    header: 'Nama',\n"}
          {"    "}
          <H>children</H>
          {": [\n"}
          {"      { key: 'namaAwal', header: 'Nama Awal', sortable: true },\n"}
          {"      { key: 'namaAkhir', header: 'Nama Akhir', sortable: true },\n"}
          {"    ],\n"}
          {"  },\n"}
          {"  {\n"}
          {"    key: 'kelahiran',\n"}
          {"    header: 'Kelahiran',\n"}
          {"    "}
          <H>children</H>
          {": [\n"}
          {"      { key: 'tempatLahir', header: 'Tempat' },\n"}
          {"      { key: 'tanggalLahir', header: 'Tanggal' },\n"}
          {"    ],\n"}
          {"  },\n"}
          {"  { key: 'email', header: 'Email' },\n"}
          {"]"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="sort" title="Sorting">
        <Lead>
          Kolom hanya bisa diurutkan kalau diberi <Hl>sortable: true</Hl>. Kolom tanpa itu tidak
          bisa diklik. Bawaannya, klik judul kolom berulang kali akan mengurutkan:
        </Lead>
        <Points items={[<>A ke Z (naik), lalu Z ke A (turun), lalu kembali ke urutan awal.</>]} />
        <Lead>Kalau perlu cara lain, atur per kolom:</Lead>
        <Points
          items={[
            <><Hl>sortDirections</Hl>: urutan klik. Isi <Hl>["desc", "asc"]</Hl> supaya klik pertama langsung dari yang terbaru atau terbesar.</>,
            <><Hl>sortResettable: false</Hl>: tidak kembali ke urutan awal, hanya bolak-balik naik dan turun.</>,
            <><Hl>sortValue</Hl>: nilai yang dipakai untuk mengurutkan, mis. urutkan tanggal berdasarkan angka, bukan teksnya.</>,
            <><Hl>sortFn</Hl>: fungsi pembanding sendiri kalau aturannya lebih rumit.</>,
            <><Hl>sortIcon</Hl>: ganti ikon panah di judul kolom.</>,
          ]}
        />
        <Lead>Pilih nilai urut sesuai jenis datanya:</Lead>
        <Points
          items={[
            <><b>Teks biasa</b> (nama, layanan): tidak perlu <Hl>sortValue</Hl>. Langsung urut A-Z / Z-A.</>,
            <><b>Tanggal</b>: isi <Hl>sortValue</Hl> dengan waktunya, mis. <Hl>new Date(row.tanggal).getTime()</Hl>. Teks seperti "02 Sep 2026" kalau diurutkan sebagai teks hasilnya salah.</>,
            <><b>ID atau angka</b>: isi <Hl>sortValue</Hl> dengan angkanya, supaya 9 jatuh sebelum 10.</>,
          ]}
        />
        <Lead>
          Di contoh ini: Nama memakai cara bawaan, Tanggal Lahir mulai dari yang terbaru dan tidak
          kembali ke urutan awal, Tempat Lahir memakai ikon sendiri, dan Email tidak bisa
          diurutkan.
        </Lead>

        <Table columns={sortColumns} data={pendudukRows} rowKey="id" />

        <SectionCode>
          {"// Bawaan\n"}
          {"{ key: 'nama', header: 'Nama', "}
          <H>sortable</H>
          {": true }\n\n"}
          {"// Mulai dari terbaru, tidak kembali ke urutan awal\n"}
          {"{ key: 'tanggalLahir', header: 'Tanggal Lahir', sortable: true,\n"}
          {"  "}
          <H>sortDirections</H>
          {": ['desc', 'asc'],\n"}
          {"  "}
          <H>sortResettable</H>
          {": false,\n"}
          {"  "}
          <H>sortValue</H>
          {": (row) => new Date(row.tanggalLahir).getTime() }\n\n"}
          {"// Tidak bisa diurutkan: cukup tanpa sortable\n"}
          {"{ key: 'email', header: 'Email' }"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="filter" title="Filter kolom">
        <Lead>
          Tombol <Hl>Filter Data</Hl> dipakai untuk memilih kolom mana saja yang ditampilkan.
          Klik tombolnya, lalu centang atau hapus centang kolom di daftar.
        </Lead>
        <Points
          items={[
            <>Pasang <Hl>filter={"{{}}"}</Hl> untuk menampilkan tombolnya. Semua kolom otomatis masuk daftar.</>,
            <><Hl>defaultHiddenColumns</Hl>: kolom yang disembunyikan saat tabel pertama tampil. Isi dengan <Hl>key</Hl> kolomnya.</>,
            <><Hl>hideable: false</Hl> di kolom: kolom itu selalu tampil dan tidak bisa dimatikan, mis. kolom aksi.</>,
            <>Kolom terakhir yang masih tampil tidak bisa dimatikan, supaya tabel tidak kosong.</>,
            <>Kalau pilihan kolom perlu disimpan, mis. ke localStorage, pakai <Hl>hiddenColumns</Hl> dan <Hl>onHiddenColumnsChange</Hl>.</>,
          ]}
        />
        <Lead>
          Di contoh ini kolom Payment Mode disembunyikan dari awal, dan kolom Action tidak bisa
          dimatikan. Klik Filter Data untuk mencobanya.
        </Lead>

        <OrderTable hiddenColumns={["pembayaran"]} />

        <SectionCode>
          {"const columns: TableColumn<Order>[] = [\n"}
          {"  // ...\n"}
          {"  { key: 'aksi', header: 'Action', actions: [...], "}
          <H>hideable</H>
          {": false },\n"}
          {"]\n\n"}
          {"<Table\n"}
          {"  columns={columns}\n"}
          {"  data={rows}\n"}
          {'  rowKey="id"\n'}
          {"  "}
          <H>filter</H>
          {"={{ "}
          <H>defaultHiddenColumns</H>
          {": ['pembayaran'] }}\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="scroll" title="Scroll">
        <Lead>
          Kalau kolomnya banyak, tabel otomatis bisa digeser ke samping. Tidak perlu pengaturan
          apa pun.
        </Lead>
        <Points
          items={[
            <>Teks di sel bawaannya tidak turun baris, supaya tabel melebar dan bisa digeser.</>,
            <>Kalau kolom boleh turun baris, mis. alamat panjang, beri <Hl>wrap: true</Hl>.</>,
          ]}
        />
        <Lead>Geser tabel di bawah ke kanan untuk mencobanya.</Lead>

        <Table
          columns={wideColumns}
          data={pendudukRows}
          rowKey="id"
          selectable
        />

        <SectionCode>
          {"<Table\n"}
          {"  columns={columns}\n"}
          {"  data={rows}\n"}
          {'  rowKey="id"\n'}
          {"  selectable\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="otomatis" title="Kolom otomatis">
        <Lead>
          Kamu cukup kirim <Hl>data</Hl> tanpa <Hl>columns</Hl>, dan tabelnya langsung jadi.
          Table membaca baris pertama data kamu: setiap field jadi satu kolom, dan nama field
          jadi judul kolom.
        </Lead>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <Box
            title="Nama field → judul kolom"
            items={[
              <><Hl>namaLayanan</Hl> → "Nama layanan"</>,
              <><Hl>jenis_layanan</Hl> → "Jenis layanan"</>,
              <><Hl>estimasiHari</Hl> → "Estimasi hari"</>,
            ]}
          />
          <Box
            title="Nilai → isi sel (apa adanya)"
            items={[
              <>Teks dan angka → tampil biasa</>,
              <><Hl>true</Hl> / <Hl>false</Hl> → tulisan "true" / "false"</>,
              <>Kosong atau <Hl>null</Hl> → "—"</>,
            ]}
          />
        </div>

        <Table data={autoRows} rowKey="id" size="compact" />

        <SectionCode>
          {"const data = [\n"}
          {"  { id: 1, namaLayanan: 'Pembuatan KTP', jenis_layanan: 'Kependudukan', estimasiHari: 3, aktif: true },\n"}
          {"]\n\n"}
          {"// Tanpa columns — tabel di atas jadi dari sini saja\n"}
          {"<Table "}
          <H>data</H>
          {'={data} rowKey="id" />'}
        </SectionCode>

        <div className="mt-6 mb-4 grid gap-4 md:grid-cols-2">
          <Box
            title="Cocok untuk"
            items={[
              "Mengecek isi respons API dengan cepat",
              "Halaman admin atau debug internal",
              "Prototipe sebelum desain tabelnya final",
            ]}
          />
          <Box
            title="Jangan untuk halaman yang dilihat user, karena"
            items={[
              <>Semua field ikut tampil, termasuk <Hl>id</Hl> atau field internal</>,
              "Tidak bisa diurutkan dan tidak ada tombol aksi",
              'Judul dan isi tidak bisa diubah, mis. "true" tidak bisa jadi Badge "Aktif"',
              "Hanya field di baris pertama yang jadi kolom",
            ]}
          />
        </div>

        <Lead>
          Untuk halaman yang dilihat user, tulis <Hl>columns</Hl> sendiri. Pilih field yang mau
          ditampilkan, beri judul, dan atur isinya:
        </Lead>

        <SectionCode>
          {"const columns: TableColumn<Layanan>[] = [\n"}
          {"  { key: 'namaLayanan', header: 'Nama Layanan', sortable: true },\n"}
          {"  { key: 'estimasiHari', header: 'Estimasi', "}
          <H>cell</H>
          {": (row) => `${row.estimasiHari} hari` },\n"}
          {"  { key: 'aktif', header: 'Status', "}
          <H>cell</H>
          {": (row) => <Badge variant={row.aktif ? 'success' : 'danger'}>{row.aktif ? 'Aktif' : 'Nonaktif'}</Badge> },\n"}
          {"]\n\n"}
          {"<Table "}
          <H>columns</H>
          {'={columns} data={data} rowKey="id" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="server" title="Data server">
        <Lead>
          Ada dua cara memberi data ke Table. Bedanya ada di siapa yang mengurutkan dan
          membagi data per halaman: Table sendiri, atau server.
        </Lead>
        <Points
          items={[
            <><b>Bawaan:</b> kirim <b>semua</b> data sekaligus. Table yang mengurutkan, mencari, dan membagi per halaman.</>,
            <><b><Hl>manual</Hl>:</b> kirim <b>satu halaman</b> saja. Server yang mengurutkan, mencari, dan membagi. Table hanya menampilkan.</>,
          ]}
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Box
            title="Pakai bawaan bila"
            items={[
              "Datanya kurang dari sekitar 1.000 baris.",
              "Semua data sudah ada di browser, mis. dari satu kali fetch.",
              "API tidak mendukung page, sort, atau search.",
            ]}
          />
          <Box
            title="Pakai manual bila"
            items={[
              "Datanya ribuan baris atau lebih.",
              "API sudah mengembalikan data per halaman, mis. ?page=2&size=10.",
              "Data berubah terus, jadi harus selalu diambil yang terbaru.",
            ]}
          />
        </div>

        <p className="mb-2 text-body-sm font-semibold text-gray-900">Yang harus diisi saat memakai manual</p>
        <Points
          items={[
            <>Pasang <Hl>manual</Hl>.</>,
            <>Isi <Hl>data</Hl> dengan baris halaman yang sedang tampil saja, mis. 10 baris.</>,
            <>Isi <Hl>pagination.total</Hl> dengan jumlah seluruh data dari server. Tanpa ini jumlah halamannya salah.</>,
            <>Saat user pindah halaman, <Hl>onPageChange</Hl> dipanggil. Ambil halaman itu dari server.</>,
            <>Saat user klik judul kolom, <Hl>onSortChange</Hl> dipanggil. Ambil data yang sudah diurutkan dari server.</>,
            <>Kirim kata pencarian ke server juga. Table hanya memegang 10 baris, jadi mencari di browser hanya mencari 10 baris itu.</>,
            <>Kembalikan ke halaman 1 setiap kali sort atau pencarian berubah.</>,
            <>Tunda pencarian sekitar 300ms setelah user berhenti mengetik (<i>debounce</i>), supaya tidak mengirim request di setiap huruf.</>,
            <>Pasang <Hl>loading</Hl> selama menunggu jawaban server.</>,
          ]}
        />

        <Demo label="Coba sendiri: 1000 baris di server palsu, jawaban ditunda 0,6 detik">
          <ServerTable />
        </Demo>
        <div className="mt-2 mb-6 text-body-sm text-gray-500">
          <p>Klik halaman, judul kolom, atau ketik di pencarian, lalu lihat kotak hitam di bawah tabel.</p>
          <Points
            items={[
              <>Server hanya mengirim 10 baris setiap kali. Browser tidak pernah memegang 1000 baris.</>,
              <>Matikan <b>Tunda pencarian</b>, lalu ketik "Record 12". Request terkirim naik 9, satu per huruf.</>,
              <>Nyalakan lagi, lalu ketik kata yang sama. Request terkirim hanya naik 1.</>,
            ]}
          />
        </div>

        <SectionCode flush>
          {"import { useEffect, useState } from 'react'\n"}
          {"import { Table, type TableSort } from '@ceplok-ui/design-kit-react'\n\n"}
          {"function PengajuanTable() {\n"}
          {"  const [page, setPage] = useState(1)\n"}
          {"  const [sort, setSort] = useState<TableSort | null>(null)\n"}
          {"  const [input, setInput] = useState('') // isi kotak pencarian\n"}
          {"  const [q, setQ] = useState('')         // kata yang dikirim ke server\n"}
          {"  const [res, setRes] = useState({ items: [], total: 0 })\n"}
          {"  const [loading, setLoading] = useState(true)\n\n"}
          {"  // Tunda 300ms: q baru berubah setelah user berhenti mengetik\n"}
          {"  "}
          <H>useEffect</H>
          {"(() => {\n"}
          {"    const timer = setTimeout(() => { setQ(input); setPage(1) }, 300)\n"}
          {"    return () => clearTimeout(timer)\n"}
          {"  }, [input])\n\n"}
          {"  // Ambil satu halaman setiap kali page, sort, atau q berubah\n"}
          {"  useEffect(() => {\n"}
          {"    const params = new URLSearchParams({ page: String(page), size: '10', q })\n"}
          {"    if (sort) params.set('sort', `${sort.key}:${sort.direction}`)\n\n"}
          {"    setLoading(true)\n"}
          {"    fetch(`/api/pengajuan?${params}`)\n"}
          {"      .then((r) => r.json())\n"}
          {"      .then(setRes) // { items: [...10 baris], total: 1000 }\n"}
          {"      .finally(() => setLoading(false))\n"}
          {"  }, [page, sort, q])\n\n"}
          {"  return (\n"}
          {"    <Table\n"}
          {"      columns={columns}\n"}
          {"      data={res.items}\n"}
          {'      rowKey="id"\n'}
          {"      "}
          <H>manual</H>
          {"\n"}
          {"      "}
          <H>loading</H>
          {"={loading}\n"}
          {"      search={{ value: input, onChange: (e) => setInput(e.target.value) }}\n"}
          {"      sort={sort}\n"}
          {"      "}
          <H>onSortChange</H>
          {"={(next) => { setSort(next); setPage(1) }}\n"}
          {"      pagination={{ page, pageSize: 10, "}
          <H>total</H>
          {": res.total, "}
          <H>onPageChange</H>
          {": setPage }}\n"}
          {"    />\n"}
          {"  )\n"}
          {"}"}
        </SectionCode>

        <div className="mt-6">
          <Box
            title="Kesalahan yang sering terjadi"
            items={[
              <>Lupa mengisi <Hl>total</Hl>: pagination hanya menampilkan 1 halaman.</>,
              <>Lupa memasang <Hl>manual</Hl>: Table mengurutkan ulang 10 baris yang sudah diurutkan server, dan footer menulis "of 10 Data".</>,
              <>Mencari di browser, bukan di server: hasil pencarian hanya dari halaman yang sedang tampil.</>,
              <>Tidak kembali ke halaman 1 setelah mencari: server tetap diminta halaman 8 padahal hasilnya hanya 2 halaman, jadi tabel tampil kosong.</>,
              <>Tidak menunda pencarian: mengetik satu kata mengirim belasan request, dan jawabannya bisa datang tidak berurutan.</>,
            ]}
          />
        </div>

        <h3 className="mt-10 mb-2 text-base font-bold text-gray-900">Kalau datanya sangat banyak</h3>
        <p className="mb-4 text-body-sm text-gray-500">
          Dengan <Hl>manual</Hl>, browser selalu menerima 10 baris, sebanyak apa pun datanya. Mau
          1.000 atau 10 juta baris, frontend tidak jadi lebih berat. Bebannya pindah ke backend, jadi
          yang perlu dijaga ada di sana.
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Box
            title="Dijaga di backend"
            items={[
              <>Pasang index di kolom yang bisa di-sort dan dicari. Tanpa index, database membaca semua baris setiap kali user klik judul kolom.</>,
              <>Hati-hati dengan <Hl>COUNT(*)</Hl> untuk <Hl>total</Hl>. Di tabel jutaan baris ini bisa makan beberapa detik. Simpan di cache atau pakai angka perkiraan.</>,
              <>Halaman jauh makin lambat. <Hl>OFFSET 5000000</Hl> tetap melewati 5 juta baris dulu.</>,
              <>Pencarian <Hl>LIKE '%kata%'</Hl> tidak memakai index. Untuk data besar pakai full-text index atau mesin pencari.</>,
            ]}
          />
          <Box
            title="Dijaga di frontend"
            items={[
              <>Tunda pencarian 300ms, seperti di demo atas.</>,
              <>Jangan memperbesar <Hl>pageSize</Hl>. Tetap 10 sampai 50 baris. Table merender semua baris yang diberikan, jadi 5.000 baris sekaligus akan berat.</>,
              <>Abaikan jawaban lama bila user sudah pindah halaman sebelum server menjawab.</>,
            ]}
          />
        </div>

        <div className="mb-4 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Jumlah data</th>
                <th className="px-4 py-3 font-semibold">Yang disarankan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
              <tr>
                <td className="px-4 py-3 font-semibold whitespace-nowrap text-gray-900">Kurang dari 1.000</td>
                <td className="px-4 py-3">Mode bawaan. Kirim semua data ke Table.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold whitespace-nowrap text-gray-900">Ribuan sampai ratusan ribu</td>
                <td className="px-4 py-3"><Hl>manual</Hl>, index di backend, dan pencarian ditunda.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold whitespace-nowrap text-gray-900">Jutaan</td>
                <td className="px-4 py-3">
                  <Hl>manual</Hl> dengan <i>cursor pagination</i> di backend: "ambil 10 baris setelah id
                  terakhir", bukan "lewati sekian baris". Lihat catatan di bawah.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-body-sm text-gray-500">
          <b className="text-gray-900">Catatan:</b> cursor pagination biasanya tidak mengirim{" "}
          <Hl>total</Hl> dan tidak bisa loncat ke halaman tertentu. Pagination Table butuh{" "}
          <Hl>total</Hl> untuk menggambar nomor halaman, jadi untuk saat ini Table belum cocok dengan
          cursor pagination.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Tabel yang bisa kamu utak-atik lewat pengaturan di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        <Stage maxWidth="max-w-[1024px]">
          <PlaygroundTable
            count={count}
            selectable={selectable}
            withSearch={withSearch}
            withFilter={withFilter}
            theme={theme}
            size={size}
            withPagination={withPagination}
            withRowActions={withRowActions}
            actionStyle={actionStyle}
            preview={withPreview}
            grouped={grouped}
          />
        </Stage>

        <Controls>
          <Control label="Jumlah data">
            <Segmented label="Jumlah data" value={count} onChange={setCount} options={countOptions} />
          </Control>
          <Control label="Size">
            <Segmented label="Pilih size" value={size} onChange={setSize} options={sizeOptions} />
          </Control>
          <Control label="Checkbox baris">
            <Segmented label="Checkbox baris" value={selectable} onChange={setSelectable} options={adaTidakAda} />
          </Control>
          <Control label="Search">
            <Segmented label="Search" value={withSearch} onChange={setWithSearch} options={adaTidakAda} />
          </Control>
          <Control label="Filter">
            <Segmented label="Filter" value={withFilter} onChange={setWithFilter} options={adaTidakAda} />
          </Control>
          <Control label="Kolom aksi">
            <Segmented label="Kolom aksi" value={withRowActions} onChange={setWithRowActions} options={adaTidakAda} />
          </Control>
          {withRowActions && (
            <>
              <Control label="Ukuran ikon aksi">
                <Segmented label="Ukuran ikon aksi" value={actionIconSize} onChange={setActionIconSize} options={actionIconSizeOptions} />
              </Control>
            </>
          )}
          <Control label="Pratinjau gambar">
            <Segmented label="Pratinjau gambar" value={withPreview} onChange={setWithPreview} options={onOff} />
          </Control>
          <Control label="Kolom bertingkat">
            <Segmented label="Kolom bertingkat" value={grouped} onChange={setGrouped} options={onOff} />
          </Control>
          <Control label="Pagination">
            <Segmented label="Pagination" value={withPagination} onChange={setWithPagination} options={adaTidakAda} />
          </Control>
          {withPagination && (
            <Control label="Warna pagination">
              <Segmented
                label="Pilih warna pagination"
                value={theme}
                onChange={(value) => setTheme(value as PaginationTheme)}
                options={themeOptions}
              />
            </Control>
          )}
        </Controls>

      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Kode ini mengikuti pengaturan di Playground. Ubah pengaturannya, kodenya ikut berubah.
          Pengaturan yang masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Badge, Button, Table, type TableColumn } from '@ceplok-ui/design-kit-react'\n"}
          {"import { Plus } from 'flowbite-react-icons/outline'\n"}
          {withRowActions && "import { Download, Edit, Printer } from 'flowbite-react-icons/solid'\n"}
          {"\n"}
          {"const columns: TableColumn<Pengajuan>[] = [\n"}
          {grouped ? (
            <>
              {"    { key: 'pemohon', header: 'Pemohon', "}
              <H>children</H>
              {": [\n"}
              {"        { key: 'nama', header: 'Nama', align: 'left', emphasis: true, sortable: true, sortResettable: false },\n"}
              {"        { key: 'email', header: 'Email', align: 'left' },\n"}
              {"    ] },\n"}
            </>
          ) : (
            <>
              {"    { key: 'nama', header: 'Nama', align: 'left', emphasis: true, sortable: true, sortResettable: false },\n"}
              {"    { key: 'email', header: 'Email', align: 'left' },\n"}
            </>
          )}
          {"    { key: 'layanan', header: 'Layanan', align: 'left', sortable: true, sortResettable: false },\n"}
          {"    { key: 'tanggal', header: 'Tanggal', align: 'left', sortable: true, sortResettable: false,\n"}
          {"        sortValue: (row) => new Date(row.tanggalIso).getTime() },\n"}
          {"    { key: 'dokumen', header: 'Dokumen',\n"}
          {"        "}
          <H>image</H>
          {withPreview
            ? ": { src: (row) => row.dokumenUrl, alt: (row) => `Dokumen ${row.nama}`, caption: (row) => row.dokumen } },\n"
            : ": { src: (row) => row.dokumenUrl, alt: (row) => `Dokumen ${row.nama}`, caption: (row) => row.dokumen, preview: false } },\n"}
          {"    { key: 'status', header: 'Status',\n"}
          {"        cell: (row) => <Badge variant={statusBadge[row.status]}>{row.status}</Badge> },\n"}
          {withRowActions && (
            <>
              {"    { key: 'aksi', header: 'Aksi', "}
              <H>actions</H>
              {": [\n"}
              {`        { key: 'ubah', icon: <Edit />, label: 'Ubah', theme: 'yellow'${actionStyleCode}, href: (row) => \`/ubah/\${row.id}\` },\n`}
              {`        { key: 'unduh', icon: <Download />, label: 'Unduh'${actionStyleCode}, onClick: (row) => unduh(row) },\n`}
              {`        { key: 'cetak', icon: <Printer />, label: 'Cetak', theme: 'green'${actionStyleCode}, onClick: () => window.print() },\n`}
              {"    ], "}
              <H>hideable</H>
              {": false },\n"}
            </>
          )}
          {"]\n\n"}
          {"<Table\n"}
          {"    columns={columns}\n"}
          {`    data={rows} // ${count} baris pengajuan\n`}
          {'    rowKey="id"\n'}
          {size !== "normal" && (
            <>
              {"    "}
              <H>size</H>
              {`="${size}"\n`}
            </>
          )}
          {selectable && (
            <>
              {"    "}
              <H>selectable</H>
              {"\n"}
              {"    selectedKeys={selected}\n"}
              {"    onSelectionChange={setSelected}\n"}
            </>
          )}
          {withSearch && (
            <>
              {"    "}
              <H>search</H>
              {"={{ value: query, onChange: (e) => setQuery(e.target.value) }}\n"}
            </>
          )}
          {withFilter && (
            <>
              {"    "}
              <H>filter</H>
              {"={{}}\n"}
            </>
          )}
          {"    actions={<Button size=\"s\" leftIcon={<Plus />}>Tambah Data</Button>}\n"}
          {withPagination && (
            <>
              {"    "}
              <H>pagination</H>
              {theme === "primary"
                ? "={{ pageSize: 10 }}\n"
                : `={{ pageSize: 10, theme: '${theme}' }}\n`}
            </>
          )}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Semua pengaturan yang bisa dipakai, beserta tipe dan nilai bawaannya. Yang pertama
          dipasang langsung di <Hl>&lt;Table /&gt;</Hl>.
        </Lead>
        <PropsTable rows={tableProps} minWidth="52rem" />

        <p className="mt-10 mb-6 text-body-sm text-gray-500">
          Pengaturan tiap kolom, di dalam array <Hl>columns</Hl>.
        </p>
        <PropsTable rows={columnProps} minWidth="46rem" />

        <p className="mt-10 mb-6 text-body-sm text-gray-500">
          Pengaturan tiap tombol, di dalam array <Hl>actions</Hl> milik kolom.
        </p>
        <PropsTable rows={actionProps} minWidth="46rem" />

        <p className="mt-10 mb-6 text-body-sm text-gray-500">
          Pengaturan di dalam <Hl>image</Hl> milik kolom. Untuk komponen <Hl>TableImage</Hl>,
          isiannya sama tapi berupa nilai langsung, bukan fungsi.
        </p>
        <PropsTable rows={imageProps} minWidth="46rem" />

        <p className="mt-10 mb-6 text-body-sm text-gray-500">
          Pengaturan di dalam <Hl>filter</Hl>.
        </p>
        <PropsTable rows={filterProps} minWidth="46rem" />

        <p className="mt-10 mb-6 text-body-sm text-gray-500">
          Pengaturan di dalam <Hl>pagination</Hl>.
        </p>
        <PropsTable rows={paginationProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
