const _ = require('lodash')

const resTypeList = ['array', 'object', 'number', 'string', 'html']

const buildSwaggerDoc = async (info, ctx) => {
  const { jsonSchemas, remoteMethods } = ctx
  const methods = await Object.entries(remoteMethods)
    .reduce(async (promise, [schemaKey, schemaValue]) => {
      const methodRet = await promise
      const content = {
        tags: schemaValue.tags || '',
        summary: schemaValue.summary || ''
      }
      if (schemaValue.query || schemaValue.params) {
        const params = {
          type: 'object',
          properties: schemaValue.query ? schemaValue.query : schemaValue.params
        }
        content.parameters = Object.entries(params.properties)
          .reduce((ret, [propKey, propValue]) => {
            ret.push({
              name: propKey,
              in: schemaValue.query ? 'query' : 'path',
              description: propValue.description,
              schema: {
                type: propValue.type
              },
              required: !schemaValue.query
            })
            return ret
          }, [])
      }
      if (schemaValue.requestBody) {
        content.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: schemaValue.requestBody.body,
                required: schemaValue.requestBody.required
              }
            }
          }
        }
      }
      if (schemaValue.output) {
        content.responses = await Object.entries(schemaValue.output)
          .reduce(async (resPromise, [responseKey, responseValue]) => {
            const outputDatas = await resPromise
            if (!resTypeList.includes(responseValue.type)) throw new Error('output type mast ba array or object or number or string or html!')
            if (responseValue.type === 'html') {
              outputDatas[responseKey] = {
                description: 'response success',
                content: {
                  'text/html': {}
                }
              }
              return outputDatas
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
            if (responseValue.type === 'array') {
              outputSchema = {
                type: 'array',
                items: { type: 'object', properties: responseValue.result || {} }
              }
            }
            if (responseValue.type === 'object') {
              outputSchema = { type: 'object', properties: responseValue.result || {} }
            }
            if (responseValue.type === 'number') {
              outputSchema = { type: 'object', properties: { result: { type: 'number', description: '返回标识' } } }
            }
            if (responseValue.type === 'string') {
              outputSchema = { type: 'object', properties: { result: { type: 'string', description: '返回标识' } } }
            }
            outputDatas[responseKey] = {
              description: 'response success',
              content: {
                'application/json': {
                  schema: outputSchema
                }
              }
            }
            return outputDatas
          }, Promise.resolve({}))
      }
      const swaggerItem = {}
      swaggerItem[schemaValue.path] = {}
      swaggerItem[schemaValue.path][schemaValue.method] = content
      methodRet.push(swaggerItem)
      return methodRet
    }, Promise.resolve([]))
  return {
    openapi: '3.0.0',
    info,
    paths: methods.reduce((acc, method) => _.merge(acc, method), {}),
    components: {
      schemas: jsonSchemas
    }
  }
}

module.exports = buildSwaggerDoc
