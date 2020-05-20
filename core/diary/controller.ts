import {Context} from "koa";
import {
  countDiariesByParamAndQueryItem,
  insertDiary,
  selectDiariesByParamAndQueryItem,
  selectDiaryByParam, updateDiariesWithValueByParam
} from "./model";
import * as utils from '../../utils';
import _ from 'lodash';
import BadRequestError from "../error/BadRequestError";
import {User} from "../user/type";
import {Diary, DiaryWithMeal} from "./type";
import {ResponseFormat} from "../error/type";
import NotFoundError from "../error/NotFoundError";
import {DiaryMealRef} from "../diaryMealRef/type";
import {selectMealsByIdsAndParam} from "../meal/model";
import {
  insertDiaryMealRefs,
  selectDiaryMealRefsByDiaryIdsAndParam,
  selectDiaryMealRefsByParam, updateDiaryMealRefsWithValueByParam
} from "../diaryMealRef/model";
import {Meal} from "../meal/type";
import {QueryItem} from "../queryParser";

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
    throw new BadRequestError(`The name of diary is already been used`, 400);
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
    message: 'The diary have been successfully created',
    data: <DiaryWithMeal>{
      ...diary,
      meals: meals
    }
  }
};

export const listDiaries = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;
  const queryItem: QueryItem = ctx.queryItem;

  //find diaries
  const diaries: Diary[] = await selectDiariesByParamAndQueryItem({
    userId: user.id,
    deletedAt: null,
  }, queryItem);
  if (!diaries || !diaries.length) {
    ctx.status = 200;
    ctx.body = <ResponseFormat>{
      success: true,
      message: 'The diaries have been successfully listed',
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

  //get total count
  const total: number = await countDiariesByParamAndQueryItem({
    userId: user.id,
    deletedAt: null,
  }, queryItem);

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'The diaries have been successfully listed',
    data: formatedDiaries,
    paginate: {
      total: total
    }
  };
  return;
};

export const getDiary = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;
  const id: string = ctx.params.id;

  //find diary
  const diary: Diary = await selectDiaryByParam({
    id: id,
    userId: user.id,
    deletedAt: null
  });
  if (!diary) {
    throw new NotFoundError('The Diary is not existed', 404);
  }

  //find refs
  const diaryMealRefs: DiaryMealRef[] = await selectDiaryMealRefsByParam({
    diaryId: diary.id,
    deletedAt: null
  });
  if (!diaryMealRefs || !diaryMealRefs.length) {
    ctx.status = 200;
    ctx.body = <ResponseFormat>{
      success: true,
      message: 'The diary has been successfully fetched',
      data: <DiaryWithMeal>{
        ...diary,
        meals: []
      }
    };
    return;
  }

  //find meals
  const mealIds: string[] = _.chain(diaryMealRefs).map('mealId').uniq().value();
  const meals: Meal[] = await selectMealsByIdsAndParam(mealIds, {
    deletedAt: null
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'The diary have been successfully fetched',
    data: <DiaryWithMeal>{
      ...diary,
      meals: meals
    }
  };
};

export const modifyDiary = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;
  const id: string = ctx.params.id;
  const {
    title,
    content,
    mealIds
  } = ctx.request.body;

  //find diary
  const previousDiary: Diary = await selectDiaryByParam({
    id: id,
    userId: user.id,
    deletedAt: null
  });
  if (!previousDiary) {
    throw new NotFoundError('The Diary is not existed', 404);
  }

  //update diary
  const newDiaryData: Diary = _.omitBy({
    title,
    content
  }, _.isNil);
  await updateDiariesWithValueByParam(newDiaryData, {
    id: id
  });

  //find refs
  const previousDiaryMealRefs: DiaryMealRef[] = await selectDiaryMealRefsByParam({
    diaryId: id,
    deletedAt: null
  });
  const previousMealIds: string[] = _.chain(previousDiaryMealRefs).map('mealId').uniq().value();

  //create refs
  const willBeCreatedMealIds: string[] = _.difference(mealIds, previousMealIds);
  const formatedDiaryMealRefs: DiaryMealRef[] = willBeCreatedMealIds.map((willBeCreatedMealId: string) => {
    return <DiaryMealRef>{
      id: utils.generateUUID(),
      diaryId: id,
      mealId: willBeCreatedMealId
    }
  });
  await insertDiaryMealRefs(formatedDiaryMealRefs);

  //delete refs
  const willBeDeletedMealIds: string[] = _.difference(previousMealIds, mealIds);
  for (let i=0; i<willBeDeletedMealIds.length; i++) {
    await updateDiaryMealRefsWithValueByParam({
      deletedAt: utils.generateTimestampTz()
    }, {
      diaryId: id,
      mealId: willBeDeletedMealIds[i],
      deletedAt: null
    })
  }

  //find new diary
  const targetDiary: Diary = await selectDiaryByParam({
    id: id
  });

  //find refs
  const diaryMealRefs: DiaryMealRef[] = await selectDiaryMealRefsByParam({
    diaryId: targetDiary.id,
    deletedAt: null
  });
  if (!diaryMealRefs || !diaryMealRefs.length) {
    ctx.status = 200;
    ctx.body = <ResponseFormat>{
      success: true,
      message: 'The diary has been successfully modified',
      data: <DiaryWithMeal>{
        ...targetDiary,
        meals: []
      }
    };
    return;
  }

  //find meals
  const targetMealIds: string[] = _.chain(diaryMealRefs).map('mealId').uniq().value();
  const targetMeal: Meal[] = await selectMealsByIdsAndParam(targetMealIds, {
    deletedAt: null
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'The diary has been successfully modified',
    data: <DiaryWithMeal>{
      ...targetDiary,
      meals: targetMeal
    }
  };
};

export const deleteDiary = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;
  const id: string = ctx.params.id;

  //find diary
  const diary: Diary = await selectDiaryByParam({
    id: id,
    userId: user.id,
    deletedAt: null
  });
  if (!diary) {
    throw new NotFoundError('The Diary is not existed', 404);
  }

  //delete diary
  await updateDiariesWithValueByParam({
    deletedAt: utils.generateTimestampTz()
  }, {
    id: id,
    deletedAt: null
  });

  //delete refs
  await updateDiaryMealRefsWithValueByParam({
    deletedAt: utils.generateTimestampTz()
  }, {
    diaryId: id,
    deletedAt: null
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'The diary has been successfully deleted',
    data: {}
  };
};
