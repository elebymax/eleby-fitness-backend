import {Context} from "koa";
import {insertUser, selectUserByParam, updateUsersWithValueByParam} from "./model";
import {ResponseFormat} from "../error/type";
import {User, UserWithToken} from "./type";
import * as utils from '../../utils';
import _ from 'lodash';
import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";

export const userRegister = async (ctx: Context): Promise<void> => {
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

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'User has been successfully created',
    data: <UserWithToken>{
      token: utils.generateToken(insertedUser.id),
      name: insertedUser.name,
      email: insertedUser.email,
      createdAt: insertedUser.createdAt
    }
  }
};

export const userLogin = async (ctx: Context): Promise<void> => {
  const {
    email,
    password
  } = ctx.request.body;

  const user: User = await selectUserByParam({
    email: email,
    password: utils.encodePassword(password),
    deletedAt: null
  });

  if (!user) {
    throw new NotFoundError('Email or password is not correct', 404);
  }

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: 'Login successfully',
    data: <UserWithToken>{
      token: utils.generateToken(user.id),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  }
};

export const getUserInfo = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: `User info has been successfully fetched`,
    data: <UserWithToken>{
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  }
};

export const changePassword = async (ctx: Context): Promise<void> => {
  const user: User = ctx.user;
  const password: string = ctx.request.body.password;

  await updateUsersWithValueByParam({
    password: utils.encodePassword(password),
    updatedAt: utils.generateTimestampTz()
  }, {
    id: user.id
  });

  ctx.status = 200;
  ctx.body = <ResponseFormat>{
    success: true,
    message: `The password has been successfully changed`,
    data: {}
  }
};
