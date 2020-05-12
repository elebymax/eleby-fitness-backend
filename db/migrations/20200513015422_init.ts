import * as Knex from "knex";

exports.up = async function(knex: Knex) {
  await knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().notNullable();
    table.string('name', 45);
    table.string('email', 255);
    table.string('password', 255);
    table.timestamp('created_at', {useTz: true});
    table.timestamp('updated_at', {useTz: true});
    table.timestamp('deleted_at', {useTz: true});
  });

  await knex.schema.createTable('meals', function (table) {
    table.uuid('id').primary().notNullable();
    table.uuid('user_id').notNullable();
    table.string('name', 45);
    table.float('carb').defaultTo(0);
    table.float('protein').defaultTo(0);
    table.float('fat').defaultTo(0);
    table.timestamp('created_at', {useTz: true});
    table.timestamp('updated_at', {useTz: true});
    table.timestamp('deleted_at', {useTz: true});
  });

  await knex.schema.createTable('diaries', function (table) {
    table.uuid('id').primary().notNullable();
    table.uuid('user_id').notNullable();
    table.string('title', 45);
    table.string('content', 500);
    table.timestamp('created_at', {useTz: true});
    table.timestamp('updated_at', {useTz: true});
    table.timestamp('deleted_at', {useTz: true});
  });

  await knex.schema.createTable('diary_meal_refs', function (table) {
    table.uuid('id').primary().notNullable();
    table.uuid('diary_id');
    table.uuid('meal_id');
    table.timestamp('created_at', {useTz: true});
    table.timestamp('updated_at', {useTz: true});
    table.timestamp('deleted_at', {useTz: true});
  });
};

exports.down = async function(knex: Knex) {
  await knex.schema.dropTable('diary_meal_refs');
  await knex.schema.dropTable('diaries');
  await knex.schema.dropTable('meals');
  await knex.schema.dropTable('users');
};
