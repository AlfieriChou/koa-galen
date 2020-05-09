const {
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_USER,
  MYSQL_PORT
} = process.env

module.exports = {
  mysql: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: 'test',
    port: parseInt(MYSQL_PORT, 10)
  },
  port: process.env.PORT || 3000
}
