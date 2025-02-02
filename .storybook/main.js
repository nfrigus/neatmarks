module.exports = {
  stories: [
    "../**/*.stories.@(js|ts)",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-webpack5-compiler-babel"],
  docs: {},
  framework: {
    name: "@storybook/vue3-webpack5",
    options: {}
  },
  staticDirs: ['../dist'],
}
