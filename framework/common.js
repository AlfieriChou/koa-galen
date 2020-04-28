const _ = require('lodash')

const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v))
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj)
      .reduce((result, key) => ({
        ...result,
        [_.camelCase(key)]: camelizeKeys(obj[key])
      }), {})
  }
  return obj
}

const intersection = (a, b) => {
  const s = new Set(b)
  return a.filter(x => s.has(x))
}

const deepMapKeys = (data, fn) => {
  if (Array.isArray(data)) {
    return data.map(val => deepMapKeys(val, fn))
  }
  if (typeof data === 'object') {
    return Object.keys(data)
      .reduce((acc, current) => {
        const val = data[current]
        acc[fn(current)] = val !== null && typeof val === 'object' ? deepMapKeys(val, fn) : (acc[fn(current)] = val)
        return acc
      }, {})
  }
  return data
}

module.exports = {
  camelizeKeys,
  intersection,
  deepMapKeys
}
