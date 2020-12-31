<template>
  <ul class="BMTree-root">
    <li
      v-for="node in nodes"
      :key="node.id"
      :class="getClassList(node)"
      :title="getTitle(node)"
    >
      <div :data-bm-id="node.id" class="BMTree-Item" draggable="true" @click="toggle(node)">
        <i :class="{fa: 1, [getIcon(node)]: 1}" :title="node.id"></i>
        <a :href="node.url" :title="node.url">{{ node.title }}</a>
        <time class="BMTree-time">{{ getDateAdded(node) }}</time>
        <div class="BMTree-ActionBox">
          <a v-if="!isFolder(node)" class="BMTree-ActionBtn" @click="onTrashBtnClick(node)">
            <i :class="{fa: 1, [getTrashIcon(node)]: 1}"></i>
          </a>
        </div>
      </div>
      <bm-tree
        v-if="node.children"
        :nodes="node.children"
        @bookmark:remove="remove"
        @bookmark:restore="restore"
      ></bm-tree>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'BmTree',
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
      getIconLink(node) {
        return `chrome://favicon2/?size=16&page_url=${encodeURI(node.url)}`
      },
      getType(node) {
        return node.url ? 'link' : 'folder'
      },
      isFolder(node) {
        return this.getType(node) === 'folder'
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
      getClassList(node) {
        return {
          'BMTree-node': 1,
          'BMTree-node_collapsed': node.collapsed,
          'BMTree-node_deleted': node.isDeleted,
        }
      },
      async remove(payload) {
        const _payload = payload.$el ? payload : { $el: this, node: payload }
        this.$emit('bookmark:remove', _payload)
      },
      async restore(payload) {
        const _payload = payload.$el ? payload : { $el: this, node: payload }
        this.$emit('bookmark:restore', _payload)
      },
      onTrashBtnClick(node) {
        if (node.isDeleted) {
          this.restore(node)
        } else {
          this.remove(node)
        }
      },
    },
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

      &_deleted {
        opacity: .5;
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

      &:hover {
        color: red;
      }
    }
  }
</style>
