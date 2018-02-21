<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>

<script>
  import Layout from './AppLayout.vue'
  import 'iview/dist/styles/iview.css'


  export default {
    components: {
      Layout,
    },
  }
</script>

<style lang="scss">
  $fa-font-path: "~font-awesome/fonts";
  @import "~font-awesome/scss/font-awesome.scss";
</style>
