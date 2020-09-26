import BM from '../lib/browser/bookmarks'
import { clearBackups, createBackup, getBackups } from '../lib/persistance'

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
