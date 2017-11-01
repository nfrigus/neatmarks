const {icons} = require('./meta')
const commands = {
  toggle_feature_foo: {
    suggested_key: {
      default: "Ctrl+Shift+Y",
      mac: "Command+Shift+Y",
    },
    description: "Toggle feature foo",
  },
  _execute_browser_action: {
    suggested_key: {
      windows: "Ctrl+Shift+Y",
      mac: "Command+Shift+Y",
      chromeos: "Ctrl+Shift+U",
      linux: "Ctrl+Shift+J",
    },
  },
  _execute_page_action: {
    suggested_key: {
      default: "Ctrl+Shift+E",
      windows: "Alt+Shift+P",
      mac: "Alt+Shift+P",
    },
  },
}

module.exports = {
  chrome_url_overrides: {
    bookmarks: "bookmarks.html",
  },
  browser_action: {
    default_icon: icons,
    default_title: "__MSG_extBtnTitle__",
    // default_popup: "popup.html",
  },
  options_page: "options.html",
  background: {
    scripts: [
      "js/vendors.js",
      "js/background.js",
    ],
    persistent: false,
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["js/content_script.js"],
    },
  ],
  commands,

  /*
    todo: Leverage modern chrome option window style
    "options_ui": {
      "chrome_style": true,
      "page": "options.html"
    },
   */
}
