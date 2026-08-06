import { DocsLayout } from './docs/DocsLayout'
import { useHashRoute } from './docs/useHashRoute'
import { HomePage } from './docs/pages/HomePage'
import { ColorsPage } from './docs/pages/ColorsPage'
import { TypographyPage } from './docs/pages/TypographyPage'
import {
  BadgePage,
  ButtonPage,
  CardPage,
  ComponentsOverview,
  ContainerPage,
  FooterPage,
  NavbarPage,
} from './docs/pages/ComponentPages'
import { BorderPage, ElevationPage, IconsPage, SpacingPage } from './docs/pages/FoundationPages'

function renderPage(path: string) {
  switch (path) {
    case '/':
      return <HomePage />
    case '/foundations/colors':
      return <ColorsPage />
    case '/foundations/typography':
      return <TypographyPage />
    case '/foundations/spacing':
      return <SpacingPage />
    case '/foundations/border':
      return <BorderPage />
    case '/foundations/elevation':
      return <ElevationPage />
    case '/foundations/icons':
      return <IconsPage />
    case '/components':
      return <ComponentsOverview />
    case '/components/container':
      return <ContainerPage />
    case '/components/button':
      return <ButtonPage />
    case '/components/badge':
      return <BadgePage />
    case '/components/card':
      return <CardPage />
    case '/components/navbar':
      return <NavbarPage />
    case '/components/footer':
      return <FooterPage />
    default:
      return <HomePage />
  }
}

function App() {
  const [path] = useHashRoute()
  return <DocsLayout path={path}>{renderPage(path)}</DocsLayout>
}

export default App
