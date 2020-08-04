<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <BMTree
          :nodes="nodes"
          @bookmark:remove="remove"
          @bookmark:restore="restore"
        ></BMTree>
      </main>
    </div>
  </div>
</template>

<script>
  import BM from '../dao/bookmarks'

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
