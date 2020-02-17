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
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200)
    expect(res.text).toEqual('hello world')
    done()
  })

  it('test apidoc!', async done => {
    const res = await request(server)
      .get('/v1/swagger.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200)
    expect(res.text).toEqual('hello world')
    done()
  })
})
