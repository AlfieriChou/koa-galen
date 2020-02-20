const Sequelize = require('sequelize')
const _ = require('lodash')

const model = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  roleId: { type: Sequelize.INTEGER, comment: '权限id' },
  userId: { type: Sequelize.INTEGER, comment: '用户id' },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  deletedAt: { type: Sequelize.DATE }
}

module.exports = {
  model,
  createModel: (sequelize) => {
    const UserRole = sequelize.define('UserRole', model, {
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
