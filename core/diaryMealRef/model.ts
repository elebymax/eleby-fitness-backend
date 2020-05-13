import {DiaryMealRef} from "./type";
import {knex} from "../../db/asyncDB";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import logger from "../../logger";
import AppError from "../error/AppError";

export const insertDiaryMealRefs = async (diaryMealRefs: DiaryMealRef[]): Promise<string[]> => {
  try {
    const query = knex
      .insert(snakecaseKeys(diaryMealRefs))
      .from('diary_meal_refs')
      .returning('id');

    return await query;
  } catch (err) {
    logger('insertDiaryMealRefs')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectDiaryMealRefsByParam = async (param: DiaryMealRef): Promise<DiaryMealRef[] | null> => {
  try {
    const query = knex
      .select('*')
      .from('diary_meal_refs')
      .where(snakecaseKeys(param));

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectDiaryMealRefsByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const selectDiaryMealRefsByDiaryIdsAndParam = async (diaryIds: string[], param: DiaryMealRef): Promise<DiaryMealRef[] | null> => {
  try {
    const query = knex
      .select('*')
      .from('diary_meal_refs')
      .whereIn('diary_id', diaryIds)
      .where(snakecaseKeys(param));

    return camelcaseKeys(await query);
  } catch (err) {
    logger('selectDiaryMealRefsByDiaryIdsAndParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};

export const updateDiaryMealRefsWithValueByParam = async (value: DiaryMealRef, param: DiaryMealRef): Promise<string | null> => {
  try {
    const query = knex
      .update(snakecaseKeys(value))
      .from('diary_meal_refs')
      .where(snakecaseKeys(param))
      .returning('id');

    const [id]: string[] = await query;

    return id ? id : null;
  } catch (err) {
    logger('updateDiaryMealRefsWithValueByParam')
      .error(JSON.stringify({message: 'Something wrong when executing SQL query', properties: err}, null, 2));
    throw new AppError('Internal server error', 500);
  }
};
