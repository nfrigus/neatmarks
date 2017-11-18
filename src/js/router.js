import Vue from 'vue'
import VueRouter from 'vue-router'
import BMPage from './pages/bookmarks.vue'
import OptionPage from './pages/options.vue'


Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/bookmarks.html', component: BMPage },
    { path: '/options.html', component: OptionPage },
  ],
})

export default router
