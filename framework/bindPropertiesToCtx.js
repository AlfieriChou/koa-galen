const fs = require('fs')
const assert = require('assert')

const initializeModel = require('./model')
const classLoader = require('./classLoader')

module.exports = (app, config) => {
  // eslint-disable-next-line no-param-reassign
  app.context.config = config
  const { modelDirPath, serviceDirPath, controllerDirPath } = config
  if (fs.existsSync(modelDirPath)) {
    assert(config.mysql)
    assert(config.mysql.host)
    assert(config.mysql.database)
    assert(config.mysql.user)
    assert(config.mysql.password)
    // eslint-disable-next-line no-param-reassign
    app.context.models = initializeModel(config, modelDirPath)
  }
  if (fs.existsSync(controllerDirPath)) {
    // eslint-disable-next-line no-param-reassign
    app.context.controller = classLoader(controllerDirPath)
  }
  if (fs.existsSync(serviceDirPath)) {
    // eslint-disable-next-line no-param-reassign
    app.context.service = classLoader(serviceDirPath)
  }
}
