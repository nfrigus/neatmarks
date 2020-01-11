<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>

<script>
  import Layout from './AppLayout.vue'
  import 'iview/dist/styles/iview.css'
  import 'font-awesome/scss/font-awesome.scss'

  export default {
    components: { Layout },
  }
</script>
