import Knex from 'knex';
import config from '../config';

export const knex = Knex({
  client: 'pg',
  connection: config.postgres
});

const query = (sql: string, values: any) => {
  return knex.raw(sql, values);
};

export default {
  knex,
  query
}
