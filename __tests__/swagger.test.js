const request = require('supertest')
const config = require('../config')
const { initializeApp } = require('../framework')
let server

beforeAll(async () => {
  const app = await initializeApp(config)
  await app.loadMiddlewares(app)
  server = app.listen(4000)
})

describe('test swagger api!!', () => {
  it('test swagger.json!', async done => {
    const res = await request(server)
      .get('/v1/swagger.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
    expect(res.body).toHaveProperty('openapi', '3.0.0')
    expect(res.body).toHaveProperty('info')
    expect(res.body).toHaveProperty('paths')
    expect(res.body).toHaveProperty('components')
    done()
  })

  it('test apidoc!', async done => {
    await request(server)
      .get('/v1/apidoc')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
    done()
  })
})
