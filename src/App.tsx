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
import { PlaceholderPage } from './docs/pages/PlaceholderPage'

import { ComponentsOverview } from './docs/pages/components/ComponentsOverview'
import { ContainerPage } from './docs/pages/components/ContainerPage'
import { ButtonPage } from './docs/pages/components/ButtonPage'
import { BadgePage } from './docs/pages/components/BadgePage'
import { CardPage } from './docs/pages/components/CardPage'
import { FooterPage } from './docs/pages/components/FooterPage'

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
