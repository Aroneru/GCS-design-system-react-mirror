import {
  Fragment,
  useMemo,
  useState,
  type HTMLAttributeAnchorTarget,
  type HTMLAttributes,
  type Key,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AdjustmentsHorizontal,
  ChevronDown,
  ChevronUp,
  Close,
} from "flowbite-react-icons/outline";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Dropdown } from "./Dropdown";
import { Pagination, type PaginationTheme } from "./Pagination";
import { Search, type SearchProps } from "./Search";
import { Spinner } from "./Spinner";

export type TableAlign = "left" | "center" | "right";

export type TableSortDirection = "asc" | "desc";

/** Kerapatan baris: `normal` mengikuti Figma, `compact` untuk data padat. */
export type TableSize = "normal" | "compact";

export interface TableSort {
  key: string;
  direction: TableSortDirection;
}

/** Kolom yang menempel saat tabel digulir ke samping. */
export interface TableSticky {
  /** Kolom checkbox dan kolom data pertama menempel di kiri. */
  start?: boolean;
  /** Kolom terakhir — biasanya aksi — menempel di kanan. */
  end?: boolean;
}

/** Warna tombol aksi baris. */
export type TableActionTheme =
  | "primary"
  | "green"
  | "gray"
  | "simaya"
  | "orange"
  | "yellow"
  | "red";

export type TableActionVariant = "filled" | "outline";

export type TableActionTone = "light" | "dark";

/** Ukuran ikon tombol aksi. Kotak tombolnya ikut membesar. */
export type TableActionIconSize = "s" | "base" | "l" | "xl";

/** Kelengkungan sudut tombol aksi. */
export type TableActionRadius = "none" | "s" | "base" | "l" | "full";

/** Ikon sort untuk satu arah; `null` berarti kolom itu sedang tidak mengurutkan. */
export type TableSortIcon = (direction: TableSortDirection | null) => ReactNode;

/**
 * Satu tombol aksi di sel, mis. Ubah / Unduh / Cetak. Nilai yang bergantung
 * pada baris — tujuan, judul, disembunyikan, dinonaktifkan — boleh berupa fungsi.
 */
export interface TableRowAction<T> {
  /** Id unik aksi dalam kolomnya. */
  key: string;
  icon: ReactNode;
  /** Judul tombol: muncul sebagai tooltip dan dibaca pembaca layar. */
  label: string | ((row: T) => string);
  /** Tampilkan judul sebagai teks di samping ikon, bukan hanya tooltip. */
  showLabel?: boolean;
  /** Bawaannya `primary`. */
  theme?: TableActionTheme;
  /** Bawaannya `filled`. */
  variant?: TableActionVariant;
  /** Bawaannya `light`. */
  tone?: TableActionTone;
  /** Ukuran ikon; tombol ikut membesar. Bawaannya `base` (tombol 24px, ikon 16px). */
  iconSize?: TableActionIconSize;
  /** Kelengkungan sudut. Bawaannya `base` (4px). */
  radius?: TableActionRadius;
  /** Tujuan tautan. Bila diisi tombol dirender sebagai `<a>`. */
  href?: string | ((row: T) => string);
  target?: HTMLAttributeAnchorTarget;
  onClick?: (row: T, index: number) => void;
  hidden?: boolean | ((row: T) => boolean);
  disabled?: boolean | ((row: T) => boolean);
}

/** Gambar di sel. Nilai yang bergantung pada baris berupa fungsi. */
export interface TableColumnImage<T> {
  /** Alamat gambar. Kosong atau `null` menampilkan "—". */
  src: (row: T) => string | null | undefined;
  alt?: string | ((row: T) => string);
  /** Teks di bawah gambar kecil, mis. nama file. */
  caption?: (row: T) => ReactNode;
  /** Klik gambar membuka pratinjau besar. Bawaannya `true`. */
  preview?: boolean;
}

/** Satu kolom. `key` sekaligus nama field bawaan yang dibaca dari tiap baris. */
export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  /**
   * Kolom anak. Bila diisi, kolom ini menjadi judul induk yang membentang di
   * atas anak-anaknya, dan hanya `header`, `align`, serta `hideable` yang
   * berlaku. Filter kolom menyembunyikan grup sekaligus, bukan per anak.
   */
  children?: TableColumn<T>[];
  /** Isi sel. Tanpa ini yang ditampilkan `row[key]` apa adanya. */
  cell?: (row: T, index: number) => ReactNode;
  /**
   * Deretan tombol aksi di sel. Diabaikan bila `cell` diisi — untuk tata letak
   * yang lebih bebas, render tombol sendiri di `cell`.
   */
  actions?: TableRowAction<T>[];
  /** Gambar di sel, dengan pratinjau saat diklik. Diabaikan bila `cell` atau `actions` diisi. */
  image?: TableColumnImage<T>;
  /** Menampilkan panah di judul kolom dan membuatnya bisa ditekan untuk mengurutkan. */
  sortable?: boolean;
  /** Nilai pembanding saat mengurutkan. Tanpa ini yang dipakai `row[key]`. */
  sortValue?: (row: T) => string | number;
  /**
   * Pembanding penuh untuk urutan naik; urutan turun membaliknya. Menang atas
   * `sortValue`, untuk urutan yang tidak bisa diwakili satu nilai.
   */
  sortFn?: (a: T, b: T) => number;
  /**
   * Arah yang dilewati tiap kali judul ditekan. Bawaannya `["asc", "desc"]`;
   * `["desc", "asc"]` untuk kolom yang biasanya dibaca terbaru dulu, `["asc"]`
   * bila hanya satu arah yang masuk akal.
   */
  sortDirections?: TableSortDirection[];
  /** Setelah arah terakhir, kembali tanpa urutan. Bawaannya `true`. */
  sortResettable?: boolean;
  /** Ikon sort kolom ini. Menang atas `sortIcon` milik Table. */
  sortIcon?: TableSortIcon;
  /** Posisi isi sel. Bawaannya `center`. */
  align?: TableAlign;
  /**
   * Posisi judul kolom. Bawaannya ikut `align` bila diisi, selain itu `left`.
   * Untuk judul induk kolom bertingkat bawaannya `center`.
   */
  headerAlign?: TableAlign;
  /** Teks sel gelap (gray-900) alih-alih abu-abu — biasanya kolom pertama. */
  emphasis?: boolean;
  /** Lebar kolom, mis. `"12rem"` atau `"20%"`. */
  width?: string;
  /** Lebar minimum kolom. */
  minWidth?: string;
  /**
   * Kolom ini bisa disembunyikan lewat tombol Filter Data. Bawaannya `true`;
   * isi `false` untuk kolom yang harus selalu tampil, mis. nama atau aksi.
   */
  hideable?: boolean;
  /**
   * Mengizinkan teks sel turun baris. Bawaannya tidak, supaya kolom yang
   * banyak membuat tabel melebar dan bisa digulir alih-alih teksnya patah.
   */
  wrap?: boolean;
}

/** Search di kiri toolbar — prop-nya diteruskan utuh ke komponen Search. */
export type TableSearchConfig = Omit<SearchProps, "categories" | "platform">;

/**
 * Tombol "Filter Data": memilih kolom mana yang ditampilkan. Panelnya berisi
 * checkbox untuk tiap kolom teratas (grup dihitung satu).
 */
export interface TableFilterConfig {
  /** Teks tombol. Bawaannya "Filter Data". */
  label?: string;
  /** Judul di atas daftar kolom. Bawaannya "Tampilkan kolom". */
  title?: ReactNode;
  /** `key` kolom yang sedang disembunyikan, bila ingin disimpan sendiri. */
  hiddenColumns?: string[];
  /** Kolom yang disembunyikan saat tabel pertama tampil. */
  defaultHiddenColumns?: string[];
  onHiddenColumnsChange?: (keys: string[]) => void;
}

export interface TablePaginationConfig {
  /** Jumlah baris per halaman. */
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /**
   * Jumlah seluruh data. Wajib bila `manual` — tabel hanya menerima baris
   * halaman yang sedang tampil, jadi total tidak bisa dihitung sendiri.
   */
  total?: number;
  theme?: PaginationTheme;
  /** Teks di kiri pagination. Bawaannya "Memperlihatkan 1-10 of 1000 Data". */
  summary?: (info: { from: number; to: number; total: number }) => ReactNode;
}

export interface TableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Daftar kolom. Bila dikosongkan, kolom dibuat dari field baris pertama
   * `data` dengan judul hasil `camelCase`/`snake_case` → "Title case".
   */
  columns?: TableColumn<T>[];
  data: T[];
  /** Kunci unik tiap baris — nama field atau fungsi. Dipakai juga oleh seleksi. */
  rowKey: keyof T | ((row: T) => Key);

  size?: TableSize;
  sticky?: TableSticky;

  search?: TableSearchConfig;
  filter?: TableFilterConfig;
  /** Isi kanan toolbar, biasanya Button "Tambah Data" dan "Hapus Data". */
  actions?: ReactNode;

  /** Menambahkan kolom checkbox di kiri tiap baris. */
  selectable?: boolean;
  selectedKeys?: Key[];
  defaultSelectedKeys?: Key[];
  onSelectionChange?: (keys: Key[]) => void;

  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** Ikon sort untuk semua kolom yang `sortable`. Bawaannya panah chevron. */
  sortIcon?: TableSortIcon;

  /** Tanpa prop ini tabel tidak memakai pagination dan semua baris tampil. */
  pagination?: TablePaginationConfig;

  /**
   * Pengurutan dan pembagian halaman diurus pemakainya, mis. oleh server.
   * `data` dianggap sudah terurut dan hanya berisi baris halaman aktif.
   */
  manual?: boolean;

  loading?: boolean;
  emptyText?: ReactNode;
}

const aligns: Record<TableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Dua rupa dari Figma. `normal`: header abu-abu berhuruf kapital dan garis
 * antarbaris. `compact`: header putih tanpa garis atas, baris setinggi 64px
 * (`h-16` di sel tabel berlaku sebagai tinggi minimum), teks sel gelap, dan
 * gambar kecil persegi 32px.
 */
const sizes: Record<
  TableSize,
  {
    head: string;
    cell: string;
    headBg: string;
    headText: string;
    border: string;
    /** Warna garis di atas header. */
    headTop: string;
    cellText: string | null;
    thumb?: string;
    check: "default" | "mobile";
  }
> = {
  normal: {
    head: "px-4 py-3",
    cell: "px-4 py-4",
    headBg: "bg-gray-50",
    headText: "text-xs uppercase",
    border: "border-gray-200",
    headTop: "border-t-gray-200",
    cellText: null,
    check: "default",
  },
  compact: {
    head: "h-16 px-4 py-2",
    cell: "h-16 px-4 py-2",
    headBg: "bg-white",
    headText: "text-sm",
    border: "border-gray-200",
    headTop: "border-t-transparent",
    cellText: "text-gray-900",
    thumb: "size-8 rounded-md",
    check: "mobile",
  },
};

/**
 * Ukuran tombol aksi per `iconSize`: kotak untuk tombol ikon saja, tinggi dan
 * padding untuk tombol berjudul, serta ukuran ikonnya. `base` mengikuti Figma.
 */
const actionSizes: Record<TableActionIconSize, { iconOnly: string; labeled: string; icon: string }> =
  {
    s: { iconOnly: "size-5", labeled: "h-5 gap-1 px-1.5 text-xs", icon: "size-3.5" },
    base: { iconOnly: "size-6", labeled: "h-6 gap-1.5 px-2 text-xs", icon: "size-4" },
    l: { iconOnly: "size-8", labeled: "h-8 gap-2 px-3 text-sm", icon: "size-5" },
    xl: { iconOnly: "size-10", labeled: "h-10 gap-2 px-4 text-base", icon: "size-6" },
  };

const actionRadii: Record<TableActionRadius, string> = {
  none: "rounded-none",
  s: "rounded-xs",
  base: "rounded",
  l: "rounded-lg",
  full: "rounded-full",
};

/** Warna tombol aksi baris, terpisah dari Button supaya Table bisa diatur sendiri. */
const actionColors: Record<
  TableActionTheme,
  Record<TableActionTone, Record<TableActionVariant, string>>
> = {
  primary: {
    light: {
      filled: "bg-primary-700 text-white hover:bg-primary-800",
      outline: "border border-primary-700 text-primary-700 hover:bg-primary-50",
    },
    dark: {
      filled: "bg-primary-800 text-white hover:bg-primary-700",
      outline: "border border-primary-800 text-primary-800 hover:bg-primary-50",
    },
  },
  green: {
    light: {
      filled: "bg-green-700 text-white hover:bg-green-800",
      outline: "border border-green-700 text-green-700 hover:bg-green-50",
    },
    dark: {
      filled: "bg-green-800 text-white hover:bg-green-700",
      outline: "border border-green-800 text-green-800 hover:bg-green-50",
    },
  },
  gray: {
    light: {
      filled: "bg-gray-500 text-white hover:bg-gray-700",
      outline: "border border-gray-500 text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    },
    dark: {
      filled: "bg-gray-700 text-white hover:bg-gray-500",
      outline: "border border-gray-700 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    },
  },
  simaya: {
    light: {
      filled: "bg-purple-700 text-white hover:bg-purple-800",
      outline: "border border-purple-700 text-purple-700 hover:bg-purple-50",
    },
    dark: {
      filled: "bg-purple-800 text-white hover:bg-purple-700",
      outline: "border border-purple-800 text-purple-800 hover:bg-purple-50",
    },
  },
  orange: {
    light: {
      filled: "bg-orange-600 text-white hover:bg-orange-700",
      outline: "border border-orange-600 text-orange-600 hover:bg-orange-50",
    },
    dark: {
      filled: "bg-orange-700 text-white hover:bg-orange-800",
      outline: "border border-orange-700 text-orange-700 hover:bg-orange-50",
    },
  },
  // Kuning mengikuti Figma: 400 (#e3a008). Token 700 ke atas sudah cokelat.
  yellow: {
    light: {
      filled: "bg-yellow-400 text-white hover:bg-yellow-500",
      outline: "border border-yellow-400 text-yellow-500 hover:bg-yellow-50",
    },
    dark: {
      filled: "bg-yellow-500 text-white hover:bg-yellow-400",
      outline: "border border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    },
  },
  red: {
    light: {
      filled: "bg-red-700 text-white hover:bg-red-800",
      outline: "border border-red-700 text-red-700 hover:bg-red-50",
    },
    dark: {
      filled: "bg-red-800 text-white hover:bg-red-700",
      outline: "border border-red-800 text-red-800 hover:bg-red-50",
    },
  },
};

/**
 * Posisi judul. Judul induk kolom bertingkat bawaannya di tengah, karena ia
 * menaungi kolom-kolom di bawahnya; judul biasa ikut `align`, lalu kiri.
 */
const headAlignOf = <T,>(column: TableColumn<T>): TableAlign =>
  column.headerAlign ?? (hasChildren(column) ? "center" : (column.align ?? "left"));

/** Tombol sort compact selebar sel, jadi posisinya diatur lewat `justify`. */
const compactSortJustify: Record<TableAlign, string> = {
  left: "justify-between",
  center: "justify-center",
  right: "justify-end",
};

const defaultSortIcon: TableSortIcon = (direction) => {
  const Icon = direction === "asc" ? ChevronUp : ChevronDown;
  return <Icon aria-hidden="true" className="size-3.5 shrink-0" />;
};

/** Nilai aksi yang boleh statis atau per baris. */
const resolve = <T, V>(value: V | ((row: T) => V), row: T): V =>
  typeof value === "function" ? (value as (row: T) => V)(row) : value;

const defaultSummary = ({ from, to, total }: { from: number; to: number; total: number }) => (
  <>
    Memperlihatkan{" "}
    <span className="font-bold text-gray-900">
      {from}-{to}
    </span>{" "}
    of <span className="font-bold text-gray-900">{total} Data</span>
  </>
);

/** Membaca field `key` dari baris tanpa memaksa `T` punya index signature. */
const readField = <T,>(row: T, key: string): unknown => (row as Record<string, unknown>)[key];

/** Nilai mentah sel → sesuatu yang aman dirender React. */
function formatValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** `createdAt` / `created_at` → "Created at". */
function humanize(key: string) {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function compare(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true });
}

const hasChildren = <T,>(column: TableColumn<T>) => Boolean(column.children?.length);

/** Kolom daun — yang benar-benar punya sel — dari susunan kolom bertingkat. */
const flattenColumns = <T,>(columns: TableColumn<T>[]): TableColumn<T>[] =>
  columns.flatMap((column) => (hasChildren(column) ? flattenColumns(column.children!) : [column]));

const depthOf = <T,>(columns: TableColumn<T>[]): number =>
  Math.max(1, ...columns.map((c) => (hasChildren(c) ? 1 + depthOf(c.children!) : 1)));

interface HeadCell<T> {
  column: TableColumn<T>;
  group: boolean;
  colSpan: number;
  rowSpan: number;
  /** Indeks kolom daun pertama yang dinaunginya. */
  leafIndex: number;
}

/**
 * Baris-baris `<thead>`. Judul induk membentang selebar jumlah daunnya; judul
 * daun membentang ke bawah sampai baris terakhir, supaya garis bawah header
 * selalu milik daun.
 */
function buildHeadRows<T>(columns: TableColumn<T>[]): HeadCell<T>[][] {
  const depth = depthOf(columns);
  const rows: HeadCell<T>[][] = Array.from({ length: depth }, () => []);
  let leaf = 0;
  const walk = (list: TableColumn<T>[], level: number) => {
    for (const column of list) {
      if (hasChildren(column)) {
        const cell: HeadCell<T> = { column, group: true, colSpan: 0, rowSpan: 1, leafIndex: leaf };
        rows[level].push(cell);
        walk(column.children!, level + 1);
        cell.colSpan = leaf - cell.leafIndex;
      } else {
        rows[level].push({ column, group: false, colSpan: 1, rowSpan: depth - level, leafIndex: leaf++ });
      }
    }
  };
  walk(columns, 0);
  return rows;
}

export interface TableImageProps {
  src: string;
  alt?: string;
  /** Teks di bawah gambar kecil, mis. nama file. */
  caption?: ReactNode;
  /**
   * Tampilkan `caption` di bawah gambar kecil. Bawaannya `true`; bila `false`
   * caption hanya muncul di pratinjau. Table mematikannya di size `compact`.
   */
  showCaption?: boolean;
  /** Klik gambar membuka pratinjau besar di atas latar gelap. Bawaannya `true`. */
  preview?: boolean;
  /** Kelas gambar kecil untuk ukuran dan sudutnya. Menggantikan bawaan `h-6 w-9 rounded`. */
  className?: string;
}

/**
 * TableImage — gambar kecil di sel beserta pratinjaunya. Dipakai otomatis oleh
 * `column.image`, dan bisa dipakai langsung di `cell` untuk susunan sendiri.
 *
 * Pratinjau memakai `<dialog>` bawaan lewat portal ke `body`, jadi tidak
 * mewarisi gaya sel (teks rata tengah, `nowrap`) dan peramban yang mengurus
 * jebakan fokus serta Escape. Dialog hanya dirender selama terbuka, supaya
 * seratus baris tidak berarti seratus dialog.
 */
export function TableImage({
  src,
  alt = "",
  caption,
  showCaption = true,
  preview = true,
  className,
}: TableImageProps) {
  const [open, setOpen] = useState(false);
  const thumb = (
    // `className` mengganti ukuran bawaan, bukan menambahinya: tanpa
    // tailwind-merge, `size-8` kalah dari `h-6 w-9` di urutan CSS.
    <img src={src} alt={alt} className={cn("object-cover", className ?? "h-6 w-9 rounded")} />
  );

  return (
    <span className="inline-flex flex-col items-center gap-1">
      {preview ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={alt ? `Lihat gambar ${alt}` : "Lihat gambar"}
          className={cn(
            "cursor-zoom-in rounded transition-opacity hover:opacity-80",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
          )}
        >
          {thumb}
        </button>
      ) : (
        thumb
      )}
      {showCaption && caption}

      {open &&
        createPortal(
          <dialog
            ref={(node) => {
              if (node && !node.open) node.showModal();
            }}
            aria-label={alt || "Pratinjau gambar"}
            onCancel={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
            // Klik di latar mengenai `<dialog>` itu sendiri, bukan isinya.
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className={cn(
              "m-auto max-h-none max-w-none overflow-visible bg-transparent p-4",
              "backdrop:bg-gray-900/80 backdrop:backdrop-blur-sm",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup pratinjau"
              className={cn(
                "fixed top-4 right-4 inline-flex size-10 items-center justify-center rounded-full",
                "bg-white/10 text-white transition-colors hover:bg-white/20",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
            >
              <Close aria-hidden="true" className="size-5" />
            </button>
            <figure className="flex flex-col items-center gap-3">
              <img
                src={src}
                alt={alt}
                className="max-h-[80vh] max-w-[90vw] rounded-lg bg-white object-contain shadow-xl"
              />
              {caption && (
                <figcaption className="text-center text-sm text-white">{caption}</figcaption>
              )}
            </figure>
          </dialog>,
          document.body,
        )}
    </span>
  );
}

/**
 * Table — tabel data dengan toolbar, pengurutan, seleksi baris, dan pagination.
 *
 * Bagian-bagiannya bukan buatan sendiri: toolbar memakai Search, Dropdown, dan
 * Button; kolom seleksi memakai Checkbox; kaki tabel memakai Pagination. Jadi
 * rupa dan perilaku papan ketiknya ikut komponen-komponen itu. Pengecualiannya
 * tombol aksi baris: dibuat sendiri di sini, tidak bergantung pada Button.
 *
 * Bawaannya tabel mengurutkan dan membagi halaman `data` sendiri. Untuk data
 * dari server pasang `manual`: tabel hanya menampilkan baris yang diberikan,
 * sedangkan perubahan urutan dan halaman diteruskan lewat `onSortChange` dan
 * `pagination.onPageChange`.
 *
 * Di layar sempit tabel cukup digulir ke samping. Kolom yang tidak perlu
 * bisa disembunyikan pemakai lewat tombol Filter Data.
 *
 * Tabelnya memakai `border-separate`, bukan `border-collapse`: pada model
 * collapse garis milik tabel, bukan milik sel, sehingga sel `sticky` bergeser
 * tanpa garisnya.
 */
export function Table<T>({
  columns: columnsProp,
  data,
  rowKey,
  size = "normal",
  sticky,
  search,
  filter,
  actions,
  selectable,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  sort,
  defaultSort = null,
  onSortChange,
  sortIcon = defaultSortIcon,
  pagination,
  manual,
  loading,
  emptyText = "Tidak ada data",
  className,
  ...props
}: TableProps<T>) {
  const density = sizes[size];

  const firstRow = data[0];
  const columnTree = useMemo<TableColumn<T>[]>(
    () =>
      columnsProp ??
      (firstRow && typeof firstRow === "object"
        ? Object.keys(firstRow).map((key) => ({ key, header: humanize(key) }))
        : []),
    [columnsProp, firstRow],
  );

  const [hiddenState, setHiddenState] = useState<string[]>(filter?.defaultHiddenColumns ?? []);
  const hiddenColumns = filter?.hiddenColumns ?? hiddenState;
  const visibleTree = useMemo(
    () => columnTree.filter((column) => !hiddenColumns.includes(column.key)),
    [columnTree, hiddenColumns],
  );

  // `columns` selalu kolom daun yang tampil: satu per sel. Grup hanya ada di header.
  const columns = useMemo(() => flattenColumns(visibleTree), [visibleTree]);
  const headRows = useMemo(() => buildHeadRows(visibleTree), [visibleTree]);
  // Pengurutan tetap berlaku walau kolomnya sedang disembunyikan.
  const allColumns = useMemo(() => flattenColumns(columnTree), [columnTree]);

  const toggleColumn = (key: string, visible: boolean) => {
    const next = visible ? hiddenColumns.filter((k) => k !== key) : [...hiddenColumns, key];
    setHiddenState(next);
    filter?.onHiddenColumnsChange?.(next);
  };

  const [sortState, setSortState] = useState<TableSort | null>(defaultSort);
  const activeSort = sort !== undefined ? sort : sortState;

  const [selectedState, setSelectedState] = useState<Key[]>(defaultSelectedKeys ?? []);
  const selected = selectedKeys ?? selectedState;

  const [pageState, setPageState] = useState(pagination?.defaultPage ?? 1);
  const pageSize = pagination?.pageSize ?? 10;
  const total = manual ? (pagination?.total ?? data.length) : data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // Dijepit supaya halaman tidak menunjuk ke luar data setelah data menyusut,
  // mis. selesai dicari.
  const page = Math.min(pagination?.page ?? pageState, totalPages);

  const getKey = (row: T): Key =>
    typeof rowKey === "function" ? rowKey(row) : (row[rowKey] as Key);

  const sorted = useMemo(() => {
    if (manual || !activeSort) return data;
    const column = allColumns.find((c) => c.key === activeSort.key);
    if (!column) return data;
    const value = column.sortValue ?? ((row: T) => readField(row, column.key));
    const byAsc = column.sortFn ?? ((a: T, b: T) => compare(value(a), value(b)));
    const factor = activeSort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => byAsc(a, b) * factor);
  }, [data, allColumns, activeSort, manual]);

  const rows =
    manual || !pagination ? sorted : sorted.slice((page - 1) * pageSize, page * pageSize);

  // Urutan klik mengikuti `sortDirections` kolom (bawaannya naik → turun),
  // lalu kembali tanpa urutan kecuali `sortResettable` dimatikan.
  const toggleSort = (column: TableColumn<T>) => {
    const { key } = column;
    const cycle: (TableSortDirection | null)[] = [...(column.sortDirections ?? ["asc", "desc"])];
    if (column.sortResettable !== false) cycle.push(null);
    const current = activeSort?.key === key ? cycle.indexOf(activeSort.direction) : -1;
    const direction = cycle[(current + 1) % cycle.length];
    const next: TableSort | null = direction ? { key, direction } : null;
    setSortState(next);
    onSortChange?.(next);
  };

  const toggleRow = (key: Key, checked: boolean) => {
    const next = checked ? [...selected, key] : selected.filter((k) => k !== key);
    setSelectedState(next);
    onSelectionChange?.(next);
  };

  const changePage = (next: number) => {
    setPageState(next);
    pagination?.onPageChange?.(next);
  };

  const renderActions = (actionList: TableRowAction<T>[], row: T, index: number) => (
    <span className="inline-flex items-center justify-center gap-1.5">
      {actionList.map((action) => {
        if (action.hidden !== undefined && resolve(action.hidden, row)) return null;
        const label = resolve(action.label, row);
        const disabled = action.disabled !== undefined && resolve(action.disabled, row);
        const actionSize = actionSizes[action.iconSize ?? "base"];
        const className = cn(
          "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap",
          "transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
          "disabled:pointer-events-none disabled:opacity-50",
          actionColors[action.theme ?? "primary"][action.tone ?? "light"][
            action.variant ?? "filled"
          ],
          action.showLabel ? actionSize.labeled : actionSize.iconOnly,
          actionRadii[action.radius ?? "base"],
        );
        // `[&>svg]:size-full` supaya ikon yang membawa ukuran sendiri tetap
        // mengikuti `iconSize`.
        const content = (
          <>
            <span
              className={cn(
                "flex shrink-0 items-center justify-center [&>svg]:size-full",
                actionSize.icon,
              )}
            >
              {action.icon}
            </span>
            {action.showLabel && label}
          </>
        );
        const ariaLabel = action.showLabel ? undefined : label;
        const onClick = () => action.onClick?.(row, index);

        // `<a>` tidak bisa dinonaktifkan, jadi tautan yang disabled dirender
        // sebagai `<button disabled>`.
        const button =
          action.href !== undefined && !disabled ? (
            <a
              href={resolve(action.href, row)}
              target={action.target}
              rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
              aria-label={ariaLabel}
              className={className}
              onClick={onClick}
            >
              {content}
            </a>
          ) : (
            <button
              type="button"
              disabled={disabled}
              aria-label={ariaLabel}
              className={className}
              onClick={onClick}
            >
              {content}
            </button>
          );

        if (action.showLabel) return <Fragment key={action.key}>{button}</Fragment>;

        // Tooltip sendiri, bukan atribut `title`: tooltip bawaan browser baru
        // muncul setelah jeda dan di sebagian Chromium Linux tidak muncul sama
        // sekali. Hover dipasang di pembungkus supaya tombol disabled — yang
        // `pointer-events-none` — tetap menjelaskan dirinya.
        return (
          <span key={action.key} className="group/action relative inline-flex">
            {button}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2",
                "rounded-md bg-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white normal-case shadow-sm",
                "opacity-0 transition-opacity duration-150",
                "group-hover/action:opacity-100 group-has-[:focus-visible]/action:opacity-100",
              )}
            >
              {label}
            </span>
          </span>
        );
      })}
    </span>
  );

  const renderImage = (image: TableColumnImage<T>, row: T) => {
    const src = image.src(row);
    if (!src) return "—";
    return (
      <TableImage
        src={src}
        alt={image.alt !== undefined ? resolve(image.alt, row) : undefined}
        caption={image.caption?.(row)}
        showCaption={size !== "compact"}
        preview={image.preview}
        className={density.thumb}
      />
    );
  };

  const renderCell = (column: TableColumn<T>, row: T, index: number) =>
    column.cell
      ? column.cell(row, index)
      : column.actions
        ? renderActions(column.actions, row, index)
        : column.image
          ? renderImage(column.image, row)
          : formatValue(readField(row, column.key));

  /**
   * Kelas menempel per posisi. Kolom checkbox selebar `w-12` persis, jadi
   * kolom data pertama cukup digeser `left-12`. Latarnya wajib ada — sel
   * sticky yang transparan memperlihatkan isi yang lewat di bawahnya.
   */
  const stickyClass = (index: number, head: boolean) => {
    const isStart = sticky?.start && index === 0;
    const isEnd = sticky?.end && index === columns.length - 1 && columns.length > 1;
    if (!isStart && !isEnd) return undefined;
    return cn(
      "sticky z-10",
      head ? density.headBg : "bg-white transition-colors group-hover:bg-gray-50",
      isStart && (selectable ? "left-12" : "left-0"),
      isStart && "shadow-[inset_-1px_0_0_var(--color-gray-200)]",
      isEnd && "right-0 shadow-[inset_1px_0_0_var(--color-gray-200)]",
    );
  };

  const hasToolbar = Boolean(search || filter || actions);
  const colSpan = Math.max(1, columns.length + (selectable ? 1 : 0));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div
      className={cn("overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    >
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-4 p-4">
          {search && (
            <Search
              platform="compact"
              withButton={false}
              placeholder="Cari Data"
              {...search}
              className={cn("w-full sm:w-auto sm:min-w-[22rem]", search.className)}
            />
          )}

          {filter && (
            <Dropdown
              contentClassName="w-60"
              trigger={
                <Button
                  variant="outline"
                  theme="gray"
                  size="s"
                  leftIcon={<AdjustmentsHorizontal />}
                >
                  {filter.label ?? "Filter Data"}
                </Button>
              }
            >
              <div className="p-3">
                <p className="mb-2 text-xs font-medium text-gray-500">
                  {filter.title ?? "Tampilkan kolom"}
                </p>
                <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
                  {columnTree.map((column) => {
                    const visible = !hiddenColumns.includes(column.key);
                    // Kolom terakhir yang tampil tidak bisa dimatikan, supaya
                    // tabel tidak pernah kosong tanpa kolom.
                    const last = visible && visibleTree.length === 1;
                    return (
                      <Checkbox
                        key={column.key}
                        platform="mobile"
                        label={column.header}
                        checked={visible}
                        disabled={column.hideable === false || last}
                        onChange={(e) => toggleColumn(column.key, e.target.checked)}
                      />
                    );
                  })}
                </div>
              </div>
            </Dropdown>
          )}

          {actions && <div className="ml-auto flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table
          className="w-full border-separate border-spacing-0 text-sm"
          aria-busy={loading || undefined}
        >
          {/* Header bisa bertingkat: garis atas milik baris header pertama,
              garis bawah milik judul daun — judul induk tanpa garis bawah,
              seperti di rancangan. */}
          <thead>
            {headRows.map((headRow, level) => (
              <tr key={level}>
                {level === 0 && selectable && (
                  <th
                    scope="col"
                    rowSpan={headRows.length}
                    className={cn(
                      "w-12 border-y",
                      density.border,
                      density.headTop,
                      density.headBg,
                      density.head,
                      sticky?.start && "sticky left-0 z-10",
                    )}
                  >
                    <span className="sr-only">Pilih baris</span>
                  </th>
                )}
                {headRow.map(({ column: headColumn, group, colSpan, rowSpan, leafIndex }) => {
                  const common = cn(
                    "font-medium whitespace-nowrap",
                    density.headBg,
                    density.headText,
                    density.head,
                    aligns[headAlignOf(headColumn)],
                    level === 0 && cn("border-t", density.headTop),
                  );

                  if (group) {
                    return (
                      <th
                        key={headColumn.key}
                        scope="colgroup"
                        colSpan={colSpan}
                        className={cn(common, "pb-0 text-gray-500")}
                      >
                        {headColumn.header}
                      </th>
                    );
                  }

                  const column = columns[leafIndex];
                  const isSorted = activeSort?.key === column.key;
                  const renderSortIcon = column.sortIcon ?? sortIcon;

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      rowSpan={rowSpan}
                      style={{ width: column.width, minWidth: column.minWidth }}
                      aria-sort={
                        isSorted
                          ? activeSort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                      className={cn(
                        common,
                        "border-b",
                        density.border,
                        isSorted ? "text-gray-900" : "text-gray-500",
                        stickyClass(leafIndex, true),
                      )}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column)}
                          className={cn(
                            "items-center gap-1 transition-colors hover:text-gray-900",
                            // Compact rata kiri: ikon sort di ujung kanan judul, seperti di rancangan.
                            size === "compact"
                              ? cn("flex w-full gap-2", compactSortJustify[headAlignOf(column)])
                              : "inline-flex uppercase",
                            "rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
                          )}
                        >
                          {column.header}
                          {renderSortIcon(isSorted ? activeSort.direction : null)}
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="[&>tr:last-child>td]:border-b-0">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="border-b border-gray-200 py-12">
                  <Spinner className="mx-auto" aria-label="Memuat data" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="border-b border-gray-200 py-12 text-center text-gray-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const key = getKey(row);
                const isSelected = selected.includes(key);
                const cellBorder = cn("border-b", density.border);

                return (
                  <tr
                    key={key}
                    aria-selected={selectable ? isSelected : undefined}
                    className="group transition-colors hover:bg-gray-50"
                  >
                    {selectable && (
                      <td
                        className={cn(
                          "w-12",
                          cellBorder,
                          density.cell,
                          sticky?.start &&
                            "sticky left-0 z-10 bg-white transition-colors group-hover:bg-gray-50",
                        )}
                      >
                        <Checkbox
                          platform={density.check}
                          checked={isSelected}
                          onChange={(e) => toggleRow(key, e.target.checked)}
                          aria-label={`Pilih baris ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column, i) => (
                      <td
                        key={column.key}
                        style={{ width: column.width, minWidth: column.minWidth }}
                        className={cn(
                          cellBorder,
                          density.cell,
                          aligns[column.align ?? "center"],
                          density.cellText ?? (column.emphasis ? "text-gray-900" : "text-gray-500"),
                          !column.wrap && "whitespace-nowrap",
                          stickyClass(i, false),
                        )}
                      >
                        {renderCell(column, row, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-4">
          <p className="text-sm text-gray-500">
            {(pagination.summary ?? defaultSummary)({ from, to, total })}
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={changePage}
            theme={pagination.theme}
          />
        </div>
      )}
    </div>
  );
}

export default Table;
