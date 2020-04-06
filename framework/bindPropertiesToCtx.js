const fs = require('fs')

const initializeModel = require('./buildModels')
const classLoader = require('./classLoader')

module.exports = async (app, config) => {
  // eslint-disable-next-line no-param-reassign
  app.context.config = config
  const { modelDirPath, serviceDirPath, controllerDirPath } = config
  if (fs.existsSync(modelDirPath)) {
    // eslint-disable-next-line no-param-reassign
    app.context.models = await initializeModel(modelDirPath, app.context)
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
