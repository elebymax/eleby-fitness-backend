import {Context} from "koa";
import Joi from 'joi';
import logger from '../../logger';
import BadRequestError from "../error/BadRequestError";

export const userRegister = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const schema = Joi.object().keys({
    name: Joi.string().max(45).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required()
  });

  await Joi.validate(ctx.request.body, schema, async (err) => {
    if (err) {
      logger('user.validator.userRegister').error(err);
      throw new BadRequestError(`The field '${err.details[0].context ? err.details[0].context.key : ''}' is not valid`, 400);
    }

    await next();
  });
};
