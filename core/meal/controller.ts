import {Context} from "koa";
import {insertMeal, selectMealByParam} from "./model";
import * as utils from '../../utils';
import _ from 'lodash';
import BadRequestError from "../error/BadRequestError";
import {User} from "../user/type";
import {Meal} from "./type";
import {ResponseFormat} from "../error/type";

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
    throw new BadRequestError(`Meal's name already been used`, 400);
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
