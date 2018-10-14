const browser = chrome;


export default function () {
  browser.storage.sync.get(null, items => {
    const width = typeof items.windowWidth === "number" ? items.windowWidth : 400;

    browser.windows.getCurrent(function (win) {
      const popupWindow = window.open(
        browser.extension.getURL("app.html#/tabs"),
        "Tab manager",
        "alwaysOnTop=yes,width=" + width + ",height=" + (win.height - 10) + ",left=" + window.screenLeft + ",top=" + (window.screenTop - 70),
      );
      popupWindow.initialWindowId = win.id;
    });
  });
}
