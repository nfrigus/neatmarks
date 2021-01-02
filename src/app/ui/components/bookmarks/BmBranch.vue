<template>
  <ul class="BmBranch">
    <li
      v-for="node in entries"
      :key="node.id"
      :class="getClassList(node)"
      :title="getTitle(node)"
    >
      <div :data-bm-id="node.id" class="BmBranch-Item" draggable="true" @click="toggleCollapse(node)">
        <Icon v-if="isFolder(node)" :title="node.id">
          {{ getIcon(node) }}
        </Icon>
        <img v-else :src="getIconLink(node)" />
        <a :href="node.url" :title="node.url">{{ node.title }}</a>
        <time class="BmBranch-time">{{ getDateAdded(node) }}</time>
        <div class="BmBranch-ActionBox">
          <a v-if="!isFolder(node)" class="BmBranch-ActionBtn" @click="onTrashBtnClick(node)">
            <Icon>{{ getTrashIcon(node) }}</Icon>
          </a>
        </div>
      </div>
      <BmBranch
        v-if="node.children"
        :force-collapse="forceCollapse"
        :nodes="node.children"
        @bookmark:remove="$emit('bookmark:remove', $event)"
        @bookmark:restore="$emit('bookmark:restore', $event)"
      ></BmBranch>
    </li>
  </ul>
</template>

<script lang="ts">
  import Icon from '../Icon.vue'

  export default {
    name: 'BmBranch',
    components: { Icon },
    props: {
      forceCollapse: { type: Boolean, required: false },
      nodes: { type: Array, required: true },
    },
    data: () => ({
      attr: {},
      entries: [],
    }),
    watch: {
      nodes: {
        immediate: true,
        handler(value) {
          this.entries.splice(0, Infinity, ...value)
        },
      },
      entries: {
        deep: true,
        immediate: true,
        handler(value) {
          value
            .filter(node => !this.attr[node.id])
            .forEach(node => {
              this.$set(this.attr, node.id, {
                collapsed: false,
                isDeleted: false,
              })
            })
        },
      },
      forceCollapse(value) {
        this.entries.forEach(node => {
          this.attr[node.id].collapsed = value
        })
      },
    },
    methods: {
      toggleCollapse(node) {
        this.attr[node.id].collapsed = !this.attr[node.id].collapsed
      },
      getIcon(node) {
        switch (this.getType(node)) {
          case 'link':
            return 'file'
          case 'folder':
            return this.attr[node.id].collapsed
              ? 'folder'
              : 'folder-open'
          default:
            throw new Error()
        }
      },
      getIconLink(node) {
        return `chrome://favicon/size/16@1x/${encodeURI(node.url)}`
      },
      getType(node) {
        return node.url ? 'link' : 'folder'
      },
      isFolder(node) {
        return this.getType(node) === 'folder'
      },
      getTrashIcon(node) {
        return this.attr[node.id].isDeleted ? 'reply' : 'trash'
      },
      getDateAdded(node) {
        return new Date(node.dateAdded).toISOString().substr(0, 10)
      },
      getTitle(node) {
        return `ID: ${node.id}`
      },
      getClassList(node) {
        return {
          'BmBranch-node': 1,
          'BmBranch-node_collapsed': this.attr[node.id].collapsed,
          'BmBranch-node_deleted': this.attr[node.id].isDeleted,
        }
      },
      replaceNode(prev, next) {
        const origin = this.nodes.find(i => i.id === prev.id)

        Object.assign(origin, next)
        Object.assign(prev, next)
      },
      onTrashBtnClick(node) {
        const isDeleted = !this.attr[node.id].isDeleted

        if (isDeleted) {
          this.$emit('bookmark:remove', node.id)
        } else {
          this.$emit('bookmark:restore', {
            next: next => this.replaceNode(node, next),
            node: this.nodes.find(i => i.id === node.id),
          })
        }

        this.attr[node.id].isDeleted = isDeleted
      },
    },
  }
</script>

<style lang="scss">
  .BmBranch {
    list-style: none;

    ul {
      margin-left: 1em;
    }

    &-time {
      font-size: .8em;
      font-style: italic;
      padding: 0 .3em;
    }

    &-node {
      &_collapsed {
        .BmBranch {
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

      > img {
        vertical-align: top;
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
