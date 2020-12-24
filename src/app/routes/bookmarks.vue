<template>
  <BMTree
    :nodes="nodes"
    @bookmark:remove="remove"
    @bookmark:restore="restore"
  ></BMTree>
</template>

<script>
  import BM from '../browser/bookmarks'

  export default {
    data() {
      BM.getTree()
        .then(nodes => this.nodes = nodes[0].children)

      return {
        nodes: [],
      }
    },
    methods: {
      async remove({ $el, node }) {
        await BM.remove(node.id)
        node.isDeleted = true
        $el.$forceUpdate()
      },
      async restore({ $el, node }) {
        const restored = await BM.create({
          parentId: node.parentId,
          title: node.title,
          url: node.url,
        })

        Object.assign(node, restored)
        node.isDeleted = false
        $el.$forceUpdate()
      },
    },
  }
</script>
