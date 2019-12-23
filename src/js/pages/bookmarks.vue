<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <bm-tree :nodes="nodes"></bm-tree>
      </main>
    </div>
  </div>
</template>

<script>
  import BM from '../dao/bookmarks'
  import BmTree from '../components/BMTree.vue'


  export default {
    components: {
      BmTree,
    },
    data() {
      BM.getTree()
        .then(nodes => this.nodes = nodes[0].children)

      return {
        nodes: [],
      }
    },
  }
</script>
