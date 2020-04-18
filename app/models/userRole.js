const model = {
  id: { type: 'integer', autoIncrement: true, primaryKey: true },
  roleId: { type: 'integer', description: '权限id' },
  userId: { type: 'integer', description: '用户id' },
  createdAt: { type: 'date', allowNull: false },
  updatedAt: { type: 'date', allowNull: false },
  deletedAt: { type: 'date' }
}

module.exports = {
  model,
  required: ['roleId', 'userId'],
  relations: {
    user: {
      type: 'belongsTo',
      model: 'User'
    },
    role: {
      type: 'belongsTo',
      model: 'Role'
    }
  }
}
