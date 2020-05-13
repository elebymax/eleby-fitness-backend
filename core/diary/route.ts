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
  validator.getDiary,
  controller.getDiary);

router.put('/:id',
  checkToken,
  validator.modifyDiary,
  controller.modifyDiary);

router.delete('/:id',
  checkToken,
  validator.deleteDiary,
  controller.deleteDiary);

export default router.middleware();
