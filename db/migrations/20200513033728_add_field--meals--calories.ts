import * as Knex from "knex";

exports.up = async function(knex: Knex) {
  await knex.schema.alterTable('meals', function (t) {
    t.float('calories').defaultTo(0);
  });
};

exports.down = async function(knex: Knex) {
  await knex.schema.alterTable('users', function (t) {
    t.dropColumn('calories');
  });
};
