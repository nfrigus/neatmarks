const {promisify} = require('util')
const {writeFile} = require('fs')


const icons = {
  16: "icons/16.png",
  32: "icons/32.png",
  48: "icons/48.png",
  64: "icons/64.png",
  128: "icons/128.png",
}
const package = require('../package.json')
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

const config = {
  // Main
  manifest_version: 2,
  name: "__MSG_extName__",
  version: package.version,

  // Info
  default_locale: "en",
  description: "__MSG_extDescription__",
  icons,
  author: "shestakovsemen@gmail.com",

  // Permissions and security
  content_security_policy: "script-src 'self' 'unsafe-eval' object-src 'self'",
  permissions: [
    "activeTab",
    "alarms",
    "background",
    "bookmarks",
    "browsingData",
    "contentSettings",
    "contextMenus",
    "cookies",
    "fileBrowserHandler",
    "fileSystemProvider",
    "history",
    "nativeMessaging",
    "notifications",
    "platformKeys",
    "storage",
    "tabs",
    "unlimitedStorage",
  ],

  // Actions
  chrome_url_overrides: {
    bookmarks: "bookmarks.html",
  },
  browser_action: {
    default_icon: icons,
    default_title: "__MSG_extBtnTitle__",
    default_popup: "popup.html",
  },

  // Entry points
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

  // Commands
  chrome_ui_overrides: {
    bookmarks_ui: {
      remove_button: "true",
      remove_bookmark_shortcut: "true",
    },
  },
  commands,
}

module.exports = {
  config,
  write,
}


function write(dir) {
  return promisify(writeFile)(dir + '/manifest.json', JSON.stringify(config, 2, 2))
}
