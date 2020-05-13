import Router from "koa-router";
import * as controller from './controller';
import * as validator from './validator';
import {checkToken} from "../permission/controller";

const router = new Router({ prefix: '/diaries' });

router.post('/',
  checkToken,
  validator.createDiary,
  controller.createDiary);

router.get('/',
  checkToken,
  controller.listDiaries);

export default router.middleware();
