import Vue from 'vue'
import iView from 'iview'
import App from './components/App.vue'
import router from './router'
import { UiPlugin } from '../ui'

Vue.use(iView)
Vue.use(UiPlugin)

document.addEventListener('DOMContentLoaded', () => new Vue({
  el: '#app',
  render: h => h(App),
  router,
}))
