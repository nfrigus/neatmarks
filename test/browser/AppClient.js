module.exports = class AppClient {
  constructor(page) {
    Object.assign(this, {
      page,
    })
  }

  async exec(method, ...args) {
    return this.page.evaluate(new Function(
      `return app.${method}(...${JSON.stringify(args, null, 2)})`,
    ))
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
    await this.page.evaluate(data => chrome.runtime.sendMessage(data), payload)
  }

  async reload() {
    await this.page.reload()
    await this.ready()
  }

  async ready() {
    return new Promise(resolve => this.page.once('domcontentloaded', resolve))
  }
}
