import { createContext, useContext } from "react";

/**
 * Mode gelap yang diwariskan komponen pembungkus ke isinya. Table mengisinya
 * dari prop `darkMode`, sehingga Button dan Badge di toolbar maupun di sel ikut
 * gelap tanpa perlu diberi `darkMode` satu per satu.
 *
 * Prop `darkMode` milik komponen tetap menang bila diisi, termasuk `false`.
 */
export const DarkModeContext = createContext(false);

/** Mode gelap dari pembungkus terdekat, mis. Table ber-`darkMode`. */
export function useInheritedDarkMode() {
  return useContext(DarkModeContext);
}

/**
 * Diisi Table ber-`darkMode`: Button filled berwarna (primary, orange, …) di
 * dalamnya tetap memakai warna mode terang, sesuai desain tabel gelap. Hanya
 * theme `gray` dan varian outline yang ikut palet gelap. Modal mengisinya
 * `false` lagi, supaya tombol di dalam dialog tetap memakai palet gelap Modal.
 */
export const KeepFilledColorContext = createContext(false);

export function useKeepFilledColor() {
  return useContext(KeepFilledColorContext);
}
