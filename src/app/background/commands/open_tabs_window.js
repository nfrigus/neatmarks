import { extension, windows } from '../../api/ChromeAPI'
import window from '../../api/WebAPI'

export default function () {
  windows.getCurrent((win) => {
    const popupWindow = window.open(
      extension.getURL('app.html#/tabs'),
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
