const { icons } = require('./meta')

module.exports = {
  chrome_url_overrides: {},
  action: {
    default_icon: icons,
    default_title: "__MSG_extBtnTitle__",
    default_popup: "/app.html#/popup",
  },
  options_page: "/app.html#/options",
  background: {
    service_worker: "js/background.js",
  },
  content_scripts: undefined && [
    {
      matches: ["<all_urls>"],
      js: [
        // todo: extract manifest from vendors
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
