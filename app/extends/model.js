const Sequelize = require('sequelize')
const path = require('path')
const readDirFilenames = require('read-dir-filenames')

module.exports = (ctx) => {
  const {
    mysql: {
      host, database, user, password
    }
  } = ctx.config
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

  const paths = readDirFilenames(path.resolve(__dirname, '../models'), { ignore: 'index.js' })
  const db = paths.reduce((ret, file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const model = require(file).createModel(sequelize)
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
