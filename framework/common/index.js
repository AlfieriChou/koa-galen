const BaseController = require('./baseController')
const generateSwaggerDoc = require('./swagger')
const camelizeKeys = require('./camellizeKeys')

const intersection = (a, b) => {
  const s = new Set(b)
  return a.filter(x => s.has(x))
}

module.exports = {
  BaseController,
  generateSwaggerDoc,
  intersection,
  camelizeKeys
}
