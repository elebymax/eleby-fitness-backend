import {Context} from "koa";
import {insertMeal, selectMealByParam, selectMealsByParam, updateMealWithValueByParam} from "./model";
import * as utils from '../../utils';
import _ from 'lodash';
import BadRequestError from "../error/BadRequestError";
import {User} from "../user/type";
import {Meal} from "./type";
import {ResponseFormat} from "../error/type";
import NotFoundError from "../error/NotFoundError";

export const createMeal = async (ctx: Context): Promise<void> => {
  const user: User  = ctx.user;

  const {
    name,
    carb,
    protein,
    fat,
    calories,
  } = ctx.request.body;

  //check is meal name already been used
  const isMealNameDuplicate: boolean = !_.isEmpty(await selectMealByParam({
    userId: user.id,
    name: name,
    deletedAt: null
  }));
  if (isMealNameDuplicate) {
    throw new BadRequestError(`The meal's name is already been used`, 400);
  }

  //insert meal
  const insertedMealId: string = await insertMeal({
    id: utils.generateUUID(),
    userId: user.id,
    name,
    carb,
    protein,
    fat,
    calories,
  });

  //find meal
  const meal: Meal = await selectMealByParam({
    id: insertedMealId
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Creating meal successfully',
    data: meal
  }
};

export const listMeals = async (ctx: Context): Promise<void> => {
  const user: User  = ctx.user;

  const meals: Meal[] = await selectMealsByParam({
    userId: user.id,
    deletedAt: null,
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Listing meals successfully',
    data: _.orderBy(meals, ['createdAt'], ['desc'])
  }
};

export const deleteMeal = async (ctx: Context): Promise<void> => {
  const user: User  = ctx.user;
  const mealId: string = ctx.params.id;

  //check if meal is existed
  const meal: Meal = await selectMealByParam({
    id: mealId,
    userId: user.id,
    deletedAt: null,
  });
  if (!meal) {
    throw new NotFoundError('The meal is not existed', 404);
  }

  //soft delete the meal
  await updateMealWithValueByParam({
    deletedAt: utils.generateTimestampTz()
  }, {
    id: mealId,
    deletedAt: null
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Deleting meal successfully',
    data: {}
  }
};

export const modifyMeal = async (ctx: Context): Promise<void> => {
  const user: User  = ctx.user;
  const mealId: string = ctx.params.id;
  const {
    name,
    calories,
    carb,
    protein,
    fat
  } = ctx.request.body;

  //check is meal name already been used
  const isMealNameDuplicate: boolean = !_.isEmpty(await selectMealByParam({
    userId: user.id,
    name: name,
    deletedAt: null
  }));
  if (isMealNameDuplicate) {
    throw new BadRequestError(`The meal's name is already been used`, 400);
  }

  //check if meal is existed
  const meal: Meal = await selectMealByParam({
    id: mealId,
    userId: user.id,
    deletedAt: null,
  });
  if (!meal) {
    throw new NotFoundError('The meal is not existed', 404);
  }

  //update meal
  await updateMealWithValueByParam(_.omitBy({
    name,
    calories,
    carb,
    protein,
    fat,
    updatedAt: utils.generateTimestampTz()
  }, _.isNil), {
    id: mealId
  });

  //find meal
  const targetMeal: Meal = await selectMealByParam({
    id: mealId
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'The Meal has been successfully modified',
    data: targetMeal
  }
};
