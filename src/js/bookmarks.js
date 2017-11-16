import 'bootstrap'
import App from './components/App.vue'


$(() => {
  new Vue({
    el: '#app',
    render: h => h(App),
  })

  $('[data-bm-id]', document.body).on('dragstart dragend', console.log)
})
