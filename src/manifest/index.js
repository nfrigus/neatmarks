const {promisify} = require('util')
const {writeFile} = require('fs')

const config = {
  ...require('./meta'),
  ...require('./security'),
  ...require('./entry_points'),
  commands: require('./commands'),
}

module.exports = {
  config,
  write,
}


function write(dir) {
  return promisify(writeFile)(dir + '/manifest.json', JSON.stringify(config, 2, 2))
}
