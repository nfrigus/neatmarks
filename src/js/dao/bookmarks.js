const {bookmarks} = window.chrome || {}

if (!bookmarks) {
  console.warn('Unable to access chrome bookmarks api')
}

export default {
  getChildren,
  get,
  move,
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
async function getChildren(id = 0) {
  return new Promise(resolve => bookmarks.getChildren(id.toString(), resolve))
}
async function get(ids) {
  let return_array = true
  if (!Array.isArray(ids)) {
    return_array = false
    ids = [ids]
  }
  ids = ids.map(id => id.toString())

  return new Promise(resolve => bookmarks.get(
    ids,
    result => resolve(return_array
      ? result
      : result[0],
    ),
  ))
}
