<template>
  <BmTree
    :nodes="nodes"
    @bookmark:refresh="refresh"
    @bookmark:remove="remove"
    @bookmark:restore="restore"
  ></BmTree>
</template>

<script lang="ts">
  import BM from '../browser/bookmarks'
  import BmTree from '../ui/components/bookmarks/BmTree'

  export default {
    components: { BmTree },
    data() {
      this.refresh()

      return {
        nodes: [],
      }
    },
    methods: {
      refresh() {
        BM.getTree()
          .then(nodes => this.nodes = nodes[0].children)
      },
      remove: BM.remove,
      async restore({ next, node }) {
        BM.create({
          parentId: node.parentId,
          title: node.title,
          url: node.url,
        }).then(next)
      },
    },
  }
</script>
