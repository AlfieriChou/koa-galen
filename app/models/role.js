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
  required: ['name', 'code'],
  remoteMethods: {
    create: {
      roles: ['admin']
    },
    show: {
      roles: ['admin']
    },
    update: {
      roles: ['admin']
    },
    destroy: {
      roles: ['admin']
    }
  }
}
