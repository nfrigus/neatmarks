<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>

<script>
  import Layout from './AppLayout.vue'
  import 'iview/dist/styles/iview.css'


  const keyActions = {
    [1]() { this.$router.push('/tabs.html') },
    [2]() { this.$router.push('/bookmarks.html') },
    [3]() { this.$router.push('/options.html') },
  }

  export default {
    mounted() {
      document.addEventListener('keyup', event => {
        const keyAction = keyActions[event.key]
        if (keyAction) keyAction.call(this)
      })
    },
    components: {
      Layout,
    },
  }
</script>

<style lang="scss">
  $fa-font-path: "~font-awesome/fonts";
  @import "~font-awesome/scss/font-awesome.scss";
</style>
