import BM from '../dao/bookmarks'
import Store from './IndexedDB'


const db = new Store()


export async function createBackup() {
  const data = await BM.getTree()

  return db.exec('backups', 'add', {
    createdAt: new Date(),
    data,
    stats: getTreeStats(data),
  })
}
export async function getBackups() {
  return db.exec('backups', 'getAll')
}
export async function removeBackup(id) {
  return db.exec('backups', 'delete', id)
}
export async function clearBackups() {
  return db.exec('backups', 'clear')
}


function getTreeStats(tree) {
  const stats = {
    folders: 0,
    links: 0,
    total: 0,
  }

  iterateBookmarks(tree, bm => stats[bm.url ? 'links' : 'folders']++)

  stats.total = stats.links + stats.folders

  return stats
}

export function iterateBookmarks(tree, iterator) {
  const queue = new Set(tree)

  while (queue.size) {
    queue.forEach(bm => {
      iterator(bm)
      queue.delete(bm)
      if (bm.children && bm.children.length) {
        bm.children.forEach(queue.add, queue)
      }
    })
  }
}
