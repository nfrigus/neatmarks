const { before, describe, it } = global
const browser = require('../browser')


describe('keyboard tabs navigation', () => {
  before(() => browser.navigate('options'))

  ;[
    ['open tabs', '1', '.TabList'],
    ['open bookmarks', '2', '.BMTree-root'],
    ['open backups', '3', '.BackupsList'],
    ['open settings', '4', 'form'],
  ].map(([action, key, selector]) =>
    it(`${action} with ${key} key`, async () => {
      await browser.page.keyboard.press(key)
      await browser.page.assertExists(selector)
    }))
})
