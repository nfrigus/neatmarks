import { createApp } from 'vue'
import AppAPI from './api/AppAPI'
import App from './App.vue'
import { UiPlugin } from './ui'

document.addEventListener('DOMContentLoaded', () => createApp(App)
  .use(UiPlugin)
  .mount('#app'))

declare global {
  interface Window {
    app: typeof AppAPI
  }
}

window.app = AppAPI
