<template>
  <ul class="BMTree-root">
    <li v-for="node in entries" :class="{
      'BMTree-node': 1,
      'BMTree-node_collapsed': node.collapsed
    }">
      <span @click="toggle(node)" draggable="true" :data-bm-id="node.id">
        <i :class="{fa: 1, [getIcon(node)]: 1}" :title="node.id"></i>
        <a :href="node.url" :title="node.url">{{ node.title }}</a>
        <time class="BMTree-time">{{ getDateAdded(node) }}</time>
      </span>
      <bm-tree v-if="node.children" :nodes="node.children"></bm-tree>
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

      return {
        entries,
      }
    },
    methods: {
      toggle(node) {
        node.collapsed ^= 1
        this.$forceUpdate()
      },
      getIcon(node) {
        let icon = 'fa-folder-open'

        if (node.url) {
          icon = 'fa-file'
        } else if (node.collapsed) {
          icon = 'fa-folder'
        }

        return icon
      },
      getDateAdded(node) {
        return new Date(node.dateAdded).toISOString().substr(0, 10)
      },
    },
    name: 'bm-tree',
  }
</script>

<style lang="scss">
  .BMTree {
    &-root {
      list-style: none;
    }
    &-time {
      font-size: .8em;
      font-style: italic;
      padding: 0 .3em;
    }
    &-node {
      &_collapsed {
        .BMTree-root {
          display: none;
        }
      }
    }
  }
</style>
