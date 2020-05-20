import {User} from "./type";
import AppError from "../error/AppError";
import logger from '../../logger';
import {knex} from '../../db/asyncDB';
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import {Meal} from "../meal/type";

export const insertUser = async (user: User): Promise<string> => {
  try {
    const query = knex
      .insert(snakecaseKeys(user))
      .from('users')
      .returning('id');

    const [id]: string[] = await query;

    return id;
  } catch (err) {
    logger('insertStudents')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectUserByParam = async (param: User): Promise<User | null> => {
  try {
    const query = knex
      .select('*')
      .from('users')
      .where(snakecaseKeys(param));

    const [user]: User[] = await query;

    return user ? camelcaseKeys(user) : null;
  } catch (err) {
    logger('selectUserByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const updateUsersWithValueByParam = async (value: User, param: User): Promise<string[]> => {
  try {
    const query = knex
      .update(snakecaseKeys(value))
      .from('users')
      .where(snakecaseKeys(param))
      .returning('id');

    return await query;
  } catch (err) {
    logger('updateUsersWithValueByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};
