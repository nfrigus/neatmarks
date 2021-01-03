<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<script lang="ts">
  import AppRouter from './routes'
  import { AppLayout } from './ui'

  export default {
    el: '#app',
    comments: { AppLayout },
    router: new AppRouter(),
  }
</script>
