<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<script lang="ts">
  import { createAppRouter } from './routes'
  import { AppLayout } from './ui'

  export default {
    comments: { AppLayout },
    router: createAppRouter(),
  }
</script>
