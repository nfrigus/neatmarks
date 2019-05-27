<template>
  <ul class="BMTree-root">
    <li :key="node.id" v-for="node in nodes" :class="{
      'BMTree-node': 1,
      'BMTree-node_collapsed': node.collapsed
    }" :title="getTitle(node)">
      <div class="BMTree-Item" @click="toggle(node)" draggable="true" :data-bm-id="node.id">
        <i :class="{fa: 1, [getIcon(node)]: 1}" :title="node.id"></i>
        <a :href="node.url" :title="node.url">{{ node.title }}</a>
        <time class="BMTree-time">{{ getDateAdded(node) }}</time>
        <div class="BMTree-ActionBox">
          <a class="BMTree-ActionBtn" @click="onTrashBtnClick(node)" v-if="getType(node) !== 'folder'">
            <i :class="{fa: 1, [getTrashIcon(node)]: 1}"></i>
          </a>
        </div>
      </div>
      <bm-tree v-if="node.children" :nodes="node.children"></bm-tree>
    </li>
  </ul>
</template>

<script>
  import BM from '../dao/bookmarks'

  export default {
    props: {
      nodes: { type: Array, required: true },
    },
    methods: {
      toggle(node) {
        node.collapsed ^= 1
        this.$forceUpdate()
      },
      getIcon(node) {
        switch (this.getType(node)) {
          case 'link':
            return 'fa-file'
          case 'folder':
            return node.collapsed
              ? 'fa-folder'
              : 'fa-folder-open'
          default:
            throw new Error()
        }
      },
      getType(node) {
        return node.url ? 'link' : 'folder'
      },
      getTrashIcon(node) {
        return node.isDeleted ? 'fa-reply' : 'fa-trash'
      },
      getDateAdded(node) {
        return new Date(node.dateAdded).toISOString().substr(0, 10)
      },
      getTitle(node) {
        return `ID: ${node.id}`
      },
      async delete(node) {
        await BM.remove(node.id)
        node.isDeleted = true
        this.$forceUpdate()
      },
      async restore(node) {
        const restored = await BM.create({
          parentId: node.parentId,
          title: node.title,
          url: node.url,
        })

        Object.assign(node, restored)
        node.isDeleted = false
        this.$forceUpdate()
      },
      onTrashBtnClick(node) {
        if (node.isDeleted) {
          this.restore(node)
        } else {
          this.delete(node)
        }
      },
    },
    name: 'bm-tree',
  }
</script>

<style lang="scss">
  .BMTree {
    &-root {
      list-style: none;

      ul {
        margin-left: 1em;
      }
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

    $item-padding-x: 2px;

    &-Item {
      padding: 0 $item-padding-x;
      position: relative;

      &:hover {
        background-color: RGBA(0, 0, 0, .1);
      }
    }

    &-Item:hover &-ActionBox {
      display: block;
    }

    &-ActionBox {
      background: transparent;
      display: none;
      padding: 0 $item-padding-x;
      position: absolute;
      right: $item-padding-x;
      text-decoration: none;
      top: 0;
    }

    &-ActionBtn {
      color: #000;
      filter: invert(1);
    }
  }
</style>
