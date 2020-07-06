const _ = require('lodash')
const assert = require('assert')

const resTypeList = ['array', 'object', 'number', 'string', 'html']

const buildSwaggerDoc = async (info, ctx) => {
  const { schemas, remoteMethods } = ctx
  const methods = Object.entries(remoteMethods).map(([schemaKey, {
    path, method, tags, summary, query, params, requestBody, output
  }]) => {
    assert(path, `${schemaKey} path is required`)
    assert(method, `${schemaKey} method is required`)
    const content = {
      tags: tags || ['default'],
      summary: summary || '',
      parameters: [
        ...(Object.entries(query || {}).map(([propKey, propValue]) => ({
          name: propKey,
          in: 'query',
          description: propValue.description,
          schema: {
            type: propValue.type
          },
          required: false
        }
        ))),
        ...(Object.entries(params || {}).map(([propKey, propValue]) => ({
          name: propKey,
          in: 'path',
          description: propValue.description,
          schema: {
            type: propValue.type
          },
          required: true
        }
        )))],
      requestBody: requestBody ? {
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
      } : undefined
    }
    if (output) {
      content.responses = Object.entries(output)
        .reduce((acc, [responseKey, { type, result }]) => {
          if (!resTypeList.includes(type)) throw new Error('output type mast ba array or object or number or string or html!')
          if (type === 'html') {
            return {
              ...acc,
              [responseKey]: {
                description: 'response success',
                content: {
                  'text/html': {}
                }
              }
            }
          }
          acc[200] = {
            description: 'response success',
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${schemaKey.split('-')[0]}` }
              }
            }
          }
          const outputSchema = {}
          if (type === 'array') {
            outputSchema.type = 'array'
            outputSchema.items = result || {}
          }
          if (type === 'object') {
            outputSchema.type = 'object'
            outputSchema.properties = result || {}
          }
          if (type === 'number') {
            outputSchema.type = 'number'
            outputSchema.description = '返回标识'
          }
          if (type === 'string') {
            outputSchema.type = 'number'
            outputSchema.description = '返回标识'
          }
          return {
            ...acc,
            [responseKey]: {
              description: 'response success',
              content: {
                'application/json': {
                  schema: outputSchema
                }
              }
            }
          }
        }, {})
    }
    return {
      [path]: {
        [method]: content
      }
    }
  })
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
