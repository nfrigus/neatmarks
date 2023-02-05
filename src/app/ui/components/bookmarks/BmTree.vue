<template>
  <div class="BmTree">
    <div class="BmTree-Actions">
      <a v-key="'f'" @click="toggleCollapseAll()">
        <Icon>{{ forceCollapse ? 'expand' : 'compress' }}</Icon>
      </a>
      <a v-key="'r'" @click="$emit('bookmark:refresh')">
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
  import BmBranch from './BmBranch.vue'
  import Icon from '../Icon.vue'

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
    },
  }
</script>

<style lang="scss">
  .BmTree {
    background: #fff;
  }

  .BmTree-Actions {
    background: RGBA(0, 0, 255, .1);
    font-size: 2em;

    a {
      display: inline-block;
      height: 36px;
      line-height: 36px;
      text-align: center;
      width: 36px;
    }

    a:hover {
      background: RGBA(0, 0, 0, .1);
    }
  }
</style>
