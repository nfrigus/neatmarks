const {icons} = require('./meta')

module.exports = {
  chrome_url_overrides: {
    bookmarks: "bookmarks.html",
  },
  browser_action: {
    default_icon: icons,
    default_title: "__MSG_extBtnTitle__",
    // todo: add browser action popup-menu
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
      js: [
        // todo: extract manifest from vendors
        "js/vendors.js",
        "js/content_script.js",
      ],
    },
  ],

  /*
    todo: Leverage modern chrome option window style
    "options_ui": {
      "chrome_style": true,
      "page": "options.html"
    },
   */
}
