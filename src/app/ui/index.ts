import 'font-awesome/scss/font-awesome.scss'

import './styles/index.scss'
import * as components from './components'
import directives from './directives'

export * from './components'

export const UiPlugin = {
  install(app): void {
    app.use(directives)

    Object.entries(components)
      .forEach(([tag, component]) => app.component(tag, component));
  },
}

export default UiPlugin
