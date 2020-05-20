import Router from "koa-router";
import * as controller from './controller';
import * as validator from './validator';
import {checkToken} from "../permission/controller";

const router = new Router({ prefix: '/user' });

router.post('/',
  validator.userRegister,
  controller.userRegister);

router.post('/login',
  validator.userLogin,
  controller.userLogin);

router.get('/',
  checkToken,
  controller.getUserInfo);

router.patch('/password',
  checkToken,
  validator.changePassword,
  controller.changePassword);

export default router.middleware();
