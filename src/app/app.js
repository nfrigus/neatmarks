import Vue from 'vue'
import routes from './routes'
import { UiPlugin } from './ui'

Vue.use(UiPlugin)

document.addEventListener('DOMContentLoaded', () => new Vue.App('#app', routes))
