const _ = require('lodash')
const assert = require('assert')

const resTypeList = ['array', 'object', 'number', 'string', 'html']

const buildSwaggerDoc = async (info, ctx) => {
  const { schemas, remoteMethods } = ctx
  const methods = await Object.entries(remoteMethods)
    .reduce(async (promise, [schemaKey, {
      path, method, tags, summary, query, params, requestBody, output
    }]) => {
      assert(path, `${schemaKey} path is required`)
      assert(method, `${schemaKey} method is required`)
      const methodRet = await promise
      const content = {
        tags: tags || ['default'],
        summary: summary || ''
      }
      if (query || params) {
        content.parameters = Object.entries(query || params)
          .reduce((ret, [propKey, propValue]) => (
            [...ret, {
              name: propKey,
              in: query ? 'query' : 'path',
              description: propValue.description,
              schema: {
                type: propValue.type
              },
              required: !query
            }]
          ), [])
      }
      if (requestBody) {
        content.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: requestBody.body,
                required: requestBody.required
              }
            }
          }
        }
      }
      if (output) {
        content.responses = await Object.entries(output)
          .reduce(async (resPromise, [responseKey, { type, result }]) => {
            const outputDatas = await resPromise
            if (!resTypeList.includes(type)) throw new Error('output type mast ba array or object or number or string or html!')
            if (type === 'html') {
              return {
                ...outputDatas,
                [responseKey]: {
                  description: 'response success',
                  content: {
                    'text/html': {}
                  }
                }
              }
            }
            outputDatas[200] = {
              description: 'response success',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaKey.split('-')[0]}` }
                }
              }
            }
            let outputSchema
            if (type === 'array') {
              outputSchema = {
                type: 'array',
                items: result || {
                  type: 'string'
                }
              }
            }
            if (type === 'object') {
              outputSchema = { type: 'object', properties: result || {} }
            }
            if (type === 'number') {
              outputSchema = { type: 'object', properties: { result: { type: 'number', description: '返回标识' } } }
            }
            if (type === 'string') {
              outputSchema = { type: 'object', properties: { result: { type: 'string', description: '返回标识' } } }
            }
            return {
              ...outputDatas,
              [responseKey]: {
                description: 'response success',
                content: {
                  'application/json': {
                    schema: outputSchema
                  }
                }
              }
            }
          }, Promise.resolve({}))
      }
      return [
        ...methodRet,
        {
          [path]: {
            [method]: content
          }
        }
      ]
    }, Promise.resolve([]))
  return {
    openapi: '3.0.0',
    info,
    paths: methods.reduce((acc, method) => _.merge(acc, method), {}),
    components: {
      schemas
    }
  }
}

module.exports = buildSwaggerDoc
