import { DocsLayout } from './docs/DocsLayout'
import { useHashRoute } from './docs/useHashRoute'
import { HomePage } from './docs/pages/HomePage'

import { FoundationsOverview } from './docs/pages/foundations/FoundationsOverview'
import { ColorsPage } from './docs/pages/foundations/ColorsPage'
import { TypographyPage } from './docs/pages/foundations/TypographyPage'
import { SpacingPage } from './docs/pages/foundations/SpacingPage'
import { BorderPage } from './docs/pages/foundations/BorderPage'
import { ElevationPage } from './docs/pages/foundations/ElevationPage'
import { IconsPage } from './docs/pages/foundations/IconsPage'

import { ComponentsOverview } from './docs/pages/components/ComponentsOverview'
import { ContainerPage } from './docs/pages/components/ContainerPage'
import { ButtonPage } from './docs/pages/components/ButtonPage'
import { BadgePage } from './docs/pages/components/BadgePage'
import { CardPage } from './docs/pages/components/CardPage'
import { FooterPage } from './docs/pages/components/FooterPage'

const routes: Record<string, () => React.ReactElement> = {
  '/': HomePage,

  '/foundations': FoundationsOverview,
  '/foundations/colors': ColorsPage,
  '/foundations/typography': TypographyPage,
  '/foundations/spacing': SpacingPage,
  '/foundations/border': BorderPage,
  '/foundations/elevation': ElevationPage,
  '/foundations/icons': IconsPage,

  '/components': ComponentsOverview,
  '/components/container': ContainerPage,
  '/components/button': ButtonPage,
  '/components/badge': BadgePage,
  '/components/card': CardPage,
  '/components/footer': FooterPage,
}

function App() {
  const [path] = useHashRoute()
  const Page = routes[path] ?? HomePage
  return (
    <DocsLayout path={path}>
      <Page />
    </DocsLayout>
  )
}

export default App
