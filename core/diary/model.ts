import {Diary} from "./type";
import AppError from "../error/AppError";
import logger from '../../logger';
import {knex} from '../../db/asyncDB';
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

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

export const updateDiaryWithValueByParam = async (value: Diary, param: Diary): Promise<string | null> => {
  try {
    const query = knex
      .update(snakecaseKeys(value))
      .from('diaries')
      .where(snakecaseKeys(param))
      .returning('id');

    const [id]: string[] = await query;

    return id ? id : null;
  } catch (err) {
    logger('updateDiaryWithValueByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};
