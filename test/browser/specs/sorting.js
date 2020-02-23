const {
  before,
  describe,
  it,
} = require('mocha')
const browser = require('../browser')
const DATA = require('../data/bookmarks.json')

describe('sorting', () => {
  before(async () => {
    await browser.navigate('options')
    await browser.app.setBookmarks(DATA.sorting.base)
  })
  after(async () => {
    await browser.app.clearBookmarks()
    await setOptions({
      orderBy: 'none',
      orderDelay: 45,
    })
  })

  it('sorting disabled by default', async () => assertOptions(['none']))

  ;[
    ['title asc', 'alpha'],
    ['title desc', 'alphaReverse'],
    ['url asc', 'url'],
    ['url desc', 'urlReverse'],
  ].forEach(([name, orderBy]) => it(`sort by ${name}`, async () => {
    await setOptions({
      orderBy,
      orderDelay: 0,
    })

    const bm = await browser.app.getBookmarks()

    bm[0].children[0].children.map(i => i.title).should.eqls(DATA.sorting.expect[orderBy])
  }))

  async function setOptions(option) {
    await browser.app.sendMessage({ request: 'options.set', option })
    await browser.app.reload()
  }
  async function assertOptions(values) {
    const defaultValues = await browser.page.$$eval('[name^="options."]', nodes => nodes.map(node => node.value))
    defaultValues.should.eqls(values)
  }
})
