import {Context} from "koa";
import {insertUser, selectUserByParam} from "./model";
import {ResponseFormat} from "../error/type";
import {User} from "./type";
import * as utils from '../../utils';

export const userRegister = async (ctx: Context) => {
  const {
    name,
    email,
    password
  } = ctx.request.body;

  const insertedUserId: string = await insertUser({
    id: utils.generateUUID(),
    name,
    email,
    password: utils.encodePassword(password),
  });

  const insertedUser: User = await selectUserByParam({
    id: insertedUserId,
    deletedAt: null
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Register user successfully',
    data: <User>{
      name: insertedUser.name,
      email: insertedUser.email,
      createdAt: insertedUser.createdAt
    }
  }
};
