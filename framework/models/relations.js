module.exports = ({ modelName, relations }, models) => {
  Object.entries(relations).forEach(([, value]) => {
    // TODO: hasOne foreignKey
    if (value.type === 'belongsTo') {
      models[modelName].belongsTo(models[value.model])
    }
    if (value.type === 'hasMany') {
      models[modelName].hasMany(models[value.model])
    }
    if (value.type === 'belongsToMany') {
      models[modelName].belongsToMany(models[value.model], {
        through: value.through,
        foreignKey: value.foreignKey
      })
    }
  })
  return models
}
