const KoaRouter = require('koa-router')
const readDirFilenames = require('read-dir-filenames')
const path = require('path')
const { Validator } = require('jsonschema')
const _ = require('lodash')
const {
  generateSwaggerDoc, convert, camelizeKeys, BaseController, intersection
} = require('./common')

const v = new Validator()

const checkRoles = async apiInfo => async (ctx, next) => {
  if (!apiInfo.roles) {
    return next()
  }
  const intersectionRoles = intersection(apiInfo.roles, ctx.roles)
  if (intersectionRoles.length === 0) {
    ctx.throw(403, 'permission denied')
  }
  return next()
}

const validate = async apiInfo => async (ctx, next) => {
  if (!apiInfo.requestBody) {
    return next()
  }
  const { body, required = [] } = apiInfo.requestBody
  const jsonSchema = convert(body)
  jsonSchema.required = required
  const validateRet = await v.validate(ctx.request.body, jsonSchema)
  if (validateRet.errors.length > 0) {
    ctx.throw(400, validateRet.errors[0].message)
  }
  return next()
}

module.exports = (modelDirPath, prefix = '/v1') => {
  const api = KoaRouter()
  api.prefix(prefix)

  const filenames = readDirFilenames(modelDirPath, { ignore: 'index.js' })
  filenames.forEach(async (filename) => {
    const modelName = path.basename(filename).replace(/\.\w+$/, '')
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const model = require(filename)
    if (model.remoteMethods) {
      await Object.entries(model.remoteMethods)
        .reduce(async (promise, [handler, apiInfo]) => {
          await promise
          if (/^[A-Z]/.test(handler)) {
            return
          }
          if (modelName === 'swagger') {
            if (apiInfo.path === '/swagger.json') {
              api[apiInfo.method](apiInfo.path, async (ctx) => {
                const result = await generateSwaggerDoc({
                  title: 'Demo API document',
                  version: 'v3',
                  description: 'Using swagger3.0 & sequelize to generate document',
                  contact: {
                    name: 'AlfieriChou',
                    email: 'alfierichou@gmail.com',
                    url: 'https://github.com/AlfieriChou/galen'
                  },
                  license: {
                    name: 'MIT',
                    url: 'https://github.com/AlfieriChou/galen/blob/master/LICENSE'
                  }
                }, modelDirPath)
                ctx.body = result
              })
            }
            if (apiInfo.path === '/apidoc') {
              api[apiInfo.method](apiInfo.path, async (ctx) => {
                await ctx.render('index.html', { url: '/v1/swagger.json' })
              })
            }
            return
          }
          api[apiInfo.method](
            apiInfo.path,
            await checkRoles(apiInfo),
            await validate(apiInfo),
            async (ctx) => {
              let ret
              if (ctx.controller[modelName] && ctx.controller[modelName][handler]) {
                ret = await ctx.controller[modelName][handler](ctx)
              }
              if (BaseController[handler]) {
                ret = await BaseController[handler](ctx, _.upperFirst(modelName))
              } else {
                ctx.throw(404, 'not found')
              }
              ctx.body = {
                status: 200,
                message: 'success',
                result: camelizeKeys(ret)
              }
            }
          )
        }, Promise.resolve())
    }
  })

  return api
}
