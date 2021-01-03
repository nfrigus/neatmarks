import VueRouter from 'vue-router'
import Backup from './Backup.vue'
import Bookmarks from './bookmarks.vue'
import OptionPage from './options.vue'
import TabsPopup from './TabManagerPopup.vue'

export default class AppRouter extends VueRouter {
  constructor() {
    super({
      base: '/',
      routes: [
        { name: 'bookmarks', path: '/bookmarks', component: Bookmarks },
        { name: 'options', path: '/options', component: OptionPage },
        { name: 'popup', path: '/popup', component: () => window.chrome.tabs.create({ url: '/app.html#/bookmarks' }) },
        { name: 'tabs', path: '/tabs', component: TabsPopup },
        { name: 'backup', path: '/backup', component: Backup },
      ],
    })
  }
}
