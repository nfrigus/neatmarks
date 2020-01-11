import directives from './directives'

export const UiPlugin = {
  install(Vue) {
    Vue.use(directives)
  },
}

export default UiPlugin
