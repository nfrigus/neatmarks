import Vue from 'vue'
import AppAPI from './api/AppAPI'
import routes from './routes'
import { UiPlugin } from './ui'

Vue.use(UiPlugin)

document.addEventListener('DOMContentLoaded', () => new Vue.App('#app', routes))

window.app = AppAPI
