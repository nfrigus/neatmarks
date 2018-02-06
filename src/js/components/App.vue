<template>
  <div>
    <app-head></app-head>

    <router-view></router-view>
  </div>
</template>

<script>
  import AppHead from './AppHead.vue'
  import 'iview/dist/styles/iview.css'


  export default {
    components: {
      AppHead,
    },
  }
</script>

<style lang="scss">
  $fa-font-path: "~font-awesome/fonts";
  @import "~bootstrap/scss/bootstrap";
  @import "~font-awesome/scss/font-awesome.scss";
</style>
