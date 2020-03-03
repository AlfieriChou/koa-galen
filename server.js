const { initializeApp } = require('./framework')
const config = require('./config')
const jwtVerifyMiddleware = require('./middleware/jwtVerify')
const authMiddleware = require('./middleware/auth')

const bootstrap = async () => {
  const app = initializeApp(config)
  const apiIndex = app.middlewareNames.indexOf('api')
  app.middlewareNames.splice(
    apiIndex, 0, 'auth', 'jwtVerify'
  )
  app.middlewareFuncs = {
    ...app.middlewareFuncs,
    auth: authMiddleware,
    jwtVerify: jwtVerifyMiddleware
  }
  await app.loadMiddlewares(app)
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`✅  The server is running at http://localhost:${config.port}`)
  })
}

bootstrap()
