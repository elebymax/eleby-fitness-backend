import {Context} from "koa";
import Joi from 'joi';
import logger from '../../logger';
import BadRequestError from "../error/BadRequestError";

export const createMeal = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    name: Joi.string().max(45).required(),
    carb: Joi.number().min(0).optional(),
    protein: Joi.number().min(0).optional(),
    fat: Joi.number().min(0).optional(),
    calories: Joi.number().min(0).optional()
  });

  await Joi.validate(ctx.request.body, schema, async (err) => {
    if (err) {
      logger('meal.validator.createMeal').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};

export const modifyMeal = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    id: Joi.string().uuid().required(),
    name: Joi.string().max(45).required(),
    carb: Joi.number().min(0).optional(),
    protein: Joi.number().min(0).optional(),
    fat: Joi.number().min(0).optional(),
    calories: Joi.number().min(0).optional()
  });

  await Joi.validate({
    id: ctx.params.id,
    ...ctx.request.body
  }, schema, async (err) => {
    if (err) {
      logger('meal.validator.modifyMeal').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};
