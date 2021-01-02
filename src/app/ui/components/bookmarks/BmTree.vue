<template>
  <div class="BmTree">
    <div class="BmTree-Actions">
      <a v-key="'f'" @click="toggleCollapseAll()">
        <Icon>{{ forceCollapse ? 'expand' : 'compress' }}</Icon>
      </a>
      <a v-key="'r'" @click="refresh()">
        <Icon>refresh</Icon>
      </a>
    </div>

    <BmBranch
      :force-collapse="forceCollapse"
      :nodes="nodes"
      @bookmark:remove="$emit('bookmark:remove', $event)"
      @bookmark:restore="$emit('bookmark:restore', $event)"
    ></BmBranch>
  </div>
</template>

<script lang="ts">
  import BmBranch from './BmBranch'
  import Icon from '../Icon'

  export default {
    name: 'BmTree',
    components: { BmBranch, Icon },
    props: {
      nodes: { type: Array, required: true },
    },
    data: () => ({
      forceCollapse: null,
    }),
    methods: {
      toggleCollapseAll() {
        this.forceCollapse = !this.forceCollapse
      },
      refresh() {},
    },
  }
</script>

<style lang="scss">
  .BmTree-Actions {
    font-size: 2em;
  }
</style>
