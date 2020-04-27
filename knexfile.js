// Update with your config settings.
require('ts-node/register');

const config = require('./config').default;

module.exports = {

  development: {
    client: 'pg',
    connection: config.postgres,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./db/migrations"
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: config.postgres,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./db/migrations"
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};
