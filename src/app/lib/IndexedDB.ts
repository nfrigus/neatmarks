const operations = {
  add: { write: true },
  getAll: { write: false },
  delete: { write: true },
  clear: { write: true },
}

export default class {
  private connection

  constructor() {
    const request = indexedDB.open('store', 1)

    request.onupgradeneeded = onUpgradeNeeded

    this.connection = promisify(request)
  }

  async exec(store, action, payload) {
    const lock = operations[action].write ? 'readwrite' : 'readonly'
    return this.connection
      .then(db => db.transaction(store, lock).objectStore(store)[action](payload))
      .then(promisify)
  }
}

function onUpgradeNeeded(event) {
  const db = event.target.result

  /* eslint-disable no-fallthrough, default-case */
  switch (event.oldVersion) {
    case 0:
      db.createObjectStore('backups', {
        autoIncrement: true,
        keyPath: 'id',
      })
  }
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
