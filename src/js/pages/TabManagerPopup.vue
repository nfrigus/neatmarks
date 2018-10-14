<template>
  <div>
    <ul class="TabList">
      <li v-for="window in windows">
        <h3 class="TabList-Header">
          Window #{{ window.id }}
          <a class="TabList-Close" @click="closeWindow(window.id)">❌</a>
        </h3>
        <ul>
          <li v-for="tab in window.tabs" class="TabList-Item">
            <img class="TabList-Icon" :src="tab.favIconUrl" />
            <a
              :title="tab.url"
              @click="onClick(tab)"
              @mouseover="onHover(tab)"
              class="TabList-Title"
            >{{ tab.title }}</a>
            <a class="TabList-Close" @click="closeTab(tab)">❌</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  .TabList {
    padding: 0 1em;
    white-space: nowrap;
    width: 100%;

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
      width: 100%;
      :hover { text-decoration: underline; }
    }
    &-Close {
      background: #fff;
      bottom: 0;
      display: none;
      position: absolute;
      right: 0;
      text-decoration: none;
      &:hover { text-shadow: #f00 0 0 10px; }
    }
    &-Item:hover &-Close,
    &-Header:hover &-Close { display: block; }
  }
</style>

<script>
  import {
    focusWindow,
    getAllWindows,
    getCurrentWindow,
  } from '../lib/browser/windows'

  const {
    tabs,
    windows,
  } = window.chrome


  let managerWindowId = null
  let bgWindowId = null
  let pauseManagerClose = false

  function handleManagerClose() {
    return windows.onFocusChanged.addListener(newWindowId => {
      if (![
        managerWindowId,
        windows.WINDOW_ID_NONE,
      ].includes(newWindowId)
      ) {
        if (!pauseManagerClose) {
          window.close()
        } else {
          pauseManagerClose = false
        }
      }
    })
  }

  /**
   * make the tab active in browser, and add class 'active' to the corresponding element in the list and focuses on it
   * @param {*} tab
   */
  async function goToTab(tab, changeWindow = true) {
    if (changeWindow) await focusWindow(tab.windowId)

    await tabs.update(tab.id, { active: true })
  }

  async function goToTabInBackground(tab) {
    pauseManagerClose = true
    await goToTab(tab, bgWindowId !== tab.windowId)

    bgWindowId = tab.windowId
    await focusWindow(managerWindowId)
  }

  export default {
    data() {
      this.loadData()

      return {
        query: "",
        windows: [],
      }
    },
    methods: {
      onClick: goToTab,
      onHover: goToTabInBackground,
      closeTab(tab) {
        tabs.remove(tab.id)
        this.windows.forEach(window => {
          window.tabs = window.tabs.filter(t => t.id !== tab.id)
        })
      },
      closeWindow(id) {
        windows.remove(id)
        this.windows = this.windows.filter(w => w.id !== id)
      },
      loadData() {
        getAllWindows()
          .then(windows => this.windows = windows)
      },
    },
    mounted() {
      getCurrentWindow()
        .then(window => managerWindowId = window.id)
        .then(handleManagerClose)
    },
  }
</script>
