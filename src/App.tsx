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

// Text Area masih punya dua versi berdampingan supaya susunan lama dan baru
// bisa dibandingkan langsung; halaman form lainnya sudah memakai susunan baru.
import { TextAreaUsulanPage } from './docs/pages/form/input-field/TextAreaUsulanPage'
import { PlaceholderPage } from './docs/pages/PlaceholderPage'

import { ComponentsOverview } from './docs/pages/components/ComponentsOverview'
import { ContainerPage } from './docs/pages/components/ContainerPage'
import { ButtonPage } from './docs/pages/components/ButtonPage'
import { BadgePage } from './docs/pages/components/BadgePage'
import { AlertPage } from './docs/pages/components/AlertPage'
import { ToastPage } from './docs/pages/components/ToastPage'
import { CardPage } from './docs/pages/components/CardPage'
import { HeroPage } from './docs/pages/components/HeroPage'
import { FooterPage } from './docs/pages/components/FooterPage'
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
  '/form/input-field/floating-label': FloatingLabelPage,
  '/form/input-field/text-area': TextAreaPage,
  '/form/input-field/text-area-usulan': TextAreaUsulanPage,
  '/form/select': SelectPage,
  '/form/search': () => <PlaceholderPage eyebrow="Form" title="Search Form" />,
  '/form/upload': () => <PlaceholderPage eyebrow="Form" title="Upload Form" />,
  '/form/radio': RadioPage,
  '/form/toggle': TogglePage,
  '/form/checkbox': CheckboxPage,

  '/components': ComponentsOverview,
  '/components/container': ContainerPage,
  '/components/button': ButtonPage,
  '/components/badge': BadgePage,
  '/components/alert': AlertPage,
  '/components/toast': ToastPage,
  '/components/card': CardPage,
  '/components/navbar': NavbarPage,
  '/components/hero': HeroPage,
  '/components/footer': FooterPage,
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
