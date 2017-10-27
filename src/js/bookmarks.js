import 'bootstrap'


$(() => {
  Vue.component('bm-tree', {
    props: ['nodes'],
    template: '#bm-tree-component',
  })

  const app = new Vue({
    el: '#app',
    data: {
      bookmarks: [],
    },
  })

  chrome.bookmarks.getTree(nodes => app.bookmarks = nodes)
})
