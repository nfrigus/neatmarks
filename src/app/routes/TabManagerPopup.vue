<template>
  <TabsList
    :windows="windows"
    @tab:click="tabClick"
    @tab:close="tabClose"
    @tab:hover="tabHover"
    @window:close="windowClose"
  />
</template>

<script lang="ts">
  import {
    focusWindow,
    getAllWindows,
    getCurrentWindow,
  } from '../browser/windows'

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
   * make the tab active in browser
   * add class 'active' to the corresponding element in the list
   * focuses on it
   *
   * @param {number} tab
   * @param {boolean} changeWindow
   */
  async function goToTab(tab, changeWindow = true) {
    if (changeWindow) await focusWindow(tab.windowId)

    await tabs.update(tab.id, { active: true })
  }

  async function goToTabInBackground(tab) {
    if (!this.isPopup) return

    pauseManagerClose = true
    await goToTab(tab, bgWindowId !== tab.windowId)

    bgWindowId = tab.windowId
    await focusWindow(managerWindowId)
  }

  function closeTab(tab) {
    tabs.remove(tab.id)
    this.windows.forEach(window => {
      window.tabs = window.tabs.filter(t => t.id !== tab.id)
    })
  }
  function closeWindow(window) {
    windows.remove(window.id)
    this.windows = this.windows.filter(w => w.id !== window.id)
  }
  function loadData() {
    getAllWindows()
      .then(windows => this.windows = windows)
  }

  export default {
    props: {
      isPopup: Boolean,
    },
    data() {
      this.loadData()

      return {
        windows: [],
      }
    },
    mounted() {
      getCurrentWindow()
        .then(window => managerWindowId = window.id)
        .then(handleManagerClose)
    },
    methods: {
      loadData,
      tabClick: goToTab,
      tabClose: closeTab,
      tabHover: goToTabInBackground,
      windowClose: closeWindow,
    },
  }
</script>
