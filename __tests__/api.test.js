const request = require('supertest')
const config = require('../config')
const { initializeApp } = require('../framework')
let server

const user = {
  nickname: 'testUser',
  phone: '13577778888',
  password: 'password'
}

let ACCESS_TOKEN
let USER_ID
let ROLE_ID

beforeAll(async () => {
  const app = await initializeApp(config)
  await app.loadMiddleWares(app)
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

  it('test apiDoc!', async done => {
    await request(server)
      .get('/v1/apiDoc')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
    done()
  })
})

describe('test user api!!', () => {
  it('test register!', async done => {
    const userRes = await request(server)
      .get(`/v1/user?where={"phone":"${user.phone}"}&limit=20&offset=0`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
    expect(userRes.body.result.data.length).toBe(0)
    const res = await request(server)
      .post('/v1/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
    expect(res.body.result).toHaveProperty('id')
    expect(res.body.result).toHaveProperty('phone')
    expect(res.body.result).toHaveProperty('createdAt')
    expect(res.body.result).toHaveProperty('updatedAt')
    expect(res.body.result.phone).toBe(user.phone)
    done()
  })

  it('test login!', async (done) => {
    const res = await request(server)
      .post('/v1/login')
      .send({
        phone: user.phone,
        password: user.password
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
    expect(res.body.result).toHaveProperty('user')
    expect(res.body.result).toHaveProperty('token')
    ACCESS_TOKEN = res.body.result.token
    USER_ID = res.body.result.user.id
    done()
  })
})

describe('test delete user!!', () => {
  it('test destroy user!', async (done) => {
    const res = await request(server)
      .delete(`/v1/user/${USER_ID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
    expect(res.body.result).toBe(1)
    done()
  })
})
