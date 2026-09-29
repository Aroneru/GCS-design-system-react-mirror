import { useMemo, useState, type Key, type ReactNode } from "react";
import { Plus } from "flowbite-react-icons/outline";
import { Download, Edit, Eye, Printer, TrashBin } from "flowbite-react-icons/solid";
import {
  Badge,
  Button,
  Table,
  type BadgeVariant,
  type PaginationTheme,
  type TableColumn,
  type TableRowAction,
  type TableSize,
} from "../../../lib";
import { asset } from "../../asset";
import { adaTidakAda } from "../../usulanOptions";
import { PropsTable, type PropRow } from "../../PropsTable";
import { Demo, H, Segmented } from "../../pageKit";
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
 * Dibuat generik supaya bisa dipakai tabel penduduk di bawah juga.
 */
const makeActions = <T extends { id: number }>(): TableRowAction<T>[] => [
  { key: "ubah", icon: <Edit />, label: "Ubah", theme: "yellow", href: (r) => `#/ubah/${r.id}` },
  { key: "unduh", icon: <Download />, label: "Unduh", onClick: (r) => console.log("unduh", r) },
  { key: "cetak", icon: <Printer />, label: "Cetak", theme: "green", onClick: () => window.print() },
];

const rowActions = makeActions<Row>();

const columns: TableColumn<Row>[] = [
  { key: "field1", header: "Field 1", sortable: true, emphasis: true, sortValue: (r) => r.id },
  { key: "field2", header: "Field 2", sortable: true, sortValue: (r) => r.id },
  {
    key: "file",
    header: "Field 3",
    sortable: true,
    image: {
      src: (row) => placeholderImage(row.id),
      alt: (row) => row.file,
      caption: (row) => row.file,
    },
  },
  {
    key: "status",
    header: "Field 4",
    sortable: true,
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
    // Data contoh: tanggal lahir naik seiring id.
    sortValue: (row) => row.id,
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
      { key: "detail", icon: <Eye />, label: "Lihat detail", showLabel: true, variant: "outline", tone: "light", href: (r) => `#/penduduk/${r.id}` },
      { key: "hapus", icon: <TrashBin />, label: "Hapus", theme: "red", disabled: (r) => r.id === 1, onClick: (r) => console.log("hapus", r) },
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
  { key: "kode", header: "ID" },
  {
    key: "gambar",
    header: "Gambar",
    align: "left",
    sortable: true,
    sortValue: (row) => row.id,
    image: { src: (row) => placeholderImage(row.id), alt: (row) => `Produk ${row.kode}` },
  },
  { key: "customer", header: "Customer", align: "left", sortable: true },
  { key: "tanggal", header: "Date", align: "left", sortable: true, sortValue: (row) => row.id },
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
    sortable: true,
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
  { value: "purple", label: "Purple" },
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
  ["theme", "ButtonTheme", "primary", "Warna tombol, mis. `\"yellow\"`, `\"green\"`, `\"red\"`."],
  ["variant", '"filled" | "outline"', "filled", "Tombol berisi warna atau hanya garis tepi."],
  ["tone", "ButtonTone", "bright", "Terang-gelapnya warna tombol."],
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

/** Penyorot di paragraf berlatar terang — `H` yang primary-300 terlalu pucat di sini. */
const Hl = ({ children }: { children: ReactNode }) => (
  <span className="text-primary-500">{children}</span>
);

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
            theme="red"
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
}: {
  preview: boolean;
  grouped: boolean;
  withRowActions: boolean;
}): TableColumn<Pengajuan>[] {
  const nama: TableColumn<Pengajuan> = { key: "nama", header: "Nama", align: "left", emphasis: true, sortable: true };
  const email: TableColumn<Pengajuan> = { key: "email", header: "Email", align: "left" };

  return [
    ...(grouped ? [{ key: "pemohon", header: "Pemohon", children: [nama, email] }] : [nama, email]),
    { key: "layanan", header: "Layanan", align: "left", sortable: true },
    // Tanggal dibuat berurutan dengan id, jadi id cukup sebagai nilai urut.
    { key: "tanggal", header: "Tanggal", align: "left", sortable: true, sortValue: (row) => row.id },
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
      sortable: true,
      cell: (row) => <Badge variant={statusBadge[row.status]}>{row.status}</Badge>,
    },
    ...(withRowActions
      ? [{ key: "aksi", header: "Aksi", actions: makeActions<Pengajuan>(), hideable: false }]
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
      columns={pengajuanColumns({ preview, grouped, withRowActions })}
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
            theme="red"
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
          <Button size="s" theme="red" leftIcon={<TrashBin />}>
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
          Bawaannya, kamu kirim <b>semua</b> data sekaligus, lalu Table sendiri yang mengurutkan
          dan membaginya per halaman. Kalau datanya besar dan diambil per halaman dari server
          (API), pasang <Hl>manual</Hl>. Caranya:
        </Lead>
        <Points
          items={[
            <>Pasang <Hl>manual</Hl>.</>,
            <>Isi <Hl>data</Hl> dengan baris halaman yang sedang tampil saja, mis. 10 baris.</>,
            <>Isi <Hl>pagination.total</Hl> dengan jumlah seluruh data dari server, supaya jumlah halamannya benar.</>,
            <>Saat user pindah halaman, <Hl>onPageChange</Hl> dipanggil. Ambil data halaman itu dari server.</>,
            <>Saat user klik judul kolom, <Hl>onSortChange</Hl> dipanggil. Ambil data yang sudah diurutkan dari server.</>,
            <>Pasang <Hl>loading</Hl> selama menunggu respons.</>,
          ]}
        />

        <SectionCode flush>
          {"<Table\n"}
          {"  columns={columns}\n"}
          {"  data={response.items}\n"}
          {'  rowKey="id"\n'}
          {"  "}
          <H>manual</H>
          {"\n"}
          {"  loading={isFetching}\n"}
          {"  sort={sort}\n"}
          {"  onSortChange={setSort}\n"}
          {"  pagination={{ page, pageSize: 10, "}
          <H>total</H>
          {": response.total, onPageChange: setPage }}\n"}
          {"/>"}
        </SectionCode>
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
              {"        { key: 'nama', header: 'Nama', align: 'left', emphasis: true, sortable: true },\n"}
              {"        { key: 'email', header: 'Email', align: 'left' },\n"}
              {"    ] },\n"}
            </>
          ) : (
            <>
              {"    { key: 'nama', header: 'Nama', align: 'left', emphasis: true, sortable: true },\n"}
              {"    { key: 'email', header: 'Email', align: 'left' },\n"}
            </>
          )}
          {"    { key: 'layanan', header: 'Layanan', align: 'left', sortable: true },\n"}
          {"    { key: 'tanggal', header: 'Tanggal', align: 'left', sortable: true,\n"}
          {"        sortValue: (row) => new Date(row.tanggalIso).getTime() },\n"}
          {"    { key: 'dokumen', header: 'Dokumen',\n"}
          {"        "}
          <H>image</H>
          {withPreview
            ? ": { src: (row) => row.dokumenUrl, alt: (row) => `Dokumen ${row.nama}`, caption: (row) => row.dokumen } },\n"
            : ": { src: (row) => row.dokumenUrl, alt: (row) => `Dokumen ${row.nama}`, caption: (row) => row.dokumen, preview: false } },\n"}
          {"    { key: 'status', header: 'Status', sortable: true,\n"}
          {"        cell: (row) => <Badge variant={statusBadge[row.status]}>{row.status}</Badge> },\n"}
          {withRowActions && (
            <>
              {"    { key: 'aksi', header: 'Aksi', "}
              <H>actions</H>
              {": [\n"}
              {"        { key: 'ubah', icon: <Edit />, label: 'Ubah', theme: 'yellow', href: (row) => `/ubah/${row.id}` },\n"}
              {"        { key: 'unduh', icon: <Download />, label: 'Unduh', onClick: (row) => unduh(row) },\n"}
              {"        { key: 'cetak', icon: <Printer />, label: 'Cetak', theme: 'green', onClick: () => window.print() },\n"}
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
