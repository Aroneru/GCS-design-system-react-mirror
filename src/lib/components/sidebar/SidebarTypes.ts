import type { HTMLAttributes, ReactNode } from "react";

/** Tautan pada submenu Sidebar. */
export interface SidebarSubItem {
  id?: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

/** Satu item navigasi utama Sidebar. */
export interface SidebarItem {
  id?: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  /** Menonaktifkan tombol buka/tutup submenu tanpa menonaktifkan item menu. */
  submenuToggleDisabled?: boolean;
  children?: SidebarSubItem[];
}

/** Kelompok menu; `separator` menambahkan pemisah sebelum kelompok ini. */
export interface SidebarGroup {
  id: string;
  label?: string;
  separator?: boolean;
  items: SidebarItem[];
}

/** Informasi akun yang ditampilkan pada area profil Sidebar. */
export interface SidebarUser {
  name: string;
  profileLabel?: string;
  avatar?: string;
  href?: string;
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
}
