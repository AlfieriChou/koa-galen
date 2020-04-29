const jsonToModel = require('./conmon')

module.exports = ({
  model, modelName, tableName, plugins
}, sequelize) => sequelize.define(modelName, jsonToModel(model), {
  ...plugins,
  underscored: true,
  tableName
})
