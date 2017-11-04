import BM from "./lib/bookmark"
import storage from "./lib/storage"
import BMAO from "./dao/bookmarks"


const DELAY = 500

chrome.commands.onCommand.addListener((...args) => console.log('Command:', ...args))

// todo: Enable config sync across devices with `chrome.storage.sync`-api
// https://developer.chrome.com/extensions/storage#property-sync
// todo: Simplify bookmarks ordering configs
const state = {
  queue_delayed: [], // if option "create_delay" is true then keep track of which ids and folders will be sorted once option "create_delay_detail" seconds have passed
  delay_timer: '', // used to keep track of one setTimeout call when the option create_delay is enabled and a bookmark onCreate event has happened
  log: true, // make sure this is false when publishing to the chrome web store
  is_import_active: false, // true if bookmarks are actively being imported
  status: {
    listeners_active: false, // true if maintenance listeners are active
    sort_active: 0      // if greater than 0, delay activation of the maintenance listeners
  },
  option: storage.get('bookmarks_sorting', {
    enabled: true,
    order_by: 'alpha', // alpha | alphaReverse | date | dateReverse | url | urlReverse
    create_delay: 1,
    create_delay_detail: 45,
  }),
}

// keep track of which folder IDs have been queued for sorting
const sortQueue = {
  _items: [],
  push(id) {
    return this._items.push(id)
  },
  pop(id) {
    let index = this._items.indexOf(id)
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

// keep track of the sort order for a particular folder while it is being processed
const reorderQueue = {
  _items: [],
  has(parent_id) {
    return this._items.some(queue => queue[0] == parent_id)
  },
  pop(item) {
    let index = this._items.indexOf(item)
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
    return this._items.find(item => item[0] == parent_id)
  },
}

// Utils
function log(...args) {
  if (state.log) {
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

  sortQueue.push(parent_id) // add parent_id to the array so we can detect and ignore duplicate requests
  // Chrome seems to lock the bookmarks for just an instant after a user does something. We have to be polite and wait to organize them.
  setTimeout(() => populateSortQueue(id, parent_id), DELAY)
}

function init({bookmarks, extension}) {
  extension.onMessage.addListener(stop_collaborate_and_listen)

  bookmarks.onImportBegan.addListener(onImportBegan)
  bookmarks.onImportEnded.addListener(onImportEnded)
  bookmarks.onMoved.addListener(onMoveSortInfoHandler) // this listener is always active by intention

  runTreeSort()
  // wait a short while before attempting to activate bookmark change listeners
  // so we don't get notified about our own initial sorting activity
    .then(() => setTimeout(() => attachListeners({bookmarks}), 1e3))
    .catch(console.error)
}
function attachListeners({bookmarks}) {
  if (state.status.sort_active > 0) {
    // sorting is still active, will try to activate listeners again in DELAY milliseconds
    setTimeout(() => attachListeners({bookmarks}), DELAY)
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
  return BMAO.getChildren(id)
    .then(bookmarks => bookmarks
      .forEach(({id}) => populateSortQueue(id, id, 'recurse')))
}
function populateSortQueue(id, parent_id = id, recurse = false) {
  parent_id = int(parent_id)

  BMAO.getChildren(parent_id)
    .then(childrens => {
      if (recurse) {
        // Recurse folders
        childrens
          .filter(BM.isFolder)
          .forEach(bm => populateSortQueue(bm.id, bm.id, recurse))
      }

      if (state.option.enabled && childrens.length > 1) {
        // we have a non-empty folder with more than 1 item so sort it
        const before = hashIndexes(childrens)
        childrens.sort(BM.getSorterBy(state.option.order_by))
        const after = hashIndexes(childrens)

        log('populateSortQueue', parent_id, before, after)

        if (before !== after) {
          const [{parentId}] = childrens
          // check because in a very specific timing sensitive scenario
          // (usually initiated by resorting everything because an option changed)
          // things can get added twice
          if (reorderQueue.has(parent_id)) return log('populateSortQueue', parent_id, 'already added')

          reorderQueue.push(parentId, childrens, 0)

          return runReorderQueue(parentId)
        }
      }

      if (state.status.listeners_active) {
        // remove folder from the queue but only if the listeners are active (aka we finished the initial import)
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
    .then(children => {
      const queued = reorderQueue.find(parentId)
      log('runReorderQueue > reorder queue item', queued)

      if (!queued) return log('runReorderQueue > missing')
      let [
        ,
        ordered_items,
        index,
      ] = queued

      // we only want to move bookmarks we have to in order to minimize the hit against Chrome's quota system
      // so we will check every item individually and see if its index needs to be updated
      // why check each item instead of doing it ahead of time? index numbers can shift as bookmarks are reordered
      for (; index < ordered_items.length; index++) {
        const ordered = ordered_items[index]
        const current = children.find(item => item.id === ordered.id)

        queued[2] = int(queued[2]) + 1 // increment our position value for next time

        if (index !== current.index) {
          log('runReorderQueue > Moving', ordered.id, {parentId, index})
          BMAO
            .move(ordered.id, {parentId, index})
            .catch(console.error)
          break
        }
      }

      if (queued[2] >= queued[1].length) { // we are done
        log('reorder_queue > Removing information from both queues for id ' + parentId)
        reorderQueue.pop(queued) // remove information from this array since we are done reordering this folder
        sortQueue.popAsync(parentId) // remove parent id from global array
      }
    })
    .catch(console.error)

  state.status.sort_active--
}

// Listeners
function onCreatedListener(id, bookmark) {
  if (state.is_import_active) return
  log('onCreated > id = ' + id)

  if (state.option.create_delay) {
    clearTimeout(state.delay_timer)
    state.queue_delayed.push([id, bookmark.parentId])
    state.delay_timer = setTimeout(delay_sort, state.option.create_delay_detail * 1e3)
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
function onChangedListener(id, changeInfo) {
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
function onChildReorderListener(id, reorderInfo) {
  if (state.is_import_active) return
  // seems like onChildrenReordered only gets called if you use the 'Reorder by Title' function in the Bookmark Manager
  log('onChildrenReordered > id = ' + id)
}
function onImportBegan() {
  state.is_import_active = true
  log('Import began')
}
function onImportEnded() {
  log('Import finished')
  BMAO.getChildren()
    .then(o => {
      for (const {id} of o) {
        sortQueue.push(id)
        populateSortQueue(id, id, 'recurse')
      }
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
  // Ice is back with a brand new function
  switch (request.request) {
    case 'options':
      sendResponse(state.option)
      break
    case 'options_set':
      state.option = request.option // overwrite our local copy of options with any potentially changed values
      storage.merge('bookmarks_sorting', state.option)

      sendResponse({'message': 'thanks'})
      runTreeSort().catch(console.error)
      break
  }
}


init(window.chrome)
