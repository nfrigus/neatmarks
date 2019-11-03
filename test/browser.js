require('should')
const puppeteer = require('puppeteer')

const pages = []
let browser


module.exports = {
  assertExists,
  close,
  getPage,
  init: async () => { await getBrowser() },
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
  }

  return browser
}

async function navigate(path, page) {
  const _page = page || await getPage()

  await _page.goto(`chrome-extension://jcagcimhnijkdeapbckfleadlfehkgle/app.html#/${path}`)
}

async function close() {
  if (browser) {
    browser.close()
    browser = null
  }
}

function patchPage(page) {
  Object.assign(page, {
    assertExists: assertExists.bind(page),
  })

  return page
}

async function assertExists(selector) {
  should.exist(await this.$(selector), `Selector "${selector}" should be present`)
}
