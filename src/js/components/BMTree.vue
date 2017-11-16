<template>
  <ul>
    <li v-for="node in entries">
      <span draggable="true" v-bind:data-bm-id="node.id">
        #{{ node.id }}
        <a v-bind:href="node.url" v-bind:title="node.url">{{ node.title }}</a>
        {{ new Date(node.dateAdded).toISOString().substr(0, 10) }}
      </span>
      <bm-tree v-if="node.children" v-bind:nodes="node.children"></bm-tree>
    </li>
  </ul>
</template>

<script>
  import BM from '../dao/bookmarks'


  export default {
    props: ['nodes'],
    data() {
      const entries = this.nodes

      if (!entries) {
        BM.getTree()
          .then(nodes => this.entries = nodes)
      }

      return {entries}
    },
    name: 'bm-tree',
  }
</script>

<style lang="scss">

</style>
