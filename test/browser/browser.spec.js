const {
  after,
  afterEach,
  before,
  describe,
  it,
} = require('mocha')
const browser = require('./browser')


describe('browser', function () {
  this.timeout(1e4)

  before(browser.init)
  afterEach(() => browser.page.assertNoConsoleErrors())
  after(browser.close)

  require('./specs')
})
