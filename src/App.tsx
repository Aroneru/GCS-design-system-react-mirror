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
  NavbarDesktopPreview,
  NavbarMobilePreview,
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
      return <HomePage />
  }
}

function App() {
  const [path] = useHashRoute()
  if (path.startsWith('/preview/navbar/')) return renderPage(path)
  return <DocsLayout path={path}>{renderPage(path)}</DocsLayout>
}

export default App
