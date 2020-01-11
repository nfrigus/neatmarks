/* eslint-disable
     camelcase,
     consistent-return,
     no-console,
     no-param-reassign,
     no-underscore-dangle,
     prefer-template
*/
import BM from './lib/bookmark'
import storage from './lib/storage'
import browser from './lib/browser'
import BMAO from './dao/bookmarks'
import './commands'


const DELAY = 500

// todo: Enable config sync across devices with `chrome.storage.sync`-api
// https://developer.chrome.com/extensions/storage#property-sync
// todo: Simplify bookmarks ordering configs
/**
 * @param Array queue_delayed
 *     when "orderDelay" is above 0
 *     keep track of which ids and folders will be sorted
 *     once option "orderDelay" seconds have passed
 * @param delay_timer
 *     used to keep track of one setTimeout call
 *     and a bookmark onCreate event has happened
 * @param is_import_active true if bookmarks are actively being imported
 * @param status.listeners_active true if maintenance listeners are active
 * @param status.sort_active if greater than 0, delay activation of the maintenance listeners
 */
const state = {
  queue_delayed: [],
  delay_timer: '',
  is_import_active: false,
  status: {
    listeners_active: false,
    sort_active: 0,
  },
  option: storage.get('bookmarks.order', {
    orderBy: 'none', // none | alpha | alphaReverse | date | dateReverse | url | urlReverse
    orderDelay: 45,
  }),
}

/**
 * keep track of which folder IDs have been queued for sorting
 */
const sortQueue = {
  _items: [],
  push(id) {
    return this._items.push(id)
  },
  pop(id) {
    const index = this._items.indexOf(id)
    if (index === -1) return
    setTimeout(() => this._items.splice(index, 1), DELAY)
  },
  popAsync(id) {
    setTimeout(() => this.pop(id), DELAY)
  },
  has(id) {
    return this._items.indexOf(id) !== -1
  },
}

/**
 * keep track of the sort order for a particular folder while it is being processed
 */
const reorderQueue = {
  _items: [],
  has(parent_id) {
    return this._items.some(queue => +queue[0] === +parent_id)
  },
  pop(item) {
    const index = this._items.indexOf(item)
    if (index === -1) return
    return this._items.splice(index, 1)
  },
  push(id, childrens, next_id) {
    return this._items.push([
      id,
      childrens,
      next_id,
    ]) // parent id, sorted array, next item to process
  },
  find(parent_id) {
    return this._items.find(item => +item[0] === +parent_id)
  },
}

// Utils
function log(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}
function int(val) {
  return parseInt(val, 10)
}

function sort_buffer(id, parent_id) {
  id = int(id)
  parent_id = int(parent_id)
  log('sort_buffer > id = ' + id + ', parent_id = ' + parent_id)

  if (sortQueue.has(parent_id)) {
    // we are already sorting or have sorted this directory too recently so ignore this request
    return log('sort_buffer > Parent Folder already in the queue for sorting.')
  }

  // add parent_id to the array so we can detect and ignore duplicate requests
  sortQueue.push(parent_id)

  // Chrome seems to lock the bookmarks for just an instant after a user does something.
  // We have to be polite and wait to organize them.
  setTimeout(() => populateSortQueue(id, parent_id), DELAY)
}

function init({ bookmarks, extension }) {
  extension.onMessage.addListener(stop_collaborate_and_listen)

  bookmarks.onImportBegan.addListener(onImportBegan)
  bookmarks.onImportEnded.addListener(onImportEnded)
  bookmarks.onMoved.addListener(onMoveSortInfoHandler) // always active by intention

  runTreeSort()
  // wait a short while before attempting to activate bookmark change listeners
  // so we don't get notified about our own initial sorting activity
    .then(() => setTimeout(() => attachListeners({ bookmarks }), 1e3))
    .catch(console.error)
}
function attachListeners({ bookmarks }) {
  if (state.status.sort_active > 0) {
    // sorting is still active, will try to activate listeners again in DELAY milliseconds
    setTimeout(() => attachListeners({ bookmarks }), DELAY)
  } else {
    // activate listeners so we can keep things organized
    state.status.listeners_active = true

    bookmarks.onCreated.addListener(onCreatedListener)
    bookmarks.onChanged.addListener(onChangedListener)
    bookmarks.onMoved.addListener(onMovedListener)
    bookmarks.onChildrenReordered.addListener(onChildReorderListener)

    log('Listeners active.')
  }
}

async function runTreeSort(id = 0) {
  /* eslint-disable no-shadow */
  return BMAO.getChildren(id)
    .then(bookmarks => bookmarks
      .forEach(({ id }) => populateSortQueue(id, id, 'recurse')))
}
function populateSortQueue(id, parent_id = id, recurse = false) {
  parent_id = int(parent_id)

  BMAO.getChildren(parent_id)
    .then((childrens) => {
      if (recurse) {
        // Recurse folders
        childrens
          .filter(BM.isFolder)
          .forEach(bm => populateSortQueue(bm.id, bm.id, recurse))
      }

      if (state.option.orderBy && state.option.orderBy !== 'none' && childrens.length > 1) {
        // we have a non-empty folder with more than 1 item so sort it
        const before = hashIndexes(childrens)
        childrens.sort(BM.getSorterBy(state.option.orderBy))
        const after = hashIndexes(childrens)

        log('populateSortQueue', parent_id, before, after)

        if (before !== after) {
          const [{ parentId }] = childrens
          // check because in a very specific timing sensitive scenario
          // (usually initiated by resorting everything because an option changed)
          // things can get added twice
          if (reorderQueue.has(parent_id)) return log('populateSortQueue', parent_id, 'already added')

          reorderQueue.push(parentId, childrens, 0)

          return runReorderQueue(parentId)
        }
      }

      if (state.status.listeners_active) {
        // remove folder from the queue but only if the listeners are active
        // aka we finished the initial import
        log('sort > No need to reorder, removing parent folder from \'state.queue_sort\'')
        sortQueue.popAsync(parent_id)
      }
    })
    .catch(console.error)

  function hashIndexes(bookmarks) {
    return bookmarks.map(c => c.index).join()
  }
}
function runReorderQueue(parentId) {
  parentId = int(parentId)
  log('runReorderQueue > parent_id = ' + parentId)

  state.status.sort_active++

  BMAO.getChildren(parentId)
    .then((children) => {
      const queued = reorderQueue.find(parentId)
      log('runReorderQueue > reorder queue item', queued)

      if (!queued) return log('runReorderQueue > missing')
      const ordered_items = queued[1]

      // we only want to move bookmarks we have to
      // in order to minimize the hit against Chrome's quota system
      // so we will check every item individually
      // and see if its index needs to be updated
      // why check each item instead of doing it ahead of time?
      // index numbers can shift as bookmarks are reordered
      for (let index = queued[2]; index < ordered_items.length; index++) {
        const ordered = ordered_items[index]
        const current = children.find(item => item.id === ordered.id)

        queued[2] = int(queued[2]) + 1 // increment our position value for next time

        if (index !== current.index) {
          log('runReorderQueue > Moving', ordered.id, { parentId, index })
          BMAO
            .move(ordered.id, { parentId, index })
            .catch(console.error)
          break
        }
      }

      if (queued[2] >= queued[1].length) {
        log('reorder_queue > Removing information from both queues for id ' + parentId)
        reorderQueue.pop(queued)
        sortQueue.popAsync(parentId)
      }
    })
    .catch(console.error)

  state.status.sort_active--
}

// Listeners
function onCreatedListener(id, bookmark) {
  if (state.is_import_active) return
  log('onCreated > id = ' + id)

  if (state.option.orderDelay) {
    clearTimeout(state.delay_timer)
    state.queue_delayed.push([id, bookmark.parentId])
    state.delay_timer = setTimeout(delay_sort, state.option.orderDelay * 1e3)
  } else {
    sort_buffer(id, bookmark.parentId)
  }

  function delay_sort() {
    log('delay_sort processing queued up bookmarks.')
    state.queue_delayed
      .reverse()
      // item = [bookmark id, parent folder id]
      .forEach(item => sort_buffer(...item))

    state.queue_delayed = []
  }
}
function onChangedListener(id) {
  if (state.is_import_active) return
  log('onChanged > id = ' + id)
  BMAO.get(id)
    .then(a => sort_buffer(a.id, a.parentId))
    .catch(console.error)
}
function onMovedListener(id, moveInfo) {
  if (state.is_import_active) return
  log('onMoved > id = ' + id + ', ' + moveInfo.parentId, moveInfo)

  sort_buffer(id, moveInfo.parentId)
}
function onChildReorderListener(id) {
  if (state.is_import_active) return
  // seems like onChildrenReordered only gets called
  // if you use the 'Reorder by Title' function in the Bookmark Manager
  log('onChildrenReordered > id = ' + id)
}
function onImportBegan() {
  state.is_import_active = true
  log('Import began')
}
function onImportEnded() {
  log('Import finished')
  BMAO.getChildren()
    .then((childrens) => {
      childrens.forEach(({ id }) => {
        sortQueue.push(id)
        populateSortQueue(id, id, 'recurse')
      })
      state.is_import_active = false
    })
    .catch(console.error)
}
function onMoveSortInfoHandler(id, moveInfo) {
  if (state.is_import_active) return
  log('onMoved (all time) > id = ' + id)
  runReorderQueue(moveInfo.parentId)
}
function stop_collaborate_and_listen(request, sender, sendResponse) {
  switch (request.request) {
    case 'options.get':
      sendResponse(state.option)
      break
    case 'options.set':
      state.option = request.option
      storage.merge('bookmarks.order', state.option)

      sendResponse({ message: 'saved' })
      runTreeSort().catch(console.error)
      break
    default:
      console.error('Unexpected request')
  }
}


init(browser)
