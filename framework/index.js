const path = require('path')
const fs = require('fs')
const assert = require('assert')

const api = require('./router')
const config = require('../config')
const initializeModel = require('./model')
const classLoader = require('./classLoader')
const { BaseController } = require('./common')

module.exports = {
  api,
  BaseController,
  bindPropertiesToCtx: (app) => {
    // eslint-disable-next-line no-param-reassign
    app.context.config = config
    if (fs.existsSync(path.resolve(__dirname, '../app/models'))) {
      assert(config.mysql)
      assert(config.mysql.host)
      assert(config.mysql.database)
      assert(config.mysql.user)
      assert(config.mysql.password)
      // eslint-disable-next-line no-param-reassign
      app.context.models = initializeModel(config, path.resolve(__dirname, '../app/models'))
    }
    if (fs.existsSync(path.resolve(__dirname, '../app/controller'))) {
      // eslint-disable-next-line no-param-reassign
      app.context.controller = classLoader(path.resolve(__dirname, '../app/controller'))
    }
    if (fs.existsSync(path.resolve(__dirname, '../app/service'))) {
      // eslint-disable-next-line no-param-reassign
      app.context.service = classLoader(path.resolve(__dirname, '../app/service'))
    }
  }
}
