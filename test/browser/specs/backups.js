const { before, describe, it } = global
const browser = require('../browser')
const DATA = require('../data/bookmarks.json')


describe('backups', () => {
  let backupsCount = 0

  before(() => browser.navigate('backup'))
  beforeEach(async () => {
    backupsCount = await browser.page.$eval('.BackupsList-Table', node => node.childElementCount)
  })

  it('initial backup', async () => {
    backupsCount.should.equal(1, 'Initial backup should be created')
  })

  it('create backup', async () => {
    browser.click('.BackupsList-Header a').catch()
    await browser.page.waitFor(`.BackupsList-Row:nth-child(${backupsCount + 1})`)
  })

  it('create backup before restoring', async () => {
    browser.click('.BackupsList-Row:nth-child(1) a').catch()
    await new Promise(r => setTimeout(r, 1e2))
    await browser.page.dialog.accept()
    await browser.page.waitFor(`.BackupsList-Row:nth-child(${backupsCount + 1})`)
  })

  it('clear bookmarks', async () => {
    await browser.app.setBookmarks(DATA.backup.base)
    await browser.app.clearBookmarks()
    await browser.app.getBookmarks()
      .then(normalizeBookmarks)
      .should.eventually.eql(DATA.empty)
  })

  Object.entries(DATA.backup)
    .forEach(([name, data]) =>
      it(`restore backup: ${name}`, async () => {
        await browser.app.setBookmarks(data)
        await browser.app.clearBackups()
        await browser.app.createBackup()
        await browser.app.clearBookmarks()
        await browser.app.reload()
        await browser.page.waitFor('.BackupsList-Row:nth-child(1)')

        browser.click('.BackupsList-Row:nth-child(1) a').catch()
        await new Promise(r => setTimeout(r, 1e2))
        await browser.page.dialog.accept()
        await browser.page.waitFor('.BackupsList-Row:nth-child(2)')

        await browser.app.getBookmarks()
          .then(normalizeBookmarks)
          .should.eventually.eql(data)
      }))
})

function normalizeBookmarks(tree) {
  return tree.map(bm => {
    const link = {
      title: bm.title,
    }

    if (bm.children) {
      link.children = normalizeBookmarks(bm.children)
    }

    if (bm.url) {
      link.url = bm.url
    }

    return link
  })
}
