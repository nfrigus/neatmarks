const browser = require('./browser')


describe('browser', function () {
  this.timeout(1e6)
  before(browser.init)
  afterEach(async () => {
    const page = await browser.getPage()
    return await page.assertNoConsoleErrors()
  })

  describe('keyboard tabs navigation', () => {
    before(() => browser.navigate('options'))

    ;[
      ['open tabs', '1', '.TabList'],
      ['open bookmarks', '2', '.BMTree-root'],
      ['open settings', '3', 'form'],
    ].map(([action, key, selector]) =>
      it(`${action} with ${key} key`, async () => {
        const page = await browser.getPage()
        await page.keyboard.press(key)
        await page.assertExists(selector)
      }))
  })

  after(browser.close)
})
