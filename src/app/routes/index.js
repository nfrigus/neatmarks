import BMPage from './bookmarks.vue'
import OptionPage from './options.vue'
import TabsPopup from './TabManagerPopup.vue'
import Backup from './Backup.vue'


export default [
  { name: 'bookmarks', path: '/bookmarks', component: BMPage },
  { name: 'options', path: '/options', component: OptionPage },
  { name: 'popup', path: '/popup', component: () => window.chrome.tabs.create({ url: '/app.html#/bookmarks' }) },
  { name: 'tabs', path: '/tabs', component: TabsPopup },
  { name: 'backup', path: '/backup', component: Backup },
]
