<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>

<script>
  import Layout from './AppLayout.vue'
  import 'iview/dist/styles/iview.css'


  const keyActions = {
    1() { this.$router.push({ name: 'tabs' }) },
    2() { this.$router.push({ name: 'bookmarks' }) },
    3() { this.$router.push({ name: 'options' }) },
  }

  export default {
    components: {
      Layout,
    },
    mounted() {
      document.addEventListener('keyup', event => {
        const keyAction = keyActions[event.key]
        if (keyAction) keyAction.call(this)
      })
    },
  }
</script>

<style lang="scss">
  $fa-font-path: "~font-awesome/fonts";
  @import "~font-awesome/scss/font-awesome.scss";
</style>
