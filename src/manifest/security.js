module.exports = {
  content_security_policy: "script-src 'self' 'unsafe-eval' object-src 'self'",
  incognito: "spanning",
  permissions: [
    "background",
    "bookmarks",
  ],
  optional_permissions: [
    "activeTab",
    "alarms",
    "contextMenus",
    "history",
    "nativeMessaging",
    "notifications",
    "platformKeys",
    "storage",
    "tabs",
    "unlimitedStorage",
  ],
  chrome_ui_overrides: {
    bookmarks_ui: {
      remove_button: "true",
      remove_bookmark_shortcut: "true",
    },
  },
}
