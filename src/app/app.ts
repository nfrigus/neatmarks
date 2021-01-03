import Vue from 'vue'
import AppAPI from './api/AppAPI'
import { UiPlugin } from './ui'
import App from './App.vue'

Vue.use(UiPlugin)

document.addEventListener('DOMContentLoaded', () => new Vue(App as {}));
(window as any).app = AppAPI
