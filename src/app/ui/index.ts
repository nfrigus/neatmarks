import VueRouter from 'vue-router'
import { VueConstructor } from 'vue/types/vue'
import 'font-awesome/scss/font-awesome.scss'

import './styles/index.scss'
import * as components from './components'
import directives from './directives'

export * from './components'

export const UiPlugin = {
  install(Vue: VueConstructor): void {
    Vue.use(VueRouter)
    Vue.use(directives)

    Object.entries(components)
      .forEach(([tag, component]) => Vue.component(tag, component));
  },
}

export default UiPlugin
