module.exports = {
  stories: [
    "../**/*.stories.@(js|ts)",
  ],
  addons: [
    "@storybook/addon-essentials",
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  staticDirs: ['../dist'],
}
