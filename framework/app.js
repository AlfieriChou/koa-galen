const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const koabody = require('koa-body')
const views = require('koa-views')
const path = require('path')

const bindPropertiesToCtx = require('./bindPropertiesToCtx')
const api = require('./router')

const app = new Koa()
bindPropertiesToCtx(app)

app.use(async (ctx, next) => {
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 200
  }
  ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.set('Access-Control-Max-Age', 86400000)
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type')
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      code: ctx.status,
      message: err.message,
      stack: err.stack
    }
  }
})

app
  .use(koaLogger())
  .use(views(path.join('./views'), { map: { html: 'nunjucks' } }))
  .use(koabody({}))
  .use(api.middleware())
  .use(bodyParser())

module.exports = app