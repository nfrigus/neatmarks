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
  import { createBackup, getBackups, getCurrentBMStats, iterateBookmarks, removeBackup } from '../lib/persistance'
  import BM from '../dao/bookmarks'

  async function clearBookmarks() {
    const current = await BM.getTree()
    await Promise.all([
      ...current[0].children[0].children,
      ...current[0].children[1].children,
      ...current[0].children[2].children,
    ].map(bm => BM.removeTree(bm.id)))
  }

  export default {
    data() {
      return {
        backups: [],
        stats: {},
      }
    },
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
        await clearBookmarks()

        const data = prepateCreateData(backup.data)

        await Promise.all([
          [1, data[0].children[0].children],
          [2, data[0].children[1].children],
          [3, data[0].children[2].children],
        ].map(([parentId, data]) => BM.createTree(parentId, data)))

        await this.refreshData()
      },
    },
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  function prepateCreateData(data) {
    const prepared = clone(data)

    const allowedAttrs = [
      'children',
      'index',
      'title',
      'url',
    ]

    iterateBookmarks(prepared, bm => {
      Object.keys(bm)
        .filter(key => !allowedAttrs.includes(key))
        .forEach(key => {
          delete bm[key]
        })
    })

    return prepared
  }
</script>
