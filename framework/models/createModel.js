const Sequelize = require('sequelize')

const seqielizeTypes = {
  integer: Sequelize.INTEGER,
  string: Sequelize.STRING,
  date: Sequelize.DATE,
  boolean: Sequelize.BOOLEAN,
  json: Sequelize.JSON,
  array: Sequelize.ARRAY
}

const jsonToModel = properties => Object.entries(properties)
  .reduce((ret, [key, value]) => ({
    ...ret,
    [key]: {
      ...value,
      type: seqielizeTypes[value.type]
    }
  }), {})

module.exports = ({
  model, modelName, tableName, plugins
}, sequelize) => sequelize.define(modelName, jsonToModel(model), {
  ...plugins,
  underscored: true,
  tableName
})
