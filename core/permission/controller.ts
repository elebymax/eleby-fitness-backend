import {Context} from "koa";
import jwt from 'jsonwebtoken';
import UnauthorizedError from "../error/UnauthorizedError";
import config from '../../config';
import BadRequestError from "../error/BadRequestError";
import {selectUserByParam} from "../user/model";
import {User} from "../user/type";
import NotFoundError from "../error/NotFoundError";

export const checkToken = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const token: string = ctx.request.header.authorization;

  if (!token) {
    throw new UnauthorizedError('Token cannot be empty', 401);
  }

  let userId: string = '';
  try {
    const decode: any = jwt.verify(token, config.app.jwtSecret);
    userId = decode.data.userId;
  } catch (e) {
    throw new BadRequestError('Token is invalid', 400);
  }

  const user: User = await selectUserByParam({
    id: userId,
    deletedAt: null
  });
  if (!user) {
    throw new NotFoundError('User already been deleted', 404);
  }

  ctx.user = user;

  await next();
};
