import EventEmitter from '../lib/EventEmitter'
import { bookmarks, runtime } from '../api/ChromeAPI'

const dispatcher = new EventEmitter()

dispatcher.pipe('app.install', runtime.onInstalled)
dispatcher.pipe('message', runtime.onMessage)

dispatcher.pipe('bookmarks.onChanged', bookmarks.onChanged)
dispatcher.pipe('bookmarks.onChildrenReordered', bookmarks.onChildrenReordered)
dispatcher.pipe('bookmarks.onCreated', bookmarks.onCreated)
dispatcher.pipe('bookmarks.onImportBegan', bookmarks.onImportBegan)
dispatcher.pipe('bookmarks.onImportEnded', bookmarks.onImportEnded)
dispatcher.pipe('bookmarks.onMoved', bookmarks.onMoved)

export default dispatcher
