require('should')
global.chrome = require('sinon-chrome')

try {
  require('./setup.local')
} catch (error) {
  console.warn(error)
}
