const Sequelize = require('sequelize')
const readDirFilenames = require('read-dir-filenames')
const _ = require('lodash')
const path = require('path')

const seqielizeTypes = {
  integer: Sequelize.INTEGER,
  string: Sequelize.STRING,
  date: Sequelize.DATE,
  boolean: Sequelize.BOOLEAN,
  json: Sequelize.JSON,
  array: Sequelize.ARRAY
}

const jsonToModel = model => Object.entries(model).reduce((ret, [key, value]) => ({
  ...ret,
  [key]: {
    ...value,
    type: seqielizeTypes[value.type]
  }
}), {})

module.exports = (modelDirPath, ctx) => {
  const {
    mysql: {
      host, database, user, password
    }
  } = ctx.config
  ctx.jsonSchemas = {}
  ctx.remoteMethods = {}
  const sequelize = new Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    logging: false
  })

  const paths = readDirFilenames(modelDirPath, { ignore: 'index.js' })
  const db = paths.reduce((ret, file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { model, createModel, remoteMethods } = require(file)
    const modelName = _.upperFirst(path.basename(file).replace(/\.\w+$/, ''))
    if (model) {
      ctx.jsonSchemas[modelName] = {
        type: 'object', properties: model
      }
    }
    if (remoteMethods) {
      ctx.remoteMethods = {
        ...ctx.remoteMethods,
        ...Object.entries(remoteMethods).reduce((acc, [key, value]) => ({
          ...acc,
          [`${modelName}-${key}`]: value
        }), {})
      }
    }
    if (!createModel) {
      return ret
    }
    const sequelizeModel = createModel(sequelize, jsonToModel)
    return {
      ...ret,
      [sequelizeModel.name]: sequelizeModel
    }
  }, {})
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}
