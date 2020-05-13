import {Context} from "koa";
import {insertDiary, selectDiariesByIdsAndParam, selectDiariesByParam, selectDiaryByParam} from "./model";
import * as utils from '../../utils';
import _ from 'lodash';
import BadRequestError from "../error/BadRequestError";
import {User} from "../user/type";
import {Diary, DiaryWithMeal} from "./type";
import {ResponseFormat} from "../error/type";
import NotFoundError from "../error/NotFoundError";
import {DiaryMealRef} from "../diaryMealRef/type";
import {selectMealsByIdsAndParam} from "../meal/model";
import {insertDiaryMealRefs, selectDiaryMealRefsByDiaryIdsAndParam} from "../diaryMealRef/model";
import {Meal} from "../meal/type";

export const createDiary = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;

  const {
    title,
    content,
    mealIds
  } = ctx.request.body;

  //check is diary name already been used
  const isDiaryNameDuplicate: boolean = !_.isEmpty(await selectDiaryByParam({
    userId: user.id,
    title: title,
    deletedAt: null
  }));
  if (isDiaryNameDuplicate) {
    throw new BadRequestError(`Diary's name already been used`, 400);
  }

  //check if meals are belongs to user
  const foundMeals: Meal[] = await selectMealsByIdsAndParam(mealIds, {
    deletedAt: null
  });
  if (foundMeals.length !== mealIds.length) {
    throw new NotFoundError('The meals are not existed', 404);
  }

  //insert diary
  const insertedDiaryId: string = await insertDiary({
    id: utils.generateUUID(),
    userId: user.id,
    title,
    content
  });
  //find diary
  const diary: Diary = await selectDiaryByParam({
    id: insertedDiaryId
  });

  //insert diary meal ref
  const formatedDiaryMealRefs: DiaryMealRef[] = mealIds.map((mealId: string) => {
    return <DiaryMealRef>{
      id: utils.generateUUID(),
      diaryId: insertedDiaryId,
      mealId: mealId
    }
  });
  await insertDiaryMealRefs(formatedDiaryMealRefs);
  //find meals
  const meals: Meal[] = await selectMealsByIdsAndParam(mealIds, {});

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Creating diary successfully',
    data: <DiaryWithMeal>{
      ...diary,
      meals: meals
    }
  }
};

export const listDiaries = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;

  //find diaries
  const diaries: Diary[] = await selectDiariesByParam({
    userId: user.id,
    deletedAt: null,
  });
  if (!diaries || !diaries.length) {
    ctx.status = 200;
    ctx.body = <ResponseFormat>{
      success: true,
      message: 'Listing diaries successfully',
      data: []
    };
    return;
  }

  //find refs
  const diaryIds: string[] = _.chain(diaries).map('id').uniq().value();
  const diaryMealRefs: DiaryMealRef[] = await selectDiaryMealRefsByDiaryIdsAndParam(diaryIds, {
    deletedAt: null
  });
  const groupedRefs: { [key: string]: DiaryMealRef[] } = _.groupBy(diaryMealRefs, 'diaryId');

  //find meals
  const mealIds: string[] = _.chain(diaryMealRefs).map('mealId').uniq().value();
  const meals: Meal[] = await selectMealsByIdsAndParam(mealIds, {
    deletedAt: null
  });
  const keyedMeal: { [key: string]: Meal } = _.keyBy(meals, 'id');

  //format response data
  const formatedDiaries: DiaryWithMeal[] = diaries.map((diary: Diary) => {
    const refs: DiaryMealRef[] = groupedRefs[diary.id];
    return <DiaryWithMeal>{
      ...diary,
      meals: refs && refs.length ? refs.filter((diaryMealRef: DiaryMealRef) => {
        return !!keyedMeal[diaryMealRef.mealId];
      }).map((diaryMealRef: DiaryMealRef) => {
        return keyedMeal[diaryMealRef.mealId]
      }) : [],
    }
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Listing diaries successfully',
    data: formatedDiaries
  };
  return;
};
