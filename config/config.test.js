const {
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_USER
} = process.env

module.exports = {
  mysql: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: 'test'
  },
  port: process.env.PORT || 7000
}
