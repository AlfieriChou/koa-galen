const _ = require('lodash')

const model = {
  id: { type: 'integer', autoIncrement: true, primaryKey: true },
  roleId: { type: 'integer', comment: '权限id' },
  userId: { type: 'integer', comment: '用户id' },
  createdAt: { type: 'date', allowNull: false },
  updatedAt: { type: 'date', allowNull: false },
  deletedAt: { type: 'date' }
}

module.exports = {
  model,
  createModel: (sequelize, jsonToModel) => {
    const UserRole = sequelize.define('UserRole', jsonToModel(model), {
      underscored: true,
      tableName: 'user_role'
    })
    UserRole.associate = (models) => {
      UserRole.belongsTo(models.Role)
      UserRole.belongsTo(models.User)
    }
    return UserRole
  },
  remoteMethods: {
    create: {
      path: '/userRoles',
      method: 'post',
      tags: ['userRole'],
      summary: '创建用户权限绑定关系',
      requestBody: {
        body: _.pick(model, ['roleId', 'userId']),
        required: ['roleId', 'userId']
      },
      output: {
        200: {
          type: 'object',
          result: model
        }
      }
    },
    destroy: {
      path: '/userRoles/:id',
      method: 'delete',
      tags: ['userRole'],
      summary: '删除用户权限绑定关系',
      params: _.pick(model, ['id']),
      output: {
        200: {
          type: 'number'
        }
      }
    }
  }
}
