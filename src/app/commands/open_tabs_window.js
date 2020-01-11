const browser = window.chrome;


export default function () {
  browser.storage.sync.get(null, (items) => {
    const width = typeof items.windowWidth === 'number' ? items.windowWidth : 400;

    browser.windows.getCurrent((win) => {
      const popupWindow = window.open(
        browser.extension.getURL('app.html#/tabs'),
        'Tab manager',
        [
          'alwaysOnTop=yes',
          `height=${win.height - 10}`,
          `left=${window.screenLeft}`,
          `top=${window.screenTop - 70}`,
          `width=${width}`,
        ].join(','),
      );
      popupWindow.initialWindowId = win.id;
    });
  });
}
