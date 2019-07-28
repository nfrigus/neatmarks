const puppeteer = require('puppeteer')


puppeteer
  .defaultArgs({
    headless: false,
  })


describe('browser', function () {
  let browser

  this.timeout(1e6)
  before(async () => {
    browser = await puppeteer.launch()
  })

  describe('keyboard tabs navigation', () => {
    let page

    before(async () => {
      page = await browser.newPage()
      await page.goto('chrome-extension://jcagcimhnijkdeapbckfleadlfehkgle/app.html#/options')
    })
    after(() => browser.close())

    ;[
      ['open tabs', '1', '.TabList'],
      ['open bookmarks', '2', '.BMTree-root'],
      ['open settings', '3', 'form'],
    ].map(([action, key, selector]) =>
      it(`${action} with ${key} key`, async () => {
        await page.keyboard.press(key)
        await assertExists(page, selector)
      }))
  })
})

async function assertExists(page, selector) {
  should.exist(await page.$(selector), `Selector "${selector}" should be present`)
}
