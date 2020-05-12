import Router from "koa-router";
import * as controller from './controller';
import * as validator from './validator';

const router = new Router({ prefix: '/user' });

router.post('/',
  validator.userRegister,
  controller.userRegister);

router.post('/login',
  validator.userLogin,
  controller.userLogin);

export default router.middleware();
