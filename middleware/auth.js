module.exports = async (ctx, next) => {
  if (!ctx.user) {
    ctx.roles = ['$unauthenticated']
    return next()
  }
  const { phone } = ctx.user
  const user = await ctx.service.user.cacheGetUserByPhone(phone, ctx)
  ctx.user = ctx.service.common.camelObjKeys(user)
  ctx.user.stateUserRoles = ctx.service.common.camelObjKeys(user).roles.map(({ code }) => code)
  ctx.roles = (ctx.user.stateUserRoles || []).concat('$everyone', '$authenticated')
  return next()
}
