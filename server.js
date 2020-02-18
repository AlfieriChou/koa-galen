const { app } = require('./framework')
const config = require('./config')

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`✅  The server is running at http://localhost:${config.port}`)
})
