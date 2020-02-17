const KoaRouter = require('koa-router')

const api = KoaRouter()

api.prefix('/v1')

api.get('/swagger.json', (ctx) => {
  ctx.body = 'hello world'
})
api.get('/apidoc', (ctx) => {
  ctx.body = 'hello world'
})

module.exports = api
