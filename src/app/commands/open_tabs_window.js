const browser = window.chrome;


export default function () {
  browser.windows.getCurrent((win) => {
    const popupWindow = window.open(
      browser.extension.getURL('app.html#/tabs'),
      'Tab manager',
      [
        'alwaysOnTop=yes',
        `height=${win.height - 10}`,
        `left=${window.screenLeft}`,
        `top=${window.screenTop - 70}`,
        'width=400',
      ].join(','),
    );
    popupWindow.initialWindowId = win.id;
  });
}
