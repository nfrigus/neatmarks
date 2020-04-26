const { before, describe, it } = global
const browser = require('../browser')
const DATA = require('../data/bookmarks.json')


describe('backups', () => {
  before(() => browser.navigate('backup'))
  it('no default backups', async () => {
    await browser.page.$eval('.BackupsList-Table', node => node.childElementCount)
      .should.eventually.equal(0, 'No backups by default')
  })

  it('create backup', async () => {
    await browser.page.$eval('.BackupsList-Table', node => node.childElementCount)
      .should.eventually.equal(0, 'No backups by default')

    browser.click('.BackupsList-Header a').catch()
    await browser.page.waitFor('.BackupsList-Row:nth-child(1)')
  })

  it('create backup before restoring', async () => {
    await browser.page.$eval('.BackupsList-Table', node => node.childElementCount)
      .should.eventually.equal(1, 'Expected to have one backup before for this test')

    browser.click('.BackupsList-Row:nth-child(1) a').catch()
    await new Promise(r => setTimeout(r, 1e2))
    await browser.page.dialog.accept()
    await browser.page.waitFor('.BackupsList-Row:nth-child(2)')
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
