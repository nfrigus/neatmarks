import BM from '../browser/bookmarks'
import { clearBackups, createBackup, getBackups } from '../service/database'

export default {
  bookmarks: {
    clearBookmarks: BM.removeAll,
    getBookmarks: BM.getTree,
    setBookmarks: BM.setBookmarks,
  },
  backups: {
    clearBackups,
    createBackup,
    getBackups,
  },
}
