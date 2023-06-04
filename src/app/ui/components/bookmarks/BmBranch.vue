<template>
  <ul class="BmBranch">
    <li
      v-for="node in entries"
      :key="node.id"
      :class="getClassList(node)"
      :title="getTitle(node)"
    >
      <div :data-bm-id="node.id" class="BmBranch-Item" draggable="true" @click="toggleCollapsed(node)">
        <div class="BmBranch-Icon" :title="node.id">
          <Icon v-if="isFolder(node)">
            {{ getFaIconName(node) }}
          </Icon>
          <img v-else :src="getIconSrc(node)" srcset="/icons/16.png" />
        </div>
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

  function getBmType(node) {
    return node.url ? 'link' : 'folder'
  }

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
              this.attr[node.id] = {
                collapsed: false,
                removed: false,
              }
            })
        },
      },
      forceCollapse(value) {
        this.entries.forEach(node => {
          this.setCollapsed(node, value)
        })
      },
    },
    methods: {
      // region Collapse status methods
      setCollapsed(node, value) {
        this.attr[node.id].collapsed = value
      },
      isCollapsed(node) {
        return this.attr[node.id].collapsed
      },
      toggleCollapsed(node) {
        this.attr[node.id].collapsed = !this.isCollapsed(node)
      },
      // endregion

      // region Remove status methods
      setRemoved(node, value) {
        this.attr[node.id].removed = value
      },
      isRemoved(node) {
        return this.attr[node.id].removed
      },
      // endregion

      getFaIconName(node) {
        switch (getBmType(node)) {
          case 'link':
            return 'file'
          case 'folder':
            return this.isCollapsed(node)
              ? 'folder'
              : 'folder-open'
          default:
            const msg = `${node.id}: unable to detect node type`
            console.error(msg)
            throw new Error(msg)
        }
      },
      getIconSrc: node => `chrome://favicon/size/16@1x/${encodeURI(node.url)}`,
      isFolder: node => getBmType(node) === 'folder',
      getTrashIcon(node) {
        return this.isRemoved(node) ? 'reply' : 'trash'
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
          'BmBranch-node_collapsed': this.isCollapsed(node),
          'BmBranch-node_deleted': this.isRemoved(node),
        }
      },
      replaceNode(prev, next) {
        const origin = this.nodes.find(i => i.id === prev.id)

        Object.assign(origin, next)
        Object.assign(prev, next)
      },
      onTrashBtnClick(node) {
        const isRemoved = !this.isRemoved(node)

        if (isRemoved) {
          this.$emit('bookmark:remove', node.id)
        } else {
          this.$emit('bookmark:restore', {
            next: next => this.replaceNode(node, next),
            node: this.nodes.find(i => i.id === node.id),
          })
        }

        this.setRemoved(node, isRemoved)
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

    &-Icon {
      display: inline-block;
      height: 16px;
      line-height: 18px;
      text-align: center;
      vertical-align: middle;
      width: 16px;
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
