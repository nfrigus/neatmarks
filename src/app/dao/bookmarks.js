/* eslint-disable no-param-reassign */
const { bookmarks } = window.chrome || {}

if (!bookmarks) {
  /* eslint-disable no-console */
  console.warn('Unable to access chrome bookmarks api')
} else {
  bookmarks.createTree = createTree
}

export default {
  create,
  createTree,
  get,
  getChildren,
  getTree,
  move,
  remove,
  removeAll,
  removeTree,
  setBookmarks,
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

async function setBookmarks(data) {
  const _data = prepateCreateData(data)
  await removeAll()

  const restorable = [
    [1, _data[0].children[0].children],
    [2, _data[0].children[1].children],
  ]

  if (_data[0].children[2]) {
    restorable.push([3, _data[0].children[2].children])
  }

  await Promise.all(restorable.map(([parentId, data]) => createTree(parentId, data)))
}

async function remove(id) {
  return new Promise(resolve => bookmarks.remove(id, resolve))
}

async function removeTree(id) {
  return new Promise(resolve => bookmarks.removeTree(id, resolve))
}

async function removeAll() {
  const current = await getTree()

  const removable = [
    ...current[0].children[0].children, // Bookmarks bar
    ...current[0].children[1].children, // Other bookmarks
  ]

  if (current[0].children[2]) {
    removable.push(...current[0].children[2].children) // Mobile bookmarks
  }

  await Promise.all(removable.map(bm => removeTree(bm.id)))
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
  return new Promise(resolve => bookmarks.create(data, resolve))
}

async function createTree(parentId, data) {
  assertCreateTree(data)

  return _createTree(parentId.toString(), data)
}

async function _createTree(parentId, tree) {
  return Promise.all(tree.map(async node => {
    const _node = { parentId, ...node }
    delete _node.children

    const newNode = await create(_node)

    if (node.children) {
      newNode.children = await _createTree(newNode.id, node.children)
    }

    return newNode
  }))
}

function assertCreateTree(tree) {
  if (!Array.isArray(tree)) {
    throw new Error('Invalid argument')
  }

  tree.every(assertCreateTreeNode)
}
function assertCreateTreeNode(node) {
  return Object.entries(node).every(isCreateTreeAttribute)
}
function isCreateTreeAttribute([key, value]) {
  const validate = {
    children: v => assertCreateTree(v) || true,
    index: v => typeof v === 'number',
    parentId: isString,
    title: isString,
    url: isString,
  }[key]

  if (!validate) {
    throw new Error(`Unexpected attribute ${key}`)
  }

  if (!validate(value)) {
    throw new Error(`Unexpected value "${value}" for attribute ${key}`)
  }
}
function isString(v) {
  return typeof v === 'string'
}


function prepateCreateData(data) {
  const prepared = clone(data)

  const allowedAttrs = [
    'children',
    'index',
    'title',
    'url',
  ]

  iterateBookmarks(prepared, bm => {
    Object.keys(bm)
      .filter(key => !allowedAttrs.includes(key))
      .forEach(key => {
        delete bm[key]
      })
  })

  return prepared
}
function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function iterateBookmarks(tree, iterator) {
  const queue = new Set(tree)

  while (queue.size) {
    queue.forEach(bm => {
      iterator(bm)
      queue.delete(bm)
      if (bm.children && bm.children.length) {
        bm.children.forEach(queue.add, queue)
      }
    })
  }
}
