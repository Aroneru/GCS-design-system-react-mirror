import { useLayoutEffect } from "react";
import { DocsLayout } from "./docs/DocsLayout";
import { applyDocsTheme, hasDarkMode, setDarkPreference, useDarkPreference } from "./docs/docsTheme";
import { useHashRoute } from "./docs/useHashRoute";
import { HomePage } from "./docs/pages/HomePage";
import { ExamplePage } from "./docs/pages/ExamplePage";
import { ExampleAppFrame } from "./docs/pages/example/ExampleAppFrame";
import { PortalDashboardPage } from "./docs/pages/portal/PortalDashboardPage";
import { PortalDashboard } from "./docs/pages/portal/PortalDashboard";

import { FoundationsOverview } from "./docs/pages/foundations/FoundationsOverview";
import { ColorsPage } from "./docs/pages/foundations/ColorsPage";
import { TypographyPage } from "./docs/pages/foundations/TypographyPage";
import { SpacingPage } from "./docs/pages/foundations/SpacingPage";
import { BorderPage } from "./docs/pages/foundations/BorderPage";
import { ElevationPage } from "./docs/pages/foundations/ElevationPage";
import { IconsPage } from "./docs/pages/foundations/IconsPage";

import { FormOverview } from "./docs/pages/form/FormOverview";
import { InputFieldFormPage } from "./docs/pages/form/InputFieldFormPage";
import { InputFieldPage } from "./docs/pages/form/input-field/InputFieldPage";
import { FloatingLabelPage } from "./docs/pages/form/input-field/FloatingLabelPage";
import { TextAreaPage } from "./docs/pages/form/input-field/TextAreaPage";
import { SelectPage } from "./docs/pages/form/SelectPage";
import { SearchPage } from "./docs/pages/form/SearchPage";
import { DatepickerPage } from "./docs/pages/form/DatepickerPage";
import { UploadPage } from "./docs/pages/form/UploadPage";
import { RadioPage } from "./docs/pages/form/RadioPage";
import { TogglePage } from "./docs/pages/form/TogglePage";
import { CheckboxPage } from "./docs/pages/form/CheckboxPage";


import { ComponentsOverview } from "./docs/pages/components/ComponentsOverview";
import { ContainerPage } from "./docs/pages/components/ContainerPage";
import { ButtonPage } from "./docs/pages/components/ButtonPage";
import { ClipboardPage } from "./docs/pages/components/ClipboardPage";
import { AvatarPage } from "./docs/pages/components/AvatarPage";
import { BadgePage } from "./docs/pages/components/BadgePage";
import { SpinnerPage } from "./docs/pages/components/SpinnerPage";
import { PopoverPage } from "./docs/pages/components/PopoverPage";
import { DropdownPage } from "./docs/pages/components/DropdownPage";
import { ModalPage } from "./docs/pages/components/ModalPage";
import { DrawerPage } from "./docs/pages/components/DrawerPage";
import { AlertPage } from "./docs/pages/components/AlertPage";
import { ToastPage } from "./docs/pages/components/ToastPage";
import { CardPage } from "./docs/pages/components/CardPage";
import { HeroPage } from "./docs/pages/components/HeroPage";
import { FooterPage } from "./docs/pages/components/FooterPage";
import { SidebarPage } from "./docs/pages/components/SidebarPage";
import {
  NavbarDesktopPreview,
  NavbarMobilePreview,
  NavbarPage,
  NavbarPlaygroundPreview,
} from "./docs/pages/components/NavbarPage";
import { BreadcrumbPage } from "./docs/pages/components/BreadcrumbPage";
import { PaginationPage } from "./docs/pages/components/PaginationPage";
import { TablePage } from "./docs/pages/components/TablePage";
import { TableOfContentsPage } from "./docs/pages/components/TableOfContentsPage";
import { ListViewPage } from "./docs/pages/components/ListViewPage";
import { TimelinePage } from "./docs/pages/components/TimelinePage";

const routes: Record<string, () => React.ReactElement> = {
  "/": HomePage,
  "/example": ExamplePage,
  "/portal-dashboard": PortalDashboardPage,

  "/foundations": FoundationsOverview,
  "/foundations/colors": ColorsPage,
  "/foundations/typography": TypographyPage,
  "/foundations/spacing": SpacingPage,
  "/foundations/border": BorderPage,
  "/foundations/elevation": ElevationPage,
  "/foundations/icons": IconsPage,

  "/form": FormOverview,
  "/form/input-field": InputFieldFormPage,
  "/form/input-field/input": InputFieldPage,
  "/form/input-field/floating-label": FloatingLabelPage,
  "/form/input-field/text-area": TextAreaPage,
  "/form/select": SelectPage,
  "/form/search": SearchPage,
  "/form/datepicker": DatepickerPage,
  "/form/upload": UploadPage,
  "/form/radio": RadioPage,
  "/form/toggle": TogglePage,
  "/form/checkbox": CheckboxPage,

  "/components": ComponentsOverview,
  "/components/container": ContainerPage,
  "/components/button": ButtonPage,
  "/components/clipboard": ClipboardPage,
  "/components/avatar": AvatarPage,
  "/components/badge": BadgePage,
  "/components/spinner": SpinnerPage,
  "/components/popover": PopoverPage,
  "/components/dropdown": DropdownPage,
  "/components/modal": ModalPage,
  "/components/drawer": DrawerPage,
  "/components/alert": AlertPage,
  "/components/toast": ToastPage,
  "/components/card": CardPage,
  "/components/navbar": NavbarPage,
  "/components/hero": HeroPage,
  "/components/footer": FooterPage,
  "/components/breadcrumb": BreadcrumbPage,
  "/components/pagination": PaginationPage,
  "/components/sidebar": SidebarPage,
  "/components/table-of-contents": TableOfContentsPage,
  "/components/list-view": ListViewPage,
  "/components/table": TablePage,
  "/components/timeline": TimelinePage,
};

function renderNavbarPreview(path: string) {
  if (path.startsWith("/preview/navbar/playground")) {
    return <NavbarPlaygroundPreview />;
  }

  switch (path) {
    case "/preview/navbar/mobile-guest":
      return <NavbarMobilePreview variant="guest" />;
    case "/preview/navbar/mobile-authenticated":
      return <NavbarMobilePreview variant="authenticated" />;
    case "/preview/navbar/mobile-back-office":
      return <NavbarMobilePreview variant="authenticated" platform="back-office" />;
    case "/preview/navbar/desktop-guest-5":
      return <NavbarDesktopPreview variant="guest" menuCount={5} />;
    case "/preview/navbar/desktop-guest-4":
      return <NavbarDesktopPreview variant="guest" menuCount={4} />;
    case "/preview/navbar/desktop-guest-3":
      return <NavbarDesktopPreview variant="guest" menuCount={3} />;
    case "/preview/navbar/desktop-guest-2":
      return <NavbarDesktopPreview variant="guest" menuCount={2} />;
    case "/preview/navbar/desktop-no-button-5":
      return <NavbarDesktopPreview variant="no-button" menuCount={5} />;
    case "/preview/navbar/desktop-no-button-4":
      return <NavbarDesktopPreview variant="no-button" menuCount={4} />;
    case "/preview/navbar/desktop-no-button-3":
      return <NavbarDesktopPreview variant="no-button" menuCount={3} />;
    case "/preview/navbar/desktop-authenticated-5":
      return <NavbarDesktopPreview variant="authenticated" menuCount={5} />;
    case "/preview/navbar/desktop-authenticated-4":
      return <NavbarDesktopPreview variant="authenticated" menuCount={4} />;
    case "/preview/navbar/desktop-authenticated-3":
      return <NavbarDesktopPreview variant="authenticated" menuCount={3} />;
    case "/preview/navbar/desktop-back-office":
      return <NavbarDesktopPreview variant="authenticated" menuCount={3} platform="back-office" />;
    default:
      return null;
  }
}

function App() {
  const [path] = useHashRoute();
  const navbarPreview = path.startsWith("/preview/navbar/");
  const navbarPreviewDark = navbarPreview && new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("theme") === "dark";

  // Mode gelap docs berlaku per halaman (lihat docs/docsTheme.ts). Dipasang di
  // sini, bukan di DocsLayout, supaya ikut berlaku di Portal Dashboard yang
  // tampil penuh layar di luar DocsLayout. Layout effect: atributnya harus
  // terpasang sebelum frame digambar, supaya pindah halaman tidak sempat
  // menampilkan warna tema halaman sebelumnya.
  const dark = useDarkPreference() && hasDarkMode(path);
  useLayoutEffect(() => {
    applyDocsTheme(dark);
  }, [dark]);

  // Sinkronkan kanvas iframe preview pada perubahan kontrol tema. Atribut dan
  // inline style awalnya sudah dipasang oleh index.html sebelum React dimuat.
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (navbarPreviewDark) {
      html.dataset.previewTheme = "dark";
      html.style.backgroundColor = "#111827";
      html.style.colorScheme = "dark";
      return;
    }

    delete html.dataset.previewTheme;
    html.style.removeProperty("background-color");
    html.style.removeProperty("color-scheme");
  }, [navbarPreviewDark]);

  if (navbarPreview) {
    return renderNavbarPreview(path);
  }

  // Contoh aplikasi dirender penuh layar, di luar DocsLayout: kerangka
  // dokumentasi di sekelilingnya justru mengaburkan yang ingin ditunjukkan.
  // startsWith, bukan ===, karena aplikasi itu punya rute-dalam sendiri
  // (/example/app/pengajuan, .../pemohon, dst) yang dibaca ExampleAppFrame.
  if (path.startsWith("/example/app")) {
    return <ExampleAppFrame path={path} />;
  }

  // Portal Dashboard memakai bingkai yang sama: penuh layar, dengan tirai
  // transisi dan tombol pulang ke pintu masuknya. Mode gelapnya mengikuti
  // pilihan yang sama dengan docs, dan tombol tema di header-nya mengubahnya.
  if (path.startsWith("/portal-dashboard/app")) {
    return (
      <ExampleAppFrame path={path} kembali="/portal-dashboard">
        <PortalDashboard darkMode={dark} onDarkModeChange={setDarkPreference} />
      </ExampleAppFrame>
    );
  }

  const Page = routes[path] ?? HomePage;

  return (
    <DocsLayout path={path}>
      <Page />
    </DocsLayout>
  );
}

export default App;
