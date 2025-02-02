require('should')
const puppeteer = require('puppeteer')
const AppClient = require('./AppClient')

const pages = []
let browser, app


module.exports = {
  assertExists,
  click,
  close,
  get app() { return app },
  get page() { return pages[0] },
  getPage,
  init: getBrowser,
  navigate,
}


async function getPage(index = 0) {
  if (!pages[index]) {
    const browser = await getBrowser()
    const page = await browser.newPage()
    pages[index] = patchPage(page)
  }

  return pages[index]
}

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch()
    pages.push(...(await browser.pages()).map(patchPage))

    await navigate('options')
    app = new AppClient(pages[0]);
  }

  return browser
}

async function navigate(path, page) {
  const _page = page || await getPage()

  await _page.goto(`chrome-extension://phbiinjepjdlfkehhdnglckceccheidc/app.html#/${path}`)
}

async function click(selector, page) {
  const _page = page || await getPage()

  await _page.click(selector)
}

async function close() {
  if (browser) {
    browser.close()
    browser = null
  }
}

function patchPage(page) {
  let log = []

  Object.assign(page, {
    assertExists: assertExists.bind(page),
    assertNoConsoleErrors: assertNoConsoleErrors.bind(page),
  })

  page.on('console', msg => log.push(msg))
  page.on('dialog', dialog => Object.assign(page, { dialog }))

  return page

  function assertNoConsoleErrors() {
    const errors = log.filter(msg => msg.type() === 'error')

    if (errors.length) {
      throw errors[0].text()
    }
  }
}

async function assertExists(selector) {
  should.exist(await this.$(selector), `Selector "${selector}" should be present`)
}
