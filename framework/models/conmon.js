const Sequelize = require('sequelize')

const seqielizeTypes = {
  integer: Sequelize.INTEGER,
  string: Sequelize.STRING,
  date: Sequelize.DATE,
  boolean: Sequelize.BOOLEAN,
  json: Sequelize.JSON,
  array: Sequelize.ARRAY
}

const jsonToModel = (properties, keyFn) => Object.entries(properties)
  .reduce((ret, [k, value]) => {
    let key = k
    if (keyFn) {
      key = keyFn(key)
    }
    let comment
    if (value.description) {
      comment = value.description
    }
    return {
      ...ret,
      [key]: {
        ...value,
        type: seqielizeTypes[value.type],
        comment
      }
    }
  }, {})

module.exports = jsonToModel
