'use strict';
let dbHost = process.env.DB_HOST || '127.0.0.1';
let dbPort = process.env.DB_PORT || 27017;
let dbName = 'androDB';


let port = process.env.PORT || 3000;

module.exports = {
  dbUrl: `mongodb://${dbHost}:${dbPort}/${dbName}`,
  port: port,
  welcome: `Server listening on ${port}`,
  jwt: {
    JWT_TOKEN_SIGNING_KEY: Buffer.from('xRjgFjvoJWbpx4v0uIrc', 'base64'),
    JWT_ALGORITHM: 'HS512',
    JWT_TOKEN_ISSUER:'AndroVideo',
    JWT_TOKEN_EXPIRATION_TIME: 60*60
  }
};