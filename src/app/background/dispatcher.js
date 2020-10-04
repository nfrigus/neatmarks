import EventEmitter from '../lib/EventEmitter'
import { alarms, bookmarks, runtime } from '../api/ChromeAPI'

const dispatcher = new EventEmitter()

dispatcher.pipe('app.install', runtime.onInstalled)
dispatcher.pipe('message', runtime.onMessage)

dispatcher.pipe('bookmarks.onChanged', bookmarks.onChanged)
dispatcher.pipe('bookmarks.onChildrenReordered', bookmarks.onChildrenReordered)
dispatcher.pipe('bookmarks.onCreated', bookmarks.onCreated)
dispatcher.pipe('bookmarks.onImportBegan', bookmarks.onImportBegan)
dispatcher.pipe('bookmarks.onImportEnded', bookmarks.onImportEnded)
dispatcher.pipe('bookmarks.onMoved', bookmarks.onMoved)

dispatcher.pipe('alarm', alarms.onAlarm)
dispatcher.map('alarm', alarm => alarm.name && `alarm.${alarm.name}`)

export default dispatcher
