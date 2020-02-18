const Sequelize = require('sequelize')
const _ = require('lodash')

const model = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  phone: { type: Sequelize.STRING, length: 11, comment: '手机号' },
  password: { type: Sequelize.STRING, length: 32, comment: '密码' },
  nickname: { type: Sequelize.STRING, length: 32, comment: '昵称' },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  deletedAt: { type: Sequelize.DATE }
}

module.exports = {
  model,
  createModel: (sequelize) => {
    const User = sequelize.define('User', model, {
      underscored: true,
      tableName: 'user'
    })

    return User
  },
  remoteMethods: {
    create: {
      path: '/users',
      method: 'post',
      tags: ['user'],
      summary: '创建用户',
      requestBody: {
        body: _.pick(model, ['phone', 'password']),
        required: ['phone', 'password']
      },
      output: {
        200: {
          type: 'object',
          result: model
        }
      }
    },
    show: {
      path: '/users/:id',
      method: 'get',
      tags: ['user'],
      summary: '获取用户详情',
      params: _.pick(model, ['id']),
      output: {
        200: {
          type: 'object',
          result: model
        }
      }
    },
    update: {
      path: '/users/:id',
      method: 'put',
      tags: ['user'],
      summary: '修改用户信息',
      params: _.pick(model, ['id']),
      requestBody: {
        body: _.pick(model, ['phone', 'password'])
      },
      output: {
        200: {
          type: 'array'
        }
      }
    },
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
          result: model
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
            user: { type: Sequelize.JSON, keys: model },
            token: { type: Sequelize.STRING }
          }
        }
      }
    }
  }
}
