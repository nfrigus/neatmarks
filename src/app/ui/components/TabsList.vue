<template>
  <ul class="TabList">
    <li v-for="window in windows" :key="window.id">
      <h3 class="TabList-Header">
        Window #{{ window.id }}
        <a class="TabList-Close" @click="closeWindow(window)">❌</a>
      </h3>
      <ul>
        <li v-for="tab in window.tabs" :key="tab.id" class="TabList-Item">
          <img :src="tab.favIconUrl" class="TabList-Icon" />
          <a
            :title="tab.url"
            class="TabList-Title"
            @click="tabClick(tab)"
            @mouseover="tabHover(tab)"
          >{{ tab.title }}</a>
          <a class="TabList-Close" @click="closeTab(tab)">❌</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
  function closeWindow(window) {
    this.$emit('window:close', window)
  }
  function closeTab(window) {
    this.$emit('tab:close', window)
  }
  function tabHover(tab) {
    this.$emit('tab:hover', tab)
  }
  function tabClick(tab) {
    this.$emit('tab:click', tab)
  }

  export default {
    props: {
      windows: { required: true, type: Array },
    },
    methods: {
      closeTab,
      closeWindow,
      tabClick,
      tabHover,
    },
  }
</script>

<style lang="scss">
  .TabList {
    padding: 0 1em;

    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &-Icon {
      display: inline-block;
      max-height: 1em;
      width: 1em;
    }

    &-Item, &-Header {
      cursor: pointer;
      display: block;
      overflow: hidden;
      position: relative;
    }

    &-Title:hover {
      text-decoration: underline;
    }

    &-Close {
      background: #fff;
      bottom: 0;
      display: none;
      position: absolute;
      right: 0;
      text-decoration: none;

      &:hover {
        text-shadow: #f00 0 0 10px;
      }
    }

    &-Item:hover &-Close,
    &-Header:hover &-Close {
      display: block;
    }
  }
</style>
