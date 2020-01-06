<template>
  <div>
    <a @click="createBackup">Create backup</a>
    <BackupsList
      :backups="backups"
      @item:action:delete="remove"
      @item:action:restore="restore"
    />
  </div>
</template>

<script>
  import BackupsList from '../components/BackupsList.vue'
  import {
 createBackup, getBackups, iterateBookmarks, removeBackup,
} from '../lib/persistance'
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
    components: { BackupsList },
    data() {
      return {
        backups: [],
      }
    },
    async mounted() {
      await this.refreshBackups()
    },
    methods: {
      async createBackup() {
        await createBackup()
        await this.refreshBackups()
      },
      async refreshBackups() {
        this.backups = await getBackups()
      },
      async remove(backup) {
        await removeBackup(backup.id)
        await this.refreshBackups()
      },
      async restore(backup) {
        await clearBookmarks()

        const data = prepateCreateData(backup.data)

        await Promise.all([
          [1, data[0].children[0].children],
          [2, data[0].children[1].children],
          [3, data[0].children[2].children],
        ].map(([parentId, data]) => BM.createTree(parentId, data)))

        await this.refreshBackups()
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
