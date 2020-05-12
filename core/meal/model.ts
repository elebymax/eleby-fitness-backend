import {Meal} from "./type";
import AppError from "../error/AppError";
import logger from '../../logger';
import {knex} from '../../db/asyncDB';
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

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

    return camelcaseKeys(await query);
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
