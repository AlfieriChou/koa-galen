const development = require('./config.default')
const test = require('./config.test')
const production = require('./config.prod')

const env = process.env.NODE_ENV || 'development'
const configs = {
  development,
  production,
  test
}

module.exports = {
  env,
  ...configs[env]
}
