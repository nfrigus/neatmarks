import { windows } from '../../api/ChromeAPI'

export async function getAllWindows() {
  return new Promise(resolve => windows
    .getAll({ populate: true, windowTypes: ['normal'] }, resolve))
}
export async function getCurrentWindow() {
  return new Promise(resolve => windows
    .getCurrent({}, resolve))
}
export async function focusWindow(windowId) {
  return new Promise(resolve => windows
    .update(windowId, { focused: true }, resolve))
}
