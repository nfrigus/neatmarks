/* eslint-disable no-param-reassign */
const { bookmarks } = window.chrome || {}

if (!bookmarks) {
  /* eslint-disable no-console */
  console.warn('Unable to access chrome bookmarks api')
} else {
  bookmarks.createTree = createTree
}

module.exports = {
  create,
  createTree,
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
 * @return Promise<BookmarkTreeNode[]>
 */
async function getChildren(id = 0) {
  return new Promise(resolve => bookmarks.getChildren(id.toString(), resolve))
}

/**
 * @param ids String | String[] | Number | Number[]
 * @return Promise<BookmarkTreeNode[]>
 */
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

async function remove(id) {
  return new Promise(resolve => {
    bookmarks.remove(id, resolve)
  })
}

/**
 * @param data {
 *   index,
 *   parentId,
 *   title,
 *   url,
 * }
 *
 * Static parent nodes:
 * 0 - root
 * 1 - "Bookmarks bar"
 * 2 - "Other bookmarks" (default)
 * 3 - "Mobile bookmarks"
 */
async function create(data) {
  return new Promise(resolve => {
    bookmarks.create(data, resolve)
  })
}

async function createTree(parentId, data) {
  isCreateTree(data)

  return _createTree(parentId.toString(), data)
}

async function _createTree(parentId, tree) {
  return Promise.all(tree.map(async node => {
    const _node = Object.assign({ parentId }, node)
    delete _node.children

    const newNode = await create(_node)

    if (node.children) {
      newNode.children = await _createTree(newNode.id, node.children)
    }

    return newNode
  }))
}

function isCreateTree(tree) {
  if (!Array.isArray(tree) || !tree.every(isCreateTreeNode)) {
    throw new Error('Invalid argument')
  }

  return true
}
function isCreateTreeNode(node) {
  return Object.entries(node).every(isCreateTreeEntry)
}
function isCreateTreeEntry([key, value]) {
  const validate = {
    children: v => isCreateTree(v),
    index: v => typeof v === 'number',
    parentId: isString,
    title: isString,
    url: isString,
  }[key]

  return validate && validate(value)
}
function isString(v) {
  return typeof v === 'string'
}
