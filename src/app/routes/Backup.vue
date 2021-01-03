<template>
  <BackupsList
    :backups="backups"
    :stats="stats"
    @item:action:backup="createBackup"
    @item:action:delete="remove"
    @item:action:restore="restore"
  />
</template>

<script lang="ts">
  import {
    createBackup,
    getBackups,
    getCurrentBMStats,
    removeBackup,
  } from '../service/database'
  import BM from '../browser/bookmarks'

  export default {
    data: () => ({
      backups: [],
      stats: {},
    }),
    async mounted() {
      await this.refreshData()
    },
    methods: {
      async createBackup() {
        await createBackup()
        await this.refreshData()
      },
      async refreshData() {
        this.stats = await getCurrentBMStats()
        this.backups = await getBackups()
      },
      async remove(backup) {
        await removeBackup(backup.id)
        await this.refreshData()
      },
      async restore(backup) {
        await createBackup()
        await BM.setBookmarks(backup.data)
        await this.refreshData()
      },
    },
  }
</script>
