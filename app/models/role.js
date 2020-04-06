const _ = require('lodash')

const model = {
  id: { type: 'integer', autoIncrement: true, primaryKey: true },
  name: { type: 'string', description: '权限名称' },
  code: { type: 'string', description: '权限编码' },
  createdAt: { type: 'date', allowNull: false },
  updatedAt: { type: 'date', allowNull: false },
  deletedAt: { type: 'date' }
}

module.exports = {
  model,
  remoteMethods: {
    index: {
      path: '/roles',
      method: 'get',
      tags: ['role'],
      summary: '获取权限列表',
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
      path: '/roles',
      method: 'post',
      roles: ['admin'],
      tags: ['role'],
      summary: '创建权限',
      requestBody: {
        body: _.pick(model, ['name', 'code']),
        required: ['name', 'code']
      },
      output: {
        200: {
          type: 'object',
          result: model
        }
      }
    },
    show: {
      path: '/roles/:id',
      method: 'get',
      roles: ['admin'],
      tags: ['role'],
      summary: '获取权限详情',
      params: _.pick(model, ['id']),
      output: {
        200: {
          type: 'object',
          result: model
        }
      }
    },
    update: {
      path: '/roles/:id',
      method: 'put',
      roles: ['admin'],
      tags: ['role'],
      summary: '修改权限信息',
      params: _.pick(model, ['id']),
      requestBody: {
        body: _.pick(model, ['name', 'code'])
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
    destroy: {
      path: '/roles/:id',
      method: 'delete',
      roles: ['admin'],
      tags: ['role'],
      summary: '删除权限',
      params: _.pick(model, ['id']),
      output: {
        200: {
          type: 'number'
        }
      }
    }
  }
}
