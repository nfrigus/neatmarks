// https://developer.chrome.com/docs/extensions/reference/api/commands
module.exports = {
  open_tabs_window: {
    description: "Open tabs window",
    global: true,
    suggested_key: {
      default: "Ctrl+Shift+1",
      mac: "Command+Shift+1",
    },
  },
  _execute_action: {
    suggested_key: {
      default: "Ctrl+Shift+Space",
      mac: "Command+Shift+Space",
    },
  },
}
