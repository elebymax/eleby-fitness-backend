import Router from "koa-router";
import * as controller from './controller';
import * as validator from './validator';
import {checkToken} from "../permission/controller";
import {parse} from "../queryParser/controller";

const router = new Router({ prefix: '/diaries' });

router.post('/',
  checkToken,
  validator.createDiary,
  controller.createDiary);

router.get('/',
  checkToken,
  parse,
  controller.listDiaries);

router.get('/:id',
  checkToken,
  controller.getDiary);

export default router.middleware();
