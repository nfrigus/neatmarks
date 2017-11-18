import 'bootstrap'
import App from './components/App.vue'
import Vue from 'vue'
import router from './router'


$(() => {
  new Vue({
    el: '#app',
    render: h => h(App),
    router,
  })

  $('[data-bm-id]', document.body).on('dragstart dragend', console.log)
})
