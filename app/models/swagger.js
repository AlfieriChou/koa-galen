module.exports = {
  remoteMethods: {
    index: {
      path: '/apidoc',
      method: 'get',
      tags: ['swagger'],
      summary: 'api文档',
      output: {
        304: {
          type: 'html'
        }
      }
    },
    doc: {
      path: '/swagger.json',
      method: 'get',
      tags: ['swagger'],
      summary: 'swagger json 数据文档',
      output: {
        200: {
          type: 'object',
          result: {
            openapi: { type: 'string' },
            info: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                version: { type: 'string' },
                contact: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    url: { type: 'string' }
                  }
                },
                license: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    url: { type: 'string' }
                  }
                }
              }
            },
            paths: { type: 'object' },
            components: { type: 'object' }
          }
        }
      }
    }
  }
}
