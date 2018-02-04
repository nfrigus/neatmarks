<template>
  <div>
    <ul class="TabList">
      <li v-for="(window, index) in windows">
        <h3>Window {{ index + 1 }}</h3>
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
    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &-Icon {
      max-height: 1em;
      max-width: 1em;
    }
    &-Close { }
  }
</style>

<script>
  import {
    focusWindow,
    getAllWindows,
    getCurrentWindow,
  } from '../lib/browser/windows'


  let managerWindowId = null
  let bgWindowId = null
  let pauseManagerClose = false

  function handleManagerClose() {
    return chrome.windows.onFocusChanged.addListener(newWindowId => {
      if (![
          managerWindowId,
          chrome.windows.WINDOW_ID_NONE,
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

    await chrome.tabs.update(tab.id, { active: true })
  }

  async function goToTabInBackground(tab) {
    pauseManagerClose = true
    await goToTab(tab, bgWindowId !== tab.windowId)

    bgWindowId = tab.windowId
    await focusWindow(managerWindowId)
  }

  export default {
    data() {
      getAllWindows()
        .then(windows => this.windows = windows)

      return {
        query: "",
        windows: [],
      }
    },
    methods: {
      onClick: goToTab,
      onHover: goToTabInBackground,
      closeTab(tab) {
        chrome.tabs.remove(tab.id)
        this.windows.forEach(window => {
          window.tabs = window.tabs.filter(t => t.id !== tab.id)
        })
      },
    },
    mounted() {
      getCurrentWindow()
        .then(window => managerWindowId = window.id)
        .then(handleManagerClose)
    },
  }
</script>
