import {Diary} from "./type";
import AppError from "../error/AppError";
import logger from '../../logger';
import {knex} from '../../db/asyncDB';
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import {QueryItem} from "../queryParser";
import {addCondition, addCountCondition} from "../queryParser/controller";

export const insertDiary = async (diary: Diary): Promise<string> => {
  try {
    const query = knex
      .insert(snakecaseKeys(diary))
      .from('diaries')
      .returning('id');

    const [id]: string[] = await query;

    return id;
  } catch (err) {
    logger('insertDiary')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const insertDiaries = async (diaries: Diary[]): Promise<string[]> => {
  try {
    const query = knex
      .insert(snakecaseKeys(diaries))
      .from('diaries')
      .returning('id');

    return await query;
  } catch (err) {
    logger('insertDiaries')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectDiaryByParam = async (param: Diary): Promise<Diary | null> => {
  try {
    const query = knex
      .select('*')
      .from('diaries')
      .where(snakecaseKeys(param));

    const [diary]: Diary[] = await query;

    return diary ? camelcaseKeys(diary) : null;
  } catch (err) {
    logger('selectDiaryByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectDiariesByParam = async (param: Diary): Promise<Diary[] | null> => {
  try {
    const query = knex
      .select('*')
      .from('diaries')
      .where(snakecaseKeys(param));

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectDiariesByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectDiariesByIdsAndParam = async (ids: string[], param: Diary): Promise<Diary[] | null> => {
  try {
    const query = knex
      .select('*')
      .from('diaries')
      .whereIn('id', ids)
      .where(snakecaseKeys(param));

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectDiariesByIdsAndParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectDiariesByParamAndQueryItem = async (param: Diary, queryItem: QueryItem): Promise<Diary[] | null> => {
  try {
    let query = knex
      .select('*')
      .from('diaries')
      .where(snakecaseKeys(param));

    query = await addCondition(query, queryItem);

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectDiariesByParamAndQueryItem')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const countDiariesByParamAndQueryItem = async (param: Diary, queryItem: QueryItem): Promise<number> => {
  try {
    let query = knex
      .count({count: '*'})
      .from('diaries')
      .where(snakecaseKeys(param));

    query = await addCountCondition(query, queryItem);

    return +(await query)[0]['count'] || 0;
  } catch (err) {
    logger('countDiariesByParamAndQueryItem')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const updateDiariesWithValueByParam = async (value: Diary, param: Diary): Promise<string[] | null> => {
  try {
    const query = knex
      .update(snakecaseKeys(value))
      .from('diaries')
      .where(snakecaseKeys(param))
      .returning('id');

    return await query;
  } catch (err) {
    logger('updateDiariesWithValueByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};
