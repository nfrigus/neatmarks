import { createApp } from 'vue'
import AppAPI from './api/AppAPI'
import App from './App.vue'
import { UiPlugin } from './ui'
import createAppRouter from './routes'

document.addEventListener('DOMContentLoaded', () => createApp(App)
  .use(createAppRouter())
  .use(UiPlugin)
  .mount('#app'))

window.app = AppAPI
