module.exports = {
  content_security_policy: { extension_pages: "script-src 'self'; object-src 'none';" },
  permissions: [
    "alarms",     // Backups scheduling
    "bookmarks",  // Access bookmarks management
    "favicon",    // https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/api-samples/favicon/manifest.json#L6C20-L6C27
    "storage",    // https://developer.chrome.com/docs/extensions/reference/api/storage
    "tabs",       // Access tabs and windows
  ],
  optional_permissions: [
    // "history",       // todo: Manage history
    // "notifications", // todo: Notifications
  ],
}
