<template>
  <div>
    <app-head></app-head>

    <router-view></router-view>
  </div>
</template>

<script>
  import AppHead from './AppHead.vue'


  export default {
    components: {
      AppHead,
    },
  }
</script>
