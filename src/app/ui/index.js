import 'font-awesome/scss/font-awesome.scss'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
import VueRouter from 'vue-router'
import * as components from './components'
import directives from './directives'


export const UiPlugin = {
  install(Vue) {
    Vue.use(iView)
    Vue.use(VueRouter)
    Vue.use(directives)

    Object.entries(components)
      .forEach(([tag, component]) => Vue.component(tag, component));

    Object.assign(Vue, {
      App,
    })


    function App(el, routes) {
      return new Vue({
        el,
        /* eslint-disable no-unused-vars */
        render: (h) => (
          <AppLayout>
            <router-view></router-view>
          </AppLayout>
        ),
        router: new Router(routes),
      })
    }

    function Router(routes) {
      return new VueRouter({
        base: '/',
        routes,
      })
    }
  },
}

export default UiPlugin
