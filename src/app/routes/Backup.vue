<template>
  <BackupsList
    :backups="backups"
    :stats="stats"
    @item:action:backup="createBackup"
    @item:action:delete="remove"
    @item:action:restore="restore"
  />
</template>

<script>
  import {
    createBackup,
    getBackups,
    getCurrentBMStats,
    removeBackup,
  } from '../lib/persistance'
  import BM from '../lib/browser/bookmarks'

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
