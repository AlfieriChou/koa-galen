const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const koabody = require('koa-body')
const path = require('path')

const bindPropertiesToCtx = require('./bindPropertiesToCtx')
const apiLoader = require('./dynamicRouter')

module.exports = (baseConfig) => {
  const config = {
    viewDirpath: path.resolve(__dirname, './views'),
    modelDirPath: path.resolve(__dirname, '../app/models'),
    controllerDirPath: path.resolve(__dirname, '../app/controller'),
    serviceDirPath: path.resolve(__dirname, '../app/service'),
    ...baseConfig
  }

  const app = new Koa()
  bindPropertiesToCtx(app, config)
  const api = apiLoader(config.modelDirPath, '/v1')

  app.middlewareNames = ['cors', 'logger', 'body', 'api', 'bodyParser']
  app.middlewareFuncs = {
    cors: async (ctx, next) => {
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
    },
    logger: koaLogger(),
    body: koabody({}),
    api: api.middleware(),
    bodyParser: bodyParser()
  }

  app.loadMiddlewares = async (application) => {
    await application.middlewareNames.reduce(async (promise, middlewareName) => {
      await promise
      application.use(application.middlewareFuncs[middlewareName])
    }, Promise.resolve())
  }

  return app
}
