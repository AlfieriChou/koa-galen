# model definition

## model

```javascript
{
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  phone: { type: Sequelize.STRING, length: 11, comment: '手机号' },
  password: { type: Sequelize.STRING, length: 32, comment: '密码' },
  nickname: { type: Sequelize.STRING, length: 32, comment: '昵称' },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  deletedAt: { type: Sequelize.DATE }
}
```

## create sequelize model

```javascript
(sequelize) => {
  const User = sequelize.define('User', model, {
    underscored: true,
    tableName: 'user'
  })

  User.associate = (models) => {
    User.hasMany(models.UserRole)
    User.belongsToMany(models.Role, {
      through: 'UserRole',
      foreignKey: 'roleId'
    })
  }

  return User
}
```

## remote Methods

```javascript
{
  index: {
    path: '/users',
    method: 'get',
    tags: ['user'],
    summary: '获取用户列表',
    query: {
      where: { type: Sequelize.JSON, comment: '搜索条件 例如：where={}' },
      order: { type: Sequelize.ARRAY, comment: '排序 例如：order=[["createdAt","desc"]]' },
      attribute: { type: Sequelize.ARRAY, comment: '返回字段控制 例如：attribute=["id"]' },
      include: { type: Sequelize.ARRAY, comment: '关联表 关联查询 例如：include=[{"model":"UserRole"}]' },
      offset: { type: Sequelize.INTEGER, comment: '分页偏移量 例如：offset=0' },
      limit: { type: Sequelize.INTEGER, comment: '分页数量 例如：limit=20' }
    },
    output: {
      200: {
        type: 'object',
        result: {
          count: { type: Sequelize.INTEGER, comment: '总数' },
          offset: { type: Sequelize.INTEGER, comment: '偏移量' },
          limit: { type: Sequelize.INTEGER, comment: '限制数量' },
          datas: { type: Sequelize.ARRAY, items: { type: Sequelize.JSON, keys: model }, comment: '数据' }
        }
      }
    }
  }
}
```

## 完整示例

```javascript
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

    User.associate = (models) => {
      User.hasMany(models.UserRole)
      User.belongsToMany(models.Role, {
        through: 'UserRole',
        foreignKey: 'roleId'
      })
    }

    return User
  },
  remoteMethods: {
    index: {
      path: '/users',
      method: 'get',
      tags: ['user'],
      summary: '获取用户列表',
      query: {
        where: { type: Sequelize.JSON, comment: '搜索条件 例如：where={}' },
        order: { type: Sequelize.ARRAY, comment: '排序 例如：order=[["createdAt","desc"]]' },
        attribute: { type: Sequelize.ARRAY, comment: '返回字段控制 例如：attribute=["id"]' },
        include: { type: Sequelize.ARRAY, comment: '关联表 关联查询 例如：include=[{"model":"UserRole"}]' },
        offset: { type: Sequelize.INTEGER, comment: '分页偏移量 例如：offset=0' },
        limit: { type: Sequelize.INTEGER, comment: '分页数量 例如：limit=20' }
      },
      output: {
        200: {
          type: 'object',
          result: {
            count: { type: Sequelize.INTEGER, comment: '总数' },
            offset: { type: Sequelize.INTEGER, comment: '偏移量' },
            limit: { type: Sequelize.INTEGER, comment: '限制数量' },
            datas: { type: Sequelize.ARRAY, items: { type: Sequelize.JSON, keys: model }, comment: '数据' }
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
```
