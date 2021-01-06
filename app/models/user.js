const _ = require('lodash')

const model = {
  id: { type: 'integer', autoIncrement: true, primaryKey: true },
  phone: { type: 'string', length: 11, description: '手机号' },
  password: { type: 'string', length: 32, description: '密码' },
  nickname: { type: 'string', length: 32, description: '昵称' },
  createdAt: { type: 'date', allowNull: false },
  updatedAt: { type: 'date', allowNull: false },
  deletedAt: { type: 'date' }
}

module.exports = {
  model,
  required: ['phone', 'password'],
  relations: {
    userRoles: {
      type: 'hasMany',
      model: 'UserRole'
    },
    roles: {
      type: 'belongsToMany',
      model: 'Role',
      through: 'UserRole',
      foreignKey: 'roleId'
    }
  },
  remoteMethods: {
    register: {
      path: '/register',
      method: 'post',
      tags: ['user'],
      summary: '用户注册',
      requestBody: {
        body: _.pick(model, ['phone', 'password']),
        required: ['phone', 'password']
      },
      output: {
        200: {
          type: 'object',
          model: 'User'
        }
      }
    },
    login: {
      path: '/login',
      method: 'post',
      tags: ['user'],
      summary: '用户登录',
      requestBody: {
        body: _.pick(model, ['phone', 'password']),
        required: ['phone', 'password']
      },
      output: {
        200: {
          type: 'object',
          result: {
            user: { type: 'object', properties: model },
            token: { type: 'string' }
          }
        }
      }
    }
  }
}
