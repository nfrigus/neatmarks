import Vue from 'vue'
import VueRouter from 'vue-router'
import BMPage from './pages/bookmarks.vue'
import OptionPage from './pages/options.vue'
import TabsPopup from './pages/TabManagerPopup.vue'


Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    // todo: remove dependency on extra html entry-point-files
    { path: '/bookmarks.html', component: BMPage },
    { path: '/options.html', component: OptionPage },
    { path: '/popup.html', component: () => chrome.tabs.create({ url: '/bookmarks.html' }) },
    { path: '/tabs.html', component: TabsPopup },
  ],
})

export default router
