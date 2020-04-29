const _ = require('lodash')
const jsonToModel = require('./conmon')

// TODO add cache
const getTableNames = async sequelize => sequelize.showAllTables()

module.exports = async ({
  model, tableName, relations
  // eslint-disable-next-line consistent-return
}, sequelize, ctx) => {
  const { schemas } = ctx
  let migrateModel = model
  if (relations) {
    migrateModel = {
      ...migrateModel,
      ...Object.entries(relations)
        .reduce((acc, [key, relation]) => {
          if (relation.type !== 'belongsTo') {
            return acc
          }
          const schema = schemas[relation.model]
          return {
            ...acc,
            [`${key}Id`]: {
              type: schema.properties.id.type,
              description: `关联${relation.model}`
            }
          }
        }, {})
    }
  }

  const allTableNames = await getTableNames(sequelize)
  if (!allTableNames.includes(tableName)) {
    return sequelize.createTable(tableName, jsonToModel(migrateModel, _.snakeCase))
  }
  // 有表 更新表字段信息
}
