import { DocsLayout } from './docs/DocsLayout'
import { useHashRoute } from './docs/useHashRoute'
import { HomePage } from './docs/pages/HomePage'
import { ExamplePage } from './docs/pages/ExamplePage'

import { FoundationsOverview } from './docs/pages/foundations/FoundationsOverview'
import { ColorsPage } from './docs/pages/foundations/ColorsPage'
import { TypographyPage } from './docs/pages/foundations/TypographyPage'
import { SpacingPage } from './docs/pages/foundations/SpacingPage'
import { BorderPage } from './docs/pages/foundations/BorderPage'
import { ElevationPage } from './docs/pages/foundations/ElevationPage'
import { IconsPage } from './docs/pages/foundations/IconsPage'

import { FormOverview } from './docs/pages/form/FormOverview'
import { InputFieldFormPage } from './docs/pages/form/InputFieldFormPage'
import { InputFieldPage } from './docs/pages/form/input-field/InputFieldPage'
import { FloatingLabelPage } from './docs/pages/form/input-field/FloatingLabelPage'
import { TextAreaPage } from './docs/pages/form/input-field/TextAreaPage'
import { SelectPage } from './docs/pages/form/SelectPage'
import { RadioPage } from './docs/pages/form/RadioPage'
import { TogglePage } from './docs/pages/form/TogglePage'
import { CheckboxPage } from './docs/pages/form/CheckboxPage'

// Halaman "usulan" — susunan dokumentasi yang diusulkan, berdampingan dengan
// yang sekarang supaya keduanya bisa dibandingkan langsung.
import { InputFieldUsulanPage } from './docs/pages/form/input-field/InputFieldUsulanPage'
import { FloatingLabelUsulanPage } from './docs/pages/form/input-field/FloatingLabelUsulanPage'
import { TextAreaUsulanPage } from './docs/pages/form/input-field/TextAreaUsulanPage'
import { SelectUsulanPage } from './docs/pages/form/SelectUsulanPage'
import { RadioUsulanPage } from './docs/pages/form/RadioUsulanPage'
import { ToggleUsulanPage } from './docs/pages/form/ToggleUsulanPage'
import { CheckboxUsulanPage } from './docs/pages/form/CheckboxUsulanPage'
import { PlaceholderPage } from './docs/pages/PlaceholderPage'

import { ComponentsOverview } from './docs/pages/components/ComponentsOverview'
import { ContainerPage } from './docs/pages/components/ContainerPage'
import { ContainerUsulanPage } from './docs/pages/components/ContainerUsulanPage'
import { ButtonPage } from './docs/pages/components/ButtonPage'
import { BadgePage } from './docs/pages/components/BadgePage'
import { CardPage } from './docs/pages/components/CardPage'
import { CardUsulanPage } from './docs/pages/components/CardUsulanPage'
import { FooterPage } from './docs/pages/components/FooterPage'
import { FooterUsulanPage } from './docs/pages/components/FooterUsulanPage'
import {
  NavbarDesktopPreview,
  NavbarMobilePreview,
  NavbarPage,
} from './docs/pages/components/NavbarPage'

const routes: Record<string, () => React.ReactElement> = {
  '/': HomePage,
  '/example': ExamplePage,

  '/foundations': FoundationsOverview,
  '/foundations/colors': ColorsPage,
  '/foundations/typography': TypographyPage,
  '/foundations/spacing': SpacingPage,
  '/foundations/border': BorderPage,
  '/foundations/elevation': ElevationPage,
  '/foundations/icons': IconsPage,

  // Halaman Form selain Input Field masih placeholder — komponennya menyusul.
  '/form': FormOverview,
  '/form/input-field': InputFieldFormPage,
  '/form/input-field/input': InputFieldPage,
  '/form/input-field/input-usulan': InputFieldUsulanPage,
  '/form/input-field/floating-label': FloatingLabelPage,
  '/form/input-field/floating-label-usulan': FloatingLabelUsulanPage,
  '/form/input-field/text-area': TextAreaPage,
  '/form/input-field/text-area-usulan': TextAreaUsulanPage,
  '/form/select': SelectPage,
  '/form/select-usulan': SelectUsulanPage,
  '/form/search': () => <PlaceholderPage eyebrow="Form" title="Search Form" />,
  '/form/upload': () => <PlaceholderPage eyebrow="Form" title="Upload Form" />,
  '/form/radio': RadioPage,
  '/form/radio-usulan': RadioUsulanPage,
  '/form/toggle': TogglePage,
  '/form/toggle-usulan': ToggleUsulanPage,
  '/form/checkbox': CheckboxPage,
  '/form/checkbox-usulan': CheckboxUsulanPage,

  '/components': ComponentsOverview,
  '/components/container': ContainerPage,
  '/components/container-usulan': ContainerUsulanPage,
  '/components/button': ButtonPage,
  '/components/badge': BadgePage,
  '/components/card': CardPage,
  '/components/card-usulan': CardUsulanPage,
  '/components/navbar': NavbarPage,
  '/components/footer': FooterPage,
  '/components/footer-usulan': FooterUsulanPage,
}

function renderNavbarPreview(path: string) {
  switch (path) {
    case '/preview/navbar/mobile-guest':
      return <NavbarMobilePreview variant="guest" />
    case '/preview/navbar/mobile-authenticated':
      return <NavbarMobilePreview variant="authenticated" />
    case '/preview/navbar/desktop-guest-5':
      return <NavbarDesktopPreview variant="guest" menuCount={5} />
    case '/preview/navbar/desktop-guest-4':
      return <NavbarDesktopPreview variant="guest" menuCount={4} />
    case '/preview/navbar/desktop-guest-3':
      return <NavbarDesktopPreview variant="guest" menuCount={3} />
    case '/preview/navbar/desktop-guest-2':
      return <NavbarDesktopPreview variant="guest" menuCount={2} />
    case '/preview/navbar/desktop-no-button-5':
      return <NavbarDesktopPreview variant="no-button" menuCount={5} />
    case '/preview/navbar/desktop-no-button-4':
      return <NavbarDesktopPreview variant="no-button" menuCount={4} />
    case '/preview/navbar/desktop-no-button-3':
      return <NavbarDesktopPreview variant="no-button" menuCount={3} />
    case '/preview/navbar/desktop-authenticated-5':
      return <NavbarDesktopPreview variant="authenticated" menuCount={5} />
    case '/preview/navbar/desktop-authenticated-4':
      return <NavbarDesktopPreview variant="authenticated" menuCount={4} />
    case '/preview/navbar/desktop-authenticated-3':
      return <NavbarDesktopPreview variant="authenticated" menuCount={3} />
    default:
      return null
  }
}

function App() {
  const [path] = useHashRoute()

  if (path.startsWith('/preview/navbar/')) {
    return renderNavbarPreview(path)
  }

  const Page = routes[path] ?? HomePage

  return (
    <DocsLayout path={path}>
      <Page />
    </DocsLayout>
  )
}

export default App
