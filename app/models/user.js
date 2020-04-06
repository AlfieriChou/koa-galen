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
    index: {
      path: '/users',
      method: 'get',
      tags: ['user'],
      summary: '获取用户列表',
      query: {
        where: { type: 'json', description: '搜索条件 例如：where={}' },
        order: { type: 'array', description: '排序 例如：order=[["createdAt","desc"]]' },
        attribute: { type: 'array', description: '返回字段控制 例如：attribute=["id"]' },
        include: { type: 'array', description: '关联表 关联查询 例如：include=[{"model":"UserRole"}]' },
        offset: { type: 'integer', description: '分页偏移量 例如：offset=0' },
        limit: { type: 'integer', description: '分页数量 例如：limit=20' }
      },
      output: {
        200: {
          type: 'object',
          result: {
            count: { type: 'integer', description: '总数' },
            offset: { type: 'integer', description: '偏移量' },
            limit: { type: 'integer', description: '限制数量' },
            datas: { type: 'array', items: { type: 'object', properties: model }, description: '数据' }
          }
        }
      }
    },
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
          type: 'array',
          result: {
            type: 'number'
          }
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
            user: { type: 'object', properties: model },
            token: { type: 'string' }
          }
        }
      }
    }
  }
}
