const browser = require('./browser')


describe('browser', function () {
  this.timeout(1e6)
  before(browser.init)
  afterEach(async () => {
    const page = await browser.getPage()
    return await page.assertNoConsoleErrors()
  })

  describe('sorting', () => {
    const links = [{
      url: "http://b",
      title: "Link C",
      index: 0,
    }, {
      title: "Folder",
      index: 1,
    }, {
      url: "http://c",
      title: "Link A",
      index: 2,
    }, {
      url: "http://a",
      title: "Link B",
      index: 3,
    }]

    before(async () => {
      await browser.navigate('options')
      const page = await browser.getPage()
      await page.evaluate(new Function(`chrome.bookmarks.createTree(1, ${JSON.stringify(links)}).catch(console.error)`))
    })

    it('sorting disabled by default', async () => assertOptions(['none']))

    ;[
      ['title asc', 'alpha', ["Folder", "Link A", "Link B", "Link C"]],
      ['title desc', 'alphaReverse', ["Folder", "Link C", "Link B", "Link A"]],
      ['url asc', 'url', ["Folder", "Link B", "Link C", "Link A"]],
      ['url desc', 'urlReverse', ["Folder", "Link C", "Link B", "Link A"]],
    ].forEach(([name, orderBy, assert]) => it(`sort by ${name}`, async () => {
      await setOptions({
        orderBy,
        orderDelay: 0,
      })

      const bm = await getBookmarks()

      bm.map(i => i.title).should.eqls(assert)
    }))


    async function setOptions(option) {
      const page = await browser.getPage()

      await page.evaluate(option => window.chrome.extension.sendMessage({ request: 'options.set', option }), option)
      await page.reload()
    }
    async function getBookmarks() {
      const page = await browser.getPage()

      await page.evaluate(() => chrome.bookmarks.getSubTree("1", ret => { window.ret = ret }))

      return page.evaluate(() => window.ret[0].children)
    }
    async function assertOptions(values) {
      const page = await browser.getPage()
      const defaultValues = await page.$$eval('[name^="options."]', nodes => nodes.map(node => node.value))
      defaultValues.should.eqls(values)
    }
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
