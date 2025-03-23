import { runtime, windows } from '../../api/ChromeAPI'

export default function command() {
  windows.getCurrent((win) => windows.create({
    focused: true,
    height: win.height - 10,
    left: win.left,
    top: win.top - 70,
    type: 'popup',
    url: runtime.getURL(`app.html#/tabs?popup=true&current=${win.id}`),
    width: 420,
  }))
}
