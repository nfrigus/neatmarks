import Vue from 'vue'
import routes from './routes'
import { UiPlugin } from './ui'
import BM from './dao/bookmarks'
import { clearBackups, createBackup, getBackups } from './lib/persistance'

Vue.use(UiPlugin)

document.addEventListener('DOMContentLoaded', () => new Vue.App('#app', routes))

window.app = {
  bookmarks: {
    clearBookmarks: BM.removeAll,
    getBookmarks: BM.getTree,
    setBookmarks: BM.setBookmarks,
  },
  backups: {
    clearBackups,
    createBackup,
    getBackups,
  },
}
