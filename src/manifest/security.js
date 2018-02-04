module.exports = {
  content_security_policy: "script-src 'self' object-src 'self'",
  incognito: "spanning",
  permissions: [
    "background",
    "bookmarks",
    "storage",
    "tabs",
  ],
  optional_permissions: [
    "activeTab",
    "alarms",
    "contextMenus",
    "history",
    "nativeMessaging",
    "notifications",
    "platformKeys",
    "unlimitedStorage",
  ],
  chrome_ui_overrides: {
    bookmarks_ui: {
      remove_button: "true",
      remove_bookmark_shortcut: "true",
    },
  },
}
