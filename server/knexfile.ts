import dotenv from 'dotenv';
import fs from 'fs'
let env = dotenv.parse(fs.readFileSync('.env'));
// Update with your config settings.

let configs = {
  development: {
    client: 'pg',
    connection: {
      database: env.DB_NAME,
      host: env.DB_HOST,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      multipleStatements: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

module.exports = configs;
export default configs;

