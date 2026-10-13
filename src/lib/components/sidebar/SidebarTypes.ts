import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

/** Tautan pada submenu Sidebar. */
export interface SidebarSubItem {
  id?: string;
  label: string;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/** Satu item navigasi utama Sidebar. */
export interface SidebarItem {
  id?: string;
  label: string;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  /** Menonaktifkan tombol buka/tutup submenu tanpa menonaktifkan item menu. */
  submenuToggleDisabled?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  children?: SidebarSubItem[];
}

/** Kelompok menu; `separator` menambahkan pemisah sebelum kelompok ini. */
export interface SidebarGroup {
  id: string;
  label?: string;
  separator?: boolean;
  items: SidebarItem[];
}

export type SidebarUserItemTone = "default" | "danger";

/** Item dalam dropdown menu profil pengguna. */
export interface SidebarUserItem {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  tone?: SidebarUserItemTone;
  disabled?: boolean;
  onClick?: (e?: MouseEvent<HTMLElement>) => void;
}

/** Kelompok item dropdown profil pengguna. */
export interface SidebarUserGroup {
  id: string;
  label?: string;
  separator?: boolean;
  items: SidebarUserItem[];
}

/** Informasi akun yang ditampilkan pada area profil Sidebar. */
export interface SidebarUser {
  name: string;
  profileLabel?: string;
  avatar?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  initials?: string;
  href?: string;
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>) => void;
  items?: SidebarUserItem[];
  groups?: SidebarUserGroup[];
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** API sederhana untuk Sidebar tanpa pengelompokan menu. */
  items?: SidebarItem[];
  /** Menu terkelompok, termasuk pemisah konten untuk varian 4 dan 5. */
  groups?: SidebarGroup[];
  /** Logo/mark ringkas yang ditampilkan saat Sidebar collapsed. */
  collapsedLogo?: ReactNode;
  logo?: ReactNode;
  user?: SidebarUser;
  /** Menempelkan Sidebar di bagian atas viewport dengan tinggi satu viewport. */
  sticky?: boolean;
  collapsed?: boolean;
  /** Menampilkan tombol collapse tanpa mengaktifkan interaksinya. */
  showCollapseButton?: boolean;
  onCollapse?: () => void;
  /**
   * Area di kaki Sidebar, di bawah daftar menu — versi aplikasi, tautan bantuan,
   * catatan status.
   *
   * Menempel ke dasar karena navigasinya yang memakan sisa ruang, bukan karena
   * footer-nya didorong: dengan begitu ia tetap terlihat meski menunya panjang
   * dan harus digulir sendiri. Saat `collapsed`, lebarnya tinggal 72px — isi
   * yang dititipkan ke sini harus menyiapkan bentuk ringkasnya sendiri.
   */
  footer?: ReactNode;
  /**
   * Memaksa sidebar ini bertema gelap: latar gray-800 dengan teks dan ikon yang
   * disesuaikan. Tanpa prop ini ia ikut tema elemen pembungkusnya, mis.
   * `<section data-theme="dark">`.
   */
  darkMode?: boolean;
}
