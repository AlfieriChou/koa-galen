const Sequelize = require('sequelize')
const readDirFilenames = require('read-dir-filenames')
const _ = require('lodash')
const path = require('path')
const createModel = require('./models/createModel')
const buildRelations = require('./models/relations')
const validateConfig = require('./models/validateConfig')
const buildCrudReoteMethods = require('./crudRemoteMethods')

module.exports = async (modelDirPath, ctx) => {
  await validateConfig(ctx.config.mysql)
  ctx.schemas = {}
  ctx.modelSchemas = {}
  ctx.remoteMethods = {}
  const {
    database, user, password, host, pool, debug
  } = ctx.config.mysql
  const options = {
    host,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    logging: false
  }
  if (debug) {
    options.logging = true
  }
  if (pool) {
    options.pool = {
      max: pool.max,
      min: pool.min
    }
  }
  const sequelize = new Sequelize(database, user, password, options)

  const paths = readDirFilenames(modelDirPath, { ignore: 'index.js' })
  const db = await paths.reduce((ret, file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const schema = require(file)
    const filename = path.basename(file).replace(/\.\w+$/, '')
    if (!schema.modelName) {
      schema.modelName = _.upperFirst(filename)
    }
    if (!schema.tableName) {
      schema.tableName = _.snakeCase(filename)
    }
    const { modelName, model } = schema
    const remoteMethods = buildCrudReoteMethods(filename, schema)
    ctx.remoteMethods = {
      ...ctx.remoteMethods,
      ...Object.entries(remoteMethods).reduce((acc, [key, value]) => ({
        ...acc,
        [`${filename}-${key}`]: value
      }), {})
    }
    if (!schema.model) {
      return ret
    }
    ctx.modelSchemas[modelName] = schema
    ctx.schemas[modelName] = {
      type: 'object', properties: model
    }
    return {
      ...ret,
      [modelName]: createModel(schema, sequelize)
    }
  }, {})
  Object.entries(ctx.modelSchemas).forEach(([, { modelName, relations }]) => {
    if (relations) {
      buildRelations({ modelName, relations }, db)
    }
  })
  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}
