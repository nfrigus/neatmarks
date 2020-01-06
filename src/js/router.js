import Vue from 'vue'
import VueRouter from 'vue-router'
import BMPage from './pages/bookmarks.vue'
import OptionPage from './pages/options.vue'
import TabsPopup from './pages/TabManagerPopup.vue'
import Backup from './pages/Backup.vue'


Vue.use(VueRouter)


const router = new VueRouter({
  base: __dirname,
  routes: [
    { name: 'bookmarks', path: '/bookmarks', component: BMPage },
    { name: 'options', path: '/options', component: OptionPage },
    { name: 'popup', path: '/popup', component: () => window.chrome.tabs.create({ url: '/app.html#/bookmarks' }) },
    { name: 'tabs', path: '/tabs', component: TabsPopup },
    { name: 'backup', path: '/backup', component: Backup },
  ],
})

export default router
