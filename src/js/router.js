import Vue from 'vue'
import VueRouter from 'vue-router'
import BMPage from './pages/bookmarks.vue'
import OptionPage from './pages/options.vue'
import TabsPopup from './pages/TabManagerPopup.vue'


Vue.use(VueRouter)


const router = new VueRouter({
  base: __dirname,
  routes: [
    { name: 'bookmarks', path: '/bookmarks', component: BMPage },
    { name: 'options', path: '/options', component: OptionPage },
    { name: 'popup', path: '/popup', component: () => chrome.tabs.create({ url: '/app.html#/bookmarks' }) },
    { name: 'tabs', path: '/tabs', component: TabsPopup },
  ],
})

export default router
