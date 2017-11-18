<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <h1>Neatmarks</h1>
        <bm-tree></bm-tree>
      </main>
    </div>
  </div>
</template>

<script>
  import BmTree from '../components/BMTree.vue'


  export default {
    components: {
      BmTree,
    },
  }
</script>
