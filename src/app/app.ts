import Vue from 'vue'
import AppAPI from './api/AppAPI'
import { UiPlugin } from './ui'
import App from './App.vue'

Vue.use(UiPlugin)

document.addEventListener('DOMContentLoaded', () => new Vue(App as Record<string, unknown>));

declare global {
  interface Window {
    app: typeof AppAPI;
  }
}

window.app = AppAPI
