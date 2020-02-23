module.exports = class AppClient {
  constructor(page) {
    Object.assign(this, {
      page,
    })
  }

  async exec(method, ...args) {
    await this.page.evaluate(new Function(`Promise.resolve(app.${method}(...${JSON.stringify(args)})).then(ret => {window.ret = ret}).catch(console.error)`))

    return this.page.evaluate(() => window.ret)
  }

  async setBookmarks(links) {
    await this.exec('bookmarks.setBookmarks', links)
  }
  async getBookmarks() {
    return this.exec('bookmarks.getBookmarks')
  }
  async clearBookmarks() {
    return this.exec('bookmarks.clearBookmarks')
  }
  async getBackups() {
    return this.exec('backups.getBackups')
  }
  async createBackup() {
    return this.exec('backups.createBackup')
  }
  async clearBackups() {
    return this.exec('backups.clearBackups')
  }

  async sendMessage(payload) {
    await this.page.evaluate(data => window.chrome.extension.sendMessage(data), payload)
  }

  async reload() {
    return this.page.reload()
  }
}
