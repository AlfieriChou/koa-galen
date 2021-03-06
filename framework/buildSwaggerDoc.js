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
          .reduce(async (resPromise, [responseKey, { type, model, result }]) => {
            const outputRets = await resPromise
            if (!resTypeList.includes(type)) throw new Error('output type mast ba array or object or number or string or html!')
            if (type === 'html') {
              return {
                ...outputRets,
                [responseKey]: {
                  description: 'response success',
                  content: {
                    'text/html': {}
                  }
                }
              }
            }
            outputRets[200] = {
              description: 'response success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: { type: 'number' },
                      message: { type: 'string' },
                      data: {
                        $ref: `#/components/schemas/${schemaKey.split('-')[0]}`
                      }
                    }
                  }
                }
              }
            }
            const outputData = {}
            if (type === 'array') {
              outputData.type = 'array'
              outputData.items = model ? schemas[model] : result || {}
            }
            if (type === 'object') {
              outputData.type = 'object'
              outputData.properties = model ? schemas[model].properties : result || {}
            }
            if (type === 'number') {
              outputData.type = 'number'
              outputData.description = '返回标识'
            }
            if (type === 'string') {
              outputData.type = 'string'
              outputData.description = '返回标识'
            }
            return {
              ...outputRets,
              [responseKey]: {
                description: 'response success',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        code: { type: 'number' },
                        message: { type: 'string' },
                        data: outputData
                      }
                    }
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
