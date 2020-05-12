import {Context} from "koa";
import {insertUser, selectUserByParam} from "./model";
import {ResponseFormat} from "../error/type";
import {User, UserWithToken} from "./type";
import * as utils from '../../utils';
import _ from 'lodash';
import BadRequestError from "../error/BadRequestError";
import jwt from 'jsonwebtoken';
import config from '../../config';

export const userRegister = async (ctx: Context) => {
  const {
    name,
    email,
    password
  } = ctx.request.body;

  //check is user name already been used
  const isUserNameDuplicate: boolean = !_.isEmpty(await selectUserByParam({
    name: name,
    deletedAt: null
  }));
  if (isUserNameDuplicate) {
    throw new BadRequestError(`User's name already been used`, 400);
  }

  //check is email name already been used
  const isUserEmailDuplicate: boolean = !_.isEmpty(await selectUserByParam({
    email: email,
    deletedAt: null
  }));
  if (isUserEmailDuplicate) {
    throw new BadRequestError(`User's email already been used`, 400);
  }

  //create user
  const insertedUserId: string = await insertUser({
    id: utils.generateUUID(),
    name,
    email,
    password: utils.encodePassword(password),
  });

  //find user
  const insertedUser: User = await selectUserByParam({
    id: insertedUserId,
    deletedAt: null
  });

  //create token
  const token: string = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60 * 7),
    data: { userId: insertedUser.id }
  }, config.app.jwtSecret);

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Register user successfully',
    data: <UserWithToken>{
      token: token,
      name: insertedUser.name,
      email: insertedUser.email,
      createdAt: insertedUser.createdAt
    }
  }
};
