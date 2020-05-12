import * as Knex from "knex";

exports.up = async function(knex: Knex) {
  await knex.schema.alterTable('users', function (t) {
    t.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
    t.timestamp('updated_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
  });

  await knex.schema.alterTable('meals', function (t) {
    t.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
    t.timestamp('updated_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
  });

  await knex.schema.alterTable('diaries', function (t) {
    t.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
    t.timestamp('updated_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
  });

  await knex.schema.alterTable('diary_meal_refs', function (t) {
    t.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
    t.timestamp('updated_at', {useTz: true}).defaultTo(knex.fn.now()).alter();
  });
};

exports.down = async function(knex: Knex) {
  await knex.schema.alterTable('users', function (t) {
    t.timestamp('created_at', {useTz: true}).alter();
    t.timestamp('updated_at', {useTz: true}).alter();
  });

  await knex.schema.alterTable('meals', function (t) {
    t.timestamp('created_at', {useTz: true}).alter();
    t.timestamp('updated_at', {useTz: true}).alter();
  });

  await knex.schema.alterTable('diaries', function (t) {
    t.timestamp('created_at', {useTz: true}).alter();
    t.timestamp('updated_at', {useTz: true}).alter();
  });

  await knex.schema.alterTable('diary_meal_refs', function (t) {
    t.timestamp('created_at', {useTz: true}).alter();
    t.timestamp('updated_at', {useTz: true}).alter();
  });
};
