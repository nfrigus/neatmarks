import 'bootstrap'
import App from './components/App.vue'
import Vue from 'vue'
import iView from 'iview'
import router from './router'
import 'iview/dist/styles/iview.css'
import '../css/main.scss'


Vue.use(iView)


$(() => {
  new Vue({
    el: '#app',
    render: h => h(App),
    router,
  })
})
