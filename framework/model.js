const Sequelize = require('sequelize')
const readDirFilenames = require('read-dir-filenames')

const seqielizeTypes = {
  integer: Sequelize.INTEGER,
  string: Sequelize.STRING,
  date: Sequelize.DATE,
  boolean: Sequelize.BOOLEAN,
  json: Sequelize.JSON,
  array: Sequelize.ARRAY
}

const jsonToModel = model => Object.entries(model).reduce((ret, [key, value]) => {
  // eslint-disable-next-line no-param-reassign
  ret[key] = {
    ...value,
    type: seqielizeTypes[value.type]
  }
  return ret
}, {})

module.exports = (config, modelDirPath) => {
  const {
    mysql: {
      host, database, user, password
    }
  } = config
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
    const sequelizeModel = require(file)
    if (!sequelizeModel.createModel) {
      return ret
    }
    const model = sequelizeModel.createModel(sequelize, jsonToModel)
    // eslint-disable-next-line no-param-reassign
    ret[model.name] = model
    return ret
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
