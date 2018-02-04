export async function getAllWindows() {
  return new Promise(resolve => chrome.windows
    .getAll({ populate: true, windowTypes: ['normal'] }, resolve))
}
export async function getCurrentWindow() {
  return new Promise(resolve => chrome.windows
    .getCurrent({}, resolve))
}
export async function focusWindow(windowId) {
  return new Promise(resolve => chrome.windows
    .update(windowId, { focused: true }, resolve))
}
