module.exports = {
  content_security_policy: "script-src 'self'; object-src 'self';",
  incognito: "spanning",
  permissions: [
    "alarms",     // Backups scheduling
    "background", // Allow background tasks: sort, sync, backup, etc
    "bookmarks",  // Access bookmarks management
    "chrome://favicon/", // Allow favicon display for bookmarks
    "tabs",       // Access tabs and windows
  ],
  optional_permissions: [
    // "history",       // todo: Manage history
    // "notifications", // todo: Notifications
    // "storage",       // todo: sync across browsers
  ],
}
