import Router from "koa-router";
import * as controller from './controller';
import * as validator from './validator';

const router = new Router({ prefix: '/users' });

router.post('/',
  validator.userRegister,
  controller.userRegister);

export default router.middleware();
