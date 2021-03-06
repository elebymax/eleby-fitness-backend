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
      logger('diary.validator.createDiary').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};

export const getDiary = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    id: Joi.string().uuid().required()
  });

  await Joi.validate(ctx.params, schema, async (err) => {
    if (err) {
      logger('diary.validator.getDiary').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};

export const modifyDiary = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    id: Joi.string().uuid().required()
  });

  await Joi.validate(ctx.params, schema, async (err) => {
    if (err) {
      logger('diary.validator.modifyDiary').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};

export const deleteDiary = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    id: Joi.string().uuid().required()
  });

  await Joi.validate(ctx.params, schema, async (err) => {
    if (err) {
      logger('diary.validator.deleteDiary').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};
