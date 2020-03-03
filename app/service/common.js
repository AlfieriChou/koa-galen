const Bcrypt = require('bcrypt')
const { promisify } = require('util')
const _ = require('lodash')

const bcryptHash = promisify(Bcrypt.hash)

const RECOMMENDED_ROUNDS = 12

const isBcryptHash = (str) => {
  const protocol = str.split('$')
  return protocol.length === 4 &&
    protocol[0] === '' &&
    ['2a', '2b', '2y'].indexOf(protocol[1]) > -1 &&
    /^\d+$/.test(protocol[2]) &&
    protocol[3].length === 53
}

module.exports = class Common {
  verifyPassword (hash, password) {
    return Bcrypt.compareSync(password, hash)
  }

  async generateHash (password = '') {
    if (isBcryptHash(password)) {
      throw new Error('bcrypt tried to hash another bcrypt hash')
    }
    return bcryptHash(password, RECOMMENDED_ROUNDS)
  }

  camelizeKeys (obj) {
    if (Array.isArray(obj)) {
      return obj.map(v => this.camelizeKeys(v))
    }
    if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj)
        .reduce((result, key) => ({
          ...result,
          [_.camelCase(key)]: this.camelizeKeys(obj[key])
        }), {})
    }
    return obj
  }
}
