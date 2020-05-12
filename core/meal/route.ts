import Router from "koa-router";
import * as controller from './controller';
import * as validator from './validator';
import {checkToken} from "../permission/controller";

const router = new Router({ prefix: '/meals' });

router.post('/',
  checkToken,
  validator.createMeal,
  controller.createMeal);

router.get('/',
  checkToken,
  controller.listMeals);

router.delete('/:id',
  checkToken,
  controller.deleteMeal);

export default router.middleware();
