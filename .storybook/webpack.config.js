const custom = require('../webpack.config.js')
const { uniqBy } = require('lodash')

module.exports = async ({ config }) => {
  const newVar = {
    ...config,
    plugins: uniqBy([...custom.plugins, ...config.plugins], i => i.constructor.name),
    module: {
      ...config.module,
      rules: [...custom.module.rules, /*...config.module.rules*/],
    }
  }

  return newVar
}
