/* eslint-disable no-param-reassign */
const { bookmarks } = window.chrome || {}

if (!bookmarks) {
  /* eslint-disable no-console */
  console.warn('Unable to access chrome bookmarks api')
}

export default {
  create,
  get,
  getChildren,
  getTree,
  move,
  remove,
}

async function move(id, dest) {
  if (undefined !== dest.parentId) {
    dest.parentId = dest.parentId.toString()
  }

  if (undefined !== dest.index) {
    dest.index = +dest.index
  }

  return new Promise(resolve => bookmarks.move(id.toString(), dest, resolve))
}

/**
 * https://developer.chrome.com/extensions/bookmarks#method-getChildren
 * @param id
 * @return BookmarkTreeNode[]
 */
async function getChildren(id = 0) {
  return new Promise(resolve => bookmarks.getChildren(id.toString(), resolve))
}

async function get(ids) {
  let returnArray = true
  if (!Array.isArray(ids)) {
    returnArray = false
    ids = [ids]
  }
  ids = ids.map(id => id.toString())

  return new Promise(resolve => bookmarks.get(
    ids,
    result => resolve(
      returnArray
        ? result
        : result[0],
    ),
  ))
}

async function getTree() {
  return new Promise(resolve => bookmarks.getTree(resolve))
}

function remove(id) {
  return new Promise(resolve => {
    bookmarks.remove(id, resolve)
  })
}

function create(data) {
  return new Promise(resolve => {
    bookmarks.create(data, resolve)
  })
}
