// Module type is needed here because of Sequelize cli
// eslint-disable-next-line @typescript-eslint/no-var-requires
const configJson = require('./env.json');

module.exports = {
  ...configJson,
  server: {
    ...configJson.server,
    port: process.env.PORT || configJson.server.port,
    env: process.env.ENV || configJson.server.env,
  },
  smtpServer: {
    ...configJson.smtpServer,
    host: process.env.SMTP_HOST || configJson.smtpServer.host,
    port: process.env.SMTP_PORT || configJson.smtpServer.port,
    username: process.env.SMTP_APIKEY_PUBLIC || configJson.smtpServer.username,
    password: process.env.SMTP_APIKEY_PRIVATE || configJson.smtpServer.password,
  },
  dbData: {
    ...configJson.dbData,
    username: process.env.DB_USER || configJson.dbData.username,
    password: process.env.DB_PASS || configJson.dbData.password,
    database: process.env.DB_DATABASE || configJson.dbData.database,
    host: process.env.DB_HOST || configJson.dbData.host,
    dialect: process.env.DB_DRIVER || configJson.dbData.dialect,
  },
};
