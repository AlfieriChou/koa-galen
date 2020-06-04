const Sequelize = require('sequelize')
const readDirFilenames = require('read-dir-filenames')
const _ = require('lodash')
const path = require('path')
const createModel = require('./models/createModel')
const buildRelations = require('./models/relations')
const validateConfig = require('./models/validateConfig')
const buildCrudRemoteMethods = require('./models/crudRemoteMethods')
const migrateModel = require('./models/migrate')

module.exports = async (modelDirPath, ctx) => {
  await validateConfig(ctx.config.mysql)
  ctx.schemas = {}
  ctx.modelSchemas = {}
  ctx.remoteMethods = {}
  const {
    database, user, password, host, port, pool, debug
  } = ctx.config.mysql
  const options = {
    host,
    port: port || 3306,
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
    const remoteMethods = buildCrudRemoteMethods(filename, schema)
    ctx.remoteMethods = {
      ...ctx.remoteMethods,
      ...Object.entries(remoteMethods).reduce((acc, [key, value]) => ({
        ...acc,
        [`${filename}-${key}`]: value
      }), {})
    }
    ctx.modelSchemas[modelName] = schema
    if (!schema.model) {
      return ret
    }
    ctx.schemas[modelName] = {
      type: 'object', properties: model
    }
    return {
      ...ret,
      [modelName]: createModel(schema, sequelize)
    }
  }, {})
  Object.entries(ctx.modelSchemas).forEach(([, modelSchema]) => {
    if (modelSchema.dialect !== 'virtual') {
      migrateModel(modelSchema, sequelize.getQueryInterface(), ctx)
    }
    if (modelSchema.dialect !== 'virtual' && modelSchema.relations) {
      buildRelations(modelSchema, db)
    }
  })
  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}
