import { createRouter, createWebHashHistory } from 'vue-router'
import Backup from './Backup.vue'
import Bookmarks from './bookmarks.vue'
import OptionPage from './options.vue'
import TabsPopup from './TabManagerPopup.vue'

export function createAppRouter() {
  return createRouter({
    history: createWebHashHistory('/'),
    routes: [
      { name: 'index', path: '/', component: Bookmarks },
      { name: 'bookmarks', path: '/bookmarks', component: Bookmarks },
      { name: 'options', path: '/options', component: OptionPage },
      { name: 'popup', path: '/popup', component: () => window.chrome.tabs.create({ url: '/app.html#/bookmarks' }) },
      {
        name: 'tabs', path: '/tabs', component: TabsPopup, props: ({ query }) => ({ isPopup: query.popup === 'true' }),
      },
      { name: 'backup', path: '/backup', component: Backup },
    ],
  })
}

export default createAppRouter
