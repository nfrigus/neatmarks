export default {
  isFolder,
  getSorterBy,
}

// Constructors
function getSorterBy(orderBy = '') {
  return function bmSortFunction(a, b) {
    const isFolderA = isFolder(a)
    const isFolderB = isFolder(b)

    // sort favoring folders first then files
    if (isFolderA && !isFolderB) return -1
    if (!isFolderA && isFolderB) return 1

    let valA
    let valB

    if (isFolderA && isFolderB) {
      // sort by title
      valA = title(a)
      valB = title(b)
    } else {
      switch (orderBy) {
        case 'date':
          valA = date(b)
          valB = date(a)
          break
        case 'url':
          valA = url(a)
          valB = url(b)
          break
        case 'alpha':
        default:
          valA = title(a)
          valB = title(b)
      }
    }

    if (/Reverse$/.test(orderBy)) {
      ([valA, valB] = [valB, valA])
    }

    if (valA < valB) return -1
    if (valA > valB) return 1

    // there is a case when two items have the same name
    // they will trade places every sort
    // to combat this we'll get more and more specific
    // so there will never be a 0 sort order returned

    // sort on case
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1

    // another 0 so let's get even more specific
    if (a.url < b.url) return -1
    if (a.url > b.url) return 1

    // item with the earlier id is going to be first
    if (a.id < b.id) return -1
    if (a.id > b.id) return 1

    return 0 // default return value (no sorting)
  }
}

// Testers
function isFolder(bm) {
  return bm.url === undefined
}

// Normalized accessors
function title(o) {
  return o.title.toLowerCase()
}
function date(o) {
  return typeof o.dateAdded === 'number' ? o.dateAdded : 0
}
function url(o) {
  let value = o.url

  if (value === undefined) {
    value = ''
  } else {
    value = o.url.toLowerCase()
    value = value.replace(/^(:\/\/|www.)/, '')
  }

  return value
}
