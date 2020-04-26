module.exports = {
  content_security_policy: "script-src 'self' object-src 'self'",
  incognito: "spanning",
  permissions: [
    "background", // Allow background tasks: sort, sync, backup, etc
    "bookmarks",  // Access bookmarks management
    "tabs",       // Access tabs and windows
  ],
  optional_permissions: [
    // "alarms",        // todo: Scheduling backups
    // "history",       // todo: Manage history
    // "notifications", // todo: Notifications
    // "storage",       // todo: sync across browsers
  ],
}
