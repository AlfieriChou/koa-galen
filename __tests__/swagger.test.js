const request = require('supertest')
const app = require('../server')
let server

beforeAll(() => {
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
})
