import {Context} from "koa";
import Joi from 'joi';
import logger from '../../logger';
import BadRequestError from "../error/BadRequestError";

export const createDiary = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    title: Joi.string().max(45).required(),
    content: Joi.string().max(500).allow('').optional(),
    mealIds: Joi.array().items(
      Joi.string().uuid().required()
    ).required()
  });

  await Joi.validate(ctx.request.body, schema, async (err) => {
    if (err) {
      logger('meal.validator.createDiary').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};
