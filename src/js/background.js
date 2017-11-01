import storage from "./lib/storage"


chrome.commands.onCommand.addListener((...args) => console.log('Command:', ...args))

// todo: Enable config sync across devices with `chrome.storage.sync`-api
// https://developer.chrome.com/extensions/storage#property-sync
// todo: Simplify bookmarks ordering configs
const s = {
  a: { // arrays
    delay_queue: [],   // if option "create_delay" is true then keep track of which ids and folders will be sorted once option "create_delay_detail" seconds have passed
    reorder_queue: [], // keep track of the sort order for a particular folder while it is being processed
    sort_queue: []     // keep track of which folder IDs have been queued for sorting
  },
  delay_timer: '', // used to keep track of one setTimeout call when the option create_delay is enabled and a bookmark onCreate event has happened
  log: true, // make sure this is false when publishing to the chrome web store
  status: {
    import_active: false, // true if bookmarks are actively being imported
    listeners_active: false, // true if maintenance listeners are active
    sort_active: 0      // if greater than 0, delay activation of the maintenance listeners
  },
  version: {
    current() {
      return chrome.app.getDetails().version
    },
    local(version) {
      if (version) {
        storage.set('version', version)
      }

      return storage.get('version')
    },
  },
  option: storage.get('bookmarks_sorting', {
    enabled: true,
    order_by: 'alpha', // alpha | alphaReverse | date | dateReverse | url | urlReverse
    create_delay: 1,
    create_delay_detail: 45,
  }),
  delay_sort,
  get_ancestor_then_sort,
  init,
  listeners,
  recent_folders_search,
  reorder,
  reorder_queue,
  resort,
  sort,
  sort_buffer,
}


function log(...args) {
  if (s.log) {
    console.log(...args)
  }
}
function int(val) {
  return parseInt(val, 10)
}
function stop_collaborate_and_listen(request, sender, sendResponse) {
  // Ice is back with a brand new function
  switch (request.request) {
    case 'options':
      sendResponse(s.option)
      break
    case 'options_set':
      s.option = request.option // overwrite our local copy of options with any potentially changed values
      storage.merge(s.option)

      sendResponse({'message': 'thanks'})
      s.resort()
      break
  }
}
function delay_sort() {
  var i = s.a.delay_queue.length
  log('delay_sort processing queued up bookmarks.')
  while (i--) {
    s.sort_buffer(s.a.delay_queue[i][0], s.a.delay_queue[i][1]) // bookmark id, parent folder id
  }
  s.a.delay_queue = []
}
function get_ancestor_then_sort(id, relay_id, parent_id, recurse) {
  chrome.bookmarks.get(id.toString(), o => {
    if (typeof o === 'undefined' || int(o[0].parentId) === 0) {
      // oops, the bookmark we wanted to sort has been deleted before we could get to it
      return s.sort(relay_id, parent_id, recurse, id)
    }

    // keep searching for the eldest ancestor
    return s.get_ancestor_then_sort(o[0].parentId, relay_id, parent_id, recurse)
  })
}
function init() {
  chrome.bookmarks.onImportBegan.addListener(function () {
    s.status.import_active = true
    log('Import began')
  })
  chrome.bookmarks.onImportEnded.addListener(function () {
    log('Import finished')
    chrome.bookmarks.getChildren('0', o => {
      for (const {id} of o) {
        s.a.sort_queue.push(id)
        s.sort(id, id, 'recurse')
      }
      s.status.import_active = false
    })
  })
  chrome.bookmarks.onMoved.addListener((id, moveInfo) => { // this listener is always active by intention
    if (s.status.import_active) return
    log('onMoved (all time) > id = ' + id)
    s.reorder_queue(moveInfo.parentId)
  })
  chrome.bookmarks.getChildren('0', o => {
    for (const {id} of o) {
      s.sort(id, id, 'recurse')
    }
    setTimeout(s.listeners, 500) // wait a short while before attempting to activate bookmark change listeners so we don't get notified about our own initial sorting activity
  })
}
function listeners() {
  if (s.status.sort_active > 0) {
    // sorting is still active, will try to activate listeners again in 500 milliseconds
    setTimeout(s.listeners, 500)
  } else {
    // activate listeners so we can keep things organized
    s.status.listeners_active = true

    chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
      if (!s.status.import_active) {
        log('onCreated > id = ' + id)
        if (s.option.create_delay) {
          clearTimeout(s.delay_timer)
          s.a.delay_queue.push([id, bookmark.parentId])
          s.delay_timer = setTimeout(s.delay_sort, s.option.create_delay_detail + '000')
        } else {
          s.sort_buffer(id, bookmark.parentId)
        }
      }
    })
    chrome.bookmarks.onChanged.addListener(function (id, changeInfo) {
      if (!s.status.import_active) {
        log('onChanged > id = ' + id)
        chrome.bookmarks.get(id, function (a) {
          s.sort_buffer(a[0].id, a[0].parentId)
        })
      }
    })
    chrome.bookmarks.onMoved.addListener(function (id, moveInfo) {
      if (!s.status.import_active) {
        log('onMoved > id = ' + id + ', ' + moveInfo.parentId)
        log(moveInfo)

        s.sort_buffer(id, moveInfo.parentId)
      }
    })
    chrome.bookmarks.onChildrenReordered.addListener(function (id, reorderInfo) {
      // seems like onChildrenReordered only gets called if you use the 'Reorder by Title' function in the Bookmark Manager
      if (!s.status.import_active) {
        log('onChildrenReordered > id = ' + id)
      }
    })
    log('All listeners active.\n')
  }
}
function recent_folders_search(id) {
  id = int(id)
  var i,
    count = 0
  for (i in s.a.recent_folders) {
    if (s.a.recent_folders[i][0] === id) {
      count++
    }
  }
  if (count > 0) {
    return true
  } else {
    return false
  }
}
function reorder(o) {
  var already_exists = false

  for (var i in s.a.reorder_queue) { // check because in a very specific timing sensitive scenario (usually initiated by resorting everything because an option changed) things can get added twice
    if (s.a.reorder_queue[i][0] === o[0].parentId) {
      already_exists = true
    }
  }

  if (!already_exists) {
    s.a.reorder_queue.push([o[0].parentId, o, 0]) // parent id, sorted array, next item to process
    s.reorder_queue(o[0].parentId)
  }
}
function reorder_queue(parent_id) {
  parent_id = int(parent_id)
  log('s.reorder_queue > parent_id = ' + parent_id)

  s.status.sort_active++

  chrome.bookmarks.getChildren(parent_id.toString(), function (oh) {
    var i, o, x, y
    var accurate_index = 0
    parent_id = int(oh[0].parentId)
    for (i in s.a.reorder_queue) {
      if (int(s.a.reorder_queue[i][0]) === parent_id) { // we found the array for our parent object that is being sorted
        log('s.reorder_queue > s.a.reorder_queue[i][0] = ' + s.a.reorder_queue[i][0])
        o = s.a.reorder_queue[i]
        log(o) // Chrome doesn't actually console log array and object values an exact moment in time so results can be a bit different than you expect

        for (x = o[2]; x < o[1].length; x++) {
          // we only want to move bookmarks we have to in order to minimize the hit against Chrome's quota system
          // so we will check every item individually and see if its index needs to be updated
          // why check each item instead of doing it ahead of time? index numbers can shift as bookmarks are reordered

          accurate_index = 0

          for (y = 0; y < oh.length; y++) {
            if (oh[y].id === o[1][x].id) {
              accurate_index = oh[y].index
              y = oh.length + 1
            }
          }

          o[2] = int(o[2]) + 1 // increment our position value for next time

          if (x === accurate_index) {
            // this item is already in the perfect location so we don't have to do anything
            log('s.reorder_queue > id ' + o[1][x].id + ' already in position ' + x)
          } else {
            // move item to the correct index with 0 being the first item
            log('s.reorder_queue > moved id ' + o[1][x].id + ' to position ' + x)
            chrome.bookmarks.move(o[1][x].id, {parentId: parent_id.toString(), index: x})
            x = o[1].length + 1
          }
        }

        if (o[2] >= o[1].length) { // we are done
          log('s.reorder_queue > Removing information from both queues for id ' + parent_id)
          setTimeout(function () {
            s.a.sort_queue.splice(s.a.sort_queue.indexOf(parent_id), 1)
          }, 500) // remove parent id from global array
          s.a.reorder_queue.splice(i, 1) // remove information from this array since we are done reordering this folder
        }
        break
      }
    }
  })

  s.status.sort_active--
}
function resort() {
  chrome.bookmarks.getChildren('0', function (bookmarks) {
    for (const bm of bookmarks) {
      s.sort(bm.id, bm.id, 'recurse')
    }
  })
}
function sort(id, parent_id = id, recurse = false, ancestor) {
  id = int(id)
  parent_id = int(parent_id)

  ancestor = (ancestor === undefined) ? -1 : int(ancestor)

  if (ancestor < 0) {
    s.get_ancestor_then_sort(id, id, parent_id, recurse)
  } else {
    chrome.bookmarks.getChildren(parent_id.toString(), childrens => {
      let allow_recurse = true
      let break_sort = false

      if (!s.option.enabled) {
        log('No need to sort Bookmarks root.')
        break_sort = true
      }

      if (allow_recurse && recurse) {
        for (const i in childrens) {
          if (childrens[i].url === undefined) {
            // we have a folder so recursively call our own function to support unlimited folder depth
            s.sort(childrens[i].id, childrens[i].id, recurse, ancestor)
          }
        }
      }

      if ((break_sort || childrens.length < 2) && s.status.listeners_active) {
        // remove folder from the queue but only if the listeners are active (aka we finished the initial import)
        log('s.sort > No need to reorder, removing parent folder from \'s.a.sort_queue\'')
        setTimeout(() => s.a.sort_queue.splice(s.a.sort_queue.indexOf(parent_id).toString(), 1), 500)
        return
      }

      if (childrens.length < 2) return
      // we have a non-empty folder with more than 1 item so sort it

      // build a string of index values so we can compare against a sorted string to determine if we need to call the reorder function
      const indexBefore = childrens.reduce((p, c) => p + c.index, '')

      childrens.sort(function (a, b) {
        var sort = ''

        var isFolderA = (a.url === undefined) ? true : false
        var isFolderB = (b.url === undefined) ? true : false

        // sort favoring folders first then files
        if (isFolderA && !isFolderB) {
          sort = -1
        } else if (!isFolderA && isFolderB) {
          sort = 1
        }

        if (sort === '') {
          var valA, valB

          if (isFolderA && isFolderB) {
            // sort by title
            valA = title(a)
            valB = title(b)
          } else {
            const sortOrder = s.option.option_bookmarks_order_by || ''

            if (sortOrder === 'alpha' || sortOrder === '') {
              valA = title(a)
              valB = title(b)
            } else if (sortOrder === 'alphaReverse') {
              valA = title(b)
              valB = title(a)
            } else if (sortOrder === 'date') {
              valA = date(b)
              valB = date(a)
            } else if (sortOrder === 'dateReverse') {
              valA = date(a)
              valB = date(b)
            } else if (sortOrder === 'url') {
              valA = url(a)
              valB = url(b)
            } else if (sortOrder === 'urlReverse') {
              valA = url(b)
              valB = url(a)
            } else {
              valA = title(a)
              valB = title(b)
            }
          }

          if (valA < valB) {
            sort = -1
          } else if (valA > valB) {
            sort = 1
          } else {
            sort = 0 // default return value (no sorting)

            // there is a case when two items have the same name they will trade places every sort
            // to combat this we'll get more and more specific so there will never be a 0 sort order returned

            // sort on case
            if (a.title < b.title) {
              sort = -1
            } else if (a.title > b.title) {
              sort = 1
            } else {
              // another 0 so let's get even more specific
              if (a.url < b.url) {
                sort = -1
              } else if (a.url > b.url) {
                sort = 1
              } else {
                // item with the earlier id is going to be first
                if (a.id < b.id) {
                  sort = -1
                } else {
                  sort = 1
                }
              }
            }
          }
        }

        return sort
      })

      const indexAfter = childrens.reduce((p, c) => p + c.index, '')

      if (indexBefore !== indexAfter) {
        log('s.sort > indexBefore = ' + indexBefore)
        log('s.sort > indexAfter = ' + indexAfter)
        return s.reorder(childrens)
      }

      // remove folder from the queue but only if the listeners are active (aka we finished the initial import)
      if (s.status.listeners_active) {
        log('s.sort > No need to reorder, removing parent folder from \'s.a.sort_queue\'')
        setTimeout(() => s.a.sort_queue.splice(s.a.sort_queue.indexOf(parent_id).toString(), 1), 500)
      }
    })
  }

  function title(o) {
    return o.title.toLowerCase()
  }
  function date(o) {
    return (typeof(o.dateAdded) === 'number') ? o.dateAdded : 0
  }
  function url(o) {
    var value = o.url

    if (value === undefined) {
      value = ''
    } else {
      value = o.url.toLowerCase()
      value = value.replace('http://', '').replace('https://', '').replace('ftp://', '').replace('chrome://', '').replace('www.', '')
    }

    return value
  }
}
function sort_buffer(id, parent_id) {
  id = int(id)
  parent_id = int(parent_id)
  log('s.sort_buffer > id = ' + id + ', parent_id = ' + parent_id)
  if (s.a.sort_queue.indexOf(parent_id) !== -1) {
    // we are already sorting or have sorted this directory too recently so ignore this request
    log('s.sort_buffer > Parent Folder already in the queue for sorting.')
  } else {
    s.a.sort_queue.push(parent_id) // add parent_id to the array so we can detect and ignore duplicate requests
    // Chrome seems to lock the bookmarks for just an instant after a user does something. We have to be polite and wait to organize them.
    setTimeout(function () {
      s.sort(id, parent_id, undefined) // undefined because we don't want to sort recursively
    }, 500) // half a second
  }
}


chrome.extension.onMessage.addListener(stop_collaborate_and_listen)
s.init()
