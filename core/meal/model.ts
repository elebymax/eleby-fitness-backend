import {Meal} from "./type";
import AppError from "../error/AppError";
import logger from '../../logger';
import {knex} from '../../db/asyncDB';
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import {QueryItem} from "../queryParser";
import {addCondition, addCountCondition} from "../queryParser/controller";
import {Diary} from "../diary/type";

export const insertMeal = async (meal: Meal): Promise<string> => {
  try {
    const query = knex
      .insert(snakecaseKeys(meal))
      .from('meals')
      .returning('id');

    const [id]: string[] = await query;

    return id;
  } catch (err) {
    logger('insertMeal')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const insertMeals = async (meals: Meal[]): Promise<string[]> => {
  try {
    const query = knex
      .insert(snakecaseKeys(meals))
      .from('meals')
      .returning('id');

    return await query;
  } catch (err) {
    logger('insertMeals')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectMealByParam = async (param: Meal): Promise<Meal | null> => {
  try {
    const query = knex
      .select('*')
      .from('meals')
      .where(snakecaseKeys(param));

    const [meal]: Meal[] = await query;

    return meal ? camelcaseKeys(meal) : null;
  } catch (err) {
    logger('selectMealByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectMealsByParam = async (param: Meal): Promise<Meal[] | null> => {
  try {
    const query = knex
      .select('*')
      .from('meals')
      .where(snakecaseKeys(param));

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectMealsByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectMealsByParamAndQueryItem = async (param: Meal, queryItem: QueryItem): Promise<Meal[] | null> => {
  try {
    let query = knex
      .select('*')
      .from('meals')
      .where(snakecaseKeys(param));

    query = await addCondition(query, queryItem);

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectMealsByParamAndQueryItem')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const countMealsByParamAndQueryItem = async (param: Diary, queryItem: QueryItem): Promise<number> => {
  try {
    let query = knex
      .count({count: '*'})
      .from('meals')
      .where(snakecaseKeys(param));

    query = await addCountCondition(query, queryItem);

    return +(await query)[0]['count'] || 0;
  } catch (err) {
    logger('countMealsByParamAndQueryItem')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectMealsByIdsAndParam = async (ids: string[], param: Meal): Promise<Meal[] | null> => {
  try {
    const query = knex
      .select('*')
      .from('meals')
      .whereIn('id', ids)
      .where(snakecaseKeys(param));

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectMealsByIdsAndParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const updateMealWithValueByParam = async (value: Meal, param: Meal): Promise<string | null> => {
  try {
    const query = knex
      .update(snakecaseKeys(value))
      .from('meals')
      .where(snakecaseKeys(param))
      .returning('id');

    const [id]: string[] = await query;

    return id ? id : null;
  } catch (err) {
    logger('updateMealWithValueByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};
