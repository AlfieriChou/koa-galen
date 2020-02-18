const api = require('./router')
const config = require('../../config')
const initializeModel = require('./model')

module.exports = {
  api,
  bindPropertiesToCtx: (app) => {
    // eslint-disable-next-line no-param-reassign
    app.context.config = config
    // eslint-disable-next-line no-param-reassign
    app.context.models = initializeModel(config)
  }
}
